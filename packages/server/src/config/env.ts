import { z } from "zod";
import "dotenv/config";

// 환경변수 스키마 정의
const envSchema = z.object({
  PORT: z.string().default("3001"),
  KIWOOM_API_URL: z.string().url().default("https://openapi.kiwoom.com"),
  KIWOOM_APP_KEY: z.string().min(1, "KIWOOM_APP_KEY는 필수입니다"),
  KIWOOM_SECRET_KEY: z.string().min(1, "KIWOOM_SECRET_KEY는 필수입니다"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET은 필수입니다"),
});

// 환경변수 타입
export type Env = z.infer<typeof envSchema>;

// 환경변수 검증 및 export
function validateEnv(): Env {
  try {
    const parsed = envSchema.parse({
      PORT: process.env.PORT,
      KIWOOM_API_URL: process.env.KIWOOM_API_URL,
      KIWOOM_APP_KEY: process.env.KIWOOM_APP_KEY,
      KIWOOM_SECRET_KEY: process.env.KIWOOM_SECRET_KEY,
      SESSION_SECRET: process.env.SESSION_SECRET,
    });

    console.log("✅ 환경변수 검증 완료");
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ 환경변수 검증 실패:");
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
    }
    throw new Error("환경변수 설정이 올바르지 않습니다");
  }
}

export const env = validateEnv();
