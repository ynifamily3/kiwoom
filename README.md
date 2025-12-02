# Kiwoom Service

Open API를 활용한 키움증권 서비스. tRPC와 웹소켓을 기반으로 실시간 데이터 연동 및 계좌 정보 조회를 제공하는 풀스택 웹 애플리케이션입니다.

## ✨ About The Project

이 프로젝트는 키움증권 Open API를 웹 환경에서 쉽게 사용하고 상호작용할 수 있도록 구축되었습니다. 주요 기능은 다음과 같습니다:

-   실시간 시세 및 체결 데이터 수신 (WebSocket)
-   계좌 잔고 및 거래 내역 조회
-   tRPC를 이용한 타입-세이프(Type-safe) API
-   shadcn/ui 및 TailwindCSS를 사용한 모던한 UI

## 🛠️ Tech Stack

### Core
-   [pnpm](https://pnpm.io/) (Workspace)
-   [TypeScript](https://www.typescriptlang.org/)

### Backend (`packages/server`)
-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [tRPC](https://trpc.io/)
-   [WebSocket](https://developer.mozilla.org/ko/docs/Web/API/WebSockets_API) (`ws`)
-   [Zod](https://zod.dev/)

### Frontend (`packages/client`)
-   [React](https://react.dev/)
-   [Vite](https://vitejs.dev/)
-   [tRPC Client](https://trpc.io/docs/client/react)
-   [TanStack Router](https://tanstack.com/router/latest)
-   [TanStack Query](https://tanstack.com/query/latest)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [shadcn/ui](https://ui.shadcn.com/)

## 📂 Project Structure

```
.
├── packages
│   ├── client/  # React 프론트엔드
│   ├── server/  # Node.js 백엔드
│   └── shared/  # 공유 타입 및 유틸리티
├── .gitignore
├── package.json
└── tsconfig.json
```

-   **`packages/client`**: 사용자 인터페이스(UI)를 담당하는 React 애플리케이션입니다.
-   **`packages/server`**: 비즈니스 로직, API 엔드포인트, 키움증권 API 연동을 처리하는 Node.js 서버입니다.
-   **`packages/shared`**: 클라이언트와 서버 간에 공유되는 TypeScript 타입 정의 및 유틸리티 함수를 포함합니다.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/ko) (v18 or higher)
-   [pnpm](https://pnpm.io/ko/installation)

### Installation

1.  저장소를 클론합니다.
    ```sh
    git clone https://github.com/your-username/kiwoom-service.git
    cd kiwoom-service
    ```
2.  의존성을 설치합니다.
    ```sh
    pnpm install
    ```
3.  서버 환경변수 파일을 설정합니다. `packages/server/.env.example` 파일을 복사하여 `packages/server/.env` 파일을 생성하고, 필요한 값을 채워주세요.
    ```sh
    cp packages/server/.env.example packages/server/.env
    ```

## ▶️ Usage

### Development

전체 프로젝트 (클라이언트 + 서버)를 개발 모드로 실행합니다.
```bash
pnpm dev
```

### Individual Packages

개별 패키지를 독립적으로 실행할 수도 있습니다.

```bash
# 서버만 실행
pnpm --filter @kiwoom/server dev

# 클라이언트만 실행
pnpm --filter @kiwoom/client dev
```

### Build

프로덕션용으로 전체 프로젝트를 빌드합니다.
```bash
pnpm build
```