// Description: 게시글 목록 조회를 위한 서비스 파일입니다.
import {
  InvalidQueryError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op, fn, col } from "sequelize";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

export const validateArticleQuery = (queries) => {
  const { limit, cursor, query, communityId } = queries; // 쿼리 파라미터에서 limit와 cursor 추출

  const isInteger = (value) => /^\d+$/.test(value); // 정수만 허용
  if (limit !== undefined && !isInteger(limit)) {
    throw new InvalidQueryError("limit는 정수여야 합니다.");
  }
  if (cursor !== undefined && !isInteger(cursor)) {
    throw new InvalidQueryError("cursor는 정수여야 합니다.");
  }
  if (communityId !== undefined && !isInteger(communityId)) {
    throw new InvalidQueryError("communityId는 정수여야 합니다.");
  }

  if (query !== undefined && query.trim().length < 2) {
    throw new InvalidQueryError(
      "검색어는 공백을 제외하고 2자 이상이여야 합니다."
    );
  }

  return;
};

/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다
 */
export const getArticles = async (
  communityId,
  query,
  { limit, cursor = null }
) => {
  // 게시판 및 게시글 조회
  const community = await models.Communities.findOne({
    where: { ...(communityId && { communityId: communityId }) },
    include: [
      {
        model: models.Articles,
        as: "articles",
        attributes: { exclude: ["authorId"] }, // 모든 필드 가져오기
        where: {
          ...(query && {
            [Op.or]: [
              {
                title: {
                  [Op.like]: `%${query}%`, // 제목에 검색어 포함
                },
              },
              {
                content: {
                  [Op.like]: `%${query}%`, // 내용에 검색어 포함
                },
              },
            ],
          }),
          ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 조건: articleId 기준
          // ...(communityId && { communityId: communityId }), // 게시판 필터링
        },
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit: limit + 1, // 조회 개수 제한
        required: false, // 게시글이 없는 경우에도 커뮤니티는 반환
        include: [
          {
            model: models.ArticleComments,
            as: "articleComments",
            attributes: ["commentId"], // 댓글 개수만 가져오기 위해 commentId만 추출
            where: { status: { [Op.ne]: "deleted" } }, // 삭제되지 않은 댓글만 가져오기
            required: false, // 댓글이 없는 경우에도 커뮤니티는 반환
            separate: true,
          },
          {
            model: models.ArticleLikes,
            as: "articleLikes",
            attributes: ["likedUserId"], // 좋아요 개수만 가져오기 위해 userId만 추출
            required: false, // 좋아요가 없는 경우에도 커뮤니티는 반환
            separate: true,
          },
          {
            model: models.ArticleImages,
            as: "articleImages",
            attributes: ["imageUrl", "sequence"], // 필요한 필드만 가져오기
            where: { sequence: 1 }, // 대표 이미지만 가져오기
            limit: 1,
            required: false, // 이미지가 없는 경우에도 커뮤니티는 반환
            separate: true,
          },
          {
            model: models.Users,
            as: "author",
            attributes: ["userId", "nickname", "profileImage"], // 필요한 필드만 가져오기
            required: true,
          },
        ],
      },
    ],
  });
  // console.log(
  //   `communityId: ${communityId}, query: ${query}, limit: ${limit}, cursor: ${cursor}`
  // );
  // console.log(community.dataValues.articles[0].dataValues.author.dataValues.profileImage);

  if (!community) {
    // 결과값이 존재하지 않는 경우
    logger.error("존재하지 않는 게시판입니다.", {
      action: "community:getArticles",
      actionType: "error",
      communityId: communityId,
    });
    throw new NotExistsError("존재하지 않는 게시판입니다.");
  }

  // 게시글만 추출
  const articles = community.dataValues.articles; // dataValues가 빠져 있어서 오류 발생했었음

  // 좋아요, 댓글 수 및 썸네일만을 반환하도록 가공
  articles.map((article) => {
    article = article.dataValues;
    article.articleComments = article.articleComments.length; // 댓글 개수만 추출
    article.articleLikes = article.articleLikes.length; // 좋아요 개수만 추출
    if (article.articleImages.length > 0) {
      article.articleImages = addBaseUrl(
        article.articleImages[0].dataValues.imageUrl
      ); // 대표 이미지 URL
      // dataValues가 빠져 있어서 오류 발생했었음
    } else {
      article.articleImages = null;
    }
    article.thumbnail = article.articleImages;
    delete article.articleImages;

    // 작성자 정보 처리
    if (article.isAnonymous === true) {
      // 익명 상태면 모든 작성자 정보를 null로 설정
      // test 코드를 위해서 authorInfo 자체를 null로 보내는 것이 아닌 각각을 null로 설정
      article.authorInfo = {
        nickname: null,
        profileImage: null,
        authorId: null,
      };
      
    } else {
      article.author = article.author.dataValues;
      article.author.profileImage = addBaseUrl(article.author.profileImage);

      // author.userId를 authorId로 변경
      article.author.authorId = article.author.userId;
      delete article.author.userId;

      // author를 authorInfo로 변경
      article.authorInfo = article.author;
    }
    delete article.author;
  });

  // 다음 커서 설정
  const hasNextPage = articles.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage ? articles[limit - 1].articleId : null;
  if (hasNextPage) {
    articles.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  logger.debug("게시글 조회 완료", {
    action: "community:getArticles",
    actionType: "success",
    data: {
      communityId: communityId,
      articleCount: articles.length,
      limit: limit,
      nextCursor: nextCursor,
      hasNextPage: hasNextPage,
    },
  });

  return {
    articles,
    nextCursor,
    hasNextPage,
  };
};

export const getLikedArticles = async (userId, { limit, cursor = null }) => {
  // cursor는 articleLikesId 기준
  const likedArticleIds = await models.ArticleLikes.findAll({
    where: {
      likedUserId: userId,
      ...(cursor && { articleLikesId: { [Op.lt]: cursor } }),
    }, // 커서 조건: articleId 기준 },
    limit: limit + 1, // 조회 개수 제한
    attributes: ["articleLikesId", "articleId"],
    order: [["createdAt", "DESC"]],
  });

  const articleIds = likedArticleIds.map((like) => like.articleId);
  const likedArticles = await models.Articles.findAll({
    where: {
      articleId: {
        [Op.in]: articleIds,
      },
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: models.ArticleComments,
        as: "articleComments",
        attributes: ["commentId"], // 댓글 정보
        where: { status: { [Op.ne]: "deleted" } }, // 삭제된 댓글 제외
        required: false, // 댓글이 없어도 Article은 가져옴
      },
      {
        model: models.ArticleImages,
        as: "articleImages",
        attributes: ["imageUrl"], // 이미지 정보
        where: { sequence: 1 }, // 특정 조건(대표 이미지)
        required: false, // 이미지가 없어도 Article은 가져옴
      },
      {
        model: models.ArticleLikes,
        as: "articleLikes",
        attributes: ["likedUserId"], // 좋아요 개수
        separate: true, // 좋아요 수 계산을 위해 쿼리를 분리
        required: false,
      },
    ],
  });
  // 좋아요, 댓글 수 및 썸네일만을 반환하도록 가공
  likedArticles.map((article) => {
    // console.log(article);
    article = article.dataValues;
    article.articleComments = article.articleComments.length; // 댓글 개수만 추출
    article.articleLikes = article.articleLikes.length; // 좋아요 개수만 추출
    if (article.articleImages.length > 0) {
      article.articleImages = addBaseUrl(
        article.articleImages[0].dataValues.imageUrl
      ); // 대표 이미지 URL
      // dataValues가 빠져 있어서 오류 발생했었음
    } else {
      article.articleImages = null;
    }
    article.thumbnail = article.articleImages;
    delete article.articleImages;
  });

  // 다음 커서 설정
  const hasNextPage = likedArticleIds.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage
    ? likedArticleIds[limit - 1].articleLikesId
    : null;
  if (hasNextPage) {
    likedArticleIds.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
    likedArticles.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  logger.debug("게시글 조회 완료", {
    action: "community:getLikedArticles",
    actionType: "success",
    data: {
      articleCount: likedArticles.length,
      limit: limit,
      nextCursor: nextCursor,
      hasNextPage: hasNextPage,
    },
  });

  return {
    articles: likedArticles,
    nextCursor,
    hasNextPage,
  };
};

/*

// 게시글 조회 변경 시도

const queriedArticles = await models.Articles.findAll({
  where: {
    ...(query && {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${query}%`, // 제목에 검색어 포함
          },
        },
        {
          content: {
            [Op.like]: `%${query}%`, // 내용에 검색어 포함
          },
        },
      ],
    }),
    ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 조건: articleId 기준
    ...(communityId && { communityId: communityId }), // 게시판 필터링
  },
  attributes: { exclude: [] }, // 모든 필드 가져오기
  order: [["createdAt", "DESC"]],
  limit: limit + 1,
  include: [
    {
      model: models.ArticleComments,
      as: "articleComments",
      attributes: ["commendId"],
      // attributes: [[fn("COUNT", col("comment_id")), "commentCount"]], // 댓글 개수만 추출
      // separate: true,
      // group: ["article_id", "comment_id"], // article_id 별로 그룹화
      where: { status: { [Op.ne]: "deleted" } }, // 삭제되지 않은 댓글만 가져오기
      required: false,
    },
    {
      model: models.ArticleLikes,
      as: "articleLikes",
      attributes: ["likedUserId"],
      // attributes: [[fn("COUNT", col("liked_user_id")), "likeCount"]], // 좋아요 개수만 추출
      // separate: true,
      // group: ["article_id", "liked_user_id"], // article_id 별로 그룹화
      required: false,
    },
    {
      model: models.ArticleImages,
      as: "articleImages",
      attributes: ["imageUrl", "sequence"], // 필요한 필드만 가져오기
      where: { sequence: 1 }, // 대표 이미지만 가져오기
      limit: 1,
      required: false,
    },
  ],
});

console.log(queriedArticles);

// 좋아요한 게시글 가져오기 변경 시도 부분

const likedArticles = await models.Articles.findAll({
  include: [
    {
      model: models.ArticleLikes,
      as: "articleLikes",
      attributes: ["createdAt"],
      where: { likedUserId: userId },
      required: true,
    },
    {
      model: models.ArticleComments,
      as: "articleComments",
      attributes: ["commentId"],
      where: { status: { [Op.ne]: "deleted" } },
      required: false,
    },
    {
      model: models.ArticleImages,
      as: "articleImages",
      attributes: ["imageUrl", "sequence"],
      where: { sequence: 1 },
      limit: 1,
      required: false,
    },
  ],
  where: {
    ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 조건: articleId 기준
  },
  order: [["createdAt", "DESC"]],
  limit: limit + 1, // 조회 개수 제한
});

const likedArticles = await models.ArticleLikes.findAll({
  attributes: ["articleId"], // 좋아요 누른 ArticleId만 가져옴
  where: { likedUserId: userId }, // 특정 유저가 좋아요를 누른 데이터 필터링
  include: {
    model: models.Articles,
    as: "article",
    attributes: ["articleId", "title", "content"], // Article에서 필요한 데이터만 가져옴
    // include.seperate 때문에 where 및 limit을 사용하지 못함.
    // 대체할 수 있는 방법을 알아봐야 합니다.

    // where: {
    //   ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 조건: articleId 기준
    // },
    // limit: limit + 1, // 조회 개수 제한
    order: [["createdAt", "DESC"]], // 최신 순으로 정렬
    include: [
      // Article에 달린 댓글
      {
        model: models.ArticleComments,
        as: "articleComments",
        attributes: ["commentId", "content"], // 댓글 정보
        where: { status: { [Op.ne]: "deleted" } }, // 삭제된 댓글 제외
        required: false, // 댓글이 없어도 Article은 가져옴
      },
      // Article에 포함된 이미지
      {
        model: models.ArticleImages,
        as: "articleImages",
        attributes: ["imageUrl", "sequence"], // 이미지 정보
        where: { sequence: 1 }, // 특정 조건(대표 이미지)
        required: false, // 이미지가 없어도 Article은 가져옴
      },
      // Article에 달린 좋아요 수
      {
        model: models.ArticleLikes,
        as: "articleLikes",
        attributes: ["likedUserId"], // 좋아요 개수
        separate: true, // 좋아요 수 계산을 위해 쿼리를 분리
        // TODO : sepearate 옵션에 대해서 공부하기 .. ORM의 내부 동작에 관하여 ..
        required: false,
      },
    ],
  },
});

console.log(likedArticles[0].article);
*/
