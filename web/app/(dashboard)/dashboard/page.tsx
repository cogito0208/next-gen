'use client';

import { useQuery } from '@tanstack/react-query';
import {
  FolderKanban,
  Users,
  TrendingUp,
  UserCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/auth.store';
import { dashboardApi, projectApi, crmApi, hrApi } from '@/services/api.service';
import { Project, Deal, AttendanceRecord, DashboardStats } from '@/types';
import { cn } from '@/lib/utils';

const formatKRW = (value: number) => `₩${(value / 100000000).toFixed(1)}억`;
const formatNumber = (n: number) => n.toLocaleString('ko-KR');

const today = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

// --- Mock fallback data ---
const MOCK_STATS: DashboardStats = {
  activeProjects: 12,
  totalEmployees: 87,
  monthlyRevenue: 2_450_000_000,
  attendanceRate: 94,
};

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: '신축 아파트 단지 A동',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    progress: 68,
    managerName: '이지훈',
    clientName: '현대건설',
    taskCount: 45,
    completedTaskCount: 31,
    startDate: '2025-11-01',
    endDate: '2026-06-30',
  },
  {
    id: '2',
    name: '물류창고 리모델링',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    progress: 42,
    managerName: '박소연',
    clientName: 'CJ대한통운',
    taskCount: 28,
    completedTaskCount: 12,
    startDate: '2026-01-10',
    endDate: '2026-05-31',
  },
  {
    id: '3',
    name: '오피스 인테리어 공사',
    status: 'REVIEW',
    priority: 'LOW',
    progress: 90,
    managerName: '최민준',
    clientName: '카카오',
    taskCount: 20,
    completedTaskCount: 18,
    startDate: '2026-02-15',
    endDate: '2026-04-15',
  },
  {
    id: '4',
    name: '공장 설비 교체',
    status: 'TODO',
    priority: 'HIGH',
    progress: 5,
    managerName: '김하늘',
    clientName: 'LG전자',
    taskCount: 35,
    completedTaskCount: 2,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
  },
];

const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: '신규 오피스 시공 계약',
    value: 850_000_000,
    stage: 'NEGOTIATION',
    probability: 75,
    ownerName: '김철수',
    expectedCloseDate: '2026-04-15',
    customerId: 'c1',
    customer: { id: 'c1', companyName: '삼성물산', industry: '건설', status: 'ACTIVE', totalDealValue: 3_200_000_000 },
  },
  {
    id: '2',
    title: '공장 리모델링 제안',
    value: 420_000_000,
    stage: 'PROPOSAL',
    probability: 50,
    ownerName: '이영희',
    expectedCloseDate: '2026-05-01',
    customerId: 'c2',
    customer: { id: 'c2', companyName: '포스코', industry: '제조', status: 'ACTIVE', totalDealValue: 1_800_000_000 },
  },
  {
    id: '3',
    title: '물류센터 구조 보강',
    value: 190_000_000,
    stage: 'CLOSED_WON',
    probability: 100,
    ownerName: '박민수',
    expectedCloseDate: '2026-03-20',
    customerId: 'c3',
    customer: { id: 'c3', companyName: '롯데글로벌로지스', industry: '물류', status: 'ACTIVE', totalDealValue: 950_000_000 },
  },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', employeeId: 'e1', date: '2026-03-30', checkIn: '08:52', checkOut: undefined, workHours: undefined, status: 'PRESENT', employee: { id: 'e1', userId: 'u1', name: '이지훈', email: '', department: '시공팀', position: 'PM', hireDate: '', employmentType: 'FULL_TIME', annualLeaveTotal: 15, annualLeaveUsed: 3, isActive: true } },
  { id: '2', employeeId: 'e2', date: '2026-03-30', checkIn: '09:15', checkOut: undefined, workHours: undefined, status: 'LATE', employee: { id: 'e2', userId: 'u2', name: '박소연', email: '', department: '설계팀', position: '과장', hireDate: '', employmentType: 'FULL_TIME', annualLeaveTotal: 15, annualLeaveUsed: 5, isActive: true } },
  { id: '3', employeeId: 'e3', date: '2026-03-30', checkIn: '08:45', checkOut: undefined, workHours: undefined, status: 'PRESENT', employee: { id: 'e3', userId: 'u3', name: '최민준', email: '', department: '영업팀', position: '대리', hireDate: '', employmentType: 'FULL_TIME', annualLeaveTotal: 15, annualLeaveUsed: 7, isActive: true } },
  { id: '4', employeeId: 'e4', date: '2026-03-30', checkIn: undefined, checkOut: undefined, workHours: undefined, status: 'ABSENT', employee: { id: 'e4', userId: 'u4', name: '김하늘', email: '', department: '자재팀', position: '사원', hireDate: '', employmentType: 'FULL_TIME', annualLeaveTotal: 15, annualLeaveUsed: 10, isActive: true } },
  { id: '5', employeeId: 'e5', date: '2026-03-30', checkIn: '08:55', checkOut: undefined, workHours: undefined, status: 'REMOTE', employee: { id: 'e5', userId: 'u5', name: '정다은', email: '', department: 'HR팀', position: '차장', hireDate: '', employmentType: 'FULL_TIME', annualLeaveTotal: 15, annualLeaveUsed: 2, isActive: true } },
];

// --- Status helpers ---
const projectStatusMap: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'default' | 'purple' }> = {
  TODO: { label: '대기', variant: 'default' },
  IN_PROGRESS: { label: '진행중', variant: 'info' },
  REVIEW: { label: '검토중', variant: 'purple' },
  DONE: { label: '완료', variant: 'success' },
  ON_HOLD: { label: '보류', variant: 'warning' },
};

const dealStageMap: Record<string, { label: string; variant: 'default' | 'info' | 'warning' | 'success' | 'error' | 'purple' }> = {
  LEAD: { label: '리드', variant: 'default' },
  PROPOSAL: { label: '제안', variant: 'info' },
  NEGOTIATION: { label: '협상', variant: 'warning' },
  CLOSED_WON: { label: '성사', variant: 'success' },
  CLOSED_LOST: { label: '실패', variant: 'error' },
};

const attendanceStatusMap: Record<string, { label: string; color: string }> = {
  PRESENT: { label: '출근', color: 'text-emerald-600 bg-emerald-50' },
  LATE: { label: '지각', color: 'text-amber-600 bg-amber-50' },
  ABSENT: { label: '결근', color: 'text-red-600 bg-red-50' },
  REMOTE: { label: '재택', color: 'text-blue-600 bg-blue-50' },
  LEAVE: { label: '휴가', color: 'text-purple-600 bg-purple-50' },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div>
          <div className="h-3 bg-slate-200 rounded w-24 mb-2" />
          <div className="h-7 bg-slate-200 rounded w-16" />
        </div>
        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-32" />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
      <AlertCircle size={32} className="text-red-400" />
      <p className="text-sm font-medium">데이터를 불러오지 못했습니다.</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <RefreshCw size={13} />
        다시 시도
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const statsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data?.data as DashboardStats),
    retry: 1,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll().then((r) => r.data?.data as Project[]),
    retry: 1,
  });

  const dealsQuery = useQuery({
    queryKey: ['crm-deals'],
    queryFn: () => crmApi.getDeals().then((r) => r.data?.data as Deal[]),
    retry: 1,
  });

  const attendanceQuery = useQuery({
    queryKey: ['hr-attendance-today'],
    queryFn: () => hrApi.getTodayAttendance().then((r) => r.data?.data as AttendanceRecord[]),
    retry: 1,
  });

  const stats = statsQuery.data ?? (statsQuery.isError ? MOCK_STATS : null);
  const projects = projectsQuery.data ?? (projectsQuery.isError ? MOCK_PROJECTS : []);
  const deals = dealsQuery.data ?? (dealsQuery.isError ? MOCK_DEALS : []);
  const attendance = attendanceQuery.data ?? (attendanceQuery.isError ? MOCK_ATTENDANCE : []);

  // Project status distribution for chart
  const projectStatusCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const chartSegments = [
    { label: '진행중', count: projectStatusCounts['IN_PROGRESS'] ?? 0, color: '#2563EB' },
    { label: '검토중', count: projectStatusCounts['REVIEW'] ?? 0, color: '#8B5CF6' },
    { label: '완료', count: projectStatusCounts['DONE'] ?? 0, color: '#10B981' },
    { label: '대기', count: projectStatusCounts['TODO'] ?? 0, color: '#94A3B8' },
  ];
  const totalProjects = chartSegments.reduce((s, x) => s + x.count, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            안녕하세요, {user?.name ?? '사용자'}님 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
            <RefreshCw size={14} />
            새로고침
          </button>
        </div>
      </div>

      {/* Row 1: Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stats ? (
          <>
            <StatCard
              title="진행중 프로젝트"
              value={formatNumber(stats.activeProjects)}
              subtitle="전체 프로젝트 기준"
              icon={<FolderKanban size={20} />}
              trend={{ value: 8, label: '지난달 대비' }}
              color="blue"
            />
            <StatCard
              title="전체 직원 수"
              value={formatNumber(stats.totalEmployees)}
              subtitle="정규직 · 계약직 포함"
              icon={<Users size={20} />}
              trend={{ value: 3, label: '지난달 대비' }}
              color="green"
            />
            <StatCard
              title="이번달 매출"
              value={formatKRW(stats.monthlyRevenue)}
              subtitle="3월 누적 매출"
              icon={<TrendingUp size={20} />}
              trend={{ value: 12, label: '전월 대비' }}
              color="purple"
            />
            <StatCard
              title="오늘 출근률"
              value={`${stats.attendanceRate}%`}
              subtitle={`${Math.round(stats.totalEmployees * stats.attendanceRate / 100)}명 / ${stats.totalEmployees}명`}
              icon={<UserCheck size={20} />}
              trend={{ value: -2, label: '어제 대비' }}
              color="yellow"
            />
          </>
        ) : (
          <div className="col-span-4">
            <ErrorState onRetry={() => statsQuery.refetch()} />
          </div>
        )}
      </div>

      {/* Row 2: Recent projects + Project status chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent projects table */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">최근 프로젝트</h2>
            <a href="/projects" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
              전체보기 <ArrowRight size={12} />
            </a>
          </div>
          {projectsQuery.isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {projects.slice(0, 5).map((project) => {
                const statusInfo = projectStatusMap[project.status] ?? { label: project.status, variant: 'default' as const };
                return (
                  <div key={project.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-medium text-slate-800 truncate">{project.name}</span>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{project.managerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 w-8 text-right">
                        {project.progress}%
                      </span>
                    </div>
                    {project.clientName && (
                      <p className="text-xs text-slate-400 mt-1">{project.clientName}</p>
                    )}
                  </div>
                );
              })}
              {projects.length === 0 && (
                <div className="px-5 py-12 text-center text-slate-400 text-sm">
                  프로젝트가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Project status donut chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">프로젝트 현황</h2>
          </div>
          <div className="p-5">
            {/* CSS donut chart */}
            <div className="flex justify-center mb-5">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {(() => {
                    let offset = 0;
                    return chartSegments.map((seg, i) => {
                      const pct = (seg.count / totalProjects) * 100;
                      const el = (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.9155"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${pct} ${100 - pct}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-500"
                        />
                      );
                      offset += pct;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">{totalProjects}</span>
                  <span className="text-xs text-slate-400">전체</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {chartSegments.map((seg) => (
                <li key={seg.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-slate-600">{seg.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{seg.count}</span>
                    <span className="text-xs text-slate-400 w-8 text-right">
                      {Math.round((seg.count / totalProjects) * 100)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Row 3: Recent deals + Attendance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent deals */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">최근 거래</h2>
            <a href="/crm" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
              전체보기 <ArrowRight size={12} />
            </a>
          </div>
          {dealsQuery.isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {deals.slice(0, 4).map((deal) => {
                const stageInfo = dealStageMap[deal.stage] ?? { label: deal.stage, variant: 'default' as const };
                return (
                  <div key={deal.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{deal.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {deal.customer?.companyName} · {deal.ownerName}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatKRW(deal.value)}
                        </p>
                        <Badge variant={stageInfo.variant} className="mt-0.5">
                          {stageInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              {deals.length === 0 && (
                <div className="px-5 py-12 text-center text-slate-400 text-sm">
                  거래 내역이 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today attendance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">오늘 출퇴근 현황</h2>
            <a href="/hr" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
              전체보기 <ArrowRight size={12} />
            </a>
          </div>
          {attendanceQuery.isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {attendance.slice(0, 6).map((record) => {
                const statusInfo = attendanceStatusMap[record.status] ?? { label: record.status, color: 'text-slate-600 bg-slate-50' };
                return (
                  <div key={record.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                        {record.employee?.name?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{record.employee?.name}</p>
                        <p className="text-xs text-slate-400">{record.employee?.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xs text-slate-500">
                        {record.checkIn ? `${record.checkIn} 출근` : '-'}
                      </span>
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-md', statusInfo.color)}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {attendance.length === 0 && (
                <div className="px-5 py-12 text-center text-slate-400 text-sm">
                  출퇴근 데이터가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
