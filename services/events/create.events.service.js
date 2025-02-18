import axios from "axios";
import models from "../../models/index.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import config from "../../config.js";

// 네이버 API URL
const NAVER_ADDRESS_URL =
  "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
// 키
const NAVER_CLIENT_ID = config.NAVER.VITE_NAVER_MAP_CLIENT_ID;
const NAVER_CLIENT_SECRET = config.NAVER.VITE_NAVER_MAP_CLIENT_SECRET;

// 주소로 위치 좌표 알기
const getLocationFromAddress = async (detailAddress) => {
  try {
    const location = await axios.get(NAVER_ADDRESS_URL, {
      params: { query: detailAddress },
      headers: {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
      },
    });

    if (location.data.addresses.length === 0) {
      throw new InvalidInputError(
        `주소 (${detailAddress}) 에 해당하는 좌표를 찾을 수 없습니다.`
      );
    }

    const { x, y } = location.data.addresses[0]; // 좌표 가져오기
    return { latitude: parseFloat(y), longitude: parseFloat(x) };
  } catch (error) {
    console.error("주소 검색 실패:", error);
    throw new InvalidInputError(
      `주소 (${detailAddress}) 에 대한 검색에 실패했습니다. 다른 주소를 입력해 주세요.`
    );
  }
};

// 새로운 이벤트 생성
export const createEvent = async ({ userId, eventData }) => {
  // eventData는 기본적으로 형식 검증을 통해 유효한 값만이 전달된다고 가정.

  // title, content, price, categoryId, location, eventUrl,
  // applicationStart, applicationEnd,
  // schedules
  // imagePaths : multer가 req.files로 전달한 것을 parsing 후에 전달

  // 게시글 제목, 게시글 내용 누락 400
  if (!eventData.title || !eventData.content) {
    throw new InvalidInputError("게시글 제목 또는 내용이 누락되었습니다.");
  }

  const transaction = await models.sequelize.transaction();

  try {
    // 이벤트 생성
    const event = await models.Events.create(
      {
        ...eventData,
        createdUserId: userId,
      },
      { transaction }
    );

    // 이미지가 새로 들어온 경우에만 처리
    if (eventData.imagePaths.length > 0) {
      // 새로운 이미지 추가
      const eventImageData = eventData.imagePaths.map((path, index) => ({
        eventId: event.eventId,
        imageUrl: path,
        sequence: index + 1, // 이미지 순서 설정
      }));

      await models.EventImages.bulkCreate(eventImageData, { transaction });
    } else if (eventData.imagePaths.length == 0) {
      // 이미지가 새로 들어오지 않은 경우, 기본 이미지 처리
      const defaultEventImageData = [
        {
          eventId: event.eventId,
          imageUrl: "uploads/default/profile/v1.png", // 기본 이미지 URL 설정 => 일단 임의로 default에 있는 이미지 파일이고요, 추후 기본 이미지로 수정해야합니다.
          sequence: 1, // 기본 이미지 1개
        },
      ];

      await models.EventImages.bulkCreate(defaultEventImageData, {
        transaction,
      });
    }

    // 해당 이벤트 스케줄 부분 튜플 생성
    const eventSchedules = eventData.schedules.map((schedule) => ({
      ...schedule,
      startTime: schedule.startTime.split("Z")[0],
      endTime: schedule.endTime.split("Z")[0],
      eventId: event.eventId,
    }));

    await models.EventSchedules.bulkCreate(eventSchedules, { transaction });

    // 주소로 위치 좌표 계산
    const locs = eventData.location;
    const detailAddress = `${locs.roadAddress || locs.jibunAdress} ${locs.detail}`;
    if (locs) {
      const { latitude, longitude } =
        await getLocationFromAddress(detailAddress);

      // EventLocation 테이블에 좌표 저장
      await models.EventLocation.create(
        {
          ...locs,
          eventId: event.eventId,
          position: models.Sequelize.fn(
            "ST_GeomFromText",
            `POINT(${longitude} ${latitude})`
          ),
        },
        { transaction }
      );
    }

    await transaction.commit();

    logger.debug("이벤트 생성 성공", {
      action: "event:create",
      actionType: "success",
      userId: userId,
    });

    return { event };
  } catch (error) {
    logError(error);
    logger.error("이벤트 생성 실패, Rollback 실행됨.", {
      action: "event:create",
      actionType: "error",
      userId: userId,
    });
    await transaction.rollback();
    throw error;
  }
};
