import * as articleLikeService from "../services/community/article.like.community.service.js";
import models from "../models/index.js";
import { NotExistsError, AlreadyExistsError } from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("Article Like Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("likeArticle()", () => {
    it("should successfully add a like to an article", async () => {
      // Mock article and like creation
      models.Articles.findOne.mockResolvedValue({ id: 1 });
      models.ArticleLikes.create.mockResolvedValue({ id: 1, articleId: 1 });

      const response = await articleLikeService.likeArticle({
        communityId: 4,
        articleId: 1,
        likedUserId: 1001,
      });

      expect(models.Articles.findOne).toHaveBeenCalledWith({
        where: { communityId: 4, articleId: 1 },
      });
      expect(models.ArticleLikes.create).toHaveBeenCalledWith({
        articleId: 1,
        likedUserId: 1001,
      });
      expect(response).toEqual({ like: { id: 1, articleId: 1 } });
    });

    it("should throw NotExistsError if article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        articleLikeService.likeArticle({
          communityId: 4,
          articleId: 9999,
          likedUserId: 1001,
        })
      ).rejects.toThrow(NotExistsError);

      expect(models.Articles.findOne).toHaveBeenCalledWith({
        where: { communityId: 4, articleId: 9999 },
      });
    });

    it("should throw AlreadyExistsError if the user already liked the article", async () => {
      models.Articles.findOne.mockResolvedValue({ id: 1 });
      models.ArticleLikes.create.mockRejectedValue(
        new models.Sequelize.UniqueConstraintError()
      );

      await expect(
        articleLikeService.likeArticle({
          communityId: 4,
          articleId: 1,
          likedUserId: 1001,
        })
      ).rejects.toThrow(AlreadyExistsError);
    });
  });

  describe("unlikeArticle()", () => {
    beforeEach(() => {
      jest.restoreAllMocks(); // 모든 Mock 복구 및 초기화
    });
    it("should successfully remove a like from an article", async () => {
      // Mock like 객체에 destroy 메서드 추가
      const mockLike = {
        destroy: jest.fn(), // destroy 메서드를 Mock으로 설정
      };

      models.ArticleLikes.findOne.mockResolvedValue(mockLike); // 올바른 Mock 반환 설정

      await articleLikeService.unlikeArticle({
        communityId: 4,
        articleId: 1,
        likedUserId: 1001,
      });

      expect(models.ArticleLikes.findOne).toHaveBeenCalledWith({
        where: { articleId: 1, likedUserId: 1001 },
      });

      expect(mockLike.destroy).toHaveBeenCalled(); // destroy 메서드 호출 확인
    });

    it("should throw NotExistsError if the article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        articleLikeService.unlikeArticle({
          communityId: 4,
          articleId: 9999,
          likedUserId: 1001,
        })
      ).rejects.toThrow(NotExistsError);
    });
    // TODO: AlreadyExistsError를 던지는 테스트 케이스 추가
  });
});
