import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

const navLinkClass =
  "rounded-full px-2.5 py-1.5 text-[14px] text-ink motion-safe:transition-colors motion-safe:duration-150 hover:bg-tint sm:px-3";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg">
      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-3 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="inline-flex shrink-0">
          <Image
            src="/images/logo.webp"
            alt={site.name}
            width={286}
            height={192}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>
        <nav
          aria-label="Primary"
          className="rounded-full border border-line bg-surface px-1.5 py-1 shadow-soft"
        >
          <ul className="flex flex-wrap items-center">
            <li>
              <Link href="/about" className={navLinkClass}>
                About
              </Link>
            </li>
            <li>
              <Link href="/#work" className={navLinkClass}>
                Work
              </Link>
            </li>
            <li>
              <a
                href={site.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClass}
              >
                Resume
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={navLinkClass}
              >
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
