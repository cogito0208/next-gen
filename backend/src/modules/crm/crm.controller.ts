import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrmService } from './crm.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('crm')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('customers')
  @ApiOperation({ summary: '고객사 목록 조회' })
  findAllCustomers() {
    return this.crmService.findAllCustomers();
  }

  @Get('deals')
  @ApiOperation({ summary: '딜 목록 조회' })
  findAllDeals() {
    return this.crmService.findAllDeals();
  }

  @Get('stats')
  @ApiOperation({ summary: 'CRM 통계 조회' })
  getStats() {
    return this.crmService.getStats();
  }

  @Get('pipeline')
  @ApiOperation({ summary: '파이프라인 통계 조회' })
  getPipeline() {
    return this.crmService.getPipelineStats();
  }
}
