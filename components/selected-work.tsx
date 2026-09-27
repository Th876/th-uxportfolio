"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { moreWork, projects, type Project } from "@/content/projects";

export function SelectedWork() {
  return (
    <LazyMotion features={domAnimation}>
      <section id="work" className="scroll-mt-28 mx-auto w-full max-w-content px-5 pt-16 pb-24 sm:px-6">
        <div className="mt-12 flex flex-col gap-20 md:gap-28">
          {projects.map((project, index) => (
            <ZoomIn key={project.slug}>
              <FlowCard project={project} imageSide={index % 2 === 0 ? "left" : "right"} />
            </ZoomIn>
          ))}
        </div>
        <h3 className="mt-20 text-[22px] leading-tight font-medium tracking-[-0.02em] md:mt-28 md:text-[28px]">
          More work
        </h3>
        <ZoomIn>
          <MoreWorkCard project={moreWork} />
        </ZoomIn>
      </section>
    </LazyMotion>
  );
}

function ZoomIn({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.28 });
  const scale = useTransform(smooth, [0, 1], [0.55, 1]);
  const opacity = useTransform(smooth, [0, 0.3], [0.2, 1]);

  return (
    <m.div ref={ref} className="origin-center" style={reduced ? undefined : { scale, opacity }}>
      {children}
    </m.div>
  );
}

function FlowCard({ project, imageSide }: { project: Project; imageSide: "left" | "right" }) {
  return (
    <Link
      href={project.href}
      data-cursor="view case study"
      className="group grid items-center gap-6 rounded-[24px] border border-line bg-surface p-4 motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.97] md:grid-cols-2 md:gap-10 md:p-6"
    >
      <ProjectImage project={project} imageSide={imageSide} />
      <ProjectCopy project={project} />
    </Link>
  );
}

function ProjectImage({ project, imageSide }: { project: Project; imageSide: "left" | "right" }) {
  return (
    <div className={`overflow-hidden rounded-[20px] bg-tint ${imageSide === "right" ? "md:order-2" : ""}`}>
      {project.video ? (
        <video
          src={project.video}
          autoPlay
          muted
          loop
          playsInline
          className="aspect-square w-full object-cover motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:scale-[1.02]"
        />
      ) : project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={900}
          height={900}
          className="aspect-square w-full object-cover motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:scale-[1.02]"
        />
      ) : (
        <div className="grid aspect-square place-items-center">
          <div className="h-[68%] w-[34%] rounded-[32px] border-2 border-accent" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

// function ProjectImage({ project, imageSide }: { project: Project; imageSide: "left" | "right" }) {
//   return (
//     <div className={`overflow-hidden rounded-[20px] bg-tint ${imageSide === "right" ? "md:order-2" : ""}`}>
//       {project.image ? (
//         <Image
//           src={project.image}
//           alt={project.imageAlt}
//           width={900}
//           height={900}
//           className="aspect-square w-full object-cover motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:scale-[1.02]"
//         />
//       ) : (
//         <div className="grid aspect-square place-items-center">
//           <div className="h-[68%] w-[34%] rounded-[32px] border-2 border-accent" aria-hidden="true" />
//         </div>
//       )}
//     </div>
//   );
// }

function ProjectCopy({ project }: { project: Project }) {
  return (
    <div>
      <p className="text-sm text-muted">{project.label}</p>
      <h3 className="mt-2 text-[28px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[36px]">
        {project.title}
      </h3>
      <p className="mt-3 max-w-[36rem] text-ink">{project.summary}</p>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <MapPin aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
        {project.users}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-ink">
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
  );
}

function MoreWorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      data-cursor="view case study"
      className="group mt-6 flex items-center gap-4 rounded-[24px] border border-line bg-surface p-3 motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-1 motion-safe:active:scale-[0.97] sm:gap-6 sm:p-4"
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
  );
}
