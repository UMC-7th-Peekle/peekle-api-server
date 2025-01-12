import { Router } from "express";
import { emptyController } from "../controllers/empty.cotroller.js";

const router = Router();

/**
 * get /category/:categoryId - 카테고리별 공지사항 조회
 */
router.get("/category/:categoryId", emptyController);

/**
 * get /category/:categoryId/:noticeId - 공지사항 상세 조회
 */
router.get("/category/:categoryId/:noticeId", emptyController);

/**
 * post /category/:categoryId - 공지사항 작성
 */
router.post("/category/:categoryId", emptyController);

/**
 * patch /category/:categoryId/:noticeId - 공지사항 수정
 */
router.patch("/category/:categoryId/:noticeId", emptyController);

/**
 * delete /category/:categoryId/:noticeId - 공지사항 삭제
 */
router.delete("/category/:categoryId/:noticeId", emptyController);
