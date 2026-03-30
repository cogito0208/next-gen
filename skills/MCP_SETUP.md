# MCP (Model Context Protocol) 설정 가이드

## 개요

이 문서는 KMTLS 그룹웨어 프로젝트에서 MCP를 설정하고 사용하는 방법을 설명합니다.

## MCP란?

**Model Context Protocol (MCP)**은 AI 애플리케이션이 외부 도구, 데이터 소스, API에 안전하게 접근할 수 있도록 하는 개방형 프로토콜입니다.

### 주요 이점
- ✅ **통합된 컨텍스트**: 프로젝트 파일, Git, 데이터베이스를 하나의 인터페이스로
- ✅ **보안성**: 권한 기반 접근 제어
- ✅ **확장성**: 다양한 MCP 서버 추가 가능
- ✅ **표준화**: 오픈 소스 프로토콜로 커뮤니티 지원

## 프로젝트 MCP 구성

### 설정된 MCP 서버

| 서버 | 패키지 | 목적 |
|------|--------|------|
| Filesystem | `@modelcontextprotocol/server-filesystem` | 프로젝트 파일 접근 |
| Git | `@modelcontextprotocol/server-git` | Git 저장소 관리 |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | 데이터베이스 쿼리 |
| GitHub | `@modelcontextprotocol/server-github` | GitHub 이슈/PR 관리 |

## 빠른 시작

### 1. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 필수 환경 변수 입력
# - POSTGRES_PASSWORD
# - GITHUB_TOKEN
```

### 2. Claude Desktop 설정

#### macOS
```bash
# 설정 파일 위치
~/.config/claude/claude_desktop_config.json
```

#### Windows
```bash
# 설정 파일 위치
%APPDATA%\Claude\claude_desktop_config.json
```

#### Linux
```bash
# 설정 파일 위치
~/.config/claude/claude_desktop_config.json
```

### 3. 설정 파일 편집

Claude Desktop 설정 파일에 다음 내용을 추가:

```json
{
  "mcpServers": {
    "kmtls-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/haeyoung/next_gen_01"
      ]
    },
    "kmtls-git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "/Users/haeyoung/next_gen_01"
      ]
    },
    "kmtls-github": {
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
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
      }
    }
  }
}
```

**⚠️ 주의**: Windows 사용자는 경로를 백슬래시로 변경:
```
"C:\\Users\\haeyoung\\next_gen_01"
```

### 4. Claude Desktop 재시작

설정을 적용하려면 Claude Desktop을 완전히 종료하고 다시 시작합니다.

## GitHub Token 생성

### 1. GitHub 설정 페이지 접속
https://github.com/settings/tokens

### 2. 새 토큰 생성
- "Generate new token" → "Generate new token (classic)"

### 3. 권한 선택
필요한 스코프:
- ✅ `repo` - 저장소 전체 접근
- ✅ `read:org` - 조직 정보 읽기
- ✅ `workflow` - GitHub Actions 워크플로우

### 4. 토큰 복사
생성된 토큰(ghp_로 시작)을 복사하여 안전한 곳에 보관

### 5. 환경 변수 설정
```bash
# .env 파일에 추가
GITHUB_TOKEN=ghp_your_token_here
```

## PostgreSQL 설정

### 1. 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE kmtls_groupware;

# 유저 생성 (선택)
CREATE USER kmtls_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kmtls_groupware TO kmtls_user;
```

### 2. 환경 변수 설정

```bash
# .env 파일에 추가
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=kmtls_groupware
```

### 3. MCP PostgreSQL 서버 설정

```json
{
  "mcpServers": {
    "kmtls-postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:YOUR_PASSWORD@localhost:5432/kmtls_groupware"
      ]
    }
  }
}
```

**⚠️ 보안**: 비밀번호를 직접 입력하지 말고 환경 변수 사용 권장

## MCP 서버 직접 실행 (테스트)

### Filesystem Server
```bash
npx -y @modelcontextprotocol/server-filesystem /Users/haeyoung/next_gen_01
```

### Git Server
```bash
npx -y @modelcontextprotocol/server-git --repository /Users/haeyoung/next_gen_01
```

### GitHub Server
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token
npx -y @modelcontextprotocol/server-github --owner cogito0208 --repo next-gen
```

### PostgreSQL Server
```bash
export PGPASSWORD=your_password
npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/kmtls_groupware
```

## 사용 예시

### Claude와 대화하기

MCP가 설정되면 Claude에게 다음과 같이 요청할 수 있습니다:

#### 파일 시스템
```
"backend/src/modules/auth 폴더의 파일 목록을 보여줘"
"skills/REQUIREMENTS.md 파일을 읽어줘"
"새로운 feature 브랜치를 만들어줘"
```

#### Git
```
"최근 5개의 커밋 이력을 보여줘"
"현재 브랜치의 변경사항을 확인해줘"
"main 브랜치와 develop 브랜치의 차이를 보여줘"
```

#### GitHub
```
"진행 중인 이슈 목록을 보여줘"
"PR #123의 리뷰 댓글을 확인해줘"
"새로운 이슈를 생성해줘: [버그] 로그인 오류"
```

#### PostgreSQL
```
"데이터베이스 스키마를 보여줘"
"users 테이블의 구조를 설명해줘"
"최근 가입한 사용자 10명을 조회해줘"
```

## 추가 MCP 서버 설정

### Docker
```bash
npm install -g @modelcontextprotocol/server-docker
```

```json
{
  "kmtls-docker": {
    "command": "mcp-server-docker"
  }
}
```

### Slack
```bash
npm install -g @modelcontextprotocol/server-slack
```

```json
{
  "kmtls-slack": {
    "command": "mcp-server-slack",
    "env": {
      "SLACK_BOT_TOKEN": "xoxb-your-token"
    }
  }
}
```

### MongoDB
```bash
npm install -g @modelcontextprotocol/server-mongodb
```

```json
{
  "kmtls-mongodb": {
    "command": "mcp-server-mongodb",
    "args": ["mongodb://localhost:27017/kmtls"]
  }
}
```

## 보안 모범 사례

### ✅ 해야 할 것
1. **환경 변수 사용**
   - 토큰, 비밀번호는 환경 변수로 관리
   - `.env` 파일은 절대 Git에 커밋하지 않기

2. **최소 권한 원칙**
   - 필요한 권한만 부여
   - 읽기 전용 계정 사용 (가능한 경우)

3. **토큰 주기적 갱신**
   - GitHub Token 정기 교체
   - 만료 기한 설정

4. **접근 제한**
   - Filesystem Server는 프로젝트 디렉토리만
   - 시스템 전체 접근 금지

### ❌ 하지 말아야 할 것
1. 설정 파일에 비밀번호 하드코딩
2. 프로덕션 데이터베이스 직접 접근
3. 관리자 권한으로 MCP 서버 실행
4. 토큰을 Git에 커밋

## 문제 해결

### MCP 서버가 시작되지 않을 때

**1. Node.js 버전 확인**
```bash
node --version
# 18.0.0 이상 필요
```

**2. npx 캐시 정리**
```bash
npm cache clean --force
```

**3. 수동 설치**
```bash
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-postgres
```

### "Permission denied" 오류

**파일 권한 확인**
```bash
ls -la /Users/haeyoung/next_gen_01
```

**Git 권한 확인**
```bash
cd /Users/haeyoung/next_gen_01
git status
```

### GitHub Token 오류

**토큰 권한 확인**
- https://github.com/settings/tokens
- 필요한 스코프가 체크되어 있는지 확인

**환경 변수 확인**
```bash
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

### PostgreSQL 연결 실패

**데이터베이스 실행 확인**
```bash
# macOS (Homebrew)
brew services list

# Linux
systemctl status postgresql

# Windows
# 서비스 관리자에서 확인
```

**연결 테스트**
```bash
psql -U postgres -d kmtls_groupware -h localhost
```

## Claude Code CLI에서 MCP 사용

Claude Code CLI에서도 MCP를 사용할 수 있습니다:

### 설정 위치
```bash
~/.claude/config.json
```

### 설정 방법
```json
{
  "mcpServers": {
    // Claude Desktop과 동일한 설정
  }
}
```

## 성능 최적화

### 1. 파일 시스템 인덱싱
대용량 프로젝트의 경우 `.gitignore` 패턴 활용:
```
node_modules/
dist/
.next/
```

### 2. 쿼리 최적화
PostgreSQL MCP 사용 시 인덱스 활용

### 3. 캐싱
자주 사용하는 데이터는 Redis 캐시 활용 권장

## 업데이트

### MCP 서버 업데이트
```bash
# 전역 설치된 패키지 업데이트
npm update -g @modelcontextprotocol/server-filesystem
npm update -g @modelcontextprotocol/server-git
npm update -g @modelcontextprotocol/server-github
npm update -g @modelcontextprotocol/server-postgres

# 또는 npx 사용 시 자동 최신 버전
npx -y @modelcontextprotocol/server-filesystem
```

### 설정 파일 백업
```bash
# Claude Desktop 설정 백업
cp ~/.config/claude/claude_desktop_config.json \
   ~/.config/claude/claude_desktop_config.json.backup
```

## 참고 자료

### 공식 문서
- [MCP 공식 사이트](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [MCP 서버 목록](https://github.com/modelcontextprotocol/servers)

### Claude 문서
- [Claude Desktop 가이드](https://docs.anthropic.com/claude/docs)
- [Claude API 문서](https://docs.anthropic.com/claude/reference)

### 커뮤니티
- [Discord](https://discord.gg/modelcontextprotocol)
- [GitHub Discussions](https://github.com/modelcontextprotocol/discussions)

## FAQ

### Q: MCP 없이도 Claude를 사용할 수 있나요?
A: 네, 가능합니다. MCP는 선택사항이며, 프로젝트 컨텍스트 접근을 향상시킵니다.

### Q: MCP 서버는 안전한가요?
A: MCP는 권한 기반 접근 제어를 사용하며, 지정된 디렉토리/리소스만 접근합니다.

### Q: 여러 프로젝트에서 MCP를 사용할 수 있나요?
A: 네, 각 프로젝트별로 다른 MCP 서버를 설정할 수 있습니다.

### Q: MCP 서버가 오프라인에서도 작동하나요?
A: Filesystem과 Git 서버는 오프라인에서 작동하지만, GitHub, API 서버는 인터넷 연결이 필요합니다.

---

**마지막 업데이트**: 2026-03-30
**버전**: 1.0
**문의**: 프로젝트 관리팀
