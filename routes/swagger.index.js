/*

yaml ... 어차피

*/

import { authSwagger } from "./auth.router.js";
import { eventSwagger } from "./events.router.js";

const swaggerDoc = {
  openapi: "3.1.0", // OpenAPI 버전을 3.1.0으로 업데이트
  info: {
    title: "Peekle : 피클", // 문서 제목
    version: "1.0.0", // 문서 버전
    description: "API 명세서 입니다", // 문서 설명
    termsOfService: "http://swagger.io/terms/",
    contact: {
      email: "saveearth1@cau.ac.kr",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io",
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
  tags: [
    {
      name: "Test",
      description: "테스트 API",
    },
  ],
  components: {
    securitySchemes: {
      AccessToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Bearer JWT를 활용한 AT 인증입니다.",
      },
      RefreshToken: {
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
  paths: {
    "/test": {
      get: {
        tags: ["Test"],
        summary: "테스트 API",
        description: "테스트 API 입니다.",
        responses: {
          200: {
            description: "성공",
          },
          400: {
            description: "실패",
          },
        },
      },
    },
    ...authSwagger,
    ...eventSwagger,
  },
};

export default swaggerDoc;
