import { initTRPC } from "@trpc/server";
import { z } from "zod";
import type { Request, Response } from "express";
import superjson from "superjson";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { env } from "./config/env";
import {
  saveToken,
  loadToken,
  deleteToken,
  getValidToken,
} from "./auth/token-manager";

// dayjs 플러그인 설정
dayjs.extend(customParseFormat);

// 타입 정의
interface TokenResponse {
  expires_dt: string;
  token_type: string;
  token: string;
  return_code: number;
  return_msg: string;
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

// tRPC 인스턴스 생성 with context and superjson
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// 라우터와 프로시저 생성
export const router = t.router;
export const publicProcedure = t.procedure;

// 앱 라우터 정의
export const appRouter = router({
  checkAuth: publicProcedure.query(({ ctx }) => {
    const isAuthenticated = ctx.req.session.isAuthenticated || false;
    const token = loadToken();

    // expires_dt를 Date 객체로 변환 (YYYYMMDDHHmmss 형식)
    let tokenExpiry: Date | null = null;
    if (token?.expires_dt) {
      const parsed = dayjs(token.expires_dt, "YYYYMMDDHHmmss");
      if (parsed.isValid()) {
        tokenExpiry = parsed.toDate();
      }
    }

    return {
      isAuthenticated,
      hasValidToken: !!token,
      tokenExpiry,
    };
  }),

  // 접근토큰 발급 (로그인)
  login: publicProcedure.mutation(async ({ ctx }) => {
    try {
      // 기존 유효한 토큰 확인
      const existingToken = loadToken();
      if (existingToken) {
        console.log("✅ 기존 토큰 재사용");
        ctx.req.session.isAuthenticated = true;
        return {
          success: true,
          message: "기존 토큰으로 인증되었습니다",
        };
      }

      // 새로운 토큰 발급
      console.log("🔄 새로운 토큰 발급 요청");
      const requestBody = {
        grant_type: "client_credentials" as const,
        appkey: env.KIWOOM_APP_KEY,
        secretkey: env.KIWOOM_SECRET_KEY,
      };

      const response = await fetch(`${env.KIWOOM_API_URL}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(requestBody),
      });

      // 응답 헤더 로깅
      console.log("📡 응답 코드:", response.status);
      console.log("📡 응답 헤더:", {
        "next-key": response.headers.get("next-key"),
        "cont-yn": response.headers.get("cont-yn"),
        "api-id": response.headers.get("api-id"),
      });

      const data = (await response.json()) as TokenResponse;
      console.log("📡 응답 본문:", JSON.stringify(data, null, 2));

      // return_code 확인 (0이 정상)
      if (data.return_code !== 0) {
        console.error("❌ 토큰 발급 실패:", data.return_msg);
        return {
          success: false,
          error: {
            message: data.return_msg,
            code: data.return_code.toString(),
          },
        };
      }

      console.log("✅ 토큰 발급 성공:", data.return_msg);

      // 토큰을 파일에 저장
      saveToken({
        token: data.token,
        expires_dt: data.expires_dt,
        token_type: data.token_type,
        return_code: data.return_code,
        return_msg: data.return_msg,
      });

      // 세션에 로그인 상태 저장
      ctx.req.session.isAuthenticated = true;

      return {
        success: true,
        message: data.return_msg,
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

      if (!token) {
        console.log("⚠️ 폐기할 토큰이 없습니다");
        ctx.req.session.destroy((err) => {
          if (err) console.error("세션 삭제 오류:", err);
        });
        return { success: true };
      }

      // 토큰 폐기 API 호출
      console.log("🔄 토큰 폐기 요청");
      const requestBody = {
        token,
        appkey: env.KIWOOM_APP_KEY,
        secretkey: env.KIWOOM_SECRET_KEY,
      };

      const response = await fetch(`${env.KIWOOM_API_URL}/oauth2/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(requestBody),
      });

      // 응답 헤더 로깅
      console.log("📡 응답 코드:", response.status);

      const data = (await response.json()) as {
        return_code: number;
        return_msg: string;
      };
      console.log("📡 응답 본문:", JSON.stringify(data, null, 2));

      if (data.return_code !== 0) {
        console.error("❌ 토큰 폐기 실패:", data.return_msg);
      } else {
        console.log("✅ 토큰 폐기 성공:", data.return_msg);
      }

      // 토큰 파일 삭제
      deleteToken();

      // 세션 삭제
      ctx.req.session.destroy((err) => {
        if (err) {
          console.error("❌ 세션 삭제 오류:", err);
        } else {
          console.log("✅ 세션 삭제 완료");
        }
      });

      return { success: true };
    } catch (error) {
      console.error("❌ 로그아웃 오류:", error);
      // 오류가 발생해도 로컬 토큰과 세션은 삭제
      deleteToken();
      ctx.req.session.destroy((err) => {
        if (err) console.error("세션 삭제 오류:", err);
      });

      return {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다",
        },
      };
    }
  }),

  // 헬스 체크
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
