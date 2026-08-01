/**
 * ARPAbet 발음기호 → 한글 변환 v4
 *
 * 전략: 2-pass
 * Pass 1: 음소 → 한글 토큰 (모음사이 자음 겹침 처리 포함)
 * Pass 2: 받침 병합 (M, N, NG, L만)
 */

// ── 한글 합성 ──
const CHOSEONG = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];
const JUNGSEONG = [
  "ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ",
  "ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"
];
const JONGSEONG = [
  "","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ",
  "ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];

function compose(cho: string, jung: string, jong: string = ""): string {
  const ci = CHOSEONG.indexOf(cho);
  const ji = JUNGSEONG.indexOf(jung);
  const ki = jong ? JONGSEONG.indexOf(jong) : 0;
  if (ci < 0 || ji < 0) return "";
  return String.fromCharCode(0xAC00 + ci * 21 * 28 + ji * 28 + Math.max(ki, 0));
}

function addJongToChar(char: string, jong: string): string | null {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return null;
  if ((code - 0xAC00) % 28 !== 0) return null; // 이미 받침 있음
  const jongIdx = JONGSEONG.indexOf(jong);
  if (jongIdx <= 0) return null;
  return String.fromCharCode(code + jongIdx);
}

// ── 음소 파싱 ──
interface Phoneme {
  base: string;
  stress: number; // -1 = 자음
  isVowel: boolean;
}

function parse(arpabet: string): Phoneme[] {
  return arpabet.trim().split(/\s+/).map(raw => {
    const m = raw.match(/^([A-Z]+)([0-2])$/);
    if (m) return { base: m[1], stress: parseInt(m[2]), isVowel: true };
    return { base: raw, stress: -1, isVowel: false };
  });
}

// ── 매핑 ──
const CHO: Record<string, string> = {
  B: "ㅂ", CH: "ㅊ", D: "ㄷ", DH: "ㄷ", F: "ㅍ", G: "ㄱ",
  HH: "ㅎ", JH: "ㅈ", K: "ㅋ", L: "ㄹ", M: "ㅁ", N: "ㄴ",
  NG: "ㅇ", P: "ㅍ", R: "ㄹ", S: "ㅅ", SH: "ㅅ", T: "ㅌ",
  TH: "ㅅ", V: "ㅂ", W: "ㅇ", Y: "ㅇ", Z: "ㅈ", ZH: "ㅈ",
};

// 단독 자음 (뒤에 모음 없이 끝날 때)
const SOLO: Record<string, string> = {
  B: "브", CH: "치", D: "드", DH: "드", F: "프", G: "그",
  HH: "", JH: "지", K: "크", L: "", M: "", N: "",
  NG: "", P: "프", R: "르", S: "스", SH: "시", T: "트",
  TH: "스", V: "브", W: "", Y: "", Z: "즈", ZH: "지",
};

// 받침 병합 가능 (보수적: M, N, NG, L만)
const JONG: Record<string, string> = {
  M: "ㅁ", N: "ㄴ", NG: "ㅇ", L: "ㄹ",
};

// 모음 사이에서 겹침 가능 (앞 음절 받침 + 다음 음절 초성)
const GEMINATE: Record<string, string> = {
  M: "ㅁ", N: "ㄴ", NG: "ㅇ", L: "ㄹ",
};

// ── 모음 ──
interface VDef { primary: string; tail: string }

function getVowel(base: string, stress: number, wordFinal: boolean): VDef {
  if (base === "AH" && stress === 0 && wordFinal) {
    return { primary: "ㅏ", tail: "" };
  }
  const map: Record<string, VDef> = {
    AA: { primary: "ㅏ", tail: "" },
    AE: { primary: "ㅐ", tail: "" },
    AH: { primary: "ㅓ", tail: "" },
    AO: { primary: "ㅗ", tail: "" },
    AW: { primary: "ㅏ", tail: "우" },
    AY: { primary: "ㅏ", tail: "이" },
    EH: { primary: "ㅔ", tail: "" },
    ER: { primary: "ㅓ", tail: "" },
    EY: { primary: "ㅔ", tail: "이" },
    IH: { primary: "ㅣ", tail: "" },
    IY: { primary: "ㅣ", tail: "" },
    OW: { primary: "ㅗ", tail: "" },
    OY: { primary: "ㅗ", tail: "이" },
    UH: { primary: "ㅜ", tail: "" },
    UW: { primary: "ㅜ", tail: "" },
  };
  return map[base] || { primary: "ㅡ", tail: "" };
}

function semiVowelJung(semi: string, primary: string): string | null {
  if (semi === "W") {
    return ({ "ㅏ": "ㅘ", "ㅐ": "ㅙ", "ㅓ": "ㅝ", "ㅔ": "ㅞ", "ㅣ": "ㅟ" } as Record<string,string>)[primary] || null;
  }
  if (semi === "Y") {
    return ({ "ㅏ": "ㅑ", "ㅐ": "ㅒ", "ㅓ": "ㅕ", "ㅔ": "ㅖ", "ㅗ": "ㅛ", "ㅜ": "ㅠ" } as Record<string,string>)[primary] || null;
  }
  return null;
}

function isWordFinalVowel(phs: Phoneme[], idx: number): boolean {
  for (let j = idx + 1; j < phs.length; j++) {
    if (phs[j].isVowel) return false;
  }
  return true;
}

// 다음 모음까지의 거리 (모음이 없으면 Infinity)
function nextVowelDist(phs: Phoneme[], from: number): number {
  for (let j = from; j < phs.length; j++) {
    if (phs[j].isVowel) return j - from;
  }
  return Infinity;
}

// ── 토큰 ──
type Token =
  | { kind: "syl"; text: string }
  | { kind: "tail"; text: string }
  | { kind: "solo"; text: string; ph: string };

// ── Pass 1 ──
function pass1(phs: Phoneme[]): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < phs.length) {
    const p = phs[i];

    // 모음
    if (p.isVowel) {
      const wf = isWordFinalVowel(phs, i);
      const v = getVowel(p.base, p.stress, wf);
      tokens.push({ kind: "syl", text: compose("ㅇ", v.primary) });
      if (v.tail) tokens.push({ kind: "tail", text: v.tail });
      i++;
      continue;
    }

    // 자음
    const cho = CHO[p.base];
    if (!cho) { i++; continue; }
    const next = phs[i + 1];

    // W/Y + 모음
    if ((p.base === "W" || p.base === "Y") && next?.isVowel) {
      const wf = isWordFinalVowel(phs, i + 1);
      const v = getVowel(next.base, next.stress, wf);
      const cj = semiVowelJung(p.base, v.primary);
      if (cj) {
        tokens.push({ kind: "syl", text: compose("ㅇ", cj) });
        if (v.tail) tokens.push({ kind: "tail", text: v.tail });
        i += 2;
        continue;
      }
    }

    // 자음 + 모음
    if (next?.isVowel) {
      const wf = isWordFinalVowel(phs, i + 1);
      const v = getVowel(next.base, next.stress, wf);
      tokens.push({ kind: "syl", text: compose(cho, v.primary) });
      if (v.tail) tokens.push({ kind: "tail", text: v.tail });
      i += 2;
      continue;
    }

    // 자음이 모음 사이에 있으면 겹침 처리
    // (앞에 모음이 있고, 뒤에도 모음이 있는데 사이에 이 자음만 있을 때)
    // → 이 자음을 앞 음절 받침으로 넣고, 다음 음절 초성으로도 사용
    if (GEMINATE[p.base] && next?.isVowel === false) {
      // 이 자음 뒤에 바로 다른 자음+모음이 오는 패턴 (자음클러스터)
      // 이 경우 현재 자음은 단독 처리
    }

    // 단독 자음
    tokens.push({ kind: "solo", text: SOLO[p.base] || "", ph: p.base });
    i++;
  }

  return tokens;
}

// ── Pass 2: 받침 병합 + 겹침 ──
function pass2(tokens: Token[]): string {
  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (tok.kind === "solo") {
      const jong = JONG[tok.ph];

      if (jong && result.length > 0) {
        const last = result[result.length - 1];
        const merged = addJongToChar(last, jong);

        if (merged) {
          // 다음 토큰이 음절이면 → 겹침: 받침도 넣고 다음 초성도 유지
          const nextTok = tokens[i + 1];
          if (nextTok && nextTok.kind === "syl") {
            // 겹침: 앞 글자에 받침, 다음 글자는 그대로 (이미 초성 포함)
            result[result.length - 1] = merged;
            continue;
          }

          // 다음이 없거나 다른 solo → 그냥 받침 합성
          result[result.length - 1] = merged;
          continue;
        }
      }

      // 합성 실패 → 별도 음절
      if (tok.text) result.push(tok.text);
    } else {
      result.push(tok.text);
    }
  }

  return result.join("");
}

export function arpabetToHangul(arpabet: string): string {
  const phs = parse(arpabet);
  const tokens = pass1(phs);
  return pass2(tokens);
}
