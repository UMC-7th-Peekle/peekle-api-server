const { faker } = require("@faker-js/faker");
faker.locale = "ko"; // Set the locale to Korean

const db = require("../models").default; // 경로는 실제 프로젝트 구조에 맞춰 변경
const {
  Communities,
  Users,
  Articles,
  ArticleImages,
  EventCategory,
  EventSchedules,
  Events,
  EventImages,
  NoticeCategory,
  Terms,
  Admins,
  ArticleComments,
  ArticleCommentLikes,
  ArticleLikes,
  EventScraps,
  Notices,
  NoticeImages,
  Tickets,
  TicketMessages,
  TicketMessageImages,
  UserFilters,
  UserLocal,
  UserOauth,
  UserRestrictions,
  UserTerms,
} = db;

async function seed() {
  try {
    // 필요 시 sync
    await db.sequelize.sync({ force: true });

    console.log("Seeding data...");
    console.log(Communities);

    // 1) communities
    const communities = await Communities.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        title: faker.lorem.words(3),
      }))
    );

    // 2) users
    const users = await Users.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        name: faker.person.fullName(),
        nickname: faker.internet.username(),
        birthdate: faker.date.past().toISOString().split("T")[0],
        gender: faker.helpers.arrayElement(["male", "female"]),
        phone: faker.phone.number().slice(0, 20),
        email: faker.internet.email(),
        lastNicknameChangeDate: faker.date.recent().toISOString().split("T")[0],
        profileImage: faker.image.url(),
        status: faker.helpers.arrayElement(["active", "dormant", "terminated"]),
        lastActivityDate: faker.date.recent().toISOString().split("T")[0],
        dormantDate: faker.datatype.boolean()
          ? faker.date.recent().toISOString().split("T")[0]
          : null,
        terminationDate: faker.datatype.boolean()
          ? faker.date.recent().toISOString().split("T")[0]
          : null,
      }))
    );

    // 3) articles
    const articles = await Articles.bulkCreate(
      Array.from({ length: 100 }).map(() => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        authorId: faker.helpers.arrayElement(users).userId,
        communityId: faker.helpers.arrayElement(communities).communityId,
      }))
    );

    // 4) article_images
    await ArticleImages.bulkCreate(
      Array.from({ length: 200 }).map((_, i) => ({
        articleId: faker.helpers.arrayElement(articles).articleId,
        imageUrl: faker.image.url(),
        sequence: i + 1,
      }))
    );

    // 5) event_categories
    const eventCategories = await EventCategory.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      }))
    );

    // 7) events
    const events = await Events.bulkCreate(
      Array.from({ length: 100 }).map(() => {
        const applicationStart = faker.date.future();
        const applicationEnd = faker.date.future(1, applicationStart);
        return {
          title: faker.lorem.words(3),
          content: faker.lorem.paragraphs(),
          price: faker.number.int({ min: 1000, max: 100000 }),
          categoryId: faker.helpers.arrayElement(eventCategories).categoryId,
          location: faker.location.streetAddress(),
          eventUrl: faker.internet.url(), // event_url 추가
          applicationStart: applicationStart
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
          applicationEnd: applicationEnd
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        };
      })
    );

    // 6) event_schedules
    await EventSchedules.bulkCreate(
      Array.from({ length: 50 }).map(() => {
        const startDate = faker.date.future();
        const endDate = faker.date.future(1, startDate);
        return {
          eventId: faker.helpers.arrayElement(events).eventId,
          repeatType: faker.helpers.arrayElement([
            "none",
            "daily",
            "weekly",
            "monthly",
            "yearly",
            "custom",
          ]),
          repeatEndDate: faker.datatype.boolean()
            ? faker.date.future(1, endDate).toISOString().split("T")[0]
            : null,
          isAllDay: faker.datatype.boolean() ? 1 : 0,
          customText: faker.lorem.sentence(),
          startDate: startDate.toISOString().split("T")[0],
          endDate: faker.datatype.boolean()
            ? endDate.toISOString().split("T")[0]
            : null,
          startTime: faker.datatype.boolean()
            ? startDate.toISOString().split("T")[1].split(".")[0]
            : null,
          endTime: faker.datatype.boolean()
            ? endDate.toISOString().split("T")[1].split(".")[0]
            : null,
        };
      })
    );

    // 8) event_images
    await EventImages.bulkCreate(
      Array.from({ length: 200 }).map((_, i) => ({
        eventId: faker.helpers.arrayElement(events).eventId,
        imageUrl: faker.image.url(),
        sequence: i + 1,
      }))
    );

    // 9) notice_category
    const noticeCategories = await NoticeCategory.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      }))
    );

    // 10) terms
    const terms = await Terms.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        isRequired: faker.datatype.boolean() ? 1 : 0,
        status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
        version: faker.number.int({ min: 1, max: 10 }),
      }))
    );

    // 11) admins
    await Admins.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        userId: faker.helpers.arrayElement(users).userId,
        permissions: faker.number.int({ min: 1, max: 100 }),
      }))
    );

    // 추가된 데이터 미리 가져오기
    const allAdmins = await Admins.findAll();
    await NoticeCategory.findAll();
    await Terms.findAll();
    await Tickets.findAll();
    await TicketMessages.findAll();

    // 12) article_comments
    const articleComments = await ArticleComments.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        articleId: faker.helpers.arrayElement(articles).articleId,
        parentCommentId: null,
        authorId: faker.helpers.arrayElement(users).userId,
        comment: faker.lorem.sentence(),
      }))
    );

    // 13) article_comment_likes
    await ArticleCommentLikes.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        commentId: faker.helpers.arrayElement(articleComments).commentId,
        likedUserId: faker.helpers.arrayElement(users).userId,
      }))
    );

    // 14) article_likes
    await ArticleLikes.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        articleId: faker.helpers.arrayElement(articles).articleId,
        likedUserId: faker.helpers.arrayElement(users).userId,
      }))
    );

    // 15) event_scraps
    await EventScraps.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        eventId: faker.helpers.arrayElement(events).eventId,
        userId: faker.helpers.arrayElement(users).userId,
      }))
    );

    // 16) notices
    const notices = await Notices.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        categoryId: faker.helpers.arrayElement(noticeCategories).categoryId,
        adminId: faker.helpers.arrayElement(allAdmins).adminId,
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(),
        isNotice: faker.datatype.boolean() ? 1 : 0,
      }))
    );

    // 17) notice_images
    await NoticeImages.bulkCreate(
      Array.from({ length: 30 }).map(() => ({
        noticeId: faker.helpers.arrayElement(notices).noticeId,
        imageUrl: faker.image.url(),
        sequence: faker.number.int({ min: 1, max: 5 }),
      }))
    );

    // 18) tickets
    const tickets = await Tickets.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        title: faker.lorem.words(3),
        status: faker.helpers.arrayElement([
          "open",
          "closed",
          "in_progress",
          "deleted",
        ]),
        createdBy: faker.helpers.arrayElement(users).userId,
      }))
    );

    // 19) ticket_messages
    const ticketMessages = await TicketMessages.bulkCreate(
      Array.from({ length: 30 }).map(() => ({
        ticketId: faker.helpers.arrayElement(tickets).ticketId,
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(),
        createdBy: faker.helpers.arrayElement(users).userId,
      }))
    );

    // 20) ticket_message_images
    await TicketMessageImages.bulkCreate(
      Array.from({ length: 30 }).map(() => ({
        ticketMessageId:
          faker.helpers.arrayElement(ticketMessages).ticketMessageId,
        imageUrl: faker.image.url(),
        sequence: faker.number.int({ min: 1, max: 5 }),
      }))
    );

    // 21) user_filters
    await UserFilters.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        userId: faker.helpers.arrayElement(users).userId,
        dateAscending: faker.datatype.boolean() ? 1 : 0,
        priceAscending: faker.datatype.boolean() ? 1 : 0,
        distanceAscending: faker.datatype.boolean() ? 1 : 0,
        category: faker.number.int({ min: 1, max: 32 }),
      }))
    );

    // 22) user_local
    await UserLocal.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        userId: faker.helpers.arrayElement(users).userId,
        password: faker.internet.password(),
      }))
    );

    // 23) user_oauth
    await UserOauth.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        userId: faker.helpers.arrayElement(users).userId,
        oauthId: faker.number.int(),
        oauthType: "kakao",
      }))
    );

    // 24) user_restrictions
    await UserRestrictions.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        userId: faker.helpers.arrayElement(users).userId,
        adminId: faker.helpers.arrayElement(allAdmins).adminId,
        reason: faker.lorem.sentence(),
        endsAt: faker.datatype.boolean()
          ? faker.date.future().toISOString().split("T")[0]
          : null,
      }))
    );

    // 25) user_terms
    await UserTerms.bulkCreate(
      Array.from({ length: 20 }).map(() => ({
        userId: faker.helpers.arrayElement(users).userId,
        termId: faker.helpers.arrayElement(terms).termId,
        isAgreed: faker.datatype.boolean() ? 1 : 0,
      }))
    );

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await db.sequelize.close();
  }
}

module.exports = { seed };

if (require.main === module) {
  seed();
}
