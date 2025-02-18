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
}) => {
  // 채팅방 생성, Room 목록에 추가하기
  // TODO : 해당 소켓은 어떡하지?
  const transaction = await models.sequelize.transaction();
  try {
    const ret = await models.Chatroom.create(
      {
        senderId,
        receiverId,
        name,
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
    attributes: ["isAnonymous"],
  });

  if (!ret) {
    throw NotExistsError(`${articleId}에 해당하는 게시글은 존재하지 않습니다.`);
  }

  return !!ret.isAnonymous;
};
