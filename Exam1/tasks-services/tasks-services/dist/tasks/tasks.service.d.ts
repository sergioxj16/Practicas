import { Task } from './task.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { UpdateFinishedDto } from './dto/update-finished.dto';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksService {
    private readonly taskRepository;
    constructor(taskRepository: EntityRepository<Task>);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: number): Promise<Task | null>;
    updateFinished(id: number, updateFinished: UpdateFinishedDto): Promise<Task>;
    remove(id: number): Promise<void>;
}
