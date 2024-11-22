import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateFinishedDto } from './dto/update-finished.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createtaskDto: CreateTaskDto,
  ) {
    return { task: await this.tasksService.create(createtaskDto) };
  }

  @Get()
  async findAll() {
    return { tasks: await this.tasksService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { task: await this.tasksService.findOne(+id) };
  }

  @Put(':id/finished')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateFinished: UpdateFinishedDto,
  ) {
    return {
      task: await this.tasksService.updateFinished(+id, updateFinished),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.tasksService.remove(+id);
  }
}
