import type { MetadataRoute } from "next";

// 인기 이름들을 미리 sitemap에 포함 (SEO)
const POPULAR_NAMES = [
  "james", "john", "robert", "michael", "william", "david",
  "mary", "jennifer", "jessica", "sarah", "emily", "emma",
  "olivia", "sophia", "liam", "noah", "ethan", "mason",
  "isabella", "charlotte", "mia", "luna", "alexander", "daniel",
  "matthew", "ryan", "jack", "oliver", "grace", "chloe",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mykoreanname.com";

  const namePages = POPULAR_NAMES.map((name) => ({
    url: `${baseUrl}/result/${name}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...namePages,
  ];
}
