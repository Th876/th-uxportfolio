"use client";

import Image from "next/image";
import { LazyMotion, domAnimation, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { imageMeta } from "@/content/image-meta";
import { easeOut } from "@/lib/motion";
import { slugify } from "@/lib/slug";

function sizeOf(src: string) {
  return imageMeta[src] ?? { width: 1600, height: 1000 };
}

function Reveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() === true;
  if (reduced) return children;

  return (
    <m.div
      className="motion-rise"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}

function textFrom(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFrom).join("");
  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as { children?: ReactNode };
    return textFrom(props.children);
  }
  return "";
}

export function SectionHeading({ children }: { children?: ReactNode }) {
  const id = slugify(textFrom(children));
  return (
    <div className="mt-24 first:mt-0">
      <Reveal>
        <h2
          id={id}
          className="scroll-mt-28 text-[28px] leading-tight font-medium tracking-[-0.02em] md:text-[32px]"
        >
          {children}
        </h2>
      </Reveal>
    </div>
  );
}

export function Paragraph({ children }: { children?: ReactNode }) {
  return (
    <Reveal>
      <p className="mt-4 max-w-case text-ink">{children}</p>
    </Reveal>
  );
}

export function BulletList({ children }: { children?: ReactNode }) {
  return <ul className="mt-4 max-w-case list-disc space-y-2 pl-5 text-ink">{children}</ul>;
}

export function TextLink({ href, children }: { href?: string; children?: ReactNode }) {
  const external = href?.startsWith("http");
  return (
    <a
      href={href}
      className="text-accent underline decoration-line underline-offset-4 hover:text-accent-strong"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function Highlight({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() === true;
  const inView = useInView(ref, { amount: 0.6, once: true });
  const drawn = reduced || inView;

  return (
    <span ref={ref} className="relative inline">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.05em] h-[0.45em] origin-left bg-tint"
        style={{
          transform: drawn ? "scaleX(1)" : "scaleX(0)",
          transition: reduced ? "none" : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      {children}
    </span>
  );
}

export function Insights({ children }: { children?: ReactNode }) {
  return <div className="my-8 grid gap-4 md:grid-cols-3">{children}</div>;
}

export function Insight({ quote, source }: { quote: string; source?: string }) {
  return (
    <figure className="rounded-[20px] bg-bg p-5">
      <blockquote className="text-[15px] leading-relaxed text-ink">{quote}</blockquote>
      {source ? <figcaption className="mt-4 text-sm text-muted">{source}</figcaption> : null}
    </figure>
  );
}

export function Placeholder({
  label,
  caption,
  compact,
}: {
  label: string;
  caption?: string;
  compact?: boolean;
}) {
  return (
    <figure>
      <div
        role="img"
        aria-label={label}
        className={`grid place-items-center rounded-[20px] border border-dashed border-line bg-tint px-4 text-center ${compact ? "aspect-square" : "aspect-[4/3]"}`}
      >
        <p className="text-sm text-muted">
          <span className="block text-[11px] tracking-[0.08em] uppercase">Placeholder</span>
          <span className="mt-1 block">{label}</span>
        </p>
      </div>
      {caption ? <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

export function Decision({
  title,
  image,
  alt,
  caption,
  placeholder,
  children,
}: {
  title: string;
  image?: string;
  alt?: string;
  reverse?: boolean;
  caption?: string;
  placeholder?: string;
  children?: ReactNode;
}) {
  return (
    <div className="my-12">
      {placeholder ? (
        <Placeholder label={placeholder} caption={caption} />
      ) : image ? (
        <Figure src={image} alt={alt ?? ""} caption={caption} />
      ) : null}
      <h3 className="mt-4 text-[22px] leading-tight font-medium tracking-[-0.02em]">{title}</h3>
      <div className="mt-3 max-w-case text-ink [&_p]:mt-3">{children}</div>
    </div>
  );
}

export function BeforeAfter({
  before,
  after,
  middle,
  beforeAlt,
  afterAlt,
  middleAlt = "",
  beforeCaption = "Before",
  afterCaption = "After",
  middleCaption,
}: {
  before: string;
  after: string;
  middle?: string;
  beforeAlt: string;
  afterAlt: string;
  middleAlt?: string;
  beforeCaption?: string;
  afterCaption?: string;
  middleCaption?: string;
}) {
  const stages = [
    { src: before, alt: beforeAlt, caption: beforeCaption },
    ...(middle ? [{ src: middle, alt: middleAlt, caption: middleCaption }] : []),
    { src: after, alt: afterAlt, caption: afterCaption },
  ];

  return (
    <div className="my-8 flex flex-col gap-6">
      {stages.map((s) => (
        <Figure key={s.src} src={s.src} alt={s.alt} caption={s.caption} />
      ))}
    </div>
  );
}
// export function BeforeAfter({
//   before,
//   after,
//   beforeAlt,
//   afterAlt,
//   beforeCaption = "Before",
//   afterCaption = "After",
// }: {
//   before: string;
//   after: string;
//   beforeAlt: string;
//   afterAlt: string;
//   beforeCaption?: string;
//   afterCaption?: string;
// }) {
//   return (
//     <div className="my-8 flex flex-col gap-6">
//       <Figure src={before} alt={beforeAlt} caption={beforeCaption} />
//       <Figure src={after} alt={afterAlt} caption={afterCaption} />
//     </div>
//   );
// }

export function Figure({
  src,
  alt,
  caption,
  size = "default",
  align = "left",
}: {
  src: string;
  alt: string;
  caption?: string;
  size?: "default" | "compact";
  align?: "left" | "center";
}) {
  const meta = sizeOf(src);
  const compactAlign = align === "center" ? "mx-auto" : "";

  return (
    <figure className={`my-8 ${size === "compact" ? `max-w-sm ${compactAlign}` : ""}`}>
      <div className="overflow-hidden rounded-[20px] border border-line bg-white">
        <Image
          src={src}
          alt={alt}
          width={meta.width}
          height={meta.height}
          quality={90}
          className="h-auto w-full bg-white"
          sizes={size === "compact" ? "(min-width: 1024px) 400px, 60vw" : "(min-width: 1024px) 960px, 100vw"}
        />
      </div>
      {caption ? <figcaption className="mt-3 max-w-case text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <p className="my-8 max-w-case">
      <span className="block text-[40px] leading-none font-medium tracking-[-0.02em] text-ink">{value}</span>
      <span className="mt-2 block text-sm text-muted">{label}</span>
    </p>
  );
}

export function Callout({ children }: { children?: ReactNode }) {
  return (
    <aside className="my-8 max-w-case rounded-[20px] border border-line bg-tint px-5 py-4 text-ink [&_a]:font-medium [&_p]:mt-2 [&_p:first-child]:mt-0">
      {children}
    </aside>
  );
}

export function CaseVideo({
  src,
  webm,
  poster,
  caption,
}: {
  src: string;
  webm?: string;
  poster: string;
  caption?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() === true;

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <figure className="my-8">
      <video
        ref={ref}
        className="w-full rounded-[20px] border border-line bg-surface"
        poster={poster}
        muted
        playsInline
        loop
        preload="none"
        controls={reduced}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
      </video>
      {caption ? <figcaption className="mt-3 max-w-case text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

export function CaseStudyMotion({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function WhatChanged({ children }: { children?: ReactNode }) {
  return <ul className="mt-6 max-w-case space-y-3">{children}</ul>;
}

export function Change({ children }: { children?: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-ink">
      <span
        aria-hidden="true"
        className="mt-1 grid size-5 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: "var(--mark-bg)", color: "var(--mark)" }}
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

export function Findings({ children }: { children?: ReactNode }) {
  return <div className="my-8 grid gap-4 md:grid-cols-3">{children}</div>;
}

export function Finding({ quote, note }: { quote: string; note: string }) {
  return (
    <figure className="flex h-full flex-col rounded-[20px] bg-bg p-5">
      <blockquote className="text-[15px] leading-relaxed text-ink">“{quote}”</blockquote>
      <figcaption className="mt-auto pt-5 font-hand text-[22px] leading-none text-ink italic">{note}</figcaption>
    </figure>
  );
}

export function Process({ caption, children }: { caption: string; children?: ReactNode }) {
  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>
      <p className="mt-3 text-sm text-muted">{caption}</p>
    </div>
  );
}

export function ProcessLoop({
  steps,
  loopLabel,
  pivotTitle,
  pivotText,
  caption,
}: {
  steps: string[];
  loopLabel: string;
  pivotTitle: string;
  pivotText: string;
  caption?: string;
}) {
  return (
    <div className="my-8">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3 rounded-[20px] bg-bg px-4 py-3 text-ink">
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-medium"
              style={{ backgroundColor: "var(--mark-bg)", color: "var(--mark)" }}
            >
              {i + 1}
            </span>
            <span className="text-[15px]">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex items-center gap-3 rounded-[20px] border border-dashed border-line px-4 py-3 text-sm text-muted">
        <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M13 8a5 5 0 1 1-1.5-3.5" strokeLinecap="round" />
          <path d="M13 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{loopLabel}</span>
      </div>

      <aside className="mt-3 rounded-[20px] border border-line bg-tint px-5 py-4 text-ink">
        <p className="font-medium">{pivotTitle}</p>
        <p className="mt-1 text-[15px]">{pivotText}</p>
      </aside>

      {caption ? <p className="mt-3 text-sm text-muted">{caption}</p> : null}
    </div>
  );
}