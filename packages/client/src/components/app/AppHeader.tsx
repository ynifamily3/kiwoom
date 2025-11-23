import { GradientText } from "../animate-ui/primitives/texts/gradient";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface AppHeaderProps {
  isLoggedIn: boolean;
  tokenExpiry: Date | null | undefined;
  isLoggingOut: boolean;
  onLogout: () => void;
  formatExpiryDate: (date: Date | null | undefined) => string;
}

export function AppHeader({
  isLoggedIn,
  tokenExpiry,
  isLoggingOut,
  onLogout,
  formatExpiryDate,
}: AppHeaderProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center gap-3">
            <GradientText
              text="Kiwoom Trading"
              className="text-2xl font-bold from-blue-600 via-indigo-600 to-purple-600"
            />
          </div>

          {/* 인증 상태 & 로그아웃 */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <>
                <Badge variant="default" className="bg-green-600">
                  <span className="text-xs">✅ 인증됨</span>
                </Badge>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  만료: {formatExpiryDate(tokenExpiry)}
                </span>
              </>
            )}
            <Button
              onClick={onLogout}
              variant="destructive"
              size="sm"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Spinner className="w-3 h-3 mr-2" />
                  로그아웃 중...
                </>
              ) : (
                "🚪 로그아웃"
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
