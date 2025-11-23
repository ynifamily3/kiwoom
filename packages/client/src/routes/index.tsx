import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GradientText } from "../components/animate-ui/primitives/texts/gradient";
import { ShimmeringText } from "../components/animate-ui/primitives/texts/shimmering";
import { Badge } from "../components/ui/badge";
import { trpc } from "../lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // 인증 상태 확인 (새로운 패턴)
  const { data: authData, refetch: refetchAuth } = useQuery(
    trpc.checkAuth.queryOptions()
  );
  const isLoggedIn = authData?.isAuthenticated && authData?.hasValidToken;

  // 로그아웃 mutation (새로운 패턴)
  const logoutMutation = useMutation({
    mutationFn: trpc.logout.mutationOptions().mutationFn,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("로그아웃 성공", {
          description: "안전하게 로그아웃되었습니다",
        });
        refetchAuth();
      } else if ("error" in result) {
        toast.error("로그아웃 실패", {
          description: result.error?.message,
        });
      }
    },
    onError: (error) => {
      toast.error("로그아웃 오류", {
        description: error.message,
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
              <Badge variant="outline">TanStack Router</Badge>
              <Badge variant="outline">Kiwoom API</Badge>
            </div>
          </div>

          <Separator />

          {/* 시작하기 버튼 */}
          {isLoggedIn ? (
            <div className="flex gap-2">
              <Button asChild size="lg" className="flex-1" variant="default">
                <Link to="/app">📊 대시보드로 이동</Link>
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="min-w-[120px]"
              >
                {logoutMutation.isPending ? "로그아웃 중..." : "🚪 로그아웃"}
              </Button>
            </div>
          ) : (
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
                    Kiwoom Trading Service를 시작하려면 키움증권 계정이
                    필요합니다
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
                <Button
                  asChild
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="w-full"
                >
                  <Link to="/login">로그인하러 가기</Link>
                </Button>
              </DialogContent>
            </Dialog>
          )}

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
