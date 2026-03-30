'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  CalendarDays,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { hrApi } from '@/services/api.service';
import { Employee, AttendanceRecord, LeaveRequest } from '@/types';
import { cn } from '@/lib/utils';

// --- Mock data ---
const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', userId: 'u1', name: '이지훈', email: 'jihoon@kmtls.com', department: '시공팀', position: 'PM', hireDate: '2021-03-15', employmentType: 'FULL_TIME', annualLeaveTotal: 15, annualLeaveUsed: 3, isActive: true },
  { id: 'e2', userId: 'u2', name: '박소연', email: 'soyeon@kmtls.com', department: '설계팀', position: '과장', hireDate: '2019-08-20', employmentType: 'FULL_TIME', annualLeaveTotal: 18, annualLeaveUsed: 7, isActive: true },
  { id: 'e3', userId: 'u3', name: '최민준', email: 'minjun@kmtls.com', department: '영업팀', position: '대리', hireDate: '2022-11-01', employmentType: 'FULL_TIME', annualLeaveTotal: 12, annualLeaveUsed: 5, isActive: true },
  { id: 'e4', userId: 'u4', name: '김하늘', email: 'haneul@kmtls.com', department: '자재팀', position: '사원', hireDate: '2023-04-10', employmentType: 'FULL_TIME', annualLeaveTotal: 11, annualLeaveUsed: 2, isActive: true },
  { id: 'e5', userId: 'u5', name: '정다은', email: 'daeun@kmtls.com', department: 'HR팀', position: '차장', hireDate: '2017-06-25', employmentType: 'FULL_TIME', annualLeaveTotal: 20, annualLeaveUsed: 10, isActive: true },
  { id: 'e6', userId: 'u6', name: '한승우', email: 'seungwoo@kmtls.com', department: '시공팀', position: '부장', hireDate: '2015-02-14', employmentType: 'FULL_TIME', annualLeaveTotal: 22, annualLeaveUsed: 14, isActive: true },
  { id: 'e7', userId: 'u7', name: '오채원', email: 'chaewon@kmtls.com', department: '설계팀', position: '사원', hireDate: '2024-01-08', employmentType: 'CONTRACT', annualLeaveTotal: 10, annualLeaveUsed: 1, isActive: true },
  { id: 'e8', userId: 'u8', name: '임도현', email: 'dohyun@kmtls.com', department: '영업팀', position: '과장', hireDate: '2020-09-01', employmentType: 'FULL_TIME', annualLeaveTotal: 16, annualLeaveUsed: 8, isActive: false },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', employeeId: 'e1', date: '2026-03-30', checkIn: '08:52', checkOut: undefined, workHours: undefined, status: 'PRESENT', employee: MOCK_EMPLOYEES[0] },
  { id: 'a2', employeeId: 'e2', date: '2026-03-30', checkIn: '09:18', checkOut: undefined, workHours: undefined, status: 'LATE', employee: MOCK_EMPLOYEES[1] },
  { id: 'a3', employeeId: 'e3', date: '2026-03-30', checkIn: '08:45', checkOut: undefined, workHours: undefined, status: 'PRESENT', employee: MOCK_EMPLOYEES[2] },
  { id: 'a4', employeeId: 'e4', date: '2026-03-30', checkIn: undefined, checkOut: undefined, workHours: undefined, status: 'ABSENT', employee: MOCK_EMPLOYEES[3] },
  { id: 'a5', employeeId: 'e5', date: '2026-03-30', checkIn: '08:55', checkOut: undefined, workHours: undefined, status: 'REMOTE', employee: MOCK_EMPLOYEES[4] },
  { id: 'a6', employeeId: 'e6', date: '2026-03-30', checkIn: '08:30', checkOut: undefined, workHours: undefined, status: 'PRESENT', employee: MOCK_EMPLOYEES[5] },
  { id: 'a7', employeeId: 'e7', date: '2026-03-30', checkIn: undefined, checkOut: undefined, workHours: undefined, status: 'LEAVE', employee: MOCK_EMPLOYEES[6] },
];

const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'l1', employeeId: 'e7', type: '연차', startDate: '2026-03-30', endDate: '2026-04-01', days: 3, reason: '개인 사유', status: 'APPROVED', employee: MOCK_EMPLOYEES[6] },
  { id: 'l2', employeeId: 'e3', type: '반차', startDate: '2026-04-03', endDate: '2026-04-03', days: 0.5, reason: '병원 방문', status: 'PENDING', employee: MOCK_EMPLOYEES[2] },
  { id: 'l3', employeeId: 'e2', type: '연차', startDate: '2026-04-07', endDate: '2026-04-08', days: 2, reason: undefined, status: 'PENDING', employee: MOCK_EMPLOYEES[1] },
  { id: 'l4', employeeId: 'e1', type: '경조사', startDate: '2026-04-10', endDate: '2026-04-11', days: 2, reason: '결혼', status: 'APPROVED', employee: MOCK_EMPLOYEES[0] },
  { id: 'l5', employeeId: 'e4', type: '병가', startDate: '2026-03-25', endDate: '2026-03-26', days: 2, reason: '독감', status: 'APPROVED', employee: MOCK_EMPLOYEES[3] },
  { id: 'l6', employeeId: 'e5', type: '연차', startDate: '2026-04-15', endDate: '2026-04-15', days: 1, reason: '여행', status: 'REJECTED', employee: MOCK_EMPLOYEES[4] },
];

// --- Helpers ---
const employmentTypeMap: Record<string, string> = {
  FULL_TIME: '정규직',
  CONTRACT: '계약직',
  PART_TIME: '파트타임',
  INTERN: '인턴',
};

const attendanceStatusMap: Record<string, { label: string; color: string }> = {
  PRESENT: { label: '정상', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  LATE: { label: '지각', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  ABSENT: { label: '결근', color: 'text-red-700 bg-red-50 border-red-200' },
  REMOTE: { label: '재택', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  LEAVE: { label: '휴가', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  EARLY_LEAVE: { label: '조퇴', color: 'text-orange-700 bg-orange-50 border-orange-200' },
};

const leaveStatusMap: Record<string, { label: string; variant: 'warning' | 'success' | 'error' | 'default' }> = {
  PENDING: { label: '대기중', variant: 'warning' },
  APPROVED: { label: '승인', variant: 'success' },
  REJECTED: { label: '반려', variant: 'error' },
};

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'leaves'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-03-30');
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);

  const employeesQuery = useQuery({
    queryKey: ['hr-employees'],
    queryFn: () => hrApi.getEmployees().then((r) => r.data?.data as Employee[]),
    retry: 1,
  });

  const attendanceQuery = useQuery({
    queryKey: ['hr-attendance-today'],
    queryFn: () => hrApi.getTodayAttendance().then((r) => r.data?.data as AttendanceRecord[]),
    retry: 1,
  });

  const leavesQuery = useQuery({
    queryKey: ['hr-leaves'],
    queryFn: () => hrApi.getLeaves().then((r) => r.data?.data as LeaveRequest[]),
    retry: 1,
  });

  const employees: Employee[] = employeesQuery.data ?? (employeesQuery.isError ? MOCK_EMPLOYEES : []);
  const attendance: AttendanceRecord[] = attendanceQuery.data ?? (attendanceQuery.isError ? MOCK_ATTENDANCE : []);
  const leaveData: LeaveRequest[] = leavesQuery.data ?? (leavesQuery.isError ? leaves : leaves);

  const activeEmployees = employees.filter((e) => e.isActive);
  const presentToday = attendance.filter((a) => ['PRESENT', 'REMOTE'].includes(a.status)).length;
  const onLeaveToday = attendance.filter((a) => a.status === 'LEAVE').length;
  const lateToday = attendance.filter((a) => a.status === 'LATE').length;

  const filteredEmployees = employees.filter((e) =>
    !searchQuery ||
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.department ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLeaveAction = (leaveId: string, action: 'APPROVED' | 'REJECTED') => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: action } : l)),
    );
  };

  return (
    <div>
      <PageHeader
        title="HR 관리"
        subtitle="인사, 출퇴근, 휴가를 통합 관리합니다."
        breadcrumb={[{ label: '홈', href: '/dashboard' }, { label: 'HR 관리' }]}
        actions={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={15} />
            직원 추가
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="전체 직원"
          value={activeEmployees.length}
          subtitle="활성 직원 기준"
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard
          title="오늘 출근"
          value={presentToday}
          subtitle={`출근률 ${Math.round((presentToday / (attendance.length || 1)) * 100)}%`}
          icon={<UserCheck size={18} />}
          color="green"
        />
        <StatCard
          title="휴가 중"
          value={onLeaveToday}
          subtitle="오늘 기준"
          icon={<CalendarDays size={18} />}
          color="purple"
        />
        <StatCard
          title="지각"
          value={lateToday}
          subtitle="오늘 기준"
          icon={<Clock size={18} />}
          color="yellow"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        {[
          { key: 'employees', label: '직원 목록' },
          { key: 'attendance', label: '출퇴근 현황' },
          { key: 'leaves', label: '휴가 관리' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              'px-5 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Employees tab */}
      {activeTab === 'employees' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 max-w-sm bg-white border border-slate-200 rounded-xl px-3 py-2">
              <Search size={15} className="text-slate-400" />
              <input
                type="text"
                placeholder="이름, 부서 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400 w-full"
              />
            </div>
          </div>

          {employeesQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['직원', '부서', '직급', '고용형태', '입사일', '연차현황', '상태'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {emp.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{emp.department ?? '-'}</td>
                      <td className="px-4 py-3.5 text-slate-600">{emp.position ?? '-'}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={emp.employmentType === 'FULL_TIME' ? 'info' : 'default'}>
                          {employmentTypeMap[emp.employmentType] ?? emp.employmentType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs">{emp.hireDate}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{
                                width: `${Math.round((emp.annualLeaveUsed / emp.annualLeaveTotal) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {emp.annualLeaveUsed}/{emp.annualLeaveTotal}일
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={emp.isActive ? 'success' : 'default'}>
                          {emp.isActive ? '재직' : '퇴직'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Attendance tab */}
      {activeTab === 'attendance' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-slate-600 font-medium">날짜:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
            />
          </div>

          {attendanceQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['직원', '출근시간', '퇴근시간', '근무시간', '상태'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendance.map((record) => {
                    const statusInfo = attendanceStatusMap[record.status] ?? { label: record.status, color: 'text-slate-600 bg-slate-50 border-slate-200' };
                    return (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                              {record.employee?.name?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{record.employee?.name ?? '-'}</p>
                              <p className="text-xs text-slate-400">{record.employee?.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">
                          {record.checkIn ?? <span className="text-slate-300">-</span>}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {record.checkOut ?? <span className="text-slate-300">-</span>}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {record.workHours ? `${record.workHours}h` : <span className="text-slate-300">-</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn('text-xs font-medium px-2.5 py-1 rounded-lg border', statusInfo.color)}>
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                        출퇴근 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Leaves tab */}
      {activeTab === 'leaves' && (
        <div>
          {leavesQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['직원', '유형', '기간', '일수', '사유', '상태', '처리'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leaveData.map((leave) => {
                    const statusInfo = leaveStatusMap[leave.status] ?? { label: leave.status, variant: 'default' as const };
                    return (
                      <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                              {leave.employee?.name?.[0] ?? '?'}
                            </div>
                            <span className="font-medium text-slate-800">{leave.employee?.name ?? '-'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{leave.type}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                          {leave.startDate} ~ {leave.endDate}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{leave.days}일</td>
                        <td className="px-4 py-3.5 text-slate-500 text-xs max-w-32 truncate">
                          {leave.reason ?? '-'}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          {leave.status === 'PENDING' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleLeaveAction(leave.id, 'APPROVED')}
                                className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                              >
                                <CheckCircle size={12} />
                                승인
                              </button>
                              <button
                                onClick={() => handleLeaveAction(leave.id, 'REJECTED')}
                                className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <XCircle size={12} />
                                반려
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">처리완료</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {leaveData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        휴가 신청 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
