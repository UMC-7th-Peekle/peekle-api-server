/*

yaml ... 어차피

*/

import { authSwagger, authSwaggerSchema } from "./auth.router.js";
import { eventSwagger, eventSwaggerSchema } from "./events.router.js";
<<<<<<< HEAD
=======
import { noticesSwaggerSchema, noticesSwagger } from "./notices.router.js";
import {
  communitySwagger,
  communitySwaggerSchema,
} from "./community.router.js";
import { userSwagger } from "./users.router.js";
>>>>>>> 05988d65476c9d5b433f640c27f3e563465baa24

const tags = [
  {
    name: "Admin",
    description: "관리자에 관련된 기능들입니다.",
  },
  {
    name: "Auth",
    description: "Authorization 및 Authentication에 관련된 기능들입니다.",
  },
  // {
  //   name: "Community",
  //   description: "게시글 및 게시판에 관련된 기능들입니다.",
  // },
  {
    name: "Notices",
    description: "공지사항에 관련된 기능들입니다. 관리자 전용입니다.",
  },
  {
    name: "Tickets",
    description: "문의사항에 관련된 기능들입니다.",
  },
  {
    name: "Users",
    description: "사용자 정보 조회 및 수정에 관련된 기능들입니다.",
  },
  {
    name: "Tests",
    description: "FE 개발 편의성 및 BE 동작 테스트를 위한 기능들입니다.",
  },
];

const description = `
![image](https://github.com/user-attachments/assets/3e95d821-7a5c-4594-953e-e2f7a2c9a30f)

#### 🥒 피클 (Peekle), 액티브 시니어 커뮤니티 플랫폼 🥒
---
피클(Peekle)은 **액티브 시니어 세대가 서로 연결되고, 새로운 경험과 가치를 만들어갈 수 있도록 돕는** 플랫폼입니다.  

#### 2024년 하반기 7th UMC Cygnus 지부 (중앙대학교, 숭실대학교, 서울여자대학교, 성신여자대학교) 소속 챌린저 8명과 함께합니다.  
#### [GitHub Organization](https://github.com/UMC-7th-Peekle) [FE Repository](https://github.com/UMC-7th-Peekle/peekle-frontend) [BE Repository](https://github.com/UMC-7th-Peekle/peekle-api-server)


<details>
  <summary>**🧑‍💼 PM & 🎨 Designer**</summary>

| **PM: 다니/이다은** | **디자이너: 지아/유지아** |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/1b4d0281-3460-409c-b671-16951348633d" width="200"> | <img src="https://github.com/user-attachments/assets/8a32d6bc-e2d9-40af-b1ef-6c26826849a0" width="200"> |

</details>

<details>
  <summary>**🛠️ Backend | Node.js**</summary>

| [**리더: 하늘/박경운**](https://github.com/kyeoungwoon) | [**잼/권재민**](https://github.com/jack0928) | [**얀/김이안**](https://github.com/2anizirong) |
|:---:|:---:|:---:|
| <img src="https://avatars.githubusercontent.com/u/65695112?v=4" width="200"> | <img src="https://avatars.githubusercontent.com/u/39423410?v=4" width="200"> | <img src="https://avatars.githubusercontent.com/u/145183497?v=4" width="200"> |

</details>

<details>
  <summary>**💻 Frontend | React.js**</summary>

| [**리더: 레일/문세종**](https://github.com/jongse7) | [**구오/구자연**](https://github.com/k-jayeoneee) | [**조이/김여진**](https://github.com/duwlsssss) |
|:---:|:---:|:---:|
| <img src="https://avatars.githubusercontent.com/u/78732904?v=4" width="200"> | <img src="https://avatars.githubusercontent.com/u/120778213?v=4" width="200"> | <img src="https://avatars.githubusercontent.com/u/92291790?v=4" width="200"> |

</details>
`;

const info = {
  title: "Peekle API Documentation", // 문서 제목
  version: "1.0.0", // 문서 버전
  description: description, // 문서 설명
  // termsOfService: "about:blank", // 서비스 이용 약관
  contact: {},
  license: {
    name: "MIT License",
    url: "https://opensource.org/licenses/MIT",
  },
  // "x-logo": {
  //   url: "https://example.com/logo.png", // 로고 이미지 URL
  //   altText: "Peekle Logo", // 로고 대체 텍스트
  // },
};

const servers = [
  {
    url: "https://test.shop:41021", // API 서버 URL
    description: "Main Server",
  },
  {
    url: "https://test.shop:41021", // API 서버 URL
    description: "Develop Server",
  },
  {
    url: "https://localhost:7777", // API 서버 URL
    description: "Local Server",
  },
];

const parameters = {
  userId: {
    name: "userId",
    in: "path",
    description: "user ID",
    required: true,
    schema: {
      type: "integer",
      example: 1,
    },
  },
  phone: {
    name: "phone",
    in: "query",
    description: "핸드폰번호",
    required: true,
    schema: {
      type: "string",
      example: "01012345678",
    },
  },
};

const errorSchemas = {
  CustomError: {
    type: "object",
    properties: {
      reason: { type: "string" },
      name: { type: "string" },
      errorCode: { type: "string" },
      statusCode: { type: "integer" },
      data: { type: "object" },
    },
  },
  SampleError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "SAMPLE_ERROR" },
          statusCode: { example: 500 },
        },
      },
    ],
  },
  InvalidInputError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_INPUT" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  AlreadyExistsError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "ALREADY_EXISTS" },
          statusCode: { example: 409 },
        },
      },
    ],
  },
  NotExistsError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "NOT_EXISTS" },
          statusCode: { example: 404 },
        },
      },
    ],
  },
  NotAllowedError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "NOT_ALLOWED" },
          statusCode: { example: 403 },
        },
      },
    ],
  },
  UnauthorizedError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "UNAUTHORIZED" },
          statusCode: { example: 401 },
        },
      },
    ],
  },
  TokenError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "CHECK_JWT_TOKEN" },
          statusCode: { example: 401 },
        },
      },
    ],
  },
  AjvError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "AJV_INVALID_INPUT" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  UnknownError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "UNKNOWN_ERROR" },
          statusCode: { example: 500 },
        },
      },
    ],
  },
  TimeOutError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "SESSION_TIMEOUT" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  TooManyRequest: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "TOO_MANY_ATTEMPTS" },
          statusCode: { example: 429 },
        },
      },
    ],
  },
  InvalidCodeError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_CODE" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  CipherError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "CIPHER_ERROR" },
          statusCode: { example: 503 },
        },
      },
    ],
  },
  MulterError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "MULTER_ERROR" },
          statusCode: { example: 503 },
        },
      },
    ],
  },
  RestrictedUserError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "USER_RESTRICTED" },
          statusCode: { example: 403 },
        },
      },
    ],
  },
  UserStatusError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "DORMANT_OR_TERMINATED" },
          statusCode: { example: 403 },
        },
      },
    ],
  },
  NotVerifiedError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "NOT_VERIFIED" },
          statusCode: { example: 401 },
        },
      },
    ],
  },
  InvalidQueryError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_QUERY" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  InvalidContentTypeError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_CONTENT_TYPE" },
          statusCode: { example: 415 },
        },
      },
    ],
  },
  Errors: {
    oneOf: [
      { $ref: "#/components/schemas/SampleError" },
      { $ref: "#/components/schemas/InvalidInputError" },
      { $ref: "#/components/schemas/AlreadyExistsError" },
      { $ref: "#/components/schemas/NotExistsError" },
      { $ref: "#/components/schemas/NotAllowedError" },
      { $ref: "#/components/schemas/UnauthorizedError" },
      { $ref: "#/components/schemas/TokenError" },
      { $ref: "#/components/schemas/AjvError" },
      { $ref: "#/components/schemas/UnknownError" },
      { $ref: "#/components/schemas/TimeOutError" },
      { $ref: "#/components/schemas/TooManyRequest" },
      { $ref: "#/components/schemas/InvalidCodeError" },
      { $ref: "#/components/schemas/CipherError" },
      { $ref: "#/components/schemas/MulterError" },
      { $ref: "#/components/schemas/RestrictedUserError" },
      { $ref: "#/components/schemas/UserStatusError" },
      { $ref: "#/components/schemas/NotVerifiedError" },
      { $ref: "#/components/schemas/InvalidQueryError" },
      { $ref: "#/components/schemas/InvalidContentTypeError" },
    ],
  },
};

export const swaggerDoc = {
  openapi: "3.1.0", // OpenAPI 3.1.0
  info: info,
  "x-tagGroups": [
    {
      name: "Community",
      tags: [
        "Community/Admin",
        "Community/Articles",
        "Community/Likes",
        "Community/Comments",
        "Community/Article/Comments",
        "Community/Report",
        "Community/Statistics",
      ],
    },
  ],
  externalDocs: {
    description: "Visit Backend Team Notion for more details",
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
      ...errorSchemas,
      ...eventSwaggerSchema,
<<<<<<< HEAD
      ...authSwaggerSchema,
=======
      ...noticesSwaggerSchema,
      ...authSwaggerSchema,
      ...communitySwaggerSchema,
      auth: authSwaggerSchema,
>>>>>>> 05988d65476c9d5b433f640c27f3e563465baa24
    },
    requestBodies: {
      // ...yourRequestBody,
      sample: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "sample",
                },
              },
            },
          },
        },
      },
    },
    responses: {
      // ...yourResponse,
      sample: {
        description: "sample response",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/NotExistsError",
            },
          },
        },
      },
      sample2: {
        200: {
          $ref: "#/components/responses/sample",
        },
      },
    },
    parameters: parameters,
    examples: {},
    headers: {},
    links: {},
  },
  paths: {
    ...authSwagger,
    ...eventSwagger,
    ...noticesSwagger,
    ...communitySwagger,
    ...userSwagger,
  },
  webhooks: {},
};

export const swaggerUiOptions = {
  explorer: true, // Swagger UI 탐색기 기능 활성화
  docExpansion: "none", // 기본적으로 태그들을 닫은 상태로 설정
  defaultModelsExpandDepth: 0, // 모델들을 닫은 상태로 설정
  defaultModelExpandDepth: 0, // 모델을 펼칠지 여부 설정 (0은 닫은 상태)
  defaultModelRendering: "example", // 모델을 예시 데이터로 렌더링
  displayOperationId: true, // Operation ID 표시
  displayRequestDuration: true, // 요청 지속 시간 표시
  filter: true, // 필터 기능 활성화
  showExtensions: true, // x-로 시작하는 확장 기능 표시
  showCommonExtensions: true, // 일반 확장 표시
  requestInterceptor: (request) => {
    // 요청을 가로채고 수정할 수 있습니다.
    return request;
  },
  responseInterceptor: (response) => {
    // 응답을 가로채고 수정할 수 있습니다.
    return response;
  },
  // maxDisplayedTags: 50, // 한 번에 표시할 수 있는 최대 태그 수
  // persistAuthorization: true, // 인증 정보 페이지 새로 고침 시 유지
  withCredentials: true, // 인증된 요청에 쿠키 포함
  supportedSubmitMethods: ["get", "post", "put", "delete"], // 지원하는 요청 방법
  deepLinking: true, // 각 API 항목에 고유 URL 링크 활성화
  showRequestHeaders: true, // 요청 헤더를 표시할지 여부
  showResponseHeaders: true, // 응답 헤더를 표시할지 여부
  // operationsSorter: "alpha", // API 메서드를 알파벳 순으로 정렬
  // tagsSorter: "alpha", // 태그를 알파벳 순으로 정렬
  // layout: "BaseLayout", // Swagger UI의 레이아웃을 설정
  jsonEditor: true, // JSON 편집기 사용 여부
  tryItOutEnabled: true, // 'Try it out' 기능 활성화
  validatorUrl: null, // Swagger UI에서 사용하는 유효성 검사 URL 비활성화
  operationsFilter: true, // 각 API에 필터링 기능을 적용
  scrollYOffset: 0, // 스크롤 오프셋
};

export default swaggerDoc;
