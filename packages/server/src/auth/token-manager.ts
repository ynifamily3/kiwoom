import fs from "fs";
import path from "path";

export interface TokenData {
  token: string;
  expires_dt: string;
  token_type: string;
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

    // 토큰 만료 확인
    const expiresDate = new Date(tokenData.expires_dt);
    const now = new Date();

    if (now >= expiresDate) {
      console.log("⚠️  저장된 토큰이 만료되었습니다");
      deleteToken();
      return null;
    }

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
