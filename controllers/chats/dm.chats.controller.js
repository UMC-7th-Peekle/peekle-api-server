import * as dmService from "../../services/chats/dm.chats.service.js";

/*
  DM 시작은 게시글, 댓글, 프로필을 통해서 가능함
  그걸 다 따로 만들어 주어야 함

  Good ..
*/

export const startChatWithArticle = async (req, res, next) => {
  try {
    // article ID를 통해서 채팅방 시작하기
    /*
      1. AT로 사용자 파악
      2. body로 사용자가 익명으로 할지 프로필로 채팅할지 정하기
        => isSenderAnonymous
      3. article에서 is_anonymous를 보고 상대방 익명 여부 결정하기
    */

    const { isAnonymous, name, authorId } = dmService.isArticleAuthorAnonymous({
      articleId: req.body.articleId,
    });

    const chatroomId = await dmService.createPersonalChatroom({
      senderId: req.user.userId,
      receiverId: authorId,
      isSenderAnonymous: req.body.isSenderAnonymous,
      isReceiverAnonymous: isAnonymous,
      name,
    });

    return res.status(201).success({
      message: `[${req.body.articleId}] 게시글의 작성자와 채팅방을 성공적으로 개설하였습니다. 반환되는 chatroomId로 socket room join 요청을 보내주세요.`,
      chatroomId,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const startChatWithComment = async (req, res, next) => {
  try {
    // comment ID를 통해서 채팅방 시작하기

    const { isAnonymous, name, authorId } = dmService.isCommentAuthorAnonymous({
      commentId: req.body.commentId,
    });

    const chatroomId = await dmService.createPersonalChatroom({
      senderId: req.user.userId,
      receiverId: authorId,
      isSenderAnonymous: req.body.isSenderAnonymous,
      isReceiverAnonymous: isAnonymous,
      name,
    });

    return res.status(201).success({
      message: `[${req.body.commentId}] 게시글의 작성자와 채팅방을 성공적으로 개설하였습니다. 반환되는 chatroomId로 socket room join 요청을 보내주세요.`,
      chatroomId,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const startChatWithProfile = async (req, res, next) => {
  try {
    // Profile을 통해서 채팅방 시작하기
    // 상대방 User ID를 가지고 있다는 전제하에 진행됨.

    const chatroomId = await dmService.createPersonalChatroom({
      senderId: req.user.userId,
      receiverId: req.body.receiverId,
      isSenderAnonymous: req.body.isSenderAnonymous,
      isReceiverAnonymous: isAnonymous,
      name,
    });

    return res.status(201).success({
      message: `[${req.body.commentId}] 게시글의 작성자와 채팅방을 성공적으로 개설하였습니다. 반환되는 chatroomId로 socket room join 요청을 보내주세요.`,
      chatroomId,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};
