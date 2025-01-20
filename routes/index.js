import { Router } from "express";

import adminRouter from "./admin.router.js";
import authRouter from "./auth.router.js";
import communityRouter from "./community.router.js";
import eventsRouter from "./events.router.js";
import noticesRouter from "./notices.router.js";
import ticketsRouter from "./tickets.router.js";
import usersRouter from "./users.router.js";
import testRouter from "./test.router.js";

const routers = Router();

routers.use("/admin", adminRouter);
routers.use("/auth", authRouter);
routers.use("/community", communityRouter);
routers.use("/events", eventsRouter);
routers.use("/notices", noticesRouter);
routers.use("/tickets", ticketsRouter);
routers.use("/users", usersRouter);

// TODO : Development 단계에서만 사용해야 합니다.
routers.use("/test", testRouter);

export default routers;
