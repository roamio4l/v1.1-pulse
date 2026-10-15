import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { bySlug } from "@/lib/workspaces";
import { itemsQuery, type Item } from "@/lib/items";

export const Route = createFileRoute("/_authenticated/app/$chapter")({
  loader: async ({ context, params }) => {
    const ws = bySlug(params.chapter);
    if (!ws) throw notFound();
    await context.queryClient.ensureQueryData(itemsQuery(ws.n));
    return { title: ws.title };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? "Workspace"} — Pulse` }] }),
  notFoundComponent: () => <p className="text-graphite">That workspace doesn't exist.</p>,
  component: WorkspacePage,
});

function WorkspacePage() {
  const { chapter } = Route.useParams();
  const ws = bySlug(chapter)!;
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(itemsQuery(ws.n));
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [details, setDetails] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["items"] });
  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("workspace_items").insert({ chapter: ws.n, title: title.trim(), tag: tag.trim(), details: details.trim() });
      if (error) throw error;
    },
    onSuccess: () => { setTitle(""); setTag(""); setDetails(""); setErr(null); refresh(); },
    onError: () => setErr("Couldn't save. Please try again."),
  });
  const toggle = useMutation({
    mutationFn: async (i: Item) => {
      const { error } = await supabase.from("workspace_items").update({ done: !i.done }).eq("id", i.id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workspace_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  const field = "w-full rounded-lg border border-line bg-canvas p-3 text-sm outline-none focus:border-navy";
  return (
    <div className="max-w-3xl">
      <div className="text-[11px] uppercase tracking-[0.2em] text-civic" style={{ fontFamily: "var(--font-mono)" }}>Workspace {ws.n}</div>
      <h1 className="mt-2 font-display text-5xl">{ws.title}</h1>
      <p className="mt-3 text-graphite">{ws.blurb}</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (title.trim()) add.mutate(); }}
        className="mt-10 grid gap-3 rounded-2xl border border-line p-5 sm:grid-cols-2"
      >
        <input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`New ${ws.item.toLowerCase()}`} className={field} aria-label={ws.item} />
        <input maxLength={80} value={tag} onChange={(e) => setTag(e.target.value)} placeholder={`${ws.tagLabel} — ${ws.tagPlaceholder}`} className={field} aria-label={ws.tagLabel} />
        <textarea maxLength={2000} rows={2} value={details} onChange={(e) => setDetails(e.target.value)} placeholder={ws.detailsPlaceholder} className={`${field} resize-none sm:col-span-2`} aria-label="Details" />
        <div className="flex items-center justify-between sm:col-span-2">
          <span className="text-sm text-destructive">{err}</span>
          <button disabled={add.isPending} className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-canvas transition hover:bg-ink disabled:opacity-50">
            {add.isPending ? "Saving…" : `Add ${ws.item.toLowerCase()}`}
          </button>
        </div>
      </form>

      {data.length === 0 ? (
        <p className="mt-10 text-sm text-graphite">Nothing here yet — add your first {ws.item.toLowerCase()} above.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {data.map((i) => (
            <li key={i.id} className="flex items-start gap-4 rounded-xl border border-line p-4">
              <button onClick={() => toggle.mutate(i)} aria-label={`Mark ${ws.doneLabel.toLowerCase()}`} className={`mt-1 h-5 w-5 shrink-0 rounded-full border transition ${i.done ? "border-civic bg-civic" : "border-line hover:border-navy"}`} />
              <div className="min-w-0 flex-1">
                <div className={`font-medium ${i.done ? "text-graphite line-through" : ""}`}>{i.title}</div>
                {i.tag && <div className="mt-1 text-[11px] uppercase tracking-widest text-navy" style={{ fontFamily: "var(--font-mono)" }}>{i.tag}</div>}
                {i.details && <p className="mt-2 whitespace-pre-wrap text-sm text-graphite">{i.details}</p>}
              </div>
              <button onClick={() => remove.mutate(i.id)} className="text-xs text-graphite hover:text-destructive">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
