// Description: 게시글 목록 조회를 위한 서비스 파일입니다.
import {
  InvalidQueryError,
  NotExistsError,
  NotAllowedError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op, fn, col } from "sequelize";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";
import config from "../../config/config.js";

export const validateArticleQuery = (queries) => {
  const { limit, cursor, query, communityId, authorId } = queries; // 쿼리 파라미터에서 limit와 cursor 추출

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
  if (authorId !== undefined && !isInteger(authorId)) {
    throw new InvalidQueryError("authorId는 정수여야 합니다.");
  }

  if (query !== undefined && query.trim().length < 2) {
    throw new InvalidQueryError(
      "검색어는 공백을 제외하고 2자 이상이여야 합니다."
    );
  }

  return;
};

/**
 * 전체 게시판 목록 조회
 */
export const getCommunities = async () => {
  const communities = await models.Communities.findAll({
    attributes: ["communityId", "title"],
    include: [
      {
        model: models.Articles,
        as: "articles",
        attributes: ["title"],
        order: [["createdAt", "DESC"]],
        limit: 2,
      },
    ],
  });

  if (!communities) {
    logger.error("게시판이 존재하지 않습니다.", {
      action: "community:getCommunities",
      actionType: "error",
    });
    throw new NotExistsError("게시판이 존재하지 않습니다.");
  }

  return { communities };
};

/**
 *  게시글의 썸네일 정보를 가공합니다.
 */
const getThumbnail = (articleImages) => {
  if (articleImages.length > 0) {
    const thumbnail = addBaseUrl(articleImages[0].dataValues.imageUrl);
    return thumbnail;
  }
  return null;
};

/**
 *  게시글의 작성자 정보를 가공하고 불필요한 필드를 제거합니다.
 */
const getAuthorInfo = (article, isAnonymous) => {
  if (isAnonymous) {
    delete article.author.dataValues;
    return { nickname: null, profileImage: addBaseUrl(config.PEEKLE.DEFAULT_PROFILE_IMAGE), authorId: null };
  }

  const author = article.author.dataValues;
  const authorInfo = {
    nickname: author.nickname,
    // 기본 이미지인 경우 null로 전송
    profileImage: addBaseUrl(author.profileImage),
    authorId: author.userId,
  };

  // 불필요한 필드 제거
  delete article.author.dataValues;

  return authorInfo;
};
/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다
 */
export const getArticles = async (
  communityId,
  authorId,
  query,
  { limit, cursor = null },
  userId
) => {
  // 사용자가 다른 사용자가 작성한 글을 조회하는 경우 차단
  if (authorId !== undefined && (parseInt(authorId, 10) !== parseInt(userId, 10))) {
      throw new NotAllowedError("다른 사용자가 작성한 게시글 목록을 조회할 수 없습니다");
    }

  // 게시글 조회 조건 설정
  const whereCondition = {
    ...(query && {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } }, // 제목에 검색어 포함
        { content: { [Op.like]: `%${query}%` } }, // 내용에 검색어 포함
      ],
    }),
    ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 기반 페이징
  };

  // communityId가 있을 경우 필터링 추가
  if (communityId) {
    whereCondition.communityId = communityId;
  }

  // authorId가 있을 경우 필터링 추가
  if (authorId !== undefined) {
    whereCondition.authorId = authorId;
  }

  // 게시글 조회
  const articles = await models.Articles.findAll({
    where: whereCondition,
    attributes: { exclude: ["authorId"] },
    order: [["createdAt", "DESC"]],
    limit: limit + 1, // 다음 페이지 여부 확인을 위해 limit보다 1개 더 가져옴
    include: [
      {
        model: models.Communities,
        as: "community",
        attributes: ["communityId"], // 필요한 필드만 가져오기
      },
      {
        model: models.ArticleComments,
        as: "articleComments",
        attributes: ["commentId"],
        where: { status: { [Op.ne]: "deleted" } },
        required: false,
      },
      {
        model: models.ArticleLikes,
        as: "articleLikes",
        attributes: ["likedUserId"],
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
      {
        model: models.Users,
        as: "author",
        attributes: ["userId", "nickname", "profileImage"],
        required: true,
      },
    ],
  });

  if (!articles.length) {
    logger.error("게시글이 존재하지 않습니다.", {
      action: "community:getArticles",
      actionType: "error",
      communityId: communityId || "전체",
    });
    throw new NotExistsError("게시글이 존재하지 않습니다.");
  }

  // 데이터 가공
  const processedArticles = articles.map((article) => {
    return {
      communityId: article.community ? article.community.communityId : null,
      articleId: article.articleId,
      title: article.title,
      content: article.content,
      isAnonymous: article.isAnonymous,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      articleComments: article.articleComments.length, // 댓글 개수만 반환
      articleLikes: article.articleLikes.length, // 좋아요 개수만 반환
      isLikedByUser: userId
        ? article.articleLikes.some(
            (like) => Number(like.likedUserId) === Number(userId)
          )
        : false,
      thumbnail: getThumbnail(article.articleImages), // 대표 이미지 처리
      authorInfo: getAuthorInfo(article, article.isAnonymous),
    };
  });

  // 다음 커서 설정
  const hasNextPage = processedArticles.length > limit;
  const nextCursor = hasNextPage
    ? processedArticles[limit - 1].articleId
    : null;
  if (hasNextPage) {
    processedArticles.pop();
  }

  logger.debug("게시글 조회 완료", {
    action: "community:getArticles",
    actionType: "success",
    data: {
      communityId: communityId || "전체",
      articleCount: processedArticles.length,
      limit: limit,
      nextCursor: nextCursor,
      hasNextPage: hasNextPage,
    },
  });

  return {
    articles: processedArticles,
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
      {
        model: models.Users,
        as: "author",
        attributes: ["userId", "nickname", "profileImage"], // 필요한 필드만 가져오기
        required: true,
      },
    ],
  });
  // 좋아요, 댓글 수 및 썸네일만을 반환하도록 가공
  likedArticles.map((article) => {
    // console.log(article);
    article = article.dataValues;
    article.articleComments = article.articleComments.length; // 댓글 개수만 추출
    article.articleLikes = article.articleLikes.length; // 좋아요 개수만 추출
    article.thumbnail = getThumbnail(article.articleImages); // 썸네일 정보 추출
    delete article.articleImages; // 불필요한 필드 제거
    article.authorInfo = getAuthorInfo(article, article.isAnonymous); // 작성자 정보 추출
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
