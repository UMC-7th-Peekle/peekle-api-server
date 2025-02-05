const authParams = {
  userId: {
    name: "userId",
    in: "path",
    description: "user ID",
    required: true,
    schema: {
      type: "integer",
    },
  },
  phone: {
    name: "phone",
    in: "query",
    description: "핸드폰번호",
    required: true,
    schema: {
      type: "string",
    },
  },
};

const communityParams = {
  limit: {
    name: "limit",
    in: "query",
    required: false,
    description: "한 번에 가져올 게시글 수",
    schema: {
      type: "integer",
    },
  },
  cursor: {
    name: "cursor",
    in: "query",
    required: false,
    description: "페이지네이션을 위한 커서",
    schema: {
      type: "string",
    },
  },
  query: {
    name: "query",
    in: "query",
    required: false,
    description: "검색어",
    schema: {
      type: "string",
    },
  },
  communityId: {
    name: "communityId",
    in: "query",
    required: true,
    description: "커뮤니티 ID",
    schema: {
      type: "integer",
    },
  },
};

const eventParams = {
  limit: {
    name: "limit",
    in: "query",
    required: false,
    description: "한 화면에 가져올 게시글 개수",
    schema: {
      type: "integer",
    },
  },
  cursor: {
    name: "cursor",
    in: "query",
    required: false,
    description: "페이지네이션을 위한 커서",
    schema: {
      type: "integer",
    },
  },
  query: {
    name: "query",
    in: "query",
    required: false,
    description: "유저가 입력한 검색어",
    schema: {
      type: "string",
    },
  },
  category: {
    name: "category",
    in: "query",
    required: false,
    description: "유저가 선택한 카테고리",
    schema: {
      type: "array",
      items: {
        type: "string",
      },
      example: ["문화", "교육"],
    },
  },
  location: {
    name: "location",
    in: "query",
    required: false,
    description: "유저가 선택한 지역 그룹id",
    schema: {
      type: "array",
      items: {
        type: "string",
      },
      example: ["1", "3"],
    },
  },
  price: {
    name: "price",
    in: "query",
    required: false,
    description: "유저가 선택한 가격 정보",
    schema: {
      type: "string",
      enum: ["전체", "무료", "유료"],
    },
  },
  startDate: {
    name: "startDate",
    in: "query",
    required: false,
    description: "유저가 선택한 시작 날짜 (형식: YYYY-MM-DD)",
    schema: {
      type: "string",
      format: "date",
      example: "2023-12-21",
    },
  },
  endDate: {
    name: "endDate",
    in: "query",
    required: false,
    description: "유저가 선택한 끝 날짜 (형식: YYYY-MM-DD)",
    schema: {
      type: "string",
      format: "date",
      example: "2023-12-21",
    },
  },
};

const noticeParams = {
  limit: {
    name: "limit",
    in: "query",
    required: false,
    description: "한 번에 가져올 게시글 수",
    schema: {
      type: "integer",
      example: 5,
    },
  },
  offset: {
    name: "offset",
    in: "query",
    required: false,
    description: "페이지네이션을 위한 오프셋",
    schema: {
      type: "string",
      example: 2,
    },
  },
  categoryId: {
    name: "categoryId",
    in: "path",
    required: true,
    description: "카테고리 ID",
    schema: {
      type: "integer",
      example: 1,
    },
  },
  query: {
    name: "query",
    in: "query",
    required: true,
    description: "검색어",
    schema: {
      type: "string",
      example: "검색어",
    },
  },
};

export const parameters = {
  auth: authParams,
  community: communityParams,
  event: eventParams,
  notice: noticeParams,
};
