import logger from "../../utils/logger/logger.js";
import models from "../index.js";

const peeklingCategory = {
  운동: [
    "등산",
    "클라이밍",
    "요가/필라테스",
    "헬스",
    "스키/보드",
    "산책",
    "러닝",
    "자전거",
    "수영/다이빙",
    "스케이트보드",
    "서핑",
    "골프",
    "플로깅",
    "구기 스포츠",
    "스포츠 관람",
    "기타",
  ],
  "N잡/재테크": [
    "투자/금융",
    "부동산",
    "N잡/창업",
    "경제",
    "블로그/SNS/전자책",
    "모임 사업",
    "주식",
    "기타",
  ],
  취미: [
    "드로잉",
    "사진",
    "공예",
    "노래/악기",
    "글쓰기",
    "춤",
    "봉사활동",
    "반려동물",
    "음악감상",
    "뷰티/스타일링",
    "명상",
    "캘리그라피",
    "만화",
    "쇼핑",
    "기타",
  ],
  "여행/아웃도어": ["여행", "캠핑/피크닉", "드라이브", "복합문화공간", "기타"],
  "문화/예술": [
    "전시",
    "영화",
    "공연/뮤지컬/연극",
    "콘서트/연주회/페스티벌",
    "팝업",
    "기타",
  ],
  자기계발: [
    "독서/스터디",
    "대화/스피치",
    "커리어",
    "창작",
    "기타",
    "이다은 🦢",
  ],
  외국어: ["영어", "일본어", "중국어", "언어교환", "기타"],
};

// 시딩 함수
export const seedPeeklingCategory = async () => {
  try {
    const categories = [];
    for (const [parent, children] of Object.entries(peeklingCategory)) {
      for (const child of children) {
        categories.push({ category: parent, subcategory: child });
      }
    }

    console.log(`Cateogories : ${categories}`);

    await models.PeeklingCategory.destroy({
      where: {},
    });

    await models.sequelize.query("SET foreign_key_checks = 0;");
    await models.sequelize.query("TRUNCATE TABLE peekling_category;");
    await models.sequelize.query("SET foreign_key_checks = 1;");

    await models.PeeklingCategory.bulkCreate(categories);
    logger.warn("✅ Categories seeded successfully!");
  } catch (error) {
    logger.error("🔥 Seeding failed:", error);
  }
};
