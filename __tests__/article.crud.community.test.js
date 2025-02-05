import * as articleCrudService from "../services/community/article.crud.community.service.js";
import models from "../models/index.js";
import { AlreadyExistsError, NotAllowedError, NotExistsError } from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("Article CRUD Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });

  describe("createCommunity()", () => {
    it("should successfully create a new community", async () => {
      models.Communities.create.mockResolvedValue({ title: "Test Community" });

      await expect(
        articleCrudService.createCommunity({ communityName: "Test Community" })
      ).resolves.toBeUndefined(); // 성공 시 에러 없이 정상 실행됨

      expect(models.Communities.create).toHaveBeenCalledWith({
        title: "Test Community",
      });
    });

    it("should throw AlreadyExistsError if community name already exists", async () => {
      models.Communities.create.mockRejectedValue(
        new models.Sequelize.UniqueConstraintError()
      );

      await expect(
        articleCrudService.createCommunity({ communityName: "Duplicate Community" })
      ).rejects.toThrow(AlreadyExistsError);
    });
  });

  describe("getArticleById()", () => {
    it("should return article with comments and images", async () => {
      // Mock article 데이터 설정
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        communityId: 4,
        title: "Test Article",
        content: "Test Content",
        articleImages: [{ imageUrl: "path/to/image1.jpg", sequence: 1 }],
        articleComments: [{ commentId: 1, content: "Test Comment" }],
        dataValues: { articleId: 1, communityId: 4 },
      });

      const article = await articleCrudService.getArticleById({
        communityId: 4,
        articleId: 1,
      });

      expect(models.Articles.findOne).toHaveBeenCalledWith({
        where: { communityId: 4, articleId: 1 },
        include: [
          { model: models.ArticleComments, as: "articleComments" },
          {
            model: models.ArticleImages,
            as: "articleImages",
            attributes: ["imageUrl", "sequence"],
          },
        ],
      });

      expect(article.articleId).toBe(1);
      expect(article.articleImages[0].imageUrl).toBe("http://localhost:7777/uploads/path/to/image1.jpg");
    });

    it("should throw NotExistsError if the article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        articleCrudService.getArticleById({
          communityId: 4,
          articleId: 9999,
        })
      ).rejects.toThrow(NotExistsError);
    });
  });

  describe("createArticle()", () => {
    it("should successfully create a new article with images", async () => {
      models.Communities.findOne.mockResolvedValue({ communityId: 4 });
      models.Articles.create.mockResolvedValue({
        articleId: 1,
        title: "New Article",
      });

      const result = await articleCrudService.createArticle({
        communityId: 4,
        authorId: 1001,
        title: "New Article",
        content: "Article Content",
        imagePaths: ["path/to/image1.jpg"],
      });

      expect(models.Communities.findOne).toHaveBeenCalledWith({
        where: { communityId: 4 },
      });
      expect(models.Articles.create).toHaveBeenCalledWith({
        communityId: 4,
        authorId: 1001,
        title: "New Article",
        content: "Article Content",
        isAnonymous: true,
      });
      expect(result.article.title).toBe("New Article");
    });

    it("should throw NotExistsError if the community does not exist", async () => {
      models.Communities.findOne.mockResolvedValue(null);

      await expect(
        articleCrudService.createArticle({
          communityId: 9999,
          authorId: 1001,
          title: "New Article",
          content: "Article Content",
          imagePaths: [],
        })
      ).rejects.toThrow(NotExistsError);
    });
  });

  describe("updateArticle()", () => {
    it("should successfully update the article", async () => {
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        authorId: 1001,
        update: jest.fn(),
      });

      await articleCrudService.updateArticle({
        communityId: 4,
        articleId: 1,
        authorId: 1001,
        title: "Updated Title",
        content: "Updated Content",
        imagePaths: [],
        existingImageSequence: [],
        newImageSequence: [],
      });

      expect(models.Articles.findOne).toHaveBeenCalledWith({
        where: { communityId: 4, articleId: 1 },
      });
    });

    it("should throw NotExistsError if the article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        articleCrudService.updateArticle({
          communityId: 4,
          articleId: 9999,
          authorId: 1001,
          title: "Updated Title",
          content: "Updated Content",
          imagePaths: [],
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("should throw NotAllowedError if the user is not the author", async () => {
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        authorId: 9999, // 다른 사용자 ID로 설정
      });

      await expect(
        articleCrudService.updateArticle({
          communityId: 4,
          articleId: 1,
          authorId: 1001, // 수정 요청 사용자
          title: "Updated Title",
          content: "Updated Content",
          imagePaths: [],
        })
      ).rejects.toThrow(NotAllowedError);
    });
  });

  describe("deleteArticle()", () => {
    it("should successfully delete the article", async () => {
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        authorId: 1001,
        destroy: jest.fn(),
      });
  
      // 이미지가 없는 경우에도 빈 배열을 반환하도록 설정 
      models.ArticleImages.findAll.mockResolvedValue([]);  
  
      await articleCrudService.deleteArticle({
        communityId: 4,
        articleId: 1,
        authorId: 1001,
      });
  
      expect(models.Articles.findOne).toHaveBeenCalledWith({
        where: { communityId: 4, articleId: 1 },
      });
      expect(models.ArticleImages.findAll).toHaveBeenCalledWith({
        where: { articleId: 1 },
        attributes: ["imageUrl"],
      });
    });
  
    it("should throw NotExistsError if the article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null);
  
      await expect(
        articleCrudService.deleteArticle({
          communityId: 4,
          articleId: 9999,
          authorId: 1001,
        })
      ).rejects.toThrow(NotExistsError);
    });
  
    it("should throw NotAllowedError if the user is not the author", async () => {
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        authorId: 9999, // 다른 사용자 ID로 설정
      });
  
      await expect(
        articleCrudService.deleteArticle({
          communityId: 4,
          articleId: 1,
          authorId: 1001, // 삭제 요청 사용자
        })
      ).rejects.toThrow(NotAllowedError);
    });
  });
});