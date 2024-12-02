import { Component, effect, inject, input } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MyEvent } from '../../shared/interfaces/my-event';

@Component({
  selector: 'event-detail',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
})
export class EventDetailComponent {
  event = input.required<MyEvent>();
  #title = inject(Title);

  #router = inject(Router);

  constructor() {
    effect(() => {
      if (this.event()) {
        this.#title.setTitle(this.event().title + '  SVtickets');
      }
    });
  }

  goBack() {
    this.#router.navigate(['/events']);
  }
}