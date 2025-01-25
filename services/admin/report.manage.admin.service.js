// Description: 관리자 페이지에서 신고를 처리하는 서비스 파일입니다.
import { NotExistsError, AlreadyExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";

/**
 * 사용자 제재 내역을 가져옵니다
 */
export const getPenalizedUsers = async ({ limit, cursor = null }) => {
  // 사용자 제재 내역 조회
  const penalizedUsers = await models.UserRestrictions.findAll({
    where: {
      ...(cursor && { userRestrictionId: { [Op.lt]: cursor } }), // 커서 조건: userRestrictionId 기준
    },
    order: [["createdAt", "DESC"]], // 최신순 정렬
    limit: limit + 1, // 조회 개수 제한 
  });

  // 다음 커서 설정
  const hasNextPage = penalizedUsers.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage
    ? penalizedUsers[limit - 1].userRestrictionId
    : null;

  if (hasNextPage) {
    penalizedUsers.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  return { penalizedUsers, nextCursor, hasNextPage };
};

/**
 * 사용자를 제재합니다
 */
export const penalizeUser = async ({
  userId,
  adminUserId,
  type,
  reason,
  endsAt,
}) => {
  // 제재 내역 조회
  const restrictionExists = await models.UserRestrictions.findOne({
    where: {
      userId,
      type: { [Op.in]: ['suspend', 'ban'] }, // 일시 정지나 영구 정지인 경우
      endsAt: { [Op.or]: [null, { [Op.gt]: new Date() }] }, // 종료일이 없거나 종료일이 현재 시간 이후인 경우
    },
  }); // 이 경우 현재 유효한 제재가 있는 상태

  // 이미 유효한 제재가 있는 경우
  if (restrictionExists) {
    throw new AlreadyExistsError("이미 제재된 사용자입니다.");
  }

  try {
    await models.UserRestrictions.create({
      userId,
      adminUserId,
      type,
      reason,
      endsAt,
    });
  } catch (error) {
    if (error instanceof models.Sequelize.ForeignKeyConstraintError) {
      throw new NotExistsError("해당 사용자가 존재하지 않습니다.");
    }
    throw error;
  }

  

  return;
};

/**
 * 사용자 제재를 해제합니다
 */

export const unpenalizeUser = async ({ userId }) => {
  // 사용자 제재 해제
  await models.PenalizedUsers.destroy({
    where: {
      userId,
    },
  });

  return;
};
