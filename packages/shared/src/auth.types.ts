/**
 * 키움 OAuth 타입 정의
 */

/**
 * 접근토큰 발급 요청
 */
export interface TokenRequest {
  grant_type: "client_credentials";
  appkey: string;
  secretkey: string;
}

/**
 * 접근토큰 발급 응답
 */
export interface TokenResponse {
  expires_dt: string; // 만료일시 (YYYYMMDDHHmmss)
  token_type: string; // 토큰 타입 (예: "bearer")
  token: string; // 접근 토큰
  return_code: number; // 응답 코드 (0: 정상)
  return_msg: string; // 응답 메시지
}

/**
 * 접근토큰 폐기 요청
 */
export interface RevokeTokenRequest {
  token: string;
  appkey: string;
  secretkey: string;
}

/**
 * 접근토큰 폐기 응답
 */
export interface RevokeTokenResponse {
  return_code: number; // 응답 코드 (0: 정상)
  return_msg: string; // 응답 메시지
}
