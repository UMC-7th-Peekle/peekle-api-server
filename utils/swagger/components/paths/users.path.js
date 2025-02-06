import { swaggerFormat } from "../formats.js";

const userTags = {
  profile: "Users: 프로필",
  block: "Users: 차단",
  report: "Users: 신고",
};

const userProfile = {
  "/users/me": {
    get: swaggerFormat({
      tag: userTags.profile,
      summary: "사용자 정보 조회",
      description: "사용자 정보를 조회합니다.",
    }),
  },
  "/users/me/nickname": {
    patch: swaggerFormat({
      tag: userTags.profile,
      summary: "닉네임 변경",
      description: "사용자의 닉네임을 변경합니다.",
      requestBody: "users/patchNickname",
    }),
  },
  "/users/me/profile-image": {
    patch: swaggerFormat({
      tag: userTags.profile,
      summary: "프로필 이미지 변경",
      description: "사용자의 프로필 이미지를 변경합니다.",
      requestBody: "users/patchProfileImage",
    }),
    delete: swaggerFormat({
      tag: userTags.profile,
      summary: "프로필 이미지 삭제",
      description: "사용자의 프로필 이미지를 삭제합니다.",
    }),
  },
  "/users/me/phone": {
    patch: swaggerFormat({
      tag: userTags.profile,
      summary: "휴대폰 번호 변경",
      description: "사용자의 휴대폰 번호를 변경합니다.",
      requestBody: "users/patchPhone",
    }),
  },
};

const userStatus = {
  "/users/restore": {
    post: swaggerFormat({
      tag: userTags.profile,
      summary: "회원 복구",
      description: "회원을 복구합니다.",
      requestBody: "users/restoreUser",
    }),
  },
  "/users": {
    delete: swaggerFormat({
      tag: userTags.profile,
      summary: "회원 탈퇴",
      description: "회원을 탈퇴합니다.",
    }),
  },
  "/users/immediately": {
    delete: swaggerFormat({
      tag: userTags.profile,
      summary: "회원 탈퇴(즉시)",
      description: "회원을 즉시 탈퇴합니다.",
    }),
  },
};

const userBlockReport = {
  "/users/block": {
    get: swaggerFormat({
      tag: userTags.block,
      summary: "차단 목록 조회",
      description: "사용자의 차단 목록을 조회합니다.",
    }),
    post: swaggerFormat({
      tag: userTags.block,
      summary: "사용자 차단",
      description: "사용자를 차단합니다.",
      requestBody: "users/blockUser",
    }),
    delete: swaggerFormat({
      tag: userTags.block,
      summary: "사용자 차단 해제",
      description: "사용자의 차단을 해제합니다.",
      requestBody: "users/unblockUser",
    }),
  },
  "/users/report": {
    post: swaggerFormat({
      tag: userTags.report,
      summary: "사용자 신고",
      description: "사용자를 신고합니다.",
      requestBody: "users/reportUser",
    }),
  },
};

export default {
  ...userProfile,
  ...userStatus,
  ...userBlockReport,
};
