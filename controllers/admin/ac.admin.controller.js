import * as acService from "../../services/admin/ac.admin.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const getPermissions = async (req, res, next) => {
  try {
    const ret = await acService.getAllPermissions();

    return res.status(200).success({
      message: "존재하는 모든 권한을 가져왔습니다.",
      permissions: ret,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getRoles = async (req, res, next) => {
  try {
    const ret = await acService.getAllRoles();

    return res.status(200).success({
      message: "존재하는 모든 Role 들을 가져왔습니다.",
      roles: ret,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const assignRoleToUser = async (req, res, next) => {
  try {
    // { userId, roleId }
    await acService.assignRoleToUser(req.body);

    return res.status(200).success({
      message: "Role을 사용자에게 할당했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getUserRoles = async (req, res, next) => {
  try {
    const userRoles = await acService.getUserRoles(req.body);

    return res.status(200).success({
      userRoles,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const deleteRoleFromUser = async (req, res, next) => {
  try {
    // { userId, roleId }
    await acService.deleteRoleFromUser(req.body);

    return res.status(200).success({
      message: "Role을 사용자에게서 제거하였습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const createRole = async (req, res, next) => {
  try {
    /*
    {
      name,
      description,
      parentRoleIds = null, // Nullable
      permissionIds, // Not Nullable
    }
  */
    await acService.createRole(req.body);

    return res.status(200).success({
      message: "Role을 생성하였습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};
