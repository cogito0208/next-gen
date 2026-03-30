# MCP (Model Context Protocol) 설정

이 디렉토리는 Claude와 프로젝트 간의 Model Context Protocol 설정을 관리합니다.

## MCP란?

Model Context Protocol(MCP)은 AI 애플리케이션이 외부 도구, 데이터 소스, API에 안전하게 접근할 수 있도록 하는 개방형 프로토콜입니다.

## 설정된 MCP 서버

### 1. Filesystem Server
- **목적**: 프로젝트 파일 시스템 접근
- **경로**: `/Users/haeyoung/next_gen_01`
- **기능**:
  - 파일 읽기/쓰기
  - 디렉토리 탐색
  - 파일 검색

### 2. Git Server
- **목적**: Git 저장소 작업
- **저장소**: `/Users/haeyoung/next_gen_01`
- **기능**:
  - 커밋 이력 조회
  - 브랜치 관리
  - 변경사항 확인
  - 파일 이력 추적

### 3. PostgreSQL Server
- **목적**: 데이터베이스 접근
- **연결**: `postgresql://localhost:5432/kmtls_groupware`
- **기능**:
  - 스키마 조회
  - 쿼리 실행
  - 데이터 분석

### 4. GitHub Server
- **목적**: GitHub 저장소 연동
- **저장소**: `cogito0208/next-gen`
- **기능**:
  - 이슈 관리
  - Pull Request 조회
  - 코드 리뷰
  - 워크플로우 확인

## Claude Desktop 설정

Claude Desktop 앱에서 이 프로젝트의 MCP를 사용하려면:

### macOS/Linux
```bash
# Claude Desktop 설정 파일 위치
~/.config/claude/claude_desktop_config.json
```

### Windows
```bash
# Claude Desktop 설정 파일 위치
%APPDATA%\Claude\claude_desktop_config.json
```

### 설정 방법

1. Claude Desktop 설정 파일을 엽니다
2. 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "next-gen-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/haeyoung/next_gen_01"
      ]
    },
    "next-gen-git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "/Users/haeyoung/next_gen_01"
      ]
    },
    "next-gen-github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github",
        "--owner",
        "cogito0208",
        "--repo",
        "next-gen"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

3. Claude Desktop을 재시작합니다

## 환경 변수 설정

MCP 서버가 제대로 작동하려면 다음 환경 변수를 설정해야 합니다:

### `.env` 파일 생성
```bash
# 프로젝트 루트에 .env 파일 생성
cp .env.example .env
```

### 필요한 환경 변수
```bash
# PostgreSQL
POSTGRES_PASSWORD=your_password_here

# GitHub (Personal Access Token)
# https://github.com/settings/tokens 에서 생성
GITHUB_TOKEN=ghp_your_token_here
```

## MCP 서버 직접 실행 (테스트용)

개별 MCP 서버를 직접 실행하여 테스트할 수 있습니다:

### Filesystem Server
```bash
npx -y @modelcontextprotocol/server-filesystem /Users/haeyoung/next_gen_01
```

### Git Server
```bash
npx -y @modelcontextprotocol/server-git --repository /Users/haeyoung/next_gen_01
```

### PostgreSQL Server
```bash
export PGPASSWORD=your_password
npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/kmtls_groupware
```

### GitHub Server
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token
npx -y @modelcontextprotocol/server-github --owner cogito0208 --repo next-gen
```

## 사용 가능한 MCP 서버 목록

공식 MCP 서버 외에도 다음 서버들을 추가할 수 있습니다:

### 개발 도구
- `@modelcontextprotocol/server-docker` - Docker 컨테이너 관리
- `@modelcontextprotocol/server-kubernetes` - Kubernetes 클러스터 관리
- `@modelcontextprotocol/server-aws` - AWS 서비스 연동

### 데이터베이스
- `@modelcontextprotocol/server-mongodb` - MongoDB 접근
- `@modelcontextprotocol/server-redis` - Redis 캐시 관리
- `@modelcontextprotocol/server-mysql` - MySQL 데이터베이스

### 커뮤니케이션
- `@modelcontextprotocol/server-slack` - Slack 메시지 전송
- `@modelcontextprotocol/server-email` - 이메일 발송

### 유틸리티
- `@modelcontextprotocol/server-web-search` - 웹 검색
- `@modelcontextprotocol/server-memory` - 메모리/컨텍스트 저장

## 보안 고려사항

### 1. 민감한 정보 보호
- API 키, 토큰은 절대 config.json에 하드코딩하지 마세요
- 환경 변수 사용 권장: `${ENV_VAR_NAME}`

### 2. 파일 시스템 접근 제한
- Filesystem Server는 지정된 디렉토리만 접근 가능
- 시스템 전체 접근은 보안 위험

### 3. 데이터베이스 권한
- 프로덕션 DB 접근 시 읽기 전용 계정 사용 권장
- 민감한 데이터는 마스킹 처리

### 4. GitHub Token 권한
- 최소 권한 원칙 적용
- 필요한 스코프만 부여 (repo, read:org 등)

## 문제 해결

### MCP 서버가 시작되지 않을 때
1. Node.js 버전 확인 (18+ 권장)
   ```bash
   node --version
   ```

2. npx 캐시 정리
   ```bash
   npm cache clean --force
   ```

3. MCP 서버 패키지 수동 설치
   ```bash
   npm install -g @modelcontextprotocol/server-filesystem
   npm install -g @modelcontextprotocol/server-git
   ```

### 권한 오류
```bash
# 파일 권한 확인
ls -la /Users/haeyoung/next_gen_01

# Git 저장소 권한 확인
git config --list
```

### 환경 변수가 인식되지 않을 때
```bash
# 환경 변수 확인
echo $GITHUB_TOKEN
echo $POSTGRES_PASSWORD

# .env 파일 로드
source .env
```

## 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [Claude Desktop 가이드](https://docs.anthropic.com/claude/docs)
- [MCP 서버 목록](https://github.com/modelcontextprotocol/servers)

## 추가 설정

프로젝트 요구사항에 따라 추가 MCP 서버를 설정할 수 있습니다.
새로운 서버 추가 시 이 문서를 업데이트하세요.

---

**마지막 업데이트**: 2026-03-30
**버전**: 1.0
