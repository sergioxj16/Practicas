import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { UpdateFinishedDto } from './dto/update-finished.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    await this.taskRepository.insert(task);
    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOneOrFail(id);
  }

  async updateFinished(
    id: number,
    updateFinished: UpdateFinishedDto,
  ): Promise<Task> {
    const task = await this.findOne(id);
    task.finished = updateFinished.finished;
    await this.taskRepository.getEntityManager().flush();
    return task;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.getEntityManager().removeAndFlush(task);
  }
}
