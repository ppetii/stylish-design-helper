import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import emblem from "@/assets/Vasmester.png.asset.json";

export const Route = createFileRoute("/munkaink")({
  head: () => ({ meta: [
    { title: "Kiemelt munkáink | Vasmester és Fiai" },
    { name: "description", content: "Lakossági és ipari munkáink: kapuk, kerítések, lépcsők, előtetők, acélszerkezetek és egyedi fémszerkezetek – Vasmester és Fiai Kft." },
    { property: "og:title", content: "Kiemelt munkáink | Vasmester és Fiai" },
    { property: "og:description", content: "Lakossági és ipari referenciáink: kapuk, kerítések, lépcsők, előtetők, acélszerkezetek és egyedi fémmunkák." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Works,
});

const nav = [
  { label: "Kezdőlap", to: "/" as const },
  { label: "Szolgáltatások", to: "/" as const, hash: "szolgaltatasok" },
  { label: "Munkáink", to: "/munkaink" as const },
  { label: "Rólunk", to: "/" as const, hash: "rolunk" },
  { label: "Kapcsolat", to: "/" as const, hash: "kapcsolat" },
];

type NavItem = (typeof nav)[number];

function NavLink({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) {
  if (item.hash) return <Link to={item.to} hash={item.hash} onClick={onClick} className={className}>{item.label}</Link>;
  return <Link to={item.to} onClick={onClick} className={className}>{item.label}</Link>;
}

const tabs = [
  { id: "lakossagi", label: "Lakossági munkáink" },
  { id: "ipari", label: "Ipari munkáink" },
] as const;

// Képek a src/galeria/<kategória>/ mappákból — új kép feltöltése (pl. GitHubon) után a következő buildnél megjelenik.
const files = import.meta.glob("/src/galeria/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", { eager: true, import: "default" }) as Record<string, string>;
const all = Object.keys(files).sort().map((path) => ({ id: path, category: path.split("/")[3], url: files[path] }));

function Brand() {
  return <Link to="/" className="flex shrink-0 items-center gap-2.5 text-hero-foreground" aria-label="Vasmester és Fiai – Kezdőlap">
    <img src={emblem.url} alt="" className="h-11 w-9 object-contain sm:h-12 sm:w-10" />
    <span className="font-display text-xl font-extrabold uppercase leading-none sm:text-2xl"><span className="block text-primary">Vasmester</span><span className="block">és Fiai</span><span className="mt-1 block font-sans text-[8px] font-semibold tracking-[.19em] text-hero-muted sm:text-[9px]">FÉMIPARI MEGOLDÁSOK</span></span>
  </Link>;
}

function Works() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<string>("lakossagi");
  const active = tabs.find((t) => t.id === tab) ?? tabs[0];
  const items = all.filter((img) => img.category === active.id);

  return <div className="overflow-x-hidden">
    <header className="sticky top-0 z-50 bg-ink text-hero-foreground shadow-lg">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10 lg:px-14">
        <Brand />
        <nav className="hidden items-center gap-6 lg:flex xl:gap-9" aria-label="Fő navigáció">{nav.map((item) => <NavLink key={item.label} item={item} className="text-xs font-bold transition-colors hover:text-primary" />)}</nav>
        <Button variant="industrial" size="lg" asChild className="hidden h-10 px-5 text-xs lg:inline-flex"><Link to="/" hash="kapcsolat">Ajánlatkérés <ArrowRight /></Link></Button>
        <Button variant="ghost" size="icon" className="text-hero-foreground lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="flex flex-col border-t border-steel px-5 py-3 lg:hidden" aria-label="Mobil navigáció">{nav.map((item) => <NavLink key={item.label} item={item} onClick={() => setMenuOpen(false)} className="border-b border-steel py-3 text-sm font-semibold" />)}<Link to="/" hash="kapcsolat" onClick={() => setMenuOpen(false)} className="py-3 font-bold uppercase text-primary">Ajánlatkérés →</Link></nav>}
    </header>

    <main>
      <section className="bg-ink pb-4 pt-14 text-hero-foreground md:pt-20"><div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <p className="text-xs font-bold uppercase text-primary">Referenciáink</p>
        <h1 className="section-title mt-2 text-4xl sm:text-5xl">Kiemelt <span className="text-primary">munkáink</span></h1>
        <div className="red-rule mt-3" />
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-hero-muted">Válasszon kategóriát: lakossági munkák az otthonhoz, ipari megoldások nagyobb feladatokra. Mindkettő egyedi tervezéssel, saját műhelyből.</p>
      </div></section>

      <section className="bg-ink py-10 text-hero-foreground md:py-14"><div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <div role="tablist" aria-label="Munkák kategóriái" className="mb-8 flex gap-7 border-b border-steel text-xs font-semibold [scrollbar-width:none]">
          {tabs.map((t) => <Button key={t.id} variant="ghost" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`h-10 rounded-none border-b-2 px-0 text-xs hover:bg-transparent hover:text-hero-foreground ${tab === t.id ? "border-primary text-hero-foreground" : "border-transparent text-ink-muted"}`}>{t.label}</Button>)}
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-hero-muted">Hamarosan feltöltjük ezt a galériát.</p>
        ) : (
          <div key={active.id} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((img) => <div key={img.id} className="aspect-[4/3] overflow-hidden bg-steel">
              <img src={img.url} alt="Vasmester és Fiai munkája" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>)}
          </div>
        )}
      </div></section>

      <section className="relative isolate bg-steel py-14 text-hero-foreground"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 md:flex-row md:items-center md:px-10 lg:px-14"><div><p className="text-xs font-bold uppercase text-primary">Tetszik, amit lát?</p><h2 className="section-title mt-2 text-4xl sm:text-5xl">Készítsünk hasonlót Önnek!</h2><p className="mt-3 text-sm text-hero-muted">Írja meg az elképzelését, és egyedi ajánlatot készítünk.</p></div><Button variant="industrial" size="lg" asChild className="h-12 shrink-0 px-7 text-xs"><Link to="/" hash="kapcsolat">Ajánlatkérés <ArrowRight /></Link></Button></div></section>
    </main>

    <footer className="bg-ink text-hero-foreground"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-10 md:flex-row md:items-center md:px-10 lg:px-14"><Brand /><nav aria-label="Lábléc navigáció" className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-hero-muted">{nav.map((item) => <NavLink key={item.label} item={item} className="hover:text-hero-foreground" />)}</nav></div><div className="mx-auto max-w-[1440px] border-t border-steel px-5 py-5 text-xs text-ink-muted md:px-10 lg:px-14">© {new Date().getFullYear()} Vasmester és Fiai Kft. Minden jog fenntartva.</div></footer>
  </div>;
}
