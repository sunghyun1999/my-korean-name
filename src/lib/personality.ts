/**
 * 이름 기반 한국식 성격/운세/동물상 생성
 *
 * 핵심: 한글 이름의 초성을 분석하여 성격 결과와 연결
 * - 초성이 결과의 "이유"를 제공 (바이럴 핵심)
 * - 해시는 같은 초성 그룹 내에서 세부 변이 제공
 */

// ── 한글 초성 추출 ──

const CHOSEONG_LIST = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
];

function getChoseong(char: string): string | null {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return null;
  return CHOSEONG_LIST[Math.floor((code - 0xAC00) / (21 * 28))];
}

function extractChoseongs(koreanName: string): string[] {
  return [...koreanName]
    .map(getChoseong)
    .filter((c): c is string => c !== null);
}

// ── 초성별 성격 키워드 & 매핑 ──

interface ChoseongProfile {
  keyword: string;       // 한 단어 키워드
  keywordEn: string;
  meaning: string;       // 한국어 설명
  meaningEn: string;     // 영어 설명
  animalIdx: number;     // 추천 동물상 인덱스
  elementIdx: number;    // 추천 오행 인덱스
  rankIdx: number;       // 추천 관직 인덱스
}

const CHOSEONG_PROFILES: Record<string, ChoseongProfile> = {
  "ㄱ": {
    keyword: "기개", keywordEn: "Spirit",
    meaning: "굳센 의지와 기개를 상징하는 소리",
    meaningEn: "The sound of strong will and spirit",
    animalIdx: 0, elementIdx: 3, rankIdx: 3, // 호랑이, 쇠, 포도대장
  },
  "ㄲ": {
    keyword: "끈기", keywordEn: "Tenacity",
    meaning: "꺾이지 않는 끈기를 상징하는 소리",
    meaningEn: "The sound of unbreakable tenacity",
    animalIdx: 7, elementIdx: 3, rankIdx: 7, // 늑대, 쇠, 선전관
  },
  "ㄴ": {
    keyword: "너그러움", keywordEn: "Generosity",
    meaning: "너그럽고 따뜻한 마음을 상징하는 소리",
    meaningEn: "The sound of a generous and warm heart",
    animalIdx: 4, elementIdx: 2, rankIdx: 4, // 곰, 흙, 관찰사
  },
  "ㄷ": {
    keyword: "담대함", keywordEn: "Boldness",
    meaning: "담대하고 용감한 기운을 상징하는 소리",
    meaningEn: "The sound of boldness and courage",
    animalIdx: 0, elementIdx: 1, rankIdx: 0, // 호랑이, 불, 영의정
  },
  "ㄸ": {
    keyword: "뚝심", keywordEn: "Grit",
    meaning: "묵묵히 밀고 나가는 뚝심을 상징하는 소리",
    meaningEn: "The sound of unwavering grit",
    animalIdx: 4, elementIdx: 2, rankIdx: 7, // 곰, 흙, 선전관
  },
  "ㄹ": {
    keyword: "낭만", keywordEn: "Romance",
    meaning: "자유롭고 낭만적인 영혼을 상징하는 소리",
    meaningEn: "The sound of a free and romantic soul",
    animalIdx: 6, elementIdx: 4, rankIdx: 1, // 사슴, 물, 대제학
  },
  "ㅁ": {
    keyword: "포용", keywordEn: "Embrace",
    meaning: "모든 것을 품는 넓은 마음을 상징하는 소리",
    meaningEn: "The sound of an embracing heart",
    animalIdx: 4, elementIdx: 2, rankIdx: 6, // 곰, 흙, 의녀
  },
  "ㅂ": {
    keyword: "빛남", keywordEn: "Brilliance",
    meaning: "밝게 빛나는 존재감을 상징하는 소리",
    meaningEn: "The sound of brilliant presence",
    animalIdx: 5, elementIdx: 1, rankIdx: 2, // 여우, 불, 도승지
  },
  "ㅃ": {
    keyword: "열정", keywordEn: "Passion",
    meaning: "뜨겁게 타오르는 열정을 상징하는 소리",
    meaningEn: "The sound of burning passion",
    animalIdx: 7, elementIdx: 1, rankIdx: 3, // 늑대, 불, 포도대장
  },
  "ㅅ": {
    keyword: "섬세함", keywordEn: "Delicacy",
    meaning: "섬세하고 감각적인 감성을 상징하는 소리",
    meaningEn: "The sound of delicate sensibility",
    animalIdx: 3, elementIdx: 4, rankIdx: 5, // 고양이, 물, 암행어사
  },
  "ㅆ": {
    keyword: "강직함", keywordEn: "Integrity",
    meaning: "곧고 강직한 성품을 상징하는 소리",
    meaningEn: "The sound of upright integrity",
    animalIdx: 0, elementIdx: 3, rankIdx: 3, // 호랑이, 쇠, 포도대장
  },
  "ㅇ": {
    keyword: "원만함", keywordEn: "Harmony",
    meaning: "둥글고 원만한 인품을 상징하는 소리",
    meaningEn: "The sound of harmonious character",
    animalIdx: 1, elementIdx: 0, rankIdx: 4, // 토끼, 나무, 관찰사
  },
  "ㅈ": {
    keyword: "정의", keywordEn: "Justice",
    meaning: "바르고 정의로운 마음을 상징하는 소리",
    meaningEn: "The sound of righteousness and justice",
    animalIdx: 7, elementIdx: 3, rankIdx: 5, // 늑대, 쇠, 암행어사
  },
  "ㅉ": {
    keyword: "집념", keywordEn: "Determination",
    meaning: "끝까지 포기하지 않는 집념을 상징하는 소리",
    meaningEn: "The sound of relentless determination",
    animalIdx: 7, elementIdx: 1, rankIdx: 7, // 늑대, 불, 선전관
  },
  "ㅊ": {
    keyword: "창의", keywordEn: "Creativity",
    meaning: "새로운 것을 만들어내는 창의력을 상징하는 소리",
    meaningEn: "The sound of creative innovation",
    animalIdx: 5, elementIdx: 0, rankIdx: 1, // 여우, 나무, 대제학
  },
  "ㅋ": {
    keyword: "쾌활", keywordEn: "Cheerfulness",
    meaning: "밝고 쾌활한 에너지를 상징하는 소리",
    meaningEn: "The sound of bright and cheerful energy",
    animalIdx: 2, elementIdx: 1, rankIdx: 2, // 강아지, 불, 도승지
  },
  "ㅌ": {
    keyword: "통찰", keywordEn: "Insight",
    meaning: "깊이 꿰뚫어 보는 통찰력을 상징하는 소리",
    meaningEn: "The sound of deep insight",
    animalIdx: 3, elementIdx: 4, rankIdx: 1, // 고양이, 물, 대제학
  },
  "ㅍ": {
    keyword: "품격", keywordEn: "Elegance",
    meaning: "고귀하고 품격 있는 기품을 상징하는 소리",
    meaningEn: "The sound of noble elegance",
    animalIdx: 6, elementIdx: 0, rankIdx: 0, // 사슴, 나무, 영의정
  },
  "ㅎ": {
    keyword: "희망", keywordEn: "Hope",
    meaning: "밝은 미래를 향한 희망을 상징하는 소리",
    meaningEn: "The sound of hope for a bright future",
    animalIdx: 2, elementIdx: 0, rankIdx: 4, // 강아지, 나무, 관찰사
  },
};

// 기본 프로필 (초성을 못 뽑았을 때)
const DEFAULT_PROFILE: ChoseongProfile = {
  keyword: "조화", keywordEn: "Balance",
  meaning: "모든 것이 균형 잡힌 조화를 상징합니다",
  meaningEn: "Symbolizes perfect balance and harmony",
  animalIdx: 2, elementIdx: 0, rankIdx: 4,
};

// ── 해시 유틸 ──

function hashName(name: string): number {
  const normalized = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(items: T[], hash: number, offset = 0): T {
  return items[(hash + offset) % items.length];
}

// ── 한국 동물상 ──
export interface AnimalType {
  animal: string;
  emoji: string;
  trait: string;
  description: string;
  descriptionEn: string;
}

const ANIMALS: AnimalType[] = [
  {
    animal: "Tiger (호랑이상)",
    emoji: "🐯",
    trait: "Charisma",
    description: "강한 눈매와 당당한 분위기를 가졌어요. 리더십이 뛰어나고 주변 사람들이 자연스럽게 따르는 타입입니다.",
    descriptionEn: "You have sharp eyes and a confident aura. A natural leader who people follow instinctively.",
  },
  {
    animal: "Bunny (토끼상)",
    emoji: "🐰",
    trait: "Lovable",
    description: "부드럽고 귀여운 인상을 가졌어요. 누구에게나 호감을 주고, 첫인상이 매우 좋은 타입입니다.",
    descriptionEn: "You have a soft and adorable impression. Instantly likable with a great first impression.",
  },
  {
    animal: "Puppy (강아지상)",
    emoji: "🐶",
    trait: "Friendly",
    description: "밝고 에너지 넘치는 분위기! 사교성이 뛰어나고 어디서든 분위기를 살리는 무드메이커입니다.",
    descriptionEn: "Bright and full of energy! Highly sociable and the ultimate mood maker in any group.",
  },
  {
    animal: "Cat (고양이상)",
    emoji: "🐱",
    trait: "Mysterious",
    description: "도도하면서도 매력적인 분위기를 풍겨요. 미스터리한 매력으로 사람들의 관심을 끄는 타입입니다.",
    descriptionEn: "Elegant yet charming. Your mysterious allure naturally draws people's attention.",
  },
  {
    animal: "Bear (곰상)",
    emoji: "🐻",
    trait: "Reliable",
    description: "편안하고 믿음직한 인상을 가졌어요. 함께 있으면 안정감을 주는 든든한 존재입니다.",
    descriptionEn: "You give off a warm and reliable impression. A reassuring presence that makes everyone feel safe.",
  },
  {
    animal: "Fox (여우상)",
    emoji: "🦊",
    trait: "Clever",
    description: "날카로운 눈빛과 세련된 분위기! 상황 판단이 빠르고 센스 있는 행동으로 주목받는 타입입니다.",
    descriptionEn: "Sharp eyes with a sophisticated vibe! Quick-witted and always noticed for your keen sense.",
  },
  {
    animal: "Deer (사슴상)",
    emoji: "🦌",
    trait: "Pure",
    description: "맑고 청순한 분위기를 가졌어요. 순수한 매력으로 사람들의 보호 본능을 자극하는 타입입니다.",
    descriptionEn: "You have a pure and innocent aura. Your genuine charm triggers everyone's protective instinct.",
  },
  {
    animal: "Wolf (늑대상)",
    emoji: "🐺",
    trait: "Wild",
    description: "강렬하고 매력적인 분위기! 독립적이면서도 의리 있는 성격으로 깊은 관계를 만들어가는 타입입니다.",
    descriptionEn: "Intense and charismatic! Independent yet loyal, you build deep and meaningful relationships.",
  },
];

// ── 오행 (Five Elements) ──
export interface Element {
  name: string;
  hanja: string;
  emoji: string;
  color: string;
  trait: string;
  description: string;
  descriptionEn: string;
}

const ELEMENTS: Element[] = [
  {
    name: "Wood",
    hanja: "木",
    emoji: "🌳",
    color: "#22c55e",
    trait: "Growth & Creativity",
    description: "끊임없이 성장하는 에너지를 가졌어요. 새로운 아이디어가 넘치고, 도전을 즐기는 성격입니다.",
    descriptionEn: "You carry the energy of endless growth. Full of new ideas, you thrive on challenges.",
  },
  {
    name: "Fire",
    hanja: "火",
    emoji: "🔥",
    color: "#ef4444",
    trait: "Passion & Leadership",
    description: "뜨거운 열정이 가득해요! 어떤 일이든 온 힘을 다하고, 주변을 이끄는 카리스마가 있습니다.",
    descriptionEn: "Full of burning passion! You give everything your all and have the charisma to lead others.",
  },
  {
    name: "Earth",
    hanja: "土",
    emoji: "🏔️",
    color: "#a16207",
    trait: "Stability & Trust",
    description: "묵직한 안정감을 가졌어요. 약속을 중요하게 여기고, 주변 사람들에게 깊은 신뢰를 받는 타입입니다.",
    descriptionEn: "You radiate solid stability. You value promises and earn deep trust from those around you.",
  },
  {
    name: "Metal",
    hanja: "金",
    emoji: "⚔️",
    color: "#eab308",
    trait: "Decision & Justice",
    description: "날카로운 판단력과 강한 의지를 가졌어요. 옳고 그름이 명확하고, 결단력 있는 행동파입니다.",
    descriptionEn: "You possess sharp judgment and strong will. Clear sense of right and wrong, a decisive doer.",
  },
  {
    name: "Water",
    hanja: "水",
    emoji: "🌊",
    color: "#3b82f6",
    trait: "Wisdom & Adaptability",
    description: "물처럼 유연한 사고방식을 가졌어요. 어떤 환경에든 잘 적응하고, 깊은 통찰력을 지닌 타입입니다.",
    descriptionEn: "You think as flexibly as water flows. You adapt to any environment with deep insight.",
  },
];

// ── 조선시대 관직 ──
export interface JoseonRank {
  rank: string;
  title: string;
  description: string;
  descriptionEn: string;
  emoji: string;
}

const JOSEON_RANKS: JoseonRank[] = [
  {
    rank: "Yeonguijeong (영의정)",
    title: "Prime Minister",
    description: "조선의 최고 관직! 나라의 큰 결정을 이끄는 지도자의 기질을 타고났어요.",
    descriptionEn: "The highest minister of Joseon! You were born with the temperament of a great leader.",
    emoji: "👑",
  },
  {
    rank: "Daejehak (대제학)",
    title: "Grand Scholar",
    description: "학문과 지식의 최고봉! 배움을 사랑하고, 지혜로 세상을 밝히는 타입입니다.",
    descriptionEn: "The pinnacle of scholarship! You love learning and illuminate the world with wisdom.",
    emoji: "📚",
  },
  {
    rank: "Doseungji (도승지)",
    title: "Royal Secretary",
    description: "왕의 가장 가까운 곳에서 일하는 실세! 눈치 빠르고 실무 능력이 탁월한 타입입니다.",
    descriptionEn: "The king's closest aide! Quick-witted with exceptional practical skills.",
    emoji: "📜",
  },
  {
    rank: "Pododaejang (포도대장)",
    title: "Chief of Police",
    description: "정의를 지키는 수호자! 불의를 참지 못하고, 약자를 보호하려는 마음이 강한 타입입니다.",
    descriptionEn: "Guardian of justice! You cannot stand injustice and have a strong desire to protect the weak.",
    emoji: "⚔️",
  },
  {
    rank: "Gwanchalsa (관찰사)",
    title: "Provincial Governor",
    description: "넓은 시야로 전체를 살피는 능력! 조직 관리에 탁월하고, 공정한 판단을 내리는 타입입니다.",
    descriptionEn: "You have the ability to oversee the big picture! Excellent at management with fair judgment.",
    emoji: "🏯",
  },
  {
    rank: "Amhaengeosa (암행어사)",
    title: "Secret Royal Inspector",
    description: "숨겨진 진실을 찾아내는 탐정 기질! 세밀한 관찰력과 정의감을 겸비한 타입입니다.",
    descriptionEn: "A detective's instinct for uncovering hidden truths! Keen observation paired with a sense of justice.",
    emoji: "🔍",
  },
  {
    rank: "Uinyeo (의녀)",
    title: "Royal Healer",
    description: "사람을 돌보는 따뜻한 마음! 공감 능력이 뛰어나고, 어려운 사람을 돕고 싶어하는 타입입니다.",
    descriptionEn: "A warm heart that cares for others! Exceptional empathy with a desire to help those in need.",
    emoji: "💊",
  },
  {
    rank: "Seonjeongwan (선전관)",
    title: "Royal Guard",
    description: "충성심과 용맹함을 겸비한 무인! 믿음직하고, 맡은 바를 끝까지 해내는 책임감의 소유자입니다.",
    descriptionEn: "A warrior of loyalty and valor! Trustworthy and responsible, you always see things through.",
    emoji: "🛡️",
  },
];

// ── 행운의 한국 음식 ──
interface LuckyFood {
  name: string;
  nameEn: string;
  emoji: string;
  meaning: string;
  meaningEn: string;
}

const LUCKY_FOODS: LuckyFood[] = [
  { name: "떡볶이", nameEn: "Tteokbokki", emoji: "🌶️", meaning: "매운맛처럼 강렬한 인생을 살게 될 거예요", meaningEn: "Your life will be as intense as its spicy flavor" },
  { name: "비빔밥", nameEn: "Bibimbap", emoji: "🍚", meaning: "다양한 재능이 조화를 이뤄 빛나게 될 거예요", meaningEn: "Your diverse talents will harmonize and shine" },
  { name: "삼겹살", nameEn: "Samgyeopsal", emoji: "🥩", meaning: "사람들과의 관계에서 큰 행운이 찾아올 거예요", meaningEn: "Great fortune will come through your relationships" },
  { name: "김치찌개", nameEn: "Kimchi Jjigae", emoji: "🍲", meaning: "시간이 갈수록 깊어지는 매력의 소유자예요", meaningEn: "Your charm deepens with time, like aged kimchi" },
  { name: "치킨", nameEn: "Korean Fried Chicken", emoji: "🍗", meaning: "어디서든 인기를 끌 운명을 가졌어요", meaningEn: "You're destined to be popular wherever you go" },
  { name: "냉면", nameEn: "Naengmyeon", emoji: "🍜", meaning: "시원한 판단력으로 성공을 거머쥘 거예요", meaningEn: "Your cool judgment will lead you to success" },
  { name: "호떡", nameEn: "Hotteok", emoji: "🥞", meaning: "겉은 담백하지만 속은 달콤한 매력을 가졌어요", meaningEn: "Plain on the outside, sweet on the inside" },
  { name: "불고기", nameEn: "Bulgogi", emoji: "🔥", meaning: "부드러운 카리스마로 모든 것을 녹여버릴 거예요", meaningEn: "Your gentle charisma will melt everyone's heart" },
];

// ── 궁합 동물 이름 (영어 기준) ──
const ANIMAL_NAMES_EN = [
  "Tiger", "Bunny", "Puppy", "Cat", "Bear", "Fox", "Deer", "Wolf",
];

// ── 초성 종합 분석 ──

interface NameReading {
  keywords: string[];      // 영어 키워드 목록 (최대 3개)
  summary: string;         // 영어 종합 설명
  summaryKo: string;       // 한국어 종합 설명
  animalIdx: number;
  elementIdx: number;
  rankIdx: number;
}

function analyzeChoseongs(koreanName: string, hash: number): NameReading {
  const choseongs = extractChoseongs(koreanName);
  if (choseongs.length === 0) {
    return {
      keywords: ["Balance"], summary: "Your name carries a balanced harmony of sounds.",
      summaryKo: "당신의 이름은 균형 잡힌 조화로운 소리를 담고 있어요.",
      animalIdx: 2, elementIdx: 0, rankIdx: 4,
    };
  }

  // 의미 있는 초성만 수집 (ㅇ 제외, 중복 제거, 순서 유지)
  const meaningful = choseongs.filter(c => c !== "ㅇ");
  const unique = [...new Set(meaningful.length > 0 ? meaningful : choseongs)];

  // 상위 2~3개 초성의 프로필 수집
  const profiles = unique.slice(0, 3).map(c => ({
    choseong: c,
    profile: CHOSEONG_PROFILES[c] || DEFAULT_PROFILE,
  }));

  // 키워드 수집
  const keywords = profiles.map(p => p.profile.keywordEn);

  // 종합 설명 생성
  const soundDesc = profiles
    .map(p => `"${p.choseong}" (${p.profile.keywordEn})`)
    .join(", ");

  const summary = `The sounds in "${koreanName}" blend ${keywords.join(" and ")} energy. ${profiles[0].profile.meaningEn}.`;
  const summaryKo = `"${koreanName}"에 담긴 소리는 ${profiles.map(p => p.profile.keyword).join("과 ")}의 기운을 품고 있어요.`;

  // 모든 초성의 인덱스를 가중 합산하여 결과 결정 (편중 방지)
  const primary = profiles[0].profile;

  // 초성별 인덱스 합산으로 다양성 확보
  let animalSum = 0, elementSum = 0, rankSum = 0;
  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i].profile;
    const weight = i === 0 ? 3 : 1; // 첫 번째 초성 가중치 3배
    animalSum += p.animalIdx * weight;
    elementSum += p.elementIdx * weight;
    rankSum += p.rankIdx * weight;
  }
  // 해시로 추가 변이 (같은 초성 조합이라도 이름마다 다른 결과)
  const nameLen = koreanName.replace(/\s/g, "").length;

  return {
    keywords,
    summary,
    summaryKo,
    animalIdx: (animalSum + nameLen) % ANIMALS.length,
    elementIdx: (elementSum + nameLen) % ELEMENTS.length,
    rankIdx: (rankSum + hash % 3) % JOSEON_RANKS.length,
  };
}

// ── 메인 결과 생성 ──
export interface PersonalityResult {
  koreanName: string;
  animal: AnimalType;
  element: Element;
  joseonRank: JoseonRank;
  luckyFood: LuckyFood;
  luckyNumber: number;
  compatibility: string;
  compatibilityEn: string;
  // 이름 소리 분석
  nameKeywords: string[];
  nameReading: string;
  nameReadingKo: string;
}

export function generatePersonality(
  originalName: string,
  koreanName: string
): PersonalityResult {
  const hash = hashName(originalName);
  const reading = analyzeChoseongs(koreanName, hash);

  const animal = ANIMALS[reading.animalIdx];
  const element = ELEMENTS[reading.elementIdx];
  const joseonRank = JOSEON_RANKS[reading.rankIdx];
  const luckyFood = pick(LUCKY_FOODS, hash, 19);
  const luckyNumber = (hash % 9) + 1;

  // 궁합: 현재 동물과 다른 동물
  const compatIdx = pick(
    Array.from({ length: 8 }, (_, i) => i).filter(i => i !== reading.animalIdx),
    hash,
    31
  );
  const compatAnimal = ANIMAL_NAMES_EN[compatIdx];

  return {
    koreanName,
    animal,
    element,
    joseonRank,
    luckyFood,
    luckyNumber,
    compatibility: `${ANIMALS[compatIdx].animal}과 환상의 케미!`,
    compatibilityEn: `Perfect chemistry with ${compatAnimal} type!`,
    nameKeywords: reading.keywords,
    nameReading: reading.summary,
    nameReadingKo: reading.summaryKo,
  };
}
