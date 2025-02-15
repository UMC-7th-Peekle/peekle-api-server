import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// 피클링 목록 조회
router.get("/", notImplementedController);

// 피클링 세부 조회
router.get("/:peeklingId", notImplementedController);
// 피클링 수정
router.patch("/:peeklingId", notImplementedController);

// 피클링 임시 저장
router.post("/save", notImplementedController);

// 피클링 참여하기

// 피클링 참여 취소하기

//
