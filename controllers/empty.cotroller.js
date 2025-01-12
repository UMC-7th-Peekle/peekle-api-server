export const emptyController = (req, res) =>
  res.status(418).success({ message: "I'm a teapot" });
