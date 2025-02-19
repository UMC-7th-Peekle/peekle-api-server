import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";
import * as crudController from "../controllers/peekling/crud.peekling.controller.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어
import { validateRequestBody } from "../middleware/validate.js";
import { createPeeklingSchema } from "../utils/validators/peekling/peekling.validators.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.status(200).json({
    message: "Pong!",
  });
});

// 피클링 생성
router.post(
  "/",
  authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("peekling"),
    field: [{ name: "peekling_images", maxCount: 5 }],
    destination: "uploads/peekling",
  }),
  validateRequestBody(createPeeklingSchema, true),
  crudController.createPeekling
);

// 피클링 목록 조회
// query, 가까운 날짜순, 카테고리
router.get("/", notImplementedController);

// 피클링 세부 조회
router.get("/:peeklingId", crudController.getPeeklingById);

// 피클링 수정
router.patch("/:peeklingId", notImplementedController);

// 피클링 임시 저장
router.post("/save", notImplementedController);

// 피클링 참여하기

// 피클링 참여 취소하기

//

export default router;
