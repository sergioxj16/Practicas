"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const task_entity_1 = require("./task.entity");
const sqlite_1 = require("@mikro-orm/sqlite");
let TasksService = class TasksService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async create(createTaskDto) {
        const task = this.taskRepository.create(createTaskDto);
        await this.taskRepository.insert(task);
        return task;
    }
    async findAll() {
        return this.taskRepository.findAll();
    }
    async findOne(id) {
        return this.taskRepository.findOneOrFail(id);
    }
    async updateFinished(id, updateFinished) {
        const task = await this.findOne(id);
        task.finished = updateFinished.finished;
        await this.taskRepository.getEntityManager().flush();
        return task;
    }
    async remove(id) {
        const task = await this.findOne(id);
        await this.taskRepository.getEntityManager().removeAndFlush(task);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [sqlite_1.EntityRepository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map