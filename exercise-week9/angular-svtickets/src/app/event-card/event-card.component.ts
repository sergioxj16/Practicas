import { Component, input, output, inject, DestroyRef } from '@angular/core';
import { MyEvent } from '../interfaces/my-event';
import { DatePipe } from '@angular/common';
import { IntlCurrencyPipe } from '../pipes/intl-currency.pipe';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'event-card',
  standalone: true,
  imports: [DatePipe, IntlCurrencyPipe],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);

  event = input.required<MyEvent>();
  deleted = output<void>();

  deleteEvent() {
    this.#eventsService
      .deleteEvent(this.event().id!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.deleted.emit();
      });
  }
}
