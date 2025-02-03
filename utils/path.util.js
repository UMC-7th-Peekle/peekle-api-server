import path from "path";
import { fileURLToPath } from "url";

export const getPathDetails = () => {
  try {
    // 런타임 환경에서 import.meta.url을 사용하는 경우
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return { __filename, __dirname };
  } catch (error) {
    // Jest 환경에서는 __filename과 __dirname을 기본 경로로 설정
    const __filename = path.resolve();
    const __dirname = path.dirname(__filename);
    return { __filename, __dirname };
  }
};
