import path from "path";
import { fileURLToPath } from "url";

export const getPathDetails = () => {
  try {
    // ES6 환경
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rootDir = path.resolve(__dirname, "../");
    return { __filename, __dirname: rootDir };
  } catch (error) {
    // CommonJS 환경
    const __filename = __filename || __filename;
    const __dirname = __dirname || __dirname;
    const rootDir = path.resolve(__dirname, "../");
    return { __filename, __dirname: rootDir };
  }
};
