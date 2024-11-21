import { EVENTS_URL } from "../constants";
import { Http } from "./http";
import { MyEvent, MyEventInsert } from "../interfaces/myevent";
import { User } from "../interfaces/user";

export class EventsService {
    #http: Http;

    constructor() {
        this.#http = new Http();
    }

    async getEvents(params: { page?: number; order?: string; search?: string }) {
        const url = `${EVENTS_URL}?${this.createQueryString(params)}`;

        const response = await this.#http.get<{
            events: MyEvent[];
            page: number;
            more: boolean;
        }>(url);

        return response;
    }

    createQueryString(params: { page?: number; order?: string; search?: string }): string {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', String(params.page));
        if (params.order) queryParams.append('order', params.order);
        if (params.search) queryParams.append('search', params.search);

        return queryParams.toString();
    }

    async post(event: MyEventInsert): Promise<MyEvent> {
        const response = await this.#http.post<{ event: MyEvent }, MyEventInsert>(EVENTS_URL, event);
        return response.event;
    }

    async delete(id: number): Promise<void> {
        await this.#http.delete(`${EVENTS_URL}/${id}`);
    }

    async getEventById(id: number): Promise<MyEvent> {
        const url = `${EVENTS_URL}/${id}`;
        const response = await this.#http.get<{ event: MyEvent }>(url);
        return response.event;
    }

    async getEventAttendees(eventId: number): Promise<{ users: User[] }> {
        const url = `${EVENTS_URL}/${eventId}/attend`;
        const response = await this.#http.get<{ users: User[] }>(url);
        return response;
    }
}
