export const securitySchemes = {
  AccessToken: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Bearer JWT를 활용한 AT 인증입니다.",
  },
  RefreshToken: {
    type: "apiKey",
    in: "cookie",
    name: "MY_RT",
    description: "Secure & HTTP-Only Cookie를 활용한 RT 인증입니다.",
  },
};

export const security = [
  {
    AccessToken_Bearer: [],
    RefreshToken_Cookie: [],
  },
];
