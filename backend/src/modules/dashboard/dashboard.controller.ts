import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: '대시보드 통계 조회 (역할별)' })
  @ApiQuery({ name: 'role', required: false })
  getStats(@Request() req: any, @Query('role') role?: string) {
    const userRole = role ?? req.user?.role ?? 'EMPLOYEE';
    return this.dashboardService.getStats(userRole);
  }

  @Get('activities')
  @ApiOperation({ summary: '최근 활동 목록 조회' })
  getActivities() {
    return this.dashboardService.getRecentActivities();
  }

  @Get('charts/:type')
  @ApiOperation({ summary: '차트 데이터 조회' })
  @ApiParam({ name: 'type', enum: ['monthly_revenue', 'project_status', 'attendance'] })
  getChartData(@Param('type') type: 'monthly_revenue' | 'project_status' | 'attendance') {
    return this.dashboardService.getChartData(type);
  }
}
