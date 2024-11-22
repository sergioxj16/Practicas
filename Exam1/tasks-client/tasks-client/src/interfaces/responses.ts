import { Task } from "./task";

export interface TasksResponse {
    tasks: Task[];
}

export interface SingleTaskResponse {
    task: Task;
}