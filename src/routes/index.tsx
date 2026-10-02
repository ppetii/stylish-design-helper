import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Facebook, ArrowRight, ArrowDown, Menu, X, ShieldCheck, Settings, ScanLine, Paintbrush, PackageCheck, UsersRound, Fence, Factory, Ruler, Warehouse, Waypoints, PanelsTopLeft, MessageSquare, PencilRuler, Truck, Mail, Phone, MapPin, CheckCircle2, ImagePlus, X as XIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitQuoteRequest } from "@/lib/quote.functions";
import { Button } from "@/components/ui/button";
import emblem from "@/assets/Vasmester.png.asset.json";
import hero from "@/assets/welding-hero.jpg";
import gate from "@/assets/steel-gate.jpg";
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

const nav = [["Kezdőlap", "#kezdolap"], ["Szolgáltatások", "#szolgaltatasok"], ["Munkáink", "/munkaink"], ["Rólunk", "#rolunk"], ["Kapcsolat", "#kapcsolat"]];
const services = [
  { title: "Kapuk és kerítések", desc: "Egyedi tervezés, gyártás és szerelés", img: gate, Icon: Fence },
  { title: "Acélszerkezetek", desc: "Ipari és lakossági projektekhez", img: structure, Icon: Factory },
  { title: "Lépcsők és korlátok", desc: "Beltéri és kültéri megoldások", img: stairs, Icon: Ruler },
  { title: "Előtetők", desc: "Stílusos és tartós kivitelezés", img: canopy, Icon: Warehouse },
  { title: "Hegesztési munkák", desc: "MIG/MAG, TIG, bevontelektródás", img: hero, Icon: Waypoints },
  { title: "Egyedi fémszerkezetek", desc: "Az Ön elképzelései alapján", img: custom, Icon: PanelsTopLeft },
];
const projectTypes = ["Kapu vagy kerítés", "Acélszerkezet", "Lépcső vagy korlát", "Előtető", "Hegesztési munka", "Egyedi fémszerkezet", "Egyéb"];

function Brand() {
  return <a href="#kezdolap" className="flex shrink-0 items-center gap-2.5 text-hero-foreground" aria-label="Vasmester és Fiai – Kezdőlap">
    <img src={emblem.url} alt="" className="h-11 w-9 object-contain sm:h-12 sm:w-10" />
    <span className="font-display text-xl font-extrabold uppercase leading-none sm:text-2xl"><span className="block text-primary">Vasmester</span><span className="block">és Fiai</span><span className="mt-1 block font-sans text-[8px] font-semibold tracking-[.19em] text-hero-muted sm:text-[9px]">FÉMIPARI MEGOLDÁSOK</span></span>
  </a>;
}

const inputCls = "h-11 w-full border border-border bg-background px-3 font-sans text-sm font-normal normal-case outline-none focus:border-primary";

function QuoteForm() {
  const submitQuote = useServerFn(submitQuoteRequest);
  const formRef = useRef<HTMLFormElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setPhotoPreview(null); setPhotoName(null); return; }
    if (file.size > 10 * 1024 * 1024) { setError("A fotó mérete legfeljebb 10 MB lehet."); e.target.value = ""; return; }
    setError(null);
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    const input = formRef.current?.elements.namedItem("photo") as HTMLInputElement | null;
    if (input) input.value = "";
    setPhotoPreview(null); setPhotoName(null);
  }

  function setPhotoFile(file: File) {
    const input = formRef.current?.elements.namedItem("photo") as HTMLInputElement | null;
    if (!input) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    handlePhotoChange({ target: input } as ChangeEvent<HTMLInputElement>);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (!String(fd.get("email") ?? "").trim() && !String(fd.get("phone") ?? "").trim()) {
      setError("Kérjük, adjon meg e-mail címet vagy telefonszámot.");
      return;
    }
    const file = fd.get("photo");
    if (file instanceof File && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        setError("A fotó mérete legfeljebb 10 MB lehet.");
        return;
      }
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error());
          reader.readAsDataURL(file);
        });
        fd.set("photoBase64", dataUrl.split(",")[1] ?? "");
        fd.set("photoType", file.type);
      } catch {
        setError("A fotó beolvasása nem sikerült. Kérjük, próbálja újra.");
        return;
      }
    }
    setError(null);
    setStatus("sending");
    try {
      await submitQuote({ data: fd });
      setStatus("sent");
      form.reset();
      setPhotoPreview(null); setPhotoName(null);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error && err.message ? err.message : "Az elküldés nem sikerült. Kérjük, próbálja újra.");
    }
  }

  if (status === "sent") return <div className="flex flex-col items-center border border-border bg-muted/40 px-6 py-12 text-center">
    <CheckCircle2 className="size-12 text-primary" strokeWidth={1.5} />
    <h3 className="mt-4 font-display text-2xl font-bold">Köszönjük a megkeresést!</h3>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Ajánlatkérését megkaptuk, referenciafotójával együtt megvizsgáljuk, és 1–2 munkanapon belül felvesszük Önnel a kapcsolatot.</p>
    <Button variant="industrialOutline" size="lg" onClick={() => setStatus("idle")} className="mt-6 h-11 px-6 text-xs">Új ajánlatkérés</Button>
  </div>;

  return <div className="space-y-6"><div className="border-l-4 border-primary bg-muted/50 p-5"><p className="font-display text-2xl font-bold uppercase">Mennyibe kerül?</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Minden munkát egyedileg árazunk, mert nincs két egyforma projekt. Az ajánlat elkészítéséhez küldjön néhány alapadatot, méretet és lehetőség szerint fényképet.</p></div><form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
    <label className="grid gap-2 text-xs font-bold uppercase">Név *<input name="name" required maxLength={100} autoComplete="name" className={inputCls} placeholder="Az Ön neve" /></label>
    <label className="grid gap-2 text-xs font-bold uppercase">Projekt típusa *<select name="projectType" required defaultValue="" className={inputCls}><option value="" disabled>Válasszon…</option>{projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
    <label className="grid gap-2 text-xs font-bold uppercase">E-mail<input name="email" type="email" maxLength={255} autoComplete="email" className={inputCls} placeholder="E-mail címe" /></label>
    <label className="grid gap-2 text-xs font-bold uppercase">Telefonszám<input name="phone" type="tel" maxLength={30} autoComplete="tel" className={inputCls} placeholder="Telefonszáma" /></label>
    <label className="grid gap-2 text-xs font-bold uppercase">Méretek<input name="dimensions" maxLength={200} className={inputCls} placeholder="pl. 400 × 200 cm" /></label>
    <label className="grid gap-2 text-xs font-bold uppercase">Helyszín, település<input name="location" maxLength={200} className={inputCls} placeholder="pl. Budapest, XI. kerület" /></label>
    <label className="grid gap-2 border-l-4 border-primary pl-3 text-sm font-bold uppercase sm:col-span-2"><span>Mi lenne az elképzelése? <span className="font-normal normal-case text-muted-foreground">– a projekt leírása</span></span><textarea name="message" rows={6} maxLength={2000} className="resize-y border border-border bg-background p-3 font-sans text-sm font-normal normal-case outline-none focus:border-primary" placeholder="Írja le részletesen a tervet: milyen szerkezetet szeretne, anyag, stílus, színek, nyitásirány, határidő és minden fontos részlet…" /></label>
    <div className="grid gap-2 border-l-4 border-primary pl-3 text-sm font-bold uppercase sm:col-span-2"><span className="flex items-center gap-2"><ImagePlus className="size-4 text-primary" />Fotót is küldhet</span>
      {photoPreview ? <div className="flex items-center gap-3 border border-border bg-muted/40 p-3">
        <img src={photoPreview} alt="Feltöltött referenciafotó előnézete" className="h-16 w-16 shrink-0 object-cover" />
        <p className="min-w-0 flex-1 truncate text-xs font-normal normal-case text-muted-foreground">{photoName}</p>
        <button type="button" onClick={removePhoto} aria-label="Fotó eltávolítása" className="text-muted-foreground hover:text-primary"><XIcon className="size-5" /></button>
      </div> : <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) setPhotoFile(file); }}
        className="flex flex-wrap items-center justify-center gap-2 border border-dashed border-border bg-muted/30 px-3 py-6 text-muted-foreground"
      >
        <ImagePlus className="size-5 text-primary" />
        <p className="text-xs font-normal normal-case">Húzza ide a fotót, vagy</p>
        <label htmlFor="quote-photo" className="cursor-pointer text-xs font-bold normal-case text-primary underline underline-offset-2">válasszon fájlt</label>
        <input id="quote-photo" type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="sr-only" />
      </div>}
      <p className="text-[11px] font-normal normal-case text-muted-foreground">JPG, PNG vagy WEBP, legfeljebb 10 MB. Opcionális, de segít a pontos ajánlatban.</p>
    </div>
    {error && <p role="alert" className="text-xs font-semibold text-destructive sm:col-span-2">{error}</p>}
    <p className="text-xs text-muted-foreground sm:col-span-2">A megadott adatokat kizárólag az ajánlatadás céljából kezeljük.</p>
    <Button variant="industrial" type="submit" disabled={status === "sending"} className="h-11 px-6 text-xs sm:col-span-2 sm:justify-self-start">{status === "sending" ? "Küldés…" : "Ajánlatot kérek"} <ArrowRight /></Button>
  </form></div>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
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
            <h1 className="font-display text-[clamp(4rem,7vw,7.25rem)] font-extrabold uppercase leading-[0.95]"><span className="block text-primary">Vasmester</span><span className="mt-2 block">és Fiai</span></h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-hero-muted sm:text-lg">Egyedi fémszerkezetek, lakatos munkák és komplett acélszerkezetek – a tervezéstől a kivitelezésig.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button variant="industrial" size="lg" asChild className="h-12 px-6 text-xs"><a href="#kapcsolat">Ajánlatkérés <ArrowRight /></a></Button><Button variant="industrialOutline" size="lg" asChild className="h-12 px-6 text-xs"><a href="/munkaink">Munkáink megtekintése</a></Button></div>
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


      <section id="rolunk" className="scroll-mt-20 bg-background"><div className="mx-auto w-full max-w-3xl px-5 py-16 md:px-10 lg:py-24"><h2 className="section-title text-4xl sm:text-5xl">Rólunk</h2><div className="red-rule mt-3 mb-7" /><div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base"><p className="font-display text-2xl font-bold leading-tight text-foreground">Nem csak fémet formálunk. Évtizedek tapasztalatát visszük tovább.</p><p>A Vasmester és Fiai Kft. egy családi szemléletű, fémipari vállalkozás, ahol a szakmai tapasztalat, a precíz kivitelezés és a modern megoldások találkoznak.</p><p>Számunkra a fém nem egyszerű alapanyag. Egy jól megtervezett szerkezet hosszú évekre készül – legyen szó egy elegáns kapuról, egy tartós kerítésről, egy lépcsőről, előtetőről vagy akár egy komplett acélszerkezetről.</p><p className="font-display text-xl font-bold text-foreground">A nevünket adjuk a munkánkhoz.</p><p>Minden projektet az első egyeztetéstől a tervezésen és gyártáson át egészen a helyszíni szerelésig figyelemmel kísérünk. Hiszünk abban, hogy a jó munka nem a műhelyben kezdődik, hanem azzal, hogy pontosan megértjük, mit szeretne az ügyfél.</p><p>Az egyedi elképzeléseket nem problémának, hanem feladatnak tekintjük. Legyen szó különleges méretről, egyedi formáról vagy összetett műszaki megoldásról, célunk, hogy az elképzelésből olyan szerkezet szülessen, amely esztétikus, funkcionális és hosszú távon is megbízható.</p><p className="font-display text-xl font-bold text-foreground">Hagyományból építkezünk, de előre tekintünk.</p><p>A Vasmester és Fiai név számunkra a szakma iránti tiszteletet és a továbbadott tudást jelenti. Amit korábban tapasztalatból tanultunk, azt ma korszerű technológiákkal, pontosabb tervezéssel és folyamatosan fejlődő megoldásokkal ötvözzük.</p><p className="border-l-2 border-primary pl-4 italic text-foreground">Mert hisszük, hogy egy jó szerkezet nem attól lesz értékes, hogy elkészül.<br />Hanem attól, hogy évek múlva is megállja a helyét.</p><p className="text-xs font-bold uppercase text-primary">Vasmester és Fiai – Fémipari megoldások a tervezéstől a megvalósításig.</p></div><Button variant="industrial" size="lg" asChild className="mt-8 h-11 px-6 text-xs"><a href="#kapcsolat">Beszéljünk a tervéről <ArrowRight /></a></Button></div></section>

      <section className="bg-ink py-14 text-hero-foreground md:py-20"><div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14"><div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="section-title text-4xl sm:text-5xl">Így <span className="text-primary">dolgozunk</span></h2><div className="red-rule mt-3" /></div><p className="text-sm text-hero-muted">Egyszerű folyamat, megbízható eredmény.</p></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{[[MessageSquare,"Felmérés","Megismerjük az igényeket, egyeztetjük a részleteket."],[PencilRuler,"Tervezés","Egyedi megoldást dolgozunk ki."],[Settings,"Gyártás","Precíz, minőségi kivitelezés."],[Paintbrush,"Felületkezelés","Tartós korrózióvédelem és festés."],[Truck,"Szállítás","Biztonságos szállítás a helyszínre."],[Factory,"Helyszíni szerelés","Pontos, megbízható megvalósítás."],[PackageCheck,"Átadás","Közös átvétel, ellenőrzött minőség."]].map(([Icon,title,desc],index) => { const Symbol = Icon as typeof MessageSquare; return <div className="relative border-l border-steel pl-5" key={title as string}><span className="font-display text-5xl font-bold text-steel">0{index+1}</span><Symbol className="absolute left-[4.5rem] top-2 size-7 text-primary" strokeWidth={1.5}/><h3 className="mt-2 font-display text-xl font-bold">{title as string}</h3><p className="mt-1 max-w-[200px] text-xs leading-relaxed text-hero-muted">{desc as string}</p></div> })}</div></div></section>

      <section className="relative isolate bg-steel py-12 text-hero-foreground"><img src={structure} alt="" loading="lazy" width={1024} height={768} className="absolute inset-0 -z-20 h-full w-full object-cover object-center" /><div className="banner-shade absolute inset-0 -z-10" /><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 md:flex-row md:items-center md:px-10 lg:px-14"><div><p className="text-xs font-bold uppercase text-primary">Van egy elképzelése?</p><h2 className="section-title mt-2 text-4xl sm:text-5xl">Valósítsuk meg együtt!</h2><p className="mt-3 text-sm text-hero-muted">Kérjen árajánlatot, és találjuk meg együtt a legjobb megoldást!</p></div><Button variant="industrial" size="lg" asChild className="h-12 shrink-0 px-7 text-xs"><a href="#kapcsolat">Ajánlatkérés <ArrowRight /></a></Button></div></section>

      <section id="kapcsolat" className="scroll-mt-20 bg-background py-16 md:py-20"><div className="mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-14"><div><p className="text-xs font-bold uppercase text-primary">Kapcsolat</p><h2 className="section-title mt-2 text-4xl sm:text-5xl">Kérjen ajánlatot</h2><div className="red-rule mt-4 mb-6" /><p className="max-w-md text-sm leading-7 text-muted-foreground">Írja meg, milyen munkára lenne szüksége, és vegye fel velünk a kapcsolatot.</p><div className="mt-8 space-y-5 text-sm"><a className="flex items-center gap-3 hover:text-primary" href="tel:+36305187678"><Phone className="size-5 text-primary" />+36 30 518 7678</a><a className="flex items-center gap-3 hover:text-primary" href="tel:+36304017535"><Phone className="size-5 text-primary" />+36 30 401 7535</a><a className="flex items-center gap-3 hover:text-primary" href="mailto:vasmesteresfiaikft@gmail.com"><Mail className="size-5 text-primary" />vasmesteresfiaikft@gmail.com</a><p className="flex items-center gap-3"><MapPin className="size-5 text-primary" />Budapest és környéke</p><div className="flex flex-wrap gap-x-8 gap-y-3"><a className="flex items-center gap-3 hover:text-primary" href="https://www.facebook.com/p/Vasmester-%C3%A9s-Fiai-Kft-61579233614778/" target="_blank" rel="noopener noreferrer"><Facebook className="size-5 text-primary" />Kövessen minket a Facebookon</a><a className="flex items-center gap-3 hover:text-primary" href="https://www.google.com/maps?q=Erd%C5%91kertes,+Vasmester+%C3%A9s+fiai+kft,+Liszt+Ferenc+utca+2,+2113&ftid=0x4741cdbd48f3e717:0x86e786a8b440e99d" target="_blank" rel="noopener noreferrer"><MapPin className="size-5 text-primary" />Google-profilunk megtekintése</a></div></div></div><QuoteForm /></div></section>
    </main>
    <footer className="bg-ink text-hero-foreground"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-10 md:flex-row md:items-center md:px-10 lg:px-14"><Brand /><nav aria-label="Lábléc navigáció" className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-hero-muted">{nav.map(([label,href]) => <a href={href} key={href} className="hover:text-hero-foreground">{label}</a>)}</nav><div className="flex items-center gap-4"><a href="https://www.facebook.com/p/Vasmester-%C3%A9s-Fiai-Kft-61579233614778/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-hero-muted hover:text-primary"><Facebook className="size-6" /></a><a href="https://www.google.com/maps?q=Erd%C5%91kertes,+Vasmester+%C3%A9s+fiai+kft,+Liszt+Ferenc+utca+2,+2113&ftid=0x4741cdbd48f3e717:0x86e786a8b440e99d" target="_blank" rel="noopener noreferrer" aria-label="Google-profil" className="text-hero-muted hover:text-primary"><MapPin className="size-6" /></a></div></div><div className="mx-auto grid max-w-[1440px] gap-2 border-t border-steel px-5 py-6 text-xs text-hero-muted sm:grid-cols-2 md:px-10 lg:grid-cols-3 lg:px-14"><p><span className="font-bold text-hero-foreground">Vasmester és fiai Kft.</span></p><p>Cégjegyzékszám: 13-09-217172</p><p>Adószám: 27540712-2-13</p><p>Székhely: 2113 Erdőkertes, Liszt Ferenc utca 2.</p><p>Működési terület: Budapest és környéke</p><p>vasmesteresfiaikft@gmail.com · +36 30 518 7678 · +36 30 401 7535</p></div><div className="mx-auto max-w-[1440px] border-t border-steel px-5 py-5 text-xs text-ink-muted md:px-10 lg:px-14">© {new Date().getFullYear()} Vasmester és Fiai Kft. Minden jog fenntartva.</div></footer>
  </div>;
}