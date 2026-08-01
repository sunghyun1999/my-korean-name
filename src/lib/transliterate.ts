/**
 * 영어 이름 → 한글 음역 변환
 *
 * 전략 (우선순위):
 * 1. 수동 오버라이드 (CMU 사전이 틀리거나 관용적 표기가 다른 이름)
 * 2. CMU Pronouncing Dictionary → ARPAbet → 한글 (134,000+ 단어)
 * 3. 패턴 기반 fallback (CMU에도 없는 이름)
 */

import { dictionary as cmuDict } from "cmu-pronouncing-dictionary";
import { arpabetToHangul } from "./arpabet-to-hangul";

// ── 1. 수동 오버라이드 ──
// CMU 사전의 발음이 관용적 한글 표기와 다른 경우만 여기에 등록
const OVERRIDE: Record<string, string> = {
  // CMU 발음 ≠ 한국 관용표기
  james: "제임스", andrew: "앤드류", matthew: "매튜", anthony: "앤서니",
  michael: "마이클", rachel: "레이첼", samuel: "새뮤얼", daniel: "대니얼",
  gabriel: "가브리엘", nathaniel: "나다니엘", raphael: "라파엘",
  emmanuel: "엠마누엘", joseph: "조셉", stephen: "스티븐",
  christopher: "크리스토퍼", elizabeth: "엘리자베스",
  katherine: "캐서린", catherine: "캐서린", charlotte: "샬럿",
  benjamin: "벤자민", nicholas: "니콜라스", alexander: "알렉산더",
  theodore: "시어도어", sebastian: "세바스찬", jacqueline: "재클린",
  // CMU AA/AH가 한국어와 다른 이름
  robert: "로버트", william: "윌리엄", sarah: "사라", emma: "엠마",
  olivia: "올리비아", emily: "에밀리", christian: "크리스천",
  thomas: "토마스", roberto: "로베르토", jessica: "제시카",
  sophia: "소피아", david: "데이비드", richard: "리처드",
  jennifer: "제니퍼", samantha: "사만다", natalie: "나탈리",
  stephanie: "스테파니", rebecca: "레베카", victoria: "빅토리아",
  christina: "크리스티나", virginia: "버지니아", penelope: "페넬로피",
  isabella: "이사벨라", margaret: "마거릿", dorothy: "도로시",
  gregory: "그레고리", timothy: "티모시", vincent: "빈센트",
  abigail: "애비게일", ashley: "애슐리", patricia: "패트리샤",
  // 기타 관용 표기
  john: "존", george: "조지", patrick: "패트릭", donald: "도널드",
  ronald: "로널드", douglas: "더글러스", harold: "해럴드",
  megan: "메건", lauren: "로렌",
  // CMU 자동 변환이 어색한 이름 추가
  brian: "브라이언", ryan: "라이언", justin: "저스틴",
  brandon: "브랜든", russell: "러셀", aaron: "에런",
  logan: "로건", mason: "메이슨", ethan: "이든",
  oliver: "올리버", chloe: "클로이", scott: "스콧",
  eric: "에릭", alan: "앨런", helen: "헬렌", karen: "카렌",
  tyler: "타일러", dennis: "데니스", kyle: "카일",
  liam: "리암", noah: "노아", diana: "다이아나",
  frank: "프랭크", peter: "피터", paul: "폴",
  kevin: "케빈", eugene: "유진", travis: "트래비스",
  susan: "수잔", nancy: "낸시", betty: "베티", linda: "린다",
  nicole: "니콜", grace: "그레이스", luna: "루나", amber: "앰버",
  jack: "잭", jason: "제이슨", jerry: "제리", mark: "마크",
  steven: "스티븐", edward: "에드워드", jeffrey: "제프리",
  jacob: "제이콥", gary: "게리", jonathan: "조나단",
  larry: "래리", raymond: "레이먼드", joshua: "조슈아",
  kenneth: "케네스", zachary: "재커리",
  // 여성 추가
  mary: "메리", lisa: "리사", carol: "캐롤", amanda: "아만다",
  melissa: "멜리사", deborah: "데보라", sharon: "샤론",
  laura: "로라", cynthia: "신시아", kathleen: "캐슬린",
  amy: "에이미", angela: "앤젤라", anna: "안나", brenda: "브렌다",
  donna: "도나", michelle: "미셸",
  carolyn: "캐롤린", janet: "재닛", maria: "마리아",
  heather: "헤더", ruth: "루스", julie: "줄리", joyce: "조이스",
  kelly: "켈리", joan: "조안", evelyn: "에블린",
  andrea: "안드레아", hannah: "한나", martha: "마사",
  gloria: "글로리아", teresa: "테레사", ann: "앤", sara: "사라",
  madison: "매디슨", frances: "프랜시스", kathryn: "캐스린",
  janice: "재니스", jean: "진", alice: "앨리스", judy: "주디",
  denise: "데니스", doris: "도리스", marilyn: "마릴린",
  danielle: "다니엘", beverly: "베벌리", theresa: "테레사",
  brittany: "브리트니", marie: "마리", kayla: "케일라",
  alexis: "알렉시스", lori: "로리", zoe: "조이",
  nora: "노라", riley: "라일리", stella: "스텔라",
  hazel: "헤이즐", aurora: "오로라", ivy: "아이비",
  violet: "바이올렛", sophie: "소피", naomi: "나오미",
  elena: "엘레나", clara: "클라라", ruby: "루비", eva: "에바",
  jade: "제이드", brooke: "브루크", paige: "페이지",
  taylor: "테일러", morgan: "모건", jordan: "조던",
  tiffany: "티파니", vanessa: "바네사", vivian: "비비안",
  scarlett: "스칼렛", lily: "릴리", ella: "엘라", aria: "아리아",
  mia: "미아",
  // CMU 자동 변환이 관용 표기와 다른 이름 추가
  charlie: "찰리", henry: "헨리", lucas: "루카스", dylan: "딜런",
  adrian: "에이드리언", natasha: "나타샤", felix: "펠릭스",
  oscar: "오스카", miles: "마일즈", derek: "데릭",
  walter: "월터", gordon: "고든", albert: "앨버트",
  arthur: "아서", edgar: "에드거", barbara: "바바라",
  florence: "플로렌스", leonard: "레너드",
  phillip: "필립", philip: "필립", charles: "찰스",
  stuart: "스튜어트", stewart: "스튜어트", roger: "로저",
  victor: "빅터", martin: "마틴", louis: "루이스",
  lewis: "루이스", howard: "하워드", ernest: "어니스트",
  norman: "노먼", warren: "워런",
  ralph: "랄프",
  roy: "로이", bruce: "브루스", wayne: "웨인",
  harry: "해리", fred: "프레드", carl: "칼",
  // 여성 CMU 보정
  audrey: "오드리", claire: "클레어", eleanor: "엘리너",
  madeleine: "매들린", madeline: "매들린", caroline: "캐롤라인",
  christine: "크리스틴", sylvia: "실비아",
  felicity: "펠리시티", beatrice: "베아트리스", cecilia: "세실리아",
  cordelia: "코델리아", genevieve: "제네비브", josephine: "조세핀",
  lydia: "리디아", ophelia: "오필리아", rosemary: "로즈메리",
  sabrina: "사브리나", serena: "세레나", veronica: "베로니카",
  wendy: "웬디", yvonne: "이본",
  // CMU 자동 변환 2차 보정
  abram: "에이브람", addison: "애디슨", avery: "에이버리",
  blake: "블레이크", casey: "케이시", clay: "클레이",
  cole: "콜", conrad: "콘래드", dalton: "달튼",
  dante: "단테", dean: "딘", drake: "드레이크",
  drew: "드류", dustin: "더스틴", finn: "핀",
  grant: "그랜트", griffin: "그리핀", heath: "히스",
  hugo: "휴고", ivan: "아이반", lance: "랜스",
  leon: "리온", maxwell: "맥스웰", neil: "닐",
  nolan: "놀란", owen: "오웬", quinn: "퀸",
  reed: "리드", rex: "렉스", rowan: "로완",
  seth: "세스", simon: "사이먼", spencer: "스펜서",
  troy: "트로이", wade: "웨이드",
  brooks: "브룩스", cooper: "쿠퍼", hunter: "헌터",
  parker: "파커", sawyer: "소여", tucker: "터커",
  walker: "워커", carter: "카터", colton: "콜튼",
  gavin: "개빈", landon: "랜든", wyatt: "와이엇",
  // CMU 자동 변환 3차 보정
  allison: "앨리슨", april: "에이프릴", bethany: "베서니",
  bridget: "브리짓", caleb: "케일럽", cameron: "캐머런",
  clifton: "클리프턴", colleen: "컬린", craig: "크레이그",
  darlene: "달린", darren: "대런", dexter: "덱스터",
  dominic: "도미닉", floyd: "플로이드",
  garrett: "개럿", gerald: "제럴드", gilbert: "길버트",
  glen: "글렌", harvey: "하비", hector: "헥터",
  irene: "아이린", iris: "아이리스", kendall: "켄달",
  kent: "켄트", kirk: "커크", kurt: "커트",
  chad: "채드", cassandra: "카산드라", celeste: "셀레스트",
  chester: "체스터", claude: "클로드", clement: "클레먼트",
  clyde: "클라이드", colin: "콜린",
  crystal: "크리스탈", curtis: "커티스", dale: "데일",
  damon: "데이먼", daryl: "대릴",
  devin: "데빈", donovan: "도노반", dorian: "도리안",
  duncan: "던컨", dwight: "드와이트", earl: "얼",
  edmund: "에드먼드", edwin: "에드윈", elaine: "일레인",
  // CMU 소규모 보정
  clayton: "클레이턴", max: "맥스", june: "준", tara: "타라",
  elijah: "엘라이자", amelia: "아멜리아", harper: "하퍼",
  mila: "밀라", layla: "레일라", camila: "카밀라",
  // 긴 이름 CMU 보정
  alexandria: "알렉산드리아", bartholomew: "바솔로뮤",
  evangeline: "에반젤린", maximilian: "막시밀리안",
  persephone: "페르세포네", wellington: "웰링턴",
  constantine: "콘스탄틴", theodora: "테오도라",
  valentina: "발렌티나", anastasia: "아나스타시아",
  clementine: "클레멘타인",
  guinevere: "기네비어", hildegard: "힐데가르드",
  montgomery: "몽고메리", remington: "레밍턴",
  cornelius: "코넬리우스", fitzgerald: "피츠제럴드",
  // 흔한 성씨 보정
  anderson: "앤더슨", johnson: "존슨", williams: "윌리엄스",
  wilson: "윌슨", thompson: "톰슨", robinson: "로빈슨",
  jackson: "잭슨", harrison: "해리슨", morrison: "모리슨",
  henderson: "헨더슨", peterson: "피터슨", simpson: "심슨",
  mitchell: "미첼", campbell: "캠벨", sullivan: "설리번",
  kennedy: "케네디", ferguson: "퍼거슨", hamilton: "해밀턴",
  wallace: "월리스", crawford: "크로포드",
  obrien: "오브라이언", oconnor: "오코너", osullivan: "오설리번",
  mcdonald: "맥도날드", mccarthy: "매카시", mckenzie: "매켄지",
  // CMU에 없거나 발음이 크게 틀린 이름
  siobhan: "시본",
  niamh: "니브",
  saoirse: "서셔",
  caoimhe: "키바",
  aoife: "이파",
  sean: "숀",
  // 비영어권 이름 (CMU에 없을 확률 높음)
  yuki: "유키",
  haruto: "하루토",
  sakura: "사쿠라",
  kenji: "켄지",
  akira: "아키라",
  riku: "리쿠",
  mei: "메이",
  hana: "하나",
  wei: "웨이",
  ming: "밍",
  chen: "첸",
  li: "리",
  wang: "왕",
  zhang: "장",
  liu: "류",
  yang: "양",
  raj: "라지",
  priya: "프리야",
  sanjay: "산제이",
  vikram: "비크람",
  arjun: "아르준",
  deepa: "디파",
  hans: "한스",
  klaus: "클라우스",
  stefan: "슈테판",
  franz: "프란츠",
  pierre: "피에르",
  jacques: "자크",
  francois: "프랑수아",
  pablo: "파블로",
  carlos: "카를로스",
  miguel: "미겔",
  antonio: "안토니오",
  marco: "마르코",
  luca: "루카",
  giovanni: "조반니",
  paolo: "파올로",
  boris: "보리스",
  dmitri: "드미트리",
  sergei: "세르게이",
  nikolai: "니콜라이",
  sven: "스벤",
  lars: "라르스",
  olaf: "올라프",
  muhammad: "무함마드",
  ahmed: "아메드",
  ali: "알리",
  omar: "오마르",
  yusuf: "유수프",
  hassan: "하산",
  ibrahim: "이브라힘",
  fatima: "파티마",
  aisha: "아이샤",
};

// ── 3. 패턴 기반 fallback ──
const SYLLABLE_PATTERNS: [string, string][] = [
  // 4+ 글자 패턴
  ["tion", "션"], ["sion", "션"], ["ture", "처"], ["ight", "아이트"],
  ["ough", "오"], ["ness", "니스"], ["ment", "먼트"],
  ["tch", "치"],
  // 3글자 패턴
  ["sch", "슈"], ["str", "스트"], ["chr", "크"],
  ["ble", "블"], ["dle", "들"], ["gle", "글"], ["tle", "틀"],
  ["ple", "플"], ["dge", "지"],
  ["ing", "잉"], ["ang", "앵"], ["ong", "옹"], ["ung", "엉"],
  ["ick", "익"], ["ack", "액"], ["ock", "옥"],
  ["ell", "엘"], ["ill", "일"], ["oll", "올"], ["ull", "울"],
  ["ant", "앤트"], ["ent", "엔트"], ["int", "인트"],
  ["and", "앤드"], ["end", "엔드"],
  ["ard", "아드"], ["ord", "오드"],
  ["arm", "암"], ["orm", "옴"],
  ["art", "아트"], ["ort", "오트"],
  // 2글자 자음
  ["ch", "치"], ["sh", "시"], ["th", "스"], ["ph", "프"],
  ["wh", "후"], ["ck", "크"], ["ng", "응"], ["qu", "쿠"],
  ["gh", ""], ["wr", "르"], ["kn", "느"],
  // 2글자 모음
  ["ai", "에이"], ["ay", "에이"], ["ei", "에이"], ["ey", "에이"],
  ["ee", "이"], ["ea", "이"], ["ie", "이"],
  ["oo", "우"], ["ou", "아우"], ["ow", "오"],
  ["oi", "오이"], ["oy", "오이"],
  ["au", "오"], ["aw", "오"], ["ew", "유"],
  // 자음+모음
  ["ba", "바"], ["be", "베"], ["bi", "비"], ["bo", "보"], ["bu", "부"],
  ["ca", "카"], ["ce", "세"], ["ci", "시"], ["co", "코"], ["cu", "쿠"],
  ["da", "다"], ["de", "데"], ["di", "디"], ["do", "도"], ["du", "두"],
  ["fa", "파"], ["fe", "페"], ["fi", "피"], ["fo", "포"], ["fu", "푸"],
  ["ga", "가"], ["ge", "제"], ["gi", "지"], ["go", "고"], ["gu", "구"],
  ["ha", "하"], ["he", "헤"], ["hi", "히"], ["ho", "호"], ["hu", "후"],
  ["ja", "자"], ["je", "제"], ["ji", "지"], ["jo", "조"], ["ju", "주"],
  ["ka", "카"], ["ke", "케"], ["ki", "키"], ["ko", "코"], ["ku", "쿠"],
  ["la", "라"], ["le", "레"], ["li", "리"], ["lo", "로"], ["lu", "루"],
  ["ma", "마"], ["me", "메"], ["mi", "미"], ["mo", "모"], ["mu", "무"],
  ["na", "나"], ["ne", "네"], ["ni", "니"], ["no", "노"], ["nu", "누"],
  ["pa", "파"], ["pe", "페"], ["pi", "피"], ["po", "포"], ["pu", "푸"],
  ["ra", "라"], ["re", "레"], ["ri", "리"], ["ro", "로"], ["ru", "루"],
  ["sa", "사"], ["se", "세"], ["si", "시"], ["so", "소"], ["su", "수"],
  ["ta", "타"], ["te", "테"], ["ti", "티"], ["to", "토"], ["tu", "투"],
  ["va", "바"], ["ve", "베"], ["vi", "비"], ["vo", "보"], ["vu", "부"],
  ["wa", "와"], ["we", "웨"], ["wi", "위"], ["wo", "워"], ["wu", "우"],
  ["ya", "야"], ["ye", "예"], ["yi", "이"], ["yo", "요"], ["yu", "유"],
  ["za", "자"], ["ze", "제"], ["zi", "지"], ["zo", "조"], ["zu", "주"],
  // 1글자 fallback
  ["a", "아"], ["e", "에"], ["i", "이"], ["o", "오"], ["u", "우"],
  ["b", "브"], ["c", "크"], ["d", "드"], ["f", "프"], ["g", "그"],
  ["h", "흐"], ["j", "즈"], ["k", "크"], ["l", "을"], ["m", "음"],
  ["n", "은"], ["p", "프"], ["r", "르"], ["s", "스"],
  ["t", "트"], ["v", "브"], ["w", "우"], ["x", "크스"], ["y", "이"],
  ["z", "즈"],
];

function patternFallback(name: string): string {
  let result = "";
  let i = 0;
  while (i < name.length) {
    let matched = false;
    for (const [pattern, hangul] of SYLLABLE_PATTERNS) {
      if (name.startsWith(pattern, i)) {
        result += hangul;
        i += pattern.length;
        matched = true;
        break;
      }
    }
    if (!matched) i++;
  }
  return result || name;
}

// ── 메인 변환 함수 ──

export function transliterate(name: string): string {
  const normalized = name.trim().toLowerCase();

  // 1. 수동 오버라이드
  if (OVERRIDE[normalized]) {
    return OVERRIDE[normalized];
  }

  // 2. CMU 사전 → ARPAbet → 한글
  const arpabet = cmuDict[normalized];
  if (arpabet) {
    return arpabetToHangul(arpabet);
  }

  // 3. 패턴 기반 fallback
  return patternFallback(normalized);
}

export function isKnownName(name: string): boolean {
  const n = name.trim().toLowerCase();
  return OVERRIDE[n] !== undefined || cmuDict[n] !== undefined;
}

export function transliterateFull(fullName: string): string {
  return fullName
    .trim()
    .split(/[\s]+/)
    .map((part) => {
      // 하이픈 이름: Mary-Jane → 메리-제인
      if (part.includes("-")) {
        return part.split("-").map(p => transliterate(p)).join("-");
      }
      // 아포스트로피: O'Brien → 통째로 오버라이드 먼저 시도
      if (part.includes("'")) {
        const merged = part.replace(/'/g, "");
        const mergedResult = transliterate(merged);
        // 오버라이드나 CMU에 있으면 그대로, 아니면 파트별 변환
        const normalized = merged.trim().toLowerCase();
        if (OVERRIDE[normalized] || cmuDict[normalized]) {
          return mergedResult;
        }
        return part.split("'").map(p => transliterate(p)).join("");
      }
      return transliterate(part);
    })
    .join(" ");
}
