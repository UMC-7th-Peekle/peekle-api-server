import db from "../../models/index.js";

export const detailEvent = async (eventId) => {
  // eventId가 유효하지 않은 경우 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  const detail = await db.Events.findOne({
    where: { eventId: eventId },
    
    attributes: { exclude: [ 'categoryId', 'createdUserId'] },
    include: [
      {
        model: db.EventCategory,
        as: 'category',
        attributes: ['name', 'description'],
      },
      {
        model: db.EventImages,
        as: 'eventImages',
        attributes: [
          'imageUrl',
          'sequence',
          'createdAt',
          'updatedAt'
        ],
      },
      {
        model: db.EventSchedules,
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