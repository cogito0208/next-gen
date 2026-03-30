import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../modules/user/entities/user.entity.js';
import { Department } from '../modules/organization/entities/department.entity.js';
import { Project, ProjectStatus, ProjectPriority } from '../modules/project/entities/project.entity.js';
import { ProjectTask, TaskStatus, TaskPriority } from '../modules/project/entities/project-task.entity.js';
import { Customer, CustomerStatus, CustomerIndustry } from '../modules/crm/entities/customer.entity.js';
import { Deal, DealStage } from '../modules/crm/entities/deal.entity.js';
import { Employee, EmploymentType } from '../modules/hr/entities/employee.entity.js';
import { AttendanceRecord, AttendanceStatus } from '../modules/hr/entities/attendance.entity.js';
import { LeaveRequest, LeaveType, LeaveStatus } from '../modules/hr/entities/leave-request.entity.js';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectTask)
    private readonly taskRepo: Repository<ProjectTask>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(LeaveRequest)
    private readonly leaveRepo: Repository<LeaveRequest>,
  ) {}

  async seed(): Promise<void> {
    const existingUsers = await this.userRepo.count();
    if (existingUsers > 0) {
      this.logger.log('Database already seeded. Skipping...');
      return;
    }

    this.logger.log('Starting database seeding...');

    const departments = await this.seedDepartments();
    const users = await this.seedUsers();
    const projects = await this.seedProjects();
    await this.seedProjectTasks(projects);
    const customers = await this.seedCustomers();
    await this.seedDeals(customers);
    const employees = await this.seedEmployees(users);
    await this.seedAttendanceRecords(employees);
    await this.seedLeaveRequests(employees);

    this.logger.log('Database seeding completed successfully!');
  }

  private async seedDepartments(): Promise<Department[]> {
    this.logger.log('Seeding departments...');

    const departmentsData = [
      { name: '경영지원팀', description: '전사 경영 지원 및 총무', managerName: '김대표', employeeCount: 3, color: '#6366F1' },
      { name: 'IT개발팀', description: '소프트웨어 개발 및 시스템 운영', managerName: '박프로', employeeCount: 5, color: '#8B5CF6' },
      { name: '영업팀', description: '고객 영업 및 CRM 관리', managerName: '김사원', employeeCount: 4, color: '#EC4899' },
      { name: '현장관리팀', description: '건설 현장 관리 및 감독', managerName: '최매니저', employeeCount: 6, color: '#F59E0B' },
      { name: '자재관리팀', description: '자재 입출고 및 재고 관리', managerName: '강자재', employeeCount: 3, color: '#10B981' },
      { name: 'HR팀', description: '인사 채용 교육 급여 관리', managerName: '윤인사', employeeCount: 3, color: '#3B82F6' },
      { name: '재무팀', description: '재무 회계 및 예산 관리', managerName: '이임원', employeeCount: 2, color: '#EF4444' },
      { name: '기획팀', description: '전략 기획 및 신사업 개발', managerName: '이임원', employeeCount: 2, color: '#14B8A6' },
    ];

    const departments: Department[] = [];
    for (const data of departmentsData) {
      const dept = this.departmentRepo.create(data);
      departments.push(await this.departmentRepo.save(dept));
    }

    return departments;
  }

  private async seedUsers(): Promise<User[]> {
    this.logger.log('Seeding users...');

    const hashedPassword = await bcrypt.hash('Test1234!', 10);

    const usersData = [
      { email: 'ceo@kmtls.com', name: '김대표', role: UserRole.CEO, department: '경영지원팀', position: '대표이사' },
      { email: 'executive@kmtls.com', name: '이임원', role: UserRole.EXECUTIVE, department: '경영지원팀', position: '전무이사' },
      { email: 'pm1@kmtls.com', name: '박프로', role: UserRole.PM, department: 'IT개발팀', position: '팀장' },
      { email: 'pm2@kmtls.com', name: '최매니저', role: UserRole.PM, department: '현장관리팀', position: '팀장' },
      { email: 'field@kmtls.com', name: '정현장', role: UserRole.FIELD_MANAGER, department: '현장관리팀', position: '현장소장' },
      { email: 'material@kmtls.com', name: '강자재', role: UserRole.MATERIAL_TEAM, department: '자재관리팀', position: '팀장' },
      { email: 'hr@kmtls.com', name: '윤인사', role: UserRole.HR_TEAM, department: 'HR팀', position: '팀장' },
      { email: 'employee1@kmtls.com', name: '이직원', role: UserRole.EMPLOYEE, department: 'IT개발팀', position: '개발자' },
      { email: 'employee2@kmtls.com', name: '김사원', role: UserRole.EMPLOYEE, department: '영업팀', position: '영업사원' },
      { email: 'employee3@kmtls.com', name: '한사원', role: UserRole.EMPLOYEE, department: '현장관리팀', position: '현장직원' },
    ];

    const users: User[] = [];
    for (const data of usersData) {
      const user = this.userRepo.create({
        ...data,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
        phone: '010-0000-0000',
      });
      users.push(await this.userRepo.save(user));
    }

    return users;
  }

  private async seedProjects(): Promise<Project[]> {
    this.logger.log('Seeding projects...');

    const projectsData = [
      {
        name: '강남 오피스 빌딩 신축',
        description: '강남구 역삼동 오피스 빌딩 신축 공사. 지하 5층, 지상 20층 규모.',
        status: ProjectStatus.ACTIVE,
        priority: ProjectPriority.HIGH,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2026-06-30'),
        budget: 5000000000,
        progress: 65,
        managerName: '박프로',
        clientName: '삼성건설',
        taskCount: 5,
        completedTaskCount: 3,
      },
      {
        name: '인천 물류센터 증축',
        description: '인천 서구 물류센터 증축 공사. 기존 면적의 1.5배 규모로 확장.',
        status: ProjectStatus.ACTIVE,
        priority: ProjectPriority.MEDIUM,
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-12-31'),
        budget: 3000000000,
        progress: 30,
        managerName: '최매니저',
        clientName: '롯데건설',
        taskCount: 4,
        completedTaskCount: 1,
      },
      {
        name: '서울 IT 시스템 개발',
        description: '스마트 건설 현장 관리 시스템 개발. IoT 센서 및 AI 분석 기능 포함.',
        status: ProjectStatus.ACTIVE,
        priority: ProjectPriority.HIGH,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2026-04-30'),
        budget: 800000000,
        progress: 80,
        managerName: '박프로',
        clientName: 'LG IT솔루션',
        taskCount: 5,
        completedTaskCount: 4,
      },
      {
        name: '부산 공장 리모델링',
        description: '부산 사상구 제조 공장 전면 리모델링. 스마트 팩토리 설비 도입.',
        status: ProjectStatus.COMPLETED,
        priority: ProjectPriority.MEDIUM,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-12-31'),
        budget: 2500000000,
        progress: 100,
        managerName: '최매니저',
        clientName: '현대제조',
        taskCount: 3,
        completedTaskCount: 3,
      },
      {
        name: '대전 사무단지 조성',
        description: '대전 유성구 IT 사무단지 조성. 5개동 규모, 입주사 유치 포함.',
        status: ProjectStatus.DELAYED,
        priority: ProjectPriority.CRITICAL,
        startDate: new Date('2025-05-01'),
        endDate: new Date('2026-09-30'),
        budget: 8000000000,
        progress: 20,
        managerName: '박프로',
        clientName: '포스코건설',
        taskCount: 3,
        completedTaskCount: 0,
      },
    ];

    const projects: Project[] = [];
    for (const data of projectsData) {
      const project = this.projectRepo.create(data);
      projects.push(await this.projectRepo.save(project));
    }

    return projects;
  }

  private async seedProjectTasks(projects: Project[]): Promise<void> {
    this.logger.log('Seeding project tasks...');

    const tasksData = [
      // 강남 오피스 빌딩 신축 (projects[0])
      { title: '기초 설계 완료', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '정현장', order: 1, projectIndex: 0 },
      { title: '철근 콘크리트 공사', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '한사원', order: 2, projectIndex: 0 },
      { title: '외벽 마감 공사', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, assigneeName: '정현장', order: 3, projectIndex: 0 },
      { title: '내부 인테리어', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, assigneeName: '정현장', order: 4, projectIndex: 0 },
      { title: '최종 검수 및 준공', status: TaskStatus.TODO, priority: TaskPriority.CRITICAL, assigneeName: '최매니저', order: 5, projectIndex: 0 },

      // 인천 물류센터 증축 (projects[1])
      { title: '부지 측량 및 인허가', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '최매니저', order: 1, projectIndex: 1 },
      { title: '기초 공사', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, assigneeName: '한사원', order: 2, projectIndex: 1 },
      { title: '구조물 설치', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, assigneeName: '정현장', order: 3, projectIndex: 1 },
      { title: '지붕 및 외벽 시공', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, assigneeName: '정현장', order: 4, projectIndex: 1 },

      // 서울 IT 시스템 개발 (projects[2])
      { title: '요구사항 분석', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '박프로', order: 1, projectIndex: 2 },
      { title: '시스템 설계', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '이직원', order: 2, projectIndex: 2 },
      { title: '백엔드 개발', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '이직원', order: 3, projectIndex: 2 },
      { title: '프론트엔드 개발', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.MEDIUM, assigneeName: '이직원', order: 4, projectIndex: 2 },
      { title: '테스트 및 배포', status: TaskStatus.REVIEW, priority: TaskPriority.HIGH, assigneeName: '박프로', order: 5, projectIndex: 2 },

      // 부산 공장 리모델링 (projects[3])
      { title: '기존 설비 철거', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '정현장', order: 1, projectIndex: 3 },
      { title: '신규 설비 설치', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeName: '강자재', order: 2, projectIndex: 3 },
      { title: '시운전 및 검수', status: TaskStatus.DONE, priority: TaskPriority.CRITICAL, assigneeName: '최매니저', order: 3, projectIndex: 3 },

      // 대전 사무단지 조성 (projects[4])
      { title: '마스터플랜 수립', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.CRITICAL, assigneeName: '박프로', order: 1, projectIndex: 4 },
      { title: '인허가 취득', status: TaskStatus.TODO, priority: TaskPriority.CRITICAL, assigneeName: '최매니저', order: 2, projectIndex: 4 },
      { title: '착공 준비', status: TaskStatus.TODO, priority: TaskPriority.HIGH, assigneeName: '정현장', order: 3, projectIndex: 4 },
    ];

    const dueBase = new Date('2026-06-30');
    for (const data of tasksData) {
      const { projectIndex, ...taskData } = data;
      const task = this.taskRepo.create({
        ...taskData,
        projectId: projects[projectIndex].id,
        dueDate: dueBase,
      });
      await this.taskRepo.save(task);
    }
  }

  private async seedCustomers(): Promise<Customer[]> {
    this.logger.log('Seeding customers...');

    const customersData = [
      { companyName: '삼성건설', industry: CustomerIndustry.CONSTRUCTION, contactName: '이건설', contactEmail: 'lee@samsung-const.com', contactPhone: '02-1234-5678', address: '서울시 강남구 테헤란로 123', status: CustomerStatus.ACTIVE, totalDealValue: 15000000000, notes: '주요 파트너사. 건설 대형 프로젝트 우선 협력' },
      { companyName: '현대제조', industry: CustomerIndustry.MANUFACTURING, contactName: '박제조', contactEmail: 'park@hyundai-mfg.com', contactPhone: '02-2345-6789', address: '서울시 서초구 서초대로 456', status: CustomerStatus.ACTIVE, totalDealValue: 8000000000, notes: '스마트 팩토리 전환 프로젝트 진행 중' },
      { companyName: 'LG IT솔루션', industry: CustomerIndustry.IT, contactName: '김아이티', contactEmail: 'kim@lg-it.com', contactPhone: '02-3456-7890', address: '서울시 영등포구 여의도동 789', status: CustomerStatus.ACTIVE, totalDealValue: 3000000000, notes: 'IT 시스템 개발 파트너' },
      { companyName: '롯데건설', industry: CustomerIndustry.CONSTRUCTION, contactName: '최롯데', contactEmail: 'choi@lotte-const.com', contactPhone: '02-4567-8901', address: '서울시 송파구 올림픽로 101', status: CustomerStatus.PROSPECT, totalDealValue: 0, notes: '신규 프로젝트 제안 단계' },
      { companyName: 'SK하이닉스', industry: CustomerIndustry.MANUFACTURING, contactName: '정하이닉스', contactEmail: 'jung@sk-hynix.com', contactPhone: '031-1234-5678', address: '경기도 이천시 SK하이닉스로 1', status: CustomerStatus.ACTIVE, totalDealValue: 12000000000, notes: '반도체 공장 건설 파트너' },
      { companyName: '포스코건설', industry: CustomerIndustry.CONSTRUCTION, contactName: '강포스코', contactEmail: 'kang@posco-const.com', contactPhone: '02-5678-9012', address: '서울시 강남구 영동대로 234', status: CustomerStatus.ACTIVE, totalDealValue: 20000000000, notes: '대형 개발 사업 공동 수행' },
      { companyName: 'KT&G', industry: CustomerIndustry.OTHER, contactName: '윤케이티', contactEmail: 'yoon@ktng.com', contactPhone: '02-6789-0123', address: '서울시 마포구 마포대로 567', status: CustomerStatus.INACTIVE, totalDealValue: 500000000, notes: '2024년 이후 거래 없음' },
      { companyName: '한화건설', industry: CustomerIndustry.CONSTRUCTION, contactName: '한화건', contactEmail: 'han@hanwha-const.com', contactPhone: '02-7890-1234', address: '서울시 중구 청계천로 890', status: CustomerStatus.PROSPECT, totalDealValue: 0, notes: '2026년 신규 프로젝트 협의 중' },
    ];

    const customers: Customer[] = [];
    for (const data of customersData) {
      const customer = this.customerRepo.create(data);
      customers.push(await this.customerRepo.save(customer));
    }

    return customers;
  }

  private async seedDeals(customers: Customer[]): Promise<void> {
    this.logger.log('Seeding deals...');

    const dealsData = [
      { title: '강남 오피스 신축 본계약', value: 5000000000, stage: DealStage.CLOSED_WON, probability: 100, ownerName: '김사원', expectedCloseDate: new Date('2025-03-01'), customerIndex: 0 },
      { title: '삼성건설 물류창고 프로젝트', value: 3500000000, stage: DealStage.NEGOTIATION, probability: 75, ownerName: '김사원', expectedCloseDate: new Date('2026-05-30'), customerIndex: 0 },
      { title: '현대제조 스마트팩토리 2단계', value: 4000000000, stage: DealStage.PROPOSAL, probability: 60, ownerName: '김사원', expectedCloseDate: new Date('2026-07-31'), customerIndex: 1 },
      { title: '현대제조 생산라인 리모델링', value: 2000000000, stage: DealStage.CLOSED_WON, probability: 100, ownerName: '박프로', expectedCloseDate: new Date('2025-06-30'), customerIndex: 1 },
      { title: 'LG IT 통합관제시스템', value: 800000000, stage: DealStage.CLOSED_WON, probability: 100, ownerName: '박프로', expectedCloseDate: new Date('2025-01-15'), customerIndex: 2 },
      { title: 'LG IT 차세대 시스템 업그레이드', value: 600000000, stage: DealStage.LEAD, probability: 30, ownerName: '김사원', expectedCloseDate: new Date('2026-09-30'), customerIndex: 2 },
      { title: '롯데건설 주거복합단지 개발', value: 15000000000, stage: DealStage.LEAD, probability: 20, ownerName: '김사원', expectedCloseDate: new Date('2027-03-31'), customerIndex: 3 },
      { title: 'SK하이닉스 반도체 공장 증설', value: 12000000000, stage: DealStage.NEGOTIATION, probability: 80, ownerName: '박프로', expectedCloseDate: new Date('2026-06-30'), customerIndex: 4 },
      { title: '포스코건설 대전 사무단지', value: 8000000000, stage: DealStage.CLOSED_WON, probability: 100, ownerName: '김사원', expectedCloseDate: new Date('2025-05-01'), customerIndex: 5 },
      { title: '포스코건설 산업단지 조성', value: 25000000000, stage: DealStage.PROPOSAL, probability: 50, ownerName: '박프로', expectedCloseDate: new Date('2026-12-31'), customerIndex: 5 },
      { title: 'KT&G 사옥 리모델링', value: 500000000, stage: DealStage.CLOSED_LOST, probability: 0, ownerName: '김사원', expectedCloseDate: new Date('2024-12-31'), customerIndex: 6 },
      { title: '한화건설 주택 개발 사업', value: 10000000000, stage: DealStage.LEAD, probability: 25, ownerName: '김사원', expectedCloseDate: new Date('2027-06-30'), customerIndex: 7 },
    ];

    for (const data of dealsData) {
      const { customerIndex, ...dealData } = data;
      const deal = this.dealRepo.create({
        ...dealData,
        customerId: customers[customerIndex].id,
      });
      await this.dealRepo.save(deal);
    }
  }

  private async seedEmployees(users: User[]): Promise<Employee[]> {
    this.logger.log('Seeding employees...');

    const employeesData = [
      { userIndex: 0, position: '대표이사', hireDate: new Date('2018-01-01'), salary: 80000000, annualLeaveTotal: 20, annualLeaveUsed: 5, phone: '010-1111-1111' },
      { userIndex: 1, position: '전무이사', hireDate: new Date('2019-03-01'), salary: 60000000, annualLeaveTotal: 18, annualLeaveUsed: 3, phone: '010-2222-2222' },
      { userIndex: 2, position: '팀장', hireDate: new Date('2020-07-01'), salary: 55000000, annualLeaveTotal: 15, annualLeaveUsed: 7, phone: '010-3333-3333' },
      { userIndex: 3, position: '팀장', hireDate: new Date('2020-04-01'), salary: 53000000, annualLeaveTotal: 15, annualLeaveUsed: 4, phone: '010-4444-4444' },
      { userIndex: 4, position: '현장소장', hireDate: new Date('2021-01-15'), salary: 48000000, annualLeaveTotal: 15, annualLeaveUsed: 6, phone: '010-5555-5555' },
      { userIndex: 5, position: '팀장', hireDate: new Date('2021-06-01'), salary: 45000000, annualLeaveTotal: 15, annualLeaveUsed: 2, phone: '010-6666-6666' },
      { userIndex: 6, position: '팀장', hireDate: new Date('2022-02-01'), salary: 47000000, annualLeaveTotal: 15, annualLeaveUsed: 8, phone: '010-7777-7777' },
      { userIndex: 7, position: '개발자', hireDate: new Date('2022-08-01'), salary: 42000000, annualLeaveTotal: 15, annualLeaveUsed: 3, phone: '010-8888-8888' },
      { userIndex: 8, position: '영업사원', hireDate: new Date('2023-03-01'), salary: 38000000, annualLeaveTotal: 15, annualLeaveUsed: 5, phone: '010-9999-9999' },
      { userIndex: 9, position: '현장직원', hireDate: new Date('2023-09-01'), salary: 36000000, annualLeaveTotal: 15, annualLeaveUsed: 1, phone: '010-0000-1111' },
    ];

    const employees: Employee[] = [];
    for (const data of employeesData) {
      const { userIndex, ...empData } = data;
      const user = users[userIndex];
      const employee = this.employeeRepo.create({
        ...empData,
        userId: user.id,
        name: user.name,
        email: user.email,
        department: user.department ?? '',
        employmentType: EmploymentType.FULL_TIME,
        isActive: true,
      });
      employees.push(await this.employeeRepo.save(employee));
    }

    return employees;
  }

  private async seedAttendanceRecords(employees: Employee[]): Promise<void> {
    this.logger.log('Seeding attendance records...');

    const statuses = [
      AttendanceStatus.NORMAL,
      AttendanceStatus.NORMAL,
      AttendanceStatus.NORMAL,
      AttendanceStatus.NORMAL,
      AttendanceStatus.NORMAL,
      AttendanceStatus.LATE,
      AttendanceStatus.REMOTE,
    ];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const status = statuses[i % statuses.length];
        const isAbsent = i === 9 && dayOffset === 2; // one employee absent 2 days ago

        if (isAbsent) {
          const record = this.attendanceRepo.create({
            employeeId: employee.id,
            date: date,
            status: AttendanceStatus.ABSENT,
          });
          await this.attendanceRepo.save(record);
          continue;
        }

        const checkInHour = status === AttendanceStatus.LATE ? 9 : 8;
        const checkInMinute = status === AttendanceStatus.LATE ? 30 : Math.floor(Math.random() * 30);
        const checkOutHour = 17 + Math.floor(Math.random() * 2);
        const checkOutMinute = Math.floor(Math.random() * 60);

        const checkIn = `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}:00`;
        const checkOut = `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMinute).padStart(2, '0')}:00`;
        const workHours =
          checkOutHour - checkInHour + (checkOutMinute - checkInMinute) / 60;

        const record = this.attendanceRepo.create({
          employeeId: employee.id,
          date: date,
          checkIn,
          checkOut,
          workHours: Math.round(workHours * 100) / 100,
          status,
        });
        await this.attendanceRepo.save(record);
      }
    }
  }

  private async seedLeaveRequests(employees: Employee[]): Promise<void> {
    this.logger.log('Seeding leave requests...');

    const leaveData = [
      { employeeIndex: 2, type: LeaveType.ANNUAL, startDate: new Date('2026-04-07'), endDate: new Date('2026-04-09'), days: 3, reason: '가족 여행', status: LeaveStatus.APPROVED },
      { employeeIndex: 4, type: LeaveType.SICK, startDate: new Date('2026-03-28'), endDate: new Date('2026-03-29'), days: 2, reason: '병원 치료', status: LeaveStatus.APPROVED },
      { employeeIndex: 6, type: LeaveType.ANNUAL, startDate: new Date('2026-04-14'), endDate: new Date('2026-04-18'), days: 5, reason: '개인 휴가', status: LeaveStatus.PENDING },
      { employeeIndex: 7, type: LeaveType.PERSONAL, startDate: new Date('2026-04-01'), endDate: new Date('2026-04-01'), days: 1, reason: '개인 사정', status: LeaveStatus.APPROVED },
      { employeeIndex: 8, type: LeaveType.ANNUAL, startDate: new Date('2026-05-05'), endDate: new Date('2026-05-06'), days: 2, reason: '어린이날 연계 휴가', status: LeaveStatus.PENDING },
      { employeeIndex: 9, type: LeaveType.SICK, startDate: new Date('2026-03-25'), endDate: new Date('2026-03-26'), days: 2, reason: '감기', status: LeaveStatus.APPROVED },
      { employeeIndex: 3, type: LeaveType.ANNUAL, startDate: new Date('2026-03-20'), endDate: new Date('2026-03-21'), days: 2, reason: '연차 사용', status: LeaveStatus.APPROVED },
      { employeeIndex: 5, type: LeaveType.OTHER, startDate: new Date('2026-04-10'), endDate: new Date('2026-04-10'), days: 1, reason: '교육 참석', status: LeaveStatus.REJECTED },
    ];

    for (const data of leaveData) {
      const { employeeIndex, ...leaveItem } = data;
      const leave = this.leaveRepo.create({
        ...leaveItem,
        employeeId: employees[employeeIndex].id,
      });
      await this.leaveRepo.save(leave);
    }
  }
}
