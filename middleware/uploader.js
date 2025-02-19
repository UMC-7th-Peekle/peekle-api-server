import {
  InvalidInputError,
  MulterError,
  UnknownError,
} from "../utils/errors/errors.js";
import logger from "../utils/logger/logger.js";
import * as uploadService from "../utils/upload/uploader.object.js";
import multer from "multer";

/**
 * localSingle과 localMultiple을 합친 미들웨어, field명 정의를 해야합니다.
 */
export const localStorage = ({
  destination = "uploads",
  field = [],
}) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    limits: getFieldLimits(field), // 필드별 제한 적용
    fileFilter: (req, file, cb) => {
      // 파일 타입 구분
      const isImage = articleImageRestrictions.allowedMimeTypes.includes(file.mimetype);
      const isVideo = videoRestrictions.allowedMimeTypes.includes(file.mimetype);

      if (!isImage && !isVideo) {
        return cb(new InvalidInputError(`"${file.originalname}" 파일 형식이 허용되지 않습니다.`), false);
      }

      // 파일 크기 제한 검증
      const restriction = isImage ? articleImageRestrictions : videoRestrictions;
      if (file.size > restriction.limits.fileSize) {
        return cb(new InvalidInputError(`"${file.originalname}" 파일 크기가 제한을 초과했습니다.`), false);
      }

      cb(null, true);
    },
  }).fields([{ name: "article_files", maxCount: 15 }]); // 총 파일 개수 제한

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        logger.error(`[localStorage] 업로드 중 에러 ${err.name} | ${err.code} | ${err.message} | ${err.field}`);
        return next(new MulterError(err.code));
      } else if (err) {
        logger.error("[localStorage] Error :", err.message);
        return next(err);
      }

      if (!req.files) {
        logger.debug("[localStorage] 파일이 첨부되지 않았습니다.");
      }
      
      // 파일 개수 제한 적용
      let imageCount = 0;
      let videoCount = 0;

      // restrictions 타입에 따라 개수 제한 적용
      if (req.files?.article_files && Array.isArray(req.files.article_files)) {
        req.files.article_files.forEach(file => {
          if (!file?.mimetype) return; // 파일이 undefined일 경우 방어 코드 추가
      
          const isImage = articleImageRestrictions.allowedMimeTypes.includes(file.mimetype);
          const isVideo = videoRestrictions.allowedMimeTypes.includes(file.mimetype);
      
          if (isImage) imageCount++;
          if (isVideo) videoCount++;
        });
      }

      console.log(imageCount, videoCount);

      // 이미지 개수 제한 체크
      if (imageCount > articleImageRestrictions.limits.files) {
        return next(new InvalidInputError(`이미지는 최대 ${articleImageRestrictions.limits.files}개까지 업로드할 수 있습니다.`));
      }

      // 동영상 개수 제한 체크
      if (videoCount > videoRestrictions.limits.files) {
        return next(new InvalidInputError(`동영상은 최대 ${videoRestrictions.limits.files}개까지 업로드할 수 있습니다.`));
      }

      return next();
    });
  };
};

// 필드별 제한 사항을 적용하는 함수
const getFieldLimits = (fields) => {
  return {
    fileSize: Math.max(articleImageRestrictions.limits.fileSize, videoRestrictions.limits.fileSize), // 가장 큰 제한값 적용
    files: fields.reduce((acc, f) => acc + (f.maxCount || 1), 0), // 최대 파일 개수
  };
};

export const s3Storage = ({
  restrictions,
  field = [{ name: "image" }, { name: "images", maxCount: 5 }],
}) => {
  // console.log(req.file, req.files, req.body);
  const upload = uploadService.uploadToS3(restrictions).fields(field);
  // multer 미들웨어를 사용하여 이미지 업로드 처리
  // 콜백함수 내에서는 throw 하면 안됨
  return (req, res, next) =>
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer 오류 처리
        logger.error(
          `[localStorage] 업로드 중 에러 ${err.name} | ${err.code} | ${err.message} | ${err.field}`
        );
        return next(new MulterError(err.code));
      } else if (err) {
        // Multer 관련 오류가 아니라면 그대로 next로 전달
        logger.error("[s3Storage] Error :", err.message);
        return next(err);
      }

      if (!req.files) {
        logger.debug("[s3Storage] 파일이 첨부되지 않았습니다.");
        // return next(new InvalidInputError("파일이 첨부되지 않았습니다."));
      }

      return next();

      // 업로드된 파일의 키 추출
      // const fileKey = req.file.key;

      // CloudFront URL과 파일 키를 결합하여 최종 이미지 URL 생성
      // 업로드된 파일의 CloudFront URL 반환
      // res.status(201).success({
      //   message: "S3 이미지 업로드 성공.",
      //   key: fileKey,
      //   url: uploadService.getCloudfrontUrl(fileKey),
      // });
    });
};

/*
  위대한 PM 이다은 가라사대,

  프로필 사진은 5MB로 제한하고, "jpg, png"만 가능하게 하도록 하여라

  게시판에서 이미지는 "JPG, JPEG, GIF, PNG, BMP, HEIC, HEIF,  WEBP"만 가능하고,
  한 장당 10MB, 총 300MB로 제한하도록 하여라.
  다니다니 최고 ~

  동영상은 "AVI, WMV, MPG, MPEG, MOV, MKV, ASF, SKM, K3G, FLV, MP4, 3GP, WEBM"만 가능하고,
  한 동영상 당 최대 용량은 2GB, 개수는 10개로 하여라.
*/

/**
 * type에 따른 파일 업로드 제약사항을 설정합니다.
 * @param {string} type - one of [profile, article, video]
 */
export const restrictions = (type) => {
  switch (type) {
    case "profile":
      return profileImageRestrictions;
    case "article":
      return articleImageRestrictions;
    case "video":
      return videoRestrictions;
    case "event":
      return articleImageRestrictions;
    case "notice":
      return articleImageRestrictions;
    case "ticket":
      return articleImageRestrictions;
    default:
      throw new InvalidInputError("잘못된 Parameter 입니다.");
  }
};

const profileImageRestrictions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // 최대 파일 개수 제한 (예: 1개)
  },
  allowedMimeTypes: ["image/jpeg", "image/png"],
};

const articleImageRestrictions = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: Infinity, // 파일 개수 제한 없음
    fieldSize: 300 * 1024 * 1024, // 업로드된 파일들의 총 크기 합 제한 (예: 30MB)
  },
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/heic",
    "image/heif",
    "image/webp",
  ],
};

const videoRestrictions = {
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
    files: 10, // 최대 파일 개수 제한 (예: 10개)
  },
  allowedMimeTypes: [
    "video/avi",
    "video/wmv",
    "video/mpg",
    "video/mpeg",
    "video/mov",
    "video/mkv",
    "video/asf",
    "video/skm",
    "video/k3g",
    "video/flv",
    "video/mp4",
    "video/3gp",
    "video/webm",
  ],
};
