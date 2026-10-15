import { useState } from "react";
import { recommendChapters, type Recommendation } from "@/lib/advisor.functions";
import { Container, Display, Eyebrow, Reveal, Section } from "../primitives";

const TITLES: Record<string, string> = {
  "01": "Campaign planning",
  "02": "Volunteer organization",
  "03": "Community engagement",
  "04": "Communications",
  "05": "Field operations",
  "06": "Polling & consultation",
  "07": "Election day",
  "08": "Governance transition",
};

export default function Advisor() {
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rec, setRec] = useState<Recommendation | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goals.trim().length < 10 || loading) return;
    setLoading(true);
    setError(null);
    try {
      setRec(await recommendChapters({ data: { goals } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="advisor" className="border-t border-line/60">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal><Eyebrow index="AI">Campaign advisor</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <Display className="mt-6">
                Where should <span className="italic text-navy">you</span> start?
              </Display>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-graphite">
                Describe your goals and challenges. Our AI-powered advisor will point you to the
                Pulse chapters that matter most — and explain why.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <form onSubmit={submit} className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
              <label htmlFor="advisor-goals" className="text-[11px] uppercase tracking-[0.2em] text-graphite" style={{ fontFamily: "var(--font-mono)" }}>
                Your goals & challenges
              </label>
              <textarea
                id="advisor-goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                maxLength={2000}
                rows={5}
                placeholder="e.g. We're running a county campaign with 300 volunteers on WhatsApp groups and no visibility into turnout…"
                className="mt-3 w-full resize-none rounded-lg border border-line bg-canvas p-3 text-base text-ink outline-none focus:border-navy"
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-xs text-graphite">{goals.trim().length < 10 ? "At least a sentence, please." : `${goals.length}/2000`}</span>
                <button
                  type="submit"
                  disabled={loading || goals.trim().length < 10}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-canvas transition hover:bg-ink disabled:opacity-50"
                >
                  {loading ? "Thinking…" : "Recommend chapters →"}
                </button>
              </div>
              {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
            </form>

            {rec && (
              <div className="mt-8 space-y-4" aria-live="polite">
                <p className="font-display text-2xl leading-snug text-ink">{rec.summary}</p>
                <ol className="space-y-3">
                  {rec.chapters.map((c) => (
                    <li key={c.n} className="rounded-xl border border-line bg-canvas p-4">
                      <a href={`#chapter-${c.n}`} className="flex items-baseline gap-3 hover:text-navy">
                        <span className="font-display text-3xl text-civic">{c.n}</span>
                        <span className="font-medium">{TITLES[c.n]}</span>
                        <span aria-hidden className="ml-auto text-graphite">↑</span>
                      </a>
                      <p className="mt-2 text-sm leading-relaxed text-graphite">{c.reason}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
