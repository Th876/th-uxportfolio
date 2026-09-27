import Image from "next/image";
import { AboutPlane } from "@/components/about-plane";
import { aboutParagraphs, littleThings } from "@/content/about";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 relative mx-auto w-full max-w-content overflow-hidden px-5 py-16 sm:px-6 md:py-24">
      <AboutPlane />
      <div className="relative z-10 grid items-start gap-8 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-12">
        <div className="relative max-w-sm">
          <Image
            src="/images/about_me.jpeg"
            alt="Tahaylia Higgins in a square in Bratislava"
            width={1400}
            height={1050}
            sizes="380px"
            className="aspect-[4/3] w-full rounded-[24px] border border-line bg-surface object-cover shadow-soft"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Image src="/images/pin.png" alt="" width={355} height={445} className="h-14 w-auto"/>
            <span
              className="font-hand text-[22px] leading-none text-ink"
              style={{ textShadow: "0 0 8px rgb(251 246 241), 0 1px 0 rgb(251 246 241)" }}
            >
              Bratislava, Slovakia
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-[36px] leading-[1.05] font-medium tracking-[-0.02em] md:text-[56px]">
            About
          </h2>
          <div className="mt-6 flex max-w-case flex-col gap-4">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <h3 className="relative z-10 mt-16 text-[28px] leading-[1.15] font-medium tracking-[-0.02em] md:mt-24 md:text-[40px]">
        Little things about me
      </h3>
      <ul className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
        {littleThings.map((item) => (
          <li key={item.title} className="rounded-[22px] border border-line bg-surface p-5 shadow-soft">
            <Image
              src={item.src}
              alt={item.alt}
              width={320}
              height={240}
              sizes="120px"
              className="h-24 w-auto object-contain"
            />
            <h4 className="mt-4 text-[18px] font-medium tracking-[-0.02em]">{item.title}</h4>
            <p className="mt-2 text-muted">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
