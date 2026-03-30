import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AttendanceRecord } from './attendance.entity.js';
import { LeaveRequest } from './leave-request.entity.js';

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
}

@Entity({ name: 'employees', schema: 'hr' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 50 })
  position: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({
    name: 'employment_type',
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ nullable: true, type: 'decimal', precision: 12, scale: 2 })
  salary: number;

  @Column({ name: 'annual_leave_total', default: 15 })
  annualLeaveTotal: number;

  @Column({ name: 'annual_leave_used', default: 0 })
  annualLeaveUsed: number;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => AttendanceRecord, (att) => att.employee)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => LeaveRequest, (leave) => leave.employee)
  leaveRequests: LeaveRequest[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
