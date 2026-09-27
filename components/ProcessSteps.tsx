import { Children, isValidElement, type ReactNode } from "react";
import { Pencil, LayoutGrid, Palette, MonitorSmartphone, Users, Code, Rocket, Layers, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StepIconName = "sketch" | "wireframe" | "palette" | "screen" | "research" | "build" | "launch" | "synthesis" | "test";

const iconMap: Record<StepIconName, LucideIcon> = {
  sketch: Pencil,
  wireframe: LayoutGrid,
  palette: Palette,
  screen: MonitorSmartphone,
  research: Users,
  build: Code,
  launch: Rocket,
  synthesis: Layers,
  test: ClipboardCheck,
};

interface StepProps {
  icon: StepIconName;
  label: string;
}

export function Step({ icon, label }: StepProps) {
  const Icon = iconMap[icon];
  return (
    <div className="flex flex-col items-center gap-2 text-neutral-400">
      <Icon
        size={40}
        strokeWidth={1.5}
        className={`text-[var(--mark)] ${icon === "wireframe" ? "-translate-x-3" : ""}`}
      />
      <span className="text-sm text-center">{label}</span>
    </div>
  );
}

// export function Step({ icon, label }: StepProps) {
//   const Icon = iconMap[icon];
//   return (
//     <div className="flex flex-col items-center gap-2 text-neutral-400">
//       <Icon size={40} strokeWidth={1.5} className="text-[var(--mark)]" />
//       <span className="text-sm">{label}</span>
//     </div>
//   );
// }

// export function Step({ icon, label }: StepProps) {
//   const Icon = iconMap[icon];
//   return (
//     <div className="flex flex-col items-center gap-2 text-ink">
//       <Icon size={40} strokeWidth={1.5} />
//       <span className="text-sm">{label}</span>
//     </div>
//   );
// }

interface ProcessStepsProps {
  caption?: string;
  children: ReactNode;
}

export function ProcessSteps({ children }: ProcessStepsProps) {
  const steps = Children.toArray(children).filter(isValidElement);

  return (
    <div className="mt-8 w-full max-w-case">
      <div className="flex items-center justify-between gap-3">
        {steps.map((step, i) => (
          <div key={i} className="flex min-w-0 flex-1 items-center">
            <div className="flex flex-1 justify-center">{step}</div>
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-ink/35" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProcessLoop({
  steps,
  loopLabel,
  pivotTitle,
  pivotText,
  caption,
}: {
  steps: string[];
  loopLabel: string;
  pivotTitle: string;
  pivotText: string;
  caption?: string;
}) {
  return (
    <div className="my-8">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3 rounded-[20px] bg-bg px-4 py-3 text-ink">
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-medium"
              style={{ backgroundColor: "var(--mark-bg)", color: "var(--mark)" }}
            >
              {i + 1}
            </span>
            <span className="text-[15px]">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex items-center gap-3 rounded-[20px] border border-dashed border-line px-4 py-3 text-sm text-muted">
        <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M13 8a5 5 0 1 1-1.5-3.5" strokeLinecap="round" />
          <path d="M13 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{loopLabel}</span>
      </div>

      <aside className="mt-3 rounded-[20px] border border-line bg-tint px-5 py-4 text-ink">
        <p className="font-medium">{pivotTitle}</p>
        <p className="mt-1 text-[15px]">{pivotText}</p>
      </aside>

      {caption ? <p className="mt-3 text-sm text-muted">{caption}</p> : null}
    </div>
  );
}
// import { Children, isValidElement, type ReactNode } from "react";
// import { Pencil, LayoutGrid, Palette, MonitorSmartphone, Users, Code, Rocket } from "lucide-react";
// import type { LucideIcon } from "lucide-react";

// type StepIconName = "sketch" | "wireframe" | "palette" | "screen" | "research" | "build" | "launch";

// const iconMap: Record<StepIconName, LucideIcon> = {
//   sketch: Pencil,
//   wireframe: LayoutGrid,
//   palette: Palette,
//   screen: MonitorSmartphone,
//   research: Users,
//   build: Code,
//   launch: Rocket,
// };

// interface StepProps {
//   icon: StepIconName;
//   label: string;
// }

// export function Step({ icon, label }: StepProps) {
//   const Icon = iconMap[icon];
//   return (
//     <div className="flex flex-col items-center gap-2 text-neutral-400">
//       <Icon
//         size={40}
//         strokeWidth={1.5}
//         className={`text-[var(--mark)] ${icon === "wireframe" ? "-translate-x-3" : ""}`}
//       />
//       <span className="text-sm">{label}</span>
//     </div>
//   );
// }

// // export function Step({ icon, label }: StepProps) {
// //   const Icon = iconMap[icon];
// //   return (
// //     <div className="flex flex-col items-center gap-2 text-neutral-400">
// //       <Icon size={40} strokeWidth={1.5} className="text-[var(--mark)]" />
// //       <span className="text-sm">{label}</span>
// //     </div>
// //   );
// // }

// // export function Step({ icon, label }: StepProps) {
// //   const Icon = iconMap[icon];
// //   return (
// //     <div className="flex flex-col items-center gap-2 text-ink">
// //       <Icon size={40} strokeWidth={1.5} />
// //       <span className="text-sm">{label}</span>
// //     </div>
// //   );
// // }

// interface ProcessStepsProps {
//   caption?: string;
//   children: ReactNode;
// }

// export function ProcessSteps({ children }: ProcessStepsProps) {
//   const steps = Children.toArray(children).filter(isValidElement);

//   return (
//     <div className="mt-8 w-full max-w-case">
//       <div className="flex items-center justify-between gap-3">
//         {steps.map((step, i) => (
//           <div key={i} className="flex min-w-0 flex-1 items-center">
//             <div className="flex flex-1 justify-center">{step}</div>
//             {i < steps.length - 1 ? (
//               <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-ink/35" />
//             ) : null}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function ProcessLoop({
//   steps,
//   loopLabel,
//   pivotTitle,
//   pivotText,
//   caption,
// }: {
//   steps: string[];
//   loopLabel: string;
//   pivotTitle: string;
//   pivotText: string;
//   caption?: string;
// }) {
//   return (
//     <div className="my-8">
//       <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//         {steps.map((step, i) => (
//           <li key={step} className="flex items-center gap-3 rounded-[20px] bg-bg px-4 py-3 text-ink">
//             <span
//               aria-hidden="true"
//               className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-medium"
//               style={{ backgroundColor: "var(--mark-bg)", color: "var(--mark)" }}
//             >
//               {i + 1}
//             </span>
//             <span className="text-[15px]">{step}</span>
//           </li>
//         ))}
//       </ol>

//       <div className="mt-3 flex items-center gap-3 rounded-[20px] border border-dashed border-line px-4 py-3 text-sm text-muted">
//         <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
//           <path d="M13 8a5 5 0 1 1-1.5-3.5" strokeLinecap="round" />
//           <path d="M13 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//         <span>{loopLabel}</span>
//       </div>

//       <aside className="mt-3 rounded-[20px] border border-line bg-tint px-5 py-4 text-ink">
//         <p className="font-medium">{pivotTitle}</p>
//         <p className="mt-1 text-[15px]">{pivotText}</p>
//       </aside>

//       {caption ? <p className="mt-3 text-sm text-muted">{caption}</p> : null}
//     </div>
//   );
// }