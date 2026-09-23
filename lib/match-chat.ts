import { chatEntries, type ChatEntry } from "@/content/chat";

const tieBreak = ["cut", "building", "story", "availability", "how", "see-work"];

export function matchChat(raw: string): ChatEntry | null {
  const text = raw.trim().toLowerCase();
  if (!text) return null;

  const hits = chatEntries
    .map((entry) => {
      const matched = entry.keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
      const score = matched.reduce((total, keyword) => total + keyword.length, 0);
      return { entry, matched, score };
    })
    .filter((item) => item.score > 0);

  if (hits.length === 0) return null;

  const bestScore = Math.max(...hits.map((item) => item.score));
  let finalists = hits.filter((item) => item.score === bestScore);

  const how = finalists.find((item) => item.entry.id === "how");
  const scroll = finalists.find((item) => item.entry.id === "see-work");
  if (how && scroll && how.matched.every((keyword) => keyword === "work")) {
    finalists = finalists.filter((item) => item.entry.id !== "how");
  }

  finalists.sort(
    (a, b) => tieBreak.indexOf(a.entry.id) - tieBreak.indexOf(b.entry.id),
  );

  return finalists[0]?.entry ?? null;
}
