import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerStatus } from './entities/customer.entity.js';
import { Deal, DealStage } from './entities/deal.entity.js';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
  ) {}

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepo.find({
      relations: ['deals'],
      order: { companyName: 'ASC' },
    });
  }

  async findAllDeals(): Promise<Deal[]> {
    return this.dealRepo.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPipelineStats(): Promise<{
    total_value: number;
    by_stage: Record<string, { count: number; value: number }>;
  }> {
    const deals = await this.dealRepo.find();

    const byStage: Record<string, { count: number; value: number }> = {};
    let totalValue = 0;

    for (const stage of Object.values(DealStage)) {
      byStage[stage] = { count: 0, value: 0 };
    }

    for (const deal of deals) {
      const val = Number(deal.value);
      totalValue += val;
      byStage[deal.stage].count += 1;
      byStage[deal.stage].value += val;
    }

    return { total_value: totalValue, by_stage: byStage };
  }

  async getStats(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    totalDeals: number;
    totalValue: number;
    winRate: number;
  }> {
    const [totalCustomers, activeCustomers, allDeals, wonDeals, lostDeals] = await Promise.all([
      this.customerRepo.count(),
      this.customerRepo.count({ where: { status: CustomerStatus.ACTIVE } }),
      this.dealRepo.find(),
      this.dealRepo.count({ where: { stage: DealStage.CLOSED_WON } }),
      this.dealRepo.count({ where: { stage: DealStage.CLOSED_LOST } }),
    ]);

    const totalValue = allDeals.reduce((sum, d) => sum + Number(d.value), 0);
    const closedTotal = wonDeals + lostDeals;
    const winRate = closedTotal > 0 ? Math.round((wonDeals / closedTotal) * 100) : 0;

    return {
      totalCustomers,
      activeCustomers,
      totalDeals: allDeals.length,
      totalValue,
      winRate,
    };
  }
}
