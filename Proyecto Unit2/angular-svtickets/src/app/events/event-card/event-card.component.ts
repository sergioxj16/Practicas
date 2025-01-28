import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { EventsService } from '../services/events.service';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { RouterLink } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/myevent';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    selector: 'event-card',
    imports: [DatePipe, IntlCurrencyPipe, RouterLink, NgClass],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {
    #eventsService = inject(EventsService);
    #destroyRef = inject(DestroyRef);

    event = input.required<MyEvent>();
    deleted = output<number>();
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
            .deleteEvent(this.event().id!).pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => this.deleted.emit(this.event().id!));
    }
}
