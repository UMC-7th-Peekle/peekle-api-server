import models from "../../models/index.js";

/**
 * 전화번호로 사용자를 조회 후 userId를 리턴합니다
 */
export const getUserByPhone = async ({ phone }) => {
  const data = await models.Users.findOne({
    attributes: ["userId"],
    where: { phone },
  });

  return data.userId;
};
