import * as deleteService from "../../services/notices/delete.notices.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";


export const deleteNotice = async (req, res, next) => {
	try {
		const { categoryId, noticeId } = req.params;
		const { userId } = req.user;

		logger.debug("공지사항 삭제", {
			action: "notice: delete",
			actionType: "success",
			userId: userId,
		});

		const notice = await deleteService.deleteNotice(categoryId, noticeId, userId);

		if (notice) return res.status(200).success({ message: "공지사항 삭제 완료" });
	} catch (error) {
		logError(error);
		next(error);
	}
};