'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import { Building2, Eye, EyeOff } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'ceo@kmtls.com', name: '김대표', role: 'CEO' },
  { email: 'pm1@kmtls.com', name: '박프로', role: 'PM' },
  { email: 'hr@kmtls.com', name: '윤인사', role: 'HR팀' },
  { email: 'field@kmtls.com', name: '정현장', role: '현장관리자' },
  { email: 'employee1@kmtls.com', name: '이직원', role: '사원' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? '로그인에 실패했습니다.';
      setError(typeof message === 'string' ? message : '로그인에 실패했습니다.');
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Test1234!');
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">KMTLS</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            기업용 통합<br />그룹웨어
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            건설·제조업 현장 중심의 프로젝트 관리,<br />
            자재관리, 안전관리, CRM을 하나의 플랫폼에서.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: '프로젝트 관리', desc: '실시간 진행 현황' },
            { label: 'CRM', desc: '고객·거래 관리' },
            { label: 'HR 관리', desc: '인력·출퇴근·연차' },
            { label: '전자결재', desc: '워크플로우 자동화' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-800 rounded-xl p-4">
              <div className="text-white font-semibold text-sm mb-1">{item.label}</div>
              <div className="text-slate-400 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-3">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">KMTLS 그룹웨어</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">로그인</h2>
            <p className="mt-1 text-sm text-slate-500">계정에 로그인하여 업무를 시작하세요.</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@kmtls.com"
                required
                className={cn(
                  'w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all',
                  'border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10',
                  'placeholder-slate-400 text-slate-900 bg-white',
                )}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={cn(
                    'w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all',
                    'border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10',
                    'placeholder-slate-400 text-slate-900 bg-white',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all',
                'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
                'focus:ring-3 focus:ring-blue-500/20 shadow-sm',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-50 px-3 text-slate-400 font-medium">데모 계정 (비밀번호: Test1234!)</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm',
                    'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50',
                    'transition-all cursor-pointer text-left group',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-700">{acc.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-xs">{acc.name}</div>
                      <div className="text-slate-400 text-xs">{acc.email}</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            © 2026 KMTLS Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
