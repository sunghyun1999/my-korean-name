import { ImageResponse } from "next/og";
import { transliterate } from "@/lib/transliterate";
import { generatePersonality } from "@/lib/personality";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const korean = transliterate(decoded);
  const result = generatePersonality(decoded, korean);
  const capitalized = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fffbeb 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Korean name */}
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: "#1a1a1a",
            marginBottom: 8,
            display: "flex",
          }}
        >
          {korean}
        </div>

        {/* Original name */}
        <div
          style={{
            fontSize: 40,
            color: "#9ca3af",
            marginBottom: 40,
            display: "flex",
          }}
        >
          {capitalized}
        </div>

        {/* Animal + Element */}
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 28,
            color: "#6b7280",
          }}
        >
          <span>
            {result.animal.emoji} {result.animal.animal}
          </span>
          <span>·</span>
          <span>
            {result.element.emoji} {result.element.hanja}
          </span>
          <span>·</span>
          <span>
            {result.joseonRank.emoji} {result.joseonRank.rank}
          </span>
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "#d1d5db",
            display: "flex",
          }}
        >
          mykoreanname.com
        </div>
      </div>
    ),
    { ...size }
  );
}
