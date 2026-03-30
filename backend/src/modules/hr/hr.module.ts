import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity.js';
import { AttendanceRecord } from './entities/attendance.entity.js';
import { LeaveRequest } from './entities/leave-request.entity.js';
import { HrService } from './hr.service.js';
import { HrController } from './hr.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, AttendanceRecord, LeaveRequest])],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService, TypeOrmModule],
})
export class HrModule {}
