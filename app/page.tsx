import { ChatHero } from "@/components/chat/chat-hero";

export default function HomePage() {
  return (
    <main id="content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <ChatHero />
      <section className="mx-auto w-full max-w-content px-5 pt-16 pb-24 sm:px-6">
        <h2
          id="work"
          className="scroll-mt-28 text-[28px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[40px]"
        >
          Selected work
        </h2>
      </section>
    </main>
  );
}
