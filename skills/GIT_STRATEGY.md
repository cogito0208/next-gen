# Git 업데이트 전략 가이드

## 프로젝트 Git 정보

**저장소**: https://github.com/cogito0208/next-gen
**기본 브랜치**: main
**Git 전략**: Git Flow

## 브랜치 전략 (Git Flow)

### 브랜치 종류

```
main (프로덕션)
  └── develop (개발)
        ├── feature/* (기능 개발)
        ├── release/* (릴리즈 준비)
        └── hotfix/* (긴급 수정)
```

### 1. main 브랜치
- **목적**: 프로덕션 배포 코드
- **보호 수준**: 높음 (직접 커밋 금지)
- **머지 조건**:
  - develop 또는 hotfix에서만 머지 가능
  - Pull Request + 코드 리뷰 필수
  - CI/CD 통과 필수
- **태그**: 버전 태그 (v1.0.0, v1.1.0 등)

### 2. develop 브랜치
- **목적**: 개발 통합 브랜치
- **보호 수준**: 중간 (직접 커밋 최소화)
- **머지 조건**:
  - feature 브랜치에서 Pull Request
  - 코드 리뷰 권장
  - CI 통과 필수

### 3. feature 브랜치
- **목적**: 새로운 기능 개발
- **네이밍**: `feature/{모듈명}-{기능명}`
- **예시**:
  ```
  feature/auth-login
  feature/dashboard-kpi
  feature/crm-customer-list
  feature/hr-payroll
  ```
- **생성 기준**: develop 브랜치에서 분기
- **머지 대상**: develop 브랜치
- **삭제**: 머지 후 삭제

### 4. release 브랜치
- **목적**: 릴리즈 준비 (버그 수정, 문서화)
- **네이밍**: `release/v{버전}`
- **예시**: `release/v1.0.0`, `release/v1.1.0`
- **생성 기준**: develop 브랜치에서 분기
- **머지 대상**: main + develop (동시)
- **삭제**: 머지 후 삭제

### 5. hotfix 브랜치
- **목적**: 프로덕션 긴급 수정
- **네이밍**: `hotfix/{이슈명}`
- **예시**: `hotfix/critical-login-bug`, `hotfix/security-patch`
- **생성 기준**: main 브랜치에서 분기
- **머지 대상**: main + develop (동시)
- **삭제**: 머지 후 삭제

## 커밋 메시지 규칙 (Conventional Commits)

### 기본 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 종류

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat(auth): Google OAuth 로그인 추가` |
| `fix` | 버그 수정 | `fix(dashboard): CEO 대시보드 KPI 계산 오류 수정` |
| `docs` | 문서 수정 | `docs(readme): 설치 가이드 업데이트` |
| `style` | 코드 포맷팅 (기능 변경 없음) | `style(web): Prettier 적용` |
| `refactor` | 리팩토링 | `refactor(api): 인증 미들웨어 구조 개선` |
| `test` | 테스트 코드 | `test(auth): 로그인 E2E 테스트 추가` |
| `chore` | 빌드/설정 변경 | `chore(deps): NestJS 10.0 업그레이드` |
| `perf` | 성능 개선 | `perf(query): 프로젝트 목록 조회 쿼리 최적화` |
| `ci` | CI/CD 설정 | `ci(github): 자동 배포 워크플로우 추가` |
| `revert` | 커밋 되돌리기 | `revert: feat(auth): OAuth 로그인 되돌림` |

### Scope 예시 (모듈별)
- `auth` - 인증/인가
- `dashboard` - 대시보드
- `crm` - 고객 관리
- `project` - 프로젝트 관리
- `material` - 자재 관리
- `hr` - 인사 관리
- `approval` - 전자결재
- `messenger` - 메신저
- `api` - API 공통
- `web` - 웹 프론트엔드
- `docs` - 문서

### 커밋 메시지 예시

**좋은 예시:**
```bash
feat(auth): JWT 기반 인증 구현

- Access Token (15분) + Refresh Token (7일)
- httpOnly Cookie 저장
- Passport.js 통합

Resolves: #123
```

```bash
fix(dashboard): PM 대시보드 지연 프로젝트 필터링 오류

지연 일수 계산 로직에서 주말을 제외하지 않아
실제 지연 일수보다 많이 표시되는 문제 수정

Fixes: #456
```

```bash
refactor(material): 자재 출납 서비스 구조 개선

- Repository 패턴 적용
- 트랜잭션 관리 개선
- 에러 핸들링 강화
```

**나쁜 예시:**
```bash
# ❌ 너무 모호함
fix: bug fix

# ❌ 한글 사용 (영문 권장)
수정: 로그인 버그 수정

# ❌ type 누락
로그인 기능 추가

# ❌ 너무 일반적
update code
```

## 작업 워크플로우

### 1. 새로운 기능 개발

```bash
# 1. develop 브랜치로 이동 및 최신화
git checkout develop
git pull origin develop

# 2. feature 브랜치 생성
git checkout -b feature/auth-login

# 3. 작업 수행 (코딩)
# ... 코드 작성 ...

# 4. 변경사항 커밋
git add .
git commit -m "feat(auth): 로그인 API 엔드포인트 구현"

# 5. 추가 작업 (필요시)
git commit -m "feat(auth): 로그인 UI 컴포넌트 추가"

# 6. 원격 저장소에 푸시
git push origin feature/auth-login

# 7. GitHub에서 Pull Request 생성
# - Base: develop
# - Compare: feature/auth-login

# 8. 코드 리뷰 후 머지

# 9. 로컬에서 브랜치 정리
git checkout develop
git pull origin develop
git branch -d feature/auth-login
```

### 2. 릴리즈 준비

```bash
# 1. develop에서 release 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. 버전 정보 업데이트
# - package.json 버전 수정
# - CHANGELOG.md 작성

git commit -m "chore(release): v1.0.0 준비"

# 3. 버그 수정 (필요시)
git commit -m "fix(release): 마이너 버그 수정"

# 4. 원격 저장소에 푸시
git push origin release/v1.0.0

# 5. Pull Request 생성 (main + develop 동시)
# - PR 1: release/v1.0.0 → main
# - PR 2: release/v1.0.0 → develop

# 6. 머지 후 main에 태그 생성
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 7. 브랜치 삭제
git branch -d release/v1.0.0
```

### 3. 긴급 수정 (Hotfix)

```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/critical-login-bug

# 2. 버그 수정
git commit -m "fix(auth): 로그인 시 토큰 만료 체크 누락 수정"

# 3. 버전 업데이트 (패치 버전)
# v1.0.0 → v1.0.1
git commit -m "chore(release): v1.0.1 hotfix"

# 4. 원격 저장소에 푸시
git push origin hotfix/critical-login-bug

# 5. Pull Request 생성 (main + develop 동시)
# - PR 1: hotfix/critical-login-bug → main
# - PR 2: hotfix/critical-login-bug → develop

# 6. 머지 후 main에 태그 생성
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin v1.0.1

# 7. 브랜치 삭제
git branch -d hotfix/critical-login-bug
```

## Pull Request (PR) 가이드

### PR 제목 형식
```
[{Type}] {간단한 설명}
```

**예시:**
- `[Feature] 로그인 기능 구현`
- `[Fix] 대시보드 KPI 계산 오류 수정`
- `[Refactor] 인증 미들웨어 구조 개선`

### PR 본문 템플릿

```markdown
## 변경 사항
<!-- 무엇을 변경했는지 간단히 설명 -->
- 로그인 API 엔드포인트 구현 (POST /api/v1/auth/login)
- JWT 기반 인증 토큰 발급
- 로그인 UI 컴포넌트 추가

## 변경 이유
<!-- 왜 이 변경이 필요한지 설명 -->
사용자 인증 기능 구현을 위해 JWT 기반 로그인 시스템이 필요합니다.

## 테스트 방법
<!-- 어떻게 테스트했는지 -->
- [ ] 단위 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 수동 테스트 완료

## 스크린샷 (UI 변경 시)
<!-- 변경 전/후 스크린샷 -->

## 관련 이슈
<!-- 관련 이슈 번호 -->
Closes #123
Related to #456

## 체크리스트
- [ ] 코드 컨벤션 준수
- [ ] 테스트 코드 작성
- [ ] 문서 업데이트 (필요시)
- [ ] 다국어 지원 확인
- [ ] 권한 검증 추가
```

### 코드 리뷰 체크포인트

**리뷰어가 확인해야 할 사항:**
- [ ] 코드 품질 (가독성, 유지보수성)
- [ ] 비즈니스 로직 정확성
- [ ] 보안 취약점 (SQL Injection, XSS 등)
- [ ] 성능 이슈 (N+1 쿼리, 불필요한 연산)
- [ ] 에러 핸들링
- [ ] 테스트 커버리지
- [ ] 다국어 지원
- [ ] 권한 검증
- [ ] API 문서 업데이트

## .gitignore 설정

```gitignore
# 환경 변수
.env
.env.local
.env.*.local

# 의존성
node_modules/
/backend/node_modules/
/web/node_modules/

# 빌드 결과물
/backend/dist/
/web/.next/
/web/out/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# 테스트
coverage/
.nyc_output/

# 데이터베이스
*.sqlite
*.db

# 임시 파일
tmp/
temp/
*.tmp

# 비밀 정보
secrets/
*.pem
*.key
```

## 버전 관리 규칙 (Semantic Versioning)

### 버전 형식
```
v{Major}.{Minor}.{Patch}
```

### 버전 증가 규칙
- **Major**: 하위 호환성이 깨지는 변경 (v1.0.0 → v2.0.0)
- **Minor**: 하위 호환 가능한 기능 추가 (v1.0.0 → v1.1.0)
- **Patch**: 하위 호환 가능한 버그 수정 (v1.0.0 → v1.0.1)

### 예시
- `v0.1.0` - 초기 개발 버전
- `v1.0.0` - 첫 프로덕션 릴리즈
- `v1.1.0` - 새로운 기능 추가 (CRM 모듈)
- `v1.1.1` - 버그 수정 (로그인 오류)
- `v2.0.0` - API 구조 대폭 변경

## 협업 규칙

### 1. 커밋 전 확인사항
```bash
# 1. 최신 코드 동기화
git pull origin develop

# 2. 린트 검사
npm run lint

# 3. 테스트 실행
npm run test

# 4. 빌드 확인
npm run build
```

### 2. 충돌 해결
```bash
# 1. develop 최신화
git checkout develop
git pull origin develop

# 2. feature 브랜치에 rebase
git checkout feature/my-feature
git rebase develop

# 3. 충돌 해결 후
git add .
git rebase --continue

# 4. 강제 푸시 (이미 푸시한 경우)
git push origin feature/my-feature --force-with-lease
```

### 3. 커밋 취소/수정

**마지막 커밋 수정:**
```bash
git commit --amend -m "수정된 커밋 메시지"
```

**커밋 되돌리기:**
```bash
# 작업 내용 유지하며 커밋만 취소
git reset --soft HEAD~1

# 작업 내용까지 모두 취소 (주의!)
git reset --hard HEAD~1
```

**특정 커밋 되돌리기:**
```bash
git revert <commit-hash>
```

## CI/CD 연동

### GitHub Actions 워크플로우

**파일 위치**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      - name: Run lint
        working-directory: ./backend
        run: npm run lint
      - name: Run tests
        working-directory: ./backend
        run: npm run test:cov

  web-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        working-directory: ./web
        run: npm ci
      - name: Run lint
        working-directory: ./web
        run: npm run lint
      - name: Run tests
        working-directory: ./web
        run: npm run test
```

## 유용한 Git 명령어

### 브랜치 관리
```bash
# 브랜치 목록 (로컬)
git branch

# 브랜치 목록 (원격 포함)
git branch -a

# 브랜치 삭제 (로컬)
git branch -d feature/my-feature

# 브랜치 삭제 (원격)
git push origin --delete feature/my-feature

# 원격 브랜치 가져오기
git fetch origin
git checkout -b feature/my-feature origin/feature/my-feature
```

### 이력 확인
```bash
# 커밋 이력 (간단)
git log --oneline

# 커밋 이력 (그래프)
git log --oneline --graph --all

# 특정 파일 이력
git log -- path/to/file

# 특정 커밋 상세 정보
git show <commit-hash>
```

### 변경 사항 확인
```bash
# Working Directory 변경 사항
git diff

# Staged 변경 사항
git diff --staged

# 브랜치 간 차이
git diff develop...feature/my-feature
```

### Stash (임시 저장)
```bash
# 현재 작업 임시 저장
git stash

# 저장 목록 확인
git stash list

# 저장한 작업 복원
git stash pop

# 특정 stash 복원
git stash apply stash@{0}
```

## 문제 해결 (Troubleshooting)

### 1. 푸시가 거부될 때
```bash
# 원격 변경사항 가져오기
git pull origin develop --rebase

# 충돌 해결 후
git push origin feature/my-feature
```

### 2. 잘못된 브랜치에 커밋한 경우
```bash
# 1. 올바른 브랜치 생성
git branch correct-branch

# 2. 원래 브랜치로 돌아가기
git checkout original-branch

# 3. 커밋 되돌리기
git reset --hard HEAD~1

# 4. 올바른 브랜치로 이동
git checkout correct-branch
```

### 3. 민감한 정보를 커밋한 경우
```bash
# 주의: 이력 변경이므로 팀원과 협의 필요
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive-file" \
  --prune-empty --tag-name-filter cat -- --all

# 강제 푸시 (위험!)
git push origin --force --all
```

## 참고 자료

- [Git 공식 문서](https://git-scm.com/doc)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)

---

**마지막 업데이트**: 2026-03-30
**버전**: 1.0
**관리자**: 프로젝트 관리팀
