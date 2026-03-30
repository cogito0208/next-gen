import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Deal } from './deal.entity.js';

export enum CustomerStatus {
  PROSPECT = 'PROSPECT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CustomerIndustry {
  CONSTRUCTION = 'CONSTRUCTION',
  MANUFACTURING = 'MANUFACTURING',
  IT = 'IT',
  FINANCE = 'FINANCE',
  OTHER = 'OTHER',
}

@Entity({ name: 'customers', schema: 'crm' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_name', length: 200 })
  companyName: string;

  @Column({ type: 'enum', enum: CustomerIndustry, default: CustomerIndustry.OTHER })
  industry: CustomerIndustry;

  @Column({ name: 'contact_name', nullable: true, length: 50 })
  contactName: string;

  @Column({ name: 'contact_email', nullable: true, length: 100 })
  contactEmail: string;

  @Column({ name: 'contact_phone', nullable: true, length: 20 })
  contactPhone: string;

  @Column({ nullable: true, length: 255 })
  address: string;

  @Column({ type: 'enum', enum: CustomerStatus, default: CustomerStatus.PROSPECT })
  status: CustomerStatus;

  @Column({ name: 'total_deal_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDealValue: number;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @OneToMany(() => Deal, (deal) => deal.customer)
  deals: Deal[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
