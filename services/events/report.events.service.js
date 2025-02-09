import {
  NotAllowedError,
  NotExistsError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";

/**
 * eventId 유효성 여부 확인 403
 * 자기 자신 신고 여부 확인 404
 * 두 에러 같이 처리합니다.
 */
const existEvent = async ({ eventId, userId }) => {
  const event = await models.Events.findOne({
    where: { eventId },
  });

  if (!event) {
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }

  // 타입 확인 해볼려고 추가
  console.log(typeof event.createdUserId); // number
  console.log(typeof userId); // string

  if (event.createdUserId.toString() === userId) {
    throw new NotAllowedError("본인이 작성한 게시글을 신고할 수 없습니다.");
  }
};

// 중복 신고 여부를 확인 409 + 새로운 이벤트 신고
const createNewReport = async ({ eventId, userId, reason }) => {
  try {
    return await models.Reports.create({
      type: "event",
      targetId: eventId,
      reportedUserId: userId,
      reason,
    });
  } catch (error) {
    throw new AlreadyExistsError("이미 신고한 이벤트입니다.");
  }
};

export const newReport = async ({ eventId, userId, reason }) => {
  // 잘못된 요청 reason 누락 400
  if (!reason) {
    throw new Error("신고 사유가 누락되었습니다.");
  }
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  await existEvent({ eventId, userId }); // 403, 404

  const newReport = await createNewReport({ eventId, userId, reason });

  return newReport;
};
