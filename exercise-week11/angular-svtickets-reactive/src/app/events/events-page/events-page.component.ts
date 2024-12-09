import { Component, computed, inject, signal } from '@angular/core';
import { MyEvent } from '../interfaces/my-event';
import { EventCardComponent } from '../event-card/event-card.component';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'events-page',
  standalone: true,
  imports: [ EventCardComponent, FormsModule],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
})

export class EventsPageComponent {
  #eventsService = inject(EventsService);

  constructor() {
    this.#eventsService
      .getEvents()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (events) => {
          this.events.set(events);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  events = signal<MyEvent[]>([]);

  search = signal('');

  filteredEvents = computed(() => {
    const searchLower = this.search().toLowerCase();
    return this.events().filter(
      (e) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
    );
  });

  addEvent(event: MyEvent) {
    this.events.update((events) => [...events, event]);
  }

  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((e) => e !== event));
  }

  orderDate() {
    this.events.update((events) =>
      events.toSorted((e1, e2) => e1.date.localeCompare(e2.date))
    );
  }

  orderPrice() {
    this.events.update((events) =>
      events.toSorted((e1, e2) => e1.price - e2.price)
    );
  }
}
