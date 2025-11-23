/**
 * 키움 REST API 타입 정의
 */

/**
 * API 기본 정보
 */
export interface KiwoomApiInfo {
  /** API ID */
  apiId: string;
  /** API 명 */
  apiName: string;
}

/**
 * API 오류 코드 정보
 */
export interface KiwoomErrorInfo {
  /** 오류 코드 */
  code: string;
  /** 오류 메시지 */
  message: string;
}

/**
 * 오류 코드 생성 헬퍼 함수
 */
export const createErrorInfo = (
  code: string,
  message: string
): KiwoomErrorInfo => ({
  code,
  message,
});

/**
 * 키움 API 오류 코드 목록
 */
export const KIWOOM_ERROR_CODES: KiwoomErrorInfo[] = [
  createErrorInfo("1501", "API ID가 Null이거나 값이 없습니다"),
  createErrorInfo(
    "1504",
    "해당 URI에서는 지원하는 API ID가 아닙니다. API ID={?}, URI={?}"
  ),
  createErrorInfo("1505", "해당 API ID는 존재하지 않습니다. API ID={?}"),
  createErrorInfo(
    "1511",
    "필수 입력 값에 값이 존재하지 않습니다. 필수입력 파라미터={?}"
  ),
  createErrorInfo(
    "1512",
    "Http header에 값이 설정되지 않았거나 읽을 수 없습니다"
  ),
  createErrorInfo(
    "1513",
    "Http Header에 authorization 필드가 설정되어 있어야 합니다"
  ),
  createErrorInfo(
    "1514",
    "입력으로 들어온 Http Header의 authorization 필드 형식이 맞지 않습니다"
  ),
  createErrorInfo(
    "1515",
    "Http Header의 authorization 필드 내 Grant Type이 미리 정의된 형식이 아닙니다"
  ),
  createErrorInfo(
    "1516",
    "Http Header의 authorization 필드 내 Token이 정의되어 있지 않습니다"
  ),
  createErrorInfo(
    "1517",
    "입력 값 형식이 올바르지 않습니다. 파라미터={?} 실패사유= {?}"
  ),
  createErrorInfo(
    "1687",
    "재귀 호출이 발생하여 API 호출을 제한합니다, API ID={?}"
  ),
  createErrorInfo("1700", "허용된 요청 개수를 초과하였습니다. API ID={?}"),
  createErrorInfo("1901", "시장 코드값이 존재하지 않습니다. 종목코드={?}"),
  createErrorInfo(
    "1902",
    "종목 정보가 없습니다. 입력한 종목코드 값을 확인바랍니다. 종목코드={?}"
  ),
  createErrorInfo("1999", "예기치 못한 에러가 발생했습니다. 실패사유={?}"),
  createErrorInfo("8001", "App Key와 Secret Key 검증에 실패했습니다"),
  createErrorInfo(
    "8002",
    "App Key와 Secret Key 검증에 실패했습니다. 실패사유={?}"
  ),
  createErrorInfo(
    "8003",
    "Access Token을 조회하는데 실패했습니다. 실패사유={?}"
  ),
  createErrorInfo("8005", "Token이 유효하지 않습니다"),
  createErrorInfo(
    "8006",
    "Access Token을 생성하는데 실패했습니다. 실패사유={?}"
  ),
  createErrorInfo(
    "8009",
    "Access Token을 발급하는데 실패했습니다. 실패사유={?}"
  ),
  createErrorInfo(
    "8010",
    "Token을 발급받은 IP와 서비스를 요청한 IP가 동일하지 않습니다"
  ),
  createErrorInfo(
    "8011",
    "Access Token을 발급하는데 실패했습니다. 입력값에 grant_type이 들어오지 않았습니다"
  ),
  createErrorInfo(
    "8012",
    "Access Token을 발급하는데 실패했습니다. grant_type의 값이 맞지 않습니다"
  ),
  createErrorInfo(
    "8015",
    "Access Token을 폐기하는데 실패했습니다. 실패사유={?}"
  ),
  createErrorInfo(
    "8016",
    "Access Token을 폐기하는데 실패했습니다. 입력값에 Token이 들어오지 않았습니다"
  ),
  createErrorInfo(
    "8020",
    "입력파라미터로 appkey 또는 secretkey가 들어오지 않았습니다."
  ),
  createErrorInfo(
    "8030",
    "투자구분(실전/모의)이 달라서 Appkey를 사용할수가 없습니다"
  ),
  createErrorInfo(
    "8031",
    "투자구분(실전/모의)이 달라서 Token를 사용할수가 없습니다"
  ),
  createErrorInfo("8040", "단말기 인증에 실패했습니다"),
  createErrorInfo("8050", "지정단말기 인증에 실패했습니다"),
  createErrorInfo(
    "8103",
    "토큰 인증 또는 단말기인증에 실패했습니다. 실패사유={?}"
  ),
];

/**
 * API 정보 생성 헬퍼 함수
 */
export const createApiInfo = (
  apiId: string,
  apiName: string
): KiwoomApiInfo => ({
  apiId,
  apiName,
});

/**
 * API 중분류별 목록
 */
export type KiwoomApiSubCategoryMap = {
  [subCategory: string]: KiwoomApiInfo[];
};

/**
 * 키움 API 계층 구조
 * 대분류 > 중분류 > API 목록
 */
export type KiwoomApiHierarchy = {
  ["OAuth 인증"]: {
    ["접근토큰발급"]: KiwoomApiInfo[];
    ["접근토큰폐기"]: KiwoomApiInfo[];
  };
  ["국내주식"]: {
    ["계좌"]: KiwoomApiInfo[];
    ["종목정보"]: KiwoomApiInfo[];
    ["시세"]: KiwoomApiInfo[];
    ["기관/외국인"]: KiwoomApiInfo[];
    ["업종"]: KiwoomApiInfo[];
    ["공매도"]: KiwoomApiInfo[];
    ["순위정보"]: KiwoomApiInfo[];
    ["ELW"]: KiwoomApiInfo[];
    ["차트"]: KiwoomApiInfo[];
    ["대차거래"]: KiwoomApiInfo[];
    ["조건검색"]: KiwoomApiInfo[];
    ["ETF"]: KiwoomApiInfo[];
    ["테마"]: KiwoomApiInfo[];
    ["주문"]: KiwoomApiInfo[];
    ["신용주문"]: KiwoomApiInfo[];
    ["실시간시세"]: KiwoomApiInfo[];
  };
};

/**
 * 키움 API 데이터
 */
export const KIWOOM_API_DATA: KiwoomApiHierarchy = {
  "OAuth 인증": {
    접근토큰발급: [createApiInfo("au10001", "접근토큰 발급")],
    접근토큰폐기: [createApiInfo("au10002", "접근토큰 폐기")],
  },
  국내주식: {
    계좌: [
      createApiInfo("ka01690", "일별잔고수익률"),
      createApiInfo("ka10068", "일자별종목별실현손익요청_일자"),
      createApiInfo("ka10069", "일자별종목별실현손익요청_기간"),
      createApiInfo("ka10070", "일자별실현손익요청"),
      createApiInfo("ka10071", "미체결요청"),
      createApiInfo("ka10072", "체결요청"),
      createApiInfo("ka10073", "당일실현손익상세요청"),
      createApiInfo("ka10085", "계좌수익률요청"),
      createApiInfo("ka10088", "미체결 분할주문 상세"),
      createApiInfo("ka10170", "당일매매일지요청"),
      createApiInfo("kt00001", "예수금상세현황요청"),
      createApiInfo("kt00002", "일별추정예탁자산현황요청"),
      createApiInfo("kt00003", "추정자산조회요청"),
      createApiInfo("kt00004", "계좌평가현황요청"),
      createApiInfo("kt00005", "체결잔고요청"),
      createApiInfo("kt00007", "계좌별주문체결내역상세요청"),
      createApiInfo("kt00008", "계좌별익일결제예정내역요청"),
      createApiInfo("kt00009", "계좌별주문체결현황요청"),
      createApiInfo("kt00010", "주문인출가능금액요청"),
      createApiInfo("kt00011", "증거금율별주문가능수량조회요청"),
      createApiInfo("kt00012", "신용보증금율별주문가능수량조회요청"),
      createApiInfo("kt00013", "증거금세부내역조회요청"),
      createApiInfo("kt00015", "위탁종합거래내역요청"),
      createApiInfo("kt00016", "일별계좌수익률상세현황요청"),
      createApiInfo("kt00017", "계좌별당일현황요청"),
      createApiInfo("kt00018", "계좌평가잔고내역요청"),
      createApiInfo("kt50020", "금현물 잔고확인"),
      createApiInfo("kt50021", "금현물 예수금"),
      createApiInfo("kt50030", "금현물 주문체결전체조회"),
      createApiInfo("kt50031", "금현물 주문체결조회"),
      createApiInfo("kt50032", "금현물 거래내역조회"),
      createApiInfo("kt50075", "금현물 미체결조회"),
    ],
    종목정보: [
      createApiInfo("ka00198", "실시간종목조회순위"),
      createApiInfo("ka10001", "주식기본정보요청"),
      createApiInfo("ka10002", "주식거래원요청"),
      createApiInfo("ka10003", "체결정보요청"),
      createApiInfo("ka10013", "신용매매동향요청"),
      createApiInfo("ka10015", "일별거래상세요청"),
      createApiInfo("ka10016", "신고저가요청"),
      createApiInfo("ka10017", "상하한가요청"),
      createApiInfo("ka10018", "고저가근접요청"),
      createApiInfo("ka10019", "가격급등락요청"),
      createApiInfo("ka10024", "거래량갱신요청"),
      createApiInfo("ka10025", "매물대집중요청"),
      createApiInfo("ka10026", "고저PER요청"),
      createApiInfo("ka10028", "시가대비등락률요청"),
      createApiInfo("ka10043", "거래원매물대분석요청"),
      createApiInfo("ka10053", "거래원순간거래량요청"),
      createApiInfo("ka10055", "변동성완화장치발동종목요청"),
      createApiInfo("ka10056", "당일전일체결량요청"),
      createApiInfo("ka10058", "투자자별일별매매종목요청"),
      createApiInfo("ka10059", "종목별투자자기관별요청"),
      createApiInfo("ka10060", "종목별투자자기관별합계요청"),
      createApiInfo("ka10084", "당일전일체결요청"),
      createApiInfo("ka10095", "관심종목정보요청"),
      createApiInfo("ka10099", "종목정보 리스트"),
      createApiInfo("ka10100", "종목정보 조회"),
      createApiInfo("ka10101", "업종코드 리스트"),
      createApiInfo("ka10102", "회원사 리스트"),
      createApiInfo("ka90003", "프로그램순매수상위50요청"),
      createApiInfo("ka90004", "종목별프로그램매매현황요청"),
      createApiInfo("kt20016", "신용융자 가능종목요청"),
      createApiInfo("kt20017", "신용융자 가능문의"),
    ],
    시세: [
      createApiInfo("ka10004", "주식호가요청"),
      createApiInfo("ka10005", "주식일주월시분요청"),
      createApiInfo("ka10006", "주식시분요청"),
      createApiInfo("ka10007", "시세표성정보요청"),
      createApiInfo("ka10011", "신주인수권전체시세요청"),
      createApiInfo("ka10044", "일별기관매매종목요청"),
      createApiInfo("ka10045", "종목별기관매매추이요청"),
      createApiInfo("ka10046", "체결강도추이시간별요청"),
      createApiInfo("ka10047", "체결강도추이일별요청"),
      createApiInfo("ka10062", "장중투자자별매매요청"),
      createApiInfo("ka10065", "장마감후투자자별매매요청"),
      createApiInfo("ka10074", "증권사별종목매매동향요청"),
      createApiInfo("ka10086", "일별주가요청"),
      createApiInfo("ka10087", "시간외단일가요청"),
      createApiInfo("ka50010", "금현물체결추이"),
      createApiInfo("ka50012", "금현물일별추이"),
      createApiInfo("ka50087", "금현물예상체결"),
      createApiInfo("ka50100", "금현물 시세정보"),
      createApiInfo("ka50101", "금현물 호가"),
      createApiInfo("ka90005", "프로그램매매추이요청 시간대별"),
      createApiInfo("ka90006", "프로그램매매차익잔고추이요청"),
      createApiInfo("ka90007", "프로그램매매누적추이요청"),
      createApiInfo("ka90008", "종목시간별프로그램매매추이요청"),
      createApiInfo("ka90010", "프로그램매매추이요청 일자별"),
      createApiInfo("ka90013", "종목일별프로그램매매추이요청"),
    ],
    "기관/외국인": [
      createApiInfo("ka10008", "주식외국인종목별매매동향"),
      createApiInfo("ka10009", "주식기관요청"),
      createApiInfo("ka10131", "기관외국인연속매매현황요청"),
      createApiInfo("ka52301", "금현물투자자현황"),
    ],
    업종: [
      createApiInfo("ka10010", "업종프로그램요청"),
      createApiInfo("ka10051", "업종별투자자순매수요청"),
      createApiInfo("ka20001", "업종현재가요청"),
      createApiInfo("ka20002", "업종별주가요청"),
      createApiInfo("ka20003", "전업종지수요청"),
      createApiInfo("ka20009", "업종현재가일별요청"),
    ],
    공매도: [createApiInfo("ka10014", "공매도추이요청")],
    순위정보: [
      createApiInfo("ka10020", "호가잔량상위요청"),
      createApiInfo("ka10021", "호가잔량급증요청"),
      createApiInfo("ka10022", "잔량율급증요청"),
      createApiInfo("ka10023", "거래량급증요청"),
      createApiInfo("ka10027", "전일대비등락률상위요청"),
      createApiInfo("ka10029", "예상체결등락률상위요청"),
      createApiInfo("ka10030", "당일거래량상위요청"),
      createApiInfo("ka10031", "전일거래량상위요청"),
      createApiInfo("ka10032", "거래대금상위요청"),
      createApiInfo("ka10033", "신용비율상위요청"),
      createApiInfo("ka10034", "외인기간별매매상위요청"),
      createApiInfo("ka10035", "외인연속순매매상위요청"),
      createApiInfo("ka10036", "외인한도소진율증가상위"),
      createApiInfo("ka10037", "외국계창구매매상위요청"),
      createApiInfo("ka10038", "종목별증권사순위요청"),
      createApiInfo("ka10039", "증권사별매매상위요청"),
      createApiInfo("ka10040", "당일주요거래원요청"),
      createApiInfo("ka10042", "순매수거래원순위요청"),
      createApiInfo("ka10054", "당일상위이탈원요청"),
      createApiInfo("ka10061", "동일순매매순위요청"),
      createApiInfo("ka10064", "장중투자자별매매상위요청"),
      createApiInfo("ka10098", "시간외단일가등락율순위요청"),
      createApiInfo("ka90009", "외국인기관매매상위요청"),
    ],
    ELW: [
      createApiInfo("ka10048", "ELW일별민감도지표요청"),
      createApiInfo("ka10050", "ELW민감도지표요청"),
      createApiInfo("ka30001", "ELW가격급등락요청"),
      createApiInfo("ka30002", "거래원별ELW순매매상위요청"),
      createApiInfo("ka30003", "ELWLP보유일별추이요청"),
      createApiInfo("ka30004", "ELW괴리율요청"),
      createApiInfo("ka30005", "ELW조건검색요청"),
      createApiInfo("ka30009", "ELW등락율순위요청"),
      createApiInfo("ka30010", "ELW잔량순위요청"),
      createApiInfo("ka30011", "ELW근접율요청"),
      createApiInfo("ka30012", "ELW종목상세정보요청"),
    ],
    차트: [
      createApiInfo("ka10060", "종목별투자자기관별차트요청"),
      createApiInfo("ka10063", "장중투자자별매매차트요청"),
      createApiInfo("ka10079", "주식틱차트조회요청"),
      createApiInfo("ka10080", "주식분봉차트조회요청"),
      createApiInfo("ka10081", "주식일봉차트조회요청"),
      createApiInfo("ka10082", "주식주봉차트조회요청"),
      createApiInfo("ka10083", "주식월봉차트조회요청"),
      createApiInfo("ka10094", "주식년봉차트조회요청"),
      createApiInfo("ka20004", "업종틱차트조회요청"),
      createApiInfo("ka20005", "업종분봉조회요청"),
      createApiInfo("ka20006", "업종일봉조회요청"),
      createApiInfo("ka20007", "업종주봉조회요청"),
      createApiInfo("ka20008", "업종월봉조회요청"),
      createApiInfo("ka20019", "업종년봉조회요청"),
      createApiInfo("ka50079", "금현물틱차트조회요청"),
      createApiInfo("ka50080", "금현물분봉차트조회요청"),
      createApiInfo("ka50081", "금현물일봉차트조회요청"),
      createApiInfo("ka50082", "금현물주봉차트조회요청"),
      createApiInfo("ka50083", "금현물월봉차트조회요청"),
      createApiInfo("ka50091", "금현물당일틱차트조회요청"),
      createApiInfo("ka50092", "금현물당일분봉차트조회요청"),
    ],
    대차거래: [
      createApiInfo("ka10066", "대차거래추이요청"),
      createApiInfo("ka10067", "대차거래상위10종목요청"),
      createApiInfo("ka20068", "대차거래추이요청(종목별)"),
      createApiInfo("ka90012", "대차거래내역요청"),
    ],
    조건검색: [
      createApiInfo("ka10171", "조건검색 목록조회"),
      createApiInfo("ka10172", "조건검색 요청 일반"),
      createApiInfo("ka10173", "조건검색 요청 실시간"),
      createApiInfo("ka10174", "조건검색 실시간 해제"),
    ],
    ETF: [
      createApiInfo("ka40001", "ETF수익율요청"),
      createApiInfo("ka40002", "ETF종목정보요청"),
      createApiInfo("ka40003", "ETF일별추이요청"),
      createApiInfo("ka40004", "ETF전체시세요청"),
      createApiInfo("ka40006", "ETF시간대별추이요청"),
      createApiInfo("ka40007", "ETF시간대별체결요청"),
      createApiInfo("ka40008", "ETF일자별체결요청"),
      createApiInfo("ka40009", "ETF시간대별체결요청"),
      createApiInfo("ka40010", "ETF시간대별추이요청"),
    ],
    테마: [
      createApiInfo("ka90001", "테마그룹별요청"),
      createApiInfo("ka90002", "테마구성종목요청"),
    ],
    주문: [
      createApiInfo("kt10000", "주식 매수주문"),
      createApiInfo("kt10001", "주식 매도주문"),
      createApiInfo("kt10002", "주식 정정주문"),
      createApiInfo("kt10003", "주식 취소주문"),
      createApiInfo("kt50000", "금현물 매수주문"),
      createApiInfo("kt50001", "금현물 매도주문"),
      createApiInfo("kt50002", "금현물 정정주문"),
      createApiInfo("kt50003", "금현물 취소주문"),
    ],
    신용주문: [
      createApiInfo("kt10006", "신용 매수주문"),
      createApiInfo("kt10007", "신용 매도주문"),
      createApiInfo("kt10008", "신용 정정주문"),
      createApiInfo("kt10009", "신용 취소주문"),
    ],
    실시간시세: [
      createApiInfo("00", "주문체결"),
      createApiInfo("04", "잔고"),
      createApiInfo("0A", "주식기세"),
      createApiInfo("0B", "주식체결"),
      createApiInfo("0C", "주식우선호가"),
      createApiInfo("0D", "주식호가잔량"),
      createApiInfo("0E", "주식시간외호가"),
      createApiInfo("0F", "주식당일거래원"),
      createApiInfo("0G", "ETF NAV"),
      createApiInfo("0H", "주식예상체결"),
      createApiInfo("0I", "국제금환산가격"),
      createApiInfo("0J", "업종지수"),
      createApiInfo("0U", "업종등락"),
      createApiInfo("0g", "주식종목정보"),
      createApiInfo("0m", "ELW 이론가"),
      createApiInfo("0s", "장시작시간"),
      createApiInfo("0u", "ELW 지표"),
      createApiInfo("0w", "종목프로그램매매"),
      createApiInfo("1h", "VI발동/해제"),
    ],
  },
};
