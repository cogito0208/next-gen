'use client';

import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

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

const MOCK_NOTIFICATION_COUNT = 3;

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 flex-shrink-0">
      {/* Search bar */}
      <div className="flex items-center gap-2 w-80 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 group focus-within:border-blue-400 focus-within:bg-white transition-all">
        <Search size={15} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="검색... (⌘K)"
          className="bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400 w-full"
        />
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell size={19} />
            {MOCK_NOTIFICATION_COUNT > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {MOCK_NOTIFICATION_COUNT}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-900">알림</span>
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">모두 읽음</span>
                </div>
                <ul>
                  {[
                    { title: '프로젝트 마감 임박', desc: '신축 아파트 프로젝트 D-3', time: '5분 전', dot: 'bg-orange-400' },
                    { title: '결재 요청', desc: '김철수님의 구매 결재 대기 중', time: '23분 전', dot: 'bg-blue-500' },
                    { title: '재고 부족 경고', desc: '시멘트 재고 20포대 이하', time: '1시간 전', dot: 'bg-red-500' },
                  ].map((n, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                    >
                      <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.dot)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{n.time}</span>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">모든 알림 보기</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.[0] ?? 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-800 leading-tight">{user?.name ?? '사용자'}</p>
              <p className="text-xs text-slate-400 leading-tight">
                {user?.role ? roleLabels[user.role] : ''}
                {user?.department ? ` · ${user.department}` : ''}
              </p>
            </div>
            <ChevronDown size={14} className={cn('text-slate-400 transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <ul className="p-1.5">
                  <li>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <User size={15} className="text-slate-400" />
                      내 프로필
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <Settings size={15} className="text-slate-400" />
                      설정
                    </button>
                  </li>
                  <li className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={15} />
                      로그아웃
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
