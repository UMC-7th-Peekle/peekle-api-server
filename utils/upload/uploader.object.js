import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";

import { InvalidInputError, NotAllowedError } from "../errors/errors.js";
import logger from "../logger/logger.js";

import config from "../../config.js";
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
 * 파일 경로 앞에 STATIC_FILE_BASE_URL을 붙여주는 함수
 */
export const addBaseUrl = (filePath) => {
  return `${STATIC_FILE_BASE_URL}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
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
      // console.log(restrictions);
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
        // console.log(req, file);
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

export const deleteLocalFile = async (filePath) => {
  filePath = path.join("uploads", filePath);
  try {
    await fs.promises.unlink(filePath);
    logger.debug({
      action: "function:deleteLocalFile",
      actionType: "success",
      filePath,
    });
  } catch (err) {
    logger.error({
      action: "function:deleteLocalFile",
      actionType: "error",
      filePath,
      error: err.message,
    });
  }
};

export const getStaticFilesUrl = (fileKey) =>
  `${STATIC_FILE_BASE_URL}/${fileKey}`;

export const parseImagePaths = (files) => {
  // 업로드된 파일이 없는 경우 고려
  let imagePaths = [];
  if (files.length > 0) {
    imagePaths = files.map((file) => {
      let normalizedPath = path.normalize(file.path); // 경로를 표준화
      let filePath = normalizedPath.replace(/^uploads/, ""); // 경로에서 'uploads/' 제거

      // 디버깅용
      logger.debug({
        action: "function:parseImagePaths",
        message: "업로드된 이미지 경로",
        filePath,
      });

      return filePath;
    });
  }

  return imagePaths;
};

export const isEditInputCorrect = ({
  existingImageSequence,
  newImageSequence,
  existingImagesLength,
  newImageLength,
}) => {
  if (
    !Array.isArray(existingImageSequence) ||
    !Array.isArray(newImageSequence) ||
    typeof existingImagesLength !== "number" ||
    typeof newImageLength !== "number"
  ) {
    if (!Array.isArray(existingImageSequence)) {
      console.error("existingImageSequence is not an array", {
        existingImageSequence,
      });
    }
    if (!Array.isArray(newImageSequence)) {
      console.error("newImageSequence is not an array", { newImageSequence });
    }
    if (typeof existingImagesLength !== "number") {
      console.error("existingImagesLength is not a number", {
        existingImagesLength,
      });
    }
    if (typeof newImageLength !== "number") {
      console.error("newImageLength is not a number", { newImageLength });
    }
    throw new InvalidInputError("들어있어야 할게 안 들어 있는뎁숑 ?");
  }
  // 사용자가 보낸 이미지 순서가 이상한지 확인
  const filteredExisting = existingImageSequence.filter((seq) => seq !== -1);
  const combinedSequences = [...filteredExisting, ...newImageSequence];
  const uniqueSequences = new Set(combinedSequences);

  if (
    existingImageSequence.length !== existingImagesLength || // 존재하는 이미지 개수가 다른 경우
    newImageSequence.length !== newImageLength || // 새로 추가된 이미지 개수가 다른 경우
    uniqueSequences.size !== combinedSequences.length || // 중복된 순서가 있는 경우
    (combinedSequences.length !== 0 && // combinedSequences가 빈 배열이 아닌 경우에만 체크
      (Math.min(...combinedSequences) !== 1 || // 순서가 1부터 시작하지 않는 경우
        Math.max(...combinedSequences) !== combinedSequences.length)) // 순서가 중간에 빠진 경우
  ) {
    logger.error("사진 수정을 시도한 입력이 올바르지 않습니다", {
      action: "INVALID_IMAGE_EDIT_REQUEST",
      condition1: existingImageSequence.length !== existingImagesLength,
      condition2: newImageSequence.length !== newImageLength,
      condition3: uniqueSequences.size !== combinedSequences.length,
      condition4: combinedSequences.length !== 0,
      condition5_1: Math.min(...combinedSequences) !== 1,
      condition5_2: Math.max(...combinedSequences) !== combinedSequences.length,
      existingImageSequenceLength: existingImageSequence.length,
      expectedExistingImagesLength: existingImagesLength,
      newImageSequenceLength: newImageSequence.length,
      expectedNewImageLength: newImageLength,
      uniqueSequencesSize: uniqueSequences.size,
      combinedSequencesLength: combinedSequences.length,
      minCombinedSequence: Math.min(...combinedSequences),
      maxCombinedSequence: Math.max(...combinedSequences),
      error: "Invalid image sequence input",
    });
    throw new InvalidInputError(
      "API Reference에 명시된 요청 방법을 다시 숙지해주세요. 올바르지 않은 사진 수정/추가/삭제 요청입니다."
    );
  }

  return;

  // 이미지 순서 변경

  /*
        ** 이거 아님. 그냥 고민했던 흔적을 남기고 싶어서 남겨둠 **

        imageSequence field를 받아서 수정을 진행합니다.
        해당 field는 숫자들의 배열이며, 
        각 숫자는 이미지 순서 및 삭제/추가 여부를 나타냅니다.

        -1: 삭제된 이미지 (DB에서 삭제)
        삭제된 이미지의 경우 기존 이미지 개수와 
        동일한 길이의 배열이 들어왔을 때만 존재해야 합니다.
        (지금 이거 예외 처리 안되있음, 그렇지 않으면 말이 안됨)
        (한 번 종이에 써보면서 생각해보면 답 나옴)

        -2: 새로 추가된 이미지 (DB에 추가)
        imagePaths로 들어온 이미지 순서대로 넣어주면 됩니다.
        첫 번째 -2 순서에 첫 번째로 들어온 이미지, ... 와 같이

        나머지 숫자는 기존 이미지 순서를 나타냅니다.

        ex) 원래 DB에 3개의 이미지가 있던 게시글에서
        [2, 1, -2] 라는 배열이 들어온 경우
        1. [기존 2번] 이미지를 1번으로 변경
        2. [기존 1번] 이미지를 2번으로 변경
        3. [새로 추가된 이미지]를 3번으로 추가

        ex2) 원래 DB에 3개의 이미지가 있던 게시글에서
        [2, -1, -1] 라는 배열이 들어온 경우
        1. [기존 2번] 이미지를 1번으로 변경
        2. [기존 1번, 3번] 이미지를 DB에서 삭제
      */

  /*
        ** 이거 보면 됩니다 **

        기존 이미지 Sequence와
        Input으로 추가한 이미지의 Sequence를 
        모두 받아서 하는 방향으로 수정하자.

        existingImageSequence : 기존 파일들의 순서 및 삭제 여부
        newImageSequence : 새로 추가된 파일들의 순서 (들어갈 곳)


        동일하게 -1 삭제, 그 이외에는 수정하면 될듯.

        existingImageSequence: [2, 1, -2]
        newImageSequence: [4, 5, 6]

        TODO : DB에 Unique key를 안 걸어둬서, 
        eventId & sequence가 동일한 컬럼이 존재할 수 있지만 (가능하지만),
        Unique key를 걸어서 중복을 방지함과 동시에 데이터 무결성을 지켜야 함.
        아직 코드에선 해당 부분에 대한 예외 처리를 하지 않음.

        (client가 잘못된 데이터를 보내는 경우에 대한 처리를 하지 않았다는 말)
        근데 그냥 바로 해버림 6시 40분인데 자고 싶다
      */
};
