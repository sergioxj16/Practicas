import { Component, inject, output, DestroyRef } from '@angular/core';
import { MyEvent } from '../interfaces/my-event';
import { FormsModule, NgForm } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from "@angular/router";


@Component({
  selector: 'event-form',
  standalone: true,
  imports: [FormsModule, EncodeBase64Directive],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {
  #eventService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  newEvent: MyEvent = {
    title: '',
    description: '',
    date: '',
    image: '',
    price: 0,
  };

  added = output<MyEvent>();

  addEvent(eventForm: NgForm) {
    this.#eventService
      .addEvent(this.newEvent)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        this.added.emit(event);
        eventForm.resetForm();
        this.newEvent.image = '';
        this.#router.navigate(['/events']);
      });
  }
}
