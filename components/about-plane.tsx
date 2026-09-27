"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const DURATION = 5500;
const PUFF_COUNT = 7;

let playedThisLoad = false;

export function AboutPlane() {
  const hostRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const puffRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const host = hostRef.current;
    const section = host?.parentElement;
    if (!host || !section || playedThisLoad) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const play = () => {
      const plane = planeRef.current;
      if (!plane || playedThisLoad) return;
      playedThisLoad = true;
      observer.disconnect();

      const { width, height } = host.getBoundingClientRect();
      const path = Math.atan2(-height, width);
      const rotate = (path * 180) / Math.PI + 16;
      const length = Math.hypot(width, height) || 1;
      const stepX = width / length;
      const stepY = -height / length;
      const puffAt = Array.from({ length: PUFF_COUNT }, (_, index) => 0.12 + (index / PUFF_COUNT) * 0.68);
      let spawned = 0;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const x = -40 + t * (width + 80);
        const y = height + 20 - t * (height + 80);
        const opacity = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
        plane.style.opacity = String(opacity);
        plane.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-30%, -40%) rotate(${rotate}deg)`;

        while (spawned < puffAt.length && t >= puffAt[spawned]) {
          const puff = puffRefs.current[spawned];
          const along = spawned;
          spawned += 1;
          if (!puff) continue;
          const trail = 78 + along * 6;
          const puffX = x - stepX * trail;
          const puffY = y - stepY * trail;
          puff.animate(
            [
              {
                opacity: 0.72,
                transform: `translate3d(${puffX}px, ${puffY}px, 0) translate(-50%, -50%) scale(0.55)`,
              },
              {
                opacity: 0,
                transform: `translate3d(${puffX}px, ${puffY}px, 0) translate(-50%, -50%) scale(1.8)`,
              },
            ],
            { duration: 1000, easing: "ease-out", fill: "forwards" },
          );
        }

        if (t < 1) frame = requestAnimationFrame(tick);
        else plane.style.opacity = "0";
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) play();
      },
      { threshold: 0.35 },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {Array.from({ length: PUFF_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            puffRefs.current[index] = node;
          }}
          className="absolute top-0 left-0 size-3.5 rounded-full bg-[rgb(236_228_220)] opacity-0 blur-[0.5px]"
        />
      ))}
      <div ref={planeRef} className="absolute top-0 left-0 w-[190px] opacity-0 will-change-transform sm:w-[230px]">
        <Image src="/images/plane.png" alt="" width={800} height={800} className="h-auto w-full" />
      </div>
    </div>
  );
}
