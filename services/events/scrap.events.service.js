import { 
    AlreadyExistsError,
    NotExistsError,
    UnauthorizedError } from "../../utils/errors/errors.js";
import db from "../../models/index.js";

export const newScrap = async (eventId, userId) => {
    // 알맞은 유저인지 확인 401
    const user = await db.Users.findOne({
        where: { userId: userId }
    });

    if (!user) {
        throw new UnauthorizedError("로그인하지 않은 사용자의 접근");
    }

    // eventId가 유효한지 확인 404
    const event = await db.Events.findOne({
        where: { eventId: eventId }
    });

    if (!event) {
        throw new NotExistsError("스크랩하려는 글이 삭제된 경우");
    }

    // 이미 이벤트가 스크랩 되어 있는지 확인 409
    const existScrap = await db.EventScraps.findOne({
        where: { eventId, userId }
    });

    if (existScrap) {
        throw new AlreadyExistsError("이미 스크랩된 이벤트의 경우");
    }

    // 스크랩 추가
    const newScrap = await db.EventScraps.create({
        eventId, userId, 
    });

    return newScrap;
};

export const deleteScrap = async (eventId, userId) => {
    // 알맞은 유저인지 확인
    const user = await db.Users.findOne({
        where: {
            userId: userId
        }
    })

    if (!user) {
        throw new UnauthorizedError("로그인하지 않은 사용자의 접근");
    }

    // eventId가 유효한지 확인 404
    const event = await db.Events.findOne({
        where: { eventId: eventId }
    });

    if (!event) {
        throw new NotExistsError("스크랩 취소하려는 이벤트가 존재하지 않는 경우");
    }

    // 스크랩이 존재하는지 확인 
    const existScrap = await db.EventScraps.findOne({
        where: { eventId, userId }
    });

    if (!existScrap) {
        throw new AlreadyExistsError("이미 스크랩된 이벤트가 없는 경우");
    }

    // 스크랩 삭제하기
    const deleteScrap = await db.EventScraps.destroy({
        where: { eventId, userId }
    });

    return deleteScrap;
};