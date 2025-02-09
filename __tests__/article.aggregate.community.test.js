import * as articleAggregateService from "../services/community/article.aggregate.community.service.js";
import models from "../models/index.js";
import { NotExistsError, InvalidQueryError } from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("게시글 집계", () => {
  // 동적으로 현재 시간과 3일 전 시간 설정
  const currentTime = new Date().toISOString();
  const threeDaysAgo = new Date(
    Date.now() - 3 * 24 * 60 * 60 * 1000
  ).toISOString();

  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });

  describe("getPopularArticles()", () => {
    it("인기 게시글을 성공적으로 반환해야 함", async () => {
      // 커뮤니티 존재 확인
      models.Communities.findOne.mockResolvedValue({ communityId: 4 });

      // 인기 게시글 Mock 데이터 설정
      models.Articles.findAll.mockResolvedValue([
        {
          dataValues: {
            articleId: 1,
            title: "Popular Article 1",
            content: "This is a popular article.",
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
            likeCount: 10,
            commentCount: 5,
          },
        },
        {
          dataValues: {
            articleId: 2,
            title: "Popular Article 2",
            content: "Another liked article.",
            isAnonymous: false,
            createdAt: new Date().toISOString(),
            articleComments: [],
            articleLikes: [{ dataValues: { likedUserId: 3 } }],
            articleImages: [],
            author: {
              dataValues: {
                userId: 4,
                nickname: "User2",
                profileImage: "profile2.jpg",
              },
            },
            likeCount: 8,
            commentCount: 7,
          },
        },
      ]);

      const result = await articleAggregateService.getPopularArticles(
        4,
        threeDaysAgo,
        currentTime
      );

      expect(result.articles).toHaveLength(2);

      expect(result.articles[0].dataValues.title).toBe("Popular Article 1");
      expect(result.articles[0].dataValues.likeCount).toBe(10);
      expect(result.articles[0].dataValues.commentCount).toBe(5);
      expect(result.articles[0].dataValues.authorInfo.nickname).toBeNull();
      expect(result.articles[0].dataValues.thumbnail).toContain("image1.jpg");

      expect(result.articles[1].dataValues.title).toBe("Popular Article 2");
      expect(result.articles[1].dataValues.likeCount).toBe(8);
      expect(result.articles[1].dataValues.commentCount).toBe(7);
      expect(result.articles[1].dataValues.authorInfo.nickname).toBe("User2");
      expect(result.articles[1].dataValues.thumbnail).toBeNull();
    });

    it("커뮤니티가 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
      models.Communities.findOne.mockResolvedValue(null); // 커뮤니티가 존재하지 않음

      await expect(
        articleAggregateService.getPopularArticles(
          999, // 존재하지 않는 communityId
          threeDaysAgo,
          currentTime
        )
      ).rejects.toThrow(NotExistsError);
    });

    it("게시글이 없으면 빈 배열을 반환해야 함", async () => {
      models.Communities.findOne.mockResolvedValue({ communityId: 4 });
      models.Articles.findAll.mockResolvedValue([]); // 게시글이 없는 경우

      const result = await articleAggregateService.getPopularArticles(
        4,
        threeDaysAgo,
        currentTime
      );

      expect(result.articles).toHaveLength(0);
    });
  });

  describe("validateStatisticsQuery()", () => {
    it("동적 쿼리 파라미터가 유효하면 검증을 통과해야 함", () => {
      expect(() => {
        articleAggregateService.validateStatisticsQuery({
          startTime: threeDaysAgo,
          endTime: currentTime,
        });
      }).not.toThrow();
    });

    it("잘못된 날짜 형식이면 InvalidQueryError를 발생시켜야 함", () => {
      expect(() => {
        articleAggregateService.validateStatisticsQuery({
          startTime: "invalid-date",
          endTime: currentTime,
        });
      }).toThrow(InvalidQueryError);
    });

    it("startTime이 endTime보다 이후면 InvalidQueryError를 발생시켜야 함", () => {
      expect(() => {
        articleAggregateService.validateStatisticsQuery({
          startTime: new Date(
            Date.now() + 1 * 24 * 60 * 60 * 1000
          ).toISOString(), // 내일 날짜
          endTime: currentTime,
        });
      }).toThrow(InvalidQueryError);
    });
  });
});
