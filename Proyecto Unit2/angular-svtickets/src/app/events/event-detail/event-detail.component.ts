import { Component, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { EventCardComponent } from '../event-card/event-card.component';
import { MyEvent } from '../../shared/interfaces/myevent';
import { EventsService } from '../services/events.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../shared/interfaces/user';
import { SingleCommentResponse } from '../../shared/interfaces/responses';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';

@Component({
    selector: 'event-detail',
    imports: [EventCardComponent, OlMapDirective, OlMarkerDirective, ReactiveFormsModule, RouterLink],
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {

    #title = inject(Title);
    #router = inject(Router);
    #eventService = inject(EventsService);
    #fb = inject(NonNullableFormBuilder);

    event = input.required<MyEvent>();

    attendees = signal<User[]>([]);
    comments = signal<SingleCommentResponse[]>([]);

    commentForm = this.#fb.group({
        message: ['', Validators.required],
    });

    constructor() {
        this.updatePageTitleAndData();
    }

    updatePageTitleAndData() {
        effect(() => {
            const currentEvent = this.event();
            if (currentEvent) {
                this.#title.setTitle(`${currentEvent.title} | Angular Events`);
                this.loadAttendeesAndComments(currentEvent.id);
            }
        });
    }

    loadAttendeesAndComments(eventId: number) {
        this.loadAttendees(eventId);
        this.loadComments(eventId);
    }

    loadAttendees(eventId: number) {
        this.#eventService
            .getAttendees(eventId)
            .pipe()
            .subscribe((attendeesList: User[]) => {
                this.attendees.set(attendeesList);
            });
    }

    loadComments(eventId: number) {
        this.#eventService
            .getComments(eventId)
            .pipe()
            .subscribe((commentResponse) => {
                this.comments.set(commentResponse.comments);
            });
    }

    updateInfo() {
        this.loadAttendeesAndComments(this.event().id);
    }

    sendComment() {
        const commentText = this.commentForm.getRawValue().message;

        this.#eventService
            .postComment(this.event().id, commentText)
            .pipe()
            .subscribe((newComment) => {
                this.comments.update((existingComments) => [...existingComments, newComment]);
            });

        this.commentForm.reset();
    }

    goBack() {
        this.#router.navigate(['/events']);
    }
}
