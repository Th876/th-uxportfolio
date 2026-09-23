"use client";

import { useLayoutEffect } from "react";
import { readClientTheme } from "@/lib/theme";

export function ThemeSync() {
  useLayoutEffect(() => {
    const theme = readClientTheme();
    document.documentElement.setAttribute("data-theme", theme);

    const query = new URLSearchParams(window.location.search).get("theme");
    if (query === "green" || query === "coral") {
      try {
        sessionStorage.setItem("theme", query);
      } catch {
        // Ignore storage failures.
      }
    }
  }, []);

  return null;
}
