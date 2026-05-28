# CLAUDE.md — PocketDesk

## 프로젝트 개요

- 서비스명: PocketDesk (개인 맞춤형 업무 대시보드)
- 스택: Nuxt 3 + Vue 3 (Composition API) + Nitro + PostgreSQL + Sequelize + Pinia
- 싱글 유저, 인증 없음
- 배포: Vercel

---

## 마크업 컨벤션

### 클래스 네이밍

- kebab-case 사용 (`.bookmark-card`, `.kanban-col`, `.memo-list`)
- BEM 미사용, Atomic CSS 기반 유틸리티 클래스 조합
- 컴포넌트 루트 클래스는 컴포넌트명과 일치 (예: `BookmarkCard.vue` → `.bookmark-card`)

### 컴포넌트 구조

- 파일명: PascalCase (`BookmarkCard.vue`, `KanbanBoard.vue`)
- 템플릿 내 `v-for`는 항상 `:key` 명시, 단 샘플용 단일 행에는 미사용

### HTML 출력 규칙

- 시멘틱 태그 우선 (`<section>`, `<article>`, `<nav>`, `<aside>`)
- 인터랙티브 요소에 `aria-label` 부여
- 이미지에 `alt` 필수

---

## Vue / Nuxt 컨벤션

### Composition API

- `<script setup>` 방식 사용
- props 정의: `defineProps<{}>()` TypeScript 형식
- emit 정의: `defineEmits<{}>()` TypeScript 형식

### 상태관리

- 전역 상태: Pinia (`stores/` 디렉토리)
- 로컬 상태: `ref`, `reactive`
- 스토어 파일명: `use{Name}Store.ts` (예: `useTaskStore.ts`)

### 데이터 패칭

- 서버사이드: `useFetch('/api/...')` 또는 `useAsyncData()`
- 클라이언트 전용: `$fetch`
- 에러 처리 항상 포함

### 라우터

- 파일 기반 라우팅 (Nuxt 자동)
- 동적 라우트: `[id].vue` 형식

---

## API 엔드포인트 규칙 (`server/api/`)

| 리소스      | 경로                            |
| ----------- | ------------------------------- |
| 북마크      | `/api/bookmarks`                |
| 메모        | `/api/memos`, `/api/memos/[id]` |
| 일정        | `/api/events`                   |
| 칸반 태스크 | `/api/tasks`, `/api/tasks/[id]` |
| 날씨        | `/api/weather`                  |
| 버스        | `/api/bus`                      |

- HTTP 메서드: GET / POST / PUT / DELETE
- 응답 형식: `{ data, error, message }`
- Nitro 핸들러: `defineEventHandler` 사용

---

## DB / Sequelize 규칙

### 모델 위치

`server/models/` 디렉토리

### 테이블 목록

- `bookmarks` — id, title, url, category, order, created_at
- `memos` — id, title, content, created_at, updated_at
- `events` — id, title, date, color, memo, created_at
- `tasks` — id, title, status(enum), priority, order, created_at, updated_at
    - status enum: `todo` | `in_progress` | `done` | `hold`

### Sequelize 옵션

- `timestamps: true` 기본 적용
- `underscored: true` (snake_case 컬럼)
- 연결 설정: `server/db.ts`

---

## CSS / SCSS 규칙

### 파일 구조 (`assets/css/`)

```
assets/css/
├── base/
│   ├── reset.css
│   ├── variables.css   # 색상, 폰트, 브레이크포인트
│   └── typography.css
├── utils/
│   └── atomic.css      # 유틸리티 클래스
├── components/           # 컴포넌트별 스타일
└── main.scss
```

### 셀렉터 작성

- 한 줄 작성 (single-line per selector)
- 중첩: SCSS `&` 활용, 최대 3단계

### 디자인 토큰 (variables)

```scss
// Color
$color-primary: #5b6cf6; // 메인 포인트 (라벤더)
$color-secondary: #ffd166; // 서브 포인트 (노랑)
$color-bg: #f7f6f2; // 배경 (크림)
$color-surface: #ffffff;
$color-border: #e5e3dc;
$color-text: #2d2d2d;
$color-text-muted: #8a8880;

// Status (칸반)
$color-todo: #adb5bd;
$color-in-progress: #4dabf7;
$color-done: #51cf66;
$color-hold: #ffa94d;

// Spacing
$gap-sm: 8px;
$gap-md: 16px;
$gap-lg: 24px;

// Radius
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 20px;
```

### 디자인 스타일 방향

- 2D 플랫 일러스트 감성 (귀엽고 가벼운 느낌)
- 크림/라벤더/노랑 조합
- 카드 기반 레이아웃, 그림자 최소화 (`box-shadow: 0 2px 8px rgba(0,0,0,0.06)`)
- 아이콘: Lucide Icons 또는 SVG 인라인

---

## 디자인 레퍼런스

- 각 페이지별 HTML 프로토타입이 `/prototypes/` 폴더에 있음
- 색상, 레이아웃, 컴포넌트 구조를 그대로 Vue로 변환할 것
- 클래스명은 프로토타입 기준으로 kebab-case 유지

---

## 칸반 DnD 규칙

- 라이브러리: `@vueuse/core` 또는 `vuedraggable`
- 드롭 완료 시 `PUT /api/tasks/[id]` 즉시 호출
- 낙관적 업데이트 (UI 먼저 반영 → API 호출 → 실패 시 롤백)

---

## 메모 마크다운 규칙

- 라이브러리: `marked` + `highlight.js` (코드 하이라이팅)
- 레이아웃: 좌측 목록 / 우측 에디터+프리뷰 (split view)
- 자동 저장: 1초 디바운스

---

## 환경변수 (`.env`)

```
DATABASE_URL=postgresql://user:password@localhost:5433/pocketdesk
WEATHER_API_KEY=
BUS_API_KEY=
BUS_STATION_ID=
```

---

## 금지 사항

- `any` 타입 남용 금지
- `v-html` 마크다운 렌더링 시 XSS 주의 (DOMPurify 사용)
- 직접 DOM 조작 금지 (`document.querySelector` 등)
- 콘솔 로그 커밋 금지
