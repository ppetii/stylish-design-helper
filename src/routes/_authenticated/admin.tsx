import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Ajánlatkérések — Admin | Vasmester és Fiai" },
      { name: "description", content: "Beérkezett ajánlatkérések áttekintése és állapotkövetése." },
      { property: "og:title", content: "Ajánlatkérések — Admin" },
      { property: "og:description", content: "Beérkezett ajánlatkérések áttekintése és állapotkövetése." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUSES: Record<string, string> = {
  uj: "Új",
  folyamatban: "Folyamatban",
  ajanlat_kuldve: "Ajánlat elküldve",
  elfogadva: "Elfogadva",
  elutasitva: "Elutasítva",
  lezarva: "Lezárva",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");

  const roleQ = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      return !!data;
    },
  });

  const listQ = useQuery({
    queryKey: ["quotes"],
    enabled: roleQ.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/auth" });
  }

  async function update(id: string, patch: { status?: string; admin_note?: string }) {
    await supabase.from("quote_requests").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["quotes"] });
  }

  async function openPhoto(path: string) {
    const { data } = await supabase.storage.from("quote-photos").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  const rows = (listQ.data ?? []).filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between bg-ink px-6 py-4 text-hero-foreground">
        <h1 className="section-title text-2xl">Ajánlatkérések</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/">Weboldal</Link>
          <Button variant="industrialOutline" size="sm" onClick={signOut}>Kilépés</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {roleQ.isLoading ? (
          <p>Betöltés…</p>
        ) : !roleQ.data ? (
          <p className="text-muted-foreground">Ehhez a fiókhoz nincs admin jogosultság.</p>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {[["all", "Összes"], ...Object.entries(STATUSES)].map(([k, l]) => {
                const n = k === "all" ? listQ.data?.length ?? 0 : listQ.data?.filter((r) => r.status === k).length ?? 0;
                return (
                  <button key={k} onClick={() => setFilter(k)} className={`border px-3 py-1.5 text-xs font-bold uppercase ${filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
                    {l} ({n})
                  </button>
                );
              })}
            </div>
            {listQ.isLoading && <p>Betöltés…</p>}
            {rows.length === 0 && !listQ.isLoading && <p className="text-muted-foreground">Nincs ilyen ajánlatkérés.</p>}
            <div className="grid gap-4">
              {rows.map((r) => (
                <article key={r.id} className="grid gap-3 border border-border bg-background p-5 md:grid-cols-[1fr_220px]">
                  <div className="grid gap-1 text-sm">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h2 className="text-lg font-bold">{r.name}</h2>
                      <span className="text-xs font-bold uppercase text-primary">{r.project_type}</span>
                      <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("hu-HU")}</span>
                    </div>
                    <p>{r.email && <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>} {r.phone && <a className="ml-3 underline" href={`tel:${r.phone}`}>{r.phone}</a>}</p>
                    {r.dimensions && <p><b>Méretek:</b> {r.dimensions}</p>}
                    {r.location && <p><b>Helyszín:</b> {r.location}</p>}
                    {r.message && <p className="whitespace-pre-wrap text-muted-foreground">{r.message}</p>}
                    {r.photo_path && (
                      <button onClick={() => openPhoto(r.photo_path!)} className="mt-1 w-fit text-xs font-bold uppercase text-primary underline">Referenciafotó megnyitása</button>
                    )}
                  </div>
                  <div className="grid content-start gap-2">
                    <select value={r.status} onChange={(e) => update(r.id, { status: e.target.value })} className="h-10 border border-border bg-background px-2 text-sm">
                      {Object.entries(STATUSES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                    <textarea defaultValue={r.admin_note ?? ""} placeholder="Belső jegyzet…" rows={3} maxLength={2000}
                      onBlur={(e) => e.target.value !== (r.admin_note ?? "") && update(r.id, { admin_note: e.target.value })}
                      className="border border-border bg-background p-2 text-sm" />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
