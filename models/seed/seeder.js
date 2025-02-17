import logger from "../../utils/logger/logger.js";
import models from "../index.js";

/*
  // truncate: true,
  // cascade: true,
  // force: true,

  truncate를 해야만 auto-increment가 초기화됨.
*/
import { groups, terms, gacha } from "./data.js";

export const seedEventLocationGroup = async () => {
  try {
    await models.Events.destroy({
      where: {},
    });
    await models.EventLocationGroups.destroy({
      where: {},
    });
    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE event_location_groups;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.EventLocationGroups.bulkCreate(
      groups.map((group) => ({ name: group }))
    );
    logger.warn("[Seeding] EventLocationGroups Seeding", {
      action: "seed:eventLocationGroups",
    });
  } catch (error) {
    throw error;
  }
};

export const seedTerms = async () => {
  try {
    await models.Terms.destroy({
      where: {},
    });
    await models.UserTerms.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE terms;");
    await models.sequelize.query("TRUNCATE TABLE user_terms;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.Terms.bulkCreate(terms, { logging: false });

    const users = await models.Users.findAll({
      attributes: ["userId"],
    });

    const userTerms = [];
    users.forEach((user) => {
      terms.forEach((term, idx) => {
        let isAgreed = gacha(50);
        if (term.isRequired) {
          isAgreed = true;
        }
        userTerms.push({
          userId: user.userId,
          termId: idx + 1,
          isAgreed,
        });
      });
    });
    await models.UserTerms.bulkCreate(userTerms, { logging: false });

    logger.warn("Terms에 대한 Seeding이 실행되었습니다.", {
      action: "seed:terms",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};
