"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const label = node.querySelector("span");
    let current = "";
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let frame = 0;
    let running = false;

    const enabled = () => fine.matches && !reduce.matches;

    const stop = () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      node.dataset.on = "false";
      node.dataset.label = "false";
      current = "";
      if (label) label.textContent = "";
    };

    const tick = () => {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;
      node.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!enabled()) {
        stop();
        return;
      }
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const move = (event: MouseEvent) => {
      if (!enabled()) return;
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!running) {
        dotX = mouseX;
        dotY = mouseY;
        start();
      }
      node.dataset.on = "true";
    };

    const over = (event: MouseEvent) => {
      if (!enabled()) return;
      const next =
        (event.target as Element | null)?.closest?.("[data-cursor]")?.getAttribute("data-cursor") ?? "";
      if (next === current) return;
      current = next;
      if (label) label.textContent = next;
      node.dataset.label = next ? "true" : "false";
    };

    const hide = () => {
      node.dataset.on = "false";
    };

    start();
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", hide);
    fine.addEventListener("change", start);
    reduce.addEventListener("change", start);

    return () => {
      stop();
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", hide);
      fine.removeEventListener("change", start);
      reduce.removeEventListener("change", start);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-follow" data-on="false" data-label="false" aria-hidden="true">
      <div className="cursor-mark">
        <span />
      </div>
    </div>
  );
}
