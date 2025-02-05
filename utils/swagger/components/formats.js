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

const generalResponse = {
  200: {
    description: "요청이 성공하였습니다.",
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
  summary,
  requestBody,
  params = null,
  responses = generalResponse,
}) => {
  return {
    tags: [tag],
    summary,
    requestBody: requestBodyForm(requestBody),
    parameters: paramForm(params),
    responses,
  };
};
