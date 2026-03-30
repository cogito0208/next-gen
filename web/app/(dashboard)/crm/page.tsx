'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { crmApi } from '@/services/api.service';
import { Customer, Deal } from '@/types';
import { cn } from '@/lib/utils';

// --- Mock data ---
const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', companyName: '삼성물산', industry: '건설', contactName: '김민준', contactEmail: 'minjun@samsung.com', contactPhone: '010-1234-5678', status: 'ACTIVE', totalDealValue: 3_200_000_000 },
  { id: 'c2', companyName: '포스코', industry: '제조', contactName: '이서연', contactEmail: 'seoyeon@posco.com', contactPhone: '010-2345-6789', status: 'ACTIVE', totalDealValue: 1_800_000_000 },
  { id: 'c3', companyName: '롯데글로벌로지스', industry: '물류', contactName: '박지훈', contactEmail: 'jihun@lotte.com', contactPhone: '010-3456-7890', status: 'ACTIVE', totalDealValue: 950_000_000 },
  { id: 'c4', companyName: 'CJ대한통운', industry: '물류', contactName: '최하은', contactEmail: 'haeun@cj.net', contactPhone: '010-4567-8901', status: 'ACTIVE', totalDealValue: 480_000_000 },
  { id: 'c5', companyName: 'KT', industry: 'IT/통신', contactName: '정도현', contactEmail: 'dohyun@kt.com', contactPhone: '010-5678-9012', status: 'INACTIVE', totalDealValue: 2_100_000_000 },
  { id: 'c6', companyName: 'LG전자', industry: '제조', contactName: '한지민', contactEmail: 'jimin@lg.com', contactPhone: '010-6789-0123', status: 'ACTIVE', totalDealValue: 750_000_000 },
  { id: 'c7', companyName: '서울아산병원', industry: '의료', contactName: '오승현', contactEmail: 'asan@asan.or.kr', contactPhone: '010-7890-1234', status: 'ACTIVE', totalDealValue: 900_000_000 },
  { id: 'c8', companyName: '카카오', industry: 'IT/통신', contactName: '임채원', contactEmail: 'chaewon@kakao.com', contactPhone: '010-8901-2345', status: 'PROSPECT', totalDealValue: 230_000_000 },
];

const MOCK_DEALS: Deal[] = [
  { id: 'd1', title: '신규 오피스 시공 계약', value: 850_000_000, stage: 'NEGOTIATION', probability: 75, ownerName: '김철수', expectedCloseDate: '2026-04-15', customerId: 'c1', customer: MOCK_CUSTOMERS[0] },
  { id: 'd2', title: '공장 리모델링 제안', value: 420_000_000, stage: 'PROPOSAL', probability: 50, ownerName: '이영희', expectedCloseDate: '2026-05-01', customerId: 'c2', customer: MOCK_CUSTOMERS[1] },
  { id: 'd3', title: '물류센터 구조 보강', value: 190_000_000, stage: 'CLOSED_WON', probability: 100, ownerName: '박민수', expectedCloseDate: '2026-03-20', customerId: 'c3', customer: MOCK_CUSTOMERS[2] },
  { id: 'd4', title: '데이터센터 2차 공사', value: 1_200_000_000, stage: 'LEAD', probability: 20, ownerName: '최지영', expectedCloseDate: '2026-06-30', customerId: 'c5', customer: MOCK_CUSTOMERS[4] },
  { id: 'd5', title: '창고 증축 공사', value: 310_000_000, stage: 'NEGOTIATION', probability: 80, ownerName: '정도현', expectedCloseDate: '2026-04-30', customerId: 'c4', customer: MOCK_CUSTOMERS[3] },
  { id: 'd6', title: '공장 설비 교체 컨설팅', value: 95_000_000, stage: 'PROPOSAL', probability: 40, ownerName: '김철수', expectedCloseDate: '2026-05-15', customerId: 'c6', customer: MOCK_CUSTOMERS[5] },
  { id: 'd7', title: '의료장비실 리노베이션', value: 580_000_000, stage: 'CLOSED_LOST', probability: 0, ownerName: '이영희', expectedCloseDate: '2026-03-01', customerId: 'c7', customer: MOCK_CUSTOMERS[6] },
];

// --- Helpers ---
const formatKRW = (value: number) => {
  if (value >= 100_000_000) return `₩${(value / 100_000_000).toFixed(1)}억`;
  if (value >= 10_000) return `₩${(value / 10_000).toFixed(0)}만`;
  return `₩${value.toLocaleString()}`;
};

const customerStatusMap: Record<string, { label: string; variant: 'success' | 'default' | 'info' | 'error' }> = {
  ACTIVE: { label: '활성', variant: 'success' },
  INACTIVE: { label: '비활성', variant: 'default' },
  PROSPECT: { label: '잠재', variant: 'info' },
  CHURNED: { label: '이탈', variant: 'error' },
};

const dealStageMap: Record<string, { label: string; variant: 'default' | 'info' | 'warning' | 'success' | 'error' | 'purple'; color: string }> = {
  LEAD: { label: '리드', variant: 'default', color: 'bg-slate-100' },
  PROPOSAL: { label: '제안', variant: 'info', color: 'bg-blue-50' },
  NEGOTIATION: { label: '협상', variant: 'warning', color: 'bg-amber-50' },
  CLOSED_WON: { label: '성사', variant: 'success', color: 'bg-emerald-50' },
  CLOSED_LOST: { label: '실패', variant: 'error', color: 'bg-red-50' },
};

const pipelineStages = ['LEAD', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'pipeline'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');

  const customersQuery = useQuery({
    queryKey: ['crm-customers'],
    queryFn: () => crmApi.getCustomers().then((r) => r.data?.data as Customer[]),
    retry: 1,
  });

  const dealsQuery = useQuery({
    queryKey: ['crm-deals'],
    queryFn: () => crmApi.getDeals().then((r) => r.data?.data as Deal[]),
    retry: 1,
  });

  const customers: Customer[] = customersQuery.data ?? (customersQuery.isError ? MOCK_CUSTOMERS : []);
  const deals: Deal[] = dealsQuery.data ?? (dealsQuery.isError ? MOCK_DEALS : []);

  const industries = ['ALL', ...Array.from(new Set(customers.map((c) => c.industry)))];

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.contactName ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchIndustry = industryFilter === 'ALL' || c.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  // Stats
  const totalPipelineValue = deals
    .filter((d) => !['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);
  const wonDeals = deals.filter((d) => d.stage === 'CLOSED_WON').length;
  const closedDeals = deals.filter((d) => ['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage)).length;
  const winRate = closedDeals > 0 ? Math.round((wonDeals / closedDeals) * 100) : 0;

  return (
    <div>
      <PageHeader
        title="CRM"
        subtitle="고객사 및 거래 파이프라인을 관리합니다."
        breadcrumb={[{ label: '홈', href: '/dashboard' }, { label: 'CRM' }]}
        actions={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={15} />
            고객 추가
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="전체 고객사"
          value={customers.length}
          subtitle="활성 고객 포함"
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard
          title="활성 거래"
          value={deals.filter((d) => !['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage)).length}
          subtitle="진행 중인 딜"
          icon={<TrendingUp size={18} />}
          color="green"
        />
        <StatCard
          title="파이프라인 가치"
          value={formatKRW(totalPipelineValue)}
          subtitle="진행중 딜 합계"
          icon={<DollarSign size={18} />}
          color="purple"
        />
        <StatCard
          title="성사율"
          value={`${winRate}%`}
          subtitle={`${wonDeals}/${closedDeals} 건 성사`}
          icon={<Target size={18} />}
          color="yellow"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        {[
          { key: 'customers', label: '고객사' },
          { key: 'pipeline', label: '거래 파이프라인' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'customers' | 'pipeline')}
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

      {/* Customers tab */}
      {activeTab === 'customers' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-52 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <Search size={15} className="text-slate-400" />
              <input
                type="text"
                placeholder="회사명, 담당자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400 w-full"
              />
            </div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind === 'ALL' ? '전체 업종' : ind}</option>
              ))}
            </select>
          </div>

          {customersQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : customersQuery.isError && !customers.length ? (
            <div className="flex flex-col items-center py-12 gap-3 text-slate-400">
              <AlertCircle size={28} className="text-red-400" />
              <p className="text-sm">데이터를 불러오지 못했습니다.</p>
              <button onClick={() => customersQuery.refetch()} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                <RefreshCw size={13} />다시 시도
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['회사명', '업종', '담당자', '거래금액', '상태', '등록일'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCustomers.map((customer) => {
                    const statusInfo = customerStatusMap[customer.status] ?? { label: customer.status, variant: 'default' as const };
                    return (
                      <tr key={customer.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                              {customer.companyName[0]}
                            </div>
                            <span className="font-medium text-slate-800">{customer.companyName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{customer.industry}</td>
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="text-slate-700">{customer.contactName ?? '-'}</p>
                            {customer.contactPhone && (
                              <p className="text-xs text-slate-400">{customer.contactPhone}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">
                          {formatKRW(customer.totalDealValue)}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 text-xs">2026-01-15</td>
                      </tr>
                    );
                  })}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
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

      {/* Pipeline tab */}
      {activeTab === 'pipeline' && (
        <div>
          {dealsQuery.isLoading ? (
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 bg-slate-200 rounded-lg animate-pulse" />
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {pipelineStages.map((stage) => {
                const stageInfo = dealStageMap[stage];
                const stageDeals = deals.filter((d) => d.stage === stage);
                const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0);
                return (
                  <div key={stage}>
                    <div className={cn('flex items-center justify-between px-3 py-2 rounded-lg mb-3', stageInfo.color)}>
                      <span className="text-xs font-semibold text-slate-700">{stageInfo.label}</span>
                      <span className="text-xs font-bold text-slate-600">{stageDeals.length}</span>
                    </div>
                    {stageDeals.length > 0 && (
                      <p className="text-xs text-slate-400 mb-2 px-1">
                        합계 {formatKRW(stageTotal)}
                      </p>
                    )}
                    <div className="space-y-2">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <p className="text-xs font-semibold text-slate-800 mb-1 leading-snug">
                            {deal.title}
                          </p>
                          {deal.customer && (
                            <p className="text-xs text-slate-400 mb-2">{deal.customer.companyName}</p>
                          )}
                          <p className="text-sm font-bold text-slate-900 mb-2">
                            {formatKRW(deal.value)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="w-full bg-slate-100 rounded-full h-1 w-16">
                                <div
                                  className="bg-blue-500 h-1 rounded-full"
                                  style={{ width: `${deal.probability}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400">{deal.probability}%</span>
                            </div>
                          </div>
                          {deal.expectedCloseDate && (
                            <p className="text-[10px] text-slate-400 mt-1.5">
                              마감 {deal.expectedCloseDate}
                            </p>
                          )}
                          {deal.ownerName && (
                            <p className="text-[10px] text-slate-400">{deal.ownerName}</p>
                          )}
                        </div>
                      ))}
                      {stageDeals.length === 0 && (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl py-8 flex items-center justify-center">
                          <span className="text-xs text-slate-300">없음</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
