import { fallbackMessage, getChatEntry, type ChatCta, type TextRun } from "@/content/chat";
import { JourneyMap } from "@/components/journey-map";

function Highlight({ children }: { children: string }) {
  return (
    <span className="relative inline px-0.5">
      <span
        className="absolute inset-x-0 bottom-[0.08em] top-[0.42em] bg-tint"
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </span>
  );
}

function Runs({ runs }: { runs: TextRun[] }) {
  return runs.map((run, index) => {
    if (typeof run === "string") return <span key={index}>{run}</span>;
    if ("bold" in run) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {run.bold}
        </strong>
      );
    }
    if ("highlight" in run) return <Highlight key={index}>{run.highlight}</Highlight>;
    return (
      <a key={index} href={run.link.href} className="underline underline-offset-2">
        {run.link.label}
      </a>
    );
  });
}

function CtaLink({ cta, onScrollToWork }: { cta: ChatCta; onScrollToWork: () => void }) {
  const className =
    "mt-1 inline-flex font-medium text-accent underline-offset-4 hover:text-accent-strong hover:underline";

  if (cta.scrollTo === "work") {
    return (
      <button type="button" onClick={onScrollToWork} className={className}>
        {cta.label}
      </button>
    );
  }

  return (
    <a
      href={cta.href}
      className={className}
      {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {cta.label}
      {cta.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function AnswerContent({
  entryId,
  onScrollToWork,
}: {
  entryId: string;
  onScrollToWork: () => void;
}) {
  const entry = getChatEntry(entryId);

  return (
    <div className="space-y-3">
      {entry.confirm ? <p className="text-sm text-muted">{entry.confirm}</p> : null}
      {entry.component === "journey-map" ? <JourneyMap /> : null}
      {entry.answer?.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index}>
              <Runs runs={block.runs} />
            </p>
          );
        }

        return (
          <ol key={index} className="list-decimal space-y-3 pl-5">
            {block.items.map((item) => (
              <li key={item.lead} className="pl-1">
                <strong className="font-semibold text-ink">{item.lead}</strong>
                <Runs runs={item.runs} />
              </li>
            ))}
          </ol>
        );
      })}
      {entry.cta ? <CtaLink cta={entry.cta} onScrollToWork={onScrollToWork} /> : null}
    </div>
  );
}

export function FallbackContent() {
  return (
    <p>
      {fallbackMessage.before}
      <a href={`mailto:${fallbackMessage.email}`} className="font-medium underline underline-offset-2">
        {fallbackMessage.email}
      </a>
      {fallbackMessage.after}
    </p>
  );
}
