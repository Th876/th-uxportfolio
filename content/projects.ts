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
  related: string;
  relatedImage?: string;
  relatedImageAlt?: string;
  video?: string | null;
};

export const projects: Project[] = [
  {
    slug: "temple",
    title: "Temple",
    label: "Live Product",
    summary: "A wellness food guide app I designed, built, and launched to real users.",
    users: "Health-focused shoppers · USA",
    tags: ["Product Design", "Research", "Shipped it"],
    href: "/work/temple",
    image: "/images/cards/grocery-gif.gif",
    imageAlt: "Animated grocery list being checked off in the Temple app, ending in a confetti celebration",
    related: "A wellness food guide app that turns doctor's orders into a grocery list you can actually shop.",
    relatedImage: "/images/cards/more-temple.png",
    relatedImageAlt: "Temple app on a phone",
    video: null,
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
    video: "/images/cards/nooon1.mp4",
    image: null,
    imageAlt: "",
    related: "A hotel and influencer booking platform rebranded from social to serious B2B.",
    relatedImage: "/images/cards/more-nooon.png",
    relatedImageAlt: "nooon website on a laptop",
  },
  {
    slug: "fundflow",
    title: "FundFlow",
    label: "Team project",
    summary: "A loan management dashboard for small business owners, designed with a 4-person UX team.",
    users: "Small business owners · USA",
    tags: ["Research", "B2B SaaS"],
    href: "/work/fundflow",
    video: "/images/cards/fundflow-card.mp4",
    image: null,
    imageAlt: "",
    related: "A B2B web app that helps small businesses secure funding fairly, not just faster.",
    relatedImage: "/images/cards/more-fundflow.png",
    relatedImageAlt: "FundFlow website on a desktop monitor with a phone",
  },
];

export const moreWork: Project = {
  slug: "xpensepal",
  title: "XpensePal",
  label: "More work",
  summary: "Capstone project",
  users: "",
  tags: [],
  href: "/work/xpensepal",
  image: "/images/cards/xpensepal.webp",
  imageAlt: "XpensePal app on three phones",
  related: "A budgeting app for Gen Z that guides, not guilt-trips.",
  relatedImage: "/images/cards/more-xpensepal.png",
  relatedImageAlt: "XpensePal app on a phone",
};