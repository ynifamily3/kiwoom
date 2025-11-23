import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import dayjs from "dayjs";
import { trpc } from "../lib/trpc";
import { AppHeader } from "../components/app/AppHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Spinner } from "../components/ui/spinner";
import { Separator } from "../components/ui/separator";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ location, context }) => {
    // tRPC queryOptions를 사용한 인증 상태 확인
    const { queryClient, trpc } = context;
    try {
      const authData = await queryClient.ensureQueryData(
        trpc.checkAuth.queryOptions()
      );

      const isLoggedIn = authData?.isAuthenticated && authData?.hasValidToken;

      if (!isLoggedIn) {
        throw redirect({
          to: "/login",
          search: { redirect: location.pathname },
        });
      }
    } catch (error) {
      if (error instanceof Error && "to" in error) {
        throw error; // redirect 에러는 그대로 throw
      }
      // 네트워크 에러 등의 경우 로그인 페이지로
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: App,
});

function App() {
  const navigate = useNavigate();

  // 인증 상태 확인 (새로운 패턴)
  const {
    data: authData,
    isLoading: authLoading,
    refetch: refetchAuth,
  } = useQuery(trpc.checkAuth.queryOptions());

  // 로그아웃 mutation (새로운 패턴)
  const logoutMutation = useMutation({
    mutationFn: trpc.logout.mutationOptions().mutationFn,
    onSuccess: (result) => {
      if (result.success) {
        console.log("로그아웃 성공");
        toast.success("로그아웃 성공", {
          description: "안전하게 로그아웃되었습니다",
        });
        refetchAuth();
        navigate({ to: "/" });
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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isLoggedIn = authData?.isAuthenticated && authData?.hasValidToken;

  // 만료일시 포맷팅 함수 (Date 객체 -> YYYY-MM-DD HH:mm:ss)
  const formatExpiryDate = (expiryDate: Date | null | undefined) => {
    if (!expiryDate) return "정보 없음";
    return dayjs(expiryDate).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* 메인 영역 (왼쪽) */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <AppHeader
          isLoggedIn={isLoggedIn}
          tokenExpiry={authData?.tokenExpiry}
          isLoggingOut={logoutMutation.isPending}
          onLogout={handleLogout}
          formatExpiryDate={formatExpiryDate}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          <div className="space-y-6">
            {/* 인증 상태 카드 */}
            {authLoading ? (
              <Card className="border-gray-200">
                <CardContent className="py-8">
                  <div className="flex items-center justify-center">
                    <Spinner className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg">🔐 인증 상태</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* 메인 컨텐츠 영역 */}
            <Card>
              <CardHeader>
                <CardTitle>📊 대시보드</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    <p className="text-sm">
                      주식 거래 기능이 곧 추가될 예정입니다.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Sticky Footer - 실시간 지표 스크롤 영역 */}
        <footer className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="h-16 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center">
              <div className="animate-marquee whitespace-nowrap flex gap-8 px-4">
                <span className="text-sm font-semibold">
                  📈 KOSPI: 2,500.00 ▲10.00 (+0.40%)
                </span>
                <span className="text-sm font-semibold">
                  📉 KOSDAQ: 850.00 ▼5.00 (-0.58%)
                </span>
                <span className="text-sm font-semibold">
                  💵 USD/KRW: 1,320.50 ▲2.50 (+0.19%)
                </span>
                <span className="text-sm font-semibold">
                  ⛽ WTI: 75.30 ▲0.80 (+1.07%)
                </span>
                <span className="text-sm font-semibold">
                  💰 금: 2,050.00 ▼5.00 (-0.24%)
                </span>
                {/* 반복을 위한 복제 */}
                <span className="text-sm font-semibold">
                  📈 KOSPI: 2,500.00 ▲10.00 (+0.40%)
                </span>
                <span className="text-sm font-semibold">
                  📉 KOSDAQ: 850.00 ▼5.00 (-0.58%)
                </span>
                <span className="text-sm font-semibold">
                  💵 USD/KRW: 1,320.50 ▲2.50 (+0.19%)
                </span>
                <span className="text-sm font-semibold">
                  ⛽ WTI: 75.30 ▲0.80 (+1.07%)
                </span>
                <span className="text-sm font-semibold">
                  💰 금: 2,050.00 ▼5.00 (-0.24%)
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* 내 투자 섹션 (오른쪽 sticky) */}
      <aside className="hidden xl:block w-80 sticky top-0 h-screen overflow-y-auto border-l border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💼 내 투자</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">총 평가액</span>
                  <span className="font-semibold">₩0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">총 수익률</span>
                  <span className="font-semibold text-green-600">+0.00%</span>
                </div>
              </div>
              <Separator />
              <Alert>
                <AlertDescription className="text-xs">
                  실제 투자 데이터는 API 연동 후 표시됩니다
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}
