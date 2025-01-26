import models from "../../models/index.js";
import { 
	NotExistsError,
	NotAllowedError
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";

export const deleteNotice = async (noticeId, userId) => {
  try {
		const notice = await models.Notices.findByPk(noticeId);

		// 해당 공지사항이 존재하지 않는 경우
    if (!notice) {
      logger.debug("존재하지 않는 공지사항 삭제", {
        action: "notice:delete",
        actionType: "error",
        // authorId: notice.authorId,
        requestedUserId: userId,
      });
      throw new NotExistsError("존재하지 않는 공지사항입니다.");
    }

		// 작성자가 삭제를 요청한게 아닌 경우
    if (notice.authorId.toString() !== userId) {
      logger.error("타인이 작성한 공지사항 삭제", {
        action: "event:delete",
        actionType: "error",
        authorId: notice.authorId,
        requestedUserId: userId,
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 게시글을 삭제할 수 없습니다."
      );
    }

		// 공지 삭제하기
		const deleteNotice = await models.Notices.destroy({
			where: { noticeId, authorId: userId }
		});

		// if (deleteNotice === 0) {    // 반환값이 0일 경우 404
    // // --> 이거 그냥 존재하지 않는 공지사항입니다.로 되고 적용 안되는 것 같아요
    //   throw new NotExistsError("이미 삭제한 공지사항입니다.");
    // }

    return true;
	} catch (error) {
    throw error;
  }
};