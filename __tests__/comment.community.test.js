import * as commentService from "../services/community/comment.community.service.js";
import models from "../models/index.js";
import {
  NotExistsError,
  NotAllowedError,
  InvalidQueryError,
} from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("Comment Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });

  describe("createComment()", () => {
    it("should successfully create a comment", async () => {
      models.Articles.findOne.mockResolvedValue({ articleId: 1 });
      models.ArticleComments.create.mockResolvedValue({ commentId: 1 });

      const result = await commentService.createComment({
        communityId: 4,
        articleId: 1,
        authorId: 1001,
        content: "Test comment",
        isAnonymous: true,
      });

      expect(models.Articles.findOne).toHaveBeenCalledWith({
        where: { articleId: 1 },
      });
      expect(models.ArticleComments.create).toHaveBeenCalledWith({
        articleId: 1,
        authorId: 1001,
        content: "Test comment",
        status: "active",
        isAnonymous: true,
      });
      expect(result.comment.commentId).toBe(1);
    });

    it("should throw NotExistsError if the article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        commentService.createComment({
          communityId: 4,
          articleId: 9999,
          authorId: 1001,
          content: "Test comment",
          isAnonymous: true,
        })
      ).rejects.toThrow(NotExistsError);
    });
  });

  describe("updateComment()", () => {
    it("should successfully update a comment", async () => {
      const mockUpdate = jest.fn().mockResolvedValue(true); // update 메서드 Mock 설정

      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 1001,
        update: mockUpdate, // Mock된 update 메서드 포함
      });

      await commentService.updateComment({
        communityId: 4,
        articleId: 1,
        commentId: 1,
        authorId: 1001,
        content: "Updated comment",
        isAnonymous: false,
      });

      expect(models.ArticleComments.findOne).toHaveBeenCalledWith({
        where: { articleId: 1, commentId: 1 },
      });

      // update 메서드가 제대로 호출되었는지 검증
      expect(mockUpdate).toHaveBeenCalledWith({
        content: "Updated comment",
        isAnonymous: false,
      });
    });

    it("should throw NotExistsError if the comment does not exist", async () => {
      models.ArticleComments.findOne.mockResolvedValue(null); // 댓글이 없는 경우

      await expect(
        commentService.updateComment({
          communityId: 4,
          articleId: 1,
          commentId: 9999,
          authorId: 1001,
          content: "Updated comment",
          isAnonymous: false,
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("should throw NotAllowedError if the user is not the comment author", async () => {
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 9999, // 다른 사용자 ID
      });

      await expect(
        commentService.updateComment({
          communityId: 4,
          articleId: 1,
          commentId: 1,
          authorId: 1001, // 현재 사용자 ID
          content: "Updated comment",
          isAnonymous: false,
        })
      ).rejects.toThrow(NotAllowedError);
    });
  });

  describe("deleteComment()", () => {
    it("should successfully delete a comment", async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 1001,
        destroy: mockDestroy,
      });

      await commentService.deleteComment({
        communityId: 4,
        articleId: 1,
        commentId: 1,
        authorId: 1001,
      });

      expect(models.ArticleComments.findOne).toHaveBeenCalledWith({
        where: { articleId: 1, commentId: 1 },
      });
      expect(mockDestroy).toHaveBeenCalled();
    });

    it("should throw NotExistsError if the comment does not exist", async () => {
      models.ArticleComments.findOne.mockResolvedValue(null);

      await expect(
        commentService.deleteComment({
          communityId: 4,
          articleId: 1,
          commentId: 9999,
          authorId: 1001,
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("should throw NotAllowedError if the user is not the comment author", async () => {
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 9999, // 다른 사용자 ID
      });

      await expect(
        commentService.deleteComment({
          communityId: 4,
          articleId: 1,
          commentId: 1,
          authorId: 1001, // 현재 사용자
        })
      ).rejects.toThrow(NotAllowedError);
    });
  });

  describe("createCommentReply()", () => {
    it("should successfully create a comment reply", async () => {
      models.ArticleComments.create.mockResolvedValue({ commentId: 10 });

      const result = await commentService.createCommentReply({
        articleId: 1,
        commentId: 1,
        authorId: 1001,
        content: "Reply to comment",
        isAnonymous: true,
      });

      expect(models.ArticleComments.create).toHaveBeenCalledWith({
        articleId: 1,
        parentCommentId: 1,
        authorId: 1001,
        content: "Reply to comment",
        status: "active",
        isAnonymous: true,
      });
      expect(result.comment.commentId).toBe(10);
    });

    it("should throw NotExistsError if the parent comment does not exist", async () => {
      models.ArticleComments.create.mockRejectedValue(
        new models.Sequelize.ForeignKeyConstraintError()
      );

      await expect(
        commentService.createCommentReply({
          articleId: 1,
          commentId: 9999,
          authorId: 1001,
          content: "Reply to comment",
          isAnonymous: true,
        })
      ).rejects.toThrow(NotExistsError);
    });
  });

  describe("getComments()", () => {
    it("should successfully return comments for an article", async () => {
      models.Articles.findOne.mockResolvedValue({
        dataValues: {
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
              content: "Another Comment",
              isAnonymous: true,
            },
          },
        ],
      });

      const result = await commentService.getComments({
        communityId: 4,
        articleId: 1,
      });

      // 반환된 댓글 개수 검증
      expect(result.comments).toHaveLength(2);

      // 첫 번째 댓글 검증
      expect(result.comments[0].commentId).toBe(1);
      expect(result.comments[0].content).toBe("Test Comment");
      expect(result.comments[0].isAnonymous).toBe(false);
      expect(result.comments[0].authorInfo.userId).toBe(5);
      expect(result.comments[0].authorInfo.nickname).toBe("CommentUser1");
      expect(result.comments[0].authorInfo.profileImage).toContain("commentProfile1.jpg");

      // 두 번째 댓글 검증
      expect(result.comments[1].commentId).toBe(2);
      expect(result.comments[1].content).toBe("Another Comment");
      expect(result.comments[1].isAnonymous).toBe(true);
      expect(result.comments[1].authorInfo.userId).toBeNull();
      expect(result.comments[1].authorInfo.nickname).toBeNull();
      expect(result.comments[1].authorInfo.profileImage).toBeNull();
    });

    it("should throw NotExistsError if the article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        commentService.getComments({
          communityId: 4,
          articleId: 9999,
        })
      ).rejects.toThrow(NotExistsError);
    });
  });
});
