import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum UserRole {
  CEO = 'CEO',
  EXECUTIVE = 'EXECUTIVE',
  PM = 'PM',
  FIELD_MANAGER = 'FIELD_MANAGER',
  MATERIAL_TEAM = 'MATERIAL_TEAM',
  HR_TEAM = 'HR_TEAM',
  EMPLOYEE = 'EMPLOYEE',
  CONTRACT_WORKER = 'CONTRACT_WORKER',
  GUEST = 'GUEST',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  PENDING = 'PENDING',
}

@Entity({ name: 'users', schema: 'user_mgmt' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 50 })
  name: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 50 })
  position: string;

  @Column({ name: 'login_attempts', default: 0 })
  loginAttempts: number;

  @Column({ name: 'locked_until', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
