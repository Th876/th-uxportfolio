"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { animate, m, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { journeyStops } from "@/content/journey";
import { journeyOutline } from "@/components/journey-outline";
import { easeInOut, easeOut } from "@/lib/motion";

const VIEW_W = 880;
const VIEW_H = 586;
const DRAW_SECONDS = 2.4;

const route =
  "M 277 402 C 241 309, 258 223, 294 172 C 430 69, 559 69, 688 258 C 602 413, 447 395, 342 230";

const mapStops = [
  { id: "jamaica", x: 277, y: 402, labelSide: "left" as const },
  { id: "illinois", x: 294, y: 172, labelSide: "left" as const },
  { id: "europe", x: 688, y: 258, labelSide: "above" as const },
  { id: "georgia", x: 342, y: 230, labelSide: "right" as const, pulse: true },
];

const stopAt = [0, 0.21, 0.62, 1];

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
      const ahead = path.getPointAtLength(Math.min(total, distance + 8));
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
        <div className="relative min-w-[560px]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="block h-auto w-full"
            aria-hidden="true"
          >
            <path d={journeyOutline} fill="currentColor" className="text-ink/40" />
            <mask id={maskId}>
              <m.path
                d={route}
                fill="none"
                stroke="white"
                strokeWidth={14}
                pathLength={progress}
              />
            </mask>
            <path
              d={route}
              fill="none"
              className="stroke-decor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeDasharray="1.4 8"
              mask={`url(#${maskId})`}
            />
            <path ref={setPath} d={route} fill="none" stroke="none" />
            {mapStops.map((stop, index) => (
              <StopDot
                key={stop.id}
                x={stop.x}
                y={stop.y}
                pulse={"pulse" in stop}
                progress={progress}
                at={stopAt[index]}
                reduced={reduced}
              />
            ))}
            <g ref={planeRef}>
              <path
                d="M 9 0 L -7 -5 L -3.5 0 L -7 5 Z"
                fill="none"
                className="stroke-decor"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </g>
          </svg>
          {mapStops.map((stop, index) => {
            const copy = journeyStops.find((item) => item.id === stop.id);
            if (!copy) return null;
            return (
              <StopLabel
                key={stop.id}
                place={copy.place}
                detail={copy.detail}
                x={stop.x}
                y={stop.y}
                side={stop.labelSide}
                progress={progress}
                at={stopAt[index]}
                reduced={reduced}
              />
            );
          })}
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

function StopDot({
  x,
  y,
  pulse,
  progress,
  at,
  reduced,
}: {
  x: number;
  y: number;
  pulse: boolean;
  progress: ReturnType<typeof useMotionValue<number>>;
  at: number;
  reduced: boolean;
}) {
  const [visible, setVisible] = useState(reduced || at === 0);
  useMotionValueEvent(progress, "change", (value) => {
    if (value >= at - 0.015) setVisible(true);
  });

  return (
    <g>
      {pulse ? (
        <m.circle
          cx={x}
          cy={y}
          r={8}
          fill="none"
          className="stroke-decor"
          strokeWidth={1.25}
          initial={false}
          animate={
            reduced || !visible
              ? { scale: 1, opacity: visible ? 0.35 : 0 }
              : { scale: [1, 2.15], opacity: [0.45, 0] }
          }
          transition={
            reduced || !visible
              ? { duration: 0 }
              : { duration: 2.2, repeat: Infinity, ease: "easeOut" }
          }
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ) : null}
      <m.circle
        cx={x}
        cy={y}
        r={pulse ? 5.5 : 4}
        className="fill-decor"
        initial={false}
        animate={visible ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: easeOut }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </g>
  );
}

function StopLabel({
  place,
  detail,
  x,
  y,
  side,
  progress,
  at,
  reduced,
}: {
  place: string;
  detail: string;
  x: number;
  y: number;
  side: "left" | "right" | "above" | "below";
  progress: ReturnType<typeof useMotionValue<number>>;
  at: number;
  reduced: boolean;
}) {
  const [visible, setVisible] = useState(reduced || at === 0);
  useMotionValueEvent(progress, "change", (value) => {
    if (value >= at - 0.015) setVisible(true);
  });
  const along = (x / VIEW_W) * 100;
  const down = (y / VIEW_H) * 100;

  return (
    <m.span
      aria-hidden="true"
      className={`absolute flex w-[8.75rem] flex-col leading-tight ${
        side === "left"
          ? "items-end text-right"
          : side === "right"
            ? "items-start text-left"
            : "items-center text-center"
      }`}
      style={
        side === "right"
          ? { left: `calc(${along}% + 10px)`, top: `calc(${down}% - 16px)` }
          : side === "left"
            ? { right: `calc(${100 - along}% + 10px)`, top: `calc(${down}% - 16px)` }
            : side === "above"
              ? { left: `calc(${along}% - 4.375rem)`, top: `calc(${down}% - 42px)` }
              : { left: `calc(${along}% - 4.375rem)`, top: `calc(${down}% + 12px)` }
      }
      initial={false}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: easeOut }}
    >
      <span className="text-[13px] font-medium text-ink">{place}</span>
      <span className="text-[12px] text-muted">{detail}</span>
    </m.span>
  );
}
