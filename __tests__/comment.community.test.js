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
      // 메서드가 잘 호출되었는지 확인하기 위해 mockUpdate 함수 생성
      const mockUpdate = jest.fn().mockResolvedValue(true); // mockUpdate 메서드 반환값 설정

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
    it("should successfully delete a comment without replies", async () => {
      // destroy 메서드에는 반환값이 없으므로 이를 추적하기 위해 mockDestroy 함수를 생성
      const mockDestroy = jest.fn().mockResolvedValue(true);
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 1001,
        destroy: mockDestroy,
      });

      models.ArticleComments.count.mockResolvedValue(0); // 대댓글이 없는 경우

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

    it("should soft delete a comment with replies", async () => {
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 1001,
      });

      models.ArticleComments.count.mockResolvedValue(2); // 대댓글이 2개 있는 경우
      const mockUpdate = jest.spyOn(models.ArticleComments, "update");

      await commentService.softDeleteComment({
        communityId: 4,
        articleId: 1,
        commentId: 1,
        authorId: 1001,
      });

      expect(models.ArticleComments.findOne).toHaveBeenCalledWith({
        where: { articleId: 1, commentId: 1 },
      });
      expect(mockUpdate).toHaveBeenCalledWith(
        { status: "deleted" },
        { where: { commentId: 1 } }
      );
    });

    it("should delete a parent comment if it is soft-deleted and only has one reply", async () => {
      models.ArticleComments.findOne
        .mockResolvedValueOnce({
          commentId: 2,
          authorId: 1001,
          parentCommentId: 1,
        })
        .mockResolvedValueOnce({
          commentId: 1,
          status: "deleted",
        });

      models.ArticleComments.count.mockResolvedValue(1); // 부모 댓글에 대댓글 1개만 존재하는 경우

      // destroy 메서드에는 반환값이 없으므로 이를 추적하기 위해 mockDestroy 함수를 생성
      const mockDestroy = jest.fn().mockResolvedValue(true);
      models.ArticleComments.destroy = mockDestroy;

      await commentService.deleteReply({
        articleId: 1,
        commentId: 2,
        parentCommentId: 1,
        authorId: 1001,
      });

      expect(mockDestroy).toHaveBeenCalledWith({
        where: { commentId: 1 },
      });
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
    it("should successfully return comments for an article with likes and author info", async () => {
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
              status: "active",
              isAnonymous: false,
              articleCommentLikes: [
                { likedUserId: 10 }, // 첫 번째 댓글에 좋아요 1개
              ],
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
              status: "active",
              isAnonymous: true,
              articleCommentLikes: [], // 두 번째 댓글에 좋아요 없음
            },
          },
          {
            dataValues: {
              author: {
                userId: 7,
                nickname: "CommentUser3",
                profileImage: "commentProfile3.jpg",
              },
              commentId: 3,
              content: "The Other Comment",
              status: "deleted",
              isAnonymous: false,
              articleCommentLikes: [
                { likedUserId: 10 }, // 세 번째 댓글에 좋아요 1개
              ], // 두 번째 댓글에 좋아요 없음
            },
          },
        ],
      });

      const result = await commentService.getComments({
        communityId: 4,
        articleId: 1,
        userId: 10, // 현재 사용자 ID (좋아요 여부 확인용)
      });

      // 반환된 댓글 개수 검증
      expect(result.comments).toHaveLength(3);

      // 첫 번째 댓글 검증
      expect(result.comments[0].commentId).toBe(1);
      expect(result.comments[0].content).toBe("Test Comment");
      expect(result.comments[0].isAnonymous).toBe(false);
      expect(result.comments[0].authorInfo.userId).toBe(5);
      expect(result.comments[0].authorInfo.nickname).toBe("CommentUser1");
      expect(result.comments[0].authorInfo.profileImage).toContain(
        "commentProfile1.jpg"
      );
      expect(result.comments[0].isLikedByUser).toBe(true); // 현재 사용자(10)가 좋아요를 눌렀음
      expect(result.comments[0].commentLikesCount).toBe(1); // 좋아요 개수 검증

      // 두 번째 댓글 검증
      expect(result.comments[1].commentId).toBe(2);
      expect(result.comments[1].content).toBe("Another Comment");
      expect(result.comments[1].isAnonymous).toBe(true);
      expect(result.comments[1].authorInfo.userId).toBe(6);
      expect(result.comments[1].authorInfo.nickname).toBe("CommentUser2");
      expect(result.comments[1].authorInfo.profileImage).toBe(
        "commentProfile2.jpg"
      );
      expect(result.comments[1].isLikedByUser).toBe(false); // 좋아요 없음
      expect(result.comments[1].commentLikesCount).toBe(0); // 좋아요 개수 검증

      // 세 번째 댓글 검증 (삭제된 댓글)
      expect(result.comments[2].commentId).toBe(3);
      expect(result.comments[2].content).toBe("");
      expect(result.comments[2].authorInfo).toBeNull();
      expect(result.comments[2].commentLikesCount).toBe(0); // 좋아요 개수 검증
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
