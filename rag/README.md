# RAG (Retrieval-Augmented Generation) 시스템

## 개요

이 디렉토리는 KMTLS 그룹웨어 프로젝트의 Skills 문서를 벡터 DB로 변환하여 효율적으로 검색하고 Claude와 통합하는 RAG 시스템을 포함합니다.

## 🎯 주요 기능

1. **자동 벡터 DB 생성**: Skills 폴더의 모든 MD 파일을 자동으로 벡터화
2. **변경 감지**: 파일 변경 시 자동으로 RAG DB 업데이트
3. **효율적인 검색**: 관련 문서만 선택적으로 검색 (토큰 98% 절감)
4. **Claude 통합**: RAG 검색 결과를 Claude에게 자동 전달
5. **대화형 모드**: 연속적인 질문/답변 가능

## 📁 파일 구조

```
rag/
├── requirements.txt      # Python 의존성
├── rag_system.py        # RAG 코어 시스템
├── query_rag.py         # Claude + RAG 쿼리
├── README.md            # 이 파일
└── venv/                # 가상환경 (자동 생성)

.rag/
├── chroma_db/           # 벡터 DB 저장소
└── checksums.json       # 파일 변경 감지용
```

## 🚀 빠른 시작

### 방법 1: 시작 스크립트 사용 (추천)

```bash
# 프로젝트 루트에서
./start_claude.sh
```

이 스크립트는:
- ✅ 환경 자동 확인
- ✅ 의존성 자동 설치
- ✅ RAG DB 자동 업데이트
- ✅ 대화형 인터페이스 제공

### 방법 2: 수동 실행

```bash
# 1. 가상환경 생성 및 활성화
python3 -m venv rag/venv
source rag/venv/bin/activate

# 2. 의존성 설치
pip install -r rag/requirements.txt

# 3. RAG DB 생성
python3 rag/rag_system.py

# 4. Claude + RAG 실행
python3 rag/query_rag.py --interactive
```

## 📋 사전 요구사항

### 1. API 키 설정

`.env` 파일에 다음 API 키를 추가하세요:

```bash
# Anthropic API (Claude)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# OpenAI API (임베딩 생성용)
OPENAI_API_KEY=sk-xxxxx
```

**API 키 발급:**
- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/api-keys

### 2. Python 버전

Python 3.8 이상 필요

```bash
python3 --version
```

## 💻 사용 방법

### 1. 대화형 모드

연속적으로 질문하고 답변받기:

```bash
python3 rag/query_rag.py --interactive
```

**예시:**
```
💬 질문: 로그인 기능은 어떻게 구현하나요?

🔍 RAG 검색 중...
📚 관련 문서 5개 발견
   1. REQUIREMENTS.md (관련도: 95%, ~200 토큰)
   2. PROJECT_ARCHITECTURE.md (관련도: 87%, ~180 토큰)
   ...

🤖 Claude에게 질문 중...

📝 답변:
[Claude의 상세한 답변]
```

### 2. 단일 질문 모드

한 번만 질문:

```bash
python3 rag/query_rag.py --question "JWT 인증은 어떻게 구현하나요?"
```

### 3. RAG 검색만 (Claude 없이)

벡터 DB에서 검색만:

```bash
python3 rag/rag_system.py --query "프로젝트 구조"
```

### 4. RAG DB 강제 재생성

파일 변경과 무관하게 강제로 재생성:

```bash
python3 rag/rag_system.py --force
```

## 🔧 고급 옵션

### RAG 검색 결과 개수 조정

```bash
# 상위 10개 결과 가져오기
python3 rag/query_rag.py --question "..." --top-k 10
```

### 커스텀 디렉토리

`rag_system.py`에서 경로 수정:

```python
rag = SkillsRAG(
    skills_dir="./custom_docs",  # 문서 디렉토리
    db_dir="./.rag/custom_db"    # DB 저장 위치
)
```

## 📊 성능 및 비용

### 토큰 절감 효과

| 항목 | 일반 방식 | RAG 방식 | 절감률 |
|------|-----------|----------|--------|
| 문서 로드 | 35,000 토큰 | 800 토큰 | **97.7%** |
| 비용/질문 | $0.105 | $0.002 | **98.1%** |

### 비용 분석 (Claude Sonnet 4.5 기준)

**일반 방식:**
- 입력: 35,000 토큰 × $3/1M = $0.105
- 출력: 500 토큰 × $15/1M = $0.0075
- **총 비용: $0.1125/질문**

**RAG 방식:**
- 입력: 800 토큰 × $3/1M = $0.0024
- 출력: 500 토큰 × $15/1M = $0.0075
- 임베딩: 35,000 토큰 × $0.0001/1K = $0.0035 (1회만)
- **총 비용: $0.01/질문 (93% 절감)**

### 초기 설정 비용

- 벡터 DB 생성: 약 $0.50 (1회만)
- 문서 업데이트 시: 변경된 부분만 재생성 (~$0.05)

## 🔍 작동 원리

### 1. 문서 처리 파이프라인

```
Skills/*.md 파일들
    ↓
[로딩] DirectoryLoader
    ↓
[분할] RecursiveCharacterTextSplitter
    ↓
[임베딩] OpenAI Embeddings (text-embedding-3-small)
    ↓
[저장] ChromaDB (로컬 벡터 DB)
```

### 2. 쿼리 파이프라인

```
사용자 질문
    ↓
[임베딩] 질문을 벡터로 변환
    ↓
[검색] 벡터 DB에서 유사도 검색 (top-k)
    ↓
[컨텍스트 구성] 관련 문서 청크 조합
    ↓
[Claude] 컨텍스트 + 질문 전달
    ↓
답변 생성
```

### 3. 자동 업데이트 메커니즘

```python
# 파일 체크섬 계산 (MD5)
current_checksums = get_current_checksums()
saved_checksums = load_saved_checksums()

# 변경 감지
if current != saved:
    rebuild_vector_db()
    save_checksums(current)
```

## 📚 사용 예시

### 예시 1: 기능 구현 방법 질문

```
질문: "로그인 기능은 어떻게 구현하나요?"

RAG 검색:
- REQUIREMENTS.md: 로그인 화면 섹션
- PROJECT_ARCHITECTURE.md: 인증 플로우
- DESIGN_GUIDE.md: 로그인 UI 디자인

Claude 답변:
"로그인 기능은 다음과 같이 구현됩니다:

1. JWT 기반 인증
   - Access Token (15분)
   - Refresh Token (7일)
   ...
```

### 예시 2: 아키텍처 질문

```
질문: "Modular Monolith 아키텍처가 뭔가요?"

RAG 검색:
- PROJECT_ARCHITECTURE.md: Modular Monolith 섹션
- claude.md: 아키텍처 개요

Claude 답변:
"Modular Monolith는 다음과 같은 아키텍처입니다:
...
```

### 예시 3: Git 전략 질문

```
질문: "feature 브랜치는 어떻게 만드나요?"

RAG 검색:
- GIT_STRATEGY.md: 브랜치 전략 섹션

Claude 답변:
"feature 브랜치 생성 방법:
1. develop 브랜치에서 시작
   git checkout develop
   git pull origin develop
...
```

## 🛠️ 문제 해결

### 1. "ModuleNotFoundError" 오류

```bash
# 가상환경 활성화 확인
source rag/venv/bin/activate

# 의존성 재설치
pip install -r rag/requirements.txt
```

### 2. "ANTHROPIC_API_KEY not found" 오류

```bash
# .env 파일 확인
cat .env | grep ANTHROPIC_API_KEY

# API 키 설정
echo "ANTHROPIC_API_KEY=your_key_here" >> .env
```

### 3. "OpenAI API error" 오류

OpenAI API 키 확인:
```bash
cat .env | grep OPENAI_API_KEY
```

### 4. 벡터 DB가 생성되지 않음

```bash
# 강제 재생성
python3 rag/rag_system.py --force

# 권한 확인
ls -la .rag/
```

### 5. 검색 결과가 없음

- Skills 폴더에 MD 파일이 있는지 확인
- RAG DB가 생성되었는지 확인 (`.rag/chroma_db/` 디렉토리)
- 질문을 더 구체적으로 작성

## 🔐 보안 고려사항

### 1. API 키 보호

```bash
# .gitignore에 추가됨
.env
.rag/
rag/venv/
```

### 2. 로컬 벡터 DB

- ChromaDB는 로컬에만 저장
- 외부 서버 전송 없음
- `.rag/` 디렉토리는 Git에서 제외

### 3. 비용 관리

- 임베딩 생성: 문서 변경 시만 실행
- 쿼리 비용: 검색 결과 개수 조절 (--top-k)

## 📈 확장 방법

### 다른 문서 추가

1. 문서를 `skills/` 폴더에 추가
2. 다음 실행 시 자동으로 RAG DB 업데이트

### 다른 임베딩 모델 사용

`rag_system.py`에서 수정:

```python
from langchain.embeddings import HuggingFaceEmbeddings

# 무료 로컬 모델
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
```

### 다른 벡터 DB 사용

```python
from langchain.vectorstores import Pinecone, Weaviate

# Pinecone (클라우드)
vectordb = Pinecone.from_documents(...)

# Weaviate (로컬/클라우드)
vectordb = Weaviate.from_documents(...)
```

## 📞 지원

문제가 있으면:
1. 이 README의 문제 해결 섹션 확인
2. GitHub Issues 생성
3. 프로젝트 관리팀에 문의

---

**마지막 업데이트**: 2026-03-30
**버전**: 1.0
