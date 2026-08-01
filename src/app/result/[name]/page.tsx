import type { Metadata } from "next";
import { transliterate } from "@/lib/transliterate";
import { generatePersonality } from "@/lib/personality";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const korean = transliterate(decoded);
  const capitalized = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  return {
    title: `${capitalized} in Korean is ${korean}`,
    description: `${capitalized} in Korean is ${korean}. Discover your Korean name with calligraphy animation, personality analysis, Joseon dynasty rank, and more!`,
    openGraph: {
      title: `${capitalized} in Korean is ${korean}`,
      description: `My Korean name is ${korean}! Get yours at My Korean Name.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalized} in Korean is ${korean}`,
      description: `My Korean name is ${korean}! Get yours at My Korean Name.`,
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const korean = transliterate(decoded);
  const result = generatePersonality(decoded, korean);

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-gray-900">
            My Korean Name
          </a>
        </div>

        {/* Result */}
        <ResultCard originalName={decoded} result={result} />

        {/* Share */}
        <div className="mt-8">
          <ShareButtons name={decoded} koreanName={korean} />
        </div>
      </div>
    </main>
  );
}
