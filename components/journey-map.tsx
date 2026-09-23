import { journeyStops } from "@/content/journey";

export function JourneyMap() {
  return (
    <ol className="space-y-2">
      {journeyStops.map((stop, index) => (
        <li key={stop.id} className="flex gap-3">
          <span className="mt-0.5 font-medium text-muted tabular-nums" aria-hidden="true">
            {index + 1}
          </span>
          <span>
            <span className="font-medium text-ink">{stop.place}</span>
            <span className="text-muted"> — {stop.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
