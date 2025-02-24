import logger from "../../utils/logger/logger.js";
import models from "../index.js";

import {
  community,
  getRandomNumber,
  getRandomArticleContent,
  getRandomCommentContent,
  gacha,
} from "./data.js";

export const seedCommunity = async () => {
  const CREATE_ARTICLE_COUNT = 1000;
  const CREATE_COMMENT_COUNT = 100;
  const ANONYMOUS_ARTICLE_RATE = 50;
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
