import path from "path";
import fs from "fs/promises";
import models from "../../models/index.js";
import {
  NotExistsError,
  NotAllowedError,
  InvalidInputError,
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import { deleteLocalFile } from "../../utils/upload/uploader.object.js";

// 공지 수정
export const updateNotice = async (noticeId, userId, updateData) => {
  try {
    const notice = await models.Notices.findByPk(noticeId);

    // 해당 공지사항이 존재하지 않는 경우
    if (!notice) {
      logger.debug("존재하지 않는 공지사항 수정", {
        action: "notice: update",
        actionType: "error",
        userId: userId,
        data: updateData,
      });
      throw new NotExistsError("존재하지 않는 공지사항입니다.");
    }

    // 작성자가 수정을 요청한게 아닌 경우
    if (notice.authorId.toString() !== userId) {
      logger.error("타인이 작성한 공지사항 수정", {
        action: "event: update",
        actionType: "error",
        authorId: notice.authorId,
        requestedUserId: userId,
        requestedData: updateData,
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 게시글을 수정할 수 없습니다."
      );
    }

    // 필요한 필드만 업데이트
    // shallow copy
    Object.assign(notice, updateData);

    await notice.save();
    logger.debug("공지사항 수정 완료", {
      action: "notice: update",
      actionType: "sucess",
      requestedUserId: userId,
      updatedData: updateData,
    });

    // 이미지 업데이트 (아직 안했듬...)

    return { notice };
  } catch (error) {
    throw error;
  }
};