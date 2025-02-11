import logger from "../../utils/logger/logger.js";
import models from "../index.js";

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
  getRandomNumber,
  getRandomArticleContent,
  getRandomImageUrl,
  getRandomCommentContent,
  gacha,
  userSample,
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
  const CREATE_ARTICLE_COUNT = 1000;
  const CREATE_ARITCLE_IMAGE_COUNT = 5;
  const CREATE_COMMENT_COUNT = 100;
  const ANONYMOUS_ARTICLE_RATE = 50;
  const ANONYMOUS_ARTICLE_IMAGE_RATE = 50;
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
      if (gacha(ANONYMOUS_ARTICLE_IMAGE_RATE)) {
        for(let j = 0; j < articleImageCount; j++) {
          articleImages.push({
            articleId: i,
            imageUrl: `/articles${getRandomImageUrl()}`,
            sequence: j+1,

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
        await models.ArticleImages.bulkCreate(articleImages, { logging: false });
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
        await models.ArticleImages.bulkCreate(articleImages, { logging: false });
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
