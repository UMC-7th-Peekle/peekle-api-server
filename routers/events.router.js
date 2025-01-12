import { Router } from "express";
import { emptyController } from "../controllers/empty.cotroller.js";

const router = Router();

/**
 * get /?scrapped=true&query=검색어 - 이벤트 목록을 가져옵니다. scrapped가 true이면 스크랩한 이벤트 목록을 가져옵니다. query가 있으면 검색어를 포함하는 이벤트 목록을 가져옵니다.
 */
router.get("/", emptyController);

/**
 * get /:eventId - 이벤트 상세 정보를 가져옵니다.
 */
router.get("/:eventId", emptyController);

/**
 * patch /:eventId/scrap - 이벤트를 스크랩합니다.
 */
router.patch("/:eventId/scrap", emptyController);

/**
 * delete /:eventId/scrap - 이벤트 스크랩을 취소합니다.
 */
router.delete("/:eventId/scrap", emptyController);

export default router;
