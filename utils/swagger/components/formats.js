const requestBodyForm = (path) => {
  return {
    content: {
      "application/json": {
        schema: {
          $ref: `#/components/schemas/${path}`,
        },
      },
    },
    required: true,
  };
};

const paramForm = (multiplePaths) => {
  if (!multiplePaths) {
    return [];
  }
  return multiplePaths.map((path) => {
    return {
      $ref: `#/components/parameters/${path}`,
    };
  });
};

const responseContent = {
  "application/json": {
    schema: {
      type: "object",
      properties: {
        resultType: {
          type: "string",
          example: "SUCCESS",
          description: "요청 결과의 타입입니다.",
        },
        error: {
          type: ["object", "null"],
          example: null,
          description: "요청이 실패했을 경우 message 및 data가 반환됩니다.",
        },
        success: {
          type: ["object", "null"],
          example: null,
          description: "요청이 성공했을 경우 message 및 data가 반환됩니다.",
          properties: {},
        },
      },
    },
  },
};

/**
 * Response 형식에 맞게 응답 예시를 반환해줍니다.
 *
 * resultType, error, success에 해당하는 값만 넣어주시면 됩니다.
 *
 * @param {{
 *   resultType: boolean,
 *   error: Object | null,
 *   success: Object | null
 * }} params - 응답 예시를 위한 매개변수
 * @returns {Object} Swagger 문서화를 위한 응답 예시 폼
 */
export const responseExampleForm = ({ resultType, error, success }) => {
  return {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: {
            type: "string",
            example: resultType ? "SUCCESS" : "FAIL",
            description: "요청 결과의 타입입니다.",
          },
          error: {
            type: ["object", "null"],
            example: error,
            description: "요청이 실패했을 경우 message 및 data가 반환됩니다.",
          },
          success: {
            type: ["object", "null"],
            example: success,
            description: "요청이 성공했을 경우 message 및 data가 반환됩니다.",
            properties: {},
          },
        },
      },
    },
  };
};

const generalResponse = {
  "2XX": {
    description: `요청이 **성공**하였습니다.  
- **200**: 요청이 성공적으로 처리되었습니다.  
- **201**: 요청이 성공적으로 처리되었으며, 새로운 리소스가 생성되었습니다.`,
    // content: responseContent,
  },
  "4XX": {
    description: `요청이 잘못되거나 실패하였습니다.  
상세 내용은 **error** 관련 노션을 참고해주시고, 대표적인 사유는 다음과 같습니다.    
- **400**: 잘못된 요청입니다.  
- **401**: 인증이 필요합니다.  
- **403**: 접근이 금지되었습니다.  
- **404**: 요청한 리소스를 찾을 수 없습니다.`,
    // content: responseContent,
  },
  "5XX": {
    description: `예상되지 않던 동작이거나, 연관된 서비스들에 문제가 발생하였습니다.    
\`UNHANDLED_ERROR\` 발생 시 BE Team에게 전달 부탁드립니다.    
- **500**: 서버 내부 오류입니다.  
- **502**: 잘못된 게이트웨이입니다.  
- **503**: 서비스 이용이 불가능합니다.`,
    // content: responseContent,
  },
};

/**
 * 각 엔드포인트에 대한 문서화를 위한 기본 형식을 반환합니다.
 */
export const swaggerFormat = ({
  tag,
  operationId,
  summary = "요약 추가 안하고 뭐하십니까?",
  description = "설명 추가 안하고 뭐하십니까?",
  requestBody,
  customRequestBody = {},
  params,
  responses = generalResponse,
  links,
}) => {
  const result = {};

  if (tag) result.tags = [tag];
  if (operationId) result.operationId = operationId;
  if (summary) result.summary = summary;
  if (description) result.description = description;
  if (requestBody)
    result.requestBody = Object.assign(
      {},
      requestBodyForm(requestBody),
      customRequestBody
    );
  if (params) result.parameters = paramForm(params);
  if (responses)
    result.responses = Object.assign({}, generalResponse, responses);
  if (links) result.links = links;

  return result;
};
