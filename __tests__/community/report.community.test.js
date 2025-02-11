import * as reportService from "../../services/community/report.community.service.js";
import models from "../../models/index.js";
import {
  NotAllowedError,
  AlreadyExistsError,
  NotExistsError,
} from "../../utils/errors/errors.js";

// Mock dependencies
jest.mock("../../models/index.js");

describe("Report Service", () => {

  describe("reportArticle()", () => {
    it("should successfully report an article", async () => {
      // 필요한 Mock 설정
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        communityId: 4,
        authorId: 9999, // 신고자가 아닌 다른 사용자로 설정
      });

      models.Reports.create.mockResolvedValue({
        targetId: 1,
        reportedUserId: 1001,
        reason: "Inappropriate content",
        type: "article",
      });

      const result = await reportService.reportArticle({
        communityId: 4,
        articleId: 1,
        reportedUserId: 1001,
        reason: "Inappropriate content",
      });

      expect(models.Articles.findOne).toHaveBeenCalledWith({
        where: { communityId: 4, articleId: 1 },
      });
      expect(models.Reports.create).toHaveBeenCalledWith({
        targetId: 1,
        reportedUserId: 1001,
        reason: "Inappropriate content",
        type: "article",
      });
      expect(result.newReport.type).toBe("article");
    });

    it("should throw NotExistsError if the article does not exist", async () => {
      models.Articles.findOne.mockResolvedValue(null); 

      await expect(
        reportService.reportArticle({
          communityId: 4,
          articleId: 9999,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("should throw NotAllowedError if the user tries to report their own article", async () => {
      models.Articles.findOne.mockResolvedValue({
        articleId: 1,
        authorId: 1001, // 신고자와 작성자가 동일
      });

      await expect(
        reportService.reportArticle({
          communityId: 4,
          articleId: 1,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotAllowedError);
    });

    it("should throw AlreadyExistsError if the article is already reported", async () => {
      models.Reports.findOne.mockResolvedValue({ targetId: 1 }); // 이전 신고 기록이 존재함

      await expect(
        reportService.reportArticle({
          communityId: 4,
          articleId: 1,
          reportedUserId: 1001,
          reason: "Inappropriate content",
        })
      ).rejects.toThrow(AlreadyExistsError);
    });
  });

  describe("reportComment()", () => {
    it("should successfully report a comment", async () => {
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

      const result = await reportService.reportComment({
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

    it("should throw NotExistsError if the comment does not exist", async () => {
      models.ArticleComments.findOne.mockResolvedValue(null);

      await expect(
        reportService.reportComment({
          communityId: 4,
          articleId: 1,
          commentId: 9999,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotExistsError);
    });

    it("should throw NotAllowedError if the user tries to report their own comment", async () => {
      models.ArticleComments.findOne.mockResolvedValue({
        commentId: 1,
        authorId: 1001, // 신고자와 작성자가 동일
      });

      await expect(
        reportService.reportComment({
          communityId: 4,
          articleId: 1,
          commentId: 1,
          reportedUserId: 1001,
          reason: "Spam",
        })
      ).rejects.toThrow(NotAllowedError);
    });

    it("should throw AlreadyExistsError if the comment is already reported", async () => {
      models.Reports.findOne.mockResolvedValue({ targetId: 1 }); // 이전 신고 기록이 존재함

      await expect(
        reportService.reportComment({
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