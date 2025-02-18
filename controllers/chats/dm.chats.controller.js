export const startChatWithArticleId = async (req, res, next) => {
  try {
    // article ID를 통해서 채팅방 시작하기
    /*
      1. AT로 사용자 파악
      2. body로 사용자가 익명으로 할지 프로필로 채팅할지 정하기
      3. article에서 is_anonymous를 보고 상대방 익명 여부 결정하기
    */
  } catch (err) {
    logError(err);
    next(err);
  }
};
