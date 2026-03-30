'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutGrid,
  List,
  Plus,
  Filter,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Calendar,
  User,
  CheckSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { projectApi } from '@/services/api.service';
import { Project, ProjectTask } from '@/types';
import { cn } from '@/lib/utils';

// --- Mock data ---
const MOCK_PROJECTS: Project[] = [
  { id: '1', name: '신축 아파트 단지 A동', status: 'IN_PROGRESS', priority: 'HIGH', progress: 68, managerName: '이지훈', clientName: '현대건설', budget: 1_200_000_000, taskCount: 45, completedTaskCount: 31, startDate: '2025-11-01', endDate: '2026-06-30' },
  { id: '2', name: '물류창고 리모델링', status: 'IN_PROGRESS', priority: 'MEDIUM', progress: 42, managerName: '박소연', clientName: 'CJ대한통운', budget: 480_000_000, taskCount: 28, completedTaskCount: 12, startDate: '2026-01-10', endDate: '2026-05-31' },
  { id: '3', name: '오피스 인테리어 공사', status: 'REVIEW', priority: 'LOW', progress: 90, managerName: '최민준', clientName: '카카오', budget: 230_000_000, taskCount: 20, completedTaskCount: 18, startDate: '2026-02-15', endDate: '2026-04-15' },
  { id: '4', name: '공장 설비 교체', status: 'TODO', priority: 'HIGH', progress: 5, managerName: '김하늘', clientName: 'LG전자', budget: 750_000_000, taskCount: 35, completedTaskCount: 2, startDate: '2026-04-01', endDate: '2026-09-30' },
  { id: '5', name: '데이터센터 증설 공사', status: 'DONE', priority: 'HIGH', progress: 100, managerName: '정다은', clientName: 'KT', budget: 2_100_000_000, taskCount: 60, completedTaskCount: 60, startDate: '2025-06-01', endDate: '2026-01-31' },
  { id: '6', name: '병원 리노베이션', status: 'IN_PROGRESS', priority: 'MEDIUM', progress: 55, managerName: '한승우', clientName: '서울아산병원', budget: 900_000_000, taskCount: 38, completedTaskCount: 21, startDate: '2026-01-15', endDate: '2026-08-31' },
];

const MOCK_TASKS: Record<string, ProjectTask[]> = {
  '1': [
    { id: 't1', title: '기초 콘크리트 타설', status: 'DONE', priority: 'HIGH', assigneeName: '이지훈', dueDate: '2026-02-28', projectId: '1', order: 1 },
    { id: 't2', title: '철근 배근 작업', status: 'IN_PROGRESS', priority: 'HIGH', assigneeName: '박민수', dueDate: '2026-03-31', projectId: '1', order: 2 },
    { id: 't3', title: '외벽 마감재 선정', status: 'TODO', priority: 'MEDIUM', assigneeName: '최지영', dueDate: '2026-04-15', projectId: '1', order: 3 },
    { id: 't4', title: '전기 배선 설계 검토', status: 'REVIEW', priority: 'MEDIUM', assigneeName: '김성훈', dueDate: '2026-04-01', projectId: '1', order: 4 },
    { id: 't5', title: '옥상 방수 처리', status: 'TODO', priority: 'LOW', assigneeName: undefined, dueDate: '2026-05-01', projectId: '1', order: 5 },
    { id: 't6', title: '엘리베이터 설치 일정 확인', status: 'TODO', priority: 'HIGH', assigneeName: '이지훈', dueDate: '2026-05-15', projectId: '1', order: 6 },
  ],
};

// --- Helpers ---
const formatKRW = (value: number) => `₩${(value / 100000000).toFixed(1)}억`;

const statusMap: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'default' | 'purple' | 'error' }> = {
  TODO: { label: '대기', variant: 'default' },
  IN_PROGRESS: { label: '진행중', variant: 'info' },
  REVIEW: { label: '검토중', variant: 'purple' },
  DONE: { label: '완료', variant: 'success' },
  ON_HOLD: { label: '보류', variant: 'warning' },
};

const priorityMap: Record<string, { label: string; variant: 'error' | 'warning' | 'default' }> = {
  HIGH: { label: '높음', variant: 'error' },
  MEDIUM: { label: '보통', variant: 'warning' },
  LOW: { label: '낮음', variant: 'default' },
};

const kanbanColumns = [
  { key: 'TODO', label: 'TODO', color: 'bg-slate-100 text-slate-600' },
  { key: 'IN_PROGRESS', label: '진행중', color: 'bg-blue-100 text-blue-700' },
  { key: 'REVIEW', label: '검토중', color: 'bg-purple-100 text-purple-700' },
  { key: 'DONE', label: '완료', color: 'bg-emerald-100 text-emerald-700' },
];

const priorityColors: Record<string, string> = {
  HIGH: 'border-l-red-500',
  MEDIUM: 'border-l-amber-400',
  LOW: 'border-l-slate-300',
};

function KanbanView({ projectId, tasks, onTaskMove }: {
  projectId: string;
  tasks: ProjectTask[];
  onTaskMove: (taskId: string, newStatus: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {kanbanColumns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="flex flex-col min-h-64">
            <div className={cn('flex items-center justify-between px-3 py-2 rounded-lg mb-3', col.color)}>
              <span className="text-xs font-semibold">{col.label}</span>
              <span className="text-xs font-bold">{colTasks.length}</span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    'bg-white border border-slate-200 rounded-xl p-3 shadow-sm border-l-4',
                    priorityColors[task.priority] ?? 'border-l-slate-300',
                  )}
                >
                  <p className="text-sm font-medium text-slate-800 mb-2 leading-snug">{task.title}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {task.assigneeName && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <User size={11} />
                          <span>{task.assigneeName}</span>
                        </div>
                      )}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={11} />
                        <span>{task.dueDate.slice(5)}</span>
                      </div>
                    )}
                  </div>
                  {/* Move buttons */}
                  <div className="flex gap-1 mt-2">
                    {col.key !== 'TODO' && (
                      <button
                        onClick={() => {
                          const idx = kanbanColumns.findIndex((c) => c.key === col.key);
                          if (idx > 0) onTaskMove(task.id, kanbanColumns[idx - 1].key);
                        }}
                        className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded border border-slate-100 hover:border-slate-300 transition-colors"
                      >
                        <ChevronLeft size={10} />
                        이전
                      </button>
                    )}
                    {col.key !== 'DONE' && (
                      <button
                        onClick={() => {
                          const idx = kanbanColumns.findIndex((c) => c.key === col.key);
                          if (idx < kanbanColumns.length - 1) onTaskMove(task.id, kanbanColumns[idx + 1].key);
                        }}
                        className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded border border-slate-100 hover:border-slate-300 transition-colors"
                      >
                        다음
                        <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {colTasks.length === 0 && (
                <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center py-8">
                  <span className="text-xs text-slate-300">없음</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [tasks, setTasks] = useState<Record<string, ProjectTask[]>>(MOCK_TASKS);

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll().then((r) => r.data?.data as Project[]),
    retry: 1,
  });

  const allProjects: Project[] = projectsQuery.data ?? (projectsQuery.isError ? MOCK_PROJECTS : []);

  const filteredProjects = allProjects.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && p.priority !== priorityFilter) return false;
    return true;
  });

  const handleTaskMove = (taskId: string, newStatus: string) => {
    if (!selectedProjectId) return;
    setTasks((prev) => ({
      ...prev,
      [selectedProjectId]: (prev[selectedProjectId] ?? []).map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t,
      ),
    }));
  };

  const selectedProject = allProjects.find((p) => p.id === selectedProjectId);
  const selectedTasks = selectedProjectId ? (tasks[selectedProjectId] ?? []) : [];

  return (
    <div>
      <PageHeader
        title="프로젝트 관리"
        subtitle="프로젝트 진행 현황을 관리합니다."
        breadcrumb={[{ label: '홈', href: '/dashboard' }, { label: '프로젝트' }]}
        actions={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={15} />
            새 프로젝트
          </button>
        }
      />

      {/* Filters + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Filter size={14} />
            <span>필터:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
          >
            <option value="ALL">전체 상태</option>
            <option value="TODO">대기</option>
            <option value="IN_PROGRESS">진행중</option>
            <option value="REVIEW">검토중</option>
            <option value="DONE">완료</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
          >
            <option value="ALL">전체 우선순위</option>
            <option value="HIGH">높음</option>
            <option value="MEDIUM">보통</option>
            <option value="LOW">낮음</option>
          </select>
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <List size={14} />
            목록
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <LayoutGrid size={14} />
            칸반
          </button>
        </div>
      </div>

      {/* Error state */}
      {projectsQuery.isError && !MOCK_PROJECTS.length && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm">데이터를 불러오지 못했습니다.</p>
          <button onClick={() => projectsQuery.refetch()} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <RefreshCw size={13} /> 다시 시도
          </button>
        </div>
      )}

      {/* Loading */}
      {projectsQuery.isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-5" />
              <div className="h-2 bg-slate-100 rounded-full mb-4" />
              <div className="flex gap-2">
                <div className="h-5 bg-slate-100 rounded w-16" />
                <div className="h-5 bg-slate-100 rounded w-12" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view: project cards grid */}
      {!projectsQuery.isLoading && viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const statusInfo = statusMap[project.status] ?? { label: project.status, variant: 'default' as const };
            const priorityInfo = priorityMap[project.priority] ?? { label: project.priority, variant: 'default' as const };
            const isSelected = selectedProjectId === project.id;

            return (
              <div
                key={project.id}
                className={cn(
                  'bg-white rounded-xl border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                  isSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200',
                )}
                onClick={() => {
                  setSelectedProjectId(isSelected ? null : project.id);
                  if (!isSelected) setViewMode('kanban');
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug flex-1 mr-2">
                    {project.name}
                  </h3>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>

                {project.clientName && (
                  <p className="text-xs text-slate-500 mb-3">{project.clientName}</p>
                )}

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>진행률</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{project.managerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckSquare size={12} />
                      <span>{project.completedTaskCount}/{project.taskCount}</span>
                    </div>
                  </div>
                  <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
                </div>

                {project.budget && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>예산</span>
                    <span className="font-medium text-slate-600">{formatKRW(project.budget)}</span>
                  </div>
                )}

                {(project.startDate || project.endDate) && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                    <Calendar size={11} />
                    <span>{project.startDate} ~ {project.endDate}</span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-400">
              <FolderKanbanEmpty />
              <p className="text-sm mt-3">조건에 맞는 프로젝트가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* Kanban view */}
      {!projectsQuery.isLoading && viewMode === 'kanban' && (
        <div>
          {/* Project selector */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-slate-500">프로젝트 선택:</span>
            {allProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors',
                  selectedProjectId === p.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600',
                )}
              >
                {p.name}
              </button>
            ))}
          </div>

          {selectedProject ? (
            <div>
              <div className="flex items-center gap-3 mb-4 p-4 bg-white rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{selectedProject.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    담당자: {selectedProject.managerName} · 진행률 {selectedProject.progress}%
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge variant={statusMap[selectedProject.status]?.variant ?? 'default'}>
                    {statusMap[selectedProject.status]?.label ?? selectedProject.status}
                  </Badge>
                </div>
              </div>
              <KanbanView
                projectId={selectedProject.id}
                tasks={selectedTasks}
                onTaskMove={handleTaskMove}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-xl border border-slate-200">
              <LayoutGrid size={32} className="mb-3 text-slate-300" />
              <p className="text-sm">위에서 프로젝트를 선택하세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FolderKanbanEmpty() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
