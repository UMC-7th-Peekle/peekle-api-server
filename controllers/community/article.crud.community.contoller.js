// Description: 게시글 관련 조회, 생성, 수정, 삭제와 관련된 컨트롤러 파일입니다.
import * as articleCrudService from "../../services/community/article.crud.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 게시글 조회
export const getArticleById = async (req, res, next) => {
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출

    const article = await articleCrudService.getArticleById({
      communityId,
      articleId,
    }); // 게시글 조회

    // TODO : article과 comment의 depth가 달라요, 이름도 명확하지 않고요.
    // service 단도 TODO 남겨드렸으니, 수정하면서 이 부분도
    // 동일한 depth로 return 하는 것으로 수정해주세요.

    // 게시글이 존재하는 경우
    return res.status(200).success({
      message: "게시글 조회 성공",
      article,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 생성
export const createArticle = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
    // 사용자 인증 검증
    const { communityId } = req.params; // URL에서 communityId 추출
    const { title, content, isAnonymous } = req.body; // Request body에서 title, content 추출
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    // 업로드된 파일 정보 추출
    const uploadedFiles = req.files?.article_images || [];
    const imagePaths = uploadedFiles.map((file) => file.path); // 로컬 저장된 파일 경로

    // 게시글 생성
    // 현재는 response에 article을 넣지 않지만,
    // 추후에 넣을 상황이 생길 수도 있는 것을 고려해 article을 반환 받는 식으로 작성
    const article = await articleCrudService.createArticle({
      communityId,
      authorId,
      title,
      content,
      isAnonymous,
      imagePaths,
    });

    // TODO: 사진 업로드 안 되었을 시 적용할 transaction 처리

    // 이미지 파일 처리
    if (req.files && req.files.images) {
      // 필드명은 uploader.js와 통일
      const imageFiles = req.files.images;

      const imageRecords = imageFiles.map((image) => ({
        articleId: article.articleId, // 게시글 ID와 연계
        imageUrl: image.location, // 업로드된 이미지의 URL (로컬 또는 S3 경로)
        sequence: 0, // 이미지 순서 (0부터 시작)
      }));

      // 이미지 업로드
      await articleCrudService.createArticleImages(imageRecords); // 이미지 데이터를 DB에 저장
    }

    return res.status(201).success({
      message: "게시글 작성 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 수정
export const updateArticle = async (req, res, next) => {
  // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
  // 사용자 인증 검증
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    const { title, content } = req.body; // Request body에서 title, content 추출
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    const article = await articleCrudService.updateArticle({
      communityId,
      articleId,
      authorId,
      title,
      content,
    }); // 게시글 수정 (현재는 response에 article을 넣지 않지만, 추후에 넣을 상황이 생길 수도 있는 것을 고려해 article을 반환 받는 식으로 작성)

    return res.status(200).success({
      message: "게시글 수정 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 삭제
export const deleteArticle = async (req, res, next) => {
  // 사용자 인증 검증 필요
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출

    await articleCrudService.deleteArticle({
      communityId,
      articleId,
      authorId,
    }); // 게시글 삭제

    return res.status(200).success({
      message: "게시글 삭제 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};
