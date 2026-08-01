import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "My Korean Name - Get Your Name in Korean",
    template: "%s | My Korean Name",
  },
  description:
    "Discover your name in beautiful Korean calligraphy. Get a personalized Korean name with writing animation, personality analysis, and Joseon dynasty rank!",
  keywords: [
    "Korean name",
    "my name in Korean",
    "Korean name generator",
    "Korean calligraphy",
    "Hangul name",
    "name in Korean",
    "Korean name translation",
    "Korean name converter",
    "K-pop",
    "Korean culture",
    "Seoul",
    "Korea travel",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://mykoreanname.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "My Korean Name",
    title: "My Korean Name - Get Your Name in Korean",
    description:
      "Discover your name in beautiful Korean calligraphy with personality analysis!",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Korean Name - Get Your Name in Korean",
    description:
      "Discover your name in beautiful Korean calligraphy with personality analysis!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@600;700;800&family=Gowun+Batang:wght@400;700&family=Jua&family=Nanum+Pen+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 antialiased">
        {children}
      </body>
    </html>
  );
}
