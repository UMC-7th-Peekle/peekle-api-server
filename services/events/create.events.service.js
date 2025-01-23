/**
 * 400 : 데이터가 누락된 경우 (게시글 제목, 게시글 내용)
 * 401 : 인증 정보가 제공되지 않았습니다.
 */

import {
  AlreadyExistsError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import { Sequelize } from "sequelize";

// 새로운 이벤트 생성
export const newEvent = async (userId, eventData) => {
  const {
    title,
    content,
    price,
    categoryId,
    location,
    eventUrl,
    createdUserId = userId,
    applicationStart,
    applicationEnd,
    schedules,
    // eventImage,    // 일단 이미지 처리는 너무 복잡할 것 같아서 후순위..
  } = eventData;

  // 게시글 제목, 게시글 내용 누락 400
  if (!title || !content) {
    throw new Error("게시글 제목 또는 내용이 누락되었습니다.");
  }

  // schedules랑 image는 조인해서 가져와야 합니다.
  try {
    const event = await models.Events.create({

    });
  } catch(error) {

  }
};
