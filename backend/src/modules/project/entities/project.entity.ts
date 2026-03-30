import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectTask } from './project-task.entity.js';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity({ name: 'projects', schema: 'project' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Column({ type: 'enum', enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  priority: ProjectPriority;

  @Column({ nullable: true, name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ nullable: true, name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ nullable: true, type: 'decimal', precision: 15, scale: 2 })
  budget: number;

  @Column({ default: 0 })
  progress: number;

  @Column({ nullable: true, name: 'manager_name', length: 50 })
  managerName: string;

  @Column({ nullable: true, name: 'client_name', length: 100 })
  clientName: string;

  @Column({ name: 'task_count', default: 0 })
  taskCount: number;

  @Column({ name: 'completed_task_count', default: 0 })
  completedTaskCount: number;

  @OneToMany(() => ProjectTask, (task) => task.project)
  tasks: ProjectTask[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
