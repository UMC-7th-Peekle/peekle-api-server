import { Router } from "express";
import { encrypt62 } from "../utils/cipher/encrypt.js";
import { createAccessToken } from "../utils/tokens/create.jwt.tokens.js";
import { testLogin } from "../controllers/auth/login.auth.controller.js";

const router = Router();

router.get("/encrypted/:text", (req, res) => {
  const { text } = req.params;
  res.status(201).success({
    encrypted: encrypt62(text),
  });
});

router.get("/accesstoken/:userId", (req, res) => {
  const { userId } = req.params;
  res.status(201).success({
    accessToken: createAccessToken(userId),
  });
});

router.get("/login/:userId", testLogin);

export default router;
