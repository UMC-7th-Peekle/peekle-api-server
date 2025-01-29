import logger from "../../utils/logger/logger.js";
import models from "../index.js";
import fs from "fs";

/*
  // truncate: true,
  // cascade: true,
  // force: true,

  truncate를 해야만 auto-increment가 초기화됨.
*/
import {
  groups,
  terms,
  community,
  articleContentSample,
  commentContentSample,
  getRandomNumber,
  getRandomArticleContent,
  getRandomCommentContent,
  gacha,
} from "./data.js";

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

    await models.Terms.bulkCreate(terms);

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
    await models.UserTerms.bulkCreate(userTerms);

    logger.warn("Terms에 대한 Seeding이 실행되었습니다.", {
      action: "seed:terms",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};

export const seedCommunity = async () => {
  try {
    await models.Communities.destroy({
      where: {},
    });
    await models.Articles.destroy({
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
    await models.sequelize.query("TRUNCATE TABLE article_comments;");
    await models.sequelize.query("TRUNCATE TABLE article_comment_likes;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    const CREATE_ARTICLE_COUNT = 100000;
    const CREATE_COMMENT_COUNT = 1000;
    const ANONYMOUS_ARTICLE_RATE = 50;
    const ANONYMOUS_COMMENT_RATE = 30;
    const REPLY_RATE = 90;
    const ANONYMOUS_REPLY_RATE = 30;
    const COMMENT_LIKE_RATE = 90;

    const BATCH_SIZE = 5000;
    let QUERY_COUNT = 0;

    await models.Communities.bulkCreate(community);
    console.log(
      `[Seeding] Community Seeded | ${community.length} rows | Total Query ${++QUERY_COUNT}`
    );

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
      if (articles.length >= BATCH_SIZE) {
        await models.Articles.bulkCreate(articles);
        articles = [];
        console.log(
          `[Seeding] Article Seeded | Total ${i} rows | Total Query ${++QUERY_COUNT}`
        );
      } else if (i === CREATE_ARTICLE_COUNT) {
        await models.Articles.bulkCreate(articles);
        articles = [];
        console.log(
          `[Seeding] Article Seeded | Total ${i} rows | Total Query ${++QUERY_COUNT}`
        );
      }
    }
    // console.log(articles);

    // article 생성까지는 무리가 안가니 Batch 분리 X
    console.log(
      `[Seeding] Article Seeded | Total ${CREATE_ARTICLE_COUNT} rows`
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
        await models.ArticleComments.bulkCreate(comments);
        CREATED_COMMENT_COUNT += comments.length;
        comments = [];
        console.log(
          `[Seeding] 댓글 Seed 됨 | Total ${CREATED_COMMENT_COUNT} rows | Total Query ${++QUERY_COUNT}`
        );
      } else if (i === CREATE_ARTICLE_COUNT) {
        await models.ArticleComments.bulkCreate(comments);
        CREATED_COMMENT_COUNT += comments.length;
        comments = [];
        console.log(
          `[Seeding] 댓글 Seed 됨 | Total ${CREATED_COMMENT_COUNT} rows | Total Query ${++QUERY_COUNT}`
        );
      }
    }

    let replys = [];
    for (let i = 1; i <= CREATED_COMMENT_COUNT; i++) {
      // 66% 확률로 대댓글 생성
      if (gacha(REPLY_RATE)) {
        replys.push({
          content: `댓글 ${i}의 대댓글 | ${getRandomCommentContent()}`,
          articleId: comments[idx].articleId,
          isAnonymous: gacha(ANONYMOUS_REPLY_RATE), // N% 확률로 익명임
          parentCommentId: i,
          authorId: users[getRandomNumber(users.length) - 1].userId,
        });
      }
      if (replys.length >= BATCH_SIZE) {
        await models.ArticleComments.bulkCreate(replys);
        CREATED_COMMENT_COUNT += replys.length;
        replys = [];
        console.log(
          `[Seeding] ArticleComments_Reply Seeded | Total ${CREATED_COMMENT_COUNT} rows | Total Query ${++QUERY_COUNT}`
        );
      } else if (i === CREATED_COMMENT_COUNT) {
        await models.ArticleComments.bulkCreate(replys);
        CREATED_COMMENT_COUNT += replys.length;
        replys = [];
        console.log(
          `[Seeding] ArticleComments_Reply Seeded | Total ${CREATED_COMMENT_COUNT} rows | Total Query ${++QUERY_COUNT}`
        );
      }
    }

    let CREATED_COMMENT_LIKE_COUNT = 0;
    let commentLikes = [];
    for (let i = 1; i <= CREATED_COMMENT_COUNT; i++) {
      // 30% 확률로 좋아요 생성
      if (gacha(COMMENT_LIKE_RATE)) {
        commentLikes.push({
          commentId: comment.commentId,
          likedUserId: users[idx % users.length].userId,
        });
      }
      if (commentLikes.length >= BATCH_SIZE) {
        await models.ArticleCommentLikes.bulkCreate(commentLikes);
        CREATED_COMMENT_LIKE_COUNT += commentLikes.length;
        commentLikes = [];
        console.log(
          `[Seeding] ArticleCommentLikes Seeded | Total ${CREATED_COMMENT_LIKE_COUNT} rows | Total Query ${++QUERY_COUNT}`
        );
      } else if (i === CREATED_COMMENT_COUNT) {
        await models.ArticleCommentLikes.bulkCreate(commentLikes);
        CREATED_COMMENT_LIKE_COUNT += commentLikes.length;
        commentLikes = [];
        console.log(
          `[Seeding] ArticleCommentLikes Seeded | Total ${CREATED_COMMENT_LIKE_COUNT} rows | Total Query ${++QUERY_COUNT}`
        );
      }
    }

    logger.warn("Community에 대한 Seeding이 완료되었습니다.", {
      action: "seed:community",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};
