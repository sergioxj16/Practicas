export interface Task {
    id: number;
    description: string;
    finished: boolean;
}

export interface FinishedUpdate {
    finished: boolean;
}