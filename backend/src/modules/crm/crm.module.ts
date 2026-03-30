import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity.js';
import { Deal } from './entities/deal.entity.js';
import { CrmService } from './crm.service.js';
import { CrmController } from './crm.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Deal])],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService, TypeOrmModule],
})
export class CrmModule {}
