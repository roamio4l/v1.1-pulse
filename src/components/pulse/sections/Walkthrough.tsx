import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Container, Display, Eyebrow, Reveal, Section } from "../primitives";

const CHAPTERS = [
  {
    n: "01",
    title: "Campaign planning",
    body: "The strategy team drafts the operational blueprint — regions, milestones, coordinators, budgets.",
    surface: "Strategy Canvas",
    detail: ["12 regions scoped", "48 milestones", "6 workstreams"],
  },
  {
    n: "02",
    title: "Volunteer organization",
    body: "Volunteers onboard through Pulse, sorted by geography, skill and availability.",
    surface: "Volunteer Ops",
    detail: ["2,418 volunteers", "312 team leads", "94 active shifts"],
  },
  {
    n: "03",
    title: "Community engagement",
    body: "Supporters are organized into structured communities that persist beyond the cycle.",
    surface: "Community",
    detail: ["27 constituencies", "184 forums", "6.2k engaged"],
  },
  {
    n: "04",
    title: "Communications",
    body: "Unified messaging across WhatsApp, SMS, email and social — with one source of truth.",
    surface: "Comms Hub",
    detail: ["9 channels linked", "42 templates", "1 approval queue"],
  },
  {
    n: "05",
    title: "Field operations",
    body: "Coordinators run canvassing, town halls and events with live coverage maps.",
    surface: "Field Console",
    detail: ["78% coverage", "156 events", "23 zones live"],
  },
  {
    n: "06",
    title: "Polling & consultation",
    body: "Structured polls and open feedback flow directly into planning workstreams.",
    surface: "Polling",
    detail: ["14 active polls", "9.4k responses", "6 themes surfaced"],
  },
  {
    n: "07",
    title: "Election day",
    body: "Every team, every polling station, every signal — one situation room.",
    surface: "War Room",
    detail: ["1,204 stations", "312 observers", "Live incident feed"],
  },
  {
    n: "08",
    title: "Governance transition",
    body: "Campaign artifacts become governance workspaces — nothing is lost.",
    surface: "Governance",
    detail: ["Manifesto → Plan", "Community → Citizens", "Issues → Services"],
  },
];

export default function Walkthrough() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeChapter, setActiveChapter] = useState<string>(CHAPTERS[0].n);
  const stripRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? []);
    let frame = 0;
    let initialFrame = 0;
    const updateActive = () => {
      frame = 0;
      // Measure the stable chapter wrappers, not the animated surfaces inside them.
      const activationLine = Math.max(144, window.innerHeight * 0.35);
      let current = items[0];
      for (const item of items) {
        if (item.getBoundingClientRect().top <= activationLine) current = item;
        else break;
      }
      const chapter = current?.dataset.chapter;
      if (chapter) setActiveChapter(chapter);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateActive);
    };
    const openHash = () => {
      const target = items.find((item) => `#${item.id}` === window.location.hash);
      if (!target) return;
      target.scrollIntoView({ behavior: "instant", block: "start" });
      scheduleUpdate();
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", openHash);
    window.addEventListener("popstate", openHash);
    const observer = new ResizeObserver(scheduleUpdate);
    items.forEach((item) => observer.observe(item));
    // Run after hydration so direct links work even before reveal animations finish.
    initialFrame = requestAnimationFrame(() => {
      openHash();
      scheduleUpdate();
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initialFrame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", openHash);
      window.removeEventListener("popstate", openHash);
    };
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>(`[data-nav-chapter="${activeChapter}"]`);
    if (!strip || !active) return;
    const left = active.offsetLeft - strip.offsetLeft;
    const inset = 16;
    if (left < strip.scrollLeft + inset || left + active.offsetWidth > strip.scrollLeft + strip.clientWidth - inset) {
      strip.scrollTo({
        left: left - (strip.clientWidth - active.offsetWidth) / 2,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }, [activeChapter, reducedMotion]);

  const handleChapterClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (window.location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  };

  return (
    <Section id="walkthrough" className="border-t border-line/60">
      <Container>
        <div className="mb-24 max-w-3xl">
          <Reveal><Eyebrow index="03">The signature walkthrough</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <Display className="mt-6">
              Follow a <span className="italic text-navy">campaign</span>.
            </Display>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-graphite">
              Scroll through an entire election lifecycle. Each chapter introduces a Pulse
              workspace, in the exact order a real campaign encounters it.
            </p>
          </Reveal>
        </div>
      </Container>

      <div ref={ref} className="relative">
      <div className="sticky top-[68px] z-40 mb-8 border-y border-line bg-canvas/95 backdrop-blur-md md:hidden">
        <nav ref={stripRef} aria-label="Campaign chapters" className="relative flex gap-2 overflow-x-auto overscroll-x-contain px-6 py-3 motion-safe:scroll-smooth" style={{ scrollbarWidth: "thin" }}>
          {CHAPTERS.map((c) => (
            <a
              key={c.n}
              href={`#chapter-${c.n}`}
              data-nav-chapter={c.n}
              aria-current={activeChapter === c.n ? "step" : undefined}
              onClick={(e) => handleChapterClick(e, `chapter-${c.n}`)}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                activeChapter === c.n ? "border-navy bg-navy text-canvas" : "border-line bg-canvas text-ink hover:bg-secondary"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
               <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeChapter === c.n ? "bg-civic" : "bg-line"}`} />
               {c.n} · {c.title}
            </a>
          ))}
        </nav>
      </div>
        {/* Desktop sticky chapter rail */}
        <div className="absolute left-6 top-0 z-30 hidden h-full md:left-[max(0.5rem,calc((100vw-1240px)/2))] md:block">
          <div className="sticky top-32 flex h-[calc(100vh-10rem)] flex-row">
            <div className="relative h-full w-px bg-line">
              <motion.div style={{ height: progress }} className="w-px bg-navy" />
            </div>
            <nav aria-label="Campaign chapters" className="ml-3 flex h-full flex-col justify-between py-2">
              {CHAPTERS.map((c) => (
                <a
                  key={c.n}
                  href={`#chapter-${c.n}`}
                  aria-label={`${c.n} · ${c.title}`}
                  aria-current={activeChapter === c.n ? "step" : undefined}
                  onClick={(e) => handleChapterClick(e, `chapter-${c.n}`)}
                  className="group relative flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[9px] transition ${
                      activeChapter === c.n
                        ? "border-navy bg-navy text-canvas"
                        : "border-line bg-canvas text-graphite hover:border-navy hover:text-ink"
                    }`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {c.n}
                  </span>
                  <span
                    className="pointer-events-none absolute left-8 whitespace-nowrap rounded-md border border-line bg-canvas px-2 py-1 text-[11px] text-ink opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {c.title}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        <Container>
          <ol className="space-y-32 md:space-y-40">
            {CHAPTERS.map((c, i) => (
              <Chapter key={c.n} c={c} i={i} />
            ))}
          </ol>
        </Container>
      </div>
    </Section>
  );
}

function Chapter({ c, i }: { c: (typeof CHAPTERS)[number]; i: number }) {
  return (
    <li id={`chapter-${c.n}`} data-chapter={c.n} className="grid scroll-mt-32 gap-10 md:grid-cols-12">
      <div className="md:col-span-5">
        <div className="sticky top-32">
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-6xl text-civic">{c.n}</span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-graphite" style={{ fontFamily: "var(--font-mono)" }}>
                Chapter
              </span>
            </div>
            <h3 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{c.title}</h3>
            <p className="mt-4 max-w-[38ch] text-base leading-relaxed text-graphite">{c.body}</p>
          </Reveal>
        </div>
      </div>
      <div className="md:col-span-7">
        <Reveal delay={0.1} y={40}>
          <ChapterSurface c={c} idx={i} />
        </Reveal>
      </div>
    </li>
  );
}

function ChapterSurface({ c, idx }: { c: (typeof CHAPTERS)[number]; idx: number }) {
  return (
    <div className="rounded-2xl border border-line bg-canvas p-2 shadow-[0_30px_80px_-40px_rgba(20,30,60,0.3)]">
      <div className="rounded-xl border border-line/70 bg-[oklch(0.99_0.004_85)]">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-civic" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-graphite" style={{ fontFamily: "var(--font-mono)" }}>
              {c.surface}
            </span>
          </div>
          <span className="text-[10px] text-graphite" style={{ fontFamily: "var(--font-mono)" }}>pulse://{c.surface.toLowerCase().replace(/\s+/g, "-")}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {c.detail.map((d, i) => (
            <div key={i} className="rounded-lg border border-line bg-canvas p-4">
              <div className="text-[9px] uppercase tracking-widest text-graphite" style={{ fontFamily: "var(--font-mono)" }}>Metric 0{i + 1}</div>
              <div className="mt-2 font-display text-2xl leading-tight">{d}</div>
            </div>
          ))}
        </div>
        <VisualForChapter idx={idx} />
      </div>
    </div>
  );
}

function VisualForChapter({ idx }: { idx: number }) {
  const shapes = idx % 4;
  return (
    <div className="border-t border-line p-5">
      {shapes === 0 && (
        <div className="space-y-2">
          {[70, 55, 88, 42, 63].map((w, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="w-24 truncate text-graphite">Workstream {i + 1}</span>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${w}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                className="h-1.5 rounded-full bg-navy"
              />
            </div>
          ))}
        </div>
      )}
      {shapes === 1 && (
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 42 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.015, duration: 0.4 }}
              className={`aspect-square rounded ${
                i % 5 === 0 ? "bg-civic" : i % 3 === 0 ? "bg-navy" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      )}
      {shapes === 2 && (
        <svg viewBox="0 0 400 120" className="h-28 w-full">
          <defs>
            <pattern id={`g-${idx}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="var(--line)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="120" fill={`url(#g-${idx})`} />
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            d="M0,90 C60,70 100,40 160,50 C230,62 260,20 320,30 C360,36 380,50 400,45"
            fill="none"
            stroke="var(--navy)"
            strokeWidth="2"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.3 }}
            d="M0,80 C80,90 120,70 200,60 C260,52 300,80 400,70"
            fill="none"
            stroke="var(--civic)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      )}
      {shapes === 3 && (
        <div className="flex flex-wrap gap-2">
          {["North", "East", "West-Central", "Coastal", "Highlands", "Urban-A", "Urban-B", "Southern belt"].map((r, i) => (
            <motion.span
              key={r}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-full border border-line px-3 py-1 text-[11px] text-ink"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {r} · live
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}
