export const parameters = {
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

export const paramForm = (multiplePaths) => {
  if (!multiplePaths) {
    return [];
  }
  return multiplePaths.map((path) => {
    return {
      $ref: `#/components/parameters/${path}`,
    };
  });
};
