import { Router } from "express";
import { encrypt62 } from "../utils/cipher/encrypt.js";
import {
  createAccessToken,
  createTestToken,
} from "../utils/tokens/create.jwt.tokens.js";
import * as uploader from "../middleware/uploader.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";
import {
  validateContentType,
  validateRequestBody,
} from "../middleware/validate.js";
import { oauthRegisterSchema } from "../utils/validators/auth/auth.validators.js";
import logger from "../utils/logger/logger.js";
import {
  seedCommunity,
  seedEventLocationGroup,
  seedTerms,
  seedUsers,
} from "../models/seed/seeder.js";
import { logError } from "../utils/handlers/error.logger.js";

const router = Router();

router.get("/seed/:type", authenticateAccessToken, async (req, res, next) => {
  const { type } = req.params;

  try {
    switch (type) {
      case "eventLocation":
        await seedEventLocationGroup();
        break;
      case "terms":
        await seedTerms();
        break;
      case "community":
        await seedCommunity();
        break;
      case "users":
        await seedUsers();
        break;
      case "all":
        await seedEventLocationGroup();
        await seedTerms();
        await seedUsers();
        await seedCommunity();
        break;
      default:
        break;
    }
  } catch (err) {
    logError(err);
    return next(err);
  }

  res.status(201).success({
    message: "Seed 작업이 완료되었습니다.",
  });
});

router.get("/encrypted/:text", (req, res) => {
  const { text } = req.params;
  logger.silly({
    message: `[${text}]를 암호화합니다.`,
    action: "encrypt62",
  });
  res.status(201).success({
    encrypted: encrypt62(text),
  });
});

router.get("/accesstoken/:userId", (req, res) => {
  const { userId } = req.params;
  res.status(201).success({
    accessToken: createAccessToken({ userId }),
  });
});

router.get("/accesstoken/:userId/long", (req, res) => {
  const { userId } = req.params;
  res.status(201).success({
    accessToken: createTestToken({ userId }),
  });
});

router.get("/middleware/auth", authenticateAccessToken, (req, res) => {
  res.status(201).success({
    message: "authenticateAccessToken 정상 작동중.",
  });
});

/*
  /test/upload/s3/video, /test/upload/s3/image, /test/upload/s3/profile 
  과 같이 사용하면 됩니다.

  다만, param 사용을 위해 미들웨어에 (req, res, next)을 제공해주어야 하기 때문에
  코드가 더러워지는 단점이 있습니다.

  이 때문에, 테스트용으로 만들어진 현 엔드포인트를 제외한 곳에서는
  uploader.restrictions("profile") 과 같이 지정해서 사용해 주세요.
*/

/*
  다른 곳에서 사용 방법.

  upload.s3Storage({
    restrictions: upload.restrictions("profile"),
  })

  이런 식으로 사용하는 상황에 맞게 사용하면 됩니다.
  또한, 우선 처음에는 local upload를 사용할 것이기 때문에,
  local upload 시에는 destination을 반드시 지정하여야 합니다.
  destination은 uploads/{분류} 로 설정해주세요.

  업로드되는 파일에 대한 검증은 기본적으로 multer에서 지원하며,

  key-value로 들어오는 다른 값들은 req.body에 multer가 넣어줍니다.
  따라서 req.body에 대해서는 Ajv 검증을 수행하여야 합니다.
*/

const TEST_UPLOAD_PATH = "uploads/test";
router.post(
  "/upload/local/:type",
  (req, res, next) => {
    uploader.localStorage({
      restrictions: uploader.restrictions(req.params.type),
      destination: TEST_UPLOAD_PATH,
      field: [{ name: "image" }],
    })(req, res, next);
  },
  (req, res) => {
    res.status(201).success({
      files: req.files,
    });
  }
);

router.post(
  "/upload/s3/:type",
  (req, res, next) => {
    uploader.s3Storage({
      restrictions: uploader.restrictions(req.params.type),
    })(req, res, next);
  },
  (req, res) => {
    res.status(201).success({
      files: req.files,
    });
  }
);

// Validator test
router.get(
  "/validator/oauth-register",
  validateRequestBody(oauthRegisterSchema),
  (req, res) => {
    res.status(200).success({
      message: "검증에 성공했습니다.",
    });
  }
);

router.post("/validator/content-type", validateContentType, (req, res) => {
  res.status(200).success({
    message: "검증에 성공했습니다.",
  });
});

export default router;
