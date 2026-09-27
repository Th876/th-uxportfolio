import { site } from "@/content/site";

export type TextRun =
  | string
  | { bold: string }
  | { highlight: string }
  | { link: { label: string; href: string } };

export type AnswerBlock =
  | { type: "paragraph"; runs: TextRun[] }
  | { type: "list"; items: { lead: string; runs: TextRun[] }[] };

export type ChatCta = {
  label: string;
  href?: string;
  external?: boolean;
  scrollTo?: "work";
};

export type ChatAction = "scroll-work" | "resume" | "linkedin";

export type ChatEntry = {
  id: string;
  chipLabel: string;
  question?: string;
  action?: ChatAction;
  answer?: AnswerBlock[];
  component?: "journey-map";
  cta?: ChatCta;
  followUps?: string[];
  keywords: string[];
  followUpOnly?: boolean;
  confirm?: string;
};

export const introMessage =
  "I'm Tahaylia, a product designer in Atlanta. I research, design, and build for real people.";

export const fallbackMessage = {
  before: "Good question! I'd rather answer that one myself. Email me at ",
  email: site.email,
  after: ".",
};

export const chatEntries: ChatEntry[] = [
  {
    id: "see-work",
    chipLabel: "see my work ↓",
    action: "scroll-work",
    keywords: ["portfolio", "case", "work"],
  },
  {
    id: "story",
    chipLabel: "what's your story?",
    question: "What's your story?",
    component: "journey-map",
    answer: [
      {
        type: "paragraph",
        runs: [
          "I was born in Jamaica, moved to the US, studied abroad in Spain and Germany, and now design from Atlanta. Moving between places taught me to pay attention to how people actually live. That's what I bring to design.",
        ],
      },
    ],
    keywords: ["story", "jamaica", "background"],
  },
  {
    id: "how",
    chipLabel: "how do you work?",
    question: "How do you work?",
    answer: [
      {
        type: "paragraph",
        runs: ["Three habits show up in every project:"],
      },
      {
        type: "list",
        items: [
          {
            lead: "Start with the real problem.",
            runs: [
              " At nooon, stakeholder interviews surfaced 3+ navigation bottlenecks before I opened Figma.",
            ],
          },
          {
            lead: "Design it, then build it.",
            runs: [
              " I prototype in Figma and write the code myself, so nothing gets lost in a handoff.",
            ],
          },
          {
            lead: "Ship small, then listen.",
            runs: [
              " With Temple, I release to users in waves and track what they actually do, so each version is shaped by ",
              { highlight: "real behavior, not guesses" },
              ".",
            ],
          },
        ],
      },
    ],
    cta: { label: "See it in my work ↓", scrollTo: "work" },
    keywords: [
      "process",
      "work",
      "approach",
      "method",
      "figma",
      "code",
      "build",
      "research",
      "handoff",
      "how",
    ],
  },
  {
    id: "building",
    chipLabel: "what are you building now?",
    question: "What are you building now?",
    answer: [
      {
        type: "paragraph",
        runs: [
          { bold: "Temple" },
          ", a wellness food guide app that helps people shop for their health goals. I designed it, built it, and I'm opening it to early users in waves so real feedback shapes every release.",
        ],
      },
    ],
    cta: { label: "Visit Temple ↗", href: site.templeUrl, external: true },
    followUps: ["cut"],
    keywords: ["temple", "building", "project", "app", "food", "health", "now", "current"],
  },
  {
    id: "cut",
    chipLabel: "what did you cut on purpose?",
    question: "What did you cut on purpose?",
    followUpOnly: true,
    answer: [
      {
        type: "paragraph",
        runs: [
          "Kosher and Halal filters. Ingredient data can't reliably verify either one, and ",
          { highlight: "a filter that's wrong breaks trust faster than a missing one" },
          ". I also removed a Nut-free option that duplicated the existing peanut and tree nut allergen settings. Fewer options, more honest ones.",
        ],
      },
    ],
    cta: { label: "See how I think in my work ↓", scrollTo: "work" },
    keywords: ["cut", "remove", "removed", "decision", "tradeoff", "trade-off", "filter"],
  },
  {
    id: "availability",
    chipLabel: "availability?",
    question: "Availability?",
    answer: [
      {
        type: "paragraph",
        runs: [
          "Actively looking and ready to start now. Open to product design, UX research, product strategy, and related roles. Metro Atlanta based, open to hybrid, remote, or relocation.",
        ],
      },
    ],
    cta: { label: "Email me ↗", href: `mailto:${site.email}` },
    keywords: ["available", "availability", "hire", "start", "remote"],
  },
  {
    id: "resume",
    chipLabel: "resume ↗",
    action: "resume",
    keywords: [],
  },
  {
    id: "linkedin",
    chipLabel: "linkedin ↗",
    action: "linkedin",
    keywords: [],
  },
];

export const chipRows = [
  ["see-work", "story", "how", "building"],
  ["availability", "resume", "linkedin"],
] as const;

const entriesById = new Map(chatEntries.map((entry) => [entry.id, entry]));

export function getChatEntry(id: string): ChatEntry {
  const entry = entriesById.get(id);
  if (!entry) throw new Error(`Unknown chat entry: ${id}`);
  return entry;
}
