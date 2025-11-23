import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { GradientText } from "../components/animate-ui/primitives/texts/gradient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Spinner } from "../components/ui/spinner";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || "/app",
    };
  },
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

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
        // 로그인 성공 시 redirect 파라미터로 지정된 페이지로 이동 (히스토리 replace)
        navigate({ to: redirect as any, replace: true });
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

  const handleLogin = () => {
    loginMutation.mutate();
  };

  const isLoggedIn = authData?.isAuthenticated && authData?.hasValidToken;

  // 이미 로그인되어 있으면 redirect 파라미터로 지정된 페이지로 리다이렉트 (히스토리 replace)
  if (isLoggedIn) {
    navigate({ to: redirect as any, replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold">
            <GradientText
              text="로그인"
              className="from-blue-600 via-indigo-600 to-purple-600"
            />
          </CardTitle>
          <CardDescription>키움증권 API에 접속하여 인증합니다</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {authLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="w-8 h-8" />
            </div>
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
                size="lg"
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
    </div>
  );
}
