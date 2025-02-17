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

    const CREATE_ARTICLE_COUNT = 99999;
    const CREATE_COMMENT_COUNT = 999;
    const ANONYMOUS_ARTICLE_RATE = 50;
    const ANONYMOUS_COMMENT_RATE = 30;
    const REPLY_RATE = 90;
    const ANONYMOUS_REPLY_RATE = 30;
    const COMMENT_LIKE_RATE = 90;

    await models.Communities.bulkCreate(community);
    logger.warn("Community에 대한 Seeding이 실행되었습니다.", {
      action: "seed:community",
      actionType: "success",
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
      });
    }

    const users = await models.Users.findAll({
      attributes: ["userId"],
    });

    // 존재하는 사용자를 찾아, 랜덤하게 각 게시글에 작성자를 할당함
    articles.forEach((article) => {
      article.authorId = users[getRandomNumber(users.length) - 1].userId;
    });
    // console.log(articles);
    const createdArticles = await models.Articles.bulkCreate(articles);

    let comments = [];
    createdArticles.forEach((article) => {
      // 각 게시글 당 최대 N개의 댓글을 랜덤하게 생성함
      let commentCount = getRandomNumber(CREATE_COMMENT_COUNT);
      for (let i = 0; i < commentCount; i++) {
        comments.push({
          content: `${article.articleId} 게시글의 댓글 | ${getRandomCommentContent()}`,
          articleId: article.articleId,
          authorId: users[getRandomNumber(users.length) - 1].userId,
          isAnonymous: gacha(ANONYMOUS_COMMENT_RATE), // N% 확률로 익명임
        });
      }
    });

    comments.forEach((comment, idx) => {
      // 66% 확률로 대댓글 생성
      if (gacha(REPLY_RATE)) {
        comments.push({
          content: `댓글 ${idx + 1}의 대댓글 | ${getRandomCommentContent()}`,
          articleId: comments[idx].articleId,
          isAnonymous: gacha(ANONYMOUS_REPLY_RATE), // N% 확률로 익명임
          parentCommentId: idx + 1,
        });
        comment.authorId = users[getRandomNumber(users.length) - 1].userId;
      }
    });

    const createdComments = await models.ArticleComments.bulkCreate(comments);

    let commentLikes = [];
    createdComments.forEach((comment, idx) => {
      // 30% 확률로 좋아요 생성
      if (gacha(COMMENT_LIKE_RATE)) {
        commentLikes.push({
          commentId: comment.commentId,
          likedUserId: users[idx % users.length].userId,
        });
      }
    });

    await models.ArticleCommentLikes.bulkCreate(commentLikes);

    logger.warn("Community에 대한 Seeding이 완료되었습니다.", {
      action: "seed:community",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};
