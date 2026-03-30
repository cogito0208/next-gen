# RAG 시스템 사용 가이드

## 🎯 RAG란?

**RAG (Retrieval-Augmented Generation)**는 대규모 문서를 효율적으로 활용하기 위한 AI 기술입니다.

### 기본 개념

```
전통적인 방식:
질문 → Claude에게 전체 문서(35,000 토큰) 전달 → 답변

RAG 방식:
질문 → 관련 부분만 검색(800 토큰) → Claude에게 전달 → 답변
```

### 왜 필요한가?

1. **토큰 절약**: 98% 절감 (35,000 → 800 토큰)
2. **비용 절감**: 질문당 $0.11 → $0.01
3. **빠른 응답**: 관련 정보만 처리
4. **확장성**: 문서가 늘어나도 OK

## 🚀 시작하기

### 1단계: 환경 설정

```bash
# 1. API 키 설정
cp .env.example .env
# .env 파일에서 다음 키 입력:
# - ANTHROPIC_API_KEY
# - OPENAI_API_KEY

# 2. 실행 권한 부여
chmod +x start_claude.sh

# 3. 스크립트 실행
./start_claude.sh
```

### 2단계: 첫 실행

스크립트가 자동으로:
- ✅ Python 가상환경 생성
- ✅ 필요한 패키지 설치
- ✅ Skills 문서를 벡터 DB로 변환
- ✅ 대화형 모드 시작

### 3단계: 질문하기

```
💬 질문: 로그인 기능은 어떻게 구현하나요?

🔍 RAG 검색 중...
📚 관련 문서 5개 발견
🤖 Claude에게 질문 중...

📝 답변:
[상세한 답변]
```

## 📖 사용 모드

### 1. 대화형 모드 (추천)

여러 질문을 연속으로:

```bash
./start_claude.sh
# 메뉴에서 1 선택

질문 1: 프로젝트 구조는?
→ 답변

질문 2: Git 브랜치 전략은?
→ 답변

질문 3: 로그인 API는?
→ 답변
```

### 2. 단일 질문 모드

한 가지만 물어보기:

```bash
./start_claude.sh
# 메뉴에서 2 선택

질문: JWT 인증 구현 방법
→ 답변 후 종료
```

### 3. RAG 검색 모드

Claude 없이 관련 문서만 검색:

```bash
./start_claude.sh
# 메뉴에서 3 선택

검색어: 데이터베이스 설계
→ 관련 문서 청크 표시
```

### 4. RAG DB 재생성

문서를 강제로 다시 벡터화:

```bash
./start_claude.sh
# 메뉴에서 4 선택
```

## 💡 효과적인 질문 방법

### ✅ 좋은 질문

```
구체적:
"JWT 인증은 어떻게 구현하나요?"
"feature 브랜치를 만드는 방법은?"
"PostgreSQL 스키마 설계 전략은?"

맥락 포함:
"NestJS에서 모듈 간 통신은 어떻게 하나요?"
"Next.js에서 다국어 지원은 어떻게 설정하나요?"
```

### ❌ 피해야 할 질문

```
너무 모호:
"프로젝트 설명해줘"
"뭐가 있어?"

범위가 너무 넓음:
"모든 기능 설명해줘"
"전체 아키텍처 보여줘"
```

## 🔄 자동 업데이트 기능

### 작동 방식

```bash
# Skills 폴더의 MD 파일 수정
vim skills/REQUIREMENTS.md

# 스크립트 실행 시 자동 감지
./start_claude.sh

# 출력:
📝 파일 변경 감지: REQUIREMENTS.md
🔄 벡터 DB 업데이트 중...
✅ 업데이트 완료
```

### 변경 감지 메커니즘

1. 각 파일의 MD5 체크섬 계산
2. `.rag/checksums.json`과 비교
3. 변경 감지 시 자동 재생성

## 📊 성능 비교

### 실제 사용 예시

**질문: "로그인 기능 구현 방법"**

| 항목 | 일반 방식 | RAG 방식 |
|------|-----------|----------|
| 입력 토큰 | 35,000 | 800 |
| 비용 | $0.105 | $0.002 |
| 응답 시간 | 15초 | 3초 |
| 정확도 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 100개 질문 시 비용

```
일반 방식: 100 × $0.105 = $10.50
RAG 방식: 100 × $0.010 = $1.00 (+ 초기 $0.50)
→ 총 절감: $9.00 (85%)
```

## 🎨 실제 사용 시나리오

### 시나리오 1: 신입 개발자 온보딩

```bash
./start_claude.sh

질문 1: 프로젝트 기술 스택은?
답변: NestJS, Next.js, PostgreSQL...

질문 2: 개발 환경 설정 방법은?
답변: Docker Compose로...

질문 3: Git 브랜치 전략은?
답변: Git Flow를 사용...
```

### 시나리오 2: 기능 개발

```bash
질문: 전자결재 모듈은 어떤 구조인가요?

RAG 검색:
- REQUIREMENTS.md: 전자결재 기능 명세
- PROJECT_ARCHITECTURE.md: 모듈 구조
- DESIGN_GUIDE.md: UI 디자인

답변: 전자결재 모듈은 다음과 같이 구성됩니다:
1. 결재 라인 정의
2. 문서 생성 및 상신
...
```

### 시나리오 3: 버그 수정

```bash
질문: 로그인 시 토큰 갱신은 어떻게 처리하나요?

RAG 검색:
- PROJECT_ARCHITECTURE.md: 인증 플로우
- REQUIREMENTS.md: 토큰 관리

답변: Refresh Token을 사용한 갱신:
1. Access Token 만료 감지
2. Refresh Token으로 재발급
...
```

## 🛠️ 고급 사용법

### 검색 결과 개수 조정

```bash
# Python 직접 실행
source rag/venv/bin/activate

# 더 많은 결과 (기본 5개)
python3 rag/query_rag.py \
  --question "프로젝트 구조" \
  --top-k 10
```

### 특정 문서만 검색

`rag_system.py` 수정:

```python
# 특정 파일만 로드
loader = DirectoryLoader(
    "./skills",
    glob="REQUIREMENTS.md",  # 하나만
    # 또는
    glob="*ARCHITECTURE*.md"  # 패턴
)
```

### 커스텀 청크 크기

```python
# 더 작은 청크 (더 정확)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,    # 기본 1000
    chunk_overlap=100  # 기본 200
)

# 더 큰 청크 (더 많은 맥락)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=400
)
```

## 📁 파일 구조 이해

```
next_gen_01/
├── skills/                  # 원본 문서
│   ├── REQUIREMENTS.md
│   ├── DESIGN_GUIDE.md
│   └── ...
│
├── rag/                     # RAG 시스템
│   ├── rag_system.py       # 벡터 DB 생성
│   ├── query_rag.py        # Claude 통합
│   ├── requirements.txt    # 의존성
│   └── venv/               # 가상환경
│
├── .rag/                    # 생성된 데이터
│   ├── chroma_db/          # 벡터 DB
│   └── checksums.json      # 변경 추적
│
└── start_claude.sh          # 시작 스크립트
```

## 🔧 문제 해결

### Q1: "API key not found" 오류

```bash
# .env 파일 확인
cat .env | grep API_KEY

# 없으면 추가
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
echo "OPENAI_API_KEY=sk-..." >> .env
```

### Q2: 검색 결과가 이상함

```bash
# RAG DB 재생성
./start_claude.sh
# 메뉴에서 4 선택 (강제 재생성)
```

### Q3: 느린 응답

```bash
# 검색 결과 개수 줄이기 (기본 5개)
python3 rag/query_rag.py --question "..." --top-k 3
```

### Q4: 패키지 설치 오류

```bash
# 가상환경 삭제 후 재생성
rm -rf rag/venv
rm rag/.dependencies_installed
./start_claude.sh
```

## 💰 비용 최적화 팁

### 1. 적절한 top-k 설정

```
top-k=3: 빠르고 저렴 (추천)
top-k=5: 균형잡힌 (기본)
top-k=10: 더 정확하지만 비쌈
```

### 2. 로컬 임베딩 모델 사용

OpenAI 대신 무료 로컬 모델:

```python
# HuggingFace 모델 (무료)
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
```

### 3. 캐싱 활용

자주 묻는 질문은 답변 캐싱

## 📈 다음 단계

### 단계 1: 기본 사용 숙달

- [ ] 대화형 모드로 5개 이상 질문
- [ ] 다양한 주제 질문 (프로젝트, Git, 디자인)
- [ ] 검색 결과 확인

### 단계 2: 고급 기능 탐색

- [ ] top-k 값 조정 실험
- [ ] 직접 Python 스크립트 수정
- [ ] 커스텀 청크 크기 테스트

### 단계 3: 프로젝트 통합

- [ ] 개발 워크플로우에 통합
- [ ] 팀원들에게 공유
- [ ] 추가 문서 작성 및 RAG 업데이트

## 🎓 학습 자료

### RAG 개념
- [LangChain 문서](https://python.langchain.com/)
- [Vector Database 소개](https://www.pinecone.io/learn/vector-database/)

### 임베딩
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Sentence Transformers](https://www.sbert.net/)

### ChromaDB
- [ChromaDB 문서](https://docs.trychroma.com/)

## 📞 지원

문제가 있으면:
1. 이 가이드의 문제 해결 섹션 확인
2. `rag/README.md` 참고
3. 프로젝트 관리팀에 문의

---

**즐거운 개발 되세요!** 🚀

**마지막 업데이트**: 2026-03-30
**버전**: 1.0
