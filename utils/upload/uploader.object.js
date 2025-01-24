import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";

import { NotAllowedError } from "../errors/errors.js";
import logger from "../logger/logger.js";

import config from "../../config.json" with { type: "json" };
const { REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = config.AWS;
const { STATIC_FILE_BASE_URL } = config.SERVER;

/**
 * 업로드 디렉토리의 존재 여부를 확인하고, 없을 경우 생성합니다.
 * @param {string} destination - 업로드 디렉토리 경로
 */
const ensureDirectoryExists = (destination) => {
  try {
    fs.readdirSync(destination);
  } catch (err) {
    logger.error(
      `${destination} 폴더가 없어 ${destination} 폴더를 생성합니다.`
    );
    fs.mkdirSync(destination, { recursive: true });
  }
};

/**
 * 업로드 미들웨어를 생성하는 팩토리 함수
 * @param {string} destination - 업로드 디렉토리 경로
 * @returns {multer.Multer} - multer 미들웨어 인스턴스
 */
export const createUploadMiddleware = ({ destination, restrictions }) => {
  // 디렉토리 존재 여부 확인 및 생성
  ensureDirectoryExists(destination);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      // 파일 확장자 추출
      const fileExtension = path.extname(file.originalname);
      // 파일명 중복을 방지하기 위한 UUID 생성
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      cb(null, uniqueFileName);
    },
  });
  const upload = multer({
    storage: storage,
    limits: restrictions.limits,
    fileFilter: (req, file, cb) => {
      console.log(restrictions);
      const allowedMimeTypes = restrictions.allowedMimeTypes;
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new NotAllowedError(
            `${file.mimetype}는 허용되지 않는 파일 형식입니다. [${allowedMimeTypes}]만 업로드할 수 있습니다.`
          ),
          false
        );
      }
    },
  });

  return upload;
};

/**
 * Multer-S3 설정을 통한 이미지 업로드 미들웨어 생성 함수.
 * @returns {Middleware} Express용 multer 미들웨어.
 */
export const uploadToS3 = (restrictions) => {
  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: BUCKET_NAME,
      // acl: "public-read", // 업로드된 파일의 접근 권한
      metadata: (req, file, cb) => {
        console.log(req, file);
        logger.debug(
          `[uploadImageToS3] file: ${JSON.stringify(file, null, 2)}`
        );
        // const romanizedOriginalName = tossHangul.romanize(file.originalname);
        // const sanitizedOriginalName = romanizedOriginalName.replace(
        //   /[^a-zA-Z0-9_\-\.]/g,
        //   "-"
        // );

        // 도대체 왜 안되는지 모르겠음 ;;;;;;;;

        cb(null, {});
      },
      key: (req, file, cb) => {
        // 파일 확장자 추출
        const fileExtension = path.extname(file.originalname);
        // 파일명 중복을 방지하기 위한 UUID 생성
        const uniqueFileName = `${uuidv4()}${fileExtension}`;
        // const uniqueFileName = uuidv4();
        cb(null, uniqueFileName);
      },
    }),
    limits: restrictions.limits,
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = restrictions.allowedMimeTypes;
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new NotAllowedError(
            `${file.mimetype}는 허용되지 않는 파일 형식입니다. [${allowedMimeTypes}]만 업로드할 수 있습니다.`
          ),
          false
        );
      }
    },
  });
};

export const getStaticFilesUrl = (fileKey) =>
  `${STATIC_FILE_BASE_URL}/${fileKey}`;
