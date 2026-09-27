"use client";

import { useEffect, useState } from "react";

export function DelayedLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return <div className="flex-1" />;

  return (
    <div className="grid flex-1 place-items-center py-24" role="status">
      <p className="sr-only">Loading</p>
      <svg viewBox="0 0 80 80" className="size-16 text-ink" aria-hidden="true">
        <path
          d="M40 14a26 26 0 1 1-.01 0"
          pathLength="100"
          className="loader-loop"
        />
        <g className="loader-orbit">
          <path
            d="M33 11.2L49 14L33 16.8L37.2 14Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M37.2 14L44 14"
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
