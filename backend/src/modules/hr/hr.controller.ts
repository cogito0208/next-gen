import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HrService } from './hr.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { LeaveStatus } from './entities/leave-request.entity.js';

@ApiTags('hr')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('employees')
  @ApiOperation({ summary: '직원 목록 조회' })
  findAllEmployees() {
    return this.hrService.findAllEmployees();
  }

  @Get('attendance/today')
  @ApiOperation({ summary: '오늘 출근 현황 조회' })
  getTodayAttendance() {
    return this.hrService.getTodayAttendance();
  }

  @Get('attendance')
  @ApiOperation({ summary: '날짜별 출근 현황 조회' })
  @ApiQuery({ name: 'date', required: false, example: '2026-03-30' })
  getAttendanceByDate(@Query('date') date?: string) {
    const targetDate = date ?? new Date().toISOString().split('T')[0];
    return this.hrService.getAttendanceByDate(targetDate);
  }

  @Get('leaves')
  @ApiOperation({ summary: '휴가 신청 목록 조회' })
  @ApiQuery({ name: 'status', required: false, enum: LeaveStatus })
  getLeaveRequests(@Query('status') status?: LeaveStatus) {
    return this.hrService.getLeaveRequests(status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'HR 통계 조회' })
  getStats() {
    return this.hrService.getStats();
  }
}
