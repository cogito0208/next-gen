import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity.js';

export enum DealStage {
  LEAD = 'LEAD',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

@Entity({ name: 'deals', schema: 'crm' })
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  value: number;

  @Column({ type: 'enum', enum: DealStage, default: DealStage.LEAD })
  stage: DealStage;

  @Column({ default: 50 })
  probability: number;

  @Column({ name: 'owner_name', nullable: true, length: 50 })
  ownerName: string;

  @Column({ name: 'expected_close_date', nullable: true, type: 'date' })
  expectedCloseDate: Date;

  @ManyToOne(() => Customer, (customer) => customer.deals)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_id' })
  customerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
