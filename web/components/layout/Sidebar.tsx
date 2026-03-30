'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  FileCheck,
  Users,
  FileText,
  UserCircle,
  Network,
  Settings,
  MessageSquare,
  Building2,
} from 'lucide-react';

const roleLabels: Record<string, string> = {
  CEO: '대표이사',
  EXECUTIVE: '임원',
  PM: 'PM',
  FIELD_MANAGER: '현장관리자',
  MATERIAL_TEAM: '자재팀',
  HR_TEAM: 'HR팀',
  EMPLOYEE: '사원',
  CONTRACT_WORKER: '계약직',
  GUEST: '게스트',
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
    ],
  },
  {
    title: '업무관리',
    items: [
      { href: '/projects', label: '프로젝트', icon: FolderKanban },
      { href: '/calendar', label: '일정', icon: Calendar },
      { href: '/approvals', label: '전자결재', icon: FileCheck },
    ],
  },
  {
    title: '고객관리',
    items: [
      { href: '/crm', label: 'CRM', icon: Users },
      { href: '/quotes', label: '견적관리', icon: FileText },
    ],
  },
  {
    title: '인사관리',
    items: [
      { href: '/hr', label: 'HR 관리', icon: UserCircle },
      { href: '/organization', label: '조직도', icon: Network },
    ],
  },
  {
    title: '시스템',
    items: [
      { href: '/users', label: '사용자 관리', icon: Settings },
      { href: '/board', label: '게시판', icon: MessageSquare },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="flex flex-col w-60 h-full bg-slate-900 text-white flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-white/10">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-wide">KMTLS</span>
          <p className="text-xs text-slate-400 leading-none mt-0.5">그룹웨어</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <p className="px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {group.title}
            </p>
            <ul className="space-y-0.5 px-2">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href ||
                  (href !== '/dashboard' && pathname.startsWith(href + '/'));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:bg-white/8 hover:text-slate-200',
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(
                          'flex-shrink-0',
                          isActive ? 'text-white' : 'text-slate-500',
                        )}
                      />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name ?? '사용자'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.role ? roleLabels[user.role] : ''}
              {user?.department ? ` · ${user.department}` : ''}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="온라인" />
        </div>
      </div>
    </aside>
  );
}
