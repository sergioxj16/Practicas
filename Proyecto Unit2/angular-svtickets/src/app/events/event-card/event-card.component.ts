import { Component, inject, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { EventsService } from '../services/events.service';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { Router, RouterLink } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/myevent';


@Component({
    selector: 'event-card',
    imports: [DatePipe, IntlCurrencyPipe, RouterLink, NgClass],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {
    #eventsService = inject(EventsService);
    #router = inject(Router);

    event = input.required<MyEvent>();
    deleted = output<void>();
    attend = output<void>();

    ToggleAttendEvent() {
        if (this.event().attend) {
            this.#eventsService.deleteAttend(this.event().id!).pipe().subscribe(() => this.attend.emit());
            this.event().attend = false;
            this.event().numAttend--;

        } else {
            this.#eventsService.postAttend(this.event().id!).pipe().subscribe(() => this.attend.emit());
            this.event().attend = true;
            this.event().numAttend++;
        }
    }

    deleteEvent() {
        this.#eventsService
            .deleteEvent(this.event().id!)
        this.#router.navigate(['/events']);
    }
}
