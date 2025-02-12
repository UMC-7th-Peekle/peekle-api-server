// import axios from "axios"; // http 요청 보내기(프로미스 기반으로 비동기 작업을 처리)
import models from "../../models/index.js";
import {
  NotExistsError,
  NotAllowedError,
  InvalidInputError,
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import {
  addBaseUrl,
  deleteLocalFile,
  isEditInputCorrect,
} from "../../utils/upload/uploader.object.js";
// import config from "../../config.js";

// // 네이버 API URL
// const NAVER_ADDRESS_URL =
//   "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";

// // 키
// const NAVER_CLIENT_ID = config.NAVER.VITE_NAVER_MAP_CLIENT_ID;
// const NAVER_CLIENT_SECRET = config.NAVER.VITE_NAVER_MAP_CLIENT_SECRET;

// // 주소로 위치 좌표 알기
// const getLocationFromAddress = async (eventId) => {
//   try {
//     const event = await models.Events.findByPk(eventId, {
//       attributes: ["detailAddress"], // detailAddress 가져오기
//     });

//     if (!event || !event.detailAddress) {
//       throw new InvalidInputError(
//         "해당 이벤트의 상세 주소가 존재하지 않습니다."
//       );
//     }

//     // axios.get(): 외부 API에 get 요청..
//     const location = await axios.get(NAVER_ADDRESS_URL, {
//       params: { query: event.detailAddress }, // 이벤트 상세 주소로 위치 좌표 (URL 뒤에 쿼리로 붙음)
//       headers: {
//         "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID, // API 키 헤더
//         "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
//       }, // 요청 키 (ID랑 KEY 두 개로 나눈 이유....?)
//       // =>  API 키 관리 및 보안을 강화하려고 그랬대
//     });

//     if (location.data.addresses.length === 0) {
//       throw new InvalidInputError("주소에 해당하는 좌표를 찾을 수 없습니다.");
//     }

//     const { x, y } = location.data.addresses[0]; // 좌표 가져오기
//     return { latitude: parseFloat(y), longitude: parseFloat(x) };
//   } catch (error) {
//     console.error("주소 검색 실패:", error);
//     throw new InvalidInputError("주소 검색에 실패했습니다.");
//   }
// };

// // 전체적으로 이제 좌표랑 장소명 반환
// const getLocationFromEventId = async (eventId) => {
//   const { latitude, longitude } = await getLocationFromAddress(eventId);

//   return { position: { latitude, longitude } };
// };

export const detailEvent = async ({ eventId }) => {
  // eventId가 유효하지 않은 경우 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  // // 주소로 위치 가져오기
  // const { position } = await getLocationFromEventId(eventId);
  // const { latitude, longitude } = position;

  // const isExistLocation = await models.EventLocation.findOne({
  //   where: {
  //     eventId,
  //     position: models.Sequelize.fn(
  //       "ST_GeomFromText",
  //       `POINT(${longitude} ${latitude})`
  //     ),
  //   },
  // });

  // if (!isExistLocation) {
  //   // 중복되지 않으면 새로운 위치 데이터 삽입
  //   await models.EventLocation.create({
  //     eventId,
  //     position: models.Sequelize.fn(
  //       "ST_GeomFromText",
  //       `POINT(${longitude} ${latitude})`
  //     ),
  //   });
  // }

  const data = await models.Events.findOne({
    where: { eventId: eventId },

    attributes: { exclude: ["categoryId", "createdUserId"] },
    include: [
      {
        model: models.EventCategory,
        as: "category",
        attributes: ["name", "description"],
      },
      {
        model: models.EventImages,
        as: "eventImages",
        attributes: ["imageUrl", "sequence"],
      },
      {
        model: models.EventSchedules,
        as: "eventSchedules",
        attributes: [
          "repeatType",
          "repeatEndDate",
          "isAllDay",
          "customText",
          "startDate",
          "endDate",
          "startTime",
          "endTime",
        ],
      },
      // 상세 주소 관련 위치 및 장소명
      {
        model: models.EventLocation,
        as: "eventLocation",
        attributes: ["position"],
      },
    ],
  });

  if (!data) {
    logger.warn("존재하지 않는 이벤트에 대한 조회 요청입니다.", {
      action: "event:getDetail",
      actionType: "error",
      data: {
        eventId,
      },
    });
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }

  const transformedImages = data.eventImages.map((image) => ({
    imageUrl: addBaseUrl(image.imageUrl),
    sequence: image.sequence,
  }));

  return { ...data.dataValues, eventImages: transformedImages };
};

// 이벤트 내용 수정
export const updateEvent = async ({ eventId, userId, updateData }) => {
  try {
    const event = await models.Events.findByPk(eventId);

    // 해당 이벤트가 존재하지 않는 경우
    if (!event) {
      logger.warn({
        action: "event:update",
        actionType: "error",
        message: "존재하지 않는 이벤트에 대한 수정 요청입니다.",
        userId: userId,
        data: updateData,
      });
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    // 작성자가 수정을 요청한게 아닌 경우
    if (event.createdUserId.toString() !== userId) {
      logger.error({
        action: "event:update",
        actionType: "error",
        message: "타인이 작성한 글에 대한 수정 요청",
        data: {
          authorId: event.createdUserId,
          requestedUserId: userId,
          requestedData: updateData,
        },
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 게시글을 수정할 수 없습니다."
      );
    }

    await event.update(updateData);

    logger.debug({
      action: "event:update",
      actionType: "sucess",
      message: "이벤트 수정 완료",
      data: {
        requestedUserId: userId,
        updatedData: updateData,
      },
    });

    // 이미지가 새로 들어온 경우에만 처리
    if (updateData.imagePaths.length > 0) {
      // DB에서 기존 이미지 경로 가져오기
      const existingImages = await models.EventImages.findAll({
        where: { eventId },
        attributes: ["imageId", "imageUrl", "sequence"],
      });

      logger.silly({
        action: "event:image:getCurrent",
        actionType: "log",
        data: {
          requestedUserId: userId,
          existingImages,
        },
      });

      // 사용자가 보낸 이미지 순서가 이상한지 확인
      isEditInputCorrect({
        existingImageSequence: updateData.existingImageSequence,
        newImageSequence: updateData.newImageSequence,
        existingImagesLength: existingImages.length,
        newImageLength: updateData.imagePaths.length,
      });

      // 기존 이미지 순서 변경
      updateData.existingImageSequence.map(async (seq, idx) => {
        if (seq === -1) {
          // 삭제할 이미지
          logger.silly({
            action: "event:image:update:delete",
            actionType: "log",
            data: {
              requestedUserId: userId,
              imageId: existingImages[idx].imageId,
              originalSequence: idx + 1,
              newSequence: seq,
            },
          });
          await existingImages[idx].destroy();
          await deleteLocalFile(existingImages[idx].imageUrl);
        } else {
          // 이미지 순서 변경
          logger.silly({
            action: "event:image:update:modify",
            actionType: "log",
            data: {
              requestedUserId: userId,
              imageId: existingImages[idx].imageId,
              originalSequence: existingImages[idx].sequence,
              newSequence: seq,
            },
          });
          await existingImages[idx].update({ sequence: seq });
        }
      });

      // 새로 추가된 이미지
      updateData.newImageSequence.map(async (seq, idx) => {
        logger.silly({
          action: "event:image:update:create",
          actionType: "log",
          data: {
            requestedUserId: userId,
            imageUrl: updateData.imagePaths[idx],
            newSequence: seq,
          },
        });
        await models.EventImages.create({
          eventId,
          imageUrl: updateData.imagePaths[idx],
          sequence: seq,
        });
      });

      logger.debug({
        action: "event:image:update",
        actionType: "success",
        message: "이미지 업데이트 완료",
        data: {
          requestedUserId: userId,
          updatedData: updateData,
        },
      });
    }

    return { event };
  } catch (error) {
    throw error;
  }
};

// 이벤트 삭제
export const deleteEvent = async ({ eventId, userId }) => {
  try {
    const event = await models.Events.findByPk(eventId, {
      include: [
        {
          model: models.EventImages,
          as: "eventImages",
          attributes: ["imageId", "imageUrl"],
        },
      ],
    });

    if (!event) {
      logger.warn({
        action: "event:delete",
        actionType: "error",
        message: "존재하지 않는 이벤트에 대한 삭제 요청입니다.",
        userId: userId,
      });
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    if (event.createdUserId.toString() !== userId) {
      logger.warn({
        action: "event:delete",
        actionType: "error",
        message: "권한이 없는 이벤트에 대한 삭제 요청입니다.",
        data: {
          authorId: event.createdUserId,
          requestedUserId: userId,
        },
      });
      throw new NotAllowedError("이벤트 삭제 권한이 없습니다.");
    }

    // 로컬 파일 삭제
    const deletePromises = event.eventImages.map((img) =>
      deleteLocalFile(img.imageUrl)
    );

    // 모든 파일 삭제 완료 대기
    // because, deletePromises 안에 있는 비동기 작업들을
    // await을 걸어서 처리하지 않았기에
    await Promise.all(deletePromises);

    await event.destroy();

    logger.debug({
      action: "event:delete",
      actionType: "success",
      message: "이벤트 삭제 완료",
      data: {
        requestedUserId: userId,
        eventId,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};
