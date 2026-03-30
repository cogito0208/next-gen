import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('departments')
  @ApiOperation({ summary: '부서 목록 조회' })
  findAll() {
    return this.organizationService.findAllDepartments();
  }

  @Get('stats')
  @ApiOperation({ summary: '조직 통계 조회' })
  getStats() {
    return this.organizationService.getOrganizationStats();
  }
}
