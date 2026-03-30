import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity.js';
import { Department } from '../modules/organization/entities/department.entity.js';
import { Project } from '../modules/project/entities/project.entity.js';
import { ProjectTask } from '../modules/project/entities/project-task.entity.js';
import { Customer } from '../modules/crm/entities/customer.entity.js';
import { Deal } from '../modules/crm/entities/deal.entity.js';
import { Employee } from '../modules/hr/entities/employee.entity.js';
import { AttendanceRecord } from '../modules/hr/entities/attendance.entity.js';
import { LeaveRequest } from '../modules/hr/entities/leave-request.entity.js';
import { DatabaseSeeder } from './database.seeder.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Department,
      Project,
      ProjectTask,
      Customer,
      Deal,
      Employee,
      AttendanceRecord,
      LeaveRequest,
    ]),
  ],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class DatabaseModule {}
