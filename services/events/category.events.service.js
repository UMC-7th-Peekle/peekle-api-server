import models from "../../models/index.js";

// 카테고리 조회
export const eventCategory = async () => {
    try {
      const category = await models.EventCategory.findAll({
        attributes: ['categoryId', 'name', 'description']
      });

      return category;
    } catch (error) {
      throw error
    }
  };