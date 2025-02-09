import * as reportService from "../services/community/report.community.service.js";
import models from "../models/index.js";
import {
  NotAllowedError,
  AlreadyExistsError,
  NotExistsError,
} from "../utils/errors/errors.js";

// Mock dependencies
jest.mock("../models/index.js");

describe("게시글 및 댓글 신고", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 함수 초기화
  });
  describe("reportArticle()", () => {
    it("게시글을 성공적으로 신고해야 함", async () => {
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        title: "Test Article",
        authorId: 9999,
        communityId: 4,
      });

      const result = await reportService.reportTarget({
        targetType: "article",
        communityId: 4,
        articleId: 1,
        reportedUserId: 1001,
        reason: "Inappropriate content",
      });

    });

    it("게시글이 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
      models.Articles.findOne.mockResolvedValue(null);

      await expect(
        reportService.reportTarget({
          targetType: "article",
          communityId: 4,
          articleId: 9999,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("작성자가 본인 게시글을 신고하면 NotAllowedError를 발생시켜야 함", async () => {
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        authorId: 1001, // 신고자와 작성자가 동일
      });

      await expect(
        reportService.reportTarget({
          targetType: "article",
          communityId: 4,
          articleId: 1,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotAllowedError);
    });

    it("이미 신고된 게시글이면 AlreadyExistsError를 발생시켜야 함", async () => {
      models.Reports.findOne.mockResolvedValue({ targetId: 1, reportedUserId: 1001, type: "article" }); // 이전 신고 기록이 존재함

      await expect(
        reportService.reportTarget({
          targetType: "article",
          communityId: 4,
          articleId: 1,
          reportedUserId: 1001,
          reason: "Inappropriate content",
        })
      ).rejects.toThrow(AlreadyExistsError);
    });
  });

  describe("reportComment()", () => {
    it("댓글을 성공적으로 신고해야 함", async () => {
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        articleId: 1,
        authorId: 9999, // 신고자가 아닌 사용자로 설정
      });

      models.Reports.create.mockResolvedValue({
        targetId: 1,
        reportedUserId: 1001,
        reason: "Offensive comment",
        type: "comment",
      });

      const result = await reportService.reportTarget({
        targetType: "comment",
        communityId: 4,
        articleId: 1,
        commentId: 1,
        reportedUserId: 1001,
        reason: "Offensive comment",
      });

      expect(models.ArticleComments.findOne).toHaveBeenCalledWith({
        where: { articleId: 1, commentId: 1 },
      });
      expect(models.Reports.create).toHaveBeenCalledWith({
        targetId: 1,
        reportedUserId: 1001,
        reason: "Offensive comment",
        type: "comment",
      });
      expect(result.newReport.type).toBe("comment");
    });

    it("댓글이 존재하지 않으면 NotExistsError를 발생시켜야 함", async () => {
      models.ArticleComments.findOne.mockResolvedValue(null);

      await expect(
        reportService.reportTarget({
          targetType: "comment",
          communityId: 4,
          articleId: 1,
          commentId: 9999,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("작성자가 본인 댓글을 신고하면 NotAllowedError를 발생시켜야 함", async () => {
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 1001, // 신고자와 작성자가 동일
      });

      await expect(
        reportService.reportTarget({
          targetType: "comment",
          communityId: 4,
          articleId: 1,
          commentId: 1,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotAllowedError);
    });

    it("이미 신고된 댓글이면 AlreadyExistsError를 발생시켜야 함", async () => {
      models.Reports.findOne.mockResolvedValue({ targetId: 1, reportedUserId: 1001, type: "comment" }); // 이전 신고 기록이 존재함

      await expect(
        reportService.reportTarget({
          targetType: "comment",
          communityId: 4,
          articleId: 1,
          commentId: 1,
          reportedUserId: 1001,
          reason: "Offensive comment",
        })
      ).rejects.toThrow(AlreadyExistsError);
    });
  });
});
