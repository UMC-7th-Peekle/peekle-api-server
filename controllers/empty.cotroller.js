export const notImplementedController = (req, res) =>
  res.status(501).success({ message: "아직 구현되지 않은 기능입니다." });
