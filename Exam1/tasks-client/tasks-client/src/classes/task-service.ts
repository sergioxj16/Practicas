import { Http } from "../http";
import { SERVER} from "../constants";
import { FinishedUpdate } from "../interfaces/task";
import { TasksResponse, SingleTaskResponse } from "../interfaces/responses";

export class taskService {
    #http: Http;

    constructor() {
        this.#http = new Http();
    }

    async getTasks() {
        const resp = await this.#http.get<TasksResponse>(`${SERVER}/tasks`);
        return resp.tasks;
    }

    async updateFinished(id: number, finished: boolean) {
        const data: FinishedUpdate = { finished };
        const resp = await this.#http.put<SingleTaskResponse, FinishedUpdate>(
            `${SERVER}/tasks/${id}/finished`,
            data
        );
        return resp.task;
    }
}
