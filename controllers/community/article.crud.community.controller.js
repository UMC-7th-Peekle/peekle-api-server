// Description: 게시글 관련 조회, 생성, 수정, 삭제와 관련된 컨트롤러 파일입니다.
import * as articleCrudService from "../../services/community/article.crud.community.service.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

// 게시판 생성
export const createCommunity = async (req, res, next) => {
  try {
    await articleCrudService.createCommunity(req.body); // 게시판 생성

    return res.status(201).success({
      message: "게시판 생성 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 조회
export const getArticleById = async (req, res, next) => {
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출

    const article = await articleCrudService.getArticleById({
      communityId,
      articleId,
    }); // 게시글 조회

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
    const { title, content, isAnonymous } = JSON.parse(req.body.data); // Request body에서 title, content 추출
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출

    // 업로드된 파일 정보 추출
    const uploadedFiles = req.files?.article_images || [];

    // 게시글 생성
    await articleCrudService.createArticle({
      communityId,
      authorId,
      title,
      content,
      isAnonymous,
      imagePaths: parseImagePaths(uploadedFiles),
    });

    // TODO: 사진 업로드 안 되었을 시 적용할 transaction 처리
    // + 현재는 검증되지 않은 이미지도 로컬 (나중엔 S3 겠죠?) 에 업로드 되는 문제 발생

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
    const {
      title,
      content,
      isAnonymous,
      existingImageSequence,
      newImageSequence,
    } = JSON.parse(req.body.data); // Request body에서 title, content 추출
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    if (!title && !content && !req.files) {
      logger.error("[updateArticle] 수정할 내용이 없습니다.");
      throw new InvalidInputError("수정할 내용이 없습니다.");
    }

    // 업로드된 파일 정보 추출
    const uploadedFiles = req.files?.article_images || [];

    const article = await articleCrudService.updateArticle({
      communityId,
      articleId,
      authorId,
      title,
      content,
      isAnonymous,
      existingImageSequence,
      newImageSequence,
      imagePaths: parseImagePaths(uploadedFiles),
    });
    // 게시글 수정
    // 현재는 response에 article을 넣지 않지만,
    // 추후에 넣을 상황이 생길 수도 있는 것을 고려해
    // article을 반환 받는 식으로 작성

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
    const { communityId, articleId } = req.body; // URL에서 communityId, articleId 추출
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
