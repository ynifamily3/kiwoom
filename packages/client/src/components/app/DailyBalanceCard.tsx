import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "../../lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { DailyBalanceStock, DailyBalanceResponse } from "@kiwoom/shared";

export function DailyBalanceCard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allStocks, setAllStocks] = useState<DailyBalanceStock[]>([]);
  const [nextKey, setNextKey] = useState<string>("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const queryDate = format(selectedDate, "yyyyMMdd");

  const { data, isLoading, error } = useQuery(
    trpc.getDailyBalance.queryOptions({
      qry_dt: queryDate,
      cont_yn: "N",
      next_key: "",
    })
  );

  // 날짜 변경 시 상태 초기화
  useEffect(() => {
    if (data) {
      setAllStocks(data.day_bal_rt);
      setNextKey(data.next_key || "");
    }
  }, [data]);

  // 더 보기 핸들러
  const handleLoadMore = async () => {
    if (!nextKey || !data) return;

    setIsLoadingMore(true);
    try {
      const moreData = await queryClient.fetchQuery(
        trpc.getDailyBalance.queryOptions({
          qry_dt: queryDate,
          cont_yn: "Y",
          next_key: nextKey,
        })
      );

      setAllStocks((prev) => [...prev, ...moreData.day_bal_rt]);
      setNextKey(moreData.next_key || "");
    } catch (err) {
      console.error("더 보기 오류:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>💼 일별잔고수익률</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              <p className="text-sm font-semibold">조회 실패</p>
              <p className="text-xs mt-1">{error.message}</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    return num.toLocaleString("ko-KR");
  };

  const formatPercent = (value: string) => {
    const num = parseFloat(value);
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  const isProfitable = data ? parseFloat(data.tot_prft_rt) >= 0 : false;

  return (
    <Card className={isProfitable ? "border-green-200" : "border-gray-200"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">💼 일별잔고수익률</CardTitle>
            <CardDescription className="mt-2">
              {isLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : data ? (
                <span className="text-sm font-medium">
                  기준일: {format(new Date(data.dt.slice(0, 4) + "-" + data.dt.slice(4, 6) + "-" + data.dt.slice(6, 8)), "PPP", { locale: ko })}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">기준일: -</span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* 날짜 선택 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP", { locale: ko })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
            <Badge
              variant={isProfitable ? "default" : "destructive"}
              className={isProfitable ? "bg-green-600" : ""}
            >
              {isLoading ? (
                <Skeleton className="h-4 w-12" />
              ) : data ? (
                formatPercent(data.tot_prft_rt)
              ) : (
                "-"
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 전체 요약 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">총 매입가</p>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-32" />
              ) : data ? (
                `₩${formatNumber(data.tot_buy_amt)}`
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">총 평가금액</p>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-32" />
              ) : data ? (
                `₩${formatNumber(data.tot_evlt_amt)}`
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">총 평가손익</p>
            <p
              className={`text-lg font-semibold ${
                isProfitable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isLoading ? (
                <Skeleton className="h-7 w-32" />
              ) : data ? (
                `${isProfitable ? "+" : ""}₩${formatNumber(
                  data.tot_evltv_prft
                )}`
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">예수금</p>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-32" />
              ) : data ? (
                `₩${formatNumber(data.dbst_bal)}`
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">추정자산</p>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-32" />
              ) : data ? (
                `₩${formatNumber(data.day_stk_asst)}`
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">현금비중</p>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : data ? (
                `${formatNumber(data.buy_wght)}%`
              ) : (
                "-"
              )}
            </p>
          </div>
        </div>

        <Separator />

        {/* 보유 종목 목록 */}
        <div>
          <h3 className="text-sm font-semibold mb-3">
            📊 보유 종목 ({isLoading ? "..." : allStocks.length}개)
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-16 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {allStocks.length === 0 ? (
                  <Alert>
                    <AlertDescription className="text-xs">
                      보유 종목이 없습니다
                    </AlertDescription>
                  </Alert>
                ) : (
                  allStocks.map((stock) => {
                    const stockProfit = parseFloat(stock.prft_rt) >= 0;
                    return (
                      <Card key={stock.stk_cd} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{stock.stk_nm}</p>
                              <Badge variant="outline" className="text-xs">
                                {stock.stk_cd}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatNumber(stock.rmnd_qty)}주 @ ₩
                              {formatNumber(stock.buy_uv)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                stockProfit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {formatPercent(stock.prft_rt)}
                            </p>
                            <p
                              className={`text-xs ${
                                stockProfit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {stockProfit ? "+" : ""}₩
                              {formatNumber(stock.evltv_prft)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* 더 보기 버튼 */}
              {nextKey && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        로딩 중...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />더 보기
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
