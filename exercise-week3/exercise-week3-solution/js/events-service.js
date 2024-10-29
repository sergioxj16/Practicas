import { SERVER } from "./constants.js";
import { Http } from "./http.js";

export class EventsService {
    #http;

    constructor() {
        this.#http = new Http();
    }

    async getEvents() {
        const response = await this.#http.get(`${SERVER}/events`);
        return response.events;
    }

    async post(event) {
        const response = await this.#http.post(`${SERVER}/events`, event);
        return response.event;
    }

    async delete(id) {
        await this.#http.delete(`${SERVER}/events/${id}`);
    }
}
