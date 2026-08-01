import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://my-korean-name.vercel.app";

// 글로벌 인기 이름 (미국/영국/호주/캐나다/인도/유럽 + K-pop 팬 이름)
const POPULAR_NAMES = [
  // US top names
  "james", "john", "robert", "michael", "william", "david", "richard", "joseph", "thomas", "charles",
  "christopher", "daniel", "matthew", "anthony", "mark", "donald", "steven", "paul", "andrew", "joshua",
  "mary", "jennifer", "jessica", "sarah", "emily", "emma", "olivia", "sophia", "isabella", "charlotte",
  "mia", "luna", "amelia", "harper", "evelyn", "abigail", "elizabeth", "ella", "avery", "scarlett",
  // Modern popular
  "liam", "noah", "ethan", "mason", "logan", "alexander", "elijah", "oliver", "jacob", "lucas",
  "aiden", "jackson", "sebastian", "henry", "owen", "ryan", "jack", "luke", "dylan", "nathan",
  "grace", "chloe", "zoey", "lily", "hannah", "victoria", "natalie", "lily", "aria", "elena",
  // UK/Australian
  "george", "harry", "oscar", "charlie", "leo", "alfie", "freddie", "archie", "theo", "max",
  "poppy", "isla", "florence", "willow", "ivy", "rosie", "freya", "phoebe", "ruby", "daisy",
  // Indian/South Asian (common in English)
  "arjun", "priya", "rahul", "ananya", "dev", "maya", "ravi", "nisha", "aarav", "sanya",
  // European
  "marie", "hans", "pierre", "sofia", "carlos", "anna", "marcus", "lucia", "felix", "elena",
  // K-pop fan culture names
  "taylor", "ashley", "madison", "brittany", "amber", "crystal", "jade", "jasmine", "diana", "stella",
];

// 중복 제거
const UNIQUE_NAMES = [...new Set(POPULAR_NAMES)];

export default function sitemap(): MetadataRoute.Sitemap {
  const namePages = UNIQUE_NAMES.map((name) => ({
    url: `${BASE_URL}/result/${name}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...namePages,
  ];
}
