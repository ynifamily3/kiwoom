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
  expires_dt: string;
  token_type: string;
  token: string;
}

/**
 * 접근토큰 폐기 요청
 */
export interface RevokeTokenRequest {
  token: string;
}
