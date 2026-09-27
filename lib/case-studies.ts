import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "@/lib/slug";

export type CaseStudyFrontmatter = {
  title: string;
  project: string;
  subtitle: string;
  status: string;
  timeline: string;
  role: string;
  tools: string[];
  tldr: {
    background: string;
    problem: string;
    approach: string;
    outcome: string;
  };
  stats: { value: string; label: string }[];
  next: string | null;
  comingSoon: boolean;
  hero?: string;
  heroAlt?: string;
  format?: "field-note";
  label?: string;
  location?: string;
  glance?: { label: string; value: string }[];
  link?: { label: string; url: string };
};

export type CaseSection = {
  id: string;
  title: string;
};

export type CaseStudy = {
  slug: string;
  frontmatter: CaseStudyFrontmatter;
  content: string;
  sections: CaseSection[];
};

const directory = path.join(process.cwd(), "content/case-studies");

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asLink(value: unknown) {
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  const label = asString(record.label).trim();
  const url = asString(record.url).trim();
  if (!label || !url) return undefined;
  return { label, url };
}

function asPairs(value: unknown, keys: [string, string]) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const record = item as Record<string, unknown>;
    return [{ [keys[0]]: asString(record[keys[0]]), [keys[1]]: asString(record[keys[1]]) }];
  }) as { [key: string]: string }[];
}

export function getCaseStudySlugs() {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const filePath = path.join(directory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const record = data as Record<string, unknown>;
  const tldr = (record.tldr ?? {}) as Record<string, unknown>;
  const tools = Array.isArray(record.tools)
    ? record.tools.filter((tool): tool is string => typeof tool === "string")
    : [];
  const stats = Array.isArray(record.stats)
    ? record.stats.flatMap((stat) => {
        if (typeof stat !== "object" || stat === null) return [];
        const item = stat as Record<string, unknown>;
        return [{ value: asString(item.value), label: asString(item.label) }];
      })
    : [];

  const sections = [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => {
    const title = match[1]?.trim() ?? "";
    return { id: slugify(title), title };
  });

  return {
    slug,
    content,
    sections,
    frontmatter: {
      title: asString(record.title),
      project: asString(record.project),
      subtitle: asString(record.subtitle),
      status: asString(record.status),
      timeline: asString(record.timeline),
      role: asString(record.role),
      tools,
      tldr: {
        background: asString(tldr.background),
        problem: asString(tldr.problem),
        approach: asString(tldr.approach),
        outcome: asString(tldr.outcome),
      },
      stats,
      next: typeof record.next === "string" ? record.next : null,
      comingSoon: record.comingSoon === true,
      hero: typeof record.hero === "string" ? record.hero : undefined,
      heroAlt: typeof record.heroAlt === "string" ? record.heroAlt : undefined,
      format: record.format === "field-note" ? "field-note" : undefined,
      label: typeof record.label === "string" ? record.label : undefined,
      location: typeof record.location === "string" ? record.location : undefined,
      glance: asPairs(record.glance, ["label", "value"]) as { label: string; value: string }[],
      link: asLink(record.link),
    },
  };
}
