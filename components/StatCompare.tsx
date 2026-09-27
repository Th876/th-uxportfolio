interface StatCompareProps {
    before: string;
    after: string;
    label: string;
  }
  
  export function StatCompare({ before, after, label }: StatCompareProps) {
    return (
      <div className="my-6 flex flex-col items-start gap-2 py-4 text-left">
        <div className="flex items-center gap-4 text-5xl font-bold sm:text-6xl" style={{ color: "var(--mark)" }}>
          <span>{before}</span>
          <span aria-hidden="true">→</span>
          <span>{after}</span>
        </div>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    );
  }