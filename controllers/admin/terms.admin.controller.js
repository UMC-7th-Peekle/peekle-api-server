// Description: 약관 관리를 담당하는 컨트롤러 파일입니다.
import * as termsService from "../../services/admin/terms.admin.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 약관 내용 수정
export const updateTerms = async (req, res, next) => {
  try {
    const { termsId } = req.params; // URL에서 termsid 추출
    const { title, content, isRequired, status, version } = req.body; // Request body에서 content 추출

    await termsService.updateTerms({
      termsId,
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
export const deleteTerms = async (req, res, next) => {
  try {
    const { termsId } = req.params; // URL에서 termsid 추출

    await termsService.deleteTerms({ termsId }); // 약관 삭제

    return res.staus(200).success({
      message: "약관 삭제 성공",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 약관 생성
export const createTerms = async (req, res, next) => {
  try {
    const { title, content, isRequired, status, version } = req.body; // Request body에서 content 추출

    await termsService.createTerms({
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
