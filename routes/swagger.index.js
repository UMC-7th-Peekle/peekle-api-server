/*

yaml ... 어차피

*/

import { authSwagger, authSwaggerSchema } from "./auth.router.js";
import { eventSwagger, eventSwaggerSchema } from "./events.router.js";
import { noticesSwaggerSchema, noticesSwagger } from "./notices.router.js";
import {
  communitySwagger,
  communitySwaggerSchema,
} from "./community.router.js";

const tags = [
  {
    name: "Admin",
    description: "관리자 전용입니다.",
  },
  {
    name: "Auth",
    description: "",
  },
  {
    name: "Community",
    description: "테스트 API",
  },
  {
    name: "Notices",
    description: "테스트 API",
  },
  {
    name: "Tickets",
    description: "테스트 API",
  },
  {
    name: "Users",
    description: "테스트 API",
  },
  {
    name: "Tests",
    description: "테스트 API",
  },
];

const info = {
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
};

const servers = [
  {
    url: "https://localhost:7777", // API 서버 URL
    description: "Local Server",
  },
  {
    url: "https://test.shop:41021", // API 서버 URL
    description: "Remote Server (경운)",
  },
];

const swaggerDoc = {
  openapi: "3.1.0", // OpenAPI 3.1.0
  info: info,
  externalDocs: {
    description: "더 자세한 정보는 Backend Team Notion을 참고해주세요.",
    url: "https://www.notion.so/API-0abd444acbf44291a14204991c8cf4ac?pvs=4",
  },
  servers: servers,
  tags: tags,
  security: [
    {
      AccessToken_Bearer: [],
      RefreshToken_Cookie: [],
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
      ...eventSwaggerSchema,
      ...noticesSwaggerSchema,
      ...authSwaggerSchema,
      ...communitySwaggerSchema,
    },
    requestBodies: {},
    responses: {},
    parameters: {},
    examples: {},
    headers: {},
    links: {},
  },
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
    ...noticesSwagger,
    ...communitySwagger,
  },
  webhooks: {},
};

export default swaggerDoc;
