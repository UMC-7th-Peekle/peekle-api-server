import * as createService from "../../services/notices/create.notices.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

/**
 * notices 테이블에 authorId가 userId 인 튜플을 추가
 */
export const createNotice = async (req, res, next) => {
	try {
		const { userId } = req.user;
		const { categoryId } = req.params;
		const noticeData = JSON.parse(req.body.data);
		const uploadedFiles = req.files?.notice_images || [];
		// 이미지 경로 추가
		noticeData.imagePaths = parseImagePaths(uploadedFiles);

		logger.debug("공지사항 생성", {
			action: "notice: create",
			actionType: "success",
			userId: userId,
			data: noticeData,
		});

		const notice = await createService.newNotice(userId, categoryId, noticeData);

		if (notice) {
			// 201
			return res.status(201).success({ message: "새로운 공지 생성 완료"});
		}
	} catch (error) {
		logError(error);
		next(error);
	}
};