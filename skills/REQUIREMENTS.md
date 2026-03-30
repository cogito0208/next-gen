# 기능 요구사항 명세서

## 프로젝트 개요

**프로젝트명**: KMTLS 기업용 통합 그룹웨어
**목적**: 건설/제조업 현장 중심의 프로젝트 관리, 자재관리, 안전관리, CRM을 통합한 엔터프라이즈 솔루션
**타겟 사용자**: 대표이사, 임원, PM, 현장 관리자, 자재팀, 일반 사원
**핵심 가치**: 안전하고 정확한 프로젝트 수행, 실시간 고객 공유, 웹 기반 UX

## 주요 고객사

- 삼성디스플레이
- LG이노텍
- 삼성SDI
- LG Display
- 원준
- 에드워드
- 주성엔지니어링

## 전체 시스템 구조

### 화면 구조

#### Web - Sidebar Navigation (좌측)

```
┌─────────────────────────────────────────────┐
│  [로고]  [검색]  [날씨] [알림] [프로필]      │ ← 공통 헤더
├────────┬────────────────────────────────────┤
│ 홈     │                                    │
│ CRM    │                                    │
│ 프로젝트│        메인 컨텐츠 영역              │
│ 자재   │                                    │
│ 인력안전│                                    │
│ 업무   │                                    │
│ 전자결재│                                    │
│ 소통   │                                    │
│ 문서함 │                                    │
│ 보고서 │                                    │
│ 설정   │                                    │
└────────┴────────────────────────────────────┘
```


### 메뉴 구조

| 메뉴 | 설명 | 주요 기능 |
|------|------|-----------|
| 홈 (Dashboard) | 직급별 맞춤 대시보드 | KPI, 위젯, 날씨, 뉴스 |
| CRM | 고객 관리 및 견적 | 고객사 관리, 견적서, 프로젝트 생성 |
| 프로젝트 | 프로젝트 진행 관리 | 칸반, Gantt, 인력·자재 배정 |
| 자재관리 | 재고 및 출납 관리 | QR/바코드 스캔, 재고 알림 |
| 인력·안전관리 | 인력 배치 및 안전 점검 | 출퇴근, 안전 체크리스트 |
| HR (인사관리) | 인사 업무 전반 | 채용, 급여, 연차, 인사평가, 교육 |
| 업무 (Task) | 개인·팀 업무 관리 | To-Do, 칸반, 멘션 알림 |
| 전자결재 | 결재 워크플로우 | 견적·구매·비용 결재 |
| 커뮤니케이션 | 메신저·공지 | 채팅, 파일 공유, 공지사항 |
| 문서함 | 중앙 문서 저장소 | 프로젝트별 문서, 버전 관리 |
| 보고서·통계 | 데이터 분석 | 매출, 안전, 완료율 리포트 |
| 설정 | 시스템 관리 | 사용자·권한·조직 관리 |

### 공통 헤더 컴포넌트

```typescript
// 모든 페이지 상단에 표시
interface GlobalHeader {
  search: GlobalSearchBar;        // 전사 검색 (고객·프로젝트·자재·문서)
  weather: WeatherWidget;          // 현장별 날씨 (아산·구미·베트남)
  projectStatus: RealtimeStatus;   // 실시간 프로젝트 상태
  notifications: NotificationBell; // 알림벨 (실시간 푸시)
  profile: UserProfile;            // 직급·부서·로그아웃
}
```

## 권한 관리 (RBAC)

### 역할 정의

| 역할 | 권한 코드 | 대시보드 컴포넌트 | 주요 권한 |
|------|-----------|------------------|-----------|
| 대표이사 | `CEO` | 전체 KPI, 위험 프로젝트, 안전사고 Zero Day | 모든 데이터 열람, 승인 |
| 임원 | `EXECUTIVE` | 부서별 KPI, 예산 현황 | 부서 데이터 열람, 최종 승인 |
| PM (프로젝트 매니저) | `PM` | 담당 프로젝트 진행률, 지연 알림 | 프로젝트 관리, 인력·자재 배정 |
| 현장 관리자 | `FIELD_MANAGER` | 투입 인력, 출결, 안전 점검 | 출퇴근 관리, 안전 체크 |
| 자재팀 | `MATERIAL_TEAM` | 재고 부족 경고, 출고 예정 | 자재 출납, 재고 관리 |
| HR팀 | `HR_TEAM` | 신규 입사자, 연차 현황, 급여 처리 | 채용, 급여, 인사평가, 교육 관리 |
| 일반 사원 | `EMPLOYEE` | 내 업무, 출퇴근 | 본인 업무, 문서 열람 |
| 비정규직/계약직 | `CONTRACT_WORKER` | 출퇴근 현황만 | 출퇴근 체크만 가능 |
| 게스트 (고객) | `GUEST` | - | 공유된 프로젝트만 열람 |

### 권한별 기능 매트릭스

```typescript
// 예시: 권한별 접근 제어
const permissions = {
  CEO: ['*'], // 모든 권한
  EXECUTIVE: [
    'dashboard:read',
    'project:read',
    'approval:final',
    'report:all',
  ],
  PM: [
    'project:read',
    'project:write',
    'project:assign-resource',
    'customer:read',
    'material:read',
  ],
  FIELD_MANAGER: [
    'project:read',
    'attendance:manage',
    'safety:manage',
    'material:request',
  ],
  MATERIAL_TEAM: [
    'material:*',
    'project:read',
  ],
  HR_TEAM: [
    'hr:*',
    'employee:read',
    'employee:write',
    'payroll:*',
    'recruitment:*',
    'evaluation:*',
    'attendance:all',
  ],
  EMPLOYEE: [
    'task:own',
    'attendance:own',
    'document:read',
    'hr:own',              // 본인 인사 정보만
  ],
  CONTRACT_WORKER: [
    'attendance:own',      // 출퇴근만 가능
  ],
  GUEST: [
    'project:shared',
  ],
};
```

## 상세 기능 명세

---

## 1. 로그인 / 인증

### 1.1 로그인 화면

**화면 구성**
- 기업 로고 (KMTLS)
- 슬로건: "안전하고 정확한 프로젝트 수행"
- 로그인 폼
- OAuth 버튼
- 비밀번호 찾기 링크

**기능**

1. **일반 로그인**
   - 아이디 (이메일 또는 사번)
   - 비밀번호
   - 아이디 저장 체크박스
   - 자동 로그인 (선택)

2. **OAuth 로그인**
   - Google Workspace
   - Microsoft Azure AD
   - Kakao Work (KMTLS 내부 메일 연동)

3. **보안 기능**
   - 2차 인증 (OTP) - 선택적 활성화
   - 비밀번호 찾기 (이메일 인증)
   - 계정 잠금 (5회 실패 시)
   - IP 화이트리스트 (관리자 설정)


**API 엔드포인트**

```typescript
POST /api/v1/auth/login
POST /api/v1/auth/oauth/google
POST /api/v1/auth/oauth/microsoft
POST /api/v1/auth/oauth/kakao
POST /api/v1/auth/verify-otp
POST /api/v1/auth/password-reset
```

**화면 플로우**

```
로그인 화면
  ├─ 성공 → 대시보드
  ├─ 2차 인증 필요 → OTP 입력
  ├─ 비밀번호 만료 → 비밀번호 변경
  └─ 실패 → 에러 메시지
```

---

## 2. 대시보드 (Dashboard)

### 2.1 공통 컴포넌트 (모든 직급)

**위젯 목록**

1. **날씨 위젯**
   - 현장별 실시간 날씨
   - 지역: 아산, 구미, 베트남 (하노이/호치민)
   - 표시 정보: 온도, 강수확률, 미세먼지
   - 위험 날씨 알림 (태풍, 폭우 등)

2. **전사 검색창**
   - 통합 검색 (고객·프로젝트·자재·문서·인력)
   - 자동완성 (최근 검색어, 추천 검색어)
   - 단축키: `Cmd+K` (Mac) / `Ctrl+K` (Win)

3. **뉴스레터**
   - KMTLS 내부 소식
   - 업계 뉴스 (RSS 피드)
   - 공지사항 바로가기

4. **알림함**
   - 실시간 푸시 알림
   - 카테고리: 업무, 결재, 안전, 프로젝트
   - 읽음/안읽음 표시
   - 알림 설정 (카테고리별 ON/OFF)

### 2.2 직급별 전용 위젯

#### 대표이사 (CEO)

```typescript
interface CEODashboard {
  // KPI 카드
  kpi: {
    totalRevenue: number;        // 총 매출
    revenueGoal: number;         // 목표 대비 달성률
    activeProjects: number;      // 진행 중 프로젝트
    completionRate: number;      // 완료율
  };

  // 위험 프로젝트 Top 5
  riskProjects: {
    id: string;
    name: string;
    customer: string;
    delayDays: number;           // 지연 일수
    riskLevel: 'high' | 'medium'; // 위험도
    pm: string;
  }[];

  // 안전 관리
  safety: {
    zeroDays: number;            // 무사고 일수
    recentIncidents: Incident[]; // 최근 사고 (있는 경우)
    pendingChecks: number;       // 미완료 안전점검
  };

  // 재무 요약
  finance: {
    monthlyRevenue: number[];    // 월별 매출 (차트용)
    profitMargin: number;        // 영업이익률
    receivables: number;         // 미수금
  };
}
```

**레이아웃**

```
┌─────────────┬─────────────┬─────────────┐
│   총매출    │ 진행프로젝트 │  완료율     │
├─────────────┴─────────────┴─────────────┤
│  위험 프로젝트 Top 5 (테이블)             │
├──────────────────────┬───────────────────┤
│   월별 매출 차트      │  안전사고 Zero Day │
├──────────────────────┴───────────────────┤
│   최근 공지사항 / 뉴스                    │
└──────────────────────────────────────────┘
```

#### PM (프로젝트 매니저)

```typescript
interface PMDashboard {
  // 내 프로젝트 칸반
  myProjects: {
    todo: Project[];
    inProgress: Project[];
    review: Project[];
    completed: Project[];
  };

  // 지연 프로젝트 알림
  delayedProjects: {
    id: string;
    name: string;
    originalDeadline: Date;
    currentDelay: number;        // 지연 일수
    actionRequired: string;
  }[];

  // 투입 인력 현황
  resources: {
    assigned: number;            // 배정된 인력
    available: number;           // 가용 인력
    onLeave: number;            // 휴가 중
  };

  // 이번 주 마일스톤
  milestones: {
    project: string;
    milestone: string;
    dueDate: Date;
    status: 'done' | 'pending' | 'overdue';
  }[];
}
```

**레이아웃**

```
┌─────────────────────────────────────────┐
│  내 프로젝트 (칸반 보드)                  │
│  [To Do] [In Progress] [Review] [Done]  │
├─────────────────────┬───────────────────┤
│  지연 프로젝트 알림   │  투입 인력 현황   │
├─────────────────────┴───────────────────┤
│  이번 주 마일스톤                        │
└─────────────────────────────────────────┘
```

#### 현장 관리자 (Field Manager)

```typescript
interface FieldManagerDashboard {
  // 오늘 출근 인원
  attendance: {
    total: number;
    present: number;
    absent: number;
    late: number;
  };

  // 안전 점검
  safety: {
    pendingChecks: number;       // 미완료 점검
    todayChecks: SafetyCheck[];  // 오늘 점검 항목
    recentIssues: Issue[];       // 최근 위험요소
  };

  // 자재 출납 현황
  materials: {
    todayRequests: MaterialRequest[];
    pendingApprovals: number;
  };

  // 현장 사진
  recentPhotos: {
    url: string;
    project: string;
    uploadedAt: Date;
  }[];
}
```

#### 자재팀 (Material Team)

```typescript
interface MaterialTeamDashboard {
  // 재고 부족 경고
  lowStockAlerts: {
    material: string;
    currentStock: number;
    minimumStock: number;
    urgency: 'critical' | 'warning';
  }[];

  // 출고 예정 자재
  scheduledShipments: {
    material: string;
    quantity: number;
    project: string;
    scheduledDate: Date;
  }[];

  // 입고 대기
  pendingReceipts: {
    purchaseOrder: string;
    supplier: string;
    expectedDate: Date;
  }[];

  // 재고 현황 차트
  stockOverview: {
    category: string;
    quantity: number;
    value: number;
  }[];
}
```

#### HR팀 (HR Team)

```typescript
interface HRTeamDashboard {
  // 신규 입사자 (이번 달)
  newHires: {
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    onboardingStatus: 'pending' | 'in_progress' | 'completed';
  }[];

  // 연차 현황
  annualLeave: {
    pendingRequests: number;      // 승인 대기 중
    todayAbsent: number;          // 오늘 휴가자
    upcomingLeave: {
      employee: string;
      type: '연차' | '반차' | '병가' | '경조사';
      startDate: Date;
      endDate: Date;
    }[];
  };

  // 급여 처리
  payroll: {
    currentMonth: string;
    status: 'preparing' | 'calculated' | 'approved' | 'paid';
    totalEmployees: number;
    processedCount: number;
    deadline: Date;
  };

  // 자격증 만료 예정
  expiringCertifications: {
    employee: string;
    certification: string;
    expiryDate: Date;
    daysRemaining: number;
  }[];

  // 인사평가 진행 현황
  evaluation: {
    season: string;               // 2026년 상반기
    totalEmployees: number;
    completedCount: number;
    deadline: Date;
  };

  // 채용 현황
  recruitment: {
    openPositions: number;        // 진행 중인 채용
    totalApplicants: number;      // 지원자 수
    interviewScheduled: number;   // 면접 예정
  };
}
```

**레이아웃**

```
┌─────────────────────┬───────────────────┐
│  신규 입사자 (3명)   │  연차 승인 대기 (5) │
├─────────────────────┴───────────────────┤
│  이번 달 급여 처리 진행 상황             │
│  [████████▒▒] 80% 완료                  │
├──────────────────────┬───────────────────┤
│  자격증 만료 예정     │  인사평가 현황    │
├──────────────────────┴───────────────────┤
│  채용 진행 현황                          │
└──────────────────────────────────────────┘
```

#### 일반 사원 (Employee)

```typescript
interface EmployeeDashboard {
  // 내 업무
  myTasks: {
    todo: Task[];
    inProgress: Task[];
    completed: Task[];
  };

  // 출퇴근 현황
  attendance: {
    today: 'checked-in' | 'checked-out' | 'none';
    thisWeek: AttendanceRecord[];
    thisMonth: {
      workDays: number;
      lateDays: number;
      absentDays: number;
    };
  };

  // 내 결재 현황
  approvals: {
    pending: number;
    approved: number;
    rejected: number;
  };

  // 공지사항
  announcements: Announcement[];
}
```

#### 비정규직/계약직 (Contract Worker)

```typescript
interface ContractWorkerDashboard {
  // 출퇴근 현황만 표시
  attendance: {
    today: 'checked-in' | 'checked-out' | 'none';
    thisWeek: AttendanceRecord[];
    thisMonth: {
      workDays: number;
      totalHours: number;
    };
  };

  // 배정된 프로젝트 정보 (읽기 전용)
  assignedProject: {
    name: string;
    location: string;
    startDate: Date;
    endDate: Date;
  } | null;

  // 근무 이력
  workHistory: {
    date: Date;
    checkIn: Date;
    checkOut: Date;
    workHours: number;
  }[];
}
```

**레이아웃 (간소화)**

```
┌─────────────────────────────────────────┐
│  오늘 출퇴근                             │
│  [출근하기] / [퇴근하기] 버튼            │
├─────────────────────────────────────────┤
│  이번 주 근무 현황                       │
│  [월] [화] [수] [목] [금] [토] [일]      │
│   ✓   ✓   ✓   ✓   -    -    -         │
├─────────────────────────────────────────┤
│  이번 달 근무 통계                       │
│  근무일: 12일 / 총 근무시간: 96시간      │
└─────────────────────────────────────────┘
```

**접근 제한**

- 다른 메뉴 (CRM, 프로젝트, 업무, 문서함 등) 접근 불가
- 사이드바에 "출퇴근" 메뉴만 표시
- 본인의 출퇴근 기록만 조회 가능

### 2.3 위젯 커스터마이징

- 위젯 순서 변경 (드래그 앤 드롭)
- 위젯 표시/숨김 토글
- 위젯 크기 조절 (1x1, 2x1, 2x2 그리드)
- 설정 저장 (사용자별)

---

## 3. CRM (Customer Relationship Management)

### 3.1 고객 목록

**화면 구성**

- 뷰 전환: 카드 뷰 ↔ 테이블 뷰
- 필터: 진행 프로젝트 수, 최근 견적, 계약 금액
- 정렬: 이름, 최근 접촉일, 프로젝트 수
- 검색: 고객명, 담당자명, 연락처

**고객 카드 (Card View)**

```typescript
interface CustomerCard {
  logo: string;                  // 고객사 로고
  name: string;                  // 고객사명
  contact: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  stats: {
    totalProjects: number;       // 총 프로젝트 수
    activeProjects: number;      // 진행 중
    totalRevenue: number;        // 총 계약금액
  };
  lastContact: Date;             // 최근 접촉일
  tags: string[];                // 태그 (VIP, 대기업 등)
}
```

**주요 고객사 예시**

- 삼성디스플레이
- LG이노텍
- 삼성SDI
- LG Display
- 원준
- 에드워드
- 주성엔지니어링

**필터 옵션**

```typescript
interface CustomerFilter {
  projectCount: {
    min: number;
    max: number;
  };
  recentQuote: {
    from: Date;
    to: Date;
  };
  contractValue: {
    min: number;
    max: number;
  };
  status: 'active' | 'inactive' | 'all';
  tags: string[];
}
```

### 3.2 고객 상세 페이지

**탭 구성**

1. **기본 정보**
   - 고객사명
   - 사업자등록번호
   - 주소
   - 업종
   - 주요 담당자 (여러 명 등록 가능)

2. **프로젝트 히스토리**
   - 진행 중 프로젝트
   - 완료된 프로젝트
   - 프로젝트별 매출
   - 타임라인 뷰

3. **견적서 관리**
   - 견적서 목록
   - 견적서 생성·수정·복사
   - PDF 자동 발행
   - 이메일 발송
   - 상태: 작성중, 발송, 승인, 거절

4. **계약 관리**
   - 계약서 업로드
   - 계약 금액·기간
   - 결제 조건
   - 인보이스 발행 내역

5. **커뮤니케이션 로그**
   - 이메일·전화 기록
   - 미팅 노트
   - 첨부 파일

### 3.3 견적서 생성

**기능**

1. **템플릿 기반 생성**
   - 기본 템플릿 제공
   - 커스텀 템플릿 저장
   - 이전 견적서 복사

2. **견적 항목 구성**

```typescript
interface QuoteItem {
  category: string;              // 분류 (설치, 자재, 인건비 등)
  description: string;           // 품목 설명
  quantity: number;
  unit: string;                  // 단위
  unitPrice: number;
  totalPrice: number;
  notes: string;                 // 비고
}

interface Quote {
  id: string;
  customerId: string;
  quoteNumber: string;           // 견적서 번호 (자동 생성)
  title: string;
  issueDate: Date;
  validUntil: Date;              // 유효기간
  items: QuoteItem[];
  subtotal: number;
  tax: number;                   // 부가세
  total: number;
  terms: string;                 // 조건 및 특이사항
  status: 'draft' | 'sent' | 'approved' | 'rejected';
}
```

3. **AI 자동 견적 (향후 추가)**
   - 과거 유사 프로젝트 기반 추천
   - 시장 가격 참조

4. **PDF 발행**
   - KMTLS 공식 양식
   - 회사 직인·서명 자동 삽입
   - 다운로드·이메일 발송

### 3.4 프로젝트 자동 생성

**워크플로우**

```
견적 승인 → [프로젝트 생성] 버튼 클릭
  ↓
프로젝트 기본 정보 자동 입력
  - 고객사: 자동 연동
  - 프로젝트명: 견적서 제목
  - 예산: 견적 금액
  - 기간: 입력 필요
  ↓
PM 배정
  ↓
프로젝트 모듈로 이동
```

### 3.5 고객 전용 실시간 링크

**기능**

1. **프로젝트 상태 공유**
   - 공유 링크 생성 (UUID 기반)
   - 비밀번호 설정 (선택)
   - 유효기간 설정 (7일, 30일, 무제한)

2. **고객이 볼 수 있는 정보**
   - 프로젝트 진행률 (%)
   - 현장 사진 (갤러리)
   - 주요 마일스톤
   - 인보이스
   - 타임라인

3. **알림 발송**
   - KakaoTalk 메시지
   - 이메일 일괄 발송
   - SMS (선택)

**예시 화면 (고객 뷰 - 웹)**

```
KMTLS 프로젝트 현황 포털
━━━━━━━━━━━━━━━━━━━━━━
프로젝트: LG 디스플레이 클린룸 설치
고객사: LG Display
진행률: 65% ████████▒▒▒▒▒▒

📅 주요 일정
✅ 2026.03.01 - 설계 완료
✅ 2026.03.15 - 자재 입고
🔄 2026.03.28 - 설치 진행 중
⏳ 2026.04.10 - 완료 예정

📸 최근 사진 (5장)
[사진 갤러리]

💰 인보이스
- 1차: ₩50,000,000 (지급완료)
- 2차: ₩30,000,000 (예정)
```

---

## 4. 프로젝트 진행 관리

### 4.1 메인 화면 - 칸반 보드

**칸반 컬럼**

```typescript
interface KanbanColumn {
  id: 'todo' | 'in_progress' | 'review' | 'completed';
  title: string;
  color: string;
  projects: Project[];
}

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#94a3b8' },
  { id: 'in_progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'review', title: 'Review', color: '#f59e0b' },
  { id: 'completed', title: 'Completed', color: '#10b981' },
];
```

**프로젝트 카드**

```typescript
interface ProjectCard {
  id: string;
  name: string;
  customer: string;
  pm: {
    name: string;
    avatar: string;
  };
  progress: number;              // 진행률 (0-100)
  startDate: Date;
  endDate: Date;
  daysRemaining: number;         // 남은 일수
  risk: 'low' | 'medium' | 'high'; // 위험도
  tags: string[];                // 긴급, 대규모 등
  assignedWorkers: number;       // 투입 인력 수
  safetyStatus: 'safe' | 'warning' | 'danger'; // 안전 상태
}
```

**드래그 앤 드롭**

- react-beautiful-dnd 또는 dnd-kit 사용
- 상태 변경 시 자동 저장
- 변경 이력 기록 (타임라인)

**필터 & 정렬**

```typescript
interface ProjectFilter {
  pm: string[];                  // PM 이름
  customer: string[];            // 고객사
  dateRange: {
    start: Date;
    end: Date;
  };
  risk: ('low' | 'medium' | 'high')[];
  status: string[];
  search: string;                // 프로젝트명 검색
}

type SortOption =
  | 'deadline-asc'
  | 'deadline-desc'
  | 'progress-asc'
  | 'progress-desc'
  | 'name-asc'
  | 'name-desc';
```

### 4.2 프로젝트 상세 페이지

**탭 구성**

#### 1. 개요 (Overview)

```typescript
interface ProjectOverview {
  // 기본 정보
  name: string;
  description: string;
  customer: {
    id: string;
    name: string;
    contact: Contact;
  };
  pm: User;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: 'todo' | 'in_progress' | 'review' | 'completed';

  // 진행 상황
  progress: {
    overall: number;             // 전체 진행률
    phases: {
      design: number;
      procurement: number;
      installation: number;
      testing: number;
    };
  };

  // 요약 통계
  stats: {
    totalWorkers: number;
    workDays: number;
    safetyChecks: number;
    issuesResolved: number;
  };
}
```

**위젯 구성**

- 진행률 차트 (도넛 차트)
- 예산 vs 실제 비용 (바 차트)
- 주요 마일스톤 타임라인
- 최근 활동 피드

#### 2. 투입 인력 관리

**기능**

1. **인력 배정**
   - 인력 풀에서 드래그 앤 드롭
   - 역할 지정 (현장책임자, 기술자, 보조 등)
   - 투입 기간 설정
   - 자격증 확인 (필수 자격증 알림)

2. **출결 현황**
   - 일별 출결 캘린더
   - 주별 통계
   - 지각·결근 알림
   - 웹 기반 출퇴근

3. **근무 일지**
   - 일일 작업 내용
   - 작업 사진 첨부
   - 특이사항 기록

**화면 구성**

```
┌──────────────────────────────────────┐
│  배정된 인력 (8명)                    │
│  ┌────┬────┬────┬────┬────┬────┐   │
│  │김철수│이영희│박민수│...          │   │
│  └────┴────┴────┴────┴────┴────┘   │
├──────────────────────────────────────┤
│  📅 출결 현황 (이번 주)               │
│  [월] [화] [수] [목] [금] [토] [일]   │
│   8   8   7   8   8   0   0        │
├──────────────────────────────────────┤
│  인력 풀 (가용 인력)                  │
│  [드래그하여 배정]                    │
│  홍길동 (용접기능사) [+]              │
│  최수진 (안전관리자) [+]              │
└──────────────────────────────────────┘
```

#### 3. 자재 출납 관리

**기능**

1. **자재 요청**
   - 필요 자재 목록 작성
   - 수량·용도 입력
   - 자재팀에 요청 전송
   - 승인 프로세스

2. **출고 현황**
   - 출고된 자재 목록
   - 출고일·담당자
   - 반납 예정일

3. **재고 확인**
   - 프로젝트별 할당 재고
   - 사용 중·잔여·반납

**자재관리 모듈과 연동**

```typescript
interface MaterialRequest {
  id: string;
  projectId: string;
  requestedBy: string;
  items: {
    materialId: string;
    name: string;
    quantity: number;
    purpose: string;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  requestedAt: Date;
  approvedBy?: string;
  deliveredAt?: Date;
}
```

#### 4. 안전 관리

**기능**

1. **일일 안전점검 체크리스트**
   - 체크리스트 템플릿
   - 항목별 체크 (OK / NG)
   - 사진 첨부 (필수)
   - 점검자 서명

2. **위험요소 등록**
   - 위험 발견 시 즉시 등록
   - 위치·내용·사진
   - 조치 계획
   - 완료 확인

3. **사고 보고서**
   - 사고 발생 시 즉시 작성
   - 사고 유형·원인·피해
   - 조치 내용
   - 재발 방지 대책

4. **안전교육 이수 현황**
   - 투입 인력별 교육 이력
   - 필수 교육 미이수 알림

**체크리스트 예시**

```typescript
interface SafetyChecklist {
  id: string;
  projectId: string;
  date: Date;
  inspector: string;
  items: {
    category: string;            // 전기, 화재, 추락 등
    item: string;
    status: 'ok' | 'ng' | 'na';  // OK, NG, 해당없음
    photo?: string;
    note?: string;
  }[];
  signature: string;             // 서명 이미지
}

// 체크리스트 템플릿
const checklistTemplate = [
  { category: '전기안전', item: '누전차단기 정상 작동' },
  { category: '전기안전', item: '임시 배선 정리 상태' },
  { category: '화재예방', item: '소화기 비치 및 위치 확인' },
  { category: '추락방지', item: '안전난간 설치 상태' },
  { category: '추락방지', item: '안전벨트 착용 확인' },
  { category: '장비안전', item: '크레인 점검 이상 무' },
  // ...
];
```

#### 5. 실시간 고객 공유

**기능 (CRM 섹션과 연동)**

- 진행률 업데이트 → 고객 자동 알림
- 현장 사진 업로드 → 갤러리 자동 추가
- 마일스톤 완료 → 알림 발송
- 인보이스 발행 → 고객 뷰에 표시

#### 6. 인보이스 발행

**기능**

1. **인보이스 생성**
   - 프로젝트 기본 정보 자동 입력
   - 청구 항목 (공사대금, 추가 작업 등)
   - 결제 조건 (선금, 중도금, 잔금)
   - 세금계산서 정보

2. **발행 및 전송**
   - PDF 생성
   - 이메일 발송
   - 고객 전용 링크에 자동 표시

3. **결제 추적**
   - 발행·발송·확인·입금완료 상태 관리
   - 미수금 알림

#### 7. 프로젝트 종료

**워크플로우**

```
완료 확인 → 최종 보고서 작성 → 고객 사인 → 프로젝트 종료
```

**최종 보고서 자동 생성**

```typescript
interface ProjectFinalReport {
  project: ProjectOverview;
  summary: string;
  achievements: string[];
  timeline: {
    phase: string;
    planned: Date;
    actual: Date;
    variance: number;
  }[];
  financialSummary: {
    budget: number;
    actualCost: number;
    variance: number;
  };
  safetyRecord: {
    totalChecks: number;
    incidents: number;
    zeroDays: number;
  };
  photos: string[];              // 주요 현장 사진
  lessonsLearned: string;
  customerFeedback?: string;
}
```

**고객 전자서명**

- 보고서 PDF 확인 후 서명
- 서명 방법: 터치·마우스 드로잉
- 서명 이미지 저장
- 완료 증명서 발행

### 4.3 Gantt 차트 (타임라인)

**기능**

- 프로젝트 일정 시각화
- 마일스톤 표시
- 의존성 관계 (A 완료 후 B 시작)
- 드래그로 일정 조정
- 실제 진행률 vs 계획 비교

**라이브러리 추천**

- Frappe Gantt
- dhtmlx-gantt
- react-gantt-chart

### 4.4 타임라인 히스토리

**기록 항목**

- 프로젝트 생성
- 상태 변경
- 인력 배정/해제
- 자재 요청/출고
- 안전점검 완료
- 문서 업로드
- 고객 공유
- 인보이스 발행
- 마일스톤 완료

**화면 구성**

```
📅 타임라인
━━━━━━━━━━━━━━━━━━━━━━━━━━━
2026.03.26 14:30
👤 김철수 PM이 프로젝트 상태를 "Review"로 변경

2026.03.26 10:15
📸 이영희가 현장 사진 3장 업로드

2026.03.25 16:00
✅ 안전점검 완료 (점검자: 박민수)

2026.03.25 09:00
👷 홍길동이 프로젝트에 투입됨
```

---

## 5. 자재관리 (Material Management)

### 5.1 자재 목록

**화면 구성**

- 뷰: 테이블 / 카드
- 필터: 카테고리, 재고 상태, 위치
- 정렬: 이름, 수량, 최근 출납일
- 검색: 자재명, 모델명, 바코드

**자재 분류**

```typescript
enum MaterialCategory {
  HEAVY_EQUIPMENT = '중량물',      // 크레인, 지게차 등
  INSTALLATION = '설치자재',       // 파이프, 케이블 등
  CONSUMABLES = '소모품',          // 볼트, 너트, 테이프 등
  TOOLS = '공구',                  // 전동공구, 수공구
  SAFETY = '안전장비',             // 안전모, 안전벨트 등
  ELECTRONICS = '전자부품',        // 센서, 컨트롤러 등
}

interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  modelNumber?: string;
  barcode?: string;              // 바코드 (QR 코드)
  quantity: number;
  unit: string;                  // 단위 (개, kg, m 등)
  minimumStock: number;          // 최소 재고
  location: string;              // 보관 위치
  price: number;                 // 단가
  supplier?: string;             // 공급업체
  lastUpdated: Date;
  status: 'sufficient' | 'low' | 'out_of_stock';
}
```

**재고 상태 표시**

- 🟢 충분 (재고 >= 최소 재고 * 2)
- 🟡 부족 경고 (재고 < 최소 재고 * 2)
- 🔴 긴급 (재고 < 최소 재고)

### 5.2 바코드 입출고

**웹 기반 바코드 스캔 기능**

1. **입고 프로세스**
   ```
   바코드 입력/스캔 → 자재 정보 표시 → 수량 입력 → 위치 지정 → 완료
   ```

2. **출고 프로세스**
   ```
   바코드 입력/스캔 → 프로젝트 선택 → 수량 입력 → 담당자 확인 → 완료
   ```

3. **재고 확인**
   ```
   바코드 입력/스캔 → 현재 재고·위치·최근 출납 이력 표시
   ```

**바코드 생성**

- 자재 등록 시 자동 생성
- 자재 ID + 이름 인코딩
- 라벨 프린터로 출력 가능

**카메라 라이브러리**

- Web: html5-qrcode 또는 바코드 스캐너 USB 연결

### 5.3 자재 등록 및 관리

**등록 폼**

```typescript
interface MaterialForm {
  name: string;
  category: MaterialCategory;
  modelNumber?: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  location: string;
  price: number;
  supplier?: string;
  photo?: File;                  // 자재 사진
  notes?: string;
}
```

**대량 등록**

- Excel 파일 업로드
- 템플릿 다운로드 제공
- 검증 후 일괄 등록

### 5.4 출납 이력

**출납 기록**

```typescript
interface MaterialTransaction {
  id: string;
  materialId: string;
  type: 'in' | 'out';            // 입고 / 출고
  quantity: number;
  projectId?: string;            // 출고 시 프로젝트 연동
  userId: string;                // 담당자
  location: string;
  date: Date;
  notes?: string;
}
```

**이력 조회**

- 자재별 전체 이력
- 프로젝트별 출고 이력
- 기간별 통계

### 5.5 재고 부족 자동 알림

**알림 조건**

- 재고 < 최소 재고: 🟡 경고 알림
- 재고 = 0: 🔴 긴급 알림
- 특정 프로젝트에서 대량 요청 시: ⚠️ 사전 알림

**알림 대상**

- 자재팀 (기본)
- 자재 담당자 (배정된 경우)
- PM (프로젝트에서 요청한 경우)

### 5.6 보유장비 관리

**KMTLS 보유 장비**

```typescript
interface Equipment {
  id: string;
  name: string;                  // 크레인, 지게차 등
  type: '중장비' | '운반장비' | '측정장비';
  model: string;
  registrationNumber: string;    // 차량번호·장비번호
  status: 'available' | 'in_use' | 'maintenance';
  assignedProject?: string;      // 현재 투입 프로젝트
  lastInspection: Date;          // 최근 점검일
  nextInspection: Date;          // 다음 점검 예정일
  location: string;
  operator?: string;             // 운전·조작 담당자
}
```

**장비 배정**

- 프로젝트에 장비 배정
- 사용 기간 설정
- 반납 알림

**유지보수 관리**

- 정기 점검 일정
- 점검 이력
- 수리 이력

---

## 6. 인력·안전관리

### 6.1 인력 관리

**인력 풀 (전체 인력)**

```typescript
interface Worker {
  id: string;
  name: string;
  employmentType: 'regular' | 'contract' | 'temporary'; // 고용 형태
  position: string;              // 직급
  department: string;            // 부서
  phone: string;
  email?: string;                // 정규직만 필수
  certifications: {
    name: string;                // 자격증명
    issueDate: Date;
    expiryDate?: Date;
  }[];
  skills: string[];              // 기술·역량
  status: 'available' | 'assigned' | 'on_leave';
  currentProject?: string;
  joinDate: Date;
  avatar?: string;
}
```

**인력 분류**

1. **정규직 (Regular)**
   - 일반 사원, PM, 관리자 등
   - 모든 시스템 기능 사용
   - 부서 소속

2. **비정규직/계약직 (Contract Worker)**
   - 프로젝트 단위 고용
   - 출퇴근 기능만 사용
   - 프로젝트 종료 시 계약 종료
   - 부서 소속 없음

3. **일용직/임시직 (Temporary)**
   - 단기 프로젝트 투입
   - 출퇴근 기록만

**인력 배정 현황**

- 프로젝트별 투입 인력 (정규직 + 비정규직)
- 가용 인력 (배정되지 않은 인력)
- 휴가 중 인력 (정규직만)

**비정규직 관리**

```typescript
interface ContractWorker {
  id: string;
  name: string;
  phone: string;
  employmentType: 'contract' | 'temporary';

  // 계약 정보
  contract: {
    projectId: string;           // 배정 프로젝트
    startDate: Date;             // 계약 시작일
    endDate: Date;               // 계약 종료일
    dailyWage?: number;          // 일당 (선택)
    hourlyWage?: number;         // 시급 (선택)
  };

  // 자격/경력
  certifications: {
    name: string;
    issueDate: Date;
    expiryDate?: Date;
  }[];

  // 출퇴근 기록만
  attendanceRecords: AttendanceRecord[];
}
```

**비정규직 특징**

- ✅ 프로젝트에만 직접 배정
- ✅ 출퇴근 체크만 가능
- ✅ 근무 시간 자동 집계
- ✅ 프로젝트 종료 시 자동 계약 종료
- ❌ 전자결재, 문서함, 업무 관리 기능 없음
- ❌ 연차, 휴가 없음 (결근만 표시)

**자격증 관리**

- 만료 예정 알림 (30일 전)
- 프로젝트 필수 자격증 확인
- 자격증 사본 업로드
- 비정규직도 자격증 관리 필수 (안전 관련)

### 6.2 출퇴근 관리

**웹 기반 체크인**

```typescript
interface AttendanceCheckIn {
  userId: string;
  projectId: string;
  type: 'check_in' | 'check_out';
  timestamp: Date;
  location?: string;             // 수동 입력 (선택)
  note?: string;
}
```

**체크인 방식**

- 웹 브라우저에서 버튼 클릭
- 프로젝트 선택
- 현장 관리자 승인 (선택)

**근무 이력**

```typescript
interface AttendanceRecord {
  userId: string;
  projectId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  workHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  overtime?: number;
}
```

**통계**

- 개인별 월간 출결 현황
- 프로젝트별 출근율
- 지각·결근 통계

### 6.3 안전 관리 (KMTLS 핵심 가치)

#### 일일 안전점검 체크리스트

**웹 기반 체크리스트**

1. **체크리스트 작성**
   - 프로젝트별 템플릿
   - 항목별 체크 (OK / NG)
   - 사진 첨부
   - 점검자 전자 서명

2. **NG 항목 조치**
   - 위험요소 즉시 등록
   - 조치 담당자 배정
   - 완료 확인

**체크리스트 예시 (프로젝트 4.2.4 참조)**

#### 위험요소 등록

```typescript
interface SafetyIssue {
  id: string;
  projectId: string;
  reportedBy: string;
  reportedAt: Date;
  category: '추락' | '전기' | '화재' | '중량물' | '기타';
  description: string;
  location: string;
  photos: string[];              // 필수
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo?: string;           // 조치 담당자
  actionPlan?: string;
  resolvedAt?: Date;
  resolutionNote?: string;
}
```

**조치 워크플로우**

```
위험 발견 → 등록 → 담당자 배정 → 조치 계획 → 조치 완료 → 확인
```

#### 사고 보고서

```typescript
interface AccidentReport {
  id: string;
  projectId: string;
  occurredAt: Date;
  reportedBy: string;
  type: '추락' | '감전' | '화재' | '중량물낙하' | '기타';
  severity: 'minor' | 'major' | 'fatal';
  injured: {
    name: string;
    injury: string;
    treatment: string;           // 응급처치, 병원 이송 등
  }[];
  cause: string;                 // 원인 분석
  description: string;
  photos: string[];
  immediateAction: string;       // 즉시 조치 내용
  preventiveMeasures: string;    // 재발 방지 대책
  status: 'investigating' | 'closed';
}
```

**사고 발생 시 프로세스**

1. 즉시 보고서 작성
2. 관련 부서·임원 자동 알림
3. 조사 및 원인 분석
4. 재발 방지 대책 수립
5. 전사 공유

#### 안전교육 이수 현황

```typescript
interface SafetyTraining {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;            // 필수 여부
  validityPeriod: number;        // 유효 기간 (개월)
  materials: {
    type: 'video' | 'pdf' | 'quiz';
    url: string;
  }[];
}

interface TrainingRecord {
  userId: string;
  trainingId: string;
  completedAt: Date;
  expiresAt?: Date;
  score?: number;                // 퀴즈 점수
  certificate?: string;          // 수료증
}
```

**필수 교육 미이수 알림**

- 프로젝트 투입 전 확인
- 만료 30일 전 알림
- 미이수자 현장 투입 차단

#### 안전지수 대시보드

```typescript
interface SafetyDashboard {
  // 무사고 일수
  zeroDays: number;

  // 월별 통계
  monthly: {
    month: string;
    checks: number;              // 점검 횟수
    issues: number;              // 위험요소 발견
    resolved: number;            // 해결 완료
    accidents: number;           // 사고 건수
  }[];

  // 프로젝트별 안전 점수
  projectScores: {
    project: string;
    score: number;               // 0-100
    grade: 'A' | 'B' | 'C' | 'D';
  }[];

  // 위험 요소 Top 5
  topIssues: {
    category: string;
    count: number;
  }[];
}
```

**안전 점수 산정 기준**

- 일일 점검 완료율: 40%
- 위험요소 조치 완료율: 30%
- 안전교육 이수율: 20%
- 사고 발생 여부: -10% (페널티)

### 6.4 업무 (Task) 관리

**개인·팀 업무 할당**

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;              // 담당자
  assignedBy: string;            // 할당자
  projectId?: string;            // 프로젝트 연동 (선택)
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate?: Date;
  tags: string[];
  checklist: {
    item: string;
    done: boolean;
  }[];
  attachments: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
```

**뷰 옵션**

1. **To-Do 리스트**
   - 기한 순 정렬
   - 우선순위 필터
   - 완료 체크

2. **칸반 보드**
   - 드래그 앤 드롭 상태 변경
   - 컬럼: To Do / In Progress / Review / Done

3. **캘린더 뷰**
   - 기한별 업무 표시
   - 일·주·월 전환

**@멘션 알림**

- 댓글에 @사용자명 입력 시 알림
- 업무 할당 시 알림
- 댓글·상태 변경 시 담당자 알림

**반복 업무 템플릿**

```typescript
interface RecurringTaskTemplate {
  title: string;
  description: string;
  assignee: string;
  recurrence: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;            // 매 N일/주/월
    daysOfWeek?: number[];       // 주간 반복 시 요일
  };
  checklist: string[];
}

// 예시: 주간 보고
{
  title: '주간 보고서 작성',
  recurrence: { type: 'weekly', interval: 1, daysOfWeek: [5] }, // 매주 금요일
  checklist: [
    '이번 주 완료 업무',
    '다음 주 계획',
    '이슈 사항',
  ],
}
```

---

## 7. HR (인사관리)

### 7.1 직원 정보 관리

**직원 마스터 데이터**

```typescript
interface Employee {
  // 기본 정보
  id: string;
  employeeNumber: string;        // 사번
  name: string;
  nameEn?: string;               // 영문명
  email: string;
  phone: string;
  birthDate: Date;
  gender: 'male' | 'female';

  // 회사 정보
  joinDate: Date;                // 입사일
  status: 'active' | 'on_leave' | 'resigned'; // 재직 상태
  department?: string;           // 부서 (정규직만)
  position: string;              // 직급 (사원, 대리, 과장, 차장, 부장)
  jobTitle?: string;             // 직책 (팀장, 파트장 등)
  employmentType: 'regular' | 'contract' | 'temporary'; // 고용 형태

  // 비정규직 전용
  contractInfo?: {
    projectId: string;           // 배정 프로젝트
    startDate: Date;
    endDate: Date;
    dailyWage?: number;          // 일당
    hourlyWage?: number;         // 시급
  };

  // 근무지
  workLocation: string;          // 본사, 아산, 구미, 베트남

  // 연락처
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;

  // 계좌 정보 (급여)
  bankAccount: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
  };

  // 자격증
  certifications: {
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    certificateNumber: string;
    file?: string;               // 스캔 파일
  }[];

  // 학력
  education: {
    school: string;
    major?: string;
    degree: '고졸' | '전문학사' | '학사' | '석사' | '박사';
    graduationDate: Date;
  }[];

  // 경력 (입사 전)
  previousExperience: {
    company: string;
    position: string;
    startDate: Date;
    endDate: Date;
    description?: string;
  }[];

  // 프로필 사진
  avatar?: string;

  // 메모 (HR 전용)
  notes?: string;
}
```

**화면 구성**

- 직원 목록 (테이블 / 카드 뷰)
- 검색: 이름, 사번, 부서, 직급
- 필터: 부서, 재직 상태, 근무지, **고용 형태 (정규직/비정규직)**
- 상세 페이지: 탭 구성 (기본정보, 인사기록, 급여, 평가, 교육)

**고용 형태별 관리**

- **정규직**: 전체 HR 기능 이용
- **비정규직/계약직**: 기본 정보 + 계약 정보 + 출퇴근 기록만
- **일용직**: 최소 정보 (이름, 연락처, 프로젝트, 출퇴근)

### 7.2 비정규직/계약직 관리

**비정규직 등록 및 관리**

```typescript
interface ContractWorkerManagement {
  // 간소화된 등록 프로세스
  basicInfo: {
    name: string;
    phone: string;
    idNumber?: string;           // 주민등록번호 (급여 지급 시)
    bankAccount?: {              // 일당/시급 지급 시 필요
      bank: string;
      accountNumber: string;
    };
  };

  // 계약 정보
  contract: {
    projectId: string;
    role: string;                // 역할 (용접공, 조립공, 운전기사 등)
    startDate: Date;
    endDate: Date;
    paymentType: 'daily' | 'hourly' | 'monthly';
    rate: number;                // 일당 or 시급 or 월급
  };

  // 필수 자격증 (안전 관련)
  certifications: {
    name: string;
    expiryDate?: Date;
  }[];

  // 출퇴근 전용 계정
  account: {
    username: string;            // 전화번호 or 자동 생성 ID
    password: string;            // 초기 비밀번호
    role: 'CONTRACT_WORKER';
  };
}
```

**비정규직 프로세스**

```
프로젝트 시작 → 비정규직 등록 → 출퇴근 계정 발급 →
프로젝트 투입 → 일일 출퇴근 기록 → 근무 시간 집계 →
프로젝트 종료 → 정산 → 계약 종료
```

**기능**

1. **간편 등록**
   - 최소 정보만 입력 (이름, 연락처, 프로젝트)
   - 출퇴근 계정 자동 생성
   - 초기 비밀번호 SMS 발송

2. **프로젝트 배정**
   - 하나의 프로젝트에만 고정 배정
   - 프로젝트 종료 시 자동 계약 종료

3. **출퇴근 관리**
   - 비정규직 전용 간소화된 출퇴근 화면
   - 프로젝트 정보 자동 표시
   - 근무 시간 자동 계산

4. **근무 집계**
   - 일별 근무 시간
   - 주별/월별 통계
   - 일당/시급 자동 계산

5. **계약 연장/종료**
   - 계약 종료일 도래 시 알림
   - 연장 또는 종료 처리
   - 종료 시 계정 비활성화

**비정규직 대시보드 (본인 뷰)**

- 오늘 출퇴근 버튼
- 이번 주/월 근무 현황
- 예상 급여 (일당 × 근무일)
- 배정된 프로젝트 정보

**관리자 뷰 (PM/현장관리자)**

- 프로젝트별 비정규직 명단
- 출퇴근 현황 (실시간)
- 근무 시간 통계
- 급여 정산 자료

### 7.3 채용 관리 (Recruitment)

**채용 공고 관리**

```typescript
interface JobPosting {
  id: string;
  title: string;                 // 채용 공고명
  department: string;
  position: string;
  jobDescription: string;
  requirements: string[];
  preferences: string[];
  employmentType: 'regular' | 'contract';
  experienceLevel: '신입' | '경력' | '무관';
  salary: {
    min?: number;
    max?: number;
    negotiable: boolean;
  };
  headcount: number;             // 채용 인원
  deadline: Date;
  status: 'draft' | 'open' | 'closed';
  postedAt?: Date;
}

interface Applicant {
  id: string;
  jobPostingId: string;
  name: string;
  email: string;
  phone: string;
  resume: string;                // 파일 URL
  coverLetter?: string;
  appliedAt: Date;
  status: 'applied' | 'screening' | 'interview_scheduled' |
          'interviewed' | 'offered' | 'accepted' | 'rejected';

  // 전형 단계
  stages: {
    name: string;                // 서류, 1차 면접, 2차 면접, 최종
    status: 'pending' | 'passed' | 'failed';
    date?: Date;
    interviewers?: string[];
    feedback?: string;
    score?: number;
  }[];

  // 평가
  overallRating?: number;        // 1-5
  notes?: string;
}
```

**채용 프로세스**

```
공고 등록 → 지원자 접수 → 서류 심사 → 면접 일정 조율 → 면접 진행 → 합격 통보 → 입사 확정
```

**기능**

1. **채용 공고 작성 및 게시**
   - 자사 채용 페이지 연동
   - 외부 채용 사이트 연동 (사람인, 잡코리아 등)

2. **지원자 관리**
   - 이력서 파일 업로드
   - 지원자 상태 변경 (칸반 보드)
   - 지원자 평가 및 메모

3. **면접 일정 관리**
   - 캘린더 연동
   - 면접관 배정
   - 자동 이메일 발송 (면접 안내)

4. **합격자 처리**
   - 입사 제안 (연봉, 입사일)
   - 입사 확정 시 직원 정보로 자동 전환

### 7.4 인사 발령 (Personnel Actions)

**인사 기록**

```typescript
interface PersonnelAction {
  id: string;
  employeeId: string;
  type: 'hire' | 'promotion' | 'transfer' | 'demotion' | 'resignation' | 'termination';
  effectiveDate: Date;

  // 변경 내용
  changes: {
    department?: { from: string; to: string; };
    position?: { from: string; to: string; };
    jobTitle?: { from: string; to: string; };
    salary?: { from: number; to: number; };
    workLocation?: { from: string; to: string; };
  };

  reason?: string;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}
```

**인사 발령 종류**

1. **입사** - 신규 직원 등록
2. **승진** - 직급 상향
3. **전보** - 부서·직책 변경
4. **전출** - 근무지 변경
5. **휴직** - 육아휴직, 병가휴직 등
6. **복직** - 휴직 후 복귀
7. **퇴사** - 자발적 퇴사
8. **해고** - 징계 해고

**인사 발령 프로세스**

```
발령 기안 → 결재 (부서장 → 임원 → 대표이사) → 확정 → 직원 정보 자동 업데이트 → 전사 공지
```

### 7.5 급여 관리 (Payroll)

**급여 대장**

```typescript
interface SalaryInfo {
  employeeId: string;

  // 기본급
  baseSalary: number;

  // 수당
  allowances: {
    position: number;            // 직책 수당
    meal: number;                // 식대
    transportation: number;      // 교통비
    housing?: number;            // 주택 수당
    overtime: number;            // 시간외 수당
    holiday: number;             // 휴일 근무 수당
    nightShift: number;          // 야간 근무 수당
    dangerous: number;           // 위험 수당 (현장)
    other: { name: string; amount: number; }[];
  };

  // 공제
  deductions: {
    nationalPension: number;     // 국민연금 (4.5%)
    healthInsurance: number;     // 건강보험 (3.545%)
    longTermCare: number;        // 장기요양 (건보의 12.95%)
    employmentInsurance: number; // 고용보험 (0.9%)
    incomeTax: number;           // 소득세
    localIncomeTax: number;      // 지방소득세 (소득세의 10%)
    other: { name: string; amount: number; }[];
  };

  // 총액
  totalPay: number;              // 지급 총액
  totalDeduction: number;        // 공제 총액
  netPay: number;                // 실수령액

  // 메타데이터
  year: number;
  month: number;
  payDate: Date;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
}
```

**급여 처리 프로세스**

```
근태 데이터 확인 → 급여 계산 → 검토 → 결재 → 급여 명세서 발송 → 계좌 이체 → 완료
```

**기능**

1. **급여 자동 계산**
   - 근태 데이터 기반 (출근일, 초과 근무)
   - 세금·4대보험 자동 계산
   - 기본급 + 수당 - 공제

2. **급여 명세서 발행**
   - PDF 생성
   - 개인별 이메일 발송
   - 직원 포털에서 조회 가능

3. **급여 대장 관리**
   - 월별 급여 내역
   - 직원별 연간 급여 총액
   - Excel 내보내기

4. **연말정산 지원**
   - 연간 소득 집계
   - 원천징수영수증 발행

**보안**

- 급여 정보는 HR팀 + CEO만 열람 가능
- 직원 본인은 자신의 급여 명세서만 조회
- 로그 기록 (누가, 언제 조회했는지)

### 7.6 연차·휴가 관리

**연차 발생 및 소진**

```typescript
interface AnnualLeave {
  employeeId: string;
  year: number;

  // 발생
  totalDays: number;             // 총 연차 (15일 기본 + 근속)
  usedDays: number;              // 사용
  remainingDays: number;         // 잔여
  expiredDays: number;           // 소멸 (미사용)

  // 발생 내역
  granted: {
    date: Date;
    days: number;
    reason: '입사' | '정기발생' | '근속가산' | '보상';
  }[];

  // 사용 내역
  used: {
    leaveRequestId: string;
    startDate: Date;
    endDate: Date;
    days: number;                // 0.5 (반차), 1, 2...
    type: '연차' | '반차' | '병가' | '경조사' | '공가';
  }[];
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  type: '연차' | '반차' | '병가' | '경조사' | '공가' | '무급휴가';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  emergencyContact?: string;     // 휴가 중 연락처

  // 결재
  approvalId?: string;           // 전자결재 연동
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}
```

**연차 발생 규칙**

- 입사 1년 미만: 월 1개씩 발생 (최대 11개)
- 입사 1년 이상: 매년 1월 1일에 15개 발생
- 근속 가산: 2년마다 1개씩 추가 (최대 25개)
- 사용 기한: 발생 후 1년 (미사용 시 소멸)

**휴가 신청 프로세스**

```
휴가 신청 → 전자결재 (팀장) → 승인 → 연차 차감 → 캘린더 표시
```

**기능**

1. **연차 현황 조회**
   - 직원별 연차 잔여
   - 부서별 연차 사용률
   - 연차 소멸 예정 알림

2. **휴가 신청**
   - 캘린더 선택
   - 반차 (오전/오후) 선택
   - 연속 휴가 신청

3. **휴가자 관리**
   - 일별·주별·월별 휴가자 현황
   - 부서별 동시 휴가 제한 (최대 N명)

4. **대체 휴무**
   - 휴일 근무 시 대체 휴무 발생
   - 대체 휴무 사용 신청

### 7.7 인사평가 (Performance Evaluation)

**평가 체계**

```typescript
interface EvaluationPeriod {
  id: string;
  name: string;                  // 2026년 상반기
  year: number;
  season: 'H1' | 'H2';           // 상반기, 하반기
  startDate: Date;
  endDate: Date;
  evaluationDeadline: Date;
  status: 'preparing' | 'in_progress' | 'completed';
}

interface Evaluation {
  id: string;
  periodId: string;
  employeeId: string;
  evaluatorId: string;           // 평가자 (주로 직속 상사)

  // 평가 항목
  criteria: {
    category: string;            // 업무 성과, 역량, 태도 등
    item: string;
    weight: number;              // 가중치 (%)
    score: number;               // 1-5 점수
    comment?: string;
  }[];

  // 종합 평가
  totalScore: number;            // 100점 만점
  grade: 'S' | 'A' | 'B' | 'C' | 'D'; // 등급
  strengths: string;             // 강점
  weaknesses: string;            // 개선 필요 사항
  developmentPlan: string;       // 육성 계획

  // 자기평가
  selfEvaluation?: {
    achievements: string;        // 주요 성과
    challenges: string;          // 어려웠던 점
    goals: string;               // 차기 목표
  };

  // 상태
  status: 'draft' | 'submitted' | 'reviewed' | 'confirmed';
  submittedAt?: Date;
  confirmedAt?: Date;
}
```

**평가 프로세스**

```
평가 기간 설정 → 자기평가 작성 → 상사 평가 → 2차 평가자 검토 →
피드백 면담 → 평가 확정 → 인센티브·승진 반영
```

**평가 등급 분포**

- S등급: 상위 10%
- A등급: 20%
- B등급: 40%
- C등급: 20%
- D등급: 10%

**기능**

1. **평가 기간 관리**
   - 상반기/하반기 평가 설정
   - 평가 대상자 자동 선정

2. **자기평가 작성**
   - 목표 달성도
   - 주요 성과 기술
   - 역량 자기 평가

3. **상사 평가**
   - 항목별 점수 입력
   - 종합 코멘트
   - 등급 산정

4. **평가 결과 조회**
   - 직원: 본인 평가 결과만
   - 관리자: 팀원 평가 결과
   - HR: 전사 평가 결과 및 통계

5. **평가 결과 활용**
   - 승진 심사 자료
   - 성과급 산정
   - 교육 필요성 파악

### 7.8 교육 관리 (Training)

**교육 과정**

```typescript
interface TrainingProgram {
  id: string;
  title: string;
  category: '직무교육' | '리더십' | '안전교육' | '자격증' | '외부교육';
  description: string;
  instructor?: string;
  duration: number;              // 시간
  capacity?: number;             // 수강 인원

  // 필수 여부
  mandatory: boolean;
  targetPositions?: string[];    // 대상 직급
  targetDepartments?: string[];  // 대상 부서

  // 교육 자료
  materials: {
    type: 'video' | 'pdf' | 'link' | 'quiz';
    title: string;
    url: string;
  }[];

  // 일정
  schedules: {
    startDate: Date;
    endDate: Date;
    location: string;            // 온라인 or 강의실
    enrolled: string[];          // 신청자
    completed: string[];         // 이수자
  }[];
}

interface TrainingRecord {
  id: string;
  employeeId: string;
  programId: string;
  scheduleDate: Date;
  completedAt?: Date;
  score?: number;
  certificate?: string;          // 수료증
  feedback?: string;             // 교육 후기
}
```

**교육 프로세스**

```
교육 계획 수립 → 과정 개설 → 수강 신청 → 교육 진행 → 이수 확인 → 수료증 발급
```

**기능**

1. **교육 과정 관리**
   - 교육 등록 및 일정 관리
   - 온라인/오프라인 교육 구분
   - 외부 교육 연동 (URL)

2. **수강 신청**
   - 직원 자율 신청
   - 필수 교육 자동 배정

3. **교육 이수 관리**
   - 출석 체크
   - 평가 (퀴즈, 과제)
   - 수료 여부 판정

4. **교육 이력 관리**
   - 직원별 교육 이력
   - 필수 교육 미이수 알림
   - 교육 시간 집계 (연간)

5. **교육 효과 분석**
   - 교육 만족도 설문
   - 교육 후 성과 추적

### 7.9 복리후생 (Benefits)

**복리후생 항목**

```typescript
interface Benefit {
  id: string;
  name: string;
  category: '건강' | '생활' | '자기계발' | '경조사' | '휴가';
  description: string;
  eligibility: string[];         // 대상 (전직원, 정규직만 등)

  // 금전적 지원
  amount?: number;
  frequency?: 'monthly' | 'yearly' | 'per_use';

  // 신청 필요 여부
  requiresApplication: boolean;
}

interface BenefitUsage {
  id: string;
  employeeId: string;
  benefitId: string;
  usedAt: Date;
  amount?: number;
  purpose?: string;
  receiptFile?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}
```

**제공 복리후생 예시**

1. **건강**
   - 건강검진 지원 (연 1회)
   - 의료비 지원
   - 체육 시설 이용권

2. **생활**
   - 식사 제공 (구내식당 or 식대)
   - 통근 버스 운행
   - 주차 지원

3. **자기계발**
   - 도서 구입비 (월 5만원)
   - 외부 교육비 지원
   - 자격증 취득 장려금

4. **경조사**
   - 결혼 축하금
   - 출산 축하금
   - 부조금 (부고)
   - 경조 휴가

5. **기타**
   - 명절 선물
   - 생일 선물/휴가
   - 장기 근속 포상

**기능**

1. **복리후생 안내**
   - 제도 상세 설명
   - 신청 방법

2. **신청 및 승인**
   - 온라인 신청서
   - 영수증 첨부
   - 결재 연동

3. **사용 내역 조회**
   - 개인별 사용 이력
   - 잔여 한도 확인

### 7.10 퇴직 관리

**퇴직 절차**

```typescript
interface Resignation {
  id: string;
  employeeId: string;
  resignationType: 'voluntary' | 'termination' | 'retirement' | 'contract_end';
  requestedDate: Date;           // 퇴사 희망일
  effectiveDate: Date;           // 최종 근무일
  reason?: string;

  // 업무 인수인계
  handover: {
    status: 'pending' | 'in_progress' | 'completed';
    assignedTo?: string;         // 인수자
    tasks: {
      item: string;
      completed: boolean;
    }[];
    documents: string[];
  };

  // 퇴직금
  severancePay?: {
    calculatedAmount: number;
    paymentDate: Date;
    paid: boolean;
  };

  // 자산 반납
  assetReturn: {
    item: string;                // 노트북, 사원증, 명함 등
    returned: boolean;
    returnDate?: Date;
  }[];

  // 최종 처리
  exitInterviewCompleted: boolean;
  status: 'pending' | 'approved' | 'processing' | 'completed';
}
```

**퇴직 프로세스**

```
퇴직 신청 → 결재 → 업무 인수인계 → 자산 반납 → 퇴직 면담 →
퇴직금 정산 → 퇴직 처리 완료 → 퇴직 증명서 발급
```

**퇴직금 계산**

- 1일 평균 임금 × 30일 × (재직일수 ÷ 365)
- 계속 근로 1년 이상 시 지급

**기능**

1. **퇴직 신청**
   - 퇴직 사유 작성
   - 희망 퇴직일 선택

2. **인수인계 관리**
   - 인수인계 체크리스트
   - 인수자 배정
   - 진행 상황 추적

3. **자산 반납**
   - 회사 자산 목록 (노트북, 장비 등)
   - 반납 확인 체크

4. **퇴직 면담**
   - 면담 일정 조율
   - 면담 기록 작성

5. **퇴직 정산**
   - 퇴직금 자동 계산
   - 미사용 연차 수당
   - 최종 급여 정산

6. **퇴직 증명서**
   - 자동 발급
   - PDF 다운로드

---

## 8. 전자결재

### 8.1 결재 유형

**지원하는 결재 문서**

1. **견적서 결재** (영업 → 팀장 → 임원)
2. **프로젝트 시작 승인** (PM → 부서장 → 대표이사)
3. **자재 구매 요청** (현장 → 자재팀 → 부서장)
4. **비용 정산** (신청자 → 팀장 → 경리)
5. **휴가 신청** (신청자 → 팀장)
6. **일반 품의서** (기안자 → 결재선)

### 7.2 결재 프로세스

```typescript
interface Approval {
  id: string;
  type: '견적서' | '프로젝트승인' | '구매요청' | '비용정산' | '휴가' | '품의';
  title: string;
  content: string;
  attachments: string[];
  drafterId: string;             // 기안자
  approvalLine: {
    order: number;
    approverId: string;
    role: string;                // 직급
    status: 'pending' | 'approved' | 'rejected' | 'reference';
    approvedAt?: Date;
    comment?: string;
  }[];
  currentStep: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}
```

**결재선 자동 설정**

```typescript
// 예시: 견적서 결재선
const approvalLineTemplates = {
  견적서: [
    { role: '팀장', action: 'approve' },
    { role: '부서장', action: 'approve' },
    { role: '임원', action: 'approve' },
  ],
  프로젝트승인: [
    { role: '부서장', action: 'approve' },
    { role: '대표이사', action: 'approve' },
  ],
  구매요청: [
    { role: '자재팀장', action: 'approve' },
    { role: '부서장', action: 'approve' },
    { role: '경리팀', action: 'reference' }, // 참조
  ],
};
```

### 7.3 결재 화면

**결재 대기함**

- 내가 결재할 문서 목록
- 우선순위 정렬 (긴급, 일반)
- 결재 기한 표시

**진행 문서함**

- 내가 기안한 문서
- 현재 결재 단계 표시
- 진행 상황 추적

**완료 문서함**

- 승인·반려 완료 문서
- PDF 다운로드
- 결재선 전체 보기

### 7.4 빠른 결재

- 브라우저 알림 (결재 요청)
- 빠른 승인·반려 버튼
- 댓글 작성
- 첨부파일 미리보기

---

## 9. 커뮤니케이션

### 8.1 내부 메신저

**기능**

1. **1:1 채팅**
   - 실시간 메시지
   - 읽음 확인
   - 파일·이미지 전송
   - 이모지 반응

2. **그룹 채팅 (채널)**
   - 프로젝트별 채널
   - 부서별 채널
   - 멤버 초대·퇴장
   - 공지 핀 고정

3. **파일 공유**
   - 드래그 앤 드롭 업로드
   - 이미지 미리보기
   - 문서 다운로드

4. **검색**
   - 메시지 검색
   - 파일 검색
   - 사용자 검색

**WebSocket 사용**

- Socket.IO (NestJS)
- 실시간 메시지 전송
- 온라인 상태 표시
- 타이핑 인디케이터

### 12.2 공지사항

**공지 작성 (관리자 전용)**

```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;               // Markdown 지원
  author: string;
  category: '전사' | '부서' | '프로젝트';
  targetAudience: string[];      // 전체 or 특정 부서·프로젝트
  priority: 'normal' | 'important' | 'urgent';
  attachments: string[];
  isPinned: boolean;             // 상단 고정
  publishedAt: Date;
  expiresAt?: Date;              // 게시 종료일
  views: number;
  readBy: string[];              // 읽은 사용자 목록
}
```

**공지 알림**

- 중요 공지: 푸시 알림
- 일반 공지: 배지 표시
- 읽지 않은 공지 강조

### 12.3 알림 센터

**알림 카테고리**

- 업무 (Task 할당, 댓글)
- 결재 (결재 요청, 승인/반려)
- 프로젝트 (상태 변경, 마일스톤)
- 안전 (위험요소, 점검 미완료)
- 시스템 (공지사항)

**알림 설정**

- 카테고리별 ON/OFF
- 푸시 알림 시간대 설정
- 이메일 알림 수신 여부

---

## 10. 문서함

### 12.1 중앙 문서 저장소

**폴더 구조**

```
문서함/
├── 고객별/
│   ├── 삼성디스플레이/
│   │   ├── 계약서/
│   │   ├── 견적서/
│   │   └── 프로젝트 문서/
│   └── LG이노텍/
├── 프로젝트별/
│   ├── 프로젝트A/
│   │   ├── 설계도/
│   │   ├── 현장사진/
│   │   ├── 보고서/
│   │   └── 인보이스/
├── 부서별/
│   ├── 영업팀/
│   ├── 자재팀/
│   └── 안전관리팀/
└── 공통/
    ├── 양식/
    ├── 매뉴얼/
    └── 규정/
```

### 12.2 문서 관리

**문서 업로드**

```typescript
interface Document {
  id: string;
  name: string;
  type: string;                  // PDF, DOCX, XLSX, JPG 등
  size: number;
  folderId: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
  tags: string[];
  description?: string;
  permissions: {
    read: string[];              // 읽기 권한
    write: string[];             // 수정 권한
    delete: string[];            // 삭제 권한
  };
}
```

**버전 관리**

- 같은 파일 재업로드 시 버전 증가
- 이전 버전 보관
- 버전 비교 (선택)
- 특정 버전 복원

**미리보기**

- PDF: 브라우저 내장 뷰어
- 이미지: 갤러리 뷰
- 문서 (DOCX, XLSX): Google Docs Viewer 또는 OnlyOffice

### 12.3 검색 및 필터

**검색**

- 파일명
- 태그
- 업로드자
- 내용 (Full-text search - Elasticsearch)

**필터**

- 파일 형식
- 업로드 기간
- 폴더
- 태그

---

## 11. 보고서·통계

### 12.1 매출 리포트

**기간별 매출**

- 일별·주별·월별·분기별·연도별
- 목표 대비 실적 비교
- 고객사별 매출 순위
- 프로젝트별 수익률

**차트**

- 라인 차트 (추이)
- 바 차트 (비교)
- 파이 차트 (비율)

### 12.2 프로젝트 완료율

**진행 현황**

- 전체 프로젝트 수
- 상태별 분포 (To Do, In Progress, Review, Completed)
- 평균 완료 기간
- 지연 프로젝트 비율

### 12.3 안전 리포트

**안전 지표**

- 무사고 일수
- 월별 안전점검 완료율
- 위험요소 발견·조치율
- 사고 발생 건수 (경미/중대)
- 안전교육 이수율

**프로젝트별 안전 점수**

- 안전 점수 순위
- 개선 필요 프로젝트

### 12.4 인력 리포트

**투입 현황**

- 프로젝트별 투입 인력
- 가동률 (배정 인력 / 전체 인력)
- 부서별·직급별 분포

**출결 통계**

- 월간 출근율
- 지각·결근 통계
- 초과 근무 시간

### 12.5 자재 리포트

**재고 현황**

- 카테고리별 재고
- 재고 회전율
- 재고 부족 빈도

**출납 통계**

- 프로젝트별 자재 사용량
- 월별 입출고 현황

### 12.6 내보내기

**지원 형식**

- Excel (XLSX)
- PDF
- CSV

**자동 보고서**

- 월말 자동 생성
- 이메일 자동 발송 (관리자)
- 템플릿 저장

---

## 12. 설정 (관리자 전용)

### 12.1 사용자 관리

**기능**

- 사용자 등록·수정·삭제
- 권한 부여 (역할 배정)
- 비밀번호 초기화
- 계정 활성화/비활성화
- 대량 등록 (Excel 업로드)

### 12.2 조직 관리

**조직도 구성**

- 부서·팀 생성
- 계층 구조 설정
- 부서장 지정

### 12.3 권한 관리

**역할 생성 및 편집**

- 기본 역할: CEO, EXECUTIVE, PM, FIELD_MANAGER, MATERIAL_TEAM, EMPLOYEE
- 커스텀 역할 생성
- 권한 세부 설정

### 12.4 시스템 설정

**일반 설정**

- 회사 정보 (로고, 이름, 주소)
- 기본 언어
- 시간대

**알림 설정**

- 전역 알림 ON/OFF
- 알림 템플릿 편집

**보안 설정**

- 비밀번호 정책 (최소 길이, 복잡도)
- 세션 타임아웃
- 2차 인증 강제 여부
- IP 화이트리스트

### 12.5 감사 로그

**시스템 활동 기록**

- 로그인/로그아웃
- 권한 변경
- 문서 업로드/삭제
- 설정 변경

---

## UI/UX 구현 포인트

### 1. 반응형 웹 디자인

**이유**: 태블릿 및 데스크톱 환경 지원

**주요 기능**

- 출퇴근 체크인 (GPS)
- 안전점검 체크리스트
- QR/바코드 스캔 (자재)
- 현장 사진 업로드
- 업무 확인·댓글
- 결재 승인·반려
- 메신저

**반응형 디자인**

- Breakpoints:

  - Tablet: 640px ~ 1024px
  - Desktop: >= 1024px

### 2. 실시간성 강조

**WebSocket 활용**

- 프로젝트 상태 변경 즉시 반영
- 메신저 실시간 전송
- 알림 푸시
- 온라인 상태 표시
- 동시 편집 방지 (낙관적 잠금)

### 3. 오프라인 지원

**PWA (Progressive Web App)**

- 오프라인 캐싱
- 백그라운드 동기화
- 푸시 알림 (Web)



- 로컬 데이터베이스 (SQLite / Hive)
- 출결·사진 오프라인 저장
- 네트워크 복구 시 자동 동기화

### 4. 접근성 (Accessibility)

**다크 모드**

- 기본 제공
- 자동 전환 (시스템 설정 연동)

**큰 버튼·폰트**

- 터치 타겟 최소 44x44px
- 기본 폰트 크기: 14px (웹), 16px (태블릿)

**색상 대비**

- WCAG 2.1 AA 준수
- 색맹 사용자 고려

### 5. 보안

**화면별 권한**

- 자재팀: CRM 가격 정보 숨김
- 일반 사원: 매출 데이터 비표시
- PM: 담당 프로젝트만 수정 가능

**민감 정보 마스킹**

- 급여 정보
- 고객 연락처
- 계약 금액 (권한에 따라)

---

## 기술 스택 매핑

### Backend (NestJS)

```typescript
// 모듈 구조
src/modules/
├── auth/              // 로그인·인증
├── user/              // 사용자·조직 관리
├── customer/          // CRM
├── quote/             // 견적서
├── project/           // 프로젝트 관리
├── material/          // 자재관리
├── worker/            // 인력관리
├── attendance/        // 출퇴근
├── safety/            // 안전관리
├── hr/                // HR (인사관리)
│   ├── recruitment/   // 채용
│   ├── payroll/       // 급여
│   ├── leave/         // 연차·휴가
│   ├── evaluation/    // 인사평가
│   ├── training/      // 교육
│   └── resignation/   // 퇴직
├── task/              // 업무관리
├── approval/          // 전자결재
├── messenger/         // 메신저 (WebSocket)
├── announcement/      // 공지사항
├── document/          // 문서함
├── report/            // 보고서·통계
└── settings/          // 설정
```

### Frontend (Next.js)

```typescript
// App Router 구조
app/[locale]/
├── (auth)/
│   └── login/
├── (dashboard)/
│   ├── layout.tsx              // 공통 레이아웃 (사이드바)
│   ├── page.tsx                // 대시보드
│   ├── crm/
│   │   ├── page.tsx            // 고객 목록
│   │   └── [id]/               // 고객 상세
│   ├── projects/
│   │   ├── page.tsx            // 칸반 보드
│   │   └── [id]/               // 프로젝트 상세
│   ├── materials/
│   ├── workers/
│   ├── hr/
│   │   ├── page.tsx            // HR 대시보드
│   │   ├── employees/          // 직원 관리
│   │   ├── recruitment/        // 채용
│   │   ├── payroll/            // 급여
│   │   ├── leave/              // 연차·휴가
│   │   ├── evaluation/         // 인사평가
│   │   └── training/           // 교육
│   ├── tasks/
│   ├── approvals/
│   ├── messenger/
│   ├── documents/
│   ├── reports/
│   └── settings/
└── api/                        // API Routes (선택)
```


---

## 데이터베이스 스키마 (주요 테이블)

```sql
-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(100),
  role VARCHAR(50),              -- CEO, PM, EMPLOYEE 등
  department_id UUID,
  avatar VARCHAR(255),
  created_at TIMESTAMP
);

-- 고객사
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  business_number VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP
);

-- 프로젝트
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  customer_id UUID REFERENCES customers(id),
  pm_id UUID REFERENCES users(id),
  status VARCHAR(50),            -- todo, in_progress, review, completed
  progress INT,                  -- 0-100
  budget DECIMAL(15,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP
);

-- 자재
CREATE TABLE materials (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(50),
  quantity INT,
  minimum_stock INT,
  location VARCHAR(255),
  barcode VARCHAR(100) UNIQUE,
  created_at TIMESTAMP
);

-- 안전점검
CREATE TABLE safety_checklists (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  inspector_id UUID REFERENCES users(id),
  date DATE,
  items JSONB,                   -- 체크리스트 항목
  signature TEXT,
  created_at TIMESTAMP
);

-- 전자결재
CREATE TABLE approvals (
  id UUID PRIMARY KEY,
  type VARCHAR(50),
  title VARCHAR(255),
  drafter_id UUID REFERENCES users(id),
  approval_line JSONB,
  status VARCHAR(50),
  created_at TIMESTAMP
);
```

---

## API 엔드포인트 예시

### CRM

```
GET    /api/v1/customers                    # 고객 목록
GET    /api/v1/customers/:id                # 고객 상세
POST   /api/v1/customers                    # 고객 등록
PATCH  /api/v1/customers/:id                # 고객 수정
DELETE /api/v1/customers/:id                # 고객 삭제

GET    /api/v1/customers/:id/quotes         # 고객별 견적서 목록
POST   /api/v1/quotes                       # 견적서 생성
GET    /api/v1/quotes/:id/pdf               # 견적서 PDF 다운로드
POST   /api/v1/quotes/:id/send              # 견적서 이메일 발송

POST   /api/v1/customers/:id/share-link     # 고객 공유 링크 생성
GET    /api/v1/share/:token                 # 공유 링크 접속 (인증 불필요)
```

### 프로젝트

```
GET    /api/v1/projects                     # 프로젝트 목록 (칸반)
GET    /api/v1/projects/:id                 # 프로젝트 상세
POST   /api/v1/projects                     # 프로젝트 생성
PATCH  /api/v1/projects/:id                 # 프로젝트 수정
PATCH  /api/v1/projects/:id/status          # 상태 변경
DELETE /api/v1/projects/:id                 # 프로젝트 삭제

GET    /api/v1/projects/:id/workers         # 투입 인력 목록
POST   /api/v1/projects/:id/workers         # 인력 배정
DELETE /api/v1/projects/:id/workers/:userId # 인력 해제

GET    /api/v1/projects/:id/materials       # 프로젝트 자재 목록
POST   /api/v1/projects/:id/material-request # 자재 요청

GET    /api/v1/projects/:id/timeline        # 타임라인 히스토리
POST   /api/v1/projects/:id/invoice         # 인보이스 발행
```

### 자재관리

```
GET    /api/v1/materials                    # 자재 목록
GET    /api/v1/materials/:id                # 자재 상세
POST   /api/v1/materials                    # 자재 등록
PATCH  /api/v1/materials/:id                # 자재 수정
DELETE /api/v1/materials/:id                # 자재 삭제

POST   /api/v1/materials/:id/in             # 입고
POST   /api/v1/materials/:id/out            # 출고
GET    /api/v1/materials/:id/transactions   # 출납 이력

GET    /api/v1/materials/qr/:code           # QR 코드로 자재 조회
```

### 안전관리

```
GET    /api/v1/safety/checklists            # 안전점검 목록
POST   /api/v1/safety/checklists            # 안전점검 등록
GET    /api/v1/safety/checklists/:id        # 안전점검 상세

POST   /api/v1/safety/issues                # 위험요소 등록
PATCH  /api/v1/safety/issues/:id            # 위험요소 조치 업데이트

POST   /api/v1/safety/accidents             # 사고 보고서 작성
GET    /api/v1/safety/dashboard             # 안전 대시보드
```

### 출퇴근

```
POST   /api/v1/attendance/check-in          # 출근 체크인 (GPS 포함)
POST   /api/v1/attendance/check-out         # 퇴근 체크아웃
GET    /api/v1/attendance/my                # 내 출결 현황
GET    /api/v1/attendance/project/:id       # 프로젝트별 출결 현황
```

### HR (인사관리)

```
# 직원 관리
GET    /api/v1/hr/employees                 # 직원 목록
GET    /api/v1/hr/employees/:id             # 직원 상세
POST   /api/v1/hr/employees                 # 직원 등록
PATCH  /api/v1/hr/employees/:id             # 직원 정보 수정
DELETE /api/v1/hr/employees/:id             # 직원 삭제 (퇴사 처리)

GET    /api/v1/hr/employees/:id/history     # 인사 발령 이력
POST   /api/v1/hr/personnel-actions         # 인사 발령 (승진, 전보 등)

# 채용
GET    /api/v1/hr/job-postings              # 채용 공고 목록
POST   /api/v1/hr/job-postings              # 채용 공고 등록
GET    /api/v1/hr/job-postings/:id          # 채용 공고 상세
PATCH  /api/v1/hr/job-postings/:id          # 채용 공고 수정

GET    /api/v1/hr/applicants                # 지원자 목록
GET    /api/v1/hr/applicants/:id            # 지원자 상세
PATCH  /api/v1/hr/applicants/:id/status     # 지원자 상태 변경
POST   /api/v1/hr/applicants/:id/hire       # 합격자 입사 처리

# 급여
GET    /api/v1/hr/payroll                   # 급여 대장 (월별)
GET    /api/v1/hr/payroll/:employeeId       # 직원별 급여 내역
POST   /api/v1/hr/payroll/calculate         # 급여 계산 (월말)
POST   /api/v1/hr/payroll/:id/approve       # 급여 승인
GET    /api/v1/hr/payroll/:id/slip          # 급여 명세서 PDF

# 연차·휴가
GET    /api/v1/hr/leave/employees/:id       # 직원별 연차 현황
GET    /api/v1/hr/leave/requests            # 휴가 신청 목록
POST   /api/v1/hr/leave/requests            # 휴가 신청
PATCH  /api/v1/hr/leave/requests/:id        # 휴가 신청 수정
DELETE /api/v1/hr/leave/requests/:id        # 휴가 신청 취소

GET    /api/v1/hr/leave/calendar            # 휴가 캘린더 (전사)

# 인사평가
GET    /api/v1/hr/evaluations               # 평가 기간 목록
POST   /api/v1/hr/evaluations               # 평가 기간 생성
GET    /api/v1/hr/evaluations/:periodId/employees/:id  # 평가 조회
POST   /api/v1/hr/evaluations/:periodId/employees/:id  # 평가 작성
PATCH  /api/v1/hr/evaluations/:id           # 평가 수정

GET    /api/v1/hr/evaluations/:periodId/stats # 평가 통계

# 교육
GET    /api/v1/hr/training/programs         # 교육 과정 목록
POST   /api/v1/hr/training/programs         # 교육 과정 등록
GET    /api/v1/hr/training/programs/:id     # 교육 과정 상세

POST   /api/v1/hr/training/enroll           # 교육 신청
GET    /api/v1/hr/training/my               # 내 교육 이력
POST   /api/v1/hr/training/complete         # 교육 이수 처리

# 복리후생
GET    /api/v1/hr/benefits                  # 복리후생 목록
POST   /api/v1/hr/benefits/apply            # 복리후생 신청
GET    /api/v1/hr/benefits/my               # 내 사용 내역

# 퇴직
POST   /api/v1/hr/resignations              # 퇴직 신청
GET    /api/v1/hr/resignations/:id          # 퇴직 진행 상황
PATCH  /api/v1/hr/resignations/:id/handover # 인수인계 업데이트
POST   /api/v1/hr/resignations/:id/complete # 퇴직 처리 완료
GET    /api/v1/hr/resignations/:id/certificate # 퇴직 증명서 PDF
```

---

## 다음 단계 제안

이제 다음 작업 중 원하시는 것을 선택해주세요:

### 옵션 1: Figma 상세 Wireframe 가이드
각 화면의 레이아웃, 컴포넌트 스펙, 인터랙션을 Figma에서 디자인할 수 있도록 상세 가이드 작성

### 옵션 2: 데이터베이스 스키마 완성본
전체 테이블 정의, 관계, 인덱스, 제약조건 포함한 SQL 파일 생성

### 옵션 3: API 명세서 (OpenAPI/Swagger)
전체 API 엔드포인트의 요청/응답 스키마를 정의한 YAML 파일

### 옵션 4: 프로젝트 초기 세팅 스크립트
Backend, Web 폴더 구조 자동 생성 및 기본 파일 세팅

### 옵션 5: 특정 모듈 Deep Dive
예: 프로젝트 칸반 모듈을 더 깊게 설계 (상태 관리, 드래그 앤 드롭, WebSocket 실시간 업데이트 등)

어떤 작업을 먼저 진행할까요?
