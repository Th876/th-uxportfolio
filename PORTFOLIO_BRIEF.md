# Portfolio Rebuild Brief — Tahaylia Higgins

---

## 1. Goal

Completely rebuild my UX portfolio as a fast, modern, conversational site. The **old site in this folder** (plain HTML/CSS/JS on a free StyleShout template) is a **source of content and images only**.

- **Do NOT** reuse the template's HTML structure, CSS, JS, or plugins. The new site is written from scratch, so no template credit is needed.
- **Do** reuse text, case study copy and project images from the old site.
- **Remove the Craigslist project completely** (page, card, images, links).
- **Leave a ready-made space for the Temple case study** (content coming later).
- **Terminology:** Temple is a **wellness food guide app**. Never call it a "grocery app" anywhere in copy, alt text, metadata, or code comments.

**Positioning (one identity only):** a product designer who researches, designs, and builds. Never show a list of job titles or a role picker.

---

## 2. Tech stack

| Need | Choice |
|---|---|
| Framework | **Next.js (App Router) + TypeScript**, statically generated where possible |
| Styling | **Tailwind CSS** with the design tokens in §3 |
| Animation | **Motion** (`motion` / framer-motion). Use `LazyMotion` + `domAnimation` to keep the bundle small |
| Case studies | **MDX** files rendered through one shared layout |
| Images | `next/image` everywhere (AVIF/WebP, correct `sizes`, lazy by default, `priority` only for above-the-fold) |
| Fonts | `next/font` (self-hosted, no layout shift) |
| Hosting | Vercel (already in use) |
| Analytics (optional, Phase 8) | Vercel Web Analytics |

**Do not add:** smooth-scroll libraries (Lenis, Locomotive), jQuery, GSAP, UI kits, or any live AI/chatbot API.

---

## 3. Design system

### Colors: two switchable themes

I haven't picked a final palette yet, so build **two themes** and let me compare them on the real site. Define every color as a **CSS variable** and map the Tailwind tokens to those variables (e.g. `accent: 'rgb(var(--accent) / <alpha-value>)'`). Components only ever use the token names, never raw hex values, so switching the theme changes the whole site.

| Token | Use | **Green** (`data-theme="green"`) | **Coral** (`data-theme="coral"`) |
|---|---|---|---|
| `bg` | Page background | `#FAFAF7` | `#F6F1E7` (warm cream) |
| `surface` | Cards, chat bubbles, input | `#FFFFFF` | `#FFFFFF` |
| `ink` | Headlines, body text, visitor chat bubble | `#101714` | `#1C1A17` (warm near-black, **not navy**) |
| `muted` | Captions, meta, footer | `#5B665F` | `#6B645A` |
| `line` | Borders, dividers, map outlines | `#E3E6E1` | `#E6DED0` |
| `accent` | Links, active states, send button, focus rings | `#2F6B4F` | `#C4502F` (coral, darkened so white text and links pass AA) |
| `accent-strong` | Hover/pressed on accent | `#244F3B` | `#A8432A` |
| `tint` | Highlight band, chip hover, subtle fills | `#E4EFE8` | `#F9DDD3` |
| `decor` | Map path, homepage corner glow, Georgia pulse ring (decoration only, never text) | `#2F6B4F` | `#2BA8A4` (turquoise) |

**Switching:**
- Default theme is set in one place: `const DEFAULT_THEME = 'green'` in `lib/theme.ts`, applied as `data-theme` on `<html>`.
- For comparing: adding `?theme=coral` or `?theme=green` to any URL overrides the default for that visit (keep it for the session while navigating).
- In development and Vercel preview deployments only (not production), show a small floating toggle in the bottom-left corner: "Theme: Green / Coral".
- Once I choose, I'll change `DEFAULT_THEME` and we can delete the other theme.

Rules for both themes: one accent color per theme. **No navy anywhere.** No paper textures, no gradient blobs, no brush-stroke effects. At most one very faint `decor`-colored radial glow in a corner of the homepage. All text meets WCAG AA contrast in both themes (verify with a contrast checker).

### Typography
- **UI/body:** Geist (fallback: General Sans / Inter). Body 17–18px, line-height 1.6.
- **Accent words only:** Instrument Serif, italic (e.g. *real people*). Max one or two emphasized words per heading.
- **No handwritten fonts.**
- Headline scale: homepage hero ~56–64px desktop / 36–40px mobile, tight letter-spacing (-0.02em).

### Shape and spacing
- Chips and input: fully rounded. Cards: 20–24px radius. Chat bubbles: 20px radius.
- Borders are 1px `line`. Shadows are very soft (e.g. `0 1px 2px rgba(16,23,20,.04), 0 8px 24px rgba(16,23,20,.06)`).
- Generous white space. Max content width ~1120px; case study text column ~680px.

### Components look
- **Chips:** white, 1px `line` border, `ink` text. Hover: `accent` border + `tint` background. Focus: 2px `accent` ring. Link chips (resume, linkedin) look the same with a small ↗.
- **Send button:** the only solid element: round, `accent` fill, white arrow.
- **Visitor chat bubble:** `ink` background, white text, right-aligned. **My bubble:** white `surface`, 1px border, left-aligned with my avatar.
- **Avatar:** round photo with a small green online dot (no "online" label).
- **Icons:** thin line icons (e.g. Lucide), 1.5px stroke. The paper-plane motif is always a thin line icon.

---

## 4. Site map

```
/                      Homepage: chat hero + Selected Work + footer
/work/temple           Temple case study (placeholder, see §7)
/work/nooon            nooon case study
/work/fundflow         FundFlow case study
/work/xpensepal        XpensePal case study
/about                 About page
/resume.pdf            Resume PDF in /public (nav "Resume" opens it in a new tab)
404                    Custom not-found page in the same style
```

Nav (top right, rounded pill container with light border): **About · Work · Resume · LinkedIn**. Logo top left: "Tahaylia Higgins" in the UI font. Nav "Work" scrolls to Selected Work on the homepage (or navigates there from other pages).

---

## 5. Homepage

### 5a. Chat hero (first screen)

Initial state (no conversation yet):
- Avatar with green dot, centered above the headline.
- Headline:
  **"I'm Tahaylia, a product designer in Atlanta. I research, design, and build for *real people*."**
  "real people" is in Instrument Serif italic with a `tint` highlight band behind it.
- Chips (two rows, centered):
  `see my work ↓` · `what's your story?` · `how do you work?` · `what are you building now?` · `availability?` · `resume ↗` · `linkedin ↗`
- Input bar: placeholder "ask me anything…", round `accent` send button.
- Small line under the input in `muted`: "Pre-written answers from me. For anything else, email tayhiggins14@gmail.com."
- A small thin-line paper plane icon in the top-right area of the hero.

Once a question is asked, the headline collapses into my first chat bubble ("I'm Tahaylia, a product designer in Atlanta. I research, design, and build for real people.") and the conversation grows above the chips. Chips and input stay pinned below the latest message. The chip that was just used gets an `accent` border (active state).

### 5b. Chat content (all answers pre-written)

Store every answer in **one editable file**: `content/chat.ts`. Each entry: `id`, `chipLabel`, `question` (shown in the visitor bubble), `answer` (rich text: allow bold, links, and a highlight), optional `component` (e.g. the map), optional `cta` (link or scroll target), optional `followUps` (ids of answers to offer as extra chips right under this answer), and `keywords` (for the free-text matcher).

**Follow-up chips:** when an answer has `followUps`, show those chips directly under that answer bubble (same chip style, slightly smaller). Once a follow-up is used, it disappears from under that answer. Follow-ups are not in the main chip rows.

**Lists in answers:** answers can contain a short numbered list. Render it with comfortable spacing inside the bubble, with the bold lead-in of each item in `ink` and the rest in regular weight.

Draft answers (I will edit these; keep them short):

- **what's your story?** → Question: "What's your story?"
  Component: **Journey map** (see §5c).
  Text under map: "I was born in Jamaica, moved to the US, studied abroad in Spain and Germany, and now design from Atlanta. Moving between places taught me to pay attention to how people actually live. That's what I bring to design."
- **how do you work?** → Question: "How do you work?"
  Answer:
  "Three habits show up in every project:
  1. **Start with the real problem.** At nooon, stakeholder interviews surfaced 3+ navigation bottlenecks before I opened Figma.
  2. **Design it, then build it.** I prototype in Figma and write the code myself, so nothing gets lost in a handoff.
  3. **Ship small, then listen.** With Temple, I release to users in waves and track what they actually do, so each version is shaped by <Highlight>real behavior, not guesses</Highlight>."
  CTA: "See it in my work ↓" (scrolls to Selected Work).
  Keywords: process, work, approach, method, figma, code, build, research, handoff.
- **what are you building now?** → Question: "What are you building now?"
  Answer: "**Temple**, a wellness food guide app that helps people shop for their health goals, like managing blood sugar, blood pressure, or cholesterol. I'm the designer, researcher, and developer: I designed it, built it, and I'm opening it to early users in waves so real feedback shapes every release."
  CTA: "Visit Temple ↗" → https://templeguide.co (new tab).
  Follow-up chips: `what did you cut on purpose?`
  Keywords: temple, building, project, app, food, health, now, current.
- **what did you cut on purpose?** (follow-up only, not in the main chips) → Question: "What did you cut on purpose?"
  Answer: "Kosher and Halal filters. Ingredient data can't reliably verify either one, and <Highlight>a filter that's wrong breaks trust faster than a missing one</Highlight>. I also removed a Nut-free option that duplicated the existing peanut and tree nut allergen settings. Fewer options, more honest ones."
  CTA: "See how I think in my work ↓" (scrolls to Selected Work).
  Keywords: cut, remove, removed, decision, tradeoff, trade-off, filter.
- **availability?** → `[CONFIRM WITH TAHAYLIA]` placeholder: "Open to full-time product and UX design roles: Atlanta, hybrid, or remote. Available now." CTA: "Email me ↗" (mailto).
- **see my work ↓** → no bubble; smooth-scrolls to Selected Work.
- **resume ↗** → opens `/resume.pdf` in a new tab.
- **linkedin ↗** → opens https://www.linkedin.com/in/tahayliahiggins/ in a new tab. (Use this same URL for the nav "LinkedIn" link and the footer. Store it once in `content/site.ts` along with the email and resume path.)

**Free-text input:** no AI. Match the typed text against each answer's `keywords` (simple case-insensitive includes, e.g. story/jamaica/background → story; process/work/figma/code → how; temple/building/project → building; available/hire/start/remote → availability; work/portfolio/case → scroll to work). If nothing matches, reply: "Good question! I'd rather answer that one myself. Email me at tayhiggins14@gmail.com." Empty submissions do nothing.

### 5c. Journey map (inside the story answer)

- Inline **SVG**, minimal line illustration: light `line`-colored outlines of the Caribbean, the US, and Western Europe on white. No fills, no terrain, no watercolor, no pins.
- Stops as small `decor`-colored dots with small `ink`/`muted` labels in the UI font:
  1. **Jamaica**: where I started
  2. **Illinois, USA**: my first US home
  3. **Spain & Germany**: studied abroad
  4. **Georgia, USA**: designing & building now (slightly larger dot with a soft pulse ring)
- A dotted `decor`-colored flight path connects the stops in order, with a small line-icon plane traveling along it.
- Must scale responsively. On narrow screens, the map can scroll horizontally inside the bubble or switch to a simple vertical list of the four stops.

### 5d. Selected Work (below the chat)

Heading: "Selected work". Subheading in `muted`: "Real projects, real people, and what I learned from them."

Three large cards, stacked vertically, full content width. Each card: device mockup image on one side, text on the other (alternate sides), and a small meta line with a location-style pin icon describing **who the users were**.

Data lives in `content/projects.ts`.

| Order | Project | Label | One-liner | Users pin | Tags | Link |
|---|---|---|---|---|---|---|
| 1 | **Temple** | Case study coming soon | A wellness food guide app I designed, built, and launched to real users. | Health-focused shoppers · USA | Product Design, Research, Built it | `/work/temple` (placeholder page) |
| 2 | **nooon** | Internship | Redesigned and rebranded a B2B platform connecting hotels and influencers, then built it in WordPress. | Hotels & influencers · Finland | UX Design, Branding, UX Copy | `/work/nooon` |
| 3 | **FundFlow** | Team project | A loan management dashboard for small business owners, designed with a 4-person UX team. | Small business owners · USA | Research, B2B SaaS | `/work/fundflow` |

Below: a smaller "More work" row with one compact card: **XpensePal**, "Personal finance app for Gen Y & Z" → `/work/xpensepal`.

Card hover (desktop): card lifts 4px, image scales 1.02, "View case study →" arrow slides 4px right.

### 5e. Footer (all pages)

Headline: "Let's build something people love." Email as visible text (tayhiggins14@gmail.com, click to open mail, plus a small copy-to-clipboard button showing "Copied" for 2s), LinkedIn, Resume. Bottom line: "Designed and built by Tahaylia Higgins · {current year}". No template credits anywhere.

**The year must be dynamic, never hard-coded.** Because the pages are statically generated, a year computed on the server would freeze at build time. Render it in a tiny client component (`<CurrentYear />`) that outputs `new Date().getFullYear()`, with a build-time value as the initial render and `suppressHydrationWarning` on the element, so it updates on its own on January 1 without a redeploy. Use this same component anywhere else a year appears (e.g. the hero footnote).

---

## 6. Case study template

One layout component (`app/work/[slug]/page.tsx`) that renders MDX from `content/case-studies/<slug>.mdx`. Frontmatter:

```yaml
title: "Helping hotels find the right influencers."
project: "nooon"
subtitle: "UX Design Internship · Remote (Helsinki, Finland)"
status: "Shipped"            # or "In progress" / "Concept"
timeline: "3 months · 2025"
role: "UX Designer + WordPress build"
tools: ["Figma", "WordPress", "Jira"]
tldr:
  background: "..."
  problem: "..."
  approach: "..."
  outcome: "..."
stats:
  - { value: "3+", label: "Navigation bottlenecks resolved" }
  - { value: "Full", label: "Rebrand: logo, type, color" }
  - { value: "1", label: "Responsive site launched" }
next: "fundflow"
comingSoon: false
```

### Page structure
1. "← Back to work" link.
2. Small meta label, big title, subtitle, pill tags (status, timeline, role, tools).
3. Hero image.
4. **TL;DR block**: Background / Problem / Approach / Outcome, one line each.
5. **Stats row**: three large numbers with captions.
6. MDX body sections, each an `h2` with an id: **Background, Problem, Research, Decisions, Design, Outcome, Learned** (sections can be omitted per project; the side nav builds itself from the `h2`s present).
7. **Next project** card at the bottom.
8. Footer.

### MDX components available to case studies
- `<Highlight>key phrase</Highlight>`: the scroll-triggered mint highlight (see §8). Use at most once per section.
- `<Insight quote="..." source="Stakeholder interview" />`: research insight card; place in a responsive row of up to 3.
- `<Decision title="..." image="..." alt="...">explanation</Decision>`: alternating image/text row.
- `<BeforeAfter before="..." after="..." />`: side-by-side comparison (stacked on mobile).
- `<Figure src="..." alt="..." caption="..." />`: image with caption via next/image, click to open a lightbox (Esc closes, focus trapped).
- `<Stat />` and `<Callout>` as needed.

### Side navigation
- Desktop (≥1024px): sticky left column listing the section headings. The current section is highlighted (`ink` text + small `accent` bar); others are `muted`. Clicking smooth-scrolls to the section (`scroll-margin-top` accounts for the header).
- Tablet and mobile: hide the side nav; show a thin `accent` reading-progress bar fixed at the top and a "Jump to section ▾" dropdown under the title.
- Use `IntersectionObserver` for the active state.

### Content migration
- **nooon, FundFlow, XpensePal:** move the copy and images from the old site into MDX using the new structure. Condense: show one or two key visuals per stage instead of full pages of wireframes, and add a one-line explanation under each visual.
- **Do not invent numbers, quotes, or results.** Where the old site lacks something the template needs (e.g. a TL;DR line or stat), insert a clearly marked placeholder: `[TODO: Tahaylia — ...]`, and list all TODOs at the end of the phase summary.
- Compress and convert all migrated images; delete unused ones.

---

## 7. Temple (placeholder, content coming later)

- Create `content/case-studies/temple.mdx` with `comingSoon: true`, full frontmatter filled with `[TODO]` placeholders, and **all section headings present with empty `[TODO]` bodies**, so I only have to fill in text and images later.
- Suggested extra sections for Temple (keep in the file): **Background, Problem, Research, Decisions, Design, Build, Launch, Outcome, Learned**, plus an optional **Try it** section that can embed a live link or screenshots of the app.
- While `comingSoon: true`: the homepage card shows the "Case study coming soon" label; the `/work/temple` page shows the title, a short intro ("Temple is a wellness food guide app that helps people shop for their health goals. I designed and built it, and the full case study is on its way."), a link to https://templeguide.co, and the footer. No empty sections are visible.
- Flipping `comingSoon` to `false` shows the full case study with no code changes.

---

## 8. Motion & interaction spec

Global rules:
- Easing: `[0.22, 1, 0.36, 1]` (ease-out). Durations 150–600ms unless noted.
- Animate only `transform` and `opacity` (plus SVG path length). No layout-thrashing animations.
- **`prefers-reduced-motion: reduce`** → disable all movement: elements appear in their final state, the map shows the full path, parallax is off, highlight is shown already drawn, custom cursor is off.

| Element | Behavior |
|---|---|
| **Hero on load** | Avatar, headline, chips, input fade up in sequence (y: 12→0, opacity 0→1, 80ms stagger). Then the mint band under "real people" draws left→right (scaleX 0→1, 600ms, origin left). |
| **Asking a question** | Visitor bubble slides in from the right (x: 16→0, 200ms). A three-dot typing indicator shows in my bubble for ~600ms. Then my answer fades up (250ms). The conversation auto-scrolls so the newest answer is visible. Chips stay available. |
| **Journey map** | When the story answer appears: the dotted path draws from Jamaica to Georgia (pathLength 0→1, ~2.4s, ease-in-out). The plane travels along the same path, rotated to follow its direction. Each stop's dot and label pop in (scale 0.6→1 + fade) as the plane reaches it. Georgia's dot keeps a slow, subtle pulse ring. Plays once per answer. |
| **Selected Work parallax (desktop & tablet, ≥768px)** | Each card flies in from "far away" as it scrolls into view, one at a time: tied to scroll progress with `useScroll` on each card (`offset: ["start end", "center center"]`), mapping scale 0.82→1, opacity 0→1, y 120→0, and a slight blur 6px→0. Once settled, it stays settled. |
| **Selected Work (mobile)** | Simple fade-up (y: 24→0) once when 20% visible. No parallax. |
| **`<Highlight>` in case studies** | When the phrase is ~60% in view: a mint band draws behind it left→right (scaleX 0→1, 700ms). Triggers **once** and stays drawn (`once: true`). Never flickers on scroll-back. |
| **Section reveal in case studies** | Headings and first paragraph fade up once (y: 16→0, 400ms). Keep subtle. |
| **Side nav** | Active indicator bar slides between items (Motion `layoutId`). |
| **Page transitions** | Simple 200ms fade between routes (`template.tsx`). Nothing more. |
| **Chips / buttons / cards** | Hover and press micro-interactions: 150ms color/border transitions; press scale 0.97. |
| **Paper-plane cursor** | Desktop only (`(pointer: fine)` and not reduced motion). Implement with a **CSS `cursor: url('/cursor-plane.svg') 4 4, auto`** on the body (zero JS, zero lag). Links, buttons, chips, and cards use `cursor: pointer`; text inputs use `text`. Plane SVG: 24px, thin `ink` line with a tiny `accent` detail. |
| **Loader** | `loading.tsx`: a small line-icon plane drawing a dotted loop, centered. Only shows if loading takes longer than 300ms (delay the render). Most pages are static and should never show it. |
| **Copy email** | Button text swaps to "Copied ✓" for 2s. |

---

## 9. Accessibility, performance, SEO

**Accessibility (non-negotiable; this is a UX portfolio):**
- Chips are real `<button>`s (or `<a>` for links) with visible focus rings; full keyboard support (Tab, Enter/Space, Esc).
- The chat log is a region with `aria-live="polite"` so new answers are announced. The typing indicator is hidden from screen readers.
- The journey map has a text alternative (the four stops as a visually hidden list).
- All images have meaningful alt text; decorative ones have `alt=""`.
- Color contrast AA everywhere; don't rely on color alone for active states.
- Respect reduced motion (see §8). Semantic headings in order. Skip-to-content link.

**Performance targets:**
- Lighthouse (mobile): **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.**
- LCP < 2.0s, CLS < 0.05. Largest image on any page under ~200KB after optimization.
- Server Components by default; only chat, map, parallax, highlight, side nav, and lightbox are client components.
- Statically generate all pages.

**SEO & sharing:**
- Per-page `<title>` and description via Next metadata. Homepage title: "Tahaylia Higgins, Product Designer".
- Open Graph image (1200×630) for the site and each case study, in the new style.
- Favicon: "TH" monogram in `ink` on `bg`, plus an `accent` version.
- `sitemap.xml` and `robots.txt`.

---

## 10. Build phases

Work on a new git branch (`redesign`) so the current live site keeps running. Each phase gets its own commit. Vercel preview deployments are used to review each phase.

1. **Audit.** List every page, section, image, and piece of copy in the old site. Flag oversized images. Propose the new folder structure. Map old content → new pages. No code yet.
2. **Setup.** New Next.js + TS + Tailwind project; both color themes from §3 as CSS variables, with `?theme=` override and the preview-only toggle; fonts; base layout (header, nav, footer, skip link); 404 page.
3. **Homepage chat.** §5a–5b, including `content/chat.ts`, free-text matcher, and chat animations.
4. **Journey map.** §5c with its animation and text alternative.
5. **Selected Work.** §5d with parallax and mobile fallback; `content/projects.ts`.
6. **Case study template + content.** §6 layout, MDX components, side nav, progress bar; migrate nooon, FundFlow, XpensePal; create Temple placeholder (§7).
7. **About page, cursor, loader, page transitions.** About: short bio, a "little things about me" row (from the old site: Iceland, languages, the Berlin journalism class), and a photo.
8. **Polish & QA.** Image optimization, metadata/OG images, reduced-motion pass, keyboard pass, Lighthouse run with results reported, optional Vercel Analytics.

---

## 11. Final checklist (verify before calling it done)

- [ ] No StyleShout/ThemeWagon code, classes, or credits remain.
- [ ] Craigslist is gone everywhere (search the codebase for "craigslist").
- [ ] Temple card and page work in "coming soon" mode; `temple.mdx` has every section heading ready.
- [ ] Every chat chip works; free-text fallback works; everything is keyboard accessible.
- [ ] Map animation plays once and has a text alternative.
- [ ] Parallax works on desktop/tablet; mobile uses fade-up only.
- [ ] Highlights draw once and stay.
- [ ] Side nav tracks the current section; mobile shows progress bar + jump menu.
- [ ] Reduced motion disables all animation.
- [ ] Custom cursor is desktop-only and switches to the pointer on interactive elements.
- [ ] Lighthouse targets met; results listed.
- [ ] All `[TODO]` and `[CONFIRM]` placeholders are listed for Tahaylia.
- [ ] Looks right at 375px, 768px, 1024px, and 1440px wide.
- [ ] Footer year is rendered by `<CurrentYear />` (search the codebase: no hard-coded year in UI copy).
- [ ] LinkedIn, email, and resume links all work and come from `content/site.ts`.
- [ ] The word "grocery" does not appear anywhere in the site.
- [ ] Follow-up chip under the Temple answer works and disappears once used.
- [ ] Both themes (green and coral) look correct on every page and pass AA contrast; no hard-coded hex values in components.
