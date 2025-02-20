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

    const data = await crudService.getPeeklingByQuery({
      query,
      categoryId,
    });

    return res.status(200).success({
      message: "피클링 목록을 가져왔습니다.",
      peeklings: data,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getPeeklingById = async (req, res, next) => {
  try {
    const data = await crudService.getPeeklingById({
      peeklingId: req.params.peeklingId,
    });

    return res.status(200).success({
      message: "Peekling을 가져왔습니다.",
      peekling: data,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const tempSavePeekling = async (req, res, next) => {
  try {
    await crudService.tempSavePeekling({
      peeklingId: req.body.peeklingId,
      userId: req.user.userId,
    });
    res.status(201).success({
      message: "피클링를 임시저장 하였습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const cancelPeekling = async (req, res, next) => {
  try {
    // TODO : 사용자 권한 체크 필요

    await crudService.cancelPeekling({
      peeklingId: req.body.peeklingId,
      reason: req.body.reason,
    });
    return res.status(200).success({
      message: `[${req.body.peeklingId}] 피클링을 취소 처리 하였습니다.`,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const joinPeekling = async (req, res, next) => {
  try {
    await crudService.joinPeekling({
      peeklingId: req.body.peeklingId,
      userId: req.user.userId,
    });

    return res.status(200).success({
      message: `피클링에 성공적으로 참여하였습니다. ${req.body.peeklingId} 로 socket join room 요청을 보내주세요.`,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const leavePeekling = async (req, res, next) => {
  try {
    await crudService.leavePeekling(req.body);

    return res.status(200).success({
      message: `피클링에서 성공적으로 나왔니다. ${req.body.peeklingId} 로 socket leave room 요청을 보내주세요.`,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const joinPeeklingChatroom = async (req, res, next) => {
  try {
    /*
      Peekling Chatroom ID는 Peekling ID와 일치함.
      그럼 존재 이유가 있나? 싶지만 .. 우선 분리해두도록 ..

      피클링 참여 시에 자동으로 채팅방은 참여처리되고,
      이 API는 자동 참여 후 나가기를 누른 사용자가 
      다시 들어올 수 있도록 하는 기능을 제공함.
    */
    await crudService.joinPeeklingChatroom({
      peeklingId: req.body.peeklingId,
      userId: req.user.userId,
    });

    return res.status(200).success({
      message: `${req.body.peelingId}에 ${req.user.userId}가 참여하였습니다.`,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const leavePeeklingChatroom = async (req, res, next) => {
  try {
    await crudService.leavePeeklingChatroom({
      peeklingId: req.body.peeklingId,
      userId: req.user.userId,
    });

    return res.status(200).success({
      message: `${req.body.peelingId}에 ${req.user.userId}가 나갔습니다.`,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};
