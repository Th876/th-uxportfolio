"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { easeOut } from "@/lib/motion";

let hasEntered = false;

export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() === true;
  const [fade] = useState(() => hasEntered && !reduced);

  useEffect(() => {
    hasEntered = true;
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="flex flex-1 flex-col"
        initial={fade ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: easeOut }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
