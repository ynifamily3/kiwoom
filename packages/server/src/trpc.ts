import { initTRPC } from "@trpc/server";
import { z } from "zod";
import type { Request, Response } from "express";
import {
  saveToken,
  loadToken,
  deleteToken,
  getValidToken,
} from "./auth/token-manager";

// 타입 정의
interface TokenResponse {
  expires_dt: string;
  token_type: string;
  token: string;
}

interface ErrorResponse {
  message?: string;
  code?: string;
}

// Context 타입 정의
interface Context {
  req: Request;
  res: Response;
}

// tRPC 인스턴스 생성 with context
const t = initTRPC.context<Context>().create();

// 라우터와 프로시저 생성
export const router = t.router;
export const publicProcedure = t.procedure;

// Kiwoom API 설정
const KIWOOM_API_URL =
  process.env.KIWOOM_API_URL || "https://mockapi.kiwoom.com";
const KIWOOM_APP_KEY = process.env.KIWOOM_APP_KEY || "";
const KIWOOM_SECRET_KEY = process.env.KIWOOM_SECRET_KEY || "";

// 앱 라우터 정의
export const appRouter = router({
  checkAuth: publicProcedure.query(({ ctx }) => {
    const isAuthenticated = ctx.req.session.isAuthenticated || false;
    const token = loadToken();

    return {
      isAuthenticated,
      hasValidToken: !!token,
      tokenExpiry: token?.expires_dt || null,
    };
  }),

  // 접근토큰 발급 (로그인)
  login: publicProcedure.mutation(async ({ ctx }) => {
    try {
      // 기존 유효한 토큰 확인
      const existingToken = loadToken();
      if (existingToken) {
        console.log("✅ 기존 토큰 사용");
        ctx.req.session.isAuthenticated = true;
        return {
          success: true,
          data: existingToken,
        };
      }

      // 새 토큰 발급
      const response = await fetch(`${KIWOOM_API_URL}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
          appkey: KIWOOM_APP_KEY,
          secretkey: KIWOOM_SECRET_KEY,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(
          errorData.message || `키움 API 오류: ${response.status}`
        );
      }

      const data = (await response.json()) as TokenResponse;

      // 토큰을 파일에 저장
      saveToken(data);

      // 세션에 인증 상태 저장
      ctx.req.session.isAuthenticated = true;

      return {
        success: true,
        data: {
          expires_dt: data.expires_dt,
          token_type: data.token_type,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "로그인 실패",
        },
      };
    }
  }),

  // 접근토큰 폐기 (로그아웃)
  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const token = getValidToken();

      if (token) {
        // 키움 API에 토큰 폐기 요청
        const response = await fetch(`${KIWOOM_API_URL}/oauth2/revoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            token: token,
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponse;
          console.warn("토큰 폐기 API 오류:", errorData.message);
          // API 오류가 있어도 로컬 토큰은 삭제
        }
      }

      // 로컬 토큰 파일 삭제
      deleteToken();

      // 세션 삭제
      ctx.req.session.destroy((err) => {
        if (err) {
          console.error("세션 삭제 오류:", err);
        }
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Logout error:", error);

      // 오류가 있어도 로컬 정리는 수행
      deleteToken();
      ctx.req.session.destroy(() => {});

      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "로그아웃 실패",
        },
      };
    }
  }),

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
