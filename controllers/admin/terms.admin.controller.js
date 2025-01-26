// Description: 약관 관리를 담당하는 컨트롤러 파일입니다.
import * as termService from "../../services/admin/terms.admin.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 약관 내용 수정
export const updateTerm = async (req, res, next) => {
  // TODO: 형식 검증
  // TODO: 관리자 검증
  try {
    const { termId } = req.params; // URL에서 termid 추출
    const { title, content, isRequired, status, version } = req.body; // Request body에서 content 추출

    await termService.updateTerm({
      termId,
      title,
      content,
      isRequired,
      status,
      version,
    }); // 약관 내용 수정

    logger.debug("약관 수정", {
      action: "terms:updateTerm",
      actionType: "success",
      termId,
    });

    return res.status(200).success({
      message: "약관 내용 수정 성공",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 약관 삭제
export const deleteTerm = async (req, res, next) => {
  // TODO: 관리자 검증
  try {
    const { termId } = req.params; // URL에서 termid 추출

    await termService.deleteTerm({ termId }); // 약관 삭제

    logger.debug("약관 삭제", {
      action: "terms:deleteTerm",
      actionType: "success",
      termId,
    });

    return res.status(200).success({
      message: "약관 삭제 성공",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 약관 생성
export const createTerm = async (req, res, next) => {
  // TODO: 형식 검증
  // TODO: 관리자 검증
  try {
    const { title, content, isRequired, status, version } = req.body; // Request body에서 content 추출

    await termService.createTerm({
      title,
      content,
      isRequired,
      status,
      version,
    }); // 약관 생성

    logger.debug("약관 생성", {
      action: "terms:createTerm",
      actionType: "success",
    });

    return res.status(201).success({
      message: "약관 생성 성공",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 약관 내용 조회
export const getTermById = async (req, res, next) => {
  // TODO: 관리자 검증
  try {
    const { termId } = req.params; // URL에서 termid 추출

    const { term } = await termService.getTermById({ termId }); // 약관 내용 조회

    logger.debug("약관 조회", {
      action: "terms:getTermById",
      actionType: "success",
      termId,
    });

    return res.status(200).success({
      message: "약관 내용 조회 성공",
      term,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 약관 목록 조회
export const getTerms = async (req, res, next) => {
  // TODO: 관리자 검증
  try {
    const { terms } = await termService.getTerms(); // 약관 목록 조회

    // 생성된 약관이 없는 경우
    if (terms && terms.length === 0) {
      return res.status(204).success({
        message: "생성된 약관이 없습니다",
      });
    }

    logger.debug("약관 목록 조회", {
      action: "terms:getTerms",
      actionType: "success",
      termsCount: terms.length,
    });

    return res.status(200).success({
      message: "약관 목록 조회 성공",
      terms,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
