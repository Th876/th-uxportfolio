"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll } from "motion/react";
import { useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { moreWork, projects, type Project } from "@/content/projects";
import { easeOut } from "@/lib/motion";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia("(min-width: 768px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function desktopNow() {
  return window.matchMedia("(min-width: 768px)").matches;
}

export function SelectedWork() {
  return (
    <LazyMotion features={domAnimation}>
    <section className="mx-auto w-full max-w-content px-5 pt-16 pb-24 sm:px-6">
      <h2
        id="work"
        className="scroll-mt-28 text-[28px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[40px]"
      >
        Selected work
      </h2>
      <p className="mt-3 max-w-[28rem] text-muted">
        Real projects, real people, and what I learned from them.
      </p>
      <div className="mt-12 flex flex-col gap-16 md:mt-16 md:gap-28">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            imageSide={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
      <h3 className="mt-20 text-[22px] leading-tight font-medium tracking-[-0.02em] md:mt-28 md:text-[28px]">
        More work
      </h3>
      <MoreWorkCard project={moreWork} />
    </section>
    </LazyMotion>
  );
}

function ProjectCard({
  project,
  imageSide,
}: {
  project: Project;
  imageSide: "left" | "right";
}) {
  const reduced = useReducedMotion() === true;
  const desktop = useSyncExternalStore(subscribeDesktop, desktopNow, () => false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Reveal cardRef={ref} desktop={desktop} reduced={reduced}>
      <Link
        href={project.href}
        className="group grid items-center gap-6 rounded-[24px] motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.97] md:grid-cols-2 md:gap-10"
      >
        <ProjectImage
          project={project}
          className={imageSide === "right" ? "md:order-2" : undefined}
        />
        <div className={imageSide === "right" ? "md:order-1" : undefined}>
          <p className="text-sm text-muted">{project.label}</p>
          <h3 className="mt-2 text-[28px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[40px]">
            {project.title}
          </h3>
          <p className="mt-3 max-w-[36rem] text-ink">{project.summary}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <MapPin aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
            {project.users}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-ink"
              >
                {tag}
              </li>
            ))}
          </ul>
          <p className="mt-5 inline-flex items-center font-medium text-accent">
            View case study
            <span
              aria-hidden="true"
              className="ml-1 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1"
            >
              →
            </span>
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

function ProjectImage({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[24px] bg-tint ${className ?? ""}`}>
      {project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={900}
          height={900}
          className="aspect-square w-full object-cover motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:scale-[1.02]"
        />
      ) : (
        <div className="grid aspect-square place-items-center">
          <div
            className="h-[68%] w-[34%] rounded-[32px] border-2 border-accent"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

function MoreWorkCard({ project }: { project: Project }) {
  const reduced = useReducedMotion() === true;
  const desktop = useSyncExternalStore(subscribeDesktop, desktopNow, () => false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Reveal cardRef={ref} desktop={desktop} reduced={reduced}>
      <Link
        href={project.href}
        className="group mt-6 flex items-center gap-4 rounded-[24px] border border-line bg-surface p-3 shadow-soft motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.97] sm:gap-6 sm:p-4"
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={160}
            height={160}
            className="size-20 shrink-0 rounded-[16px] object-cover motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:scale-[1.02] sm:size-28"
          />
        ) : null}
        <div className="min-w-0">
          <p className="text-[20px] leading-tight font-medium tracking-[-0.02em] text-ink md:text-[24px]">
            {project.title}
          </p>
          <p className="mt-1 text-muted">{project.summary}</p>
          <p className="mt-2 inline-flex items-center text-sm font-medium text-accent">
            View case study
            <span
              aria-hidden="true"
              className="ml-1 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1"
            >
              →
            </span>
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

function Reveal({
  cardRef,
  desktop,
  reduced,
  children,
}: {
  cardRef: RefObject<HTMLDivElement | null>;
  desktop: boolean;
  reduced: boolean;
  children: ReactNode;
}) {
  if (reduced || !desktop) {
    return <FadeIn reduced={reduced}>{children}</FadeIn>;
  }

  return <Parallax cardRef={cardRef}>{children}</Parallax>;
}

function FadeIn({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(reduced);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <m.div
      ref={ref}
      className="motion-rise"
      initial={{ opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}

function Parallax({
  cardRef,
  children,
}: {
  cardRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });
  const visualRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;
    let settled = 0;
    const apply = (value: number) => {
      settled = Math.max(settled, value);
      visual.style.opacity = String(settled);
      visual.style.transform = `translateY(${120 - settled * 120}px) scale(${0.82 + settled * 0.18})`;
      visual.style.filter = `blur(${6 - settled * 6}px)`;
    };
    apply(scrollYProgress.get());
    return scrollYProgress.on("change", apply);
  }, [scrollYProgress]);

  return (
    <div ref={cardRef}>
      <div ref={visualRef} style={{ opacity: 0, transform: "translateY(120px) scale(0.82)", filter: "blur(6px)" }}>
        {children}
      </div>
    </div>
  );
}
