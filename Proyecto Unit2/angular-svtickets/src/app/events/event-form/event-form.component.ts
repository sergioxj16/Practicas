import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { MinDateDirective } from '../../shared/directives/min-date.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { MyEvent } from '../../shared/interfaces/myevent';
import { EventsService } from '../services/events.service';

@Component({
    selector: 'event-form',
    imports: [FormsModule, EncodeBase64Directive, ValidationClassesDirective, MinDateDirective, DatePipe],
    templateUrl: './event-form.component.html',
    styleUrl: './event-form.component.css'
})
export class EventFormComponent {
    // added = output<MyEvent>();
    // #eventsService = inject(EventsService);
    // #destroyRef = inject(DestroyRef);
    // #router = inject(Router);

    // newEvent: MyEvent = {
    //     title: '',
    //     description: '',
    //     date: '',
    //     image: '',
    //     price: 0,
    // };
    // saved = false;
    // today = new Date().toISOString().slice(0, 10);

    // addEvent() {
    //     this.#eventsService
    //         .addEvent(this.newEvent)
    //         .pipe(takeUntilDestroyed(this.#destroyRef))
    //         .subscribe(() => {
    //             this.saved = true;
    //             this.#router.navigate(['/events']);
    //         });
    // }

    // canDeactivate() {
    //     return (
    //         this.saved ||
    //         confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    //     );
    // }
}
