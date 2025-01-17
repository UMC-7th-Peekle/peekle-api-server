import models from "./index.js";

const sample = async () => {
  const test = await models.Communities.create({
    title: "테스트 커뮤니티",
  });

  console.log("테스트 커뮤니티 생성 완료", test);
};

sample();
