import {
    Component,
    DestroyRef,
    effect,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from '../../shared/directives/ol-maps/ga-autocomplete.directive';
import { EventsService } from '../services/events.service';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { MyEvent } from '../interfaces/my-event';
import { SearchResult } from '../../shared/directives/ol-maps/search-result';
import { MyEventInsert } from '../../shared/interfaces/myevent';

@Component({
    standalone: true,
    selector: 'event-form',
    imports: [
        ReactiveFormsModule,
        EncodeBase64Directive,
        ValidationClassesDirective,
        OlMapDirective,
        OlMarkerDirective,
        GaAutocompleteDirective,
    ],
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.css'],
})
export class EventFormComponent implements CanComponentDeactivate {
    #eventsService = inject(EventsService);
    #router = inject(Router);
    #formBuilder = inject(NonNullableFormBuilder);
    #destroyRef = inject(DestroyRef);

    currentEvent = input.required<MyEvent>();
    eventDeleted = output<number>();
    eventAttended = output<void>();

    eventCoordinates = signal<[number, number]>([-0.5, 38.5]);
    eventAddress = '';
    eventImageBase64 = '';
    isEventSaved = false;

    eventDetailsForm = this.#formBuilder.group({
        title: [
            '',
            [
                Validators.required,
                Validators.minLength(5),
                Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
            ],
        ],
        date: ['', [Validators.required,]],
        description: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(1)]],
        image: ['', Validators.required],
        address: ['', Validators.required],
    });

    constructor() {
        effect(() => {
            if (this.currentEvent) {
                this.populateEventForm(this.currentEvent());
            }
        });
    }

    private populateEventForm(eventData: MyEvent): void {
        this.eventDetailsForm.patchValue({
            title: eventData.title,
            date: eventData.date.split(' ')[0],
            description: eventData.description,
            price: eventData.price,
        });
        this.eventImageBase64 = eventData.image;
    }

    handlePlaceChange(placeDetails: SearchResult): void {
        this.eventCoordinates.set(placeDetails.coordinates);
        this.eventAddress = placeDetails.address;
    }

    saveOrUpdateEvent(): void {
        const { title, date, description, price,  } = this.eventDetailsForm.controls;

        const newEventDetails: MyEventInsert = {
            title: title.value!,
            date: date.value!,
            description: description.value!,
            price: price.value!,
            image: this.eventImageBase64,
            lat: this.eventCoordinates()[1],
            lng: this.eventCoordinates()[0],
            address: this.eventAddress,
        };

        const eventAction$ = this.currentEvent
            ? this.#eventsService.updateEvent(newEventDetails, this.currentEvent().id!)
            : this.#eventsService.addEvent(newEventDetails);

        eventAction$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.isEventSaved = true;
            this.#router.navigate(['/events']);
        });
    }

    handleFileInputChange(fileInputEvent: Event): void {
        const inputElement = fileInputEvent.target as HTMLInputElement;
        const selectedFile = inputElement?.files?.[0];
        if (selectedFile) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.eventImageBase64 = fileReader.result as string;
            };
            fileReader.readAsDataURL(selectedFile);
        } else {
            this.eventImageBase64 = '';
        }
    }

    canDeactivate() {
        return this.isEventSaved || confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
    }


}
