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

      {/* SEO content */}
      <section className="mt-24 max-w-2xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          What is My Korean Name?
        </h2>
        <p className="text-gray-500 leading-relaxed mb-6">
          My Korean Name converts your English name into Korean (Hangul) with a
          beautiful calligraphy writing animation. You also get a fun personality
          analysis based on Korean culture, including your Korean animal type,
          Five Elements energy, Joseon dynasty rank, and lucky Korean food!
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          How does it work?
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Simply type your name in English, and we will transliterate it into
          Korean using official Korean transliteration rules. Each name gets a
          unique personality profile based on Korean traditions and culture.
          Share your result with friends and see how your Korean names compare!
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-24 mb-8 text-center text-xs text-gray-300">
        <p>Made with love for Korean culture</p>
      </footer>
    </main>
  );
}
