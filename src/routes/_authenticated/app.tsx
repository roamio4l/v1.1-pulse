import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WORKSPACES } from "@/lib/workspaces";
import logoAsset from "@/assets/pulse-logo.asset.json";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Workspaces — Pulse" },
      { name: "description", content: "Your Pulse campaign workspaces." },
      { property: "og:title", content: "Workspaces — Pulse" },
      { property: "og:description", content: "Plan, organize and run your campaign in Pulse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  return (
    <div className="min-h-screen bg-canvas text-ink md:flex">
      <aside className="border-b border-line p-5 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <Link to="/"><img src={logoAsset.url} alt="Pulse" className="h-8" /></Link>
        <nav className="mt-6 flex gap-1 overflow-x-auto md:mt-10 md:flex-col">
          <Link to="/app" activeOptions={{ exact: true }} className="shrink-0 rounded-lg px-3 py-2 text-sm text-graphite hover:bg-secondary" activeProps={{ className: "bg-secondary text-ink" }}>Overview</Link>
          {WORKSPACES.map((w) => (
            <Link key={w.n} to="/app/$chapter" params={{ chapter: w.slug }} className="flex shrink-0 items-baseline gap-2 rounded-lg px-3 py-2 text-sm text-graphite hover:bg-secondary" activeProps={{ className: "bg-secondary text-ink" }}>
              <span className="text-[10px] text-civic" style={{ fontFamily: "var(--font-mono)" }}>{w.n}</span>{w.title}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden text-xs text-graphite md:block">
          <div className="truncate">{user.email}</div>
          <button onClick={signOut} className="mt-2 text-navy hover:underline">Sign out</button>
        </div>
        <button onClick={signOut} className="mt-3 text-xs text-navy md:hidden">Sign out</button>
      </aside>
      <div className="flex-1 p-6 md:p-12"><Outlet /></div>
    </div>
  );
}
