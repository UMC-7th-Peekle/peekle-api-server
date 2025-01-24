import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
const { sequelize } = models;

const PROFILE_IMAGE_DEFAULT = "default/peekle_default_profile_image.png";

export const register = async (data) => {
  // transaction 추가
  const transaction = await sequelize.transaction();

  try {
    const newUserData = {
      name: data.name,
      nickname: data.nickname,
      birthdate: data.birthdate,
      gender: data.gender,
      phone: data.phone,
      // email: data.email, // email 삭제 - PM 가라사대 필요없다!
      profileImage: data.profileImage || PROFILE_IMAGE_DEFAULT,
    };

    const newUser = await models.Users.create(newUserData, { transaction });

    await models.UserTerms.bulkCreate(
      data.terms.map((term) => ({
        termId: term.termId,
        isAgreed: term.isAgreed,
        userId: newUser.userId,
      })),
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    logger.debug(`[register] 에러가 발생하여 rollback을 실시합니다.`);
    await transaction.rollback();
    throw error;
  }

  return;
};

export const oauthRegister = async (data) => {
  // transaction 추가
  const transaction = await sequelize.transaction();

  try {
    const newUserData = {
      name: data.name,
      nickname: data.nickname,
      birthdate: data.birthdate,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      profileImage: data.profileImage || PROFILE_IMAGE_DEFAULT,
    };

    const newUser = await models.Users.create(newUserData, { transaction });
    logger.debug(`[oauthRegister] 새로운 사용자 생성: ${newUser.userId}`);

    await models.UserTerms.bulkCreate(
      data.terms.map((term) => ({
        termId: term.termId,
        isAgreed: term.isAgreed,
        userId: newUser.userId,
      })),
      { transaction }
    );
    logger.debug(`[oauthRegister] 약관 동의 정보 생성: ${newUser.userId}`);

    // local과 다른 점
    logger.debug(
      `[oauthRegister] OAuth 정보 생성: ${newUser.userId}, ${data.oauthId}, ${data.oauthType}`
    );
    const userOauth = await models.UserOauth.create(
      {
        userId: newUser.userId,
        oauthId: data.oauthId,
        oauthType: data.oauthType,
      },
      { transaction } // transaction 사용하는 경우 반드시 option으로 추가하기
    );
    logger.debug(
      `[oauthRegister] OAuth 정보 생성: ${newUser.userId}, ${userOauth.oauthId}`
    );

    await transaction.commit();
  } catch (error) {
    logger.debug(`[oauthRegister] 에러가 발생하여 rollback을 실시합니다.`);
    await transaction.rollback();
    throw error;
  }

  return;
};

export const getTerms = async () => {
  const terms = await models.Terms.findAll();

  return terms;
};
