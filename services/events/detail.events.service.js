import path from "path";
import fs from "fs/promises";
import models from "../../models/index.js";
import {
  NotExistsError,
  NotAllowedError,
  InvalidInputError,
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import {
  addBaseUrl,
  deleteLocalFile,
} from "../../utils/upload/uploader.object.js";

export const detailEvent = async (eventId) => {
  // eventId가 유효하지 않은 경우 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  const data = await models.Events.findOne({
    where: { eventId: eventId },

    attributes: { exclude: ["categoryId", "createdUserId"] },
    include: [
      {
        model: models.EventCategory,
        as: "category",
        attributes: ["name", "description"],
      },
      {
        model: models.EventImages,
        as: "eventImages",
        attributes: ["imageUrl", "sequence"],
      },
      {
        model: models.EventSchedules,
        as: "eventSchedules",
        attributes: [
          "repeatType",
          "repeatEndDate",
          "isAllDay",
          "customText",
          "startDate",
          "endDate",
          "startTime",
          "endTime",
        ],
      },
    ],
  });

  if (!data) {
    logger.warn("존재하지 않는 이벤트에 대한 조회 요청입니다.", {
      action: "event:getDetail",
      actionType: "error",
      data: {
        eventId,
      },
    });
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }

  const transformedImages = data.eventImages.map((image) => ({
    imageUrl: addBaseUrl(image.imageUrl),
    sequence: image.sequence,
  }));

  return { ...data.dataValues, eventImages: transformedImages };
};

// 이벤트 내용 수정
export const updateEvent = async (eventId, userId, updateData) => {
  try {
    const event = await models.Events.findByPk(eventId);

    // 해당 이벤트가 존재하지 않는 경우
    if (!event) {
      logger.warn({
        action: "event:update",
        actionType: "error",
        message: "존재하지 않는 이벤트에 대한 수정 요청입니다.",
        userId: userId,
        data: updateData,
      });
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    // 작성자가 수정을 요청한게 아닌 경우
    if (event.createdUserId.toString() !== userId) {
      logger.error({
        action: "event:update",
        actionType: "error",
        message: "타인이 작성한 글에 대한 수정 요청",
        data: {
          authorId: event.createdUserId,
          requestedUserId: userId,
          requestedData: updateData,
        },
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 게시글을 수정할 수 없습니다."
      );
    }

    // 필요한 필드만 업데이트
    // shallow copy
    Object.assign(event, updateData);

    await event.save();
    logger.debug({
      action: "event:update",
      actionType: "sucess",
      message: "이벤트 수정 완료",
      data: {
        requestedUserId: userId,
        updatedData: updateData,
      },
    });

    // 이미지가 새로 들어온 경우에만 처리
    if (updateData.imagePaths.length > 0) {
      // DB에서 기존 이미지 경로 가져오기
      const existingImages = await models.EventImages.findAll({
        where: { eventId },
        attributes: ["imageId", "imageUrl", "sequence"],
      });

      logger.silly({
        action: "event:image:getCurrent",
        actionType: "log",
        data: {
          requestedUserId: userId,
          existingImages,
        },
      });

      // 이미지 순서 변경

      /*
        ** 이거 아님. 그냥 고민했던 흔적을 남기고 싶어서 남겨둠 **

        imageSequence field를 받아서 수정을 진행합니다.
        해당 field는 숫자들의 배열이며, 
        각 숫자는 이미지 순서 및 삭제/추가 여부를 나타냅니다.

        -1: 삭제된 이미지 (DB에서 삭제)
        삭제된 이미지의 경우 기존 이미지 개수와 
        동일한 길이의 배열이 들어왔을 때만 존재해야 합니다.
        (지금 이거 예외 처리 안되있음, 그렇지 않으면 말이 안됨)
        (한 번 종이에 써보면서 생각해보면 답 나옴)

        -2: 새로 추가된 이미지 (DB에 추가)
        imagePaths로 들어온 이미지 순서대로 넣어주면 됩니다.
        첫 번째 -2 순서에 첫 번째로 들어온 이미지, ... 와 같이

        나머지 숫자는 기존 이미지 순서를 나타냅니다.

        ex) 원래 DB에 3개의 이미지가 있던 게시글에서
        [2, 1, -2] 라는 배열이 들어온 경우
        1. [기존 2번] 이미지를 1번으로 변경
        2. [기존 1번] 이미지를 2번으로 변경
        3. [새로 추가된 이미지]를 3번으로 추가

        ex2) 원래 DB에 3개의 이미지가 있던 게시글에서
        [2, -1, -1] 라는 배열이 들어온 경우
        1. [기존 2번] 이미지를 1번으로 변경
        2. [기존 1번, 3번] 이미지를 DB에서 삭제
      */

      /*
        ** 이거 보면 됩니다 **

        기존 이미지 Sequence와
        Input으로 추가한 이미지의 Sequence를 
        모두 받아서 하는 방향으로 수정하자.

        existingImageSequence : 기존 파일들의 순서 및 삭제 여부
        newImageSequence : 새로 추가된 파일들의 순서 (들어갈 곳)


        동일하게 -1 삭제, 그 이외에는 수정하면 될듯.

        existingImageSequence: [2, 1, -2]
        newImageSequence: [4, 5, 6]

        TODO : DB에 Unique key를 안 걸어둬서, 
        eventId & sequence가 동일한 컬럼이 존재할 수 있지만 (가능하지만),
        Unique key를 걸어서 중복을 방지함과 동시에 데이터 무결성을 지켜야 함.
        아직 코드에선 해당 부분에 대한 예외 처리를 하지 않음.

        (client가 잘못된 데이터를 보내는 경우에 대한 처리를 하지 않았다는 말)
        근데 그냥 바로 해버림 6시 40분인데 자고 싶다
      */

      // 사용자가 보낸 이미지 순서가 이상한지 확인
      const filteredExisting = updateData.existingImageSequence.filter(
        (seq) => seq !== -1
      );
      const combinedSequences = [
        ...filteredExisting,
        ...updateData.newImageSequence,
      ];
      const uniqueSequences = new Set(combinedSequences);

      if (
        updateData.existingImageSequence.length !== existingImages.length || // 존재하는 이미지 개수가 다른 경우
        updateData.newImageSequence.length !== updateData.imagePaths.length || // 새로 추가된 이미지 개수가 다른 경우
        uniqueSequences.size !== combinedSequences.length || // 중복된 순서가 있는 경우
        Math.min(...combinedSequences) !== 1 || // 순서가 1부터 시작하지 않는 경우
        Math.max(...combinedSequences) !== combinedSequences.length // 순서가 중간에 빠진 경우
      ) {
        throw new InvalidInputError(
          "설명은 못하곘는데 이상한 입력 넣지 말아라 진짜"
        );
      }

      // 기존 이미지 순서 변경
      updateData.existingImageSequence.map(async (seq, idx) => {
        if (seq === -1) {
          // 삭제할 이미지
          logger.silly({
            action: "event:image:update:delete",
            actionType: "log",
            data: {
              requestedUserId: userId,
              imageId: existingImages[idx].imageId,
              originalSequence: idx + 1,
              newSequence: seq,
            },
          });
          await existingImages[idx].destroy();
          await deleteLocalFile(existingImages[idx].imageUrl);
        } else {
          // 이미지 순서 변경
          logger.silly({
            action: "event:image:update:modify",
            actionType: "log",
            data: {
              requestedUserId: userId,
              imageId: existingImages[idx].imageId,
              originalSequence: existingImages[idx].sequence,
              newSequence: seq,
            },
          });
          await existingImages[idx].update({ sequence: seq });
        }
      });

      // 새로 추가된 이미지
      updateData.newImageSequence.map(async (seq, idx) => {
        logger.silly({
          action: "event:image:update:create",
          actionType: "log",
          data: {
            requestedUserId: userId,
            imageUrl: updateData.imagePaths[idx],
            newSequence: seq,
          },
        });
        await models.EventImages.create({
          eventId,
          imageUrl: updateData.imagePaths[idx],
          sequence: seq,
        });
      });

      logger.debug({
        action: "event:image:update",
        actionType: "success",
        message: "이미지 업데이트 완료",
        data: {
          requestedUserId: userId,
          updatedData: updateData,
        },
      });
    }

    return { event };
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async ({ eventId, userId }) => {
  try {
    const event = await models.Events.findByPk(eventId, {
      include: [
        {
          model: models.EventImages,
          as: "eventImages",
          attributes: ["imageId", "imageUrl"],
        },
      ],
    });

    if (!event) {
      logger.warn({
        action: "event:delete",
        actionType: "error",
        message: "존재하지 않는 이벤트에 대한 삭제 요청입니다.",
        userId: userId,
      });
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    if (event.createdUserId.toString() !== userId) {
      logger.warn({
        action: "event:delete",
        actionType: "error",
        message: "권한이 없는 이벤트에 대한 삭제 요청입니다.",
        data: {
          authorId: event.createdUserId,
          requestedUserId: userId,
        },
      });
      throw new NotAllowedError("이벤트 삭제 권한이 없습니다.");
    }

    // 로컬 파일 삭제
    const deletePromises = event.eventImages.map((img) =>
      deleteLocalFile(img.imageUrl)
    );

    // 모든 파일 삭제 완료 대기
    // because, deletePromises 안에 있는 비동기 작업들을
    // await을 걸어서 처리하지 않았기에
    await Promise.all(deletePromises);

    // TODO : 로컬에 저장된 이미지 또한 삭제하여야 함
    await event.destroy();

    logger.debug({
      action: "event:delete",
      actionType: "success",
      message: "이벤트 삭제 완료",
      data: {
        requestedUserId: userId,
        eventId,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};
