import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user';
import { CommentsResponses, EventsResponse, SingleEventResponse, UsersResponse } from '../../shared/interfaces/responses';
import { MyEvent } from '../../shared/interfaces/myevent';

@Injectable({
	providedIn: 'root',
})
export class EventsService {
	private http = inject(HttpClient);
	private eventsUrl = 'events/';

	getEvents(urlParams: URLSearchParams): Observable<EventsResponse> {
		return this.http
			.get<EventsResponse>(`${this.eventsUrl}?${urlParams.toString()}`)
			.pipe(map((resp) => resp));
	}

	getEvent(id: number): Observable<MyEvent> {
		return this.http
			.get<SingleEventResponse>(`events/${id}`)
			.pipe(map((resp) => resp.event));
	}

	addEvent(event: MyEvent): Observable<MyEvent> {
		return this.http
			.post<SingleEventResponse>('events', event)
			.pipe(map((resp) => resp.event));
	}

	deleteEvent(id: number): Observable<void> {
		return this.http.delete<void>(`events/${id}`);
	}

	getAttendees(eventId: number): Observable<User[]> {
		return this.http
			.get<UsersResponse>(`events/${eventId}/attend`)
			.pipe(map((response: UsersResponse) => response.users));
	}

	getComments(id: number): Observable<CommentsResponses> {
		return this.http.get<CommentsResponses>(
			`${this.eventsUrl}/${id}/comments`
		);
	}
}
