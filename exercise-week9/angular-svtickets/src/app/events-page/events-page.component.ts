import { Component, computed, signal } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';
import { MyEvent } from '../interfaces/my-event';
import { EventCardComponent } from '../event-card/event-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'events-page',
  standalone: true,
  imports: [EventFormComponent, EventCardComponent, FormsModule],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
})

export class EventsPageComponent {
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
