const { faker } = require("@faker-js/faker");
faker.locale = "ko"; // Set the locale to Korean

const db = require("../models").default; // Adjust the path based on actual project structure
const {
  Communities,
  Users,
  Admins,
  Articles,
  ArticleImages,
  EventCategory,
  Events,
  EventImages,
  EventSchedules,
  EventScraps,
  NoticeCategory,
  Notices,
  NoticeImages,
  Terms,
  ArticleComments,
  ArticleCommentLikes,
  ArticleLikes,
  PeeklingCategory,
  Peekling,
  PeeklingImages,
  RefreshTokens,
  Reports,
  Tickets,
  TicketMessages,
  TicketMessageImages,
  UserBlocks,
  UserFilters,
  UserOauth,
  UserRestrictions,
  UserTerms,
  VerificationCode,
} = db;

async function seed() {
  try {
    // Sync database
    // await db.sequelize.sync({ force: true });

    console.log("Seeding data...");

    // 1) Communities
    const communities = await Communities.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        title: faker.lorem.words(3),
      }))
    );

    // 2) Users
    const users = await Users.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        name: faker.person.fullName(),
        nickname: faker.internet.userName(),
        birthdate: faker.date.past(30).toISOString().split("T")[0],
        gender: faker.helpers.arrayElement(["male", "female"]),
        phone: faker.phone.number("010-####-####"),
        email: faker.internet.email(),
        last_nickname_change_date: faker.datatype.boolean()
          ? faker.date.recent().toISOString().split("T")[0]
          : null,
        profile_image: faker.image.urlLoremFlickr({ category: "people" }),
        status: faker.helpers.arrayElement(["active", "dormant", "terminated"]),
        last_activity_date: faker.date.recent().toISOString().split("T")[0],
        dormant_date: faker.datatype.boolean()
          ? faker.date.past().toISOString().split("T")[0]
          : null,
        termination_date: faker.datatype.boolean()
          ? faker.date.past().toISOString().split("T")[0]
          : null,
      }))
    );

    // 3) Admins
    const admins = await Admins.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        user_id: faker.helpers.arrayElement(users).user_id,
        permissions: faker.number.int({ min: 1, max: 100 }),
      }))
    );

    // 4) Articles
    const articles = await Articles.bulkCreate(
      Array.from({ length: 100 }).map(() => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        author_id: faker.helpers.arrayElement(users).user_id,
        community_id: faker.helpers.arrayElement(communities).community_id,
      }))
    );

    // 5) Article Images
    await ArticleImages.bulkCreate(
      Array.from({ length: 200 }).map((_, i) => ({
        article_id: faker.helpers.arrayElement(articles).article_id,
        image_url: faker.image.urlLoremFlickr({ category: "nature" }),
        sequence: i + 1,
      }))
    );

    // 6) Event Categories
    const eventCategories = await EventCategory.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      }))
    );

    // 7) Events
    const events = await Events.bulkCreate(
      Array.from({ length: 100 }).map(() => {
        const applicationStart = faker.date.future();
        const applicationEnd = faker.date.future(1, applicationStart);
        return {
          title: faker.lorem.words(3),
          content: faker.lorem.paragraphs(),
          price: faker.number.int({ min: 1000, max: 100000 }),
          category_id: faker.helpers.arrayElement(eventCategories).category_id,
          location: faker.location.streetAddress(),
          event_url: faker.internet.url(),
          application_start: faker.datatype.boolean()
            ? applicationStart.toISOString().slice(0, 19).replace("T", " ")
            : null,
          application_end: faker.datatype.boolean()
            ? applicationEnd.toISOString().slice(0, 19).replace("T", " ")
            : null,
          created_user_id: faker.helpers.arrayElement(users).user_id,
          column_name: faker.datatype.boolean()
            ? faker.number.int({ min: 1, max: 100 })
            : null,
        };
      })
    );

    // 8) Event Images
    await EventImages.bulkCreate(
      Array.from({ length: 200 }).map((_, i) => ({
        event_id: faker.helpers.arrayElement(events).event_id,
        image_url: faker.image.urlLoremFlickr({ category: "events" }),
        sequence: i + 1,
      }))
    );

    // 9) Event Schedules
    await EventSchedules.bulkCreate(
      Array.from({ length: 150 }).map(() => {
        const startDate = faker.date.future();
        const endDate = faker.date.future(1, startDate);
        return {
          event_id: faker.helpers.arrayElement(events).event_id,
          repeat_type: faker.helpers.arrayElement([
            "none",
            "daily",
            "weekly",
            "monthly",
            "yearly",
            "custom",
          ]),
          repeat_end_date: faker.datatype.boolean()
            ? faker.date.future().toISOString().split("T")[0]
            : null,
          is_all_day: faker.datatype.boolean() ? 1 : 0,
          custom_text: faker.lorem.sentence(),
          start_date: startDate.toISOString().split("T")[0],
          end_date: faker.datatype.boolean()
            ? endDate.toISOString().split("T")[0]
            : null,
          start_time: faker.datatype.boolean()
            ? faker.date.recent().toTimeString().split(" ")[0]
            : null,
          end_time: faker.datatype.boolean()
            ? faker.date.recent().toTimeString().split(" ")[0]
            : null,
        };
      })
    );

    // 10) Event Scraps
    await EventScraps.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        event_id: faker.helpers.arrayElement(events).event_id,
        user_id: faker.helpers.arrayElement(users).user_id,
      }))
    );

    // 11) Notice Categories
    const noticeCategories = await NoticeCategory.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      }))
    );

    // 12) Terms
    const terms = await Terms.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        is_required: faker.datatype.boolean() ? 1 : 0,
        status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
        version: faker.number.int({ min: 1, max: 5 }),
      }))
    );

    // 13) Notices
    const notices = await Notices.bulkCreate(
      Array.from({ length: 20 }).map(() => ({
        category_id: faker.helpers.arrayElement(noticeCategories).category_id,
        admin_id: faker.helpers.arrayElement(admins).admin_id,
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(),
        is_notice: faker.datatype.boolean() ? 1 : 0,
      }))
    );

    // 14) Notice Images
    await NoticeImages.bulkCreate(
      Array.from({ length: 60 }).map(() => ({
        notice_id: faker.helpers.arrayElement(notices).notice_id,
        image_url: faker.image.urlLoremFlickr({ category: "notices" }),
        sequence: faker.number.int({ min: 1, max: 5 }),
      }))
    );

    // 15) Article Comments
    const articleComments = await ArticleComments.bulkCreate(
      Array.from({ length: 200 }).map(() => ({
        article_id: faker.helpers.arrayElement(articles).article_id,
        parent_comment_id: faker.datatype.boolean()
          ? faker.helpers.arrayElement(articleComments)?.comment_id || null
          : null,
        status: faker.helpers.arrayElement(["active", "deleted", "reported"]),
        author_id: faker.helpers.arrayElement(users).user_id,
        content: faker.lorem.sentence(),
      }))
    );

    // 16) Article Comment Likes
    await ArticleCommentLikes.bulkCreate(
      Array.from({ length: 300 }).map(() => ({
        comment_id: faker.helpers.arrayElement(articleComments).comment_id,
        liked_user_id: faker.helpers.arrayElement(users).user_id,
      }))
    );

    // 17) Article Likes
    await ArticleLikes.bulkCreate(
      Array.from({ length: 400 }).map(() => ({
        article_id: faker.helpers.arrayElement(articles).article_id,
        liked_user_id: faker.helpers.arrayElement(users).user_id,
      }))
    );

    // 18) Peekling Categories
    const peeklingCategories = await PeeklingCategory.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      }))
    );

    // 19) Peekling
    const peekling = await Peekling.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        title: faker.lorem.words(2),
        description: faker.lorem.text(),
        min_people: faker.number.int({ min: 1, max: 10 }),
        max_people: faker.number.int({ min: 11, max: 100 }),
        schedule: faker.date.future(),
        category_id: faker.helpers.arrayElement(peeklingCategories).category_id,
        created_user_id: faker.helpers.arrayElement(users).user_id,
      }))
    );

    // 20) Peekling Images
    await PeeklingImages.bulkCreate(
      Array.from({ length: 100 }).map((_, i) => ({
        image_url: faker.image.urlLoremFlickr({ category: "peeking" }),
        sequence: i + 1,
        peekling_id: faker.helpers.arrayElement(peekling).peekling_id,
      }))
    );

    // 21) Refresh Tokens
    await RefreshTokens.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        user_id: faker.helpers.arrayElement(users).user_id,
        token: faker.string.uuid(),
      }))
    );

    // 22) Reports
    await Reports.bulkCreate(
      Array.from({ length: 100 }).map(() => ({
        type: faker.helpers.arrayElement([
          "user",
          "article",
          "comment",
          "event",
        ]),
        target_id: faker.number.int({ min: 1, max: 1000 }),
        reported_user_id: faker.helpers.arrayElement(users).user_id,
        reason: faker.lorem.sentence(),
      }))
    );

    // 23) Tickets
    const tickets = await Tickets.bulkCreate(
      Array.from({ length: 20 }).map(() => ({
        title: faker.lorem.words(3),
        status: faker.helpers.arrayElement([
          "open",
          "closed",
          "in_progress",
          "deleted",
        ]),
        created_user_id: faker.helpers.arrayElement(users).user_id,
      }))
    );

    // 24) Ticket Messages
    const ticketMessages = await TicketMessages.bulkCreate(
      Array.from({ length: 100 }).map(() => ({
        ticket_id: faker.helpers.arrayElement(tickets).ticket_id,
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
        created_user_id: faker.helpers.arrayElement(users).user_id,
      }))
    );

    // 25) Ticket Message Images
    await TicketMessageImages.bulkCreate(
      Array.from({ length: 150 }).map(() => ({
        ticket_message_id:
          faker.helpers.arrayElement(ticketMessages).ticket_message_id,
        image_url: faker.image.urlLoremFlickr({ category: "tickets" }),
        sequence: faker.number.int({ min: 1, max: 5 }),
      }))
    );

    // 26) User Blocks
    await UserBlocks.bulkCreate(
      Array.from({ length: 30 }).map(() => ({
        blocker_user_id: faker.helpers.arrayElement(users).user_id,
        blocked_user_id: faker.helpers.arrayElement(users).user_id,
        reason: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["active", "deleted"]),
      }))
    );

    // 27) User Filters
    await UserFilters.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        user_id: faker.helpers.arrayElement(users).user_id,
        date_ascending: faker.datatype.boolean() ? 1 : 0,
        price_ascending: faker.datatype.boolean() ? 1 : 0,
        distance_ascending: faker.datatype.boolean() ? 1 : 0,
        category: faker.number.int({ min: 1, max: 32 }),
      }))
    );

    // 28) User OAuth
    await UserOauth.bulkCreate(
      Array.from({ length: 50 }).map(() => ({
        user_id: faker.helpers.arrayElement(users).user_id,
        oauth_id: faker.number.int(),
        oauth_type: "kakao",
      }))
    );

    // 29) User Restrictions
    await UserRestrictions.bulkCreate(
      Array.from({ length: 20 }).map(() => ({
        user_id: faker.helpers.arrayElement(users).user_id,
        admin_id: faker.helpers.arrayElement(admins).admin_id,
        type: faker.helpers.arrayElement([
          "suspend",
          "ban",
          "canceled",
          "expired",
        ]),
        reason: faker.lorem.sentence(),
        ends_at: faker.datatype.boolean()
          ? faker.date.future().toISOString().split("T")[0]
          : null,
      }))
    );

    // 30) User Terms
    await UserTerms.bulkCreate(
      Array.from({ length: 100 }).map(() => ({
        user_id: faker.helpers.arrayElement(users).user_id,
        term_id: faker.helpers.arrayElement(terms).term_id,
        is_agreed: faker.datatype.boolean() ? 1 : 0,
      }))
    );

    // 31) Verification Codes
    await VerificationCode.bulkCreate(
      Array.from({ length: 100 }).map(() => ({
        identifier_type: faker.helpers.arrayElement(["phone", "email"]),
        identifier_value:
          faker.helpers.arrayElement(["phone", "email"]) === "phone"
            ? faker.phone.number("010-####-####")
            : faker.internet.email(),
        attempts: faker.number.int({ min: 0, max: 5 }),
        is_verified: faker.datatype.boolean() ? 1 : 0,
        code: faker.string.numeric(6),
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
