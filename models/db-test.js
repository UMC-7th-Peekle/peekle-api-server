import models from "./index.js";

const sample = async () => {
  const test = await models.RefreshTokens.findAll();
  const filteredTest = test.map((item) => ({ createdAt: item.createdAt }));

  console.log("테스트", filteredTest);
  console.log("날짜", new Date(filteredTest[0].createdAt));
  console.log(new Date());
};

sample();
