import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { MinDateDirective } from '../../shared/directives/min-date.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../../shared/interfaces/myevent';

@Component({
    selector: 'event-form',
    imports: [FormsModule, EncodeBase64Directive, ValidationClassesDirective, MinDateDirective, DatePipe],
    templateUrl: './event-form.component.html',
    styleUrl: './event-form.component.css'
})

export class EventFormComponent implements CanComponentDeactivate {
    added = output<MyEvent>();
    #eventsService = inject(EventsService);
    #destroyRef = inject(DestroyRef);
    #router = inject(Router);
    saved = false;

    canDeactivate() {
        return (
            this.saved ||
            confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
        );
    }
}
