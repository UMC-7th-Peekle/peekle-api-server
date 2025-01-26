// async function checkS3Connection() {
//   const s3Client = new S3Client({
//     region: REGION,
//     credentials: {
//       accessKeyId: ACCESS_KEY_ID,
//       secretAccessKey: SECRET_ACCESS_KEY,
//     },
//   });

//   try {
//     const data = await s3Client.send(
//       new ListObjectsV2Command({ Bucket: "YOUR_BUCKET_NAME" })
//     );
//     console.log("S3 연결 성공:", data.Buckets);
//   } catch (err) {
//     console.error("S3 연결 실패:", err);
//   }
//   const params = {
//     Bucket: "YOUR_BUCKET_NAME",
//     Key: "test-object.txt", // S3에 저장될 파일 이름
//     Body: "", // empty string
//   };

//   try {
//     const data = await s3Client.send(new PutObjectCommand(params));
//     console.log("파일 업로드 성공:", data);
//   } catch (err) {
//     console.error("파일 업로드 실패:", err);
//   }
// }

// // checkS3Connection();
