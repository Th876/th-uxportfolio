"use client";

import { ArrowUp, Send } from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { FormEvent, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnswerContent, FallbackContent } from "@/components/chat/answer-content";
import { Avatar } from "@/components/chat/avatar";
import {
  chipRows,
  getChatEntry,
  introMessage,
  type ChatEntry,
} from "@/content/chat";
import { site } from "@/content/site";
import { matchChat } from "@/lib/match-chat";
import { easeOut } from "@/lib/motion";

type VisitorMessage = { id: string; kind: "visitor"; text: string };
type MineMessage = { id: string; kind: "mine"; entryId: string } | { id: string; kind: "fallback" };
type Message = VisitorMessage | MineMessage;

const chipClassName =
  "inline-flex items-center rounded-full border bg-surface text-ink shadow-soft hover:border-accent hover:bg-tint motion-safe:transition-[background-color,border-color,transform] motion-safe:duration-150 motion-safe:active:scale-[0.97]";

export function ChatHero() {
  const reduced = useReducedMotion() === true;

  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [usedFollowUps, setUsedFollowUps] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const inputId = useId();
  const timer = useRef<number | null>(null);
  const pendingMine = useRef<MineMessage | null>(null);
  const counter = useRef(0);
  const latestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    latestRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "nearest",
    });
  }, [messages, typing, started, reduced]);

  function nextId() {
    counter.current += 1;
    return `msg-${counter.current}`;
  }

  function scrollToWork() {
    document.getElementById("work")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  function commitPending() {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    const pending = pendingMine.current;
    if (!pending) return;
    pendingMine.current = null;
    setTyping(false);
    setMessages((current) => [...current, pending]);
  }

  function revealMine(message: MineMessage) {
    if (reduced) {
      setTyping(false);
      setMessages((current) => [...current, message]);
      return;
    }

    pendingMine.current = message;
    setTyping(true);
    timer.current = window.setTimeout(() => {
      pendingMine.current = null;
      timer.current = null;
      setTyping(false);
      setMessages((current) => [...current, message]);
    }, 600);
  }

  function ask(entry: ChatEntry, visitorText: string) {
    commitPending();
    setStarted(true);
    setActiveId(entry.id);
    if (entry.followUpOnly) {
      setUsedFollowUps((current) => (current.includes(entry.id) ? current : [...current, entry.id]));
    }
    setMessages((current) => [...current, { id: nextId(), kind: "visitor", text: visitorText }]);
    revealMine({ id: nextId(), kind: "mine", entryId: entry.id });
  }

  function askFallback(visitorText: string) {
    commitPending();
    setStarted(true);
    setActiveId(null);
    setMessages((current) => [...current, { id: nextId(), kind: "visitor", text: visitorText }]);
    revealMine({ id: nextId(), kind: "fallback" });
  }

  function onChip(entry: ChatEntry) {
    if (entry.action === "scroll-work") {
      setActiveId(entry.id);
      scrollToWork();
      return;
    }
    if (entry.action) {
      setActiveId(entry.id);
      return;
    }
    if (!entry.question) return;
    ask(entry, entry.question);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setDraft("");
    const match = matchChat(value);
    if (!match) {
      askFallback(value);
      return;
    }
    if (match.action === "scroll-work") {
      setActiveId(match.id);
      scrollToWork();
      return;
    }
    if (match.action) return;
    ask(match, value);
  }

  return (
    <LazyMotion features={domAnimation}>
      <section
        className={`relative mx-auto flex w-full max-w-content flex-col px-5 sm:px-6 ${
          started
            ? "pt-8 pb-16"
            : "min-h-[calc(100svh-7.5rem)] justify-center py-10"
        }`}
        aria-label="Ask Tahaylia"
      >
        <Send
          aria-hidden="true"
          strokeWidth={1.5}
          className="pointer-events-none absolute top-2 right-5 size-7 text-ink/45 sm:right-6"
        />

        {started ? (
          <div className="mx-auto flex w-full max-w-[680px] flex-col gap-4">
            <div role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
              <MineBubble appear>
                <h1 className="text-[1em] leading-[1.6] font-normal tracking-normal">{introMessage}</h1>
              </MineBubble>
              <div className="mt-4 flex flex-col gap-4">
                {messages.map((message, index) => {
                  const isLast = index === messages.length - 1 && !typing;
                  return message.kind === "visitor" ? (
                    <VisitorBubble key={message.id} text={message.text} messageRef={isLast ? latestRef : undefined} />
                  ) : (
                    <div key={message.id} ref={isLast ? latestRef : undefined} className="flex flex-col gap-2">
                      <MineBubble appear>
                        {message.kind === "fallback" ? (
                          <FallbackContent />
                        ) : (
                          <AnswerContent entryId={message.entryId} onScrollToWork={scrollToWork} />
                        )}
                      </MineBubble>
                      {message.kind === "mine" ? (
                        <FollowUps
                          entryId={message.entryId}
                          usedFollowUps={usedFollowUps}
                          activeId={activeId}
                          onChip={onChip}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            {typing ? (
              <div ref={latestRef}>
                <TypingBubble />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center">
            <Rise index={0} reduced={reduced}>
              <Avatar size="hero" priority />
            </Rise>
            <Rise index={1} reduced={reduced} className="mt-6">
              <h1 className="max-w-[14em] text-center text-[36px] leading-[1.08] font-medium tracking-[-0.02em] text-balance sm:text-[40px] md:text-[60px]">
                I&apos;m Tahaylia, a product designer in Atlanta. I research, design, and build for{" "}
                <span className="relative inline-block px-1 whitespace-nowrap">
                  <m.span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left bg-tint"
                    initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.48, ease: easeOut }}
                  />
                  <span className="relative font-serif text-[1.05em] font-normal italic">real people</span>
                </span>
                .
              </h1>
            </Rise>
          </div>
        )}

        <div className={`mx-auto flex w-full max-w-[760px] flex-col items-center ${started ? "mt-8" : "mt-8"}`}>
          <Rise index={2} reduced={reduced || started} className="w-full">
            <div className="flex flex-col items-center gap-2">
              {chipRows.map((row) => (
                <ul key={row.join()} className="flex flex-wrap justify-center gap-2">
                  {row.map((id) => (
                    <li key={id}>
                      <Chip
                        entry={getChatEntry(id)}
                        active={activeId === id}
                        onSelect={onChip}
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </Rise>

          <Rise index={3} reduced={reduced || started} className="mt-5 w-full max-w-[560px]">
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-1.5 pl-4 shadow-soft focus-within:border-accent"
            >
              <label htmlFor={inputId} className="sr-only">
                Ask me anything
              </label>
              <input
                id={inputId}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setDraft("");
                    event.currentTarget.blur();
                  }
                }}
                placeholder="ask me anything…"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-surface hover:bg-accent-strong motion-safe:transition-[background-color,transform] motion-safe:duration-150 motion-safe:active:scale-[0.97]"
              >
                <ArrowUp aria-hidden="true" strokeWidth={1.5} className="size-5" />
              </button>
            </form>
            <p className="mt-3 text-center text-sm text-muted">
              Pre-written answers from me. For anything else, email{" "}
              <a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-accent">
                {site.email}
              </a>
              .
            </p>
          </Rise>
        </div>
      </section>
    </LazyMotion>
  );
}

function Rise({
  index,
  reduced,
  className,
  children,
}: {
  index: number;
  reduced: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.08, ease: easeOut }}
    >
      {children}
    </m.div>
  );
}

function MineBubble({ children, appear = false }: { children: ReactNode; appear?: boolean }) {
  const reduced = useReducedMotion() === true;
  const bubble = (
    <div className="flex scroll-mt-28 items-start gap-3">
      <Avatar size="message" />
      <div className="max-w-[min(100%,36rem)] rounded-[20px] border border-line bg-surface px-4 py-3 text-left shadow-soft">
        {children}
      </div>
    </div>
  );

  if (!appear) return bubble;

  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: easeOut }}
    >
      {bubble}
    </m.div>
  );
}

function VisitorBubble({
  text,
  messageRef,
}: {
  text: string;
  messageRef?: React.Ref<HTMLDivElement>;
}) {
  const reduced = useReducedMotion() === true;

  return (
    <m.div
      ref={messageRef}
      className="ml-auto max-w-[min(100%,32rem)] scroll-mt-28 rounded-[20px] bg-ink px-4 py-3 text-left text-surface"
      initial={reduced ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduced ? 0 : 0.2, ease: easeOut }}
    >
      {text}
    </m.div>
  );
}

function TypingBubble() {
  return (
    <div aria-hidden="true">
      <MineBubble>
        <span className="flex h-6 items-center gap-1.5">
          <span className="typing-dot size-1.5 rounded-full bg-muted" />
          <span className="typing-dot size-1.5 rounded-full bg-muted" />
          <span className="typing-dot size-1.5 rounded-full bg-muted" />
        </span>
      </MineBubble>
    </div>
  );
}

function FollowUps({
  entryId,
  usedFollowUps,
  activeId,
  onChip,
}: {
  entryId: string;
  usedFollowUps: string[];
  activeId: string | null;
  onChip: (entry: ChatEntry) => void;
}) {
  const entry = getChatEntry(entryId);
  const followUps = (entry.followUps ?? [])
    .filter((id) => !usedFollowUps.includes(id))
    .map((id) => getChatEntry(id));

  if (followUps.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2 pl-[52px]">
      {followUps.map((followUp) => (
        <li key={followUp.id}>
          <Chip entry={followUp} active={activeId === followUp.id} onSelect={onChip} small />
        </li>
      ))}
    </ul>
  );
}

function Chip({
  entry,
  active,
  onSelect,
  small = false,
}: {
  entry: ChatEntry;
  active: boolean;
  onSelect: (entry: ChatEntry) => void;
  small?: boolean;
}) {
  const className = `${chipClassName} ${small ? "px-3 py-1 text-[13px]" : "px-3.5 py-2 text-[15px]"} ${
    active ? "border-accent font-medium" : "border-line"
  }`;

  if (entry.action === "resume" || entry.action === "linkedin") {
    const href = entry.action === "resume" ? site.resumePath : site.linkedin;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => onSelect(entry)}
      >
        {entry.chipLabel}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-pressed={active}
      onClick={() => onSelect(entry)}
    >
      {entry.chipLabel}
    </button>
  );
}
