import config from "../../config/config.js";
import { randomUUID } from "crypto"; // UUID 기반 랜덤 문자열
import { addMonths, addYears, setMinutes, setHours, format } from "date-fns";
const seederConfig = config.SEEDER;

export const getRandomNumber = (n) => Math.floor(Math.random() * n) + 1;
// Event 관련 랜덤 데이터 생성 함수
export const getRandomEventContent = () => {
  return eventContentSample[getRandomNumber(eventContentSample.length) - 1];
};
export const getRandomEventUrl = () => {
  return eventUrlSample[getRandomNumber(eventUrlSample.length) - 1];
};
export const getRandomApplicationDates = () => {
  const startDate = new Date(
    2024 + Math.floor(Math.random() * 2), // 2024~2025년 랜덤
    Math.floor(Math.random() * 12), // 1월~12월 랜덤
    Math.floor(Math.random() * 28) + 1 // 1일~28일 랜덤
  );

  const endDate = addMonths(startDate, Math.floor(Math.random() * 6) + 1); // 최소 1개월 ~ 최대 6개월 후

  return {
    applicationStart: format(startDate, "yyyy-MM-dd 00:00:00"),
    applicationEnd: format(endDate, "yyyy-MM-dd 00:00:00"),
  };
};
export const getRandomRepeatType = () => {
  const repeatTypes = [
    "none",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "custom",
  ];
  const probabilities = [50, 15, 15, 10, 5, 5]; // none(50%), daily/weekly(15%), monthly(10%), yearly/custom(5%)

  const randomValue = Math.random() * 100;
  let cumulativeProbability = 0;

  for (let i = 0; i < repeatTypes.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue < cumulativeProbability) {
      return repeatTypes[i];
    }
  }

  return "none"; // 기본값
};
export const getRepeatEndDate = (startDate, repeatType) => {
  if (repeatType === "none") return null;

  switch (repeatType) {
    case "daily":
      return format(addMonths(startDate, 7), "yyyy-MM-dd");
    case "weekly":
      return format(addMonths(startDate, 2), "yyyy-MM-dd");
    case "monthly":
      return format(addMonths(startDate, 6), "yyyy-MM-dd");
    case "yearly":
      return format(addYears(startDate, 3), "yyyy-MM-dd");
    case "custom":
      return format(addYears(startDate, 1), "yyyy-MM-dd");
    default:
      return null;
  }
};
export const getRandomStartAndEndTime = () => {
  const hour = Math.floor(Math.random() * 9) + 9; // 9 ~ 17시
  const minute = Math.floor(Math.random() * 60); // 0 ~ 59분
  return {
    startTime: format(setMinutes(setHours(new Date(), hour), minute), "HH:mm"),
    endTime: format(setMinutes(setHours(new Date(), hour + 6), minute), "HH:mm"),
  };
};
// 서울 내 적절한 위경도 범위 (대략적 값)
const LAT_MIN = 37.4;
const LAT_MAX = 37.7;
const LON_MIN = 126.8;
const LON_MAX = 127.2;

export const getRandomLatitude = () => {
  return (Math.random() * (LAT_MAX - LAT_MIN) + LAT_MIN).toFixed(6);
}

export const getRandomLongitude = () => {
  return (Math.random() * (LON_MAX - LON_MIN) + LON_MIN).toFixed(6);
}

// Article 관련 랜덤 데이터 생성 함수
export const getRandomArticleContent = () => {
  return articleContentSample[getRandomNumber(articleContentSample.length) - 1];
};
export const getRandomCommentContent = () => {
  return commentContentSample[getRandomNumber(commentContentSample.length) - 1];
};
export const getRandomImageUrl = () => {
  const baseName = `image_${randomUUID()}`; // 랜덤 고유 파일명 생성
  const randomFormat =
    imageFormatSample[getRandomNumber(imageFormatSample.length) - 1]; // 랜덤 확장자 선택
  return `/${baseName}.${randomFormat}`;
};

export const gacha = (rate) => Math.random() < rate / 100;

export const groups = [
  "잠실 / 송파 / 강동",
  "마포 / 서대문 / 은평",
  "강서 / 금천 / 양천",
  "광진 / 성동 / 중랑 / 동대문",
  "강남 / 서초 / 양재",
  "동작 / 관악 / 사당",
  "종로 / 중구 / 용산",
  "영등포 / 구로 / 신도림",
];

export const eventCategories = [
  { name: "교육", description: "세미나, 워크숍, 강연 및 학습 관련 이벤트" },
  { name: "문화", description: "전시회, 공연, 영화 상영 및 예술 관련 행사" },
  { name: "활동", description: "스포츠, 야외 활동, 봉사 및 커뮤니티 모임" },
  { name: "기타", description: "그 외 특정 분류에 속하지 않는 다양한 이벤트" },
];

export const noticeCategories = [
  { name: "공지사항", description: "서비스 이용에 대한 공지사항 및 업데이트" },
  { name: "이벤트", description: "다양한 이벤트 및 프로모션에 대한 소식" },
  { name: "업데이트", description: "서비스 업데이트나 점검 및 버전 정보 안내" },
  { name: "기타", description: "그 외 특정 분류에 속하지 않는 다양한 소식" },
];

export const terms = [
  {
    title: "서비스 이용 약관",
    content:
      "본 약관은 서비스 이용과 관련하여 이용자의 권리, 의무 및 책임사항을 규정합니다.",
    isRequired: true,
  },
  {
    title: "개인정보 처리 방침",
    content:
      "이용자의 개인정보 수집, 이용, 보호 및 처리에 관한 내용을 포함합니다.",
    isRequired: true,
  },
  {
    title: "마케팅 정보 수신 동의",
    content:
      "이메일, SMS 등을 통한 맞춤형 광고 및 프로모션 정보를 수신하는 것에 대한 동의입니다.",
    isRequired: false,
  },
  {
    title: "위치 정보 이용 동의",
    content:
      "서비스 제공을 위해 사용자의 위치 정보를 수집 및 활용하는 것에 대한 동의입니다.",
    isRequired: false,
  },
  {
    title: "쿠키 사용 동의",
    content:
      "웹사이트의 편리한 이용을 위해 쿠키를 저장하고 활용하는 것에 대한 동의입니다.",
    isRequired: false,
  },
];

export const community = [
  {
    title: "자유 게시판",
  },
  {
    title: "취미 게시판",
  },
  {
    title: "고민 게시판",
  },
  {
    title: "자기계발 게시판",
  },
  {
    title: "이다은 칭찬 게시판",
  },
];

export const eventContentSample = [
  "이번 주말, 자연 속에서 힐링하는 요가 클래스에 참여해보세요!",
  "미술관에서 열리는 특별 전시회, 전문가와 함께 작품을 감상하는 기회를 놓치지 마세요!",
  "도심 속에서 즐기는 쿠킹 클래스! 셰프와 함께 요리를 배우고 맛있는 한 끼를 만들어보세요.",
  "환경 보호를 위한 비치 클린업 활동, 뜻깊은 하루를 함께 만들어봐요!",
  "여행 작가와 함께하는 감성 글쓰기 워크숍, 글을 통해 당신의 이야기를 들려주세요.",
  "스타트업 창업자를 위한 네트워킹 행사, 비즈니스 아이디어를 공유하고 멘토링을 받아보세요.",
  "도시 속에서 즐기는 별빛 캠핑, 밤하늘 아래 특별한 시간을 가져보세요.",
  "뮤지컬 배우와 함께하는 연기 워크숍, 무대 위에서 나만의 캐릭터를 만들어봐요!",
  "AI와 미래 기술에 대한 무료 강연, 최신 IT 트렌드를 만나보세요!",
  "전문 바리스타와 함께하는 커피 테이스팅 클래스, 커피의 다양한 맛과 향을 경험하세요.",
  "도서관에서 열리는 북클럽 모임, 함께 책을 읽고 다양한 의견을 나눠보세요.",
  "댄스 클래스에서 에너지를 발산하세요! 힙합, 살사, 재즈댄스까지 모두 준비되어 있습니다.",
  "건강한 라이프스타일을 위한 러닝 클럽! 함께 뛰면서 목표를 만들어봐요.",
  "실전 투자 스터디 모임, 경제 전문가와 함께 투자 전략을 배우세요!",
  "친환경 제품 만들기 워크숍, 직접 제작한 제품을 가져갈 수 있어요!",
];

export const eventUrlSample = [
  "https://eventnow.com/ai-seminar", // 인공지능 세미나
  "https://culturehub.net/les-miserables", // 뮤지컬 공연
  "https://activezone.org/hanriver-running", // 한강 러닝 클럽
  "https://craftspace.io/pottery-class", // 도예 공방 원데이 클래스
  "https://greenearth.org/beach-cleanup", // 비치 클린업 캠페인
  "https://wellnesslife.com/yoga-workshop", // 요가 & 명상 워크숍
  "https://talktogether.net/language-exchange", // 글로벌 네트워킹 데이
  "https://brewmaster.io/coffee-brewing", // 브루잉 클래스
  "https://bookcircle.net/book-club", // 독서 토론 모임
  "https://gamefest.io/boardgame-festival", // 보드게임 페스티벌
  "https://pitcharena.com/startup-pitch", // 창업 아이디어 피칭 대회
  "https://marketguru.net/marketing-seminar", // 온라인 마케팅 전략 세미나
  "https://photogeek.io/photo-workshop", // 사진 촬영 워크숍
  "https://devcamp.io/coding-bootcamp", // 코딩 부트캠프
  "https://tastekorea.net/korean-traditional-alcohol", // 전통주 시음회
];

export const roadAddressSample = [
  "서울특별시 송파구 올림픽로 240",
  "서울특별시 마포구 양화로 156",
  "서울특별시 강서구 공항대로 123",
  "서울특별시 성동구 왕십리로 87",
  "서울특별시 강남구 테헤란로 456",
  "서울특별시 관악구 남부순환로 789",
  "서울특별시 종로구 세종대로 12",
  "서울특별시 영등포구 영중로 321",
];

export const jibunAddressSample = [
  "서울특별시 송파구 잠실동 40-1",
  "서울특별시 마포구 서교동 22-5",
  "서울특별시 강서구 화곡동 135-8",
  "서울특별시 성동구 행당동 98-2",
  "서울특별시 강남구 역삼동 750-10",
  "서울특별시 관악구 봉천동 503-7",
  "서울특별시 종로구 종로1가 2-3",
  "서울특별시 영등포구 영등포동 88-6",
];  

export const sigunguSample = [
  "송파구",
  "마포구",
  "강서구",
  "성동구",
  "강남구",
  "관악구",
  "종로구",
  "영등포구",
];

export const articleContentSample = [
  "게시글이 맛있네요",
  "이거 먹어보신 분 계신가요?",
  "피클 화이팅!",
  "피클이 최고!",
  "Backend는 힘들어요",
  "UMC 화이팅",
  "피클은 최고의 팀입니다.",
  "이다은은 최고의 PM입니다",
  "우리 디자이너 우주최고짱짱맨임",
  "댓글도 맛있어라 얍",
];

export const imageFormatSample = ["jpg", "png", "jpeg", "gif", "webp", "bmp"];

export const commentContentSample = [
  "댓글이 맛있네요",
  "먹기 싫은데요",
  "목업데이터 좀 줘라 다은아",
  "피클 화이팅!",
  "피클이 최고!",
  "댓글을 써보아요",
  "this is nogada",
  "아 술먹고 싶다",
  "오늘 점심 뭐 먹지?",
  "이 피클은 언제 먹어야 제맛이냐",
  "밥은 언제 줘요?",
  "하루종일 피클 생각만 했어요",
  "피클 마시멜로로 만들어주세요",
  "피클 좋아하는 사람 손!!",
  "오 이거 맛있어 보인다",
  "이거 왜 이렇게 재밌어요?",
  "이런게 창작의 고통이구나",
  "we need alcohol",
  "GPT 해줘",
  "이상한거만 나오네 내가 해야지 ..",
  "다은이가 만두는 음쓰래요",
  "피자에 피클 먹고 싶다",
  "비오는 날에는 코딩을",
];

export const userSample = seederConfig.SEEDER.USER.map((user) => ({
  ...user,
  profileImage: config.PEEKLE.DEFAULT_PROFILE_IMAGE,
}));
