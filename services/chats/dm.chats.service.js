import models from "../../models/index.js";
import { getPersonalChatroomName } from "../../socket/rooms/room.socket.js";
import { NotExistsError } from "../../utils/errors/errors.js";

/**
 * 발신자, 수신자와 이름 (주로 게시글 제목)을 받아서 채팅방을 생성합니다.
 * 생성된 chatroom ID를 반환합니다. client는 이를 이용해 JOIN_ROOM 요청을 보내야 합니다.
 */
export const createPersonalChatroom = async ({
  senderId,
  receiverId,
  name,
  isSenderAnonymous,
  isReceiverAnonymous,
}) => {
  // 채팅방 생성, Room 목록에 추가하기
  // TODO : 해당 소켓은 어떡하지?
  const transaction = await models.sequelize.transaction();
  try {
    const ret = await models.Chatroom.create(
      {
        senderId,
        receiverId,
        name: name.slice(0, 30),
        isSenderAnonymous,
        isReceiverAnonymous,
      },
      { transaction }
    );

    // socket은 서로에게 생성되어야 함으로
    const roomId = getPersonalChatroomName(ret.chatroomId);
    const data = [
      {
        roomId: roomId,
        userId: senderId,
      },
      {
        roomId: roomId,
        userId: receiverId,
      },
    ];
    await models.UserSocketRooms.bulkCreate(data, { transaction });

    await transaction.commit();

    return ret.chatroomId;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

/**
 * Article ID를 받아서 해당 사용자가 글을 익명으로 작성했는지를 리턴합니다.
 */
export const isArticleAuthorAnonymous = async ({ articleId }) => {
  const ret = await models.Articles.findByPk(articleId, {
    attributes: ["authorId", "isAnonymous", "title"],
  });

  if (!ret) {
    throw new NotExistsError(
      `${articleId}에 해당하는 게시글은 존재하지 않습니다.`
    );
  }

  return {
    isAnonymous: !!ret.isAnonymous,
    name: ret.title.slice(0, 30),
    authorId: ret.authorId,
  };
};

/**
 * Comment ID를 받아서 해당 사용자가 댓글을 익명으로 작성했는지를 리턴합니다.
 */
export const isCommentAuthorAnonymous = async ({ commentId }) => {
  const ret = await models.ArticleComments.findByPk(commentId, {
    attributes: ["authorId", "isAnonymous", "content"],
  });

  if (!ret) {
    throw NotExistsError(`${commentId}에 해당하는 댓글은 존재하지 않습니다.`);
  }

  return {
    isAnonymous: !!ret.isAnonymous,
    name: ret.content.slice(0, 30),
    authorId: ret.authorId,
  };
};

export const getUserNickname = async ({ userId }) => {
  const user = await models.Users.findByPk(userId, {
    attributes: ["nickname"],
  });

  if (!user) {
    throw new NotExistsError(
      `${userId}에 해당하는 사용자가 존재하지 않습니다.`
    );
  }

  return {
    nickname: user.nickname,
  };
};
