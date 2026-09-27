"use client";

import { LazyMotion, domAnimation, domMax, m, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import type { CaseSection } from "@/lib/case-studies";

export function ReadingProgress() {
  return (
    <LazyMotion features={domAnimation}>
      <ProgressBar />
    </LazyMotion>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent lg:hidden"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

export function JumpMenu({ sections }: { sections: CaseSection[] }) {
  return (
    <details className="relative mt-6 lg:hidden">
      <summary className="w-fit cursor-pointer list-none rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink shadow-soft [&::-webkit-details-marker]:hidden">
        Jump to section ▾
      </summary>
      <ul className="absolute z-20 mt-2 min-w-56 rounded-[20px] border border-line bg-surface p-2 shadow-soft">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block rounded-full px-3 py-1.5 text-sm text-ink hover:bg-tint"
              onClick={(event) => {
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function CaseNav({ sections }: { sections: CaseSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node instanceof HTMLElement);

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id;
        if (id) setActive(id);
      },
      { rootMargin: "-104px 0px -60% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <LazyMotion features={domMax}>
      <nav aria-label="On this page" className="sticky top-28 hidden self-start lg:block">
        <ul className="flex flex-col">
          {sections.map((section) => {
            const current = section.id === active;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={current ? "location" : undefined}
                  className={`relative block py-1.5 pl-4 text-sm motion-safe:transition-colors motion-safe:duration-150 ${current ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {current ? (
                    <m.span
                      layoutId="case-section-bar"
                      className="absolute inset-y-1 left-0 w-0.5 rounded-full"
                      style={{ backgroundColor: "var(--mark)" }}
                    />
                  ) : null}
                  {section.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </LazyMotion>
  );
}
