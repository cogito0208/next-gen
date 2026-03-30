# Claude AI 작업 가이드 - KMTLS 기업용 통합 그룹웨어

## 프로젝트 개요

**프로젝트명**: KMTLS 기업용 통합 그룹웨어
**목적**: 건설/제조업 현장 중심의 프로젝트 관리, 자재관리, 안전관리, CRM을 통합한 엔터프라이즈 솔루션
**아키텍처**: Modular Monolith (향후 마이크로서비스 전환 가능)

## 기술 스택

### Backend
- **Framework**: NestJS
- **언어**: TypeScript
- **아키텍처 패턴**: Modular Monolith
- **ORM**: TypeORM / Prisma
- **인증**: JWT + Passport.js
- **API 문서**: Swagger/OpenAPI
- **다국어**: nestjs-i18n (한국어, 영어, 일본어)

### Frontend (Web)
- **Framework**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **상태 관리**: Zustand / TanStack Query
- **UI 프레임워크**: Tailwind CSS + shadcn/ui
- **디자인 시스템**: Google Stitch 기반
- **다국어**: next-intl

### Database & Cache
- **주 데이터베이스**: PostgreSQL 15+
- **캐시**: Redis
- **검색 엔진**: Elasticsearch (선택적)

### DevOps
- **컨테이너**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## 프로젝트 구조

```
next_gen_01/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/           # 비즈니스 모듈
│   │   │   ├── auth/          # 인증/인가
│   │   │   ├── user/          # 사용자 관리
│   │   │   ├── organization/  # 조직/부서 관리
│   │   │   ├── approval/      # 전자결재
│   │   │   ├── board/         # 게시판
│   │   │   ├── calendar/      # 일정관리
│   │   │   ├── mail/          # 메일
│   │   │   ├── messenger/     # 메신저
│   │   │   ├── drive/         # 파일관리
│   │   │   ├── hr/            # 인사관리
│   │   │   └── integrations/  # 외부 API 연동
│   │   ├── common/            # 공통 모듈
│   │   ├── shared/            # 공유 유틸리티
│   │   └── i18n/              # 다국어 번역 파일
│   └── test/
│
├── web/                       # Next.js Web Application
│   ├── src/
│   │   ├── app/              # App Router
│   │   │   ├── [locale]/    # 다국어 라우팅
│   │   │   └── api/          # API Routes
│   │   ├── components/       # 재사용 컴포넌트
│   │   ├── lib/              # 유틸리티
│   │   ├── hooks/            # Custom Hooks
│   │   ├── stores/           # 상태 관리
│   │   └── services/         # API 통신
│   └── messages/             # 다국어 번역 파일
│
├── skills/                    # 프로젝트 문서
│   ├── DESIGN_GUIDE.md       # 디자인 가이드
│   ├── PROJECT_ARCHITECTURE.md # 아키텍처 명세
│   └── REQUIREMENTS.md       # 기능 요구사항
│
└── docs/                      # 프로젝트 문서
```

## 핵심 모듈 구조

### 각 비즈니스 모듈의 표준 구조
```
modules/example/
├── controllers/        # API 엔드포인트
├── services/          # 비즈니스 로직
├── repositories/      # 데이터 접근 계층
├── entities/          # 데이터베이스 엔티티
├── dto/               # 데이터 전송 객체
├── interfaces/        # 인터페이스 정의
├── events/            # 도메인 이벤트
└── example.module.ts  # 모듈 정의
```

## 디자인 시스템

### Google Stitch 활용 워크플로우
1. **Stitch로 빠른 초안 생성** (AI 프롬프트)
2. **Figma로 마이그레이션** (공식 플러그인)
3. **Figma에서 디테일 작업 & 컴포넌트화**
4. **개발팀에 핸드오프**

### 컬러 시스템
- **Primary-500**: #2563EB (Main Brand)
- **Gray-900**: #111827 (Text)
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444

### 타이포그래피
- **Primary Font**: 'Pretendard', -apple-system, sans-serif
- **Monospace**: 'JetBrains Mono', monospace

### 간격 시스템 (8px 기반)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

## 주요 기능 모듈

### 1. 대시보드 (Dashboard)
직급별 맞춤 대시보드 제공:
- **CEO**: 전체 KPI, 위험 프로젝트, 안전사고 Zero Day
- **PM**: 담당 프로젝트 진행률, 지연 알림, 투입 인력 현황
- **현장 관리자**: 출결, 안전 점검, 현장 사진
- **자재팀**: 재고 부족 경고, 출고 예정, 입고 대기
- **HR팀**: 신규 입사자, 연차 현황, 급여 처리, 채용 현황
- **일반 사원**: 내 업무, 출퇴근 현황

### 2. CRM (고객 관리)
고객사 관리 및 견적 처리:
- 고객사 정보 관리
- 견적서 생성 및 관리
- 프로젝트 전환

### 3. 프로젝트 관리
프로젝트 진행 관리:
- 칸반 보드
- Gantt 차트
- 인력/자재 배정
- 실시간 진행 상황 추적

### 4. 자재 관리
재고 및 출납 관리:
- QR/바코드 스캔
- 재고 알림
- 출고/입고 관리

### 5. 인력·안전 관리
인력 배치 및 안전 점검:
- 출퇴근 관리
- 안전 체크리스트
- 사고 기록 및 Zero Day 관리

### 6. HR (인사관리)
인사 업무 전반:
- 채용 관리
- 급여 처리
- 연차 관리
- 인사평가
- 교육 관리

### 7. 전자결재
결재 워크플로우:
- 견적 결재
- 구매 결재
- 비용 결재

### 8. 커뮤니케이션
메신저 및 공지:
- 실시간 채팅
- 파일 공유
- 공지사항

### 9. 문서함
중앙 문서 저장소:
- 프로젝트별 문서 관리
- 버전 관리

### 10. 보고서·통계
데이터 분석:
- 매출 리포트
- 안전 리포트
- 완료율 리포트

## 권한 관리 (RBAC)

### 역할 정의
- **CEO**: 모든 데이터 열람, 승인
- **EXECUTIVE**: 부서 데이터 열람, 최종 승인
- **PM**: 프로젝트 관리, 인력·자재 배정
- **FIELD_MANAGER**: 출퇴근 관리, 안전 체크
- **MATERIAL_TEAM**: 자재 출납, 재고 관리
- **HR_TEAM**: 채용, 급여, 인사평가, 교육 관리
- **EMPLOYEE**: 본인 업무, 문서 열람
- **CONTRACT_WORKER**: 출퇴근 체크만
- **GUEST**: 공유된 프로젝트만 열람

## 다국어 지원

### 지원 언어
- 한국어 (ko-KR) - 기본 언어
- 영어 (en-US)
- 일본어 (ja-JP) - 선택적

### Backend (nestjs-i18n)
```typescript
// Controller에서 사용
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto, @I18n() i18n: I18nContext) {
    return {
      message: i18n.t('auth.login.success')
    };
  }
}
```

### Frontend (next-intl)
```typescript
// Component에서 사용
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('dashboard');
  return <h1>{t('title')}</h1>;
}
```

## 외부 API 연동

### Adapter Pattern 사용
모든 외부 API는 Adapter Pattern으로 구현:
```typescript
// 인터페이스 정의 (Port)
export interface IMailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  getEmails(userId: string, folder: string): Promise<Email[]>;
}

// Gmail Adapter
export class GmailAdapter implements IMailProvider {
  // 구현...
}

// Outlook Adapter
export class OutlookAdapter implements IMailProvider {
  // 구현...
}
```

### 연동 예상 시스템
- **인증/SSO**: Google Workspace, Microsoft Azure AD
- **메일**: Gmail API, Microsoft Graph API
- **스토리지**: AWS S3, Google Cloud Storage
- **알림**: Firebase Cloud Messaging, Slack Webhook

## API 설계 규칙

### RESTful API 패턴
```
GET    /api/v1/{module}/{resource}           # 목록 조회
GET    /api/v1/{module}/{resource}/:id       # 단건 조회
POST   /api/v1/{module}/{resource}           # 생성
PUT    /api/v1/{module}/{resource}/:id       # 전체 수정
PATCH  /api/v1/{module}/{resource}/:id       # 부분 수정
DELETE /api/v1/{module}/{resource}/:id       # 삭제
```

### 응답 형식
```typescript
// 성공 응답
{
  "success": true,
  "data": {...},
  "meta": {
    "timestamp": "2026-03-30T12:00:00Z",
    "version": "1.0"
  }
}

// 에러 응답
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

## 인증 & 인가

### 인증 플로우
1. 로그인 (아이디/비밀번호 또는 SSO)
2. Access Token (15분) + Refresh Token (7일) 발급
3. httpOnly Cookie 저장 (XSS 방지)
4. Refresh Token으로 Access Token 갱신

### 보안 기능
- 2차 인증 (OTP) - 선택적
- 계정 잠금 (5회 실패 시)
- IP 화이트리스트

## 개발 가이드라인

### 코드 컨벤션
- **Backend**: Airbnb JavaScript Style Guide + NestJS Best Practices
- **Frontend**: Airbnb + Next.js 권장사항

### Git 전략
- **브랜치 전략**: Git Flow
  - `main`: 프로덕션
  - `develop`: 개발
  - `feature/*`: 기능 개발
  - `hotfix/*`: 긴급 수정
- **커밋 메시지**: Conventional Commits
  ```
  feat: 새로운 기능
  fix: 버그 수정
  docs: 문서 수정
  refactor: 리팩토링
  test: 테스트 코드
  ```

### 테스트 전략
- **Backend**: Jest (Unit Test, E2E Test)
- **Frontend**: Vitest + Testing Library, Playwright (E2E)

## 성능 최적화

### Backend
- Database Connection Pool 최적화
- N+1 쿼리 문제 해결
- Cursor-based pagination
- Bull Queue로 비동기 처리

### Frontend
- Next.js dynamic import (Code Splitting)
- Next.js Image 컴포넌트
- TanStack Query 캐싱 활용

## 보안 고려사항
1. SQL Injection 방지 (ORM 사용)
2. XSS 방지 (입력 값 sanitization)
3. CSRF 방지 (CSRF 토큰, SameSite Cookie)
4. Rate Limiting (API 호출 제한)
5. HTTPS/TLS (전송 암호화)
6. 민감정보 AES-256 암호화
7. Helmet.js (보안 헤더)

## 데이터베이스 설계

### 스키마 분리 전략
각 모듈별 스키마 분리 (향후 마이크로서비스 전환 대비):
```sql
CREATE SCHEMA auth;
CREATE SCHEMA user_mgmt;
CREATE SCHEMA organization;
CREATE SCHEMA approval;
CREATE SCHEMA board;
CREATE SCHEMA calendar;
CREATE SCHEMA mail;
CREATE SCHEMA messenger;
CREATE SCHEMA drive;
CREATE SCHEMA hr;
```

## 캐싱 전략 (Redis)
1. **세션 관리**: Refresh Token 저장
2. **API 응답 캐싱**: 자주 조회되는 데이터
3. **실시간 데이터**: 메신저 온라인 상태, 알림
4. **Rate Limiting**: API 호출 제한

```typescript
// 캐시 키 네이밍 규칙
{module}:{resource}:{id}
// 예: user:profile:123, board:post:456
```

## 프로젝트 실행 방법

### 개발 환경 (Docker Compose)
```bash
# 전체 서비스 실행
docker-compose -f docker-compose.dev.yml up

# Backend만 실행
cd backend
npm install
npm run start:dev

# Frontend만 실행
cd web
npm install
npm run dev
```

## Claude AI 작업 시 주의사항

### 1. 모듈 간 명확한 경계 유지
- 각 모듈은 독립적인 비즈니스 도메인 담당
- 모듈 간 통신은 명확한 인터페이스를 통해서만
- 순환 참조 방지

### 2. Adapter Pattern 준수
- 모든 외부 API 연동은 Adapter Pattern 사용
- 인터페이스(Port) 먼저 정의
- 구체적인 구현(Adapter)은 교체 가능하도록

### 3. 다국어 지원 필수
- 모든 사용자 노출 문자열은 번역 파일 사용
- 하드코딩 금지
- 키 네이밍 규칙: `{모듈}.{기능}.{항목}`

### 4. 권한 검증
- 모든 API 엔드포인트에 권한 검증 추가
- RBAC 기반 접근 제어
- 민감한 데이터는 추가 검증

### 5. 에러 핸들링
- 통일된 에러 응답 포맷 사용
- 사용자 친화적인 에러 메시지
- 다국어 에러 메시지 지원

### 6. 테스트 코드 작성
- 새로운 기능 추가 시 테스트 코드 필수
- 외부 API는 Mock 사용
- E2E 테스트로 전체 플로우 검증

### 7. 문서화
- API 변경 시 Swagger 문서 업데이트
- 복잡한 비즈니스 로직은 주석 추가
- README 업데이트

## 참고 문서

### 프로젝트 문서
- `skills/DESIGN_GUIDE.md` - 디자인 개발 가이드
- `skills/PROJECT_ARCHITECTURE.md` - 아키텍처 상세 명세
- `skills/REQUIREMENTS.md` - 기능 요구사항 상세

### 외부 문서
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Stitch](https://stitch.withgoogle.com/)
- [Figma](https://www.figma.com/)

## 향후 확장 로드맵

### Phase 1: MVP (현재)
- 핵심 그룹웨어 기능 구현
- Modular Monolith 아키텍처

### Phase 2: 성능 최적화
- 캐싱 전략 고도화
- 데이터베이스 최적화
- CDN 도입

### Phase 3: 마이크로서비스 전환 (필요시)
- 트래픽이 많은 모듈부터 분리
- 메시지 큐 도입 (RabbitMQ, Kafka)
- API Gateway 구성

### Phase 4: 고급 기능
- AI 기반 기능 (문서 요약, 일정 추천)
- 실시간 협업 기능 강화

---

**마지막 업데이트**: 2026-03-30
**버전**: 1.0
**문의**: 프로젝트 관리자에게 연락
