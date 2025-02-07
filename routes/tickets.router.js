import { Router } from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as listTicketController from "../controllers/tickets/list.tickets.controller.js";
import * as detailTicketController from "../controllers/tickets/detail.tickets.controller.js";
import * as createTicketController from "../controllers/tickets/create.tickets.controller.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어 => 후순위..

const router = Router();

// // tickets 조회 (조회하는 것도 로그인 한 본인만 볼 수 있기 때문에 미들웨어 필요)
// // 큰 티켓만 딱 조회
router.get(
  "/",
  authMiddleware.authenticateAccessToken,
  listTicketController.listTicket
);

// // 해당 티켓 속 티키타카 조회 (내 티켓만 확인 가능)
router.get(
  "/:ticketId",
  authMiddleware.authenticateAccessToken,
  detailTicketController.detailTicket
);

// tickets 생성, 수정, 삭제 (이미지 업로드 관련 없음)
// 생성할 때는 상태가 open으로 고정합니다.
router.post(
  "/",
  authMiddleware.authenticateAccessToken,
  createTicketController.createTicket
);

// 수정은 상태만 가능하다.
router.patch(
  "/:ticketId",
  authMiddleware.authenticateAccessToken,
  detailTicketController.updateTicket
);

// enum('open', 'closed', 'in_progress') 중 status가 open일 때만 삭제 가능
router.delete(
  "/",
  authMiddleware.authenticateAccessToken,
  detailTicketController.deleteTicket
);

// tickets 메시지 생성 (이미지 업로드 관련 추가)
router.post(
  "/message",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("ticket"),
    field: [{ name: "ticket_images", maxCount: 5 }],
    destination: "uploads/tickets",
  }),
  // 아직 validator 생성 안함
  createTicketController.createTicketMessage
);

// tickets 메시지에서는 수정과 삭제를 제공하지 않습니다.

export default router;
