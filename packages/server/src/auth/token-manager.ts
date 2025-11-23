import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// dayjs 플러그인 설정
dayjs.extend(customParseFormat);

export interface TokenData {
  token: string;
  expires_dt: string;
  token_type: string;
  return_code: number;
  return_msg: string;
  created_at: string;
}

const TOKEN_FILE_PATH = path.join(__dirname, "../../.token.json");

/**
 * 토큰을 파일에 저장
 */
export const saveToken = (tokenData: Omit<TokenData, "created_at">): void => {
  const data: TokenData = {
    ...tokenData,
    created_at: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ 토큰이 파일에 저장되었습니다:", TOKEN_FILE_PATH);
  } catch (error) {
    console.error("❌ 토큰 저장 실패:", error);
    throw error;
  }
};

/**
 * 파일에서 토큰 읽기
 */
export const loadToken = (): TokenData | null => {
  try {
    if (!fs.existsSync(TOKEN_FILE_PATH)) {
      return null;
    }

    const data = fs.readFileSync(TOKEN_FILE_PATH, "utf-8");
    const tokenData: TokenData = JSON.parse(data);

    // 토큰 만료 확인 (expires_dt 형식: YYYYMMDDHHmmss)
    const expiresDate = dayjs(tokenData.expires_dt, "YYYYMMDDHHmmss");
    const now = dayjs();

    if (!expiresDate.isValid()) {
      console.error(
        "❌ 만료일시 형식이 올바르지 않습니다:",
        tokenData.expires_dt
      );
      deleteToken();
      return null;
    }

    if (now.isAfter(expiresDate) || now.isSame(expiresDate)) {
      console.log("⚠️  저장된 토큰이 만료되었습니다");
      console.log("   만료일시:", expiresDate.format("YYYY-MM-DD HH:mm:ss"));
      deleteToken();
      return null;
    }

    console.log("✅ 유효한 토큰 발견");
    console.log("   만료일시:", expiresDate.format("YYYY-MM-DD HH:mm:ss"));
    return tokenData;
  } catch (error) {
    console.error("❌ 토큰 읽기 실패:", error);
    return null;
  }
};

/**
 * 토큰 파일 삭제
 */
export const deleteToken = (): void => {
  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      fs.unlinkSync(TOKEN_FILE_PATH);
      console.log("✅ 토큰 파일이 삭제되었습니다");
    }
  } catch (error) {
    console.error("❌ 토큰 삭제 실패:", error);
    throw error;
  }
};

/**
 * 현재 유효한 토큰 가져오기
 */
export const getValidToken = (): string | null => {
  const tokenData = loadToken();
  return tokenData ? tokenData.token : null;
};
