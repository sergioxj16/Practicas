import { Component, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventCardComponent } from '../event-card/event-card.component';
import { MyEvent } from '../../shared/interfaces/myevent';

@Component({
    selector: 'event-detail',
    imports: [EventCardComponent],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {

  #title = inject(Title);
  #router = inject(Router);

  event = input.required<MyEvent>();

  constructor() {
    effect(() =>
      this.#title.setTitle(this.event().title + ' | SvTickets')
    );
  }

  goBack() {
    this.#router.navigate(['/events']);
  }
}
