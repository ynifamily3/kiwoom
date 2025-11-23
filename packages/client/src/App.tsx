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
              text="Kiwoom Service"
              className="from-blue-600 via-indigo-600 to-purple-600"
            />
          </CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            <ShimmeringText
              text="Modern Monorepo Architecture"
              className="text-lg"
            />
            <SlidingNumber
              number={113}
              className="text-lg font-semibold text-blue-600"
            />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="lg" className="w-full">
                🎉 테스트 대화상자 열기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  <GradientText
                    text="shadcn/ui & tRPC 테스트"
                    className="from-pink-500 to-violet-500"
                  />
                </DialogTitle>
                <DialogDescription className="text-base">
                  모든 컴포넌트가 정상적으로 작동하고 있습니다! 🎉
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-3">
                <Alert>
                  <AlertDescription>
                    shadcn/ui Dialog 컴포넌트를 사용합니다. Radix UI 기반이며
                    TailwindCSS로 스타일링되었습니다.
                  </AlertDescription>
                </Alert>
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-700 font-semibold">
                    API 통신은 tRPC를 통해 타입 안전하게 이루어집니다! 🚀
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">React</Badge>
              <Badge variant="default">TypeScript</Badge>
              <Badge variant="secondary">TailwindCSS v4</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
              <Badge variant="outline">Animate UI</Badge>
              <Badge variant="outline">Express</Badge>
              <Badge variant="outline">tRPC</Badge>
              <Badge variant="outline">React Query</Badge>
              <Badge variant="outline">pnpm</Badge>
            </div>
          </div>

          <Separator />

          {isLoading ? (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-center">
                  <Spinner className="w-12 h-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>에러 발생:</strong> {error.message}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="space-y-1">
                <div className="text-sm font-semibold text-green-700">
                  서버 응답 (via tRPC)
                </div>
                <div className="text-green-800">
                  <ShimmeringText text={data?.message || ""} />
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              🚀 모노레포 환경으로 구성되었습니다
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
