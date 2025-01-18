import models from "../../models/index.js";

const PROFILE_IMAGE_DEFAULT = "sample.jpg";

export const register = async (data) => {
  const newUserData = {
    name: data.name,
    nickname: data.nickname,
    birthdate: data.birthdate,
    gender: data.gender,
    phone: data.phone,
    email: data.email,
    profileImage: data.profileImage || PROFILE_IMAGE_DEFAULT,
  };

  const newUser = await models.Users.create(newUserData);

  await models.UserTerms.bulkCreate(
    data.terms.map((term) => ({
      termId: term.termId,
      isAgreed: term.isAgreed,
      userId: newUser.userId,
    }))
  );

  return;
};
