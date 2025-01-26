import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { RouterLink } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/myevent';

@Component({
    selector: 'event-card',
    imports: [DatePipe, IntlCurrencyPipe, RouterLink],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  event = input.required<MyEvent>();
  deleted = output<void>();

  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);

  deleteEvent() {
    this.#eventsService
      .deleteEvent(this.event().id!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.deleted.emit());
  }
}
