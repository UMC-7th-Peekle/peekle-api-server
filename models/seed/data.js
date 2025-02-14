import config from "../../config.js";
const seederConfig = config.SEEDER;

export const getRandomNumber = (n) => Math.floor(Math.random() * n) + 1;
export const getRandomArticleContent = () => {
  return articleContentSample[getRandomNumber(articleContentSample.length) - 1];
};
export const getRandomCommentContent = () => {
  return commentContentSample[getRandomNumber(commentContentSample.length) - 1];
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
