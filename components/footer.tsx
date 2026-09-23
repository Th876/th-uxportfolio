import { site } from "@/content/site";
import { CopyEmail } from "@/components/copy-email";
import { CurrentYear } from "@/components/current-year";

const footerLinkClass =
  "text-accent underline decoration-line underline-offset-4 motion-safe:transition-colors motion-safe:duration-150 hover:text-accent-strong";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto w-full max-w-content px-5 py-20 sm:px-6">
        <h2 className="max-w-[14ch] text-[36px] leading-[1.1] font-medium tracking-[-0.02em] md:text-[48px]">
          Let&apos;s build something people love.
        </h2>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={`mailto:${site.email}`} className={footerLinkClass}>
            {site.email}
          </a>
          <CopyEmail email={site.email} />
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={site.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            Resume
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <p className="mt-16 text-sm text-muted">
          Designed and built by {site.name} · <CurrentYear />
        </p>
      </div>
    </footer>
  );
}
