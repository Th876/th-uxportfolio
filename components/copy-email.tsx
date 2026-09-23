"use client";

import { useEffect, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-live="polite"
      aria-label={copied ? "Copied" : "Copy email address"}
      className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink shadow-soft motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-[0.97]"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
