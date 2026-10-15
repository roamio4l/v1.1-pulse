import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logoAsset from "@/assets/pulse-logo.asset.json";

const safePath = (p?: string) => {
  if (!p) return "/app";
  try {
    const u = new URL(p, "http://x");
    return u.pathname.startsWith("/") && !u.pathname.startsWith("//") ? u.pathname + u.search : "/app";
  } catch {
    return "/app";
  }
};

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sign in — Pulse" },
      { name: "description", content: "Sign in to your Pulse campaign workspaces." },
      { property: "og:title", content: "Sign in — Pulse" },
      { property: "og:description", content: "Access your campaign's eight connected Pulse workspaces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const target = safePath(redirect);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target, replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: target, replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, target]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + target },
      });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your email to confirm your account, then sign in.");
    }
    setBusy(false);
  };

  const google = async () => {
    sessionStorage.setItem("pulse-after-auth", target);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setMsg("Google sign-in failed. Please try again.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-block"><img src={logoAsset.url} alt="Pulse" className="h-9" /></Link>
        <h1 className="mt-10 font-display text-4xl">{mode === "in" ? "Welcome back." : "Start your campaign."}</h1>
        <p className="mt-2 text-sm text-graphite">Your eight Pulse workspaces, saved to your account.</p>
        <button onClick={google} className="mt-8 w-full rounded-full border border-line bg-canvas py-3 text-sm font-medium transition hover:border-navy">
          Continue with Google
        </button>
        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-graphite"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-line bg-canvas p-3 outline-none focus:border-navy" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-line bg-canvas p-3 outline-none focus:border-navy" />
          <button disabled={busy} className="w-full rounded-full bg-navy py-3 text-sm font-medium text-canvas transition hover:bg-ink disabled:opacity-50">
            {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>
        {msg && <p role="alert" className="mt-4 text-sm text-graphite">{msg}</p>}
        <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="mt-6 text-sm text-navy hover:underline">
          {mode === "in" ? "New to Pulse? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
