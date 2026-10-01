import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin belépés — Vasmester és Fiai" },
      { name: "description", content: "Bejelentkezés az ajánlatkérések kezelőfelületére." },
      { property: "og:title", content: "Admin belépés — Vasmester és Fiai" },
      { property: "og:description", content: "Bejelentkezés az ajánlatkérések kezelőfelületére." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const inputCls = "h-11 border border-border bg-background px-3 text-sm outline-none focus:border-primary";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("Hibás e-mail cím vagy jelszó.");
      navigate({ to: "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      if (data.session) navigate({ to: "/admin" });
      else setMsg("Elküldtük a megerősítő e-mailt. A linkre kattintva tud belépni.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form onSubmit={onSubmit} className="grid w-full max-w-sm gap-4 bg-background p-8">
        <h1 className="section-title text-3xl">{mode === "in" ? "Admin belépés" : "Admin fiók létrehozása"}</h1>
        <input className={inputCls} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={inputCls} type="password" required minLength={8} placeholder="Jelszó (min. 8 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} />
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button variant="industrial" disabled={busy}>{busy ? "…" : mode === "in" ? "Belépés" : "Regisztráció"}</Button>
        <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Még nincs fiókja? Regisztráció" : "Van már fiókja? Belépés"}
        </button>
        <Link to="/" className="text-center text-xs text-muted-foreground">← Vissza a weboldalra</Link>
      </form>
    </main>
  );
}
