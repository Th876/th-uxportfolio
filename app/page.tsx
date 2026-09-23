export default function HomePage() {
  return (
    <main
      id="content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-content flex-1 flex-col px-5 py-16 outline-none sm:px-6"
    >
      <h1 className="max-w-[12ch] text-[36px] leading-[1.05] font-medium tracking-[-0.02em] md:text-[60px]">
        Tahaylia Higgins
      </h1>
      <section id="work" className="scroll-mt-28 pt-24">
        <h2 className="text-[28px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[40px]">
          Selected work
        </h2>
      </section>
    </main>
  );
}
