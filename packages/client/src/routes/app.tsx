import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import dayjs from "dayjs";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { GradientText } from "../components/animate-ui/primitives/texts/gradient";
import { Badge } from "../components/ui/badge";
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
  const formatExpiryDate = (expiryDate: Date | null) => {
    if (!expiryDate) return "정보 없음";
    return dayjs(expiryDate).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold">
                <GradientText
                  text="Kiwoom Trading"
                  className="from-blue-600 via-indigo-600 to-purple-600"
                />
              </CardTitle>
              <Button
                onClick={handleLogout}
                variant="destructive"
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
            </div>
          </CardHeader>
        </Card>

        {/* 인증 상태 */}
        <Card className="border-green-200">
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
            ) : null}
          </CardContent>
        </Card>

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
    </div>
  );
}
