# Copilot Instructions for Kiwoom Service

## Architecture Overview

This is a **pnpm workspace monorepo** with three packages:

- `packages/client` - React + Vite + TailwindCSS frontend (port 3000)
- `packages/server` - Express + TypeScript backend (port 3001)
- `packages/shared` - Shared TypeScript types and utilities

**Key architectural pattern**: The client proxies `/api/*` requests to the server via Vite's proxy (see `packages/client/vite.config.ts`). This means in development, fetch from `/api/...` directly without hardcoding `localhost:3001`.

## Development Workflow

**Essential commands** (run from root):

- `pnpm dev` - Starts both client and server in parallel (primary development command)
- `pnpm build` - Builds all packages in dependency order
- `pnpm -r clean` - Removes all `dist/` folders across packages

**Individual package development** (when needed):

```bash
cd packages/server && pnpm dev  # Server only with tsx watch
cd packages/client && pnpm dev  # Client only with Vite
```

The server uses `tsx watch` for hot reload, client uses Vite HMR.

## TypeScript Configuration

**Composite project setup**: Root `tsconfig.json` has `composite: true` and `incremental: true`. Each package extends the root config but customizes:

- **Client**: Uses `"jsx": "react-jsx"`, `"noEmit": true` (Vite handles bundling), `"moduleResolution": "bundler"`, `"type": "module"` in package.json for ESM support
- **Server**: Uses `"module": "CommonJS"`, emits to `dist/`, includes Node types

When adding shared types, export from `packages/shared/src/index.ts` and reference as `@kiwoom/shared` (if workspace references are configured) or via relative paths.

## TailwindCSS v4 Setup

**Modern Vite plugin approach** (no PostCSS config needed):

- Install: `pnpm add -D tailwindcss@next @tailwindcss/vite@next`
- Add `@tailwindcss/vite` plugin to `vite.config.ts`: `import tailwindcss from '@tailwindcss/vite'`
- Use `@import "tailwindcss";` in CSS instead of `@tailwind` directives
- **No `tailwind.config.js` or `postcss.config.js` required** - configuration is handled automatically
- Client package.json must have `"type": "module"` for ESM compatibility

## Code Conventions

**Shared types pattern**: Define API contracts in `packages/shared/src/types.ts` with generic wrapper:

```typescript
export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}
```

**Backend structure**: Express server in `packages/server/src/index.ts` uses:

- `dotenv.config()` for environment variables
- Standard middleware: `cors()`, `express.json()`
- Routes prefixed with `/api/`
- Console logs use emoji indicators (e.g., `🚀 Server is running`)

**Frontend patterns**:

- TailwindCSS utility classes for all styling (no CSS modules)
- `useState` + `useEffect` for data fetching (no external state management yet)
- Korean language used in UI text (e.g., `서버 응답:`, `모노레포 환경으로 구성되었습니다`)

## Adding New Features

**New API endpoint**: Add route in `packages/server/src/index.ts`, define types in `shared/src/types.ts`, consume in client via `fetch('/api/...')`.

**New shared utility**: Add to `packages/shared/src/utils.ts` and export from `index.ts`. Example utilities use Korean locale (see `formatDate` with `'ko-KR'`).

**New React component**: Place in `packages/client/src/`, use TailwindCSS classes. Existing patterns favor gradient backgrounds (`bg-gradient-to-br from-blue-50 to-indigo-100`) and shadowed cards.

## Important Notes

- **No test framework** currently configured
- **No environment variable setup** documented for production (only dotenv in development)
- **Shared package** is not currently imported by client/server (only types are defined, not consumed) - verify if cross-package imports are needed
- Port 3000 (client) and 3001 (server) are hardcoded - check `vite.config.ts` and `packages/server/src/index.ts` if ports conflict
