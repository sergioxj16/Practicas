import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventCardComponent } from '../event-card/event-card.component';
import { ProfileService } from '../../profile/services/profile.service';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../../shared/interfaces/myevent';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';


@Component({
    selector: 'events-page',
    imports: [FormsModule, ReactiveFormsModule, EventCardComponent],
    templateUrl: './events-page.component.html',
    styleUrls: ['./events-page.component.css']
})
export class EventsPageComponent {
    #eventsService = inject(EventsService);
    #profileService = inject(ProfileService);
    #destroyRef = inject(DestroyRef);

    filterDescription = signal<string>('');
    searchControl = new FormControl('');
    currentPage = signal<number>(1);
    creator = input<number>();
    attending = input<number>();
    hasMoreEvents = signal<boolean>(false);
    events = signal<MyEvent[]>([]);
    sortOrder = signal<string>('');

    searchQuery = toSignal(
        this.searchControl.valueChanges.pipe(
            debounceTime(600),
            distinctUntilChanged()
        ),
        { initialValue: '' }
    );

    urlParams = computed(() => {
        const params: Record<string, string> = {
            search: this.searchQuery()!,
            page: String(this.currentPage())
        };

        if (this.creator()) {
            params['creator'] = String(this.creator());
        } else if (this.attending()) {
            params['attending'] = String(this.attending());
        }

        return new URLSearchParams(params);
    });

    filteredEvents = computed(() => {
        const searchLower = this.searchQuery()!.toLowerCase();
        return this.events().filter(
            (e) => e.title?.toLowerCase().includes(searchLower) ||
                e.description?.toLowerCase().includes(searchLower)
        );
    });

    constructor() {
        effect(() => {
            this.loadEvents();
        });

        effect(() => {
            const filters: string[] = [];
            const searchValue = this.searchQuery()?.trim();
            const orderBy = this.sortOrder();
            const creatorId = this.creator();
            const attendingId = this.attending();

            if (searchValue) filters.push(`Searching by: "${this.searchQuery()}"`);
            if (orderBy) filters.push(`Ordering by: ${this.sortOrder()}`);

            if (creatorId) {
                this.#profileService.getProfile(creatorId)
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((user) => filters.push(`Events created by: ${user.name}`));
            }

            if (attendingId) {
                this.#profileService.getProfile(attendingId)
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((user) => filters.push(`Events attended by: ${user.name}`));
            }

            this.filterDescription.set(filters.length ? filters.join('. ') : 'No filters applied.');
        });
    }

    loadEvents() {
        this.#eventsService.getEvents(this.urlParams())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((response) => {
                this.hasMoreEvents.set(response.more);
                if (response.page === 1) {
                    this.events.set(response.events);
                } else {
                    this.events.update((currentEvents) => [...currentEvents, ...response.events]);
                }
            });
    }

    sortByDate = () => {
        this.sortEvents('date');
        this.sortOrder.set('date');
    };

    sortByPrice = () => {
        this.sortEvents('price');
        this.sortOrder.set('price');
    };

    sortByDistance = () => {
        this.sortEvents('distance');
        this.sortOrder.set('distance');
    };

    sortEvents(orderBy: 'date' | 'price' | 'distance') {
        this.events.update((currentEvents) =>
            currentEvents.sort((a, b) => {
                if (orderBy === 'price') {
                    return a.price - b.price;
                } else if (orderBy === 'distance') {
                    return a.distance - b.distance;
                }
                return a.date.localeCompare(b.date);
            })
        );
    }

    addEvent(newEvent: MyEvent) {
        this.events.update((currentEvents) => [...currentEvents, newEvent]);
    }

    removeEvent(event: MyEvent) {
        this.events.update((currentEvents) => currentEvents.filter((e) => e !== event));
    }

    resetSearch() {
        this.currentPage.set(1);
        this.sortOrder.set('');
    }

    loadMoreEvents() {
        if (this.hasMoreEvents()) {
            this.currentPage.update((page) => page + 1);
        }
    }
}
