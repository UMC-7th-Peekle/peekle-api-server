import models from "../../models/index.js";

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