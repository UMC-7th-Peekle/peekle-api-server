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
        phone: faker.phone.number().slice(0, 20),
        email: faker.internet.email(),
        lastNicknameChangeDate: faker.date.recent().toISOString().split("T")[0],
        profileImage: faker.image.url(),
        status: faker.helpers.arrayElement(["active", "dormant", "terminated"]),
        lastActivityDate: faker.date.recent().toISOString().split("T")[0],
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

    // 6) event_schedules
    const schedules = await EventSchedules.bulkCreate(
      Array.from({ length: 50 }).map(() => {
        const startDate = faker.date.future();
        const endDate = faker.date.future(1, startDate);
        return {
          repeatType: faker.helpers.arrayElement([
            "daily",
            "weekly",
            "monthly",
            "once",
          ]),
          repeatEndDate: faker.datatype.boolean()
            ? faker.date.future(1, endDate).toISOString().split("T")[0]
            : null,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          startTime: faker.date
            .future()
            .toISOString()
            .split("T")[1]
            .split(".")[0],
          endTime: faker.date
            .future()
            .toISOString()
            .split("T")[1]
            .split(".")[0],
        };
      })
    );

    // 7) events
    const events = await Events.bulkCreate(
      Array.from({ length: 100 }).map(() => {
        const applicationStart = faker.date.future();
        const applicationEnd = faker.date.future(1, applicationStart);
        return {
          scheduleId: faker.helpers.arrayElement(schedules).scheduleId,
          title: faker.lorem.words(3),
          content: faker.lorem.paragraphs(),
          price: faker.number.int({ min: 1000, max: 100000 }),
          categoryId: faker.helpers.arrayElement(eventCategories).categoryId,
          location: faker.location.streetAddress(),
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

    // 8) event_images
    await EventImages.bulkCreate(
      Array.from({ length: 200 }).map((_, i) => ({
        eventId: faker.helpers.arrayElement(events).eventId,
        imageUrl: faker.image.url(),
        sequence: i + 1,
      }))
    );

    // 9) notice_category
    await NoticeCategory.bulkCreate(
      Array.from({ length: 5 }).map(() => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      }))
    );

    // 10) terms
    await Terms.bulkCreate(
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
