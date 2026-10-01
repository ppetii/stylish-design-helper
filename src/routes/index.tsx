import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowDown, Menu, X, ShieldCheck, Settings, ScanLine, UsersRound, Fence, Factory, Ruler, Warehouse, Waypoints, PanelsTopLeft, MessageSquare, PencilRuler, Truck, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import emblem from "@/assets/Vasmester.png.asset.json";
import plaque from "@/assets/vasmeste3.png.asset.json";
import hero from "@/assets/welding-hero.jpg";
import gate from "@/assets/steel-gate.jpg";
import fence from "@/assets/steel-fence.jpg";
import structure from "@/assets/steel-structure.jpg";
import stairs from "@/assets/steel-stairs.jpg";
import canopy from "@/assets/steel-canopy.jpg";
import custom from "@/assets/custom-metal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Vasmester és Fiai | Fémipari megoldások" },
    { name: "description", content: "Egyedi kapuk, kerítések, lépcsők és acélszerkezetek tervezése és kivitelezése. Vasmester és Fiai – fémipari megoldások." },
    { property: "og:title", content: "Vasmester és Fiai | Fémipari megoldások" },
    { property: "og:description", content: "Egyedi fémszerkezetek, lakatos munkák és acélszerkezetek a tervezéstől a kivitelezésig." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

const nav = [["Kezdőlap", "#kezdolap"], ["Szolgáltatások", "#szolgaltatasok"], ["Munkáink", "#munkaink"], ["Rólunk", "#rolunk"], ["Kapcsolat", "#kapcsolat"]];
const services = [
  { title: "Kapuk és kerítések", desc: "Egyedi tervezés, gyártás és szerelés", img: gate, Icon: Fence },
  { title: "Acélszerkezetek", desc: "Ipari és lakossági projektekhez", img: structure, Icon: Factory },
  { title: "Lépcsők és korlátok", desc: "Beltéri és kültéri megoldások", img: stairs, Icon: Ruler },
  { title: "Előtetők", desc: "Stílusos és tartós kivitelezés", img: canopy, Icon: Warehouse },
  { title: "Hegesztési munkák", desc: "MIG/MAG, TIG, bevontelektródás", img: hero, Icon: Waypoints },
  { title: "Egyedi fémszerkezetek", desc: "Az Ön elképzelései alapján", img: custom, Icon: PanelsTopLeft },
];
const projects = [
  { title: "Modern kapu", category: "Kapuk", img: gate },
  { title: "Beltéri lépcső", category: "Lépcsők", img: stairs },
  { title: "Acél előtető", category: "Előtetők", img: canopy },
  { title: "Egyedi kerítés", category: "Kerítések", img: fence },
  { title: "Acélváz", category: "Acélszerkezetek", img: structure },
  { title: "Egyedi fémmunka", category: "Egyedi munkák", img: custom },
];
const filters = ["Összes", "Kapuk", "Kerítések", "Lépcsők", "Előtetők", "Acélszerkezetek", "Egyedi munkák"];

function Brand() {
  return <a href="#kezdolap" className="flex shrink-0 items-center gap-2.5 text-hero-foreground" aria-label="Vasmester és Fiai – Kezdőlap">
    <img src={emblem.url} alt="" className="h-11 w-9 object-contain sm:h-12 sm:w-10" />
    <span className="font-display text-xl font-extrabold uppercase leading-[.83] sm:text-2xl"><span className="text-primary">Vasmester</span><br />és Fiai<span className="mt-1 block font-sans text-[8px] font-semibold tracking-[.19em] text-hero-muted sm:text-[9px]">FÉMIPARI MEGOLDÁSOK</span></span>
  </a>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("Összes");
  const visible = filter === "Összes" ? projects : projects.filter((project) => project.category === filter);
  return <div className="overflow-x-hidden">
    <header className="sticky top-0 z-50 bg-ink text-hero-foreground shadow-lg">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10 lg:px-14">
        <Brand />
        <nav className="hidden items-center gap-6 lg:flex xl:gap-9" aria-label="Fő navigáció">{nav.map(([label, href]) => <a key={href} href={href} className="text-xs font-bold transition-colors hover:text-primary">{label}</a>)}</nav>
        <Button variant="industrial" size="lg" asChild className="hidden h-10 px-5 text-xs lg:inline-flex"><a href="#kapcsolat">Ajánlatkérés <ArrowRight /></a></Button>
        <Button variant="ghost" size="icon" className="text-hero-foreground lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="flex flex-col border-t border-steel px-5 py-3 lg:hidden" aria-label="Mobil navigáció">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="border-b border-steel py-3 text-sm font-semibold">{label}</a>)}<a href="#kapcsolat" onClick={() => setMenuOpen(false)} className="py-3 font-bold uppercase text-primary">Ajánlatkérés →</a></nav>}
    </header>

    <main>
      <section id="kezdolap" className="relative isolate flex min-h-[590px] items-center overflow-hidden bg-ink text-hero-foreground sm:min-h-[650px] lg:min-h-[660px]">
        <img src={hero} alt="Acélszerkezet hegesztése a műhelyben" width={1536} height={864} className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_center]" />
        <div className="hero-shade absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 py-16 md:px-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center lg:px-14">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-bold uppercase text-primary sm:text-sm">Fémben a tapasztalat, generációk óta.</p>
            <h1 className="font-display text-[clamp(4rem,7vw,7.25rem)] font-extrabold uppercase leading-[.84]"> <span className="text-primary">Vasmester</span><br />és Fiai</h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-hero-muted sm:text-lg">Egyedi fémszerkezetek, lakatos munkák és komplett acélszerkezetek – a tervezéstől a kivitelezésig.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button variant="industrial" size="lg" asChild className="h-12 px-6 text-xs"><a href="#kapcsolat">Ajánlatkérés <ArrowRight /></a></Button><Button variant="industrialOutline" size="lg" asChild className="h-12 px-6 text-xs"><a href="#munkaink">Munkáink megtekintése</a></Button></div>
          </div>
          <div className="hidden justify-self-end lg:block">
            <ul className="space-y-5 text-[11px] font-bold uppercase">{[[ShieldCheck,"Megbízhatóság"],[Settings,"Precíz munkavégzés"],[ScanLine,"Egyedi megoldások"],[UsersRound,"Generációs tapasztalat"]].map(([Icon,label]) => { const Symbol = Icon as typeof ShieldCheck; return <li key={label as string} className="flex items-center gap-4"><Symbol className="size-6 text-hero-foreground" strokeWidth={1.6}/>{label as string}</li> })}</ul>
            <p className="mt-12 max-w-[245px] rotate-[-4deg] text-center font-script text-3xl leading-tight text-hero-foreground">Álmodni szabad,<br />a megvalósítás a mi feladatunk.</p><div className="ml-auto mt-3 h-px w-44 -rotate-12 bg-primary" />
          </div>
        </div>
        <a href="#szolgaltatasok" className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-bold uppercase text-hero-foreground/80"><ArrowDown className="size-4" />Görgess tovább</a>
      </section>

      <section id="szolgaltatasok" className="scroll-mt-20 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
          <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><h2 className="section-title text-4xl sm:text-5xl">Szolgáltatásaink</h2><div className="red-rule mt-3" /></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:text-right">Minden, ami fém – egy kézben.<br />Egyedi igényekre szabva, precízen, megbízhatóan.</p></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-3">{services.map(({title, desc, img, Icon}) => <a href="#kapcsolat" key={title} className="group min-w-0"><div className="aspect-[4/4.3] overflow-hidden bg-muted"><img src={img} alt={title} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="pt-3"><Icon className="mb-2 size-6 text-primary" strokeWidth={1.5}/><h3 className="font-display text-lg font-bold leading-none sm:text-xl">{title}</h3><p className="mt-2 min-h-[3rem] text-xs leading-relaxed text-muted-foreground">{desc}</p><ArrowRight className="mt-3 size-4 transition-transform group-hover:translate-x-1" /></div></a>)}</div>
        </div>
      </section>

      <section id="munkaink" className="scroll-mt-20 bg-ink py-14 text-hero-foreground md:py-20"><div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14"><div className="mb-7 flex items-end justify-between gap-4"><div><h2 className="section-title text-4xl sm:text-5xl">Kiemelt <span className="text-primary">munkáink</span></h2><div className="red-rule mt-3" /></div><a href="#kapcsolat" className="hidden items-center gap-2 text-xs font-bold uppercase text-primary sm:flex">Saját projektet tervez? <ArrowRight className="size-4" /></a></div>
        <div className="mb-5 flex gap-7 overflow-x-auto border-b border-steel text-xs font-semibold [scrollbar-width:none]">{filters.map((item) => <Button key={item} variant="ghost" onClick={() => setFilter(item)} className={`h-10 shrink-0 rounded-none border-b-2 px-0 text-xs hover:bg-transparent hover:text-hero-foreground ${filter === item ? "border-primary text-hero-foreground" : "border-transparent text-ink-muted"}`}>{item}</Button>)}</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{visible.map((project) => <div key={project.title} className="group relative aspect-[1.06] overflow-hidden bg-steel"><img src={project.img} alt={project.title} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-12"><p className="font-display text-xl font-bold">{project.title}</p><p className="text-[10px] uppercase text-hero-muted">{project.category}</p></div></div>)}</div>
        <p className="mt-4 text-xs text-ink-muted">A képek látványillusztrációk.</p>
      </div></section>

      <section id="rolunk" className="scroll-mt-20 grid bg-background lg:grid-cols-2"><div className="mx-auto w-full max-w-[720px] px-5 py-16 md:px-10 lg:ml-auto lg:py-24 lg:pl-14 lg:pr-16"><h2 className="section-title text-4xl sm:text-5xl">Rólunk</h2><div className="red-rule mt-3 mb-7" /><p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">A Vasmester és Fiai családi szemléletű fémipari vállalkozás. Kapukat, kerítéseket, lépcsőket és acélszerkezeteket készítünk az egyedi elképzelésekhez igazodva.</p><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">Hiszünk abban, hogy a jól megtervezett szerkezet egyszerre erős, használható és időtálló. A tervezéstől a kivitelezésig figyelünk a részletekre.</p><Button variant="industrial" size="lg" asChild className="mt-8 h-11 px-6 text-xs"><a href="#kapcsolat">Beszéljünk a tervéről <ArrowRight /></a></Button></div><div className="min-h-[320px] bg-steel lg:min-h-[480px]"><img src={plaque.url} alt="Vasmester és Fiai fém cégtábla" loading="lazy" className="h-full w-full object-cover" /></div></section>

      <section className="bg-ink py-14 text-hero-foreground md:py-20"><div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14"><div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="section-title text-4xl sm:text-5xl">Hogyan <span className="text-primary">dolgozunk?</span></h2><div className="red-rule mt-3" /></div><p className="text-sm text-hero-muted">Egyszerű folyamat, megbízható eredmény.</p></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[[MessageSquare,"Felmérés","Megismerjük az igényeket, egyeztetjük a részleteket."],[PencilRuler,"Tervezés","Egyedi megoldást dolgozunk ki."],[Settings,"Gyártás","Precíz, minőségi kivitelezés."],[Truck,"Helyszíni szerelés","Pontos, megbízható megvalósítás."]].map(([Icon,title,desc],index) => { const Symbol = Icon as typeof MessageSquare; return <div className="relative border-l border-steel pl-5" key={title as string}><span className="font-display text-5xl font-bold text-steel">0{index+1}</span><Symbol className="absolute left-20 top-2 size-7 text-primary" strokeWidth={1.5}/><h3 className="mt-2 font-display text-xl font-bold">{title as string}</h3><p className="mt-1 max-w-[200px] text-xs leading-relaxed text-hero-muted">{desc as string}</p></div> })}</div></div></section>

      <section className="relative isolate bg-steel py-12 text-hero-foreground"><img src={structure} alt="" loading="lazy" width={1024} height={768} className="absolute inset-0 -z-20 h-full w-full object-cover object-center" /><div className="banner-shade absolute inset-0 -z-10" /><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 md:flex-row md:items-center md:px-10 lg:px-14"><div><p className="text-xs font-bold uppercase text-primary">Van egy elképzelése?</p><h2 className="section-title mt-2 text-4xl sm:text-5xl">Valósítsuk meg együtt!</h2><p className="mt-3 text-sm text-hero-muted">Kérjen árajánlatot, és találjuk meg együtt a legjobb megoldást!</p></div><Button variant="industrial" size="lg" asChild className="h-12 shrink-0 px-7 text-xs"><a href="#kapcsolat">Ajánlatkérés <ArrowRight /></a></Button></div></section>

      <section id="kapcsolat" className="scroll-mt-20 bg-background py-16 md:py-20"><div className="mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-14"><div><p className="text-xs font-bold uppercase text-primary">Kapcsolat</p><h2 className="section-title mt-2 text-4xl sm:text-5xl">Kérjen ajánlatot</h2><div className="red-rule mt-4 mb-6" /><p className="max-w-md text-sm leading-7 text-muted-foreground">Írja meg, milyen munkára lenne szüksége, és vegye fel velünk a kapcsolatot.</p><div className="mt-8 space-y-5 text-sm"><a className="flex items-center gap-3 hover:text-primary" href="tel:+36301234567"><Phone className="size-5 text-primary" />+36 30 123 4567</a><a className="flex items-center gap-3 hover:text-primary" href="mailto:info@vasmesteresfiai.hu"><Mail className="size-5 text-primary" />info@vasmesteresfiai.hu</a><p className="flex items-center gap-3"><MapPin className="size-5 text-primary" />Debrecen és környéke</p></div></div><form action="mailto:info@vasmesteresfiai.hu" method="post" encType="text/plain" className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold uppercase">Név<input name="Név" required autoComplete="name" className="h-11 border border-border bg-background px-3 font-sans text-sm font-normal normal-case outline-none focus:border-primary" placeholder="Az Ön neve" /></label><label className="grid gap-2 text-xs font-bold uppercase">E-mail<input name="E-mail" type="email" required autoComplete="email" className="h-11 border border-border bg-background px-3 font-sans text-sm font-normal normal-case outline-none focus:border-primary" placeholder="E-mail címe" /></label><label className="grid gap-2 text-xs font-bold uppercase sm:col-span-2">Telefonszám<input name="Telefonszám" type="tel" autoComplete="tel" className="h-11 border border-border bg-background px-3 font-sans text-sm font-normal normal-case outline-none focus:border-primary" placeholder="Telefonszáma" /></label><label className="grid gap-2 text-xs font-bold uppercase sm:col-span-2">Üzenet<textarea name="Üzenet" required rows={5} className="resize-y border border-border bg-background p-3 font-sans text-sm font-normal normal-case outline-none focus:border-primary" placeholder="Meséljen a tervezett munkáról..." /></label><p className="text-xs text-muted-foreground sm:col-span-2">Az elküldés a levelezőprogramjában nyílik meg.</p><Button variant="industrial" type="submit" className="h-11 px-6 text-xs sm:col-span-2 sm:justify-self-start">Üzenet küldése <ArrowRight /></Button></form></div></section>
    </main>
    <footer className="bg-ink text-hero-foreground"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-10 md:flex-row md:items-center md:px-10 lg:px-14"><Brand /><nav aria-label="Lábléc navigáció" className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-hero-muted">{nav.map(([label,href]) => <a href={href} key={href} className="hover:text-hero-foreground">{label}</a>)}</nav><p className="text-xs text-hero-muted">Fémben gondolkodunk. Generációk óta.</p></div><div className="mx-auto max-w-[1440px] border-t border-steel px-5 py-5 text-xs text-ink-muted md:px-10 lg:px-14">© {new Date().getFullYear()} Vasmester és Fiai. Minden jog fenntartva.</div></footer>
  </div>;
}