import { Component, inject,  DestroyRef } from '@angular/core';
import { MyEvent } from '../interfaces/my-event';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from "@angular/router";
import { NonNullableFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { minDateValidator } from '../../shared/directives/min-date.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'event-form',
  standalone: true,
  imports: [FormsModule, EncodeBase64Directive, ValidationClassesDirective, ReactiveFormsModule, DatePipe],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements CanComponentDeactivate{
  #eventService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  #saved = false;
  todayDate: string = new Date().toISOString().split('T')[0];

  eventForm = this.#fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      ],
    ],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    image: ['', Validators.required],
    date: ['', [Validators.required, minDateValidator(this.todayDate)]],
  });

  imageBase64 = '';

  addEvent() {
    const event: MyEvent = {
      ...this.eventForm.getRawValue(),
      image: this.imageBase64,
    };

    this.#eventService
      .addEvent(event)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['/events']);
      });
  }

  checkImage(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) {
      this.imageBase64 = '';
    }
  }

  canDeactivate() {
    return (
      this.eventForm.pristine ||
      this.#saved ||
      confirm('Do you want to leave the page? Your changes will be lost...')
    );
  }
}