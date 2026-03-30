# 기업용 그룹웨어 프로젝트 아키텍처

## 프로젝트 개요

기업용 그룹웨어 시스템을 Modular Monolith 아키텍처로 개발하는 프로젝트입니다.
MVP/1.0 버전은 하나의 코드베이스로 시작하되, 향후 마이크로서비스로 전환 가능하도록 모듈 단위로 명확히 분리합니다.

## 기술 스택

### Backend
- **Framework**: NestJS
- **언어**: TypeScript
- **아키텍처 패턴**: Modular Monolith
- **ORM**: TypeORM / Prisma (선택)
- **인증**: JWT + Passport.js
- **API 문서**: Swagger/OpenAPI
- **다국어**: nestjs-i18n
- **외부 API**: Axios + Custom Adapter Pattern

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
- **검색 엔진** (선택적): Elasticsearch

### DevOps
- **컨테이너**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **모니터링**: Prometheus + Grafana (추후)
- **로깅**: Winston / Pino

## Modular Monolith 아키텍처 설계

### 핵심 원칙

1. **모듈 간 명확한 경계**: 각 모듈은 독립적인 비즈니스 도메인을 담당
2. **느슨한 결합**: 모듈 간 통신은 명확한 인터페이스를 통해서만 수행
3. **높은 응집도**: 관련된 기능은 같은 모듈 내에 위치
4. **마이크로서비스 전환 준비**: 필요시 각 모듈을 독립 서비스로 분리 가능

### 코드베이스 구조

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
│   │   │   │   ├── adapters/  # Gmail, Outlook 어댑터
│   │   │   │   └── interfaces/
│   │   │   ├── messenger/     # 메신저
│   │   │   ├── drive/         # 파일관리
│   │   │   │   └── adapters/  # S3, GCS 어댑터
│   │   │   ├── hr/            # 인사관리
│   │   │   └── integrations/  # 외부 API 연동
│   │   │       ├── slack/
│   │   │       ├── github/
│   │   │       └── webhooks/
│   │   ├── common/            # 공통 모듈
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── pipes/
│   │   │   ├── decorators/
│   │   │   ├── clients/       # 외부 API 클라이언트
│   │   │   └── exceptions/    # 커스텀 예외
│   │   ├── shared/            # 공유 유틸리티
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── utils/
│   │   ├── i18n/              # 다국어 번역 파일
│   │   │   ├── ko/
│   │   │   ├── en/
│   │   │   └── ja/
│   │   └── main.ts
│   ├── test/
│   ├── docker-compose.yml
│   └── package.json
│
├── web/                       # Next.js Web Application
│   ├── src/
│   │   ├── app/              # App Router
│   │   │   ├── [locale]/     # 다국어 라우팅
│   │   │   └── api/          # API Routes
│   │   ├── components/       # 재사용 컴포넌트
│   │   │   ├── ui/           # UI 기본 컴포넌트
│   │   │   ├── features/     # 기능별 컴포넌트
│   │   │   └── layouts/      # 레이아웃
│   │   ├── lib/              # 유틸리티
│   │   ├── hooks/            # Custom Hooks
│   │   ├── stores/           # 상태 관리
│   │   ├── services/         # API 통신
│   │   └── types/            # TypeScript 타입
│   ├── messages/             # 다국어 번역 파일
│   │   ├── ko.json
│   │   ├── en.json
│   │   └── ja.json
│   ├── middleware.ts         # 다국어 미들웨어
│   └── package.json
│
│
├── shared/                    # 공유 타입 정의 (선택)
│   └── types/
│
└── docs/                      # 프로젝트 문서
    ├── api/
    ├── architecture/
    └── design/
```

### 모듈 설계 원칙

각 비즈니스 모듈은 다음 구조를 따릅니다:

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

### 모듈 간 통신

1. **직접 의존성 주입** (같은 프로세스 내)
   - 모듈 간 서비스 호출은 명확한 인터페이스를 통해서만
   - 순환 참조 방지

2. **이벤트 기반 통신** (느슨한 결합)
   - NestJS EventEmitter 사용
   - 도메인 이벤트를 통한 비동기 통신

3. **공유 데이터베이스** (Modular Monolith)
   - 각 모듈은 자신의 테이블만 직접 접근
   - 다른 모듈 데이터는 서비스 인터페이스를 통해 접근

## 데이터베이스 설계 전략

### 스키마 분리 전략

```sql
-- 각 모듈별 스키마 분리 (향후 마이크로서비스 전환 대비)
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

### 트랜잭션 관리

- **모듈 내 트랜잭션**: 일반적인 ACID 트랜잭션
- **모듈 간 트랜잭션**: Saga 패턴 준비 (향후 분산 환경 대비)

## API 설계

### RESTful API 규칙

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
    "timestamp": "2026-03-26T12:00:00Z",
    "version": "1.0"
  }
}

// 에러 응답
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {...}
  },
  "meta": {
    "timestamp": "2026-03-26T12:00:00Z"
  }
}
```

## 인증 & 인가

### 인증 플로우

1. **로그인**: 아이디/비밀번호 또는 SSO
2. **토큰 발급**: Access Token (15분) + Refresh Token (7일)
3. **토큰 저장**:
   - Web: httpOnly Cookie (XSS 방지)
4. **토큰 갱신**: Refresh Token으로 Access Token 재발급

### 권한 관리 (RBAC)

```typescript
// 역할 기반 접근 제어
roles: ['ADMIN', 'MANAGER', 'USER', 'GUEST']

// 권한
permissions: [
  'user:read',
  'user:write',
  'approval:approve',
  'board:delete',
  // ...
]
```

## 다국어 지원 (Internationalization)

### 지원 언어

**초기 지원 언어:**
- 한국어 (ko-KR) - 기본 언어
- 영어 (en-US)
- 일본어 (ja-JP) - 선택적

**추후 확장:**
- 중국어 간체 (zh-CN)
- 베트남어 (vi-VN)
- 기타 요청에 따라 추가

### Backend (NestJS) - nestjs-i18n

#### 설치 및 설정

```bash
npm install nestjs-i18n
```

```typescript
// src/common/config/i18n.config.ts
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';

export const i18nConfig = I18nModule.forRoot({
  fallbackLanguage: 'ko',
  loaderOptions: {
    path: path.join(__dirname, '../../i18n/'),
    watch: true,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },        // ?lang=en
    AcceptLanguageResolver,                            // Accept-Language 헤더
    new HeaderResolver(['x-custom-lang']),            // 커스텀 헤더
  ],
});
```

#### 번역 파일 구조

```
backend/src/i18n/
├── ko/
│   ├── common.json
│   ├── auth.json
│   ├── user.json
│   ├── approval.json
│   └── validation.json
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── user.json
│   ├── approval.json
│   └── validation.json
└── ja/
    └── ...
```

#### 번역 파일 예시

```json
// ko/auth.json
{
  "login": {
    "success": "로그인에 성공했습니다.",
    "failed": "아이디 또는 비밀번호가 올바르지 않습니다.",
    "required": "로그인이 필요합니다."
  },
  "token": {
    "expired": "토큰이 만료되었습니다.",
    "invalid": "유효하지 않은 토큰입니다."
  }
}

// en/auth.json
{
  "login": {
    "success": "Login successful.",
    "failed": "Invalid username or password.",
    "required": "Login required."
  },
  "token": {
    "expired": "Token has expired.",
    "invalid": "Invalid token."
  }
}
```

#### 사용 예시

```typescript
// Controller에서 사용
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext
  ) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        success: true,
        message: i18n.t('auth.login.success'),
        data: result
      };
    } catch (error) {
      throw new UnauthorizedException(
        i18n.t('auth.login.failed')
      );
    }
  }
}

// Service에서 사용
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(private readonly i18n: I18nService) {}

  async createUser(data: CreateUserDto, lang: string) {
    // ...
    return {
      message: await this.i18n.translate('user.created', {
        lang,
        args: { name: data.name }
      })
    };
  }
}
```

#### Validation 메시지 다국어화

```typescript
// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @MinLength(8, { message: i18nValidationMessage('validation.MIN_LENGTH', { min: 8 }) })
  password: string;
}
```

### Frontend Web (Next.js) - next-intl

#### 설치 및 설정

```bash
npm install next-intl
```

```typescript
// next.config.js
const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  // 기타 설정
});
```

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ko', 'en', 'ja'],
  defaultLocale: 'ko',
  localePrefix: 'as-needed' // /ko/... 대신 /...
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

#### 번역 파일 구조

```
web/messages/
├── ko.json
├── en.json
└── ja.json
```

```json
// messages/ko.json
{
  "common": {
    "search": "검색",
    "save": "저장",
    "cancel": "취소",
    "delete": "삭제"
  },
  "dashboard": {
    "title": "대시보드",
    "todaySchedule": "오늘의 일정",
    "pendingApproval": "결재 대기 문서"
  },
  "mail": {
    "inbox": "받은편지함",
    "sent": "보낸편지함",
    "compose": "메일 쓰기"
  }
}
```

#### 사용 예시

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// components/Dashboard.tsx
'use client';
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
      <section>
        <h2>{t('todaySchedule')}</h2>
        {/* ... */}
      </section>
    </div>
  );
}
```

#### 언어 전환

```typescript
// components/LanguageSwitcher.tsx
'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  return (
    <select value={locale} onChange={(e) => switchLanguage(e.target.value)}>
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  );
}
```


#### 번역 파일 구조

```
mobile/assets/translations/
├── ko.json
├── en.json
└── ja.json
```

```json
// ko.json
{
  "common": {
    "search": "검색",
    "save": "저장",
    "cancel": "취소"
  },
  "dashboard": {
    "title": "대시보드"
  }
}
```

#### 사용 예시 (easy_localization)

```dart
// main.dart
import 'package:easy_localization/easy_localization.dart';

void main() async {
  await EasyLocalization.ensureInitialized();

  runApp(
    EasyLocalization(
      supportedLocales: [Locale('ko'), Locale('en'), Locale('ja')],
      path: 'assets/translations',
      fallbackLocale: Locale('ko'),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      home: DashboardScreen(),
    );
  }
}

// 사용
Text('common.search'.tr())
Text('dashboard.title'.tr())
```

#### 언어 전환

```dart
// 언어 변경
context.setLocale(Locale('en'));

// 현재 언어
context.locale
```

### 번역 파일 관리 전략

1. **키 네이밍 규칙**
   ```
   {모듈}.{기능}.{항목}
   예: auth.login.success
       user.profile.update
       common.button.save
   ```

2. **공통 번역 분리**
   - `common.json`: 버튼, 라벨 등 공통 요소
   - 각 모듈별 JSON 파일 분리

3. **번역 파일 동기화**
   - 모든 언어 파일의 키 구조 일치 필수
   - 번역 누락 감지 스크립트 작성

4. **전문 번역가 활용**
   - 초기: 기계번역 + 내부 검수
   - 이후: 전문 번역가 의뢰

5. **번역 관리 도구 (선택)**
   - Lokalise, Crowdin, POEditor 등
   - 번역가와 협업 용이

### 날짜/시간 로컬라이제이션

```typescript
// Backend (NestJS)
import { format } from 'date-fns';
import { ko, enUS, ja } from 'date-fns/locale';

const locales = { ko, en: enUS, ja };

format(new Date(), 'PPP', { locale: locales[userLang] });

// Frontend (Next.js)
import { useFormatter } from 'next-intl';

const format = useFormatter();
format.dateTime(new Date(), { dateStyle: 'long' });

import 'package:intl/intl.dart';

DateFormat.yMMMd('ko').format(DateTime.now());
```

### 숫자/통화 로컬라이제이션

```typescript
// Next.js
const format = useFormatter();
format.number(1234567.89, { style: 'currency', currency: 'KRW' });
// 결과: ₩1,234,568

import 'package:intl/intl.dart';

NumberFormat.currency(locale: 'ko', symbol: '₩').format(1234567.89);
```

## 외부 API 연동

### 연동 예상 외부 시스템

1. **인증/SSO**
   - Google Workspace
   - Microsoft Azure AD
   - 네이버 웍스
   - LDAP/Active Directory

2. **메일 시스템**
   - Gmail API
   - Microsoft Graph API (Outlook)
   - 사내 SMTP 서버

3. **클라우드 스토리지**
   - AWS S3
   - Google Cloud Storage
   - Azure Blob Storage

4. **결제/정산**
   - 토스페이먼츠
   - 네이버페이
   - KCP

5. **알림/메시징**
   - Firebase Cloud Messaging (FCM)
   - Apple Push Notification Service (APNS)
   - Slack Webhook
   - 카카오톡 알림톡

6. **기타 SaaS**
   - Jira / Confluence
   - GitHub / GitLab
   - Zoom / Google Meet

### 아키텍처 설계 원칙

#### 1. Adapter Pattern (포트 & 어댑터)

```
비즈니스 로직 → Interface (Port) → Adapter → 외부 API
```

```typescript
// 인터페이스 정의 (Port)
// src/modules/mail/interfaces/mail-provider.interface.ts
export interface IMailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  getEmails(userId: string, folder: string): Promise<Email[]>;
  deleteEmail(emailId: string): Promise<boolean>;
}

// Gmail Adapter
// src/modules/mail/adapters/gmail.adapter.ts
@Injectable()
export class GmailAdapter implements IMailProvider {
  private client: any;

  constructor(private configService: ConfigService) {
    this.client = new google.auth.OAuth2(
      configService.get('GMAIL_CLIENT_ID'),
      configService.get('GMAIL_CLIENT_SECRET'),
      configService.get('GMAIL_REDIRECT_URI')
    );
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Gmail API 호출 로직
    const gmail = google.gmail({ version: 'v1', auth: this.client });
    // ... implementation
    return true;
  }

  async getEmails(userId: string, folder: string): Promise<Email[]> {
    // ... implementation
    return [];
  }

  async deleteEmail(emailId: string): Promise<boolean> {
    // ... implementation
    return true;
  }
}

// Outlook Adapter
// src/modules/mail/adapters/outlook.adapter.ts
@Injectable()
export class OutlookAdapter implements IMailProvider {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = Client.init({
      authProvider: (done) => {
        // Microsoft Graph 인증 로직
      }
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Microsoft Graph API 호출 로직
    return true;
  }

  // ... 기타 메서드
}

// Factory Pattern으로 Adapter 선택
// src/modules/mail/mail-provider.factory.ts
@Injectable()
export class MailProviderFactory {
  constructor(
    private gmailAdapter: GmailAdapter,
    private outlookAdapter: OutlookAdapter,
  ) {}

  getProvider(type: 'gmail' | 'outlook'): IMailProvider {
    switch (type) {
      case 'gmail':
        return this.gmailAdapter;
      case 'outlook':
        return this.outlookAdapter;
      default:
        throw new Error(`Unsupported mail provider: ${type}`);
    }
  }
}

// Service에서 사용
// src/modules/mail/mail.service.ts
@Injectable()
export class MailService {
  constructor(
    private mailProviderFactory: MailProviderFactory,
    private userService: UserService,
  ) {}

  async sendEmail(userId: string, to: string, subject: string, body: string) {
    const user = await this.userService.findOne(userId);
    const provider = this.mailProviderFactory.getProvider(user.mailProvider);

    return await provider.sendEmail(to, subject, body);
  }
}
```

#### 2. API Client 구성

```typescript
// src/common/clients/base-api.client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

export abstract class BaseApiClient {
  protected client: AxiosInstance;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      ...config,
    });

    // 재시도 로직
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error)
          || error.response?.status === 429; // Rate limit
      },
    });

    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        // 로깅, 인증 토큰 추가 등
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // 에러 처리, 토큰 갱신 등
        if (error.response?.status === 401) {
          // 토큰 갱신 로직
        }
        return Promise.reject(error);
      }
    );
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // put, delete 등 추가
}
```

#### 3. API 키 및 인증 정보 관리

```typescript
// .env
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
OUTLOOK_CLIENT_ID=xxx
OUTLOOK_CLIENT_SECRET=xxx
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

// 환경 변수 검증
// src/common/config/env.validation.ts
import { plainToClass } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  GMAIL_CLIENT_ID: string;

  @IsString()
  GMAIL_CLIENT_SECRET: string;

  // ... 기타
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
```

#### 4. 에러 핸들링

```typescript
// src/common/exceptions/external-api.exception.ts
export class ExternalApiException extends HttpException {
  constructor(
    public provider: string,
    public originalError: any,
    message?: string
  ) {
    super(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: message || `External API error from ${provider}`,
        provider,
        error: originalError?.message,
      },
      HttpStatus.BAD_GATEWAY
    );
  }
}

// Adapter에서 사용
try {
  const result = await this.client.get('/api/data');
  return result;
} catch (error) {
  throw new ExternalApiException('Gmail', error, 'Failed to fetch emails');
}
```

#### 5. Rate Limiting 대응

```typescript
// src/common/utils/rate-limiter.ts
import Bottleneck from 'bottleneck';

export class RateLimiter {
  private limiter: Bottleneck;

  constructor(maxConcurrent: number, minTime: number) {
    this.limiter = new Bottleneck({
      maxConcurrent,  // 동시 요청 수
      minTime,        // 요청 간 최소 간격 (ms)
    });
  }

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return this.limiter.schedule(fn);
  }
}

// Adapter에서 사용
export class GmailAdapter implements IMailProvider {
  private rateLimiter: RateLimiter;

  constructor() {
    // Gmail API: 초당 250 요청 제한
    this.rateLimiter = new RateLimiter(10, 100); // 동시 10개, 100ms 간격
  }

  async getEmails(userId: string, folder: string): Promise<Email[]> {
    return this.rateLimiter.schedule(async () => {
      // API 호출
    });
  }
}
```

#### 6. 캐싱 전략

```typescript
// 외부 API 응답 캐싱
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GoogleCalendarAdapter {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getEvents(userId: string): Promise<Event[]> {
    const cacheKey = `calendar:events:${userId}`;

    // 캐시 확인
    const cached = await this.cacheManager.get<Event[]>(cacheKey);
    if (cached) return cached;

    // API 호출
    const events = await this.fetchFromAPI(userId);

    // 캐시 저장 (5분)
    await this.cacheManager.set(cacheKey, events, 300);

    return events;
  }
}
```

#### 7. Webhook 처리

```typescript
// src/modules/integrations/controllers/webhook.controller.ts
@Controller('webhooks')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  // Slack Webhook
  @Post('slack')
  async handleSlackWebhook(
    @Body() payload: any,
    @Headers('x-slack-signature') signature: string
  ) {
    // 서명 검증
    if (!this.webhookService.verifySlackSignature(payload, signature)) {
      throw new UnauthorizedException('Invalid signature');
    }

    await this.webhookService.processSlackEvent(payload);
    return { ok: true };
  }

  // GitHub Webhook
  @Post('github')
  async handleGitHubWebhook(
    @Body() payload: any,
    @Headers('x-hub-signature-256') signature: string
  ) {
    if (!this.webhookService.verifyGitHubSignature(payload, signature)) {
      throw new UnauthorizedException('Invalid signature');
    }

    await this.webhookService.processGitHubEvent(payload);
    return { ok: true };
  }
}
```

#### 8. 설정 관리

```typescript
// src/modules/integrations/entities/integration-config.entity.ts
@Entity('integration_configs')
export class IntegrationConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  provider: string; // 'gmail', 'slack', 'github' 등

  @Column('jsonb')
  credentials: {
    accessToken?: string;
    refreshToken?: string;
    apiKey?: string;
    // ...
  };

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
```

### 모니터링 및 로깅

```typescript
// 외부 API 호출 로깅
@Injectable()
export class ApiLogger {
  private logger = new Logger('ExternalAPI');

  logRequest(provider: string, method: string, url: string) {
    this.logger.log(`[${provider}] ${method} ${url}`);
  }

  logResponse(provider: string, statusCode: number, duration: number) {
    this.logger.log(`[${provider}] Response: ${statusCode} (${duration}ms)`);
  }

  logError(provider: string, error: any) {
    this.logger.error(`[${provider}] Error: ${error.message}`, error.stack);
  }
}
```

### 테스트 전략

```typescript
// 외부 API Mock
// src/modules/mail/adapters/__mocks__/gmail.adapter.ts
export class MockGmailAdapter implements IMailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    return true;
  }

  async getEmails(userId: string, folder: string): Promise<Email[]> {
    return [
      { id: '1', subject: 'Test Email', from: 'test@example.com' }
    ];
  }

  async deleteEmail(emailId: string): Promise<boolean> {
    return true;
  }
}

// 테스트
describe('MailService', () => {
  let service: MailService;
  let mockAdapter: MockGmailAdapter;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: GmailAdapter,
          useClass: MockGmailAdapter,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should send email', async () => {
    const result = await service.sendEmail('user1', 'to@example.com', 'Subject', 'Body');
    expect(result).toBe(true);
  });
});
```

### 외부 API 연동 체크리스트

- [ ] 인터페이스(Port) 정의
- [ ] Adapter 구현
- [ ] 재시도 로직 구현
- [ ] Rate Limiting 적용
- [ ] 에러 핸들링
- [ ] 캐싱 전략 수립
- [ ] API 키 안전한 관리
- [ ] 로깅 및 모니터링
- [ ] Webhook 서명 검증
- [ ] 테스트 코드 작성 (Mock 사용)
- [ ] 문서화 (API 명세, 제약사항 등)

## 캐싱 전략

### Redis 활용

1. **세션 관리**: Refresh Token 저장
2. **API 응답 캐싱**: 자주 조회되는 데이터
3. **실시간 데이터**: 메신저 온라인 상태, 알림
4. **Rate Limiting**: API 호출 제한

```typescript
// 캐시 키 네이밍 규칙
{module}:{resource}:{id}
예: user:profile:123
    board:post:456
```

## 성능 최적화

### Backend

- **Database Connection Pool**: 적절한 커넥션 풀 크기 설정
- **쿼리 최적화**: N+1 문제 해결, 인덱싱
- **페이지네이션**: Cursor-based pagination (무한 스크롤)
- **비동기 처리**: Bull Queue (이메일 발송, 대용량 파일 처리)

### Frontend

- **Code Splitting**: Next.js dynamic import
- **이미지 최적화**: Next.js Image 컴포넌트
- **SSR/ISR**: 적절한 렌더링 전략 선택
- **API 캐싱**: TanStack Query의 staleTime 활용

- **이미지 캐싱**: cached_network_image
- **로컬 데이터베이스**: SQLite / Hive
- **Background Sync**: WorkManager (Android), Background Tasks (iOS)

## 보안 고려사항

1. **SQL Injection 방지**: ORM 사용, Prepared Statement
2. **XSS 방지**: 입력 값 sanitization
3. **CSRF 방지**: CSRF 토큰, SameSite Cookie
4. **Rate Limiting**: API 호출 제한
5. **데이터 암호화**:
   - 전송: HTTPS/TLS
   - 저장: 민감정보 AES-256 암호화
6. **보안 헤더**: Helmet.js 사용

## 테스트 전략

### Backend

- **Unit Test**: Jest (서비스 로직)
- **E2E Test**: Jest + Test Database

### Frontend

- **Unit Test**: Vitest + Testing Library
- **Component Test**: Storybook
- **E2E Test**: Playwright


## 배포 전략 (MVP)

### 개발 단계

```yaml
# docker-compose.dev.yml
services:
  postgres:
    image: postgres:15
  redis:
    image: redis:7
  backend:
    build: ./backend
    volumes:
      - ./backend:/app  # Hot reload
  web:
    build: ./web
    volumes:
      - ./web:/app
```

### 프로덕션 전환 준비

- **컨테이너화**: 모든 서비스 Docker 이미지화
- **오케스트레이션**: Docker Swarm 또는 Kubernetes (스케일 필요시)
- **로드 밸런싱**: Nginx / Traefik
- **데이터베이스**: Managed PostgreSQL (AWS RDS, GCP Cloud SQL 등)

## 향후 확장 로드맵

### Phase 1: MVP (Modular Monolith)
- 핵심 그룹웨어 기능 구현
- 단일 배포 단위

### Phase 2: 성능 최적화
- 캐싱 전략 고도화
- 데이터베이스 최적화
- CDN 도입

### Phase 3: 마이크로서비스 전환 (필요시)
- 트래픽이 많은 모듈부터 분리
- 메시지 큐 도입 (RabbitMQ, Kafka)
- API Gateway 구성

### Phase 4: 고급 기능
- AI 기반 기능 (문서 요약, 일정 추천 등)
- 실시간 협업 기능 강화

## 개발 규칙

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
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 코드
chore: 빌드/설정 변경
```

### 코드 리뷰

- 모든 PR은 최소 1명의 리뷰 필수
- CI 통과 후 머지 가능

## 모니터링 & 로깅

### 로깅 레벨

- **ERROR**: 즉시 대응 필요
- **WARN**: 잠재적 문제
- **INFO**: 일반 정보
- **DEBUG**: 디버깅 정보 (개발 환경만)

### 모니터링 메트릭

- API 응답 시간
- 에러율
- 데이터베이스 쿼리 성능
- 메모리/CPU 사용률
- 동시 접속자 수

## 참고 자료

### 프레임워크

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- )
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/)
- [Modular Monolith Architecture](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer)

### 다국어 지원

- [nestjs-i18n](https://nestjs-i18n.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
- )
- [easy_localization](https://pub.dev/packages/easy_localization)

### 외부 API 연동

- [Gmail API](https://developers.google.com/gmail/api)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)
- [Google Cloud Client Libraries](https://cloud.google.com/nodejs/docs/reference)
- [Axios Documentation](https://axios-http.com/)
- [axios-retry](https://github.com/softonic/axios-retry)

### 디자인 패턴

- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method)
- [Port and Adapter Architecture](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)
