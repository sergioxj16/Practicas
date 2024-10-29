import { Http } from './http.js';
import { SERVER_URL } from './constants.js';

export class EventsService {
    #http;

    constructor() {
        this.#http = new Http();
    }

    async getEvents() {
        try {
            const response = await this.#http.get(SERVER_URL);
            return response.events || [];
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    async post(event) {
        try {
            const response = await this.#http.post(SERVER_URL, event);
            return response.event;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            await this.#http.delete(`${SERVER_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }
}
