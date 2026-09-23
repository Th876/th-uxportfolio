export type Project = {
  slug: string;
  title: string;
  label: string;
  summary: string;
  users: string;
  tags: string[];
  href: string;
  image: string | null;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    slug: "temple",
    title: "Temple",
    label: "Case study coming soon",
    summary: "A wellness food guide app I designed, built, and launched to real users.",
    users: "Health-focused shoppers · USA",
    tags: ["Product Design", "Research", "Built it"],
    href: "/work/temple",
    image: null,
    imageAlt: "",
  },
  {
    slug: "nooon",
    title: "nooon",
    label: "Internship",
    summary:
      "Redesigned and rebranded a B2B platform connecting hotels and influencers, then built it in WordPress.",
    users: "Hotels & influencers · Finland",
    tags: ["UX Design", "Branding", "UX Copy"],
    href: "/work/nooon",
    image: "/images/cards/nooon.webp",
    imageAlt: "nooon website shown on a laptop, phone, and tablet",
  },
  {
    slug: "fundflow",
    title: "FundFlow",
    label: "Team project",
    summary: "A loan management dashboard for small business owners, designed with a 4-person UX team.",
    users: "Small business owners · USA",
    tags: ["Research", "B2B SaaS"],
    href: "/work/fundflow",
    image: "/images/cards/fundflow.webp",
    imageAlt: "FundFlow website on a desktop monitor with a phone beside it",
  },
];

export const moreWork: Project = {
  slug: "xpensepal",
  title: "XpensePal",
  label: "More work",
  summary: "Personal finance app for Gen Y & Z",
  users: "",
  tags: [],
  href: "/work/xpensepal",
  image: "/images/cards/xpensepal.webp",
  imageAlt: "XpensePal app on three phones",
};
