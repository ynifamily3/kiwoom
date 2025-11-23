export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
}

// 일별잔고수익률 (ka01690) 요청 타입
export interface DailyBalanceRequest {
  qry_dt: string; // 조회일자 (YYYYMMDD)
  cont_yn?: string; // 연속조회여부 (N: 초기조회, Y: 연속조회)
  next_key?: string; // 연속조회키 (연속조회시 이전 응답의 next_key)
}

// 일별잔고수익률 개별 종목 정보
export interface DailyBalanceStock {
  cur_prc: string; // 현재가
  stk_cd: string; // 종목코드
  stk_nm: string; // 종목명
  rmnd_qty: string; // 보유 수량
  buy_uv: string; // 매입 단가
  buy_wght: string; // 매수비중
  evltv_prft: string; // 평가손익
  prft_rt: string; // 수익률
  evlt_amt: string; // 평가금액
  evlt_wght: string; // 평가비중
}

// 일별잔고수익률 (ka01690) 응답 타입
export interface DailyBalanceResponse {
  dt: string; // 일자
  tot_buy_amt: string; // 총 매입가
  tot_evlt_amt: string; // 총 평가금액
  tot_evltv_prft: string; // 총 평가손익
  tot_prft_rt: string; // 수익률
  dbst_bal: string; // 예수금
  day_stk_asst: string; // 추정자산
  buy_wght: string; // 현금비중
  day_bal_rt: DailyBalanceStock[]; // 일별잔고수익률 목록
  return_code: number;
  return_msg: string;
  next_key?: string; // 다음키 (연속조회용, 없으면 마지막 페이지)
}

export interface SharedTypeTest {
  hello: string;
}
