"use client";

import Image from "next/image";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { animate, m, useMotionValue, useReducedMotion } from "motion/react";
import { journeyStops } from "@/content/journey";
import { easeInOut } from "@/lib/motion";

const VIEW_W = 1280;
const VIEW_H = 853;
const DRAW_SECONDS = 2.4;

const route =
  "M 413 651 C 360 500, 360 340, 426 200 C 640 90, 820 220, 887 487 C 980 430, 1040 340, 1089 282 C 900 480, 720 450, 518 303";

const pins = [
  { id: "jamaica", x: 413, y: 651 },
  { id: "illinois", x: 426, y: 200 },
  { id: "spain", x: 887, y: 487 },
  { id: "germany", x: 1089, y: 282 },
  { id: "georgia", x: 518, y: 303, pulse: true },
];

export function JourneyMap() {
  const reduced = useReducedMotion() === true;
  const maskId = useId().replace(/:/g, "");
  const progress = useMotionValue(reduced ? 1 : 0);
  const planeRef = useRef<SVGGElement>(null);
  const [path, setPath] = useState<SVGPathElement | null>(null);

  useLayoutEffect(() => {
    if (!path) return;
    const place = (value: number) => {
      const total = path.getTotalLength();
      const distance = Math.min(total, Math.max(0, value * total));
      const point = path.getPointAtLength(distance);
      const ahead = path.getPointAtLength(Math.min(total, distance + 12));
      const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
      planeRef.current?.setAttribute(
        "transform",
        `translate(${point.x} ${point.y}) rotate(${angle})`,
      );
    };
    place(reduced ? 1 : 0);
    if (reduced) return;
    const controls = animate(progress, 1, {
      duration: DRAW_SECONDS,
      ease: easeInOut,
      onUpdate: place,
    });
    return () => controls.stop();
  }, [path, progress, reduced]);

  return (
    <div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div className="relative min-w-[640px]">
          <Image
            src="/images/map.webp"
            alt=""
            width={VIEW_W}
            height={VIEW_H}
            className="block h-auto w-full"
          />
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <mask id={maskId}>
              <m.path d={route} fill="none" stroke="white" strokeWidth={18} pathLength={progress} />
            </mask>
            <path
              d={route}
              fill="none"
              className="stroke-decor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="2 11"
              mask={`url(#${maskId})`}
            />
            <path ref={setPath} d={route} fill="none" stroke="none" />
            {pins
              .filter((pin) => "pulse" in pin)
              .map((pin) => (
                <m.circle
                  key={pin.id}
                  cx={pin.x}
                  cy={pin.y}
                  r={16}
                  fill="none"
                  className="stroke-decor"
                  strokeWidth={2}
                  initial={false}
                  animate={
                    reduced
                      ? { scale: 1, opacity: 0.45 }
                      : { scale: [1, 2.1], opacity: [0.5, 0] }
                  }
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 2.2, repeat: Infinity, ease: "easeOut", delay: DRAW_SECONDS }
                  }
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ))}
            <g ref={planeRef}>
              <path
                d="M 14 0 L -11 -8 L -5 0 L -11 8 Z"
                fill="none"
                className="stroke-decor"
                strokeWidth={2.25}
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      </div>
      <ol className="sr-only">
        {journeyStops.map((stop) => (
          <li key={stop.id}>
            {stop.place}: {stop.detail}
          </li>
        ))}
      </ol>
    </div>
  );
}
