'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Network,
  Building2,
  TrendingUp,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { organizationApi } from '@/services/api.service';
import { Department } from '@/types';
import { cn } from '@/lib/utils';

// --- Mock data ---
const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: '시공팀', description: '현장 시공 및 공사 관리', managerName: '한승우', employeeCount: 18, color: '#2563EB' },
  { id: 'd2', name: '설계팀', description: '건축 설계 및 도면 관리', managerName: '박소연', employeeCount: 12, color: '#8B5CF6' },
  { id: 'd3', name: '영업팀', description: '고객 발굴 및 계약 관리', managerName: '임도현', employeeCount: 10, color: '#10B981' },
  { id: 'd4', name: '자재팀', description: '자재 구매 및 재고 관리', managerName: '정다은', employeeCount: 8, color: '#F59E0B' },
  { id: 'd5', name: 'HR팀', description: '인사관리 및 채용', managerName: '정다은', employeeCount: 5, color: '#EF4444' },
  { id: 'd6', name: '재무팀', description: '회계 및 재무 관리', managerName: '오승현', employeeCount: 6, color: '#06B6D4' },
  { id: 'd7', name: '경영지원팀', description: '경영 전략 및 기획', managerName: '이상진', employeeCount: 4, color: '#64748B' },
];

const MOCK_MEMBERS: Record<string, { name: string; position: string; email: string; isManager?: boolean }[]> = {
  'd1': [
    { name: '한승우', position: '부장', email: 'seungwoo@kmtls.com', isManager: true },
    { name: '이지훈', position: 'PM', email: 'jihoon@kmtls.com' },
    { name: '김민수', position: '과장', email: 'minsu@kmtls.com' },
    { name: '박준서', position: '대리', email: 'junso@kmtls.com' },
    { name: '최유진', position: '사원', email: 'yujin@kmtls.com' },
  ],
  'd2': [
    { name: '박소연', position: '과장', email: 'soyeon@kmtls.com', isManager: true },
    { name: '오채원', position: '사원', email: 'chaewon@kmtls.com' },
    { name: '이현준', position: '대리', email: 'hyunjun@kmtls.com' },
  ],
  'd3': [
    { name: '임도현', position: '과장', email: 'dohyun@kmtls.com', isManager: true },
    { name: '최민준', position: '대리', email: 'minjun@kmtls.com' },
    { name: '강서연', position: '사원', email: 'seoyeon@kmtls.com' },
  ],
  'd4': [
    { name: '정다은', position: '차장', email: 'daeun@kmtls.com', isManager: true },
    { name: '김하늘', position: '사원', email: 'haneul@kmtls.com' },
  ],
  'd5': [
    { name: '정다은', position: '차장', email: 'daeun@kmtls.com', isManager: true },
    { name: '김유리', position: '사원', email: 'yuri@kmtls.com' },
  ],
  'd6': [
    { name: '오승현', position: '차장', email: 'asan@kmtls.com', isManager: true },
    { name: '황도연', position: '대리', email: 'doyeon@kmtls.com' },
  ],
  'd7': [
    { name: '이상진', position: '이사', email: 'sangjin@kmtls.com', isManager: true },
    { name: '박지훈', position: '과장', email: 'jihun@kmtls.com' },
  ],
};

// Circular progress SVG
function CircularProgress({ value, color, size = 56 }: { value: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}

export default function OrganizationPage() {
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const deptQuery = useQuery({
    queryKey: ['org-departments'],
    queryFn: () => organizationApi.getDepartments().then((r) => r.data?.data as Department[]),
    retry: 1,
  });

  const departments: Department[] = deptQuery.data ?? (deptQuery.isError ? MOCK_DEPARTMENTS : []);

  const totalEmployees = departments.reduce((s, d) => s + d.employeeCount, 0);

  // Fake completion rates
  const completionRates: Record<string, number> = {
    d1: 74, d2: 88, d3: 62, d4: 91, d5: 55, d6: 70, d7: 83,
  };

  return (
    <div>
      <PageHeader
        title="조직도"
        subtitle="부서 및 인력 현황을 확인합니다."
        breadcrumb={[{ label: '홈', href: '/dashboard' }, { label: '조직도' }]}
        actions={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={15} />
            부서 추가
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="전체 부서"
          value={departments.length}
          icon={<Building2 size={18} />}
          color="blue"
        />
        <StatCard
          title="전체 인원"
          value={totalEmployees}
          subtitle="전 부서 합계"
          icon={<Users size={18} />}
          color="green"
        />
        <StatCard
          title="평균 팀 규모"
          value={departments.length ? Math.round(totalEmployees / departments.length) : 0}
          subtitle="명/팀"
          icon={<Network size={18} />}
          color="purple"
        />
        <StatCard
          title="평균 완료율"
          value={`${departments.length ? Math.round(Object.values(completionRates).reduce((s, v) => s + v, 0) / Object.values(completionRates).length) : 0}%`}
          subtitle="전 부서 업무 기준"
          icon={<TrendingUp size={18} />}
          color="yellow"
        />
      </div>

      {/* Error state */}
      {deptQuery.isError && !departments.length && (
        <div className="flex flex-col items-center py-12 gap-3 text-slate-400">
          <AlertCircle size={28} className="text-red-400" />
          <p className="text-sm">데이터를 불러오지 못했습니다.</p>
          <button onClick={() => deptQuery.refetch()} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
            <RefreshCw size={13} /> 다시 시도
          </button>
        </div>
      )}

      {/* Loading */}
      {deptQuery.isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-2/3 mb-4" />
              <div className="h-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Department cards */}
      {!deptQuery.isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const isExpanded = expandedDept === dept.id;
            const members = MOCK_MEMBERS[dept.id] ?? [];
            const completion = completionRates[dept.id] ?? 0;
            const deptColor = dept.color ?? '#2563EB';

            return (
              <div
                key={dept.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Card header */}
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${deptColor}18` }}
                      >
                        <Building2 size={18} style={{ color: deptColor }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{dept.name}</h3>
                        {dept.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{dept.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Circular progress */}
                    <div className="relative flex-shrink-0">
                      <CircularProgress value={completion} color={deptColor} size={52} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold" style={{ color: deptColor }}>
                          {completion}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} />
                        <span>{dept.employeeCount}명</span>
                      </div>
                      {dept.managerName && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300">|</span>
                          <span>팀장: {dept.managerName}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{isExpanded ? '접기' : '멤버 보기'}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 pb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>업무 완료율</span>
                    <span className="font-medium" style={{ color: deptColor }}>{completion}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%`, backgroundColor: deptColor }}
                    />
                  </div>
                </div>

                {/* Member list (expandable) */}
                {isExpanded && (
                  <div className="border-t border-slate-100">
                    <div className="px-5 py-3 bg-slate-50">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        팀원 ({members.length}명)
                      </p>
                    </div>
                    <ul className="divide-y divide-slate-50">
                      {members.map((member, i) => (
                        <li key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                              style={{ backgroundColor: deptColor }}
                            >
                              {member.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                                {member.name}
                                {member.isManager && (
                                  <Badge variant="info" className="text-[10px]">팀장</Badge>
                                )}
                              </p>
                              <p className="text-xs text-slate-400">{member.email}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500">{member.position}</span>
                        </li>
                      ))}
                      {members.length === 0 && (
                        <li className="px-5 py-6 text-center text-xs text-slate-400">
                          팀원 정보가 없습니다.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Org chart teaser */}
      {!deptQuery.isLoading && departments.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">조직 구조도</h2>
          <div className="flex flex-col items-center gap-4">
            {/* CEO */}
            <div className="bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm">
              대표이사 (CEO)
            </div>
            <div className="w-0.5 h-5 bg-slate-300" />
            {/* Departments row */}
            <div className="flex flex-wrap justify-center gap-3">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-0.5 h-4 bg-slate-300" />
                  <div
                    className="text-xs font-medium px-4 py-2 rounded-xl border-2 text-white"
                    style={{ backgroundColor: dept.color ?? '#2563EB', borderColor: dept.color ?? '#2563EB' }}
                  >
                    {dept.name}
                  </div>
                  <span className="text-[10px] text-slate-400">{dept.employeeCount}명</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
