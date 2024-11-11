import { EVENTS_URL } from "../constants";
import { Http } from "./http";
import { MyEvent, MyEventInsert } from "../interfaces/myevent";

export class EventsService {
    #http: Http;

    constructor() {
        this.#http = new Http();
    }

    // Método para obtener eventos con filtros de página, orden y búsqueda
    async getEvents(params: { page?: number; order?: string; search?: string }) {
        const url = `${EVENTS_URL}?${this.createQueryString(params)}`;
        
        // Se especifica el tipo de respuesta esperada (con eventos, página y 'more')
        const response = await this.#http.get<{
            events: MyEvent[];
            page: number;
            more: boolean;
        }>(url);
        
        return response;  // La respuesta ahora está tipada correctamente
    }

    // Crear el string de query a partir de los parámetros
    createQueryString(params: { page?: number; order?: string; search?: string }): string {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', String(params.page));
        if (params.order) queryParams.append('order', params.order);
        if (params.search) queryParams.append('search', params.search);

        return queryParams.toString();
    }

    // Método para crear un nuevo evento
    async post(event: MyEventInsert): Promise<MyEvent> {
        const response = await this.#http.post<{ event: MyEvent }, MyEventInsert>(EVENTS_URL, event);
        return response.event;
    }

    // Método para eliminar un evento
    async delete(id: number): Promise<void> {
        await this.#http.delete(`${EVENTS_URL}/${id}`);
    }
}
