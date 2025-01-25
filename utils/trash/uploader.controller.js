// // handleSingleUpload

// /**
//  * 로컬 환경에 단일 이미지를 업로드하는 미들웨어
//  */
// export const localSingle = (destination = "uploads", fieldName = "image") => {
//   const upload = uploadService
//     .createUploadMiddleware(destination)
//     .single(fieldName);

//   return (req, res, next) => {
//     upload(req, res, function (err) {
//       if (err) {
//         return next(err);
//       }

//       // 업로드 후 추가 처리 로직
//       // res.status(200).json({ filename: req.file.filename });

//       next();
//     });
//   };
// };

// /*
// [
//   {
//     fieldname: 'images',
//     originalname: 'png사진.png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     destination: 'uploads/test',
//     filename: '1737442066221-705527098.png',
//     path: 'uploads/test/1737442066221-705527098.png',
//     size: 1501851
//   }
// ]

// 이런 식으로 들어옴
// */

// /**
//  * 로컬 환경에 여러 개의 이미지를 업로드하는 미들웨어
//  */
// export const localMultiple = (
//   destination = "uploads",
//   fieldName = "images",
//   maxCount = 3
// ) => {
//   const upload = uploadService
//     .createUploadMiddleware(destination)
//     .array(fieldName, maxCount);

//   return (req, res, next) => {
//     upload(req, res, function (err) {
//       if (err) {
//         return next(err);
//       }

//       // 업로드 후 추가 처리 로직
//       // res.status(200).json({ filename: req.files.filename });
//       // res.status(200).json({ files: req.files });

//       next();
//     });
//   };
// };

// /**
//  * localSingle과 localMultiple을 합친 미들웨어, field명 정의를 해야합니다.
//  */
// export const localFields = (destination = "uploads") => {
//   const upload = uploadService
//     .createUploadMiddleware(destination)
//     .fields([{ name: "image" }, { name: "images", maxCount: 5 }]);
//   return (req, res, next) => {
//     upload(req, res, function (err) {
//       if (err) {
//         return next(err);
//       }
//       next();
//     });
//   };
// };

// export const s3Single = (req, res, next) => {
//   try {
//     // console.log(req.file, req.files, req.body);
//     const upload = uploadService.uploadToS3().single("image");
//     // multer 미들웨어를 사용하여 이미지 업로드 처리
//     // 콜백함수 내에서는 throw 하면 안됨
//     upload(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//         // Multer 오류 처리
//         logger.error("[uploadImage] Multer 오류:", err.message);
//         return next(new MulterError(err.message));
//       } else if (err) {
//         // 일반 오류 처리
//         logger.error("[uploadImage] 일반 오류:", err.message);
//         return next(new UnknownError(err.message));
//       }

//       if (!req.file) {
//         return next(new InvalidInputError("파일이 첨부되지 않았습니다."));
//       }

//       return next();

//       // 업로드된 파일의 키 추출
//       // const fileKey = req.file.key;

//       // CloudFront URL과 파일 키를 결합하여 최종 이미지 URL 생성
//       // 업로드된 파일의 CloudFront URL 반환
//       // res.status(201).success({
//       //   message: "S3 이미지 업로드 성공.",
//       //   key: fileKey,
//       //   url: uploadService.getCloudfrontUrl(fileKey),
//       // });
//     });
//   } catch (error) {
//     logError(error);
//     next(error);
//   }
// };

// export const s3Multiple = (req, res, next) => {
//   try {
//     // multer 미들웨어를 사용하여 여러 이미지 업로드 처리 (최대 5개)
//     const upload = uploadService.uploadToS3().array("images", 5);
//     upload(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//         // Multer 오류 처리
//         logger.error("[uploadImage] Multer 오류:", err.message);
//         return next(new MulterError(err.message));
//       } else if (err) {
//         // 일반 오류 처리
//         logger.error("[uploadImage] 일반 오류:", err.message);
//         return next(new UnknownError(err.message));
//       }

//       if (!req.files || req.files.length === 0) {
//         logger.debug(`[multipleUploadToS3] req.files: ${req.files}`);
//         return next(new InvalidInputError("파일이 첨부되지 않았습니다."));
//       }
//       // 업로드된 파일들의 키 추출
//       const fileKeys = req.files.map((file) => file.key);

//       // 파일 메타데이터 확인
//       const metadata = req.files.map((file) => file.metadata);
//       logger.debug(
//         `[multipleUploadToS3] metadata: ${JSON.stringify(metadata)}`
//       );

//       return next();

//       // 클라이언트에 여러 이미지의 URL과 메타데이터 반환
//       // res.status(201).json({
//       //   message: "S3 이미지 업로드 성공.",
//       //   keys: fileKeys, // 파일 키 목록
//       // });
//     });
//   } catch (error) {
//     logError(error);
//     next(error);
//   }
// };

// export const getSourceUrl = (req, res, next) => {
//   try {
//     const { key } = req.params;
//     const imageUrl = uploadService.getCloudfrontUrl(key);
//     res.success({
//       url: imageUrl,
//     });
//   } catch (error) {
//     logError(error);
//     next(error);
//   }
// };
