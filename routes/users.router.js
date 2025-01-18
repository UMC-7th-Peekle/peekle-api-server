import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// 사용자 정보 조회
router.get("/me", notImplementedController);
router.get("/terms", notImplementedController);

// 사용자 정보 수정
router.patch("/me/nickname", notImplementedController);
router.patch("/me/profile-image", notImplementedController);
router.delete("/me/profile-image", notImplementedController);
router.patch("/me/phone", notImplementedController);

// 사용자 차단, 신고
router.get("/block", notImplementedController);
router.post("/:userId/block", notImplementedController);
router.delete("/:userId/block", notImplementedController);

// 사용자 신고
router.post("/:userId/report", notImplementedController);

export default router;
