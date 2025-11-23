import { initTRPC } from "@trpc/server";
import { z } from "zod";

// tRPC 인스턴스 생성
const t = initTRPC.create();

// 라우터와 프로시저 생성
export const router = t.router;
export const publicProcedure = t.procedure;

// 앱 라우터 정의
export const appRouter = router({
  // hello 쿼리
  hello: publicProcedure.query(() => {
    return { message: "안녕!" };
  }),

  // health 체크
  health: publicProcedure.query(() => {
    return { status: "ok", message: "서버가 실행 중입니다." };
  }),

  // 예제: 입력값을 받는 쿼리
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.name}!` };
    }),

  // 예제: mutation (데이터 변경)
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(({ input }) => {
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...input,
        createdAt: new Date().toISOString(),
      };
    }),
});

// 타입 export (클라이언트에서 사용)
export type AppRouter = typeof appRouter;
