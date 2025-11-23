import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import FileStore from "session-file-store";
import cookieParser from "cookie-parser";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { env } from "./config/env";

const app = express();
const SessionFileStore = FileStore(session);

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new SessionFileStore({
      path: "./sessions", // 세션 파일 저장 경로
      ttl: 60 * 60 * 24, // 24시간 (seconds)
      retries: 0,
    }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // production에서는 true (HTTPS 필요)
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24시간
      sameSite: "lax",
    },
  })
);

// tRPC 미들웨어 설정
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ req, res }),
  })
);

// Start server
app.listen(env.PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${env.PORT}/api/trpc`);
  console.log(`🔐 Session management enabled`);
});
