export const requestBodies = {
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
};

export const requestBodyForm = (path) => {
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
