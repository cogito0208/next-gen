import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity.js';
import { ProjectTask, TaskStatus } from './entities/project-task.entity.js';
import { UserRole } from '../user/entities/user.entity.js';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectTask)
    private readonly taskRepo: Repository<ProjectTask>,
  ) {}

  async findAll(userId?: string, role?: string): Promise<Project[]> {
    const query = this.projectRepo.createQueryBuilder('project');

    if (role === UserRole.PM && userId) {
      // PM sees only their projects - for now return all
      // In a real scenario we'd filter by managerId foreign key
    }
    // CEO, EXECUTIVE see all
    return query.orderBy('project.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['tasks'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    delayed: number;
    onHold: number;
  }> {
    const [total, active, completed, delayed, onHold] = await Promise.all([
      this.projectRepo.count(),
      this.projectRepo.count({ where: { status: ProjectStatus.ACTIVE } }),
      this.projectRepo.count({ where: { status: ProjectStatus.COMPLETED } }),
      this.projectRepo.count({ where: { status: ProjectStatus.DELAYED } }),
      this.projectRepo.count({ where: { status: ProjectStatus.ON_HOLD } }),
    ]);

    return { total, active, completed, delayed, onHold };
  }

  async getKanbanBoard(projectId: string): Promise<{
    TODO: ProjectTask[];
    IN_PROGRESS: ProjectTask[];
    REVIEW: ProjectTask[];
    DONE: ProjectTask[];
  }> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    const tasks = await this.taskRepo.find({
      where: { projectId },
      order: { order: 'ASC' },
    });

    return {
      TODO: tasks.filter((t) => t.status === TaskStatus.TODO),
      IN_PROGRESS: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
      REVIEW: tasks.filter((t) => t.status === TaskStatus.REVIEW),
      DONE: tasks.filter((t) => t.status === TaskStatus.DONE),
    };
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<ProjectTask> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }

    task.status = status;
    const updated = await this.taskRepo.save(task);

    // Update completed task count on project
    if (status === TaskStatus.DONE) {
      await this.projectRepo
        .createQueryBuilder()
        .update(Project)
        .set({ completedTaskCount: () => '"completed_task_count" + 1' })
        .where('id = :id', { id: task.projectId })
        .execute();
    }

    return updated;
  }
}
