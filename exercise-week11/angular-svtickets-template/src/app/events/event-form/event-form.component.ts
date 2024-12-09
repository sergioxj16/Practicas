import { Component, inject, output, DestroyRef } from '@angular/core';
import { MyEvent } from '../interfaces/my-event';
import { FormsModule, NgForm } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from "@angular/router";
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { MinDateDirective } from '../../shared/directives/min-date.directive';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'event-form',
  standalone: true,
  imports: [FormsModule, EncodeBase64Directive, ValidationClassesDirective, MinDateDirective, DatePipe],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {
  #eventService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  todayDate: string = new Date().toISOString().split('T')[0];


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

  checkImage(fileInputElement: HTMLInputElement) {
    if (!fileInputElement.files || fileInputElement.files.length === 0) this.newEvent.image = '';
  }
}
