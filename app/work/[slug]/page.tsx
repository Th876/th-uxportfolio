import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CaseNav, JumpMenu, ReadingProgress } from "@/components/case-study/case-nav";
import {
  BeforeAfter,
  BulletList,
  Callout,
  CaseStudyMotion,
  CaseVideo,
  Change,
  Decision,
  Figure,
  Finding,
  Findings,
  Highlight,
  Insight,
  Insights,
  Paragraph,
  Placeholder,
  Process,
  SectionHeading,
  Stat,
  TextLink,
  WhatChanged,
} from "@/components/case-study/blocks";
import { Step } from "@/components/ProcessSteps";
import { ProcessSteps, ProcessLoop } from "@/components/ProcessSteps";
import { StatCompare } from "@/components/StatCompare";
import { imageMeta } from "@/content/image-meta";
import { moreWork, projects } from "@/content/projects";
import { site } from "@/content/site";
import { getCaseStudy, getCaseStudySlugs, type CaseStudy } from "@/lib/case-studies";

const components = {
  h2: SectionHeading,
  p: Paragraph,
  ul: BulletList,
  a: TextLink,
  strong: ({ children }: { children?: ReactNode }) => <strong className="font-medium">{children}</strong>,
  Highlight,
  Insight,
  Insights,
  Decision,
  BeforeAfter,
  Figure,
  Stat,
  Callout,
  CaseVideo,
  Placeholder,
  WhatChanged,
  Change,
  Findings,
  Finding,
  Process,
  ProcessSteps,
  Step,
  StatCompare,
  ProcessLoop,
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Work" };

  return {
    title: study.frontmatter.project,
    description: study.frontmatter.comingSoon
      ? "Temple is a wellness food guide app. The full case study is on its way."
      : study.frontmatter.title,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  if (study.frontmatter.comingSoon) return <ComingSoon />;
  return <Study study={study} />;
}

function ComingSoon() {
  return (
    <main
      id="content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-content flex-1 flex-col px-5 py-12 outline-none sm:px-6"
    >
      <BackLink />
      <p className="mt-10 text-sm text-muted">Case study coming soon</p>
      <h1 className="mt-3 max-w-[14ch] text-[36px] leading-[1.05] font-medium tracking-[-0.02em] md:text-[56px]">
        Temple
      </h1>
      <p className="mt-4 max-w-case text-ink">
        Temple is a wellness food guide app that helps people shop for their health goals. I designed
        and built it, and the full case study is on its way.
      </p>
      <a
        href={site.templeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-fit text-accent underline decoration-line underline-offset-4 hover:text-accent-strong"
      >
        Visit Temple
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </main>
  );
}

async function Study({ study }: { study: CaseStudy }) {
  const { frontmatter, sections } = study;
  if (frontmatter.format === "field-note") return <FieldNote study={study} />;
  const pills = [frontmatter.status, frontmatter.timeline, frontmatter.role, ...frontmatter.tools];

  return (
    <main
      id="content"
      tabIndex={-1}
      className="case-study-page flex-1 bg-white outline-none"
      style={markStyle(study.slug)}
    >
      <ReadingProgress />
      <article className="mx-auto w-full max-w-content px-5 py-12 sm:px-6">
        <BackLink />
        <p className="mt-10 text-sm text-muted">{frontmatter.project}</p>
        <h1 className="mt-3 max-w-[18ch] text-[36px] leading-[1.05] font-medium tracking-[-0.02em] md:text-[56px]">
          {frontmatter.title}
        </h1>
        <p className="mt-4 max-w-case text-muted">{frontmatter.subtitle}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {pills.map((pill) => (
            <li
              key={pill}
              className="rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-ink"
            >
              {pill}
            </li>
          ))}
        </ul>
        <JumpMenu sections={sections} />
        {frontmatter.hero ? (
          <Hero src={frontmatter.hero} alt={frontmatter.heroAlt ?? ""} />
        ) : null}
        <dl className="mt-10 grid gap-6 rounded-[24px] border border-line bg-surface p-6 sm:grid-cols-2">
          <TldrItem label="Background" value={frontmatter.tldr.background} />
          <TldrItem label="Problem" value={frontmatter.tldr.problem} />
          <TldrItem label="Approach" value={frontmatter.tldr.approach} />
          <TldrItem label="Outcome" value={frontmatter.tldr.outcome} />
        </dl>
        <ul className="mt-8 grid gap-8 border-y border-line py-8 sm:grid-cols-3">
          {frontmatter.stats.map((stat) => (
            <li key={stat.label}>
              <p className="text-[40px] leading-none font-medium tracking-[-0.02em]">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 rounded-[24px] bg-surface px-5 py-10 shadow-soft sm:px-8">
          <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
            <CaseNav sections={sections} />
            <CaseStudyMotion>
              <div className="min-w-0 [&>div:first-of-type]:mt-0">
                <MDXRemote source={study.content} components={components} options={{ blockJS: false }} />
              </div>
            </CaseStudyMotion>
          </div>
          <OtherStudies current={study.slug} />
        </div>
      </article>
    </main>
  );
}

function BackLink() {
  return (
    <Link
      href="/#work"
      className="text-sm text-accent underline decoration-line underline-offset-4 hover:text-accent-strong"
    >
      ← Back to work
    </Link>
  );
}

const projectMarks: Record<string, { bg: string; fg: string }> = {
  temple: { bg: "#e8f4d8", fg: "#1d4613" },
  nooon: { bg: "#E6E9FB", fg: "#031ED9" },
  fundflow: { bg: "#FFC857", fg: "#00411A" },
  xpensepal: { bg: "#CFF2C2", fg: "#541C8C" },
};

function markStyle(slug: string): CSSProperties {
  const mark = projectMarks[slug] ?? { bg: "#ece2f6", fg: "#6a548f" };
  return { "--mark-bg": mark.bg, "--mark": mark.fg } as CSSProperties;
}

function Hero({ src, alt }: { src: string; alt: string }) {
  const meta = imageMeta[src] ?? { width: 1600, height: 1000 };
  return (
    <div className="mt-10 overflow-hidden rounded-[20px] border border-line bg-white">
      <Image
        src={src}
        alt={alt}
        width={meta.width}
        height={meta.height}
        quality={90}
        priority
        className="h-auto w-full bg-white"
        sizes="(min-width: 1120px) 1120px, 100vw"
      />
    </div>
  );
}

function TldrItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

async function FieldNote({ study }: { study: CaseStudy }) {
  const { frontmatter, sections } = study;
  return (
    <main
      id="content"
      tabIndex={-1}
      className="case-study-page flex-1 bg-white outline-none"
      style={markStyle(study.slug)}
    >
      <ReadingProgress />
      <article className="mx-auto w-full max-w-content px-5 py-12 sm:px-6">
        <BackLink />
        <p className="mt-10 text-sm text-muted">{frontmatter.label}</p>
        <h1 className="mt-3 max-w-[18ch] text-[36px] leading-[1.05] font-medium tracking-[-0.02em] md:text-[56px]">
          {frontmatter.title}
        </h1>
        <p className="mt-4 max-w-case text-muted">{frontmatter.location}</p>
        <StudyLink link={frontmatter.link} />
        {frontmatter.hero ? (
          <Hero src={frontmatter.hero} alt={frontmatter.heroAlt ?? ""} />
        ) : null}
        <div className="mt-12">
          <dl className="grid gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-4">
            {(frontmatter.glance ?? []).map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="mt-1 text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
            <CaseNav sections={sections} />
            <CaseStudyMotion>
              <div className="min-w-0 [&>div:first-of-type]:mt-0">
                <MDXRemote source={study.content} components={components} options={{ blockJS: false }} />
              </div>
            </CaseStudyMotion>
          </div>
        </div>
        {/* <StudyLink link={frontmatter.link} prominent /> */}
        <OtherStudies current={study.slug} />
      </article>
    </main>
  );
}

function StudyLink({
  link,
  prominent = false,
}: {
  link?: { label: string; url: string };
  prominent?: boolean;
}) {
  if (!link) return null;
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        prominent
          ? "mt-16 inline-flex w-fit items-center rounded-full border border-line bg-white px-4 py-2 text-[15px] text-ink hover:border-accent"
          : "mt-4 inline-flex w-fit items-center rounded-full border border-line bg-white px-3 py-1.5 text-[14px] text-ink hover:border-accent"
      }
    >
      {link.label}
      <span aria-hidden="true" className="ml-1">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function OtherStudies({ current }: { current: string }) {
  const others = [...projects, moreWork].filter((project) => project.slug !== current);
  return (
    <section className="mt-24 border-t border-line pt-16 pb-8">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
        More case studies
      </h2>
      <ul className="mt-8 grid gap-8 sm:grid-cols-3">
        {others.map((project) => (
          <li key={project.slug}>
            <Link href={project.href} data-cursor="view case study" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-[#fbf9f5]">
                {project.relatedImage ? (
                  <Image
                    src={project.relatedImage}
                    alt={project.relatedImageAlt ?? ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center">
                    <div className="h-[68%] w-[34%] rounded-[24px] border-2 border-accent" aria-hidden="true" />
                  </div>
                )}
              </div>
              <p className="mt-3 text-[18px] leading-tight font-medium tracking-[-0.02em]">{project.title}</p>
              <p className="mt-1 text-sm text-ink">{project.related}</p>
              <p className="mt-2 inline-flex items-center text-sm font-medium text-accent">
                View case study
                <span
                  aria-hidden="true"
                  className="ml-1 font-normal motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1"
                >
                  →
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}