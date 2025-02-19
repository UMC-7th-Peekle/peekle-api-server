import * as dmService from "../../services/chats/dm.chats.service.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";

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

    const { isAnonymous, name, authorId } =
      await dmService.isArticleAuthorAnonymous({
        articleId: req.body.articleId,
      });

    console.log({ isAnonymous, name, authorId });

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

    const { isAnonymous, name, authorId } =
      await dmService.isCommentAuthorAnonymous({
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
      message: `[${req.body.commentId}] 댓글의 작성자와 채팅방을 성공적으로 개설하였습니다. 반환되는 chatroomId로 socket room join 요청을 보내주세요.`,
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

    if (req.user.userId.toString() === req.body.receiverId.toString()) {
      throw new InvalidInputError("자신과의 채팅방은 개설할 수 없습니다.");
    }

    // 채팅방 이름을 닉네임으로 하기 위해서 userId의 닉네임을 가져옴.
    // TODO : 그냥 FE 측에서 보내주도록 하면 안되나?
    const { nickname } = await dmService.getUserNickname({
      userId: req.body.receiverId,
    });

    //
    const chatroomId = await dmService.createPersonalChatroom({
      senderId: req.user.userId,
      receiverId: req.body.receiverId,
      isSenderAnonymous: req.body.isSenderAnonymous,
      isReceiverAnonymous: false,
      name: nickname,
    });

    return res.status(201).success({
      message: `[${req.body.receiverId}] 사용자와 채팅방을 성공적으로 개설하였습니다. 반환되는 chatroomId로 socket room join 요청을 보내주세요.`,
      chatroomId,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};
