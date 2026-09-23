import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main
      id="content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center px-5 py-24 outline-none sm:px-6"
    >
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-3 max-w-[12ch] text-[36px] leading-[1.05] font-medium tracking-[-0.02em] md:text-[56px]">
        This page isn&apos;t here.
      </h1>
      <p className="mt-4 max-w-[36rem] text-muted">
        The link might be old, or the page may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 w-fit text-accent underline decoration-line underline-offset-4 hover:text-accent-strong"
      >
        Back to home
      </Link>
    </main>
  );
}
