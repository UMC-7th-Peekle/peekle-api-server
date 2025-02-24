import * as articleCrudService from "../services/community/article.crud.community.service.js";
import models from "../models/index.js";
import {
  AlreadyExistsError,
  NotAllowedError,
  NotExistsError,
} from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("게시글 CRUD", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });

  describe("createCommunity()", () => {
    it("새로운 커뮤니티를 성공적으로 생성해야 함", async () => {
      models.Communities.create.mockResolvedValue({ title: "Test Community" });

      await expect(
        articleCrudService.createCommunity({ communityName: "Test Community" })
      ).resolves.toBeUndefined(); // 성공 시 에러 없이 정상 실행됨

      expect(models.Communities.create).toHaveBeenCalledWith({
        title: "Test Community",
      });
    });

    it("중복된 커뮤니티 이름일 경우 AlreadyExistsError를 발생시켜야 함", async () => {
      models.Communities.create.mockRejectedValue(
        new models.Sequelize.UniqueConstraintError()
      );

      await expect(
        articleCrudService.createCommunity({
          communityName: "Duplicate Community",
        })
      ).rejects.toThrow(AlreadyExistsError);
    });
  });

  describe("getArticleById()", () => {
    it("댓글 및 이미지를 포함한 게시글을 반환해야 함", async () => {
      // Mock된 article 데이터 설정
      models.Articles.findOne.mockResolvedValue({
        dataValues: {
          author: {
            userId: 3,
            nickname: "User1",
            profileImage: "profile1.jpg",
          },
          articleId: 1,
          communityId: 4,
          title: "Test Article",
          content: "Test Content",
          isAnonymous: false,
        },
        articleComments: [
          {
            dataValues: {
              author: {
                userId: 5,
                nickname: "CommentUser1",
                profileImage: "commentProfile1.jpg",
              },
              commentId: 1,
              content: "Test Comment",
              isAnonymous: false,
              status: "active",
              articleCommentLikes: [{ likedUserId: 7 }], // 댓글 좋아요
            },
          },
          {
            dataValues: {
              author: {
                userId: 6,
                nickname: "CommentUser2",
                profileImage: "commentProfile2.jpg",
              },
              commentId: 2,
              content: "Test Comment 2",
              isAnonymous: false,
              status: "deleted",
              articleCommentLikes: [{ likedUserId: 7 }], // 댓글 좋아요
            },
          },
        ],
        articleImages: [
          { imageUrl: "image1.jpg", sequence: 1 },
          { imageUrl: "image2.jpg", sequence: 2 },
        ],
        articleLikes: [
          { likedUserId: 6 }, // 게시글 좋아요
        ],
      });

      const { article } = await articleCrudService.getArticleById({
        communityId: 4,
        articleId: 1,
      });

      // 반환된 데이터 검증
      expect(article.articleId).toBe(1);
      expect(article.communityId).toBe(4);
      expect(article.title).toBe("Test Article");
      expect(article.content).toBe("Test Content");
      expect(article.isAnonymous).toBe(false);

      // 작성자 정보 검증
      expect(article.authorInfo.userId).toBe(3);
      expect(article.authorInfo.nickname).toBe("User1");

      // 댓글 정보 검증
      expect(article.articleComments[0].commentId).toBe(1);
      expect(article.articleComments[0].content).toBe("Test Comment");
      expect(article.articleComments[0].authorInfo.userId).toBe(5);
      expect(article.articleComments[0].isLikedByUser).toBe(false); // userId가 7과 다르므로 false
      expect(article.articleComments[0].commentLikesCount).toBe(1); // 좋아요 개수 확인

      // 삭제된 댓글 정보 검증
      expect(article.articleComments[1].commentId).toBe(2);
      expect(article.articleComments[1].content).toBe("");
      expect(article.articleComments[1].authorInfo).toBeNull();
      expect(article.articleComments[1].commentLikesCount).toBe(0); // 좋아요 개수 검증

      // 이미지 검증
      expect(article.articleImages[0].imageUrl).toContain("image1.jpg");
      expect(article.articleImages[1].imageUrl).toContain("image2.jpg");

      // 좋아요 및 댓글 개수 검증
      expect(article.articleLikesCount).toBe(1); // 좋아요 개수 확인
      expect(article.commentsCount).toBe(2); // 댓글 개수 확인
    });

    it("게시글이 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
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
    it("이미지를 포함한 새로운 게시글을 성공적으로 생성해야 함", async () => {
      models.Communities.findOne.mockResolvedValue({ communityId: 4 });
      models.Articles.create.mockResolvedValue({
        articleId: 1,
        title: "New Article",
      });

      const result = await articleCrudService.createArticle({
        communityId: 4,
        authorId: 1001,
        requestBody: JSON.stringify({
          title: "New Article",
          content: "Article Content",
          isAnonymous: true,
        }),
        uploadedFiles: [
          { path: "uploads/path/to/image1.jpg" },
          { path: "uploads/path/to/image2.jpg" },
        ],
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

    it("커뮤니티가 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
      models.Communities.findOne.mockResolvedValue(null);

      await expect(
        articleCrudService.createArticle({
          communityId: 9999,
          authorId: 1001,
          requestBody: JSON.stringify({
            title: "New Article",
            content: "Article Content",
            isAnonymous: true,
          }),
          uploadedFiles: [],
        })
      ).rejects.toThrow(NotExistsError);
    });
  });

  describe("updateArticle()", () => {
    it("게시글을 성공적으로 수정해야 함", async () => {
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

    it("게시글이 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
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

    it("작성자가 아니면 NotAllowedError를 발생시켜야 함", async () => {
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
    it("게시글을 성공적으로 삭제해야 함", async () => {
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

    it("게시글이 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        articleCrudService.deleteArticle({
          communityId: 4,
          articleId: 9999,
          authorId: 1001,
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("작성자가 아니면 NotAllowedError를 발생시켜야 함", async () => {
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
