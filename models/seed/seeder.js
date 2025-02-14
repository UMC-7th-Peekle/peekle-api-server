import logger from "../../utils/logger/logger.js";
import models from "../index.js";
import { addDays, addHours, addMonths, format } from "date-fns";
import * as Sequelize from "sequelize";

/*
  // truncate: true,
  // cascade: true,
  // force: true,

  truncate를 해야만 auto-increment가 초기화됨.
*/
import {
  groups,
  eventCategories,
  noticeCategories,
  noticeContentSample,
  terms,
  community,
  reportTypes,
  reportContentSample,
  reportStatus,
  getRandomNumber,
  getRandomEventContent,
  getRandomEventUrl,
  getRandomApplicationDates,
  getRandomRepeatType,
  getRepeatEndDate,
  getRandomStartAndEndTime,
  roadAddressSample,
  jibunAddressSample,
  sigunguSample,
  getRandomLongitude,
  getRandomLatitude,
  getRandomArticleContent,
  getRandomImageUrl,
  getRandomCommentContent,
  gacha,
  userSample,
} from "./data.js";
import { report } from "process";

export const seedEventLocationGroup = async () => {
  try {
    await models.Events.destroy({
      where: {},
    });
    await models.EventLocationGroups.destroy({
      where: {},
    });
    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE event_location_groups;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.EventLocationGroups.bulkCreate(
      groups.map((group) => ({ name: group }))
    );
    logger.warn("[Seeding] EventLocationGroups Seeding", {
      action: "seed:eventLocationGroups",
    });
  } catch (error) {
    throw error;
  }
};

export const seedEventCategory = async () => {
  try {
    // await models.Events.destroy({ where: {} }); ???
    await models.EventCategory.destroy({ where: {} });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE event_category;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.EventCategory.bulkCreate(eventCategories, { logging: false });

    logger.warn("Event Category Seeding 완료", {
      action: "seed:eventCategory",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};

export const seedEvents = async () => {
  const CREATE_EVENT_COUNT = 1000;
  const CREATE_EVENT_IMAGE_COUNT = 5;
  const EVENT_IMAGE_CREATION_RATE = 50;
  const EVENT_SCRAP_RATE = 70;
  const BATCH_SIZE = 10000;
  let QUERY_COUNT = 0;

  logger.warn("다음과 같은 크기의 Seeding이 실행됩니다.", {
    action: "seed:events",
    data: {
      event: CREATE_EVENT_COUNT,
      eventImage: CREATE_EVENT_COUNT * CREATE_EVENT_IMAGE_COUNT,
      eventScrap: (CREATE_EVENT_COUNT * EVENT_SCRAP_RATE) / 100,
      eventLocation: CREATE_EVENT_COUNT,
      eventSchedule: CREATE_EVENT_COUNT,
      total:
        CREATE_EVENT_COUNT +
        CREATE_EVENT_COUNT * CREATE_EVENT_IMAGE_COUNT +
        (CREATE_EVENT_COUNT * EVENT_SCRAP_RATE) / 100 +
        CREATE_EVENT_COUNT +
        CREATE_EVENT_COUNT,
    },
  });
  try {
    logger.warn("작업을 시작합니다. DELETE 및 TRUNCATE를 실행합니다.");

    await models.Events.destroy({
      where: {},
    });
    await models.EventImages.destroy({
      where: {},
    });
    await models.EventScraps.destroy({
      where: {},
    });
    await models.EventSchedules.destroy({
      where: {},
    });
    await models.EventLocation.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE events;");
    await models.sequelize.query("TRUNCATE TABLE event_images;");
    await models.sequelize.query("TRUNCATE TABLE event_scraps;");
    await models.sequelize.query("TRUNCATE TABLE event_schedules;");
    await models.sequelize.query("TRUNCATE TABLE event_location;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    logger.warn("DELETE 및 TRUNCATE가 완료되었습니다.");

    const users = await models.Users.findAll({
      attributes: ["userId"],
    });

    // N개의 이벤트를 생성함
    let events = [];
    let CREATED_EVENT_COUNT = 0;

    for (let i = 0; i < CREATE_EVENT_COUNT; i++) {
      const randomCategoryId = getRandomNumber(eventCategories.length);
      const applicationDates = getRandomApplicationDates();
      events.push({
        eventId: i + 1,
        title: `${randomCategoryId}-${i + 1} 이벤트`,
        content: `이벤트 ${randomCategoryId}-${i + 1} 설명 | ${getRandomEventContent()}`,
        price: Math.floor(Math.random() * 100000) + 1000, // 1000~100000원 랜덤
        categoryId: randomCategoryId,
        locationGroupId: (i % groups.length) + 1,
        eventUrl: getRandomEventUrl(),
        applicationStart: applicationDates.applicationStart,
        applicationEnd: applicationDates.applicationEnd,
        createdUserId: users[getRandomNumber(users.length) - 1].userId,
      });
    }
    if (events.length >= BATCH_SIZE) {
      logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
        action: "seed:events",
        data: {
          size: events.length,
          target: "events",
          queryCount: QUERY_COUNT,
        },
      });
      await models.Events.bulkCreate(events, { logging: false });
      CREATED_EVENT_COUNT += events.length;
      events = [];
    } else if (events.length === CREATE_EVENT_COUNT) {
      logger.warn("해당 테이블 작업을 마무리합니다.", {
        action: "seed:events",
        data: {
          size: events.length,
          target: "events",
          queryCount: QUERY_COUNT,
        },
      });
      await models.Events.bulkCreate(events, { logging: false });
      CREATED_EVENT_COUNT += events.length;
      events = [];
    }

    logger.warn(
      "Event에 대한 Seeding이 완료되었습니다. EventImages Seeding을 시작합니다.",
      {
        action: "seed:events",
        data: {
          size: CREATED_EVENT_COUNT,
          queryCount: QUERY_COUNT,
        },
      }
    );

    let eventScraps = [];
    let CREATED_EVENT_SCRAP_COUNT = 0;
    for (let i = 1; i <= CREATE_EVENT_COUNT; i++) {
      if (gacha(EVENT_SCRAP_RATE)) {
        eventScraps.push({
          eventId: i,
          userId: users[i % users.length].userId,
        });
      }
      if (eventScraps.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:events",
          data: {
            size: eventScraps.length,
            target: "eventScraps",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventScraps.bulkCreate(eventScraps, { logging: false });
        CREATED_EVENT_SCRAP_COUNT += eventScraps.length;
        eventScraps = [];
      } else if (i === CREATE_EVENT_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:events",
          data: {
            size: eventScraps.length,
            target: "eventScraps",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventScraps.bulkCreate(eventScraps, { logging: false });
        CREATED_EVENT_SCRAP_COUNT += eventScraps.length;
        eventScraps = [];
      }
    }

    logger.warn(
      "EventScraps에 대한 Seeding이 완료되었습니다. EventSchedules Seeding을 시작합니다.",
      {
        action: "seed:events",
        data: {
          size: CREATED_EVENT_SCRAP_COUNT,
          queryCount: QUERY_COUNT,
        },
      }
    );

    let eventLocations = [];
    let CREATED_EVENT_LOCATION_COUNT = 0;

    for (let i = 1; i <= CREATE_EVENT_COUNT; i++) {
      const addressIndex = getRandomNumber(groups.length) - 1;
      eventLocations.push({
        eventId: i,
        locationGroupId: addressIndex + 1,
        position: Sequelize.fn(
          "ST_GeomFromText",
          `POINT(${getRandomLongitude()} ${getRandomLatitude()})`
        ),
        roadAddress: roadAddressSample[addressIndex],
        jibunAddress: jibunAddressSample[addressIndex],
        buildingCode: `B${addressIndex + 1000}`,
        buildingName: `건물 ${addressIndex + 1}`,
        sido: "서울특별시", // 모든 그룹이 서울에 위치
        sigungu: sigunguSample[addressIndex],
        sigunguCode: `11${addressIndex + 100}`,
        roadnameCode: `${addressIndex + 20}`,
        zoneCode: `03${addressIndex + 300}`,
        detail: `${getRandomNumber(999)}동 ${getRandomNumber(999)}호`,
      });
      if (eventLocations.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:events",
          data: {
            size: eventLocations.length,
            target: "eventLocations",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventLocation.bulkCreate(eventLocations, {
          logging: false,
        });
        CREATED_EVENT_LOCATION_COUNT += eventLocations.length;
        eventLocations = [];
      } else if (i === CREATE_EVENT_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:events",
          data: {
            size: eventLocations.length,
            target: "eventLocations",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventLocation.bulkCreate(eventLocations, {
          logging: false,
        });
        CREATED_EVENT_LOCATION_COUNT += eventLocations.length;
        eventLocations = [];
      }
    }

    logger.warn("EventLocation Seeding이 완료되었습니다.", {
      action: "seed:events",
      data: {
        size: CREATED_EVENT_LOCATION_COUNT,
        queryCount: QUERY_COUNT,
      },
    });

    let eventSchedules = [];
    let CREATED_EVENT_SCHEDULE_COUNT = 0;

    for (let i = 1; i <= CREATE_EVENT_COUNT; i++) {
      const applicationDates = getRandomApplicationDates();
      const applicationEndDate = new Date(applicationDates.applicationEnd);
      const startDate = addDays(applicationEndDate, 7); // applicationEnd보다 1주일 뒤
      const repeatType = getRandomRepeatType();
      const repeatEndDate = getRepeatEndDate(startDate, repeatType);
      // endDate는 repeatEndDate거나 그 이후로 설정
      let endDate;
      if (repeatEndDate) {
        endDate = addDays(new Date(repeatEndDate), 7);
      } else {
        endDate = addMonths(startDate, 3);
      }
      const isAllDay = gacha(10);

      const { startTime, endTime } = getRandomStartAndEndTime();

      eventSchedules.push({
        eventId: i,
        repeatType,
        repeatEndDate,
        isAllDay,
        customText: "야호",
        startDate: startDate,
        endDate: repeatType === "none" ? startDate : endDate, // 일회성 이벤트
        startTime,
        endTime,
      });
      if (eventSchedules.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:events",
          data: {
            size: eventSchedules.length,
            target: "eventSchedules",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventSchedules.bulkCreate(eventSchedules, {
          logging: false,
        });
        CREATED_EVENT_SCHEDULE_COUNT += eventSchedules.length;
        eventSchedules = [];
      } else if (i === CREATE_EVENT_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:events",
          data: {
            size: eventSchedules.length,
            target: "eventSchedules",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventSchedules.bulkCreate(eventSchedules, {
          logging: false,
        });
        CREATED_EVENT_SCHEDULE_COUNT += eventSchedules.length;
        eventSchedules = [];
      }

      logger.warn(
        "EventSchedules에 대한 Seeding이 완료되었습니다. EventLocation Seeding을 시작합니다.",
        {
          action: "seed:events",
          data: {
            size: CREATED_EVENT_SCHEDULE_COUNT,
            queryCount: QUERY_COUNT,
          },
        }
      );
    }

    let eventImages = [];
    let CREATED_EVENT_IMAGE_COUNT = 0;
    for (let i = 1; i <= CREATE_EVENT_COUNT; i++) {
      // 각 이벤트 당 최대 N개의 이미지를 랜덤하게 생성함
      let eventImageCount = getRandomNumber(CREATE_EVENT_IMAGE_COUNT);
      // N% 확률로 이미지 생성
      if (gacha(EVENT_IMAGE_CREATION_RATE)) {
        for (let j = 0; j < eventImageCount; j++) {
          eventImages.push({
            eventId: i,
            imageUrl: `/events${getRandomImageUrl()}`,
            sequence: j + 1,
          });
        }
      }
      if (eventImages.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:events",
          data: {
            size: eventImages.length,
            target: "eventImages",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventImages.bulkCreate(eventImages, { logging: false });
        CREATED_EVENT_IMAGE_COUNT += eventImages.length;
        eventImages = [];
      } else if (i === CREATE_EVENT_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:events",
          data: {
            size: eventImages.length,
            target: "eventImages",
            queryCount: QUERY_COUNT,
          },
        });
        await models.EventImages.bulkCreate(eventImages, { logging: false });
        CREATED_EVENT_IMAGE_COUNT += eventImages.length;
        eventImages = [];
      }

      logger.warn(
        "EventImage에 대한 Seeding이 완료되었습니다. EventScraps Seeding을 시작합니다.",
        {
          action: "seed:events",
          data: {
            size: CREATED_EVENT_IMAGE_COUNT,
            queryCount: QUERY_COUNT,
          },
        }
      );
    }

    logger.warn("Event Seeding이 완료되었습니다.", {
      action: "seed:events",
      data: {
        queryCount: QUERY_COUNT,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const seedNoticeCategory = async () => {
  try {
    await models.NoticeCategory.destroy({ where: {} });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE notice_category;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.NoticeCategory.bulkCreate(noticeCategories, {
      logging: false,
    });

    logger.warn("Notice Category Seeding 완료", {
      action: "seed:noticeCategory",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};

export const seedNotices = async () => {
  const CREATE_NOTICE_COUNT = 100;
  const CREATE_NOTICE_IMAGE_COUNT = 3;
  const NOTICE_IMAGE_CREATION_RATE = 70;

  const BATCH_SIZE = 10000;
  let QUERY_COUNT = 0;

  logger.warn("다음과 같은 크기의 Seeding이 실행됩니다.", {
    action: "seed:notices",
    data: {
      notice: CREATE_NOTICE_COUNT,
      noticeImage: CREATE_NOTICE_COUNT * CREATE_NOTICE_IMAGE_COUNT,
      total:
        CREATE_NOTICE_COUNT + CREATE_NOTICE_COUNT * CREATE_NOTICE_IMAGE_COUNT,
    },
  });
  try {
    logger.warn("작업을 시작합니다. DELETE 및 TRUNCATE를 실행합니다.");

    await models.Notices.destroy({
      where: {},
    });
    await models.NoticeImages.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE notices;");
    await models.sequelize.query("TRUNCATE TABLE notice_images;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    logger.warn("DELETE 및 TRUNCATE가 완료되었습니다.");

    const users = await models.Users.findAll({
      attributes: ["userId"],
    });

    // N개의 공지사항을 생성함
    let notices = [];
    let CREATED_NOTICE_COUNT = 0;

    for (let i = 0; i < CREATE_NOTICE_COUNT; i++) {
      const randomCategoryId = getRandomNumber(noticeCategories.length);
      notices.push({
        title: `${noticeCategories[randomCategoryId - 1].name}-${i + 1} 공지사항`,
        content: `공지사항 ${randomCategoryId}-${i + 1} 내용 | ${noticeContentSample[randomCategoryId - 1].items[i % 3].content}`,
        categoryId: randomCategoryId,
        authorId: users[getRandomNumber(users.length) - 1].userId,
        isNotice: gacha(50), // N% 확률로 공지사항임
      });
    }
    if (notices.length >= BATCH_SIZE) {
      logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
        action: "seed:notices",
        data: {
          size: notices.length,
          target: "notices",
          queryCount: QUERY_COUNT,
        },
      });
      await models.Notices.bulkCreate(notices, { logging: false });
      CREATED_NOTICE_COUNT += notices.length;
      notices = [];
    } else if (notices.length === CREATE_NOTICE_COUNT) {
      logger.warn("해당 테이블 작업을 마무리합니다.", {
        action: "seed:notices",
        data: {
          size: notices.length,
          target: "notices",
          queryCount: QUERY_COUNT,
        },
      });
      await models.Notices.bulkCreate(notices, { logging: false });
      CREATED_NOTICE_COUNT += notices.length;
      notices = [];
    }

    logger.warn(
      "Notice에 대한 Seeding이 완료되었습니다. NoticeImages Seeding을 시작합니다.",
      {
        action: "seed:notices",
        data: {
          size: CREATED_NOTICE_COUNT,
          queryCount: QUERY_COUNT,
        },
      }
    );

    let noticeImages = [];
    let CREATED_NOTICE_IMAGE_COUNT = 0;
    for (let i = 1; i <= CREATE_NOTICE_COUNT; i++) {
      // 각 공지사항 당 최대 N개의 이미지를 랜덤하게 생성함
      let noticeImageCount = getRandomNumber(CREATE_NOTICE_IMAGE_COUNT);
      // N% 확률로 이미지 생성
      if (gacha(NOTICE_IMAGE_CREATION_RATE)) {
        for (let j = 0; j < noticeImageCount; j++) {
          noticeImages.push({
            noticeId: i,
            imageUrl: `/notices${getRandomImageUrl()}`,
            sequence: j + 1,
          });
        }
      }
      if (noticeImages.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:notices",
          data: {
            size: noticeImages.length,
            target: "noticeImages",
            queryCount: QUERY_COUNT,
          },
        });
        await models.NoticeImages.bulkCreate(noticeImages, { logging: false });
        CREATED_NOTICE_IMAGE_COUNT += noticeImages.length;
        noticeImages = [];
      } else if (i === CREATE_NOTICE_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:notices",
          data: {
            size: noticeImages.length,
            target: "noticeImages",
            queryCount: QUERY_COUNT,
          },
        });
        await models.NoticeImages.bulkCreate(noticeImages, { logging: false });
        CREATED_NOTICE_IMAGE_COUNT += noticeImages.length;
        noticeImages = [];
      }
    }

    logger.warn("NoticeImage에 대한 Seeding이 완료되었습니다.", {
      action: "seed:notices",
      data: {
        size: CREATED_NOTICE_IMAGE_COUNT,
        queryCount: QUERY_COUNT,
      },
    });

    logger.warn("Notice에 대한 Seeding이 완료되었습니다.", {
      action: "seed:notices",
      data: {
        queryCount: QUERY_COUNT,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const seedTerms = async () => {
  try {
    await models.Terms.destroy({
      where: {},
    });
    await models.UserTerms.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE terms;");
    await models.sequelize.query("TRUNCATE TABLE user_terms;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.Terms.bulkCreate(terms, { logging: false });

    const users = await models.Users.findAll({
      attributes: ["userId"],
    });

    const userTerms = [];
    users.forEach((user) => {
      terms.forEach((term, idx) => {
        let isAgreed = gacha(50);
        if (term.isRequired) {
          isAgreed = true;
        }
        userTerms.push({
          userId: user.userId,
          termId: idx + 1,
          isAgreed,
        });
      });
    });
    await models.UserTerms.bulkCreate(userTerms, { logging: false });

    logger.warn("Terms에 대한 Seeding이 실행되었습니다.", {
      action: "seed:terms",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};

export const seedCommunity = async () => {
  const CREATE_ARTICLE_COUNT = 1000; // 전체 게시글 수
  const CREATE_ARITCLE_IMAGE_COUNT = 5; // 게시글 당 최대 이미지 개수
  const CREATE_COMMENT_COUNT = 100; // 게시글 당 최대 댓글 수
  const ANONYMOUS_ARTICLE_RATE = 50;
  const ARTICLE_IMAGE_CREATION_RATE = 50;
  const ANONYMOUS_COMMENT_RATE = 30;
  const REPLY_RATE = 90;
  const ANONYMOUS_REPLY_RATE = 30;
  const ARTICLE_LIKE_RATE = 90;
  const COMMENT_LIKE_RATE = 90;

  const BATCH_SIZE = 10000;
  let QUERY_COUNT = 0;

  logger.warn("다음과 같은 크기의 Seeding이 실행됩니다.", {
    action: "seed:community",
    data: {
      article: CREATE_ARTICLE_COUNT,
      comment: CREATE_ARTICLE_COUNT * CREATE_COMMENT_COUNT,
      reply: (CREATE_ARTICLE_COUNT * CREATE_COMMENT_COUNT * REPLY_RATE) / 100,
      commentLike:
        (CREATE_ARTICLE_COUNT * CREATE_COMMENT_COUNT * COMMENT_LIKE_RATE) / 100,
      total:
        CREATE_ARTICLE_COUNT +
        CREATE_ARTICLE_COUNT * CREATE_COMMENT_COUNT +
        (CREATE_ARTICLE_COUNT * CREATE_COMMENT_COUNT * REPLY_RATE) / 100 +
        (CREATE_ARTICLE_COUNT * CREATE_COMMENT_COUNT * COMMENT_LIKE_RATE) / 100,
    },
  });
  try {
    logger.warn("작업을 시작합니다. DELETE 및 TRUNCATE를 실행합니다.");

    await models.Communities.destroy({
      where: {},
    });
    await models.Articles.destroy({
      where: {},
    });
    await models.ArticleLikes.destroy({
      where: {},
    });
    await models.ArticleImages.destroy({
      where: {},
    });
    await models.ArticleComments.destroy({
      where: {},
    });
    await models.ArticleCommentLikes.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE communities;");
    await models.sequelize.query("TRUNCATE TABLE articles;");
    await models.sequelize.query("TRUNCATE TABLE article_likes;");
    await models.sequelize.query("TRUNCATE TABLE article_images;");
    await models.sequelize.query("TRUNCATE TABLE article_comments;");
    await models.sequelize.query("TRUNCATE TABLE article_comment_likes;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    logger.warn("DELETE 및 TRUNCATE가 완료되었습니다.");

    await models.Communities.bulkCreate(community, { logging: false });

    logger.warn("Community Seeding 완료", {
      action: "seed:community",
      data: {
        size: community.length,
        queryCount: QUERY_COUNT,
      },
    });

    const users = await models.Users.findAll({
      attributes: ["userId"],
    });

    // N개의 게시글을 생성함
    let articles = [];
    for (let i = 0; i < CREATE_ARTICLE_COUNT; i++) {
      // 커뮤니티는 길이에 따라 랜덤으로 배정
      const randomCommunityId = getRandomNumber(community.length);
      articles.push({
        title: `${randomCommunityId}-${i + 1} 제목`,
        content: `${randomCommunityId}-${i + 1} 내용 | ${getRandomArticleContent()}`,
        communityId: randomCommunityId,
        isAnonymous: gacha(ANONYMOUS_ARTICLE_RATE), // N% 확률로 익명임
        authorId: users[getRandomNumber(users.length) - 1].userId,
      });
      // console.log(articles);
      if (articles.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:community",
          data: {
            size: articles.length,
            target: "articles",
            queryCount: QUERY_COUNT,
          },
        });
        // console.log(articles);
        await models.Articles.bulkCreate(articles, { logging: false });
        // console.log(ret);
        articles = [];
      } else if (articles.length === CREATE_ARTICLE_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:community",
          data: {
            size: articles.length,
            target: "articles",
            queryCount: QUERY_COUNT,
          },
        });
        await models.Articles.bulkCreate(articles, { logging: false });
        articles = [];
      }
    }
    // console.log(articles);

    logger.warn("Article에 대한 Seeding이 완료되었습니다.", {
      action: "seed:community",
      data: {
        size: CREATE_ARTICLE_COUNT,
        queryCount: QUERY_COUNT,
      },
    });

    let articleLikes = [];
    let CREATED_ARTICLE_LIKE_COUNT = 0;
    for (let i = 1; i <= CREATE_ARTICLE_COUNT; i++) {
      // N% 확률로 좋아요 생성
      if (gacha(ARTICLE_LIKE_RATE)) {
        articleLikes.push({
          articleId: i,
          likedUserId: users[i % users.length].userId,
        });
      }
      if (articleLikes.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:community",
          data: {
            size: articleLikes.length,
            target: "articleLikes",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleLikes.bulkCreate(articleLikes, { logging: false });
        CREATED_ARTICLE_LIKE_COUNT += articleLikes.length;
        articleLikes = [];
      } else if (i === CREATE_ARTICLE_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:community",
          data: {
            size: articleLikes.length,
            target: "articleLikes",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleLikes.bulkCreate(articleLikes, { logging: false });
        CREATED_ARTICLE_LIKE_COUNT += articleLikes.length;
        articleLikes = [];
      }
    }

    logger.warn(
      "ArticleLike Seeding이 완료되었습니다. Comment Seeding을 시작합니다."
    );

    let CREATED_COMMENT_COUNT = 0;

    let comments = [];
    for (let i = 1; i <= CREATE_ARTICLE_COUNT; i++) {
      // 각 게시글 당 최대 N개의 댓글을 랜덤하게 생성함
      let commentCount = getRandomNumber(CREATE_COMMENT_COUNT);
      for (let j = 0; j < commentCount; j++) {
        comments.push({
          content: `${i} 게시글의 댓글 | ${getRandomCommentContent()}`,
          articleId: i,
          authorId: users[getRandomNumber(users.length) - 1].userId,
          isAnonymous: gacha(ANONYMOUS_COMMENT_RATE), // N% 확률로 익명임
        });
      }
      if (comments.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:community",
          data: {
            size: comments.length,
            target: "comments",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleComments.bulkCreate(comments, { logging: false });
        CREATED_COMMENT_COUNT += comments.length;
        comments = [];
      } else if (i === CREATE_ARTICLE_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:community",
          data: {
            size: comments.length,
            target: "comments",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleComments.bulkCreate(comments, { logging: false });
        CREATED_COMMENT_COUNT += comments.length;
        comments = [];
      }
    }

    logger.warn(
      "Comment에 대한 Seeding이 완료되었습니다. Reply를 생성합니다.",
      {
        action: "seed:community",
        data: {
          size: CREATED_COMMENT_COUNT,
          queryCount: QUERY_COUNT,
        },
      }
    );

    let articleImages = [];
    let CREATED_ARTICLE_IMAGE_COUNT = 0;
    for (let i = 1; i <= CREATE_ARTICLE_COUNT; i++) {
      // 각 게시글 당 최대 N개의 이미지를 랜덤하게 생성함
      let articleImageCount = getRandomNumber(CREATE_ARITCLE_IMAGE_COUNT);
      // N% 확률로 이미지 생성
      if (gacha(ARTICLE_IMAGE_CREATION_RATE)) {
        for (let j = 0; j < articleImageCount; j++) {
          articleImages.push({
            articleId: i,
            imageUrl: `/articles${getRandomImageUrl()}`,
            sequence: j + 1,
          });
        }
      }
      if (articleImages.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:community",
          data: {
            size: articleImages.length,
            target: "articleImages",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleImages.bulkCreate(articleImages, {
          logging: false,
        });
        CREATED_ARTICLE_IMAGE_COUNT += articleImages.length;
        articleImages = [];
      } else if (i === CREATE_ARTICLE_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:community",
          data: {
            size: articleImages.length,
            target: "articleImages",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleImages.bulkCreate(articleImages, {
          logging: false,
        });
        CREATED_ARTICLE_IMAGE_COUNT += articleImages.length;
        articleImages = [];
      }
    }

    // TODO: 다음 작업에 따라 수정 필요
    logger.warn(
      "ArticleImage에 대한 Seeding이 완료되었습니다. 다음 작업을 진행합니다.",
      {
        action: "seed:community",
        data: {
          size: CREATED_ARTICLE_IMAGE_COUNT,
          queryCount: QUERY_COUNT,
        },
      }
    );

    // let replys = [];
    // for (let i = 1; i <= CREATED_COMMENT_COUNT; i++) {
    //   // 66% 확률로 대댓글 생성
    //   if (gacha(REPLY_RATE)) {
    //     replys.push({
    //       content: `댓글 ${i}의 대댓글 | ${getRandomCommentContent()}`,
    //       articleId: ,
    //       isAnonymous: gacha(ANONYMOUS_REPLY_RATE), // N% 확률로 익명임
    //       parentCommentId: i,
    //       authorId: users[getRandomNumber(users.length) - 1].userId,
    //     });
    //   }
    //   if (replys.length >= BATCH_SIZE) {
    //     logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
    //       action: "seed:community",
    //       data: {
    //         size: replys.length,
    //         target: "replies",
    //         queryCount: QUERY_COUNT,
    //       },
    //     });
    //     await models.ArticleComments.bulkCreate(replys, { logging: false });
    //     CREATED_COMMENT_COUNT += replys.length;
    //     replys = [];
    //     console.log(
    //       `[Seeding] ArticleComments_Reply Seeded | Total ${CREATED_COMMENT_COUNT} rows | Total Query ${++QUERY_COUNT}`
    //     );
    //   } else if (i === CREATED_COMMENT_COUNT) {
    //     logger.warn("해당 테이블 작업을 마무리합니다.", {
    //       action: "seed:community",
    //       data: {
    //         size: replys.length,
    //         target: "replies",
    //         queryCount: QUERY_COUNT,
    //       },
    //     });
    //     await models.ArticleComments.bulkCreate(replys, { logging: false });
    //     CREATED_COMMENT_COUNT += replys.length;
    //     replys = [];
    //     console.log(
    //       `[Seeding] ArticleComments_Reply Seeded | Total ${CREATED_COMMENT_COUNT} rows | Total Query ${++QUERY_COUNT}`
    //     );
    //   }
    // }

    logger.warn("Reply Seeding이 완료되었습니다. CommentLike를 생성합니다.");

    let CREATED_COMMENT_LIKE_COUNT = 0;
    let commentLikes = [];
    for (let i = 1; i <= CREATED_COMMENT_COUNT; i++) {
      // 30% 확률로 좋아요 생성
      if (gacha(COMMENT_LIKE_RATE)) {
        commentLikes.push({
          commentId: i,
          likedUserId: users[i % users.length].userId,
        });
      }
      if (commentLikes.length >= BATCH_SIZE) {
        logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
          action: "seed:community",
          data: {
            size: commentLikes.length,
            target: "commentLikes",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleCommentLikes.bulkCreate(commentLikes, {
          logging: false,
        });
        CREATED_COMMENT_LIKE_COUNT += commentLikes.length;
        commentLikes = [];
        console.log(
          `[Seeding] ArticleCommentLikes Seeded | Total ${CREATED_COMMENT_LIKE_COUNT} rows | Total Query ${++QUERY_COUNT}`
        );
      } else if (i === CREATED_COMMENT_COUNT) {
        logger.warn("해당 테이블 작업을 마무리합니다.", {
          action: "seed:community",
          data: {
            size: commentLikes.length,
            target: "commentLikes",
            queryCount: QUERY_COUNT,
          },
        });
        await models.ArticleCommentLikes.bulkCreate(commentLikes, {
          logging: false,
        });
        CREATED_COMMENT_LIKE_COUNT += commentLikes.length;
        commentLikes = [];
      }
    }

    logger.warn("CommentLike Seeding이 완료되었습니다.", {
      action: "seed:community",
      data: {
        size: CREATED_COMMENT_LIKE_COUNT,
        queryCount: QUERY_COUNT,
      },
    });

    logger.warn("Community Seeding이 완료되었습니다.", {
      action: "seed:community",
      data: {
        queryCount: QUERY_COUNT,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const seedReports = async () => {
  const CREATE_REPORT_COUNT = 1000; // Unique 제약으로 인 해 숫자가 커지면 VALIDATION_ERROR 발생할 확률 높음

  const BATCH_SIZE = 10000; // 당장 필요하진 않지만 추후에 데이터를 늘렸을 때를 위해
  let QUERY_COUNT = 0;

  logger.warn("다음과 같은 크기의 Seeding이 실행됩니다.", {
    action: "seed:reports",
    data: {
      report: CREATE_REPORT_COUNT,
    },
  });
  try {
    logger.warn("작업을 시작합니다. DELETE 및 TRUNCATE를 실행합니다.");

    await models.Reports.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE reports;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    logger.warn("DELETE 및 TRUNCATE가 완료되었습니다.");

    const users = await models.Users.findAll({
      attributes: ["userId"],
    });

    const articles = await models.Articles.findAll({
      attributes: ["articleId"],
    });

    const comments = await models.ArticleComments.findAll({
      attributes: ["commentId"],
    });

    const events = await models.Events.findAll({
      attributes: ["eventId"],
    });

    // N개의 신고를 생성함
    let reports = [];
    let CREATED_REPORT_COUNT = 0;

    const existingReports = new Set(); // 중복 방지용 Set

    for (let i = 0; i < CREATE_REPORT_COUNT; i++) {
      const randomReportTypeId = getRandomNumber(reportTypes.length);
      // randomReportType에 따라 targetId를 랜덤하게 생성함
      let targetId;
      if (randomReportTypeId === 1) {
        targetId = users[getRandomNumber(users.length) - 1].userId;
      } else if (randomReportTypeId === 2) {
        targetId = articles[getRandomNumber(articles.length) - 1].articleId;
      } else if (randomReportTypeId === 3) {
        targetId = comments[getRandomNumber(comments.length) - 1].commentId;
      } else if (randomReportTypeId === 4) {
        targetId = events[getRandomNumber(events.length) - 1].eventId;
      }

      let reportedUserId = users[getRandomNumber(users.length) - 1].userId;

      const reportKey = `${targetId}-${randomReportTypeId}-${reportedUserId}`;

      // 중복 체크
      if (existingReports.has(reportKey)) {
        i--; // 중복이므로 다시 생성
        continue;
      }

      existingReports.add(reportKey);

      reports.push({
        type: reportTypes[randomReportTypeId - 1],
        targetId,
        reportedUserId,
        reason: `신고 ${i + 1} 사유 | ${reportContentSample[randomReportTypeId - 1].content[i % 3]}`,
        status: reportStatus[getRandomNumber(reportStatus.length) - 1],
      });
    }
    if (reports.length >= BATCH_SIZE) {
      logger.warn("Batch Size를 초과하여 쿼리를 실행합니다.", {
        action: "seed:reports",
        data: {
          size: reports.length,
          target: "reports",
          queryCount: QUERY_COUNT,
        },
      });
      await models.Reports.bulkCreate(reports, { logging: false });
      CREATED_REPORT_COUNT += reports.length;
      reports = [];
    } else if (reports.length === CREATE_REPORT_COUNT) {
      logger.warn("해당 테이블 작업을 마무리합니다.", {
        action: "seed:reports",
        data: {
          size: reports.length,
          target: "reports",
          queryCount: QUERY_COUNT,
        },
      });
      await models.Reports.bulkCreate(reports, { logging: false });
      CREATED_REPORT_COUNT += reports.length;
      reports = [];
    }

    logger.warn("Report에 대한 Seeding이 완료되었습니다.", {
      action: "seed:reports",
      data: {
        queryCount: QUERY_COUNT,
      },
    });
  } catch (error) {
    throw error;
  }
};

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
