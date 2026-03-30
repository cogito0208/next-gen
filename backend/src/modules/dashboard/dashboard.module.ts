import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { Project } from '../project/entities/project.entity.js';
import { Customer } from '../crm/entities/customer.entity.js';
import { Deal } from '../crm/entities/deal.entity.js';
import { Employee } from '../hr/entities/employee.entity.js';
import { AttendanceRecord } from '../hr/entities/attendance.entity.js';
import { DashboardService } from './dashboard.service.js';
import { DashboardController } from './dashboard.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      Customer,
      Deal,
      Employee,
      AttendanceRecord,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
