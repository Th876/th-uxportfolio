import Image from "next/image";
import avatar from "@/public/images/avatar.webp";

export function Avatar({
  size,
  priority = false,
}: {
  size: "hero" | "message";
  priority?: boolean;
}) {
  const dimension = size === "hero" ? 120 : 40;

  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex overflow-hidden rounded-full bg-bg ${
          size === "hero" ? "size-[120px] ring-4 ring-surface" : "size-10"
        }`}
      >
        <Image
          src={avatar}
          alt={size === "hero" ? "Tahaylia Higgins" : ""}
          width={avatar.width}
          height={avatar.height}
          priority={priority}
          sizes={`${dimension}px`}
          className="size-full object-cover object-top"
        />
      </span>
      <span
        className={`absolute rounded-full bg-online ring-2 ring-bg ${
          size === "hero" ? "bottom-0.5 right-0.5 size-3.5" : "bottom-0 right-0 size-2.5"
        }`}
        aria-hidden="true"
      />
    </span>
  );
}
