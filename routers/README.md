# 📁 routers
라우터 파일들을 저장하는 곳입니다.  
middlewares와 controllers에 의존성을 가집니다.  


```js
// import express
const express = require("express");
const router = express.Router();

// import controller
const registerController = require("../controllers/auth/register.auth.controller");

// import middleware
const validate = require("../middleware/validate");

// 회원가입
router.post(
  "/register",
  validate(authValidator.userRegister),
  registerController.userRegister
);

module.exports = router;
```