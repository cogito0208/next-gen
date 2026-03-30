import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity.js';
import { AttendanceRecord, AttendanceStatus } from './entities/attendance.entity.js';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity.js';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(LeaveRequest)
    private readonly leaveRepo: Repository<LeaveRequest>,
  ) {}

  async findAllEmployees(): Promise<Employee[]> {
    return this.employeeRepo.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getTodayAttendance(): Promise<AttendanceRecord[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    return this.attendanceRepo
      .createQueryBuilder('att')
      .leftJoinAndSelect('att.employee', 'employee')
      .where('CAST(att.date AS TEXT) = :date', { date: todayStr })
      .orderBy('att.checkIn', 'ASC')
      .getMany();
  }

  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    return this.attendanceRepo
      .createQueryBuilder('att')
      .leftJoinAndSelect('att.employee', 'employee')
      .where('CAST(att.date AS TEXT) = :date', { date })
      .orderBy('att.checkIn', 'ASC')
      .getMany();
  }

  async getLeaveRequests(status?: LeaveStatus): Promise<LeaveRequest[]> {
    const where = status ? { status } : {};
    return this.leaveRepo.find({
      where,
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<{
    totalEmployees: number;
    presentToday: number;
    onLeave: number;
    lateToday: number;
    avgWorkHours: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const [totalEmployees, todayRecords, approvedLeaves] = await Promise.all([
      this.employeeRepo.count({ where: { isActive: true } }),
      this.attendanceRepo
        .createQueryBuilder('att')
        .where('CAST(att.date AS TEXT) = :date', { date: todayStr })
        .getMany(),
      this.leaveRepo.find({ where: { status: LeaveStatus.APPROVED } }),
    ]);

    const presentToday = todayRecords.filter(
      (r) => r.status !== AttendanceStatus.ABSENT,
    ).length;
    const lateToday = todayRecords.filter((r) => r.status === AttendanceStatus.LATE).length;

    const workedRecords = todayRecords.filter((r) => r.workHours != null);
    const avgWorkHours =
      workedRecords.length > 0
        ? workedRecords.reduce((sum, r) => sum + Number(r.workHours), 0) / workedRecords.length
        : 0;

    // Count employees on leave today
    const todayDate = today;
    const onLeave = approvedLeaves.filter((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      return start <= todayDate && end >= todayDate;
    }).length;

    return {
      totalEmployees,
      presentToday,
      onLeave,
      lateToday,
      avgWorkHours: Math.round(avgWorkHours * 100) / 100,
    };
  }
}
