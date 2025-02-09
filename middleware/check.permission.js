import { Op } from "sequelize";
import models from "../models/index.js";
import {
  LackPermissionError,
  UnauthorizedError,
} from "../utils/errors/errors.js";
import logger from "../utils/logger/logger.js";

export const checkPermission = (permission) => {
  return async (req, res, next) => {
    if (!req?.user?.userId) {
      logger.debug("인증 정보가 제공되지 않았습니다.");
      return next(new UnauthorizedError("인증 정보가 제공되지 않았습니다."));
    }

    const result = await checkUserPermissions({
      userId: req.user.userId,
      permission: permission,
    });

    if (!result) {
      logger.debug("권한이 없습니다.");
      return next(new LackPermissionError("권한이 없습니다."));
    }

    return next();
  };
};

const checkUserPermissions = async ({ userId, permission }) => {
  const userRoles = await models.UserRoles.findAll({
    where: {
      userId: userId,
    },
  });

  const recursivelyFindPermissions = async ({ roleId, permission }) => {
    const roles = await models.Roles.findByPk(roleId, {
      include: [
        // 해당 사용자가 가지고 있는 role이 가지고 있는 permission을 찾음
        {
          model: models.Permissions,
          as: "permissionIdPermissions",
          through: { model: models.RolePermissions },
          where: { name: permission },
          required: false,
        },
        // 해당 사용자의 parent role을 찾고 끝낸다.
        {
          model: models.Roles,
          through: { model: models.RoleHierarchy },
          as: "parentRoleIdRoles", // 본인의 부모 역할을 찾습니다
          required: false,
        },
      ],
    });

    // console.log(roles.dataValues);

    if (roles.permissionIdPermissions.length > 0) {
      // console.log("IF 1 :", roles.permissionIdPermissions);
      return true;
    } else {
      for (const parentRole of roles.parentRoleIdRoles) {
        const found = await recursivelyFindPermissions({
          roleId: parentRole.roleId,
          permission,
        });
        if (found) return true;
      }
    }
  };

  for (const role of userRoles) {
    const result = await recursivelyFindPermissions({
      roleId: role.roleId,
      permission,
    });
    if (result) return true;
  }

  return false;
};

/*
    1. UserRoles에서 사용자의 역할들을 모두 찾는다
    2. 해당 role의 permission과, RoleHierarchy를 통해 알 수 있는 parent role의 permission을 살펴본다
    3. 존재하면 true 아니면 fasle
    4. 이 코드 그대로 재귀로 조져야 함 원래
    5. 하지만 귀찮고 에러가 너무 짜증나져서 우선 1 depth만 허용하는 것으로 함.
    6. 우리 서비스에서 2 depth 사용하는 것은 현재 community -> article -> comment 임
    
    parent Role이 가지고 있는 권한은 child Role 또한 가지고 있음.
    그렇다면 우리는 나의 parent role이 가지고 있는 

    1. 해당 사용자가 가지고 있는 role들을 살펴본다. 해당 role이 내가 찾는 permission을 가지고 있는지 본다.
    2. 없다면, 해당 사용자가 가지고 있는 role들의 parent를 본다. 해당 parent가 내가 찾는 permission을 가지고 있는지 본다.
    .
  */

// TODO : 단일 레벨의 부모만을 고려함
// const userRoles = await models.UserRoles.findOne({
//   where: { userId: userId },
//   include: [
//     {
//       model: models.Roles,
//       as: "role",
//       required: true,
//       include: [
//         // 해당 사용자가 가지고 있는 role이 가지고 있는 permission을 찾음
//         {
//           model: models.Permissions,
//           as: "permissionIdPermissions",
//           through: { model: models.RolePermissions },
//           where: { name: permission },
//           required: false,
//         },
//         // 해당 사용자의 parent role을 찾고 끝낸다.
//         {
//           model: models.Roles,
//           through: { model: models.RoleHierarchy },
//           as: "parentRoleIdRoles", // 본인의 부모 역할을 찾습니다
//           required: false,
//         },
//       ],
//     },
//   ],
// });
