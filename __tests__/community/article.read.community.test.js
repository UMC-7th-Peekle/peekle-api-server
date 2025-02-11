import * as articleReadService from "../../services/community/article.read.community.service.js";
import models from "../../models/index.js";
import {
  InvalidQueryError,
  NotExistsError,
} from "../../utils/errors/errors.js";

// Mock dependencies
jest.mock("../../models/index.js");

describe("Article Read Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });

  describe("getArticles()", () => {
    it("should successfully return articles with pagination", async () => {
      models.Communities.findOne.mockResolvedValue({
        dataValues: {
          communityId: 4,
          articles: [
            {
              dataValues: {
                articleId: 1,
                title: "Test Article 1",
                content: "Content 1",
                isAnonymous: false,
                createdAt: new Date().toISOString(),
                articleComments: [], // 댓글이 없는 경우에도 빈 배열로 설정
                articleLikes: [], // 좋아요가 없는 경우에도 빈 배열로 설정
                articleImages: [], // 이미지가 있는 경우 설정
                author: {
                  dataValues: {
                    userId: 3,
                    nickname: "User1",
                    profileImage: "profile1.jpg",
                  },
                },
              },
            },
            {
              dataValues: {
                articleId: 2,
                title: "Test Article 2",
                content: "Content 2",
                isAnonymous: false,
                createdAt: new Date().toISOString(),
                articleComments: [{ dataValues: { commentId: 1 } }], // 댓글이 있는 경우 설정
                articleLikes: [{ dataValues: { likedUserId: 2 } }], // 좋아요가 있는 경우 설정
                articleImages: [
                  {
                    dataValues: {
                      articleImageId: 101,
                      articleId: 1,
                      imageUrl: "image1.jpg",
                      sequence: 1,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  },
                ], // 이미지가 있는 경우 설정
                author: {
                  dataValues: {
                    userId: 4,
                    nickname: "User2",
                    profileImage: "profile2.jpg",
                  },
                },
              },
            },
          ],
        },
      });

      const result = await articleReadService.getArticles(4, "Test", {
        limit: 10,
        cursor: null,
      });

      expect(models.Communities.findOne).toHaveBeenCalledWith({
        where: { communityId: 4 },
        include: expect.any(Array),
      });
      expect(result.articles).toHaveLength(2);

      // 첫 번째 게시글 검증
      expect(result.articles[0].dataValues.title).toBe("Test Article 1");
      expect(result.articles[0].dataValues.articleComments).toBe(0); // 댓글이 없으므로 0
      expect(result.articles[0].dataValues.articleLikes).toBe(0); // 좋아요가 없으므로 0
      expect(result.articles[0].dataValues.thumbnail).toBeNull(); // 이미지가 없으므로 null
      expect(result.articles[0].dataValues.authorInfo.nickname).toBe("User1");

      // 두 번째 게시글 검증
      expect(result.articles[1].dataValues.title).toBe("Test Article 2");
      expect(result.articles[1].dataValues.articleComments).toBe(1); // 댓글 개수 검증
      expect(result.articles[1].dataValues.articleLikes).toBe(1); // 좋아요 개수 검증
      expect(result.articles[1].dataValues.thumbnail).toContain("image1.jpg"); // 이미지 존재 검증
      expect(result.articles[1].dataValues.authorInfo.nickname).toBe("User2");
    });

    it("should throw NotExistsError if the community does not exist", async () => {
      models.Communities.findOne.mockResolvedValue(null);

      await expect(
        articleReadService.getArticles(999, null, { limit: 10, cursor: null })
      ).rejects.toThrow(NotExistsError);
    });
  });

  describe("getLikedArticles()", () => {
    it("should successfully return liked articles with pagination", async () => {
      models.ArticleLikes.findAll.mockResolvedValue([
        { articleId: 1, articleLikesId: 1 },
      ]);

      models.Articles.findAll.mockResolvedValue([
        {
          dataValues: {
            articleId: 1,
            title: "Liked Article 1",
            content: "This is a liked article.",
            isAnonymous: true,
            createdAt: new Date().toISOString(),
            articleComments: [
              { dataValues: { commentId: 1, content: "댓글 1" } },
            ],
            articleLikes: [{ dataValues: { likedUserId: 2 } }],
            articleImages: [{ dataValues: { imageUrl: "image1.jpg" } }],
            author: {
              dataValues: {
                userId: 3,
                nickname: "User1",
                profileImage: "profile1.jpg",
              },
            },
          },
        },
        {
          dataValues: {
            articleId: 2,
            title: "Liked Article 2",
            content: "Another liked article.",
            isAnonymous: false,
            createdAt: new Date().toISOString(),
            articleComments: [],
            articleLikes: [{ dataValues: { likedUserId: 3 } }],
            articleImages: [{ dataValues: { imageUrl: "image2.jpg" } }],
            author: {
              dataValues: {
                userId: 4,
                nickname: "User2",
                profileImage: "profile2.jpg",
              },
            },
          },
        },
      ]);

      const result = await articleReadService.getLikedArticles(1, {
        limit: 10,
        cursor: null,
      });

      expect(models.ArticleLikes.findAll).toHaveBeenCalledWith({
        where: {
          likedUserId: 1,
        },
        limit: 11,
        attributes: ["articleLikesId", "articleId"],
        order: [["createdAt", "DESC"]],
      });

      expect(result.articles).toHaveLength(2);

      expect(result.articles[0].dataValues.title).toBe("Liked Article 1");
      expect(result.articles[0].dataValues.articleComments).toBe(1);
      expect(result.articles[0].dataValues.articleLikes).toBe(1);
      expect(result.articles[0].dataValues.thumbnail).toContain("image1.jpg");
      expect(result.articles[0].dataValues.authorInfo.nickname).toBeNull;

      expect(result.articles[1].dataValues.title).toBe("Liked Article 2");
      expect(result.articles[1].dataValues.articleComments).toBe(0);
      expect(result.articles[1].dataValues.articleLikes).toBe(1);
      expect(result.articles[1].dataValues.thumbnail).toContain("image2.jpg");
      expect(result.articles[1].dataValues.authorInfo.nickname).toBe("User2");
    });

    it("should return an empty array if no liked articles are found", async () => {
      models.ArticleLikes.findAll.mockResolvedValue([]);

      const result = await articleReadService.getLikedArticles(1, {
        limit: 10,
        cursor: null,
      });

      expect(result.articles).toHaveLength(0);
    });
  });

  describe("validateArticleQuery()", () => {
    it("should pass validation for correct query parameters", () => {
      expect(() => {
        articleReadService.validateArticleQuery({
          limit: "10",
          cursor: "5",
          communityId: "4",
          query: "Test",
        });
      }).not.toThrow();
    });

    it("should throw InvalidQueryError for incorrect limit", () => {
      expect(() => {
        articleReadService.validateArticleQuery({ limit: "invalid" });
      }).toThrow(InvalidQueryError);
    });

    it("should throw InvalidQueryError for incorrect cursor", () => {
      expect(() => {
        articleReadService.validateArticleQuery({ cursor: "invalid" });
      }).toThrow(InvalidQueryError);
    });

    it("should throw InvalidQueryError if query length is less than 2 characters", () => {
      expect(() => {
        articleReadService.validateArticleQuery({ query: "a" });
      }).toThrow(InvalidQueryError);
    });
  });
});
