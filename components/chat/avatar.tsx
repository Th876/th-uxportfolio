import Image from "next/image";

export function Avatar({
  size,
  priority = false,
}: {
  size: "hero" | "message";
  priority?: boolean;
}) {
  const dimension = size === "hero" ? 72 : 40;

  return (
    <span className="relative inline-flex shrink-0">
      <Image
        src="/images/avatar.webp"
        alt={size === "hero" ? "Tahaylia Higgins" : ""}
        width={dimension}
        height={dimension}
        priority={priority}
        sizes={`${dimension}px`}
        className={
          size === "hero"
            ? "size-[72px] rounded-full object-cover"
            : "size-10 rounded-full object-cover"
        }
      />
      <span
        className={`absolute rounded-full bg-online ring-2 ring-bg ${
          size === "hero" ? "bottom-0.5 right-0.5 size-3.5" : "bottom-0 right-0 size-2.5"
        }`}
        aria-hidden="true"
      />
    </span>
  );
}
