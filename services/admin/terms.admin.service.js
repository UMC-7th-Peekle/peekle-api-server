// Description: 약관 관리를 담당하는 서비스 파일입니다.
import { NotExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";

/**
 * termId에 해당하는 약관을 수정합니다.
 */
export const updateTerm = async ({
  termId,
  title,
  content,
  isRequired,
  status,
  version,
}) => {
  // 약관 조회
  const term = await models.Terms.findOne({
    where: {
      termId,
    },
  });

  // 약관이 존재하지 않는 경우
  if (!term) {
    throw new NotExistsError("약관이 존재하지 않습니다");
  }

  // 약관 수정
  await term.update({
    title,
    content,
    isRequired,
    status,
    version,
  });

  return;
};

/**
 * termId에 해당하는 약관을 삭제합니다.
 */
export const deleteTerm = async ({ termId }) => {
  // 약관 검색
  const term = await models.Terms.findOne({
    where: {
      termId
    }
  });

  // 약관이 존재하지 않는 경우
  if (!term) {
    throw new NotExistsError("약관이 존재하지 않습니다");
  }

  await term.destroy();

  return;
};

/**
 * 약관을 생성합니다.
 */
export const createTerm = async ({
  title,
  content,
  isRequired,
  status,
  version,
}) => {
  await models.Terms.create({
    title,
    content,
    isRequired,
    status,
    version,
  });

  return;
};

/**
 * termId에 해당하는 약관을 조회합니다.
 */
export const getTerm = async ({ termId }) => {
  const term = await models.Terms.findOne({
    where: {
      termId,
    },
  });

  // 해당 약관이 없는 경우
  if(!term) {
    throw new NotExistsError("약관이 존재하지 않습니다");
  }

  return { term };
}