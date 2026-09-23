"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, isTheme, persistTheme, type Theme } from "@/lib/theme";

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  const current = document.documentElement.getAttribute("data-theme");
  return isTheme(current) ? current : DEFAULT_THEME;
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 text-sm shadow-soft">
      <span className="text-muted">Theme:</span>
      <div role="group" aria-label="Color theme" className="flex items-center gap-1">
        <ThemeChoice current={theme} value="green" onChoose={persistTheme}>
          Green
        </ThemeChoice>
        <span aria-hidden="true" className="text-muted">
          /
        </span>
        <ThemeChoice current={theme} value="coral" onChoose={persistTheme}>
          Coral
        </ThemeChoice>
      </div>
    </div>
  );
}

function ThemeChoice({
  current,
  value,
  onChoose,
  children,
}: {
  current: Theme;
  value: Theme;
  onChoose: (theme: Theme) => void;
  children: string;
}) {
  const selected = current === value;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onChoose(value)}
      className={`rounded-full px-1.5 py-0.5 motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-[0.97] ${
        selected
          ? "font-medium text-ink underline decoration-accent decoration-2 underline-offset-4"
          : "text-muted"
      }`}
    >
      {children}
    </button>
  );
}
