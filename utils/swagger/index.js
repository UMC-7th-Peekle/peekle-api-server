import { servers, tags, info } from "./options.js";
import { security, securitySchemes } from "./components/security.schemes.js";
import { requestBodies } from "./components/request.body.js";
import { responses } from "./components/responses.js";
import { parameters } from "./components/parameters.js";
import { paths } from "./components/paths/index.js";
import { schemas } from "./components/schemas/index.js";

/*
const bodyRef = (path) => {
  return {
    $ref: `#/components/requestBodies/${path}`,
  };
};
const responseRef = (path) => {
  return {
    $ref: `#/components/responses/${path}`,
  };
};
const schemaRef = (path) => {
  return {
    $ref: `#/components/schemas/${path}`,
  };
};
*/

export const swaggerDoc = {
  openapi: "3.1.0", // OpenAPI 3.1.0
  info: info,
  externalDocs: {
    description: "Visit Backend Team Notion for more details",
    url: "https://www.notion.so/API-0abd444acbf44291a14204991c8cf4ac?pvs=4",
  },
  servers: servers,
  tags: tags,
  security: security,
  components: {
    securitySchemes: securitySchemes,
    schemas: schemas,
    requestBodies: requestBodies,
    responses: responses,
    parameters: parameters,
    examples: {},
    headers: {},
    links: {},
  },
  paths: paths,
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
