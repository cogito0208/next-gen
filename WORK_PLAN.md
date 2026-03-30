# KMTLS 기업용 통합 그룹웨어 — 개발 작업 계획서

> **최초 작성**: 2026-03-30
> **최종 업데이트**: 2026-03-30
> **버전**: 2.0
> **목표**: localhost 완전 구동 가능한 고품질 풀스택 그룹웨어

---

## 1. RAG 시스템 현황

| 항목 | 상태 | 비고 |
|------|------|------|
| RAG 엔진 (`rag_system.py`) | ✅ 완료 | ChromaDB + sentence-transformers |
| Claude 연동 (`query_rag.py`) | ✅ 완료 | Anthropic API 연동 |
| Skills 문서 벡터화 | ✅ 완료 | 6개 문서, 6,488줄 |
| 자동 업데이트 (checksum) | ✅ 완료 | 파일 변경 감지 |
| 시작 스크립트 (`start_claude.sh`) | ✅ 완료 | 메뉴 기반 실행 |

> RAG 비용 효율: 쿼리당 35,000 토큰 → 800 토큰 **(97.7% 절감)**

---

## 2. 현재 구현 완료 항목

### 2-1. 인프라

| 항목 | 상태 | 비고 |
|------|------|------|
| PostgreSQL (로컬) | ✅ 완료 | `kmtls_groupware` DB, 6개 스키마 |
| 스키마 초기화 (`init-db.sql`) | ✅ 완료 | uuid-ossp, pgcrypto 활성화 |
| Backend Dockerfile | ✅ 완료 | Node 20 Alpine, multi-stage |
| Frontend Dockerfile | ✅ 완료 | Node 20 Alpine, multi-stage |
| docker-compose.yml | ✅ 완료 | postgres, redis, backend, frontend |
| `.env` 파일 | ✅ 완료 | 로컬/Docker 분리 구성 |
| `start_dev.sh` | ✅ 완료 | 원클릭 개발 서버 시작 스크립트 |

### 2-2. Backend (NestJS, 포트 3002)

| 모듈 | 상태 | 구현 내용 |
|------|------|----------|
| **Auth** | ✅ 완료 | JWT(15m) + Refresh Token(7d), httpOnly Cookie, 계정 5회 잠금 |
| **User** | ✅ 완료 | CRUD, 9개 RBAC 역할, 소프트 삭제 |
| **Organization** | ✅ 완료 | 부서 목록, 조직 통계 API |
| **Project** | ✅ 완료 | 프로젝트 CRUD, 칸반 보드, 작업 상태 변경 |
| **CRM** | ✅ 완료 | 고객사 목록, 거래 파이프라인, 통계 API |
| **HR** | ✅ 완료 | 직원 목록, 출퇴근 기록, 연차 신청 |
| **Dashboard** | ✅ 완료 | 역할별 KPI 집계, 최근 활동, 차트 데이터 |
| **Database Seeder** | ✅ 완료 | 10명 유저, 8개 부서, 5개 프로젝트, 12개 거래 등 |
| **Swagger** | ✅ 완료 | `http://localhost:3002/api/docs` |

### 2-3. Frontend (Next.js, 포트 3001)

| 페이지 / 컴포넌트 | 상태 | 구현 내용 |
|------------------|------|----------|
| **Login** | ✅ 완료 | 브랜딩 패널, 데모 계정 원클릭 입력 |
| **Dashboard Layout** | ✅ 완료 | Sidebar + Header + 인증 가드 |
| **Sidebar** | ✅ 완료 | 다크 테마, 그룹 내비게이션, 활성 상태 |
| **Header** | ✅ 완료 | 검색 힌트, 알림 드롭다운, 유저 드롭다운 |
| **Dashboard 홈** | ✅ 완료 | 4개 KPI 카드, 프로젝트 현황, 거래 목록, 출퇴근 현황 |
| **Projects 페이지** | ✅ 완료 | 카드 그리드 + 칸반 뷰 토글, 필터 |
| **CRM 페이지** | ✅ 완료 | 고객사 탭 + 파이프라인 칸반 탭 |
| **HR 페이지** | ✅ 완료 | 직원 목록, 출퇴근 현황, 휴가 관리 3탭 |
| **Organization 페이지** | ✅ 완료 | 부서 카드, 원형 진행률, 멤버 목록 |
| **StatCard** | ✅ 완료 | KPI 카드 (5색상, 트렌드 표시) |
| **DataTable** | ✅ 완료 | 범용 정렬 테이블, 로딩 스켈레톤 |
| **Badge** | ✅ 완료 | 6개 Variant (success/warning/error/info/purple/default) |
| **PageHeader** | ✅ 완료 | 제목, 부제목, 브레드크럼, 액션 슬롯 |

### 2-4. 데이터베이스 시드 데이터

| 엔티티 | 건수 | 내용 |
|--------|------|------|
| 사용자 (users) | 10명 | CEO, EXECUTIVE, PM×2, FIELD_MANAGER, MATERIAL_TEAM, HR_TEAM, EMPLOYEE×3 |
| 부서 (departments) | 8개 | 경영지원, IT개발, 영업, 현장관리, 자재관리, HR, 재무, 기획 |
| 프로젝트 (projects) | 5개 | ACTIVE×3, COMPLETED×1, DELAYED×1 |
| 프로젝트 작업 (tasks) | 20개 | TODO/IN_PROGRESS/REVIEW/DONE 분산 |
| 고객사 (customers) | 8개 | 삼성건설, 현대제조, LG IT솔루션 등 |
| 거래 (deals) | 12개 | LEAD→CLOSED_WON 전 단계 |
| 직원 (employees) | 10명 | users와 1:1 매핑 |
| 출퇴근 기록 | 70건 | 최근 7일 |
| 연차 신청 | 8건 | PENDING/APPROVED/REJECTED |

---

## 3. 추가 구현 항목 (REQUIREMENTS.md 기반)

> RAG 문서 분석으로 도출한 미구현 기능 전체 목록

---

### Phase 2 — 핵심 그룹웨어 기능

#### 2-1. 자재관리 모듈 (Material Management)

**Backend API:**
- `GET  /api/v1/materials` — 자재 목록 (카테고리, 재고 상태 필터)
- `POST /api/v1/materials` — 자재 등록
- `GET  /api/v1/materials/:id` — 자재 상세
- `POST /api/v1/materials/transactions` — 입고/출고 등록
- `GET  /api/v1/materials/transactions` — 입출고 이력
- `GET  /api/v1/materials/stock-alerts` — 재고 부족 알림 목록
- `GET  /api/v1/materials/stats` — 재고 현황 집계
- `POST /api/v1/materials/import` — 엑셀 대량 등록
- `GET  /api/v1/materials/:id/qr` — QR 코드 생성

**DB 엔티티:**
```
materials          (id, name, code, category, unit, stock_qty, min_qty, unit_price, location)
material_transactions (id, material_id, project_id, type(IN/OUT), qty, date, requester)
equipment          (id, name, serial_no, status, location, last_maintenance_date)
```

**Frontend 페이지:**
- 자재 목록 (검색 + 재고 상태 신호등: 🔴부족/🟡주의/🟢충분)
- 입출고 현황 테이블
- 재고 부족 알림 위젯
- QR 코드 모달
- 장비 목록

---

#### 2-2. 전자결재 모듈 (Approval/Workflow)

**Backend API:**
- `GET  /api/v1/approvals` — 결재 문서 목록 (내 문서/수신 문서)
- `POST /api/v1/approvals` — 결재 문서 기안
- `GET  /api/v1/approvals/:id` — 문서 상세
- `POST /api/v1/approvals/:id/approve` — 승인
- `POST /api/v1/approvals/:id/reject` — 반려
- `GET  /api/v1/approvals/templates` — 결재선 템플릿 목록
- `GET  /api/v1/approvals/stats` — 결재 현황 집계

**문서 유형:**
- 견적 결재, 구매 승인, 비용 정산, 연차 신청, 프로젝트 결재, 일반 문서

**DB 엔티티:**
```
approval_documents (id, type, title, content, drafter_id, status, created_at)
approval_lines     (id, document_id, approver_id, step, status, comment, decided_at)
approval_templates (id, name, type, line_config)
```

**Frontend 페이지:**
- 결재 문서함 (기안/수신/완료 탭)
- 문서 기안 폼 (유형 선택, 결재선 설정)
- 문서 상세 + 결재 이력 타임라인
- 결재선 설정 UI

---

#### 2-3. 게시판 모듈 (Board/Announcements)

**Backend API:**
- `GET  /api/v1/board/posts` — 게시글 목록 (카테고리, 검색)
- `POST /api/v1/board/posts` — 게시글 작성
- `GET  /api/v1/board/posts/:id` — 게시글 상세
- `PUT  /api/v1/board/posts/:id` — 수정
- `DELETE /api/v1/board/posts/:id` — 삭제
- `POST /api/v1/board/posts/:id/comments` — 댓글 작성
- `GET  /api/v1/board/notices` — 공지사항 목록 (상단 고정)

**카테고리:** 공지사항, 일반, 부서별, 프로젝트별

**DB 엔티티:**
```
board_posts    (id, category, title, content, author_id, views, is_pinned, created_at)
board_comments (id, post_id, author_id, content, created_at)
board_files    (id, post_id, filename, url)
```

**Frontend 페이지:**
- 게시판 목록 (카테고리 탭, 검색)
- 게시글 작성/수정 폼 (Rich Text Editor)
- 게시글 상세 + 댓글
- 공지 배너 (대시보드 연동)

---

#### 2-4. 일정관리 모듈 (Calendar)

**Backend API:**
- `GET  /api/v1/calendar/events` — 일정 목록 (월/주/일 범위)
- `POST /api/v1/calendar/events` — 일정 생성
- `PUT  /api/v1/calendar/events/:id` — 일정 수정
- `DELETE /api/v1/calendar/events/:id` — 일정 삭제
- `GET  /api/v1/calendar/events/upcoming` — 다가오는 일정 (5건)

**DB 엔티티:**
```
calendar_events (id, title, description, start_datetime, end_datetime, is_all_day,
                 type(PERSONAL/PROJECT/COMPANY/HOLIDAY), color, creator_id,
                 project_id, recurrence_rule, created_at)
event_attendees (event_id, user_id, status(PENDING/ACCEPTED/DECLINED))
```

**Frontend 페이지:**
- 월간 캘린더 뷰 (이벤트 색상 구분)
- 주간 뷰
- 일정 생성/수정 모달
- 다가오는 일정 위젯 (사이드바 or 대시보드)

---

#### 2-5. 메신저 모듈 (Messenger/Real-time Chat)

**Backend:**
- Socket.io WebSocket 서버 설정
- `GET  /api/v1/messenger/rooms` — 채팅방 목록
- `POST /api/v1/messenger/rooms` — 채팅방 생성 (1:1 또는 그룹)
- `GET  /api/v1/messenger/rooms/:id/messages` — 메시지 이력
- `POST /api/v1/messenger/rooms/:id/messages` — 메시지 전송 (REST)
- WS  `message` 이벤트 — 실시간 메시지 수신
- WS  `typing` 이벤트 — 타이핑 중 표시
- `POST /api/v1/messenger/rooms/:id/files` — 파일 첨부

**DB 엔티티:**
```
chat_rooms    (id, name, type(DIRECT/GROUP), created_by, created_at)
room_members  (room_id, user_id, joined_at, last_read_at)
messages      (id, room_id, sender_id, content, type(TEXT/FILE/IMAGE), created_at)
```

**Frontend 페이지:**
- 채팅 UI (좌측 방 목록 + 우측 메시지 뷰)
- 메시지 말풍선 (내 메시지/상대 메시지 구분)
- 타이핑 인디케이터
- 파일 미리보기
- 안 읽은 메시지 뱃지

---

#### 2-6. 파일관리 모듈 (Drive/Document Storage)

**Backend API:**
- `GET  /api/v1/drive/folders` — 폴더 트리
- `POST /api/v1/drive/folders` — 폴더 생성
- `GET  /api/v1/drive/files` — 파일 목록 (폴더별)
- `POST /api/v1/drive/files/upload` — 파일 업로드 (Multer)
- `GET  /api/v1/drive/files/:id/download` — 다운로드
- `DELETE /api/v1/drive/files/:id` — 삭제
- `GET  /api/v1/drive/search?q=` — 전문 검색

**DB 엔티티:**
```
drive_folders (id, name, parent_id, owner_id, project_id, customer_id, created_at)
drive_files   (id, folder_id, filename, original_name, size, mime_type,
               storage_path, uploader_id, version, created_at)
```

**Frontend 페이지:**
- 폴더 트리 사이드바 + 파일 그리드/리스트 뷰
- 드래그앤드롭 업로드
- 파일 미리보기 (이미지, PDF)
- 검색 결과

---

### Phase 3 — 고도화

#### 3-1. 알림 시스템 (Notification)

**Backend:**
- `GET  /api/v1/notifications` — 알림 목록
- `PATCH /api/v1/notifications/:id/read` — 읽음 처리
- `PATCH /api/v1/notifications/read-all` — 전체 읽음
- WS `notification` 이벤트 — 실시간 알림 수신

**알림 발생 시점:**
- 결재 요청/승인/반려
- 새 메시지 수신
- 프로젝트 마감 D-3 경고
- 재고 부족 임계치 도달
- 연차 신청 승인/반려
- 새 공지사항 등록

**DB 엔티티:**
```
notifications (id, user_id, type, title, message, link, is_read, created_at)
```

**Frontend:**
- 헤더 알림 벨 실시간 카운트
- 알림 드롭다운 (최근 10건)
- 전체 알림 페이지

---

#### 3-2. 보고서/통계 모듈 (Reports & Analytics)

**Backend API:**
- `GET  /api/v1/reports/revenue?period=` — 매출 리포트
- `GET  /api/v1/reports/projects?period=` — 프로젝트 완료율 리포트
- `GET  /api/v1/reports/safety?period=` — 안전 리포트
- `GET  /api/v1/reports/hr?period=` — 인력 배치/출퇴근 통계
- `GET  /api/v1/reports/materials?period=` — 자재 현황 리포트
- `GET  /api/v1/reports/export?type=` — Excel/PDF 내보내기

**차트 유형:**
- 월별 매출 추이 (라인 차트)
- 프로젝트 상태 분포 (도넛 차트)
- 부서별 인력 현황 (바 차트)
- 자재 카테고리별 재고 (바 차트)
- 안전 Zero Day 달력

**Frontend 페이지:**
- 리포트 대시보드 (기간 선택 + 차트 영역)
- 매출/프로젝트/안전/인력 탭
- 차트 라이브러리: Recharts 또는 Chart.js

---

#### 3-3. 설정 모듈 (Admin Settings)

**Backend API:**
- `GET/PUT /api/v1/settings/system` — 시스템 설정
- `GET/POST /api/v1/users` — 사용자 목록/등록 (어드민 전용)
- `POST /api/v1/users/bulk-import` — CSV 일괄 등록
- `GET /api/v1/audit-logs` — 감사 로그

**Frontend 페이지:**
- 사용자 관리 (목록, 초대, 역할 변경, 비활성화)
- 조직 구조 편집 (부서 추가/수정/삭제)
- 권한 설정 매트릭스
- 감사 로그 뷰어

---

#### 3-4. 다국어 지원 (i18n)

**Backend (nestjs-i18n):**
- 한국어 (`src/i18n/ko/`) — 기본값
- 영어 (`src/i18n/en/`)
- 일본어 (`src/i18n/ja/`) — 선택적
- Accept-Language 헤더 기반 자동 전환
- 에러 메시지 다국어화

**Frontend (next-intl):**
- 번역 파일: `web/messages/ko.json`, `en.json`, `ja.json`
- 언어 선택 UI (Header 드롭다운)
- `[locale]` 라우팅 그룹 적용
- 미들웨어 자동 감지

---

#### 3-5. 실시간 기능 강화 (WebSocket)

**구현 범위:**
- NestJS Socket.io Gateway 설정
- 실시간 채팅 메시지
- 실시간 알림 Push
- 타이핑 인디케이터
- 온라인 상태 표시
- Redis Pub/Sub (다중 인스턴스 대비)

---

#### 3-6. 안전관리 모듈 (Safety)

**Backend API:**
- `GET  /api/v1/safety/checklists` — 안전 체크리스트 목록
- `POST /api/v1/safety/checklists` — 체크리스트 제출
- `GET  /api/v1/safety/incidents` — 사고/위험 보고 목록
- `POST /api/v1/safety/incidents` — 사고 보고 등록
- `GET  /api/v1/safety/zero-days` — 안전 Zero Day 현황
- `GET  /api/v1/safety/stats` — 안전 통계

**DB 엔티티:**
```
safety_checklists (id, project_id, checker_id, date, items_json, photo_url, status)
safety_incidents  (id, project_id, reporter_id, type, description, severity,
                   occurred_at, action_taken, resolved_at)
```

**Frontend 페이지:**
- 안전 체크리스트 폼 (현장관리자용)
- 사고 보고서 작성
- Zero Day 카운터 (대시보드 위젯)
- 안전 현황 리포트

---

### Phase 4 — 보안 및 성능

#### 4-1. 보안 강화

| 항목 | 내용 |
|------|------|
| OAuth 로그인 | Google Workspace, Microsoft Azure AD |
| 2FA / OTP | TOTP 기반 이중 인증 |
| Rate Limiting | Throttler 모듈 (이미 설치됨) 세부 설정 |
| AES-256 암호화 | 급여, 계좌번호 등 민감 정보 |
| 감사 로그 | 모든 CUD 작업 기록 |
| Helmet.js | 보안 HTTP 헤더 |
| CSRF 토큰 | 상태 변경 요청 검증 |

#### 4-2. 성능 최적화

| 항목 | 내용 |
|------|------|
| Redis 캐싱 | 대시보드 stats TTL 60초 캐시 |
| Cursor Pagination | 대량 데이터 페이지네이션 |
| DB 인덱스 | 자주 조회하는 컬럼 인덱스 추가 |
| N+1 쿼리 방지 | TypeORM `relations` → `join` 최적화 |
| Bull Queue | 이메일, 보고서 생성 비동기 처리 |
| Next.js ISR | 정적 데이터 증분 재생성 |
| Code Splitting | 동적 `import()` 활용 |

#### 4-3. 모니터링 & 로깅

| 항목 | 내용 |
|------|------|
| Winston Logger | 구조화된 로그 (파일 + 콘솔) |
| Health Check | `/api/v1/health` 엔드포인트 |
| Prometheus | 메트릭 수집 (선택적) |
| Sentry | 에러 트래킹 (선택적) |

---

### Phase 5 — CI/CD 및 운영

#### 5-1. GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  backend:
    - npm install
    - npm run lint
    - npm run test
    - npm run build
  frontend:
    - npm install
    - npm run lint
    - npm run build
```

#### 5-2. 테스트 코드

| 레이어 | 도구 | 범위 |
|--------|------|------|
| Backend Unit | Jest | 서비스 레이어, DTO 검증 |
| Backend E2E | Jest + Supertest | API 엔드포인트 전체 |
| Frontend Unit | Vitest + Testing Library | 컴포넌트 |
| Frontend E2E | Playwright | 주요 사용자 플로우 |
| Storybook | Storybook | UI 컴포넌트 문서화 |

---

## 4. 실행 환경 (현재 기준)

| 서비스 | 포트 | URL |
|--------|------|-----|
| **Frontend** | 3001 | http://localhost:3001 |
| **Backend API** | 3002 | http://localhost:3002/api/v1 |
| **Swagger 문서** | 3002 | http://localhost:3002/api/docs |
| PostgreSQL | 5432 | localhost:5432/kmtls_groupware |
| Redis | 6379 | localhost:6379 (선택적) |

> ⚠️ 포트 3000은 open-webui(OrbStack)가 점유 중이므로 backend는 3002 사용

### 로컬 실행 방법

```bash
# 원클릭 시작
./start_dev.sh start

# 개별 실행
cd backend && npm run start:dev   # 포트 3002
cd web && npm run dev              # 포트 3001

# 로그 확인
./start_dev.sh logs backend
./start_dev.sh logs frontend

# 서비스 중지
./start_dev.sh stop
```

### 테스트 계정 (비밀번호: `Test1234!`)

| 역할 | 이메일 |
|------|--------|
| CEO | ceo@kmtls.com |
| EXECUTIVE | executive@kmtls.com |
| PM | pm1@kmtls.com / pm2@kmtls.com |
| 현장관리자 | field@kmtls.com |
| 자재팀 | material@kmtls.com |
| HR팀 | hr@kmtls.com |
| 일반사원 | employee1@kmtls.com |

---

## 5. 완료 기준 (Definition of Done)

### MVP 완료 ✅
- [x] 5개+ 테스트 계정으로 로그인 가능
- [x] 역할별 대시보드 KPI 데이터 표시
- [x] 프로젝트 목록 조회 및 칸반 보드
- [x] CRM 고객사 목록 + 거래 파이프라인
- [x] HR 직원/출퇴근/연차 현황
- [x] 조직도 페이지
- [x] Swagger API 문서 접근 가능
- [x] 반응형 레이아웃 정상 동작
- [x] 백엔드 빌드 및 시드 데이터 자동 실행

### Phase 2 목표 (미완료)
- [ ] 자재관리 전체 기능
- [ ] 전자결재 워크플로우
- [ ] 게시판 + 공지사항
- [ ] 일정관리 캘린더 뷰
- [ ] 실시간 메신저 (WebSocket)
- [ ] 파일 드라이브

### Phase 3 목표 (미완료)
- [ ] 실시간 알림 시스템
- [ ] 보고서/통계 차트 페이지
- [ ] 관리자 설정 페이지
- [ ] 다국어 UI (한/영/일)
- [ ] 안전관리 체크리스트

### Phase 4 목표 (미완료)
- [ ] OAuth 로그인 (Google, Microsoft)
- [ ] 2FA/OTP
- [ ] Redis 캐싱 전략 적용
- [ ] 감사 로그
- [ ] 성능 최적화 (인덱스, N+1 제거)

### Phase 5 목표 (미완료)
- [ ] GitHub Actions CI/CD 파이프라인
- [ ] Jest 단위 테스트
- [ ] Playwright E2E 테스트
- [ ] Storybook 컴포넌트 문서

---

## 6. 우선순위 로드맵

```
[완료] MVP v1.0 ─────────────────── 2026-03-30
         ✓ Auth, Project, CRM, HR, Dashboard
         ✓ 전체 UI 레이아웃

[다음] Phase 2 ──────────────────── 우선 구현 권장
         - 자재관리 (현장 업무 핵심)
         - 전자결재 (승인 플로우 필수)
         - 게시판/공지 (커뮤니케이션)
         - 일정관리 캘린더

[이후] Phase 3 ──────────────────── 고도화
         - 실시간 알림 + 메신저
         - 보고서/통계
         - 안전관리

[장기] Phase 4/5 ────────────────── 운영 준비
         - OAuth, 2FA, 감사로그
         - CI/CD, 테스트, 모니터링
```

---

*최초 작성: 2026-03-30 | 최종 업데이트: 2026-03-30 | 버전: 2.0*
