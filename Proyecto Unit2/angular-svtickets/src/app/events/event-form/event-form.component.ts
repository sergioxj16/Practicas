import { Component, DestroyRef, effect, inject, input, output, signal, } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from '../../shared/directives/ol-maps/ga-autocomplete.directive';
import { EventsService } from '../services/events.service';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { SearchResult } from '../../shared/directives/ol-maps/search-result';
import { MyEvent, MyEventInsert } from '../../shared/interfaces/myevent';
import { DatePipe } from '@angular/common';
import { minDateValidator } from '../../shared/directives/min-date.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';


@Component({
    standalone: true,
    selector: 'event-form',
    imports: [ReactiveFormsModule, EncodeBase64Directive, ValidationClassesDirective, OlMapDirective, OlMarkerDirective, GaAutocompleteDirective, DatePipe],
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.css'],
})
export class EventFormComponent implements CanComponentDeactivate {
    #eventsService = inject(EventsService);
    #router = inject(Router);
    #fb = inject(NonNullableFormBuilder);
    #destroyRef = inject(DestroyRef);
    #modalService = inject(NgbModal);

    currentEvent = input.required<MyEvent>();
    eventDeleted = output<number>();
    eventAttended = output<void>();

    eventCoordinates = signal<[number, number]>([-0.5, 38.5]);
    eventAddress = '';
    eventImageBase64 = '';
    isEventSaved = false;
    todayDate = new Date().toISOString().split('T')[0];

    eventForm = this.#fb.group({
        title: [
            '',
            [
                Validators.required,
                Validators.minLength(5),
                Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
            ],
        ],
        date: ['', [Validators.required, minDateValidator(this.todayDate)]],
        description: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(1)]],
        image: ['', Validators.required],
        address: [''],
    });

    constructor() {
        effect(() => {
            const event = this.currentEvent();
            if (event) {
                this.eventForm.get('title')?.setValue(event.title);
                this.eventForm.get('date')?.setValue(event.date.split(' ')[0]);
                this.eventForm.get('description')?.setValue(event.description);
                this.eventForm.get('price')?.setValue(event.price);
                this.eventForm.get('address')?.setValue(event.address);
                this.eventImageBase64 = event.image;
                this.eventCoordinates.set([event.lat, event.lng]);
            }
        });
    }

    createEventForm(eventData: MyEvent): void {
        this.eventForm.patchValue({
            title: eventData.title,
            date: eventData.date.split(' ')[0],
            description: eventData.description,
            price: eventData.price,
            address: eventData.address,
            
        });
        this.eventImageBase64 = eventData.image;
    }

    handlePlaceChange(placeDetails: SearchResult): void {
        this.eventCoordinates.set(placeDetails.coordinates);
        this.eventAddress = placeDetails.address;
    }

    addEvent(): void {
        const newEvent: MyEventInsert = {
            ...this.eventForm.getRawValue(),
            image: this.eventImageBase64,
            lat: this.eventCoordinates()[1],
            lng: this.eventCoordinates()[0],
            address: this.eventAddress
        };


        if (!this.currentEvent()) {

            this.#eventsService.addEvent(newEvent)
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe(() => {
                    this.isEventSaved = true;
                    this.#router.navigate(['/events']);
                });
        } else {
            this.#eventsService.updateEvent(newEvent, this.currentEvent().id)
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe(() => {
                    this.isEventSaved = true;
                    this.#router.navigate(['/events']);
                });

        }
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
        if (this.isEventSaved || this.eventForm.pristine) {
            return true;
        }
        const modalRef = this.#modalService.open(ConfirmModalComponent);
        modalRef.componentInstance.title = 'Changes not saved';
        modalRef.componentInstance.body =
            'Do you want to leave the page? Changes will be lost...';
        return modalRef.result.catch(() => false);
    }


}
