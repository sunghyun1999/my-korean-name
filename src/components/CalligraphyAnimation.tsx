"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface FontStyle {
  id: string;
  label: string;
  fontFamily: string;
  fontWeight: string;
  description: string;
}

export const FONT_STYLES: FontStyle[] = [
  {
    id: "elegant",
    label: "Elegant",
    fontFamily: "'Hahmlet', serif",
    fontWeight: "700",
    description: "Modern serif",
  },
  {
    id: "traditional",
    label: "Traditional",
    fontFamily: "'Gowun Batang', serif",
    fontWeight: "700",
    description: "Classic beauty",
  },
  {
    id: "pop",
    label: "Pop",
    fontFamily: "'Jua', sans-serif",
    fontWeight: "400",
    description: "K-pop vibe",
  },
  {
    id: "brush",
    label: "Brush",
    fontFamily: "'Nanum Pen Script', cursive",
    fontWeight: "400",
    description: "Calligraphy",
  },
];

interface CalligraphyAnimationProps {
  text: string;
  maxFontSize?: number;
  color?: string;
  fontStyle?: FontStyle;
  className?: string;
}

export default function CalligraphyAnimation({
  text,
  maxFontSize = 72,
  color = "#1a1a1a",
  fontStyle = FONT_STYLES[0],
  className = "",
}: CalligraphyAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showReplay, setShowReplay] = useState(false);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 텍스트 길이에 맞춰 폰트 크기 자동 조절
    let fontSize = maxFontSize;
    const padding = 40;

    while (fontSize > 28) {
      const testFont = `${fontStyle.fontWeight} ${fontSize}px ${fontStyle.fontFamily}`;
      ctx.font = testFont;
      const measured = ctx.measureText(text).width;
      if (measured <= width - padding) break;
      fontSize -= 4;
    }

    const fontStr = `${fontStyle.fontWeight} ${fontSize}px ${fontStyle.fontFamily}`;

    const chars = [...text];
    const charDelay = 550;
    const charWriteDuration = 450;
    const totalDuration = chars.length * charDelay + charWriteDuration + 200;
    const startTime = performance.now();

    setShowReplay(false);

    const draw = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      // 글자 위치 사전 계산
      ctx.font = fontStr;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const charWidths = chars.map((c) => ctx.measureText(c).width);
      const totalWidth = charWidths.reduce((a, b) => a + b, 0);
      const startX = (width - totalWidth) / 2;

      chars.forEach((char, i) => {
        const charStart = i * charDelay;
        const charProgress = Math.min(
          Math.max((elapsed - charStart) / charWriteDuration, 0),
          1
        );

        if (charProgress <= 0) return;

        // easeOutCubic
        const eased = 1 - Math.pow(1 - charProgress, 3);

        ctx.save();

        // 이 글자의 x 중심 계산
        let charCenterX = startX;
        for (let j = 0; j < i; j++) charCenterX += charWidths[j];
        charCenterX += charWidths[i] / 2;
        const y = height / 2;

        // 왼→오 클리핑으로 "쓰는 듯한" 효과
        const clipWidth = charWidths[i] * eased;
        ctx.beginPath();
        ctx.rect(
          charCenterX - charWidths[i] / 2,
          y - fontSize * 0.8,
          clipWidth,
          fontSize * 1.6
        );
        ctx.clip();

        // 페이드인
        ctx.globalAlpha = Math.min(eased * 2, 1);
        ctx.fillStyle = color;
        ctx.font = fontStr;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(char, charCenterX, y);

        ctx.restore();
      });

      if (elapsed < totalDuration) {
        requestAnimationFrame(draw);
      } else {
        setShowReplay(true);
      }
    };

    requestAnimationFrame(draw);
  }, [text, maxFontSize, color, fontStyle]);

  useEffect(() => {
    document.fonts.ready.then(() => {
      animate();
    });
  }, [animate]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "180px" }}
      />
      {showReplay && (
        <button
          onClick={animate}
          className="absolute bottom-2 right-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Replay animation"
        >
          ↻ replay
        </button>
      )}
    </div>
  );
}
