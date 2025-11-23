import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import dayjs from "dayjs";
import { trpc } from "./lib/trpc";
import { Button } from "./components/ui/button";
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
import { Separator } from "./components/ui/separator";
import { Spinner } from "./components/ui/spinner";

function App() {
  // 인증 상태 확인 (새로운 패턴)
  const {
    data: authData,
    isLoading: authLoading,
    refetch: refetchAuth,
  } = useQuery(trpc.checkAuth.queryOptions());

  // 로그인 mutation (새로운 패턴)
  const loginMutation = useMutation({
    mutationFn: trpc.login.mutationOptions().mutationFn,
    onSuccess: (result) => {
      if (result.success) {
        console.log("로그인 성공");
        toast.success("로그인 성공", {
          description: result.message || "키움증권 API 인증 완료",
        });
        refetchAuth();
      } else if ("error" in result) {
        console.error("로그인 실패:", result.error);
        toast.error("로그인 실패", {
          description: result.error?.message,
        });
      }
    },
    onError: (error) => {
      console.error("로그인 오류:", error);
      toast.error("로그인 오류", {
        description: error.message,
      });
    },
  });

  // 로그아웃 mutation (새로운 패턴)
  const logoutMutation = useMutation({
    mutationFn: trpc.logout.mutationOptions().mutationFn,
    onSuccess: (result) => {
      if (result.success) {
        console.log("로그아웃 성공");
        refetchAuth();
      } else if ("error" in result) {
        console.error("로그아웃 실패:", result.error);
        toast.error("로그아웃 실패", {
          description: result.error?.message,
        });
      }
    },
    onError: (error) => {
      console.error("로그아웃 오류:", error);
      toast.error("로그아웃 오류", {
        description: error.message,
      });
    },
  });

  const handleLogin = () => {
    loginMutation.mutate();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isLoggedIn = authData?.isAuthenticated && authData?.hasValidToken;

  // 만료일시 포맷팅 함수 (Date 객체 -> YYYY-MM-DD HH:mm:ss)
  const formatExpiryDate = (expiryDate: Date | null) => {
    if (!expiryDate) return "정보 없음";
    return dayjs(expiryDate).format("YYYY-MM-DD HH:mm:ss");
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
              <Badge variant="outline">Kiwoom API</Badge>
            </div>
          </div>

          <Separator />

          {/* 로그인 상태 */}
          <Card className={isLoggedIn ? "border-green-200" : "border-gray-200"}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>🔐 인증 상태</span>
                {isLoggedIn && (
                  <Badge variant="default" className="bg-green-600">
                    로그인됨
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {authLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner className="w-8 h-8" />
                </div>
              ) : isLoggedIn ? (
                <>
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-green-700">
                          ✅ 키움증권 API 인증 완료
                        </p>
                        <p className="text-xs text-green-600">
                          만료일시: {formatExpiryDate(authData?.tokenExpiry)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          💾 토큰은 서버에 안전하게 저장됩니다
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        로그아웃 중...
                      </>
                    ) : (
                      "🚪 로그아웃"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Alert>
                    <AlertDescription>
                      <p className="text-sm">
                        키움증권 API를 사용하려면 로그인이 필요합니다
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        🍪 세션 기반 인증으로 안전하게 관리됩니다
                      </p>
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleLogin}
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        로그인 중...
                      </>
                    ) : (
                      "🔑 로그인"
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Separator />

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
