import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// tRPC 미들웨어 설정
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/api/trpc`);
});
