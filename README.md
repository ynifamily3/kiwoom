# Kiwoom Service

Monorepo 기반 Kiwoom 서비스

## 구조

- `packages/client` - React + TypeScript + TailwindCSS 프론트엔드
- `packages/server` - Express + TypeScript 백엔드
- `packages/shared` - 공유 타입 및 유틸리티

## 개발 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (클라이언트: 3000, 서버: 3001)
pnpm dev

# 빌드
pnpm build
```

## 개별 패키지 실행

```bash
# 서버만 실행
cd packages/server && pnpm dev

# 클라이언트만 실행
cd packages/client && pnpm dev
```
