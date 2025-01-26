import models from "../../models/index.js";

// 카테고리 조회
export const eventCategory = async () => {
  try {
    const category = await models.EventCategory.findAll({
      attributes: ["categoryId", "name", "description"],
    });

    return category;
  } catch (error) {
    throw error;
  }
};

export const eventLocation = async () => {
  try {
    const location = await models.EventLocationGroups.findAll({
      attributes: ["groupId", "name"],
    });

    return location;
  } catch (error) {
    throw error;
  }
};
