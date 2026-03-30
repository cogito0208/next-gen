export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  position?: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  priority: string;
  progress: number;
  managerName: string;
  clientName?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  taskCount: number;
  completedTaskCount: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigneeName?: string;
  dueDate?: string;
  projectId: string;
  order: number;
}

export interface Customer {
  id: string;
  companyName: string;
  industry: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: string;
  totalDealValue: number;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  ownerName?: string;
  expectedCloseDate?: string;
  customerId: string;
  customer?: Customer;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  email: string;
  department?: string;
  position?: string;
  hireDate: string;
  employmentType: string;
  annualLeaveTotal: number;
  annualLeaveUsed: number;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  status: string;
  employee?: Employee;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: string;
  employee?: Employee;
}

export interface DashboardStats {
  activeProjects: number;
  totalEmployees: number;
  monthlyRevenue: number;
  attendanceRate: number;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerName?: string;
  employeeCount: number;
  color?: string;
}
