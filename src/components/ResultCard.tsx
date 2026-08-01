"use client";

import { useRef, useState, useCallback } from "react";
import { PersonalityResult } from "@/lib/personality";
import CalligraphyAnimation, { FONT_STYLES, type FontStyle } from "./CalligraphyAnimation";

interface ResultCardProps {
  originalName: string;
  result: PersonalityResult;
}

export default function ResultCard({ originalName, result }: ResultCardProps) {
  const [selectedFont, setSelectedFont] = useState<FontStyle>(FONT_STYLES[0]);
  const [saving, setSaving] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleListen = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // 이미 재생 중이면 중지
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result.koreanName);
    utterance.lang = "ko-KR";
    utterance.rate = 0.8;

    // 한국어 음성 찾기
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(v => v.lang.startsWith("ko"));
    if (koVoice) utterance.voice = koVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [result.koreanName, speaking]);

  const handleSaveImage = async () => {
    setSaving(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const el = cardRef.current;
      if (!el) return;
      const canvas = await html2canvas(el, {
        backgroundColor: "#fff7f7",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `my-korean-name-${originalName.toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Could not save image. Try taking a screenshot instead!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* 저장용 카드 영역 */}
      <div ref={cardRef} className="space-y-6">
        {/* 한글 이름 섹션 */}
        <section className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <p className="text-sm text-gray-400 mb-1">Your Korean Name</p>
          <CalligraphyAnimation
            text={result.koreanName}
            maxFontSize={72}
            color="#1a1a1a"
            fontStyle={selectedFont}
          />
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-lg text-gray-500 capitalize">{originalName}</p>
            <button
              onClick={handleListen}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full
                         bg-gray-100 hover:bg-rose-100 transition-colors text-sm cursor-pointer"
              aria-label="Listen to pronunciation"
              title="Listen to Korean pronunciation"
            >
              {speaking ? "⏹" : "🔊"}
            </button>
          </div>

          {/* 이름 소리 분석 */}
          <div className="mt-4 px-4 py-3 bg-rose-50 rounded-2xl">
            <div className="flex flex-wrap justify-center gap-1.5 mb-2">
              {result.nameKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-0.5 bg-rose-100 text-rose-600 rounded-full text-xs font-semibold"
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-xs text-rose-500 leading-relaxed">
              {result.nameReading}
            </p>
          </div>

          {/* 폰트 스타일 선택 */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">Choose style</p>
            <div className="flex justify-center gap-2">
              {FONT_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedFont(style)}
                  className={`px-3 py-2 rounded-xl text-xs transition-all ${
                    selectedFont.id === style.id
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span className="block font-medium">{style.label}</span>
                  <span className="block text-[10px] opacity-70">
                    {style.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 동물상 */}
        <section className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{result.animal.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {result.animal.animal}
              </h3>
              <p className="text-sm text-rose-500">{result.animal.trait}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {result.animal.descriptionEn}
          </p>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            {result.animal.description}
          </p>
        </section>

        {/* 오행 */}
        <section className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{result.element.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {result.element.hanja} {result.element.name}
              </h3>
              <p className="text-sm" style={{ color: result.element.color }}>
                {result.element.trait}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {result.element.descriptionEn}
          </p>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            {result.element.description}
          </p>
        </section>

        {/* 조선시대 관직 */}
        <section className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{result.joseonRank.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {result.joseonRank.rank}
              </h3>
              <p className="text-sm text-amber-600">
                {result.joseonRank.title}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {result.joseonRank.descriptionEn}
          </p>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            {result.joseonRank.description}
          </p>
        </section>

        {/* 행운의 음식 + 숫자 */}
        <section className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Lucky Charms
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{result.luckyFood.emoji}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Lucky Food: {result.luckyFood.nameEn} ({result.luckyFood.name})
                </p>
                <p className="text-xs text-gray-500">
                  {result.luckyFood.meaningEn}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl w-8 text-center">7️⃣</span>
              <p className="text-sm font-medium text-gray-800">
                Lucky Number: {result.luckyNumber}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl w-8 text-center">💕</span>
              <p className="text-sm font-medium text-gray-800">
                {result.compatibilityEn}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Save as Image 버튼 (cardRef 바깥) */}
      <button
        onClick={handleSaveImage}
        disabled={saving}
        className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500
                   text-white font-medium hover:from-violet-600 hover:to-purple-600
                   disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed
                   transition-all duration-200 cursor-pointer"
      >
        {saving ? "Saving..." : "Save as Image"}
      </button>
    </div>
  );
}
