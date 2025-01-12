/**
 * 내 정보 조회
 */
router.get("/me", emptyController);

/**
 * 내 정보 수정 (닉네임)
 */
router.patch("/me/nickname", emptyController);

/**
 * 내 정보 수정 (프로필 이미지)
 */
router.patch("/me/profile-image", emptyController);

/**
 * 내 정보 수정 (전화번호)
 */
router.patch("/me/phone", emptyController);

/**
 * 내가 동의한 약관 조회
 */
router.get("/terms", emptyController);
