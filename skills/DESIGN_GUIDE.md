# 디자인 개발 가이드 - Google Stitch 활용

## 개요

본 프로젝트는 **Google Stitch**를 활용하여 AI 기반의 효율적인 UI/UX 디자인 워크플로우를 구축합니다.
Stitch는 자연어 프롬프트로 UI를 생성하고, Figma와 연동하여 전문적인 디자인 작업을 이어갈 수 있는 도구입니다.

## Google Stitch란?

Google Stitch는 Google Labs에서 개발한 AI 기반 UI 디자인 도구로, 다음과 같은 특징을 가집니다:

- **AI 네이티브 캔버스**: 자연어 프롬프트로 UI 디자인 생성
- **코드 생성**: 디자인과 함께 프론트엔드 코드 자동 생성
- **Figma 연동**: 공식 플러그인을 통한 완벽한 연동
- **디자인 시스템 관리**: DESIGN.md 포맷으로 디자인 시스템 관리
- **무료 사용**: 월 350개 디자인 생성 무료 제공

### 최신 업데이트 (2026년 3월)

- **4가지 AI 모드**: 다양한 디자인 시나리오에 대응
- **보이스 캔버스**: 음성으로 디자인 지시 가능
- **직접 편집**: 생성된 디자인을 캔버스에서 바로 수정
- **DESIGN.md**: 사람과 AI 모두 읽을 수 있는 디자인 시스템 문서 포맷

## 디자인 워크플로우

### 1. 기획 단계

```
요구사항 정의 → 와이어프레임 스케치 → 사용자 플로우 정의
```

#### 도구
- **기획**: Figma FigJam 또는 종이 스케치
- **와이어프레임**: 손그림 또는 간단한 디지털 스케치

### 2. Stitch를 활용한 초안 디자인

#### 2.1 프롬프트 작성 가이드

효과적인 프롬프트 작성 예시:

```
# 좋은 프롬프트 예시

"기업용 그룹웨어의 대시보드 화면을 디자인해주세요.
- 상단에 검색바와 알림 아이콘
- 왼쪽에 네비게이션 메뉴 (메일, 메신저, 일정, 결재, 게시판)
- 메인 영역에 오늘의 일정 카드, 미결재 문서 카드, 최근 공지사항
- 모던하고 깔끔한 스타일, 파란색 계열 사용
- 데스크톱 화면 (1920x1080)"
```

#### 2.2 스타일 참조 이미지 활용

- **참고 디자인**: Notion, Slack, Microsoft Teams 등의 스크린샷
- **Stitch 업로드**: 참조 이미지를 업로드하여 스타일 매칭

#### 2.3 화면별 디자인 생성

```
주요 화면 목록:
1. 로그인/회원가입
2. 대시보드
3. 메일함 (목록, 상세)
4. 메신저 (채팅방 목록, 대화)
5. 일정 관리 (월/주/일 뷰)
6. 전자결재 (상신, 결재함)
7. 게시판 (목록, 작성, 상세)
8. 조직도
9. 마이페이지/설정
```

### 3. Figma로 마이그레이션

#### 3.1 Figma 플러그인 설치

1. Figma 커뮤니티에서 "Stitch to Figma" 플러그인 검색
2. 플러그인 설치
3. Stitch에서 생성한 디자인을 플러그인으로 import

#### 3.2 Figma에서의 디테일 작업

```
Stitch (초안 생성) → Figma (디테일 작업) → 개발팀 전달
```

**Figma에서 작업할 내용:**
- 컴포넌트 시스템 구축
- 반응형 레이아웃 세밀 조정
- 인터랙션/프로토타입 추가
- 디자인 토큰 정의
- Auto Layout 설정
- 컬러/타이포그래피 시스템 정리

### 4. 디자인 시스템 구축

#### 4.1 DESIGN.md 활용

Stitch의 DESIGN.md를 기반으로 디자인 시스템 문서 생성:

```markdown
# 그룹웨어 디자인 시스템 v1.0

## 컬러 시스템

### Primary Colors
- Primary-500: #2563EB (Main Brand)
- Primary-400: #3B82F6
- Primary-600: #1D4ED8

### Neutral Colors
- Gray-50: #F9FAFB (Background)
- Gray-100: #F3F4F6
- Gray-900: #111827 (Text)

### Semantic Colors
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #3B82F6

## 타이포그래피

### 폰트 패밀리
- Primary: 'Pretendard', -apple-system, sans-serif
- Monospace: 'JetBrains Mono', monospace

### 타입 스케일
- Display: 48px / Bold / -0.02em
- H1: 36px / Bold / -0.01em
- H2: 30px / SemiBold / -0.01em
- H3: 24px / SemiBold / 0
- Body-L: 16px / Regular / 0
- Body-M: 14px / Regular / 0
- Caption: 12px / Regular / 0.01em

## 간격 시스템

8px 기반 스페이싱:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## 컴포넌트

### 버튼
- Primary: 배경 Primary-500, 텍스트 White
- Secondary: 배경 White, 보더 Gray-300
- Size: Small (32px), Medium (40px), Large (48px)
- Radius: 6px

### 입력 필드
- Height: 40px (default)
- Border: 1px solid Gray-300
- Focus: Primary-500
- Radius: 6px

### 카드
- Background: White
- Border: 1px solid Gray-200
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Radius: 8px
```

#### 4.2 Figma에서 디자인 토큰 관리

**플러그인 추천:**
- **Figma Tokens**: 디자인 토큰을 JSON으로 관리
- **Style Dictionary**: 토큰을 CSS/SCSS 변수로 변환

### 5. 개발 핸드오프

#### 5.1 Figma → 개발자 전달

**방법 1: Figma Dev Mode**
- 개발자에게 Figma 파일 공유

**방법 2: Stitch 생성 코드 활용**
- Stitch에서 생성한 코드를 베이스로 사용
- Tailwind CSS 클래스 기반 코드 제공

**방법 3: Zeplin/Figma Inspect**
- 스펙 확인 도구 활용

#### 5.2 코드 구현

**Next.js (Web)**
```typescript
// Tailwind + shadcn/ui 기반
// 예: Button 컴포넌트

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-md font-medium transition-colors",
          {
            'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
            'bg-white border border-gray-300 hover:bg-gray-50': variant === 'secondary',
            'hover:bg-gray-100': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

export default Button
```


## Figma 연동 필요성

### ✅ Figma 연동이 필요한 이유

1. **전문적인 디테일 작업**
   - Stitch는 초안 생성에 탁월하지만, 디테일한 조정은 Figma가 유리
   - 컴포넌트 시스템, Auto Layout 등 Figma의 강력한 기능 활용

2. **팀 협업**
   - 디자이너, 개발자, PM 간 협업에 Figma가 업계 표준
   - 코멘트, 버전 관리, 공유 기능

3. **개발 핸드오프**
   - Figma Dev Mode를 통한 정확한 스펙 전달

4. **디자인 시스템 관리**
   - 재사용 가능한 컴포넌트 라이브러리
   - 일관성 있는 디자인 유지

### 권장 워크플로우

```
1. Stitch로 빠른 초안 생성 (AI 프롬프트)
   ↓
2. Figma로 마이그레이션 (공식 플러그인)
   ↓
3. Figma에서 디테일 작업 & 컴포넌트화
   ↓
4. 개발팀에 핸드오프
   ↓
5. 피드백 후 Figma에서 수정
   ↓
6. 필요시 Stitch로 새로운 화면 추가 생성
```

## 디자인 도구 추천 조합

### 핵심 도구

1. **Google Stitch**
   - 용도: AI 기반 초안 생성, 빠른 프로토타이핑
   - 비용: 무료 (월 350 디자인)
   - 링크: https://stitch.withgoogle.com/

2. **Figma**
   - 용도: 전문 디자인 작업, 컴포넌트 시스템, 핸드오프
   - 비용: 무료 플랜 가능 (3개 프로젝트)
   - 플러그인: Stitch to Figma, Figma Tokens

3. **FigJam** (Figma 내장)
   - 용도: 와이어프레임, 브레인스토밍
   - 비용: Figma 플랜에 포함

### 보조 도구

4. **Notion / Confluence**
   - 용도: 디자인 시스템 문서화, DESIGN.md 관리

5. **Storybook**
   - 용도: 컴포넌트 개발 & 문서화
   - Web 프론트엔드에서 활용


## 최적의 디자인 개발 프로세스

### Phase 1: 리서치 & 기획 (1-2주)

```
- 경쟁사 분석 (Notion, Slack, Teams 등)
- 사용자 페르소나 정의
- 주요 화면 목록 작성
- 와이어프레임 스케치
```

### Phase 2: 초안 디자인 (1주)

```
- Google Stitch로 주요 화면 10-15개 생성
- 프롬프트 작성 시 일관된 스타일 가이드 적용
- 다양한 버전 생성 후 최적안 선택
```

**Stitch 활용 팁:**
- 한 번에 완벽한 디자인을 기대하지 말고 반복 생성
- 참조 이미지를 적극 활용하여 스타일 통일
- 생성된 코드도 함께 저장 (개발 참고용)

### Phase 3: Figma 정제 (2주)

```
- Stitch to Figma 플러그인으로 마이그레이션
- 컴포넌트 시스템 구축
  - Atomic Design 패턴: Atoms → Molecules → Organisms
- 반응형 레이아웃 적용 (Desktop, Tablet)
- 다크 모드 고려 (선택)
- 프로토타입 인터랙션 추가
```

### Phase 4: 디자인 시스템 문서화 (1주)

```
- DESIGN.md 작성
- Figma 컴포넌트 라이브러리 정리
- 디자인 토큰 추출 (Figma Tokens 플러그인)
- 개발팀과 리뷰
```

### Phase 5: 개발 핸드오프 (진행중)

```
- Figma Dev Mode 공유
