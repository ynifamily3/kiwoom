import { useState } from "react";
import { trpc } from "./lib/trpc";
import { Button } from "./components/ui/button";
import { SlidingNumber } from "./components/animate-ui/primitives/texts/sliding-number";
import { GradientText } from "./components/animate-ui/primitives/texts/gradient";
import { ShimmeringText } from "./components/animate-ui/primitives/texts/shimmering";
import { Badge } from "./components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Skeleton } from "./components/ui/skeleton";
import { Separator } from "./components/ui/separator";
import { Spinner } from "./components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

function App() {
  const [open, setOpen] = useState(false);

  // tRPC를 사용한 데이터 페칭
  const { data, isLoading, error } = trpc.hello.useQuery();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-5xl font-bold">
            <GradientText
              text="Kiwoom Trading Service"
              className="from-blue-600 via-indigo-600 to-purple-600"
            />
          </CardTitle>
          <CardDescription className="text-lg space-y-2">
            <ShimmeringText
              text="AI 기반 개인 주식 투자 플랫폼"
              className="text-xl font-semibold"
            />
            <p className="text-muted-foreground">
              키움증권 API를 활용한 스마트 투자 솔루션
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 서비스 소개 섹션 */}
          <Card className="border-2 border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                📈 서비스 소개
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kiwoom Trading Service는 키움증권 Open API를 활용하여 개인
                투자자가 효율적으로 주식 투자를 관리할 수 있도록 돕는 웹 기반
                플랫폼입니다.
              </p>
              <div className="grid gap-3">
                <Alert className="border-blue-200">
                  <AlertDescription className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">💡</span>
                    <div>
                      <strong>실시간 시세 조회</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        실시간 주가, 호가, 체결 정보를 확인하고 빠른 의사결정을
                        지원합니다
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
                <Alert className="border-green-200">
                  <AlertDescription className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">🤖</span>
                    <div>
                      <strong>자동 매매 시스템</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        사용자 정의 전략에 따른 자동 주문 및 포트폴리오 관리
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
                <Alert className="border-purple-200">
                  <AlertDescription className="flex items-start gap-2">
                    <span className="text-purple-600 font-semibold">📊</span>
                    <div>
                      <strong>데이터 분석 & 시각화</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        투자 현황과 수익률을 직관적인 차트로 확인
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              🛠️ Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">React 19</Badge>
              <Badge variant="default">TypeScript</Badge>
              <Badge variant="secondary">TailwindCSS v4</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
              <Badge variant="outline">Animate UI</Badge>
              <Badge variant="outline">Express</Badge>
              <Badge variant="outline">tRPC</Badge>
              <Badge variant="outline">React Query</Badge>
              <Badge variant="outline">Kiwoom API</Badge>
            </div>
          </div>

          <Separator />

          {/* API 연결 상태 */}
          {isLoading ? (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-center">
                  <Spinner className="w-12 h-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <p className="text-center text-sm text-muted-foreground">
                  서버 연결 중...
                </p>
              </CardContent>
            </Card>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>서버 연결 실패:</strong> {error.message}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="space-y-1">
                <div className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  ✅ 서버 연결 성공 (via tRPC)
                </div>
                <div className="text-green-800">
                  <ShimmeringText text={data?.message || ""} />
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 시작하기 버튼 */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full" variant="default">
                🚀 투자 시작하기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  <GradientText
                    text="환영합니다!"
                    className="from-pink-500 to-violet-500"
                  />
                </DialogTitle>
                <DialogDescription className="text-base">
                  Kiwoom Trading Service를 시작하려면 키움증권 계정이 필요합니다
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-3">
                <Alert>
                  <AlertDescription>
                    <strong>준비 사항</strong>
                    <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                      <li>키움증권 계좌 개설</li>
                      <li>OpenAPI 신청 및 승인</li>
                      <li>API 키 발급</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-700">
                    <strong>시스템 요구사항</strong>
                    <p className="mt-1 text-sm">
                      Windows 10 이상, 키움 OpenAPI+ 설치 필요
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>

          <div className="text-center pt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              🚀 Modern Monorepo Architecture
            </p>
            <p className="text-xs text-muted-foreground">
              안전하고 효율적인 주식 투자를 위한 스마트 솔루션
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
