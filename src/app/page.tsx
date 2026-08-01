import NameInput from "@/components/NameInput";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          My Korean Name
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-md mx-auto">
          Discover your name in beautiful Korean calligraphy
          <br />
          with personality analysis
        </p>
      </div>

      {/* Input */}
      <NameInput />

      {/* Social proof / examples */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-400 mb-4">Popular names</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["James", "Emma", "Michael", "Olivia", "Liam", "Sophia"].map(
            (name) => (
              <a
                key={name}
                href={`/result/${name.toLowerCase()}`}
                className="px-4 py-2 rounded-full bg-white border border-gray-100
                         text-sm text-gray-600 hover:border-rose-200 hover:text-rose-500
                         transition-colors shadow-sm"
              >
                {name}
              </a>
            )
          )}
        </div>
      </div>

      {/* SEO FAQ content */}
      <section className="mt-24 max-w-2xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What is My Korean Name?
          </h2>
          <p className="text-gray-500 leading-relaxed">
            My Korean Name converts your English name into Korean (Hangul) with a
            beautiful calligraphy writing animation. You also get a fun personality
            analysis based on Korean culture, including your Korean animal type,
            Five Elements energy, Joseon dynasty rank, and lucky Korean food!
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How to Write My Name in Korean?
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Simply type your name in English, and we transliterate it into
            Korean using official Korean transliteration rules combined with
            a 134,000+ word pronunciation dictionary. Each name gets a unique
            personality profile based on Korean traditions.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What Will I Get?
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Your Korean name in 4 different calligraphy styles, a Korean animal
            type (like Tiger or Dragon), your Five Elements energy, a Joseon
            dynasty government rank, lucky Korean food, lucky number, and name
            compatibility. Save your result as an image and share it with friends!
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Is It Free?
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Yes, completely free! No sign-up required. Just enter your name and
            instantly discover your Korean name with personality analysis.
            Share your results on X, Reddit, or save as an image.
          </p>
        </div>
      </section>

      {/* JSON-LD FAQ structured data for Google rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How to write my name in Korean?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Enter your English name at My Korean Name (my-korean-name.vercel.app) to instantly see it transliterated into Korean Hangul using official transliteration rules and a 134,000+ word pronunciation dictionary.",
                },
              },
              {
                "@type": "Question",
                name: "What is my Korean name?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Your Korean name is the Hangul transliteration of your English name. For example, James becomes 제임스, Emma becomes 엠마, and Michael becomes 마이클. Each name also comes with a personality analysis based on Korean culture.",
                },
              },
              {
                "@type": "Question",
                name: "Is the Korean name generator free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, My Korean Name is 100% free with no sign-up required. You get calligraphy animation, personality analysis, and shareable results instantly.",
                },
              },
            ],
          }),
        }}
      />

      {/* Footer */}
      <footer className="mt-24 mb-8 text-center text-xs text-gray-300">
        <p>Made with love for Korean culture</p>
      </footer>
    </main>
  );
}
