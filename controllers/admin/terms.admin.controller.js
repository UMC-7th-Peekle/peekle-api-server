// Description: 약관 관리를 담당하는 컨트롤러 파일입니다.
import * as termService from "../../services/admin/terms.admin.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

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

    return res.status(201).success({
      message: "약관 생성 성공",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 약관 내용 조회
export const getTerm = async (req, res, next) => {
  // TODO: 관리자 검증
  try {
    const { termId } = req.params; // URL에서 termid 추출

    const term = await termService.getTerm({ termId }); // 약관 내용 조회

    return res.status(200).success({
      message: "약관 내용 조회 성공",
      term,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};