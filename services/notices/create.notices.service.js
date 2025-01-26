import models from "../../models/index.js";
import { 
	InvalidInputError,
	NotAllowedError
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";

// 공지사항 생성
export const newNotice = async(userId, categoryId, noticeData) => {
	const {
		title,
		content,
		isNotice,
		authorId = userId,
		createdAt,
		updatedAt,
		imagePaths = [],
	} = noticeData;

	// 게시글 제목, 게시글 내용 누락 400
	if (!title || !content) {
		logger.debug("게시글 제목 또는 내용 누락", {
			action: "notice:create",
			actionType: "error",
			userId: userId
		});
		throw new InvalidInputError("게시글 제목 또는 내용이 누락되었습니다.");
	}

	// 카테고리id
	const category = await models.NoticeCategory.findOne({
		where: { categoryId: categoryId }
	});
	if (!category) {
		logger.debug("존재하지 않는 공지 카테고리", {
			action: "notice: create",
			actionType: "error",
			userId: userId
		});
		throw new InvalidInputError("해당 카테고리가 존재하지 않습니다.");
	}

	// 트랙잭션 시작
	const transaction = await models.sequelize.transaction();
	
	try {
		// 공지 생성
		const notice = await models.Notices.create(
			{
				categoryId,
				title,
				content,
				isNotice,
				authorId: userId,
				createdAt,
				updatedAt
			},
			{ transaction }
		);

		// 이미지가 새로 들어온 경우에만 처리
		if (imagePaths.length > 0) {
			// 새로운 이미지 추가
			const noticeImageData = imagePaths.map((path, index) => ({
				noticeId: notice.noticeId,
				imageUrl: path,
				sequence: index + 1, // 이미지 순서 설정
			}));

			await models.NoticeImages.bulkCreate(noticeImageData, { transaction });
		}

		// 트랜잭션 커밋
    await transaction.commit();

		return notice;
	} catch (error) {
    // 트랜잭션 롤백
    await transaction.rollback();
    throw error;
  }
};