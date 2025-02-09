import * as commentLikeService from "../services/community/comment.like.community.service.js";
import models from "../models/index.js";
import { NotExistsError, AlreadyExistsError } from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("댓글 좋아요", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });

  describe("likeComment()", () => {
    it("댓글에 좋아요를 성공적으로 추가해야 함", async () => {
      // 댓글 조회 및 좋아요 추가 동작을 Mock으로 설정
      models.ArticleComments.findOne.mockResolvedValue({ commentId: 1 });
      models.ArticleCommentLikes.create.mockResolvedValue({ id: 1, commentId: 1 });

      const response = await commentLikeService.likeComment({
        communityId: 4,
        articleId: 1,
        commentId: 1,
        likedUserId: 1001,
      });

      // 댓글이 제대로 조회되었는지 확인
      expect(models.ArticleComments.findOne).toHaveBeenCalledWith({
        where: { commentId: 1, articleId: 1 },
      });

      // 좋아요가 제대로 추가되었는지 확인
      expect(models.ArticleCommentLikes.create).toHaveBeenCalledWith({
        commentId: 1,
        likedUserId: 1001,
      });

      // 응답 값 검증
      expect(response).toEqual({ like: { id: 1, commentId: 1 } });
    });

    it("댓글이 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
      // 댓글 조회가 null을 반환하도록 설정
      models.ArticleComments.findOne.mockResolvedValue(null);

      await expect(
        commentLikeService.likeComment({
          communityId: 4,
          articleId: 1,
          commentId: 9999,
          likedUserId: 1001,
        })
      ).rejects.toThrow(NotExistsError);

      // 댓글 조회가 올바르게 호출되었는지 확인
      expect(models.ArticleComments.findOne).toHaveBeenCalledWith({
        where: { commentId: 9999, articleId: 1 },
      });
    });

    it("이미 좋아요를 누른 댓글이면 AlreadyExistsError를 발생시켜야 함", async () => {
      // 댓글이 존재하는 것으로 설정
      models.ArticleComments.findOne.mockResolvedValue({ commentId: 1 });

      // 좋아요 중복 시 UniqueConstraintError가 발생하도록 설정
      models.ArticleCommentLikes.create.mockRejectedValue(
        new models.Sequelize.UniqueConstraintError()
      );

      await expect(
        commentLikeService.likeComment({
          communityId: 4,
          articleId: 1,
          commentId: 1,
          likedUserId: 1001,
        })
      ).rejects.toThrow(AlreadyExistsError);
    });
  });

  describe("unlikeComment()", () => {
    it("댓글에서 좋아요를 성공적으로 취소해야 함", async () => {
      const mockLike = { destroy: jest.fn() };

      // 댓글과 좋아요 정보를 Mock으로 설정
      models.ArticleComments.findOne.mockResolvedValue({ commentId: 1 });
      models.ArticleCommentLikes.findOne.mockResolvedValue(mockLike);

      await commentLikeService.unlikeComment({
        communityId: 4,
        articleId: 1,
        commentId: 1,
        likedUserId: 1001,
      });

      // 댓글 및 좋아요가 정상적으로 조회되었는지 확인
      expect(models.ArticleComments.findOne).toHaveBeenCalledWith({
        where: { articleId: 1, commentId: 1 },
      });
      expect(models.ArticleCommentLikes.findOne).toHaveBeenCalledWith({
        where: { commentId: 1, likedUserId: 1001 },
      });

      // 좋아요가 정상적으로 삭제되었는지 확인
      expect(mockLike.destroy).toHaveBeenCalled();
    });

    it("댓글이 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
      // 댓글 조회가 null을 반환하도록 설정
      models.ArticleComments.findOne.mockResolvedValue(null);

      await expect(
        commentLikeService.unlikeComment({
          communityId: 4,
          articleId: 1,
          commentId: 9999,
          likedUserId: 1001,
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("좋아요가 이미 취소된 경우 NotExistsError를 발생시켜야 함", async () => {
      // 좋아요가 없는 상태로 설정
      models.ArticleComments.findOne.mockResolvedValue({ commentId: 1 });
      models.ArticleCommentLikes.findOne.mockResolvedValue(null);

      await expect(
        commentLikeService.unlikeComment({
          communityId: 4,
          articleId: 1,
          commentId: 1,
          likedUserId: 1001,
        })
      ).rejects.toThrow(NotExistsError);
    });
  });
});