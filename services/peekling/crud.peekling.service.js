import { Op } from "sequelize";
import models from "../../models/index.js";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

/**
 * 피클링 생성하기
 */
export const createPeekling = async ({
  title,
  description,
  minPeople,
  maxPeople,
  schedule,
  categoryId,
  userId,
  location,
  imagePaths,
}) => {
  // TODO
  // 피클링을 생성하면, Participant에 해당 사용자 넣고, Image Table에 넣어야 함.
  // 피클링 관리 권한은 지금은 Peekling created_user_id로 구분하지만,
  // 추후 권한 관리에서 resource & id를 명시함으로 변경할 필요가 있음.

  // start transaction
  const transaction = await models.sequelize.transaction();
  try {
    const createdPeekling = await models.Peekling.create(
      {
        title,
        description,
        minPeople,
        maxPeople,
        schedule,
        categoryId,
        location,
        createdUserId: userId,
      },
      {
        transaction,
      }
    );

    // 이미지가 존재할 경우 추가하기
    if (imagePaths.length > 0) {
      const peeklingImageData = imagePaths.map((path, index) => ({
        peeklingId: createdPeekling.peeklingId,
        imageUrl: path,
        sequence: index + 1, // 이미지 순서 설정
      }));

      await models.PeeklingImages.bulkCreate(peeklingImageData, {
        transaction,
      });
    }

    // Participant 추가
    await models.PeeklingParticipants.create(
      {
        peeklingId: createdPeekling.peeklingId,
        participantId: userId,
      },
      { transaction }
    );

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

/**
 * 피클링 임시저장하기
 */
export const tempSavePeekling = async (data) => {
  return await models.Peekling.create(data);
};

/**
 * 피클링 ID로 가져오기
 */
export const getPeeklingById = async ({ peeklingId }) => {
  // Peekling을 가져올 때,
  // 정보, 이미지, 참여자, 카테고리 테이블 include
  const data = await models.Peekling.findByPk(peeklingId, {
    include: [
      {
        model: models.PeeklingImages,
        as: "peeklingImages",
      },
      {
        model: models.PeeklingCategory,
        as: "category",
        exclude: ["categoryId", "createdAt", "updatedAt"],
      },
      {
        model: models.PeeklingParticipants,
        as: "peeklingParticipants",
        exclude: ["participantId"],
      },
      // {
      //   model: models.PeeklingChatroom,
      //   as: "peeklingChatroom",
      // },
    ],
  });

  const transformedImages = data.peeklingImages.map((image) => ({
    imageUrl: addBaseUrl(image.imageUrl),
    sequence: image.sequence,
  }));

  delete data.categoryId;

  return {
    ...data.dataValues,
    // ...data.category.dataValues,
    peeklingImages: transformedImages,
  };
};

export const getPeeklingByQuery = async ({ query, categoryId }) => {
  let queryWhereClause;
  let categoryWhereClause;

  if (query) {
    queryWhereClause = {
      [Op.or]: [
        {
          title: { [Op.like]: `%${query}%` }, // 제목에 검색어 포함
        },
        {
          content: { [Op.like]: `%${query}%` }, // 내용에 검색어 포함
        },
      ],
    };
  }

  const data = await models.Peekling.findAll({
    where: {},
  });
};

export const joinPeekling = async ({ peeklingId, userId }) => {
  // 사용자가 이미 나간 적이 있는 피클링이거나,
  // 피클링에서 쫓겨난 사용자면 참여 불가
};
