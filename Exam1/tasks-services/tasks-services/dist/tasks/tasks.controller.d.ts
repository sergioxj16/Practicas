import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateFinishedDto } from './dto/update-finished.dto';
import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createtaskDto: CreateTaskDto): Promise<{
        task: import("./task.entity").Task;
    }>;
    findAll(): Promise<{
        tasks: import("./task.entity").Task[];
    }>;
    findOne(id: string): Promise<{
        task: import("./task.entity").Task;
    }>;
    update(id: string, updateFinished: UpdateFinishedDto): Promise<{
        task: import("./task.entity").Task;
    }>;
    remove(id: string): Promise<void>;
}
