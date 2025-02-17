import * as crudService from "../../services/peekling/crud.peekling.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

export const createPeekling = async (req, res, next) => {
  try {
    // 멤버 (min, max) → 날짜+시간 → 위치 →  카테고리 (1개만 가능) →
    // 제목 (20자) → 소개 (1000자) → 사진 첨부 (최대 5장)

    // const {
    //   minPeople, maxPeople, schedule, location, categoryId, title, description, photos
    // } = req.body;

    const peeklingData = JSON.parse(req.body.data);
    const uploadedFiles = req.files?.peekling_images || [];
    peeklingData.imagePaths = parseImagePaths(uploadedFiles);
    peeklingData.userId = req.user.userId;

    await crudService.createPeekling(peeklingData);

    return res.status(201).success({
      message: "피클링이 생성되었습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getPeeklings = async (req, res, next) => {
  try {
    // query의 종류에는 검색어, 카테고리

    const { query, categoryId } = req.query;
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getPeeklingDetails = async (req, res, next) => {
  try {
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const tempSavePeekling = async (req, res, next) => {
  try {
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const cancelPeekling = async (req, res, next) => {
  try {
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const leavePeekling = async (req, res, next) => {
  try {
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const joinPeekling = async (req, res, next) => {
  try {
  } catch (err) {
    logError(err);
    next(err);
  }
};
