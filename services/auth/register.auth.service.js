import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
const { sequelize } = models;

const PROFILE_IMAGE_DEFAULT = "sample.jpg";

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
      email: data.email,
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

    await models.UserTerms.bulkCreate(
      data.terms.map((term) => ({
        termId: term.termId,
        isAgreed: term.isAgreed,
        userId: newUser.userId,
      })),
      { transaction }
    );

    // local과 다른 점
    await models.UserOauth.create({
      oauthId: data.oauthId,
      oauthType: data.oauthType,
      userId: newUser.userId,
    });

    await transaction.commit();
  } catch (error) {
    logger.debug(`[register] 에러가 발생하여 rollback을 실시합니다.`);
    await transaction.rollback();
    throw error;
  }

  return;
};
