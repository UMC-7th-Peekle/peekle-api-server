import models from "../../models/index.js";
import {
  NotExistsError,
  NotAllowedError
} from "../../utils/errors/errors.js";

export const detailEvent = async (eventId) => {
  // eventId가 유효하지 않은 경우 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  const detail = await models.Events.findOne({
    where: { eventId: eventId },
    
    attributes: { exclude: [ 'categoryId', 'createdUserId'] },
    include: [
      {
        model: models.EventCategory,
        as: 'category',
        attributes: ['name', 'description'],
      },
      {
        model: models.EventImages,
        as: 'eventImages',
        attributes: [
          'imageUrl',
          'sequence',
          'createdAt',
          'updatedAt'
        ],
      },
      {
        model: models.EventSchedules,
        as: 'eventSchedules',
        attributes: [
          'repeatType',
          'repeatEndDate',
          'isAllDay',
          'customText',
          'startDate',
          'endDate',
          'startTime',
          'endTime'
        ]
      }
    ],

  });

  return detail;
};

// 이벤트 내용 수정
export const updateEvent = async (eventId, userId, updateData) => {
  try {
    const event = await models.Events.findOne({ where: { eventId } });

    if (!event) {
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    if (event.createdUserId.toString() !== userId) {
      throw new NotAllowedError("본인이 작성하지 않은 게시글을 수정할 수 없습니다.");
    }

    // 필요한 필드만 업데이트
    Object.assign(event, updateData);

    await event.save();

    return event;
  } catch (error) {
    throw error;
  }
};