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
}) => {};

/**
 * termId에 해당하는 약관을 삭제합니다.
 */
export const deleteTerm = async ({ termId }) => {};

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
