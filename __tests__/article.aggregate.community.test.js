import * as articleAggregateService from "../services/community/article.aggregate.community.service.js";
import models from "../models/index.js";
import { NotExistsError, InvalidQueryError } from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("Article Aggregate Service", () => {
  // 동적으로 현재 시간과 3일 전 시간 설정
  const currentTime = new Date().toISOString();
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });

  describe("getPopularArticles()", () => {
    it("should successfully return popular articles", async () => {
      // 커뮤니티 존재 확인
      models.Communities.findOne.mockResolvedValue({ communityId: 4 });

      // 인기 게시글 Mock 데이터 설정
      models.Articles.findAll.mockResolvedValue([
        {
          articleId: 1,
          title: "Popular Article 1",
          likeCount: 10,
          commentCount: 5,
        },
        {
          articleId: 2,
          title: "Popular Article 2",
          likeCount: 8,
          commentCount: 7,
        },
      ]);

      const result = await articleAggregateService.getPopularArticles(
        4,
        threeDaysAgo,
        currentTime
      );

      expect(models.Communities.findOne).toHaveBeenCalledWith({
        where: { communityId: 4 },
      });
      expect(models.Articles.findAll).toHaveBeenCalledWith({
        where: {
          communityId: 4,
        },
        attributes: expect.arrayContaining([
          "articleId",
          "title",
          "content",
          expect.any(Array), // Sequelize literal 계산식 포함
        ]),
        order: [[expect.any(Object), "DESC"]],
        having: expect.any(Object),
        limit: 2,
      });
      expect(result.articles).toHaveLength(2);
      expect(result.articles[0].title).toBe("Popular Article 1");
    });

    it("should throw NotExistsError if the community does not exist", async () => {
      models.Communities.findOne.mockResolvedValue(null); // 커뮤니티가 존재하지 않음

      await expect(
        articleAggregateService.getPopularArticles(
          999, // 존재하지 않는 communityId
          threeDaysAgo,
          currentTime
        )
      ).rejects.toThrow(NotExistsError);
    });

    it("should return an empty array if no articles are found", async () => {
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
    it("should pass validation for dynamic query parameters", () => {
      expect(() => {
        articleAggregateService.validateStatisticsQuery({
          startTime: threeDaysAgo,
          endTime: currentTime,
        });
      }).not.toThrow();
    });

    it("should throw InvalidQueryError for incorrect date format", () => {
      expect(() => {
        articleAggregateService.validateStatisticsQuery({
          startTime: "invalid-date",
          endTime: currentTime,
        });
      }).toThrow(InvalidQueryError);
    });

    it("should throw InvalidQueryError if startTime is after endTime", () => {
      expect(() => {
        articleAggregateService.validateStatisticsQuery({
          startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 내일 날짜
          endTime: currentTime,
        });
      }).toThrow(InvalidQueryError);
    });
  });
});