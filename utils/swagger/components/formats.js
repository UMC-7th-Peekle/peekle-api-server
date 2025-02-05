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

const generalResponse = {
  200: {
    description: "요청이 성공하였습니다.",
    content: responseContent,
  },
  400: {
    description: "잘못된 요청입니다.",
  },
  401: {
    description: "요청에 인증 정보가 제공되지 않았습니다.",
  },
  403: {
    description: "제공된 인증 정보의 주체는 해당 요청에 대한 권한이 없습니다.",
  },
  404: {
    description: "요청한 리소스를 찾을 수 없습니다.",
  },
  409: {
    description: "요청한 리소스가 이미 존재합니다.",
  },
  500: {
    description:
      "`UNHANDLED_ERROR`가 발생한 경우, 반드시 Backend Team에 전달해주세요.",
  },
};

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
