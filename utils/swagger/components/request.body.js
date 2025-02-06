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
