import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity.js';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  async findAllDepartments(): Promise<Department[]> {
    return this.departmentRepo.find({ order: { name: 'ASC' } });
  }

  async getOrganizationStats(): Promise<{
    totalEmployees: number;
    totalDepartments: number;
    activeProjects: number;
    avgAttendance: number;
  }> {
    const departments = await this.departmentRepo.find();
    const totalDepartments = departments.length;
    const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);

    return {
      totalEmployees,
      totalDepartments,
      activeProjects: 3,
      avgAttendance: 94.5,
    };
  }
}
