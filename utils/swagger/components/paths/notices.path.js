import { swaggerFormat } from "../formats.js";

const noticeTags = {
  crud: "Notices",
  search: "Notices: 검색",
};

const crud = {
  "/notices/category/{categoryId}": {
    get: swaggerFormat({
      tag: noticeTags.crud,
      summary: "공지사항 조회",
      description: "카테고리에 해당하는 공지사항 목록을 조회합니다.",
      params: ["notices/limit", "notices/offset", "notices/categoryId"],
    }),
    post: swaggerFormat({
      tag: noticeTags.crud,
      summary: "공지사항 생성",
      description: "공지사항을 생성합니다.",
      requestBody: "notices/createNotice",
      params: ["notices/categoryId"],
    }),
  },
  "/notices": {
    get: swaggerFormat({
      tag: noticeTags.crud,
      summary: "공지사항 전체 조회",
      description: "전체 공지사항 목록을 조회합니다.",
      params: ["notices/limit", "notices/offset"],
    }),
  },
  "/notices/{noticeId}": {
    get: swaggerFormat({
      tag: noticeTags.crud,
      summary: "공지사항 상세 조회",
      description: "공지사항 ID에 해당하는 공지사항을 조회합니다.",
      params: ["notices/noticeId"],
    }),
    patch: swaggerFormat({
      tag: noticeTags.crud,
      summary: "공지사항 수정",
      description: "공지사항 ID에 해당하는 공지사항을 수정합니다.",
      requestBody: "notices/updateNotice",
      params: ["notices/noticeId"],
    }),
    delete: swaggerFormat({
      tag: noticeTags.crud,
      summary: "공지사항 삭제",
      description: "공지사항 ID에 해당하는 공지사항을 삭제합니다.",
      params: ["notices/noticeId"],
    }),
  },
};

export default {
  ...crud,
};
