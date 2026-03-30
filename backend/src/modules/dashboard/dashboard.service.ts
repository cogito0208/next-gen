import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';
import { Project, ProjectStatus } from '../project/entities/project.entity.js';
import { Customer } from '../crm/entities/customer.entity.js';
import { Deal, DealStage } from '../crm/entities/deal.entity.js';
import { Employee } from '../hr/entities/employee.entity.js';
import { AttendanceRecord, AttendanceStatus } from '../hr/entities/attendance.entity.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  async getStats(userRole: string): Promise<Record<string, unknown>> {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [totalProjects, activeProjects, totalEmployees, totalCustomers, allDeals, todayAttendance] =
      await Promise.all([
        this.projectRepo.count(),
        this.projectRepo.count({ where: { status: ProjectStatus.ACTIVE } }),
        this.employeeRepo.count({ where: { isActive: true } }),
        this.customerRepo.count(),
        this.dealRepo.find(),
        this.attendanceRepo
          .createQueryBuilder('att')
          .where('CAST(att.date AS TEXT) = :date', { date: todayStr })
          .getMany(),
      ]);

    const totalRevenue = allDeals
      .filter((d) => d.stage === DealStage.CLOSED_WON)
      .reduce((sum, d) => sum + Number(d.value), 0);

    const presentToday = todayAttendance.filter(
      (r) => r.status !== AttendanceStatus.ABSENT,
    ).length;

    const attendanceRate =
      totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

    // Role-specific stats
    if (userRole === 'CEO' || userRole === 'EXECUTIVE') {
      return {
        totalRevenue,
        totalProjects,
        activeProjects,
        totalEmployees,
        totalCustomers,
        presentToday,
        attendanceRate,
        safetyZeroDays: 127,
        pendingApprovals: 5,
      };
    }

    if (userRole === 'PM') {
      const delayedProjects = await this.projectRepo.count({
        where: { status: ProjectStatus.DELAYED },
      });
      return {
        totalProjects,
        activeProjects,
        delayedProjects,
        presentToday,
        attendanceRate,
      };
    }

    if (userRole === 'HR_TEAM') {
      const lateToday = todayAttendance.filter(
        (r) => r.status === AttendanceStatus.LATE,
      ).length;
      return {
        totalEmployees,
        presentToday,
        attendanceRate,
        lateToday,
        absentToday: totalEmployees - presentToday,
      };
    }

    if (userRole === 'FIELD_MANAGER') {
      return {
        presentToday,
        attendanceRate,
        safetyZeroDays: 127,
        activeProjects,
      };
    }

    if (userRole === 'MATERIAL_TEAM') {
      return {
        lowStockAlerts: 3,
        pendingOrders: 7,
        activeProjects,
      };
    }

    // Default (EMPLOYEE, CONTRACT_WORKER, GUEST)
    return {
      presentToday,
      attendanceRate,
      activeProjects,
    };
  }

  async getRecentActivities(): Promise<unknown[]> {
    const [projects, employees, deals] = await Promise.all([
      this.projectRepo.find({ order: { updatedAt: 'DESC' }, take: 4 }),
      this.employeeRepo.find({ order: { createdAt: 'DESC' }, take: 3 }),
      this.dealRepo.find({ order: { createdAt: 'DESC' }, take: 3 }),
    ]);

    const activities: Array<{
      id: string;
      type: string;
      message: string;
      time: Date;
    }> = [];

    for (const project of projects) {
      activities.push({
        id: project.id,
        type: 'project',
        message: `프로젝트 [${project.name}] 업데이트 - 진행률 ${project.progress}%`,
        time: project.updatedAt,
      });
    }

    for (const emp of employees) {
      activities.push({
        id: emp.id,
        type: 'employee',
        message: `신규 직원 [${emp.name}] 등록`,
        time: emp.createdAt,
      });
    }

    for (const deal of deals) {
      activities.push({
        id: deal.id,
        type: 'deal',
        message: `딜 [${deal.title}] - ${deal.stage}`,
        time: deal.createdAt,
      });
    }

    return activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);
  }

  async getChartData(
    type: 'monthly_revenue' | 'project_status' | 'attendance',
  ): Promise<unknown> {
    if (type === 'monthly_revenue') {
      const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
      const data = [
        { month: '1월', revenue: 1200000000 },
        { month: '2월', revenue: 1500000000 },
        { month: '3월', revenue: 1350000000 },
        { month: '4월', revenue: 1800000000 },
        { month: '5월', revenue: 2100000000 },
        { month: '6월', revenue: 1950000000 },
        { month: '7월', revenue: 2300000000 },
        { month: '8월', revenue: 2150000000 },
        { month: '9월', revenue: 2500000000 },
        { month: '10월', revenue: 2400000000 },
        { month: '11월', revenue: 2800000000 },
        { month: '12월', revenue: 3100000000 },
      ];
      return { labels: months, data };
    }

    if (type === 'project_status') {
      const [planning, active, completed, delayed, onHold] = await Promise.all([
        this.projectRepo.count({ where: { status: ProjectStatus.PLANNING } }),
        this.projectRepo.count({ where: { status: ProjectStatus.ACTIVE } }),
        this.projectRepo.count({ where: { status: ProjectStatus.COMPLETED } }),
        this.projectRepo.count({ where: { status: ProjectStatus.DELAYED } }),
        this.projectRepo.count({ where: { status: ProjectStatus.ON_HOLD } }),
      ]);
      return {
        labels: ['계획', '진행중', '완료', '지연', '보류'],
        data: [planning, active, completed, delayed, onHold],
      };
    }

    if (type === 'attendance') {
      // Return last 7 days attendance summary
      const result: Array<{ date: string; present: number; absent: number; late: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const records = await this.attendanceRepo
          .createQueryBuilder('att')
          .where('CAST(att.date AS TEXT) = :date', { date: dateStr })
          .getMany();

        result.push({
          date: dateStr,
          present: records.filter((r) => r.status !== AttendanceStatus.ABSENT).length,
          absent: records.filter((r) => r.status === AttendanceStatus.ABSENT).length,
          late: records.filter((r) => r.status === AttendanceStatus.LATE).length,
        });
      }
      return result;
    }

    return {};
  }
}
