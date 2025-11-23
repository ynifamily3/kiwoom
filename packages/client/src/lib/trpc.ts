import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/src/trpc";

// tRPC React 훅 생성
export const trpc = createTRPCReact<AppRouter>();
