import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { WORKSPACES } from "@/lib/workspaces";
import { itemsQuery } from "@/lib/items";

export const Route = createFileRoute("/_authenticated/app/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(itemsQuery()),
  component: Overview,
});

function Overview() {
  const { data } = useSuspenseQuery(itemsQuery());
  return (
    <div>
      <h1 className="font-display text-5xl">Mission control</h1>
      <p className="mt-3 text-graphite">Everything your campaign is running, across all eight workspaces.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {WORKSPACES.map((w) => {
          const rows = data.filter((i) => i.chapter === w.n);
          const done = rows.filter((i) => i.done).length;
          return (
            <Link key={w.n} to="/app/$chapter" params={{ chapter: w.slug }} className="rounded-2xl border border-line p-5 transition hover:border-navy">
              <div className="text-[10px] uppercase tracking-widest text-civic" style={{ fontFamily: "var(--font-mono)" }}>{w.n}</div>
              <div className="mt-2 font-display text-2xl">{w.title}</div>
              <div className="mt-4 text-sm text-graphite">{rows.length} {rows.length === 1 ? w.item.toLowerCase() : "entries"} · {done} {w.doneLabel.toLowerCase()}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
