import models from "../../models/index.js";
import {
  AlreadyExistsError,
  NotAllowedError,
  NotExistsError,
} from "../../utils/errors/errors.js";

export const getAllPermissions = async () => {
  return await models.Permissions.findAll({});
};

export const getAllRoles = async () => {
  return await models.Roles.findAll({});
};

export const assignRoleToUser = async ({ userId, roleId }) => {
  try {
    await models.UserRoles.create({
      userId,
      roleId,
    });
  } catch (err) {
    if (err instanceof models.Sequelize.UniqueConstraintError) {
      throw new AlreadyExistsError("이미 사용자에게 할당된 Role 입니다.");
    }
    throw err;
  }
};

export const getUserRoles = async ({ userId }) => {
  return await models.UserRoles.findAll({
    where: {
      userId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: {
      model: models.Users,
      as: "user",
    },
  });
};

export const deleteRoleFromUser = async ({ userId, roleId }) => {
  if (userId == 1 && roleId == 1) {
    throw new NotAllowedError(
      "Before Production, User with id #1 is the ONLY admin:super"
    );
  }
  const affectedRow = await models.UserRoles.destroy({
    where: {
      userId,
      roleId,
    },
  });

  if (affectedRow === 0) {
    throw new NotExistsError("존재하지 않는 사용자이거나 Role 입니다.");
  }
};

/**
 * Parent Role Id와 Permission Id 값들은 string들의 배열로 담으면 됩니다.
 * ex) ["1", "2"]
 */
export const createRole = async ({
  name,
  description,
  parentRoleIds = null, // Nullable
  permissionIds, // Not Nullable
}) => {
  const transaction = await models.sequelize.transaction();

  try {
    const newRole = await models.Roles.create(
      {
        name,
        description,
      },
      { transaction }
    );

    if (parentRoleIds) {
      const roleHierarchyData = parentRoleIds.map((roleId) => {
        return {
          parentRoleId: roleId,
          childRoleId: newRole.roleId,
        };
      });

      await models.RoleHierarchy.bulkCreate(roleHierarchyData, { transaction });
    }

    const rolePermissionData = permissionIds.map((permId) => {
      return {
        roleId: newRole.roleId,
        permissionId: permId,
      };
    });
    await models.RolePermissions.bulkCreate(rolePermissionData, {
      transaction,
    });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
