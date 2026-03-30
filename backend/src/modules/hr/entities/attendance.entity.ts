import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity.js';

export enum AttendanceStatus {
  NORMAL = 'NORMAL',
  LATE = 'LATE',
  EARLY_LEAVE = 'EARLY_LEAVE',
  ABSENT = 'ABSENT',
  REMOTE = 'REMOTE',
}

@Entity({ name: 'attendance_records', schema: 'hr' })
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee, (emp) => emp.attendanceRecords)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'check_in', nullable: true, type: 'time' })
  checkIn: string;

  @Column({ name: 'check_out', nullable: true, type: 'time' })
  checkOut: string;

  @Column({ name: 'work_hours', nullable: true, type: 'decimal', precision: 4, scale: 2 })
  workHours: number;

  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.NORMAL })
  status: AttendanceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
