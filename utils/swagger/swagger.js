import swaggerJsdoc from "swagger-jsdoc";

// schama import : 아래 예시 처럼 import 해주시면 됩니다.
// const yourSchema = require("./schemas/your.schema"); // commonJS

// Swagger 옵션 설정
export const options = {
  swaggerDefinition: {
    openapi: "3.1.0", // OpenAPI 버전을 3.1.0으로 업데이트
    info: {
      title: "My API", // 문서 제목
      version: "1.0.0", // 문서 버전
      description: "API 명세서 입니다", // 문서 설명
    },
    servers: [
      {
        url: "http://localhost:7777", // API 서버 URL
        description: "Local Server",
      },
      {
        url: "https://maybe.aws", // API 서버 URL
        description: "AWS Server",
      },
    ],
    components: {
      securitySchemes: {
        AccessToken_Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Bearer JWT를 활용한 AT 인증입니다.",
        },
        RefreshToken_Cookie: {
          type: "apiKey",
          in: "cookie",
          name: "MY_RT",
          description: "Secure & HTTP-Only Cookie를 활용한 RT 인증입니다.",
        },
      },
      schemas: {
        // schema 파일에서 export 한 것을 구조분해할당으로 몰아두기.
        // ...yourSchema,
      },
    },
    security: [
      {
        AccessToken_Bearer: [],
        RefreshToken_Cookie: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // API 경로 (Swagger 주석이 포함된 파일)
};

export const specs = swaggerJsdoc(options);
