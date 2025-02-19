import logger from "../../utils/logger/logger.js";
import models from "../index.js";

import { userSample } from "./data.js";

export const seedUsers = async () => {
  try {
    await models.Users.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE users;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.Users.bulkCreate(userSample, { logging: false });
  } catch (err) {
    throw err;
  }
};

export const seedPermissions = async () => {
  await models.UserRoles.destroy({
    where: {},
  });
  await models.RolePermissions.destroy({
    where: {},
  });
  await models.Roles.destroy({
    where: {},
  });
  await models.RoleHierarchy.destroy({
    where: {},
  });
  await models.Permissions.destroy({
    where: {},
  });

  await models.sequelize.query("SET foreign_key_checks = 0;");
  await models.sequelize.query("TRUNCATE TABLE permissions;");
  await models.sequelize.query("TRUNCATE TABLE roles;");
  await models.sequelize.query("TRUNCATE TABLE role_permissions;");
  await models.sequelize.query("TRUNCATE TABLE role_hierarchy;");
  await models.sequelize.query("TRUNCATE TABLE user_roles;");
  await models.sequelize.query("SET foreign_key_checks = 1;");

  const permissions = [
    { permissionId: 1, name: "admin:super", description: "최고 관리자 권한" },
    { permissionId: 2, name: "admin:user", description: "사용자 관리 권한" },
    { permissionId: 3, name: "admin:ticket", description: "티켓 관리 권한" },
    { permissionId: 4, name: "admin:event", description: "이벤트 관리 권한" },
    {
      permissionId: 5,
      name: "admin:community",
      description: "커뮤니티 관리 권한",
    },
    { permissionId: 6, name: "admin:article", description: "게시글 관리 권한" },
    { permissionId: 7, name: "admin:comment", description: "댓글 관리 권한" },
    { permissionId: 8, name: "ticket:admin", description: "티켓 관리 권한" },
    { permissionId: 9, name: "user:admin", description: "사용자 관리 권한" },
    { permissionId: 10, name: "event:admin", description: "이벤트 관리 권한" },
    {
      permissionId: 11,
      name: "community:admin",
      description: "커뮤니티 관리 권한",
    },
    {
      permissionId: 12,
      name: "article:admin",
      description: "게시글 관리 권한",
    },
    { permissionId: 13, name: "comment:admin", description: "댓글 관리 권한" },
  ];

  const roles = [
    { roleId: 1, name: "admin:super", description: "최고 관리자 역할" },
    { roleId: 2, name: "admin:user", description: "사용자 관리자 역할" },
    { roleId: 3, name: "admin:ticket", description: "티켓 관리자 역할" },
    { roleId: 4, name: "admin:event", description: "이벤트 관리자 역할" },
    { roleId: 5, name: "admin:community", description: "커뮤니티 관리자 역할" },
    { roleId: 6, name: "admin:article", description: "게시글 관리자 역할" },
    { roleId: 7, name: "admin:comment", description: "댓글 관리자 역할" },
  ];

  const rolePermissions = [
    { roleId: 1, permissionId: 1 },
    { roleId: 2, permissionId: 9 },
    { roleId: 3, permissionId: 8 },
    { roleId: 4, permissionId: 10 },
    { roleId: 5, permissionId: 11 },
    { roleId: 6, permissionId: 12 },
    { roleId: 7, permissionId: 13 },
  ];

  const roleHierarchy = [
    { parentRoleId: 2, childRoleId: 1 },
    { parentRoleId: 3, childRoleId: 1 },
    { parentRoleId: 4, childRoleId: 1 },
    { parentRoleId: 5, childRoleId: 1 },
    { parentRoleId: 6, childRoleId: 5 },
    { parentRoleId: 7, childRoleId: 6 },
  ];

  // bulkCreate 예시
  await models.Permissions.bulkCreate(permissions, { logging: false });
  await models.Roles.bulkCreate(roles, { logging: false });
  await models.RoleHierarchy.bulkCreate(roleHierarchy, { logging: false });
  await models.RolePermissions.bulkCreate(rolePermissions, { logging: false });

  logger.warn("Permissions에 대한 Seeding이 실행되었습니다.", {
    action: "seed:permissions",
    actionType: "success",
  });

  return;
};
