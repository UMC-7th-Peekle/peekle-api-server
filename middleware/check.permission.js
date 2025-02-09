import models from "../models/index.js";
import {
  InvalidInputError,
  LackPermissionError,
  UnauthorizedError,
} from "../utils/errors/errors.js";
import logger from "../utils/logger/logger.js";

export const checkPermission = (permission) => {
  if (permission == "admin") {
    // 현재는 admin:super가 최고관리자 권한입니다.
    // 모든 권한을 전부 가지고 있는 슈퍼권한이라고 생각하시면 됩니다.
    // 나머지 권한에 대한 세분화는 추후에 진행할 예정입니다.

    return async (req, res, next) => {
      if (!req?.user?.userId) {
        logger.debug("인증 정보가 제공되지 않았습니다.");
        return next(new UnauthorizedError("인증 정보가 제공되지 않았습니다."));
      }

      const result = await checkUserPermissions({
        userId: req.user.userId,
        permission: "admin:super",
      });

      if (!result) {
        logger.debug("권한이 없습니다.");
        return next(new LackPermissionError("권한이 없습니다."));
      }

      return next();
    };
  } else if ((permission = "crudArticle")) {
    return async (req, res, next) => {
      next();
    };
  } else if ((permission = "crudEvent")) {
    return async (req, res, next) => {
      next();
    };
  } else {
    return async (req, res, next) => {
      return next(new InvalidInputError("잘못된 권한 확인 요청입니다."));
    };
  }
};

const checkUserPermissions = async ({ userId, permission }) => {
  // 1. user가 가진 role들을 찾고, 그 parent role까지 찾는다.
  // 2. role + parent role까지 포함했을 떄, 해당 role들이
  // 가지고 있는 permission들 중에 찾고자 하는
  // permission이 있는지 비교한다.

  const userRoles = await models.UserRoles.findAll({
    where: { userId: userId },
    include: [
      {
        model: models.Roles,
        as: "role",
        required: true,
        include: [
          // 1번째 include, parent role의 permission을 찾기
          {
            model: models.Roles,
            as: "parentRole",
            required: false,
            include: [
              {
                model: models.Permissions,
                as: "permissionIdPermissions",
                through: { model: models.RolePermissions },
                where: { name: permission },
                required: true,
              },
            ],
          },
          // 2번째 include, role의 permission을 찾기
          {
            model: models.Permissions,
            as: "permissionIdPermissions",
            through: { model: models.RolePermissions },
            where: { name: permission },
            required: false,
          },
        ],
      },
    ],
  });

  // console.log(userRoles[0]);
  // console.log("\n\n\n\n\n\n");
  // console.log(userRoles[0].role.parentRole);
  // console.log("\n\n\n\n\n\n");
  // console.log(userRoles[0].role.permissionIdPermissions);
  // console.log("\n\n\n\n\n\n");
  // console.log(
  //   userRoles[0].role.parentRole ||
  //     userRoles[0].role.permissionIdPermissions.length > 0
  // );
  return (
    userRoles[0].role.parentRole ||
    userRoles[0].role.permissionIdPermissions.length > 0
  );
};
