"use client";

import { useEffect, useRef, useState } from "react";
import { type Session, type LiveServerMessage } from "@google/genai";
import { Conversation } from "@elevenlabs/client";
import { useRouter } from "next/navigation";
import { brugRef } from "@/lib/assistent-brug";
import { formulier } from "@/lib/assistent-formulier";
import { KOZIJN_TYPEN } from "@/lib/kozijntypen";
import { VULLERS } from "@/lib/roos-vullers";
import { ROOS_PRODUCTEN } from "@/lib/roos-producten";
import { Maximize2, Mic, Minimize2, PhoneOff, Send, Sparkles, X } from "lucide-react";

const MAX_SECONDEN = 15 * 60; // een gesprek stopt hoe dan ook na een kwartier
const STILTE_SECONDEN = 120; // en eerder als er twee minuten niemand iets zegt
const BAL = "radial-gradient(circle at 30% 28%, #ffffff 0%, #9ce6e6 28%, #2792dc 75%, #1b6fb0 100%)";
const VOORBEELDEN = [
  { kort: "Dubbel of triple glas?", vraag: "Wat is het verschil tussen dubbel en triple glas?" },
  { kort: "Welk kozijn past bij mij?", vraag: "Welk kozijn past bij mijn woonkamer?" },
  { kort: "Hoe werkt de offerte?", vraag: "Hoe werkt de offerte?" },
];

type Bericht = { rol: "roos" | "jij"; tekst: string };

function Orb({ refEl, groot = false, ademen = true }: { refEl?: React.RefObject<HTMLDivElement | null>; groot?: boolean; ademen?: boolean }) {
  return (
    <div
      ref={refEl}
      className={`${groot ? "size-36" : "size-20"} rounded-full transition-transform duration-300 ease-out`}
      style={{
        background: BAL,
        boxShadow: "0 12px 30px rgba(39,146,220,0.35)",
        animation: ademen ? "orb-ademen 4s ease-in-out infinite" : undefined,
      }}
    />
  );
}

const CAPTURE_WORKLET = `
class Cap extends AudioWorkletProcessor {
  constructor(){ super(); this.ratio = sampleRate / 16000; this.acc = 0; this.n = 0; this.out = []; }
  process(inputs){
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      this.acc += ch[i]; this.n++;
      if (this.n >= this.ratio) { this.out.push(this.acc / this.n); this.acc = 0; this.n = 0; }
    }
    if (this.out.length >= 640) {
      const i16 = new Int16Array(this.out.length);
      for (let j = 0; j < this.out.length; j++) { const v = Math.max(-1, Math.min(1, this.out[j])); i16[j] = v < 0 ? v * 32768 : v * 32767; }
      this.port.postMessage(i16.buffer, [i16.buffer]);
      this.out = [];
    }
    return true;
  }
}
registerProcessor("cap", Cap);
`;

function naarBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

type Stand = "uit" | "verbinden" | "aan";

function Chat({ ingebed = false }: { ingebed?: boolean }) {
  const [open, setOpen] = useState(ingebed);
  const [uitgeklapt, setUitgeklapt] = useState(false);
  const [klein, setKlein] = useState(false);
  const [toonGesprek, setToonGesprek] = useState(false);
  const [berichten, setBerichten] = useState<Bericht[]>([]);
  const [tekst, setTekst] = useState("");
  const [fout, setFout] = useState("");
  const [typen, setTypen] = useState(false);
  const [stand, setStand] = useState<Stand>("uit");
  const [praat, setPraat] = useState(false);
  const praatRef = useRef(false);
  useEffect(() => {
    praatRef.current = praat;
  }, [praat]);
  const [stem] = useState("Aoede");
  const [model] = useState("gemini-3.8-live");

  const bol = useRef<HTMLDivElement>(null);
  const laatsteGeluid = useRef(0);
  const stilteTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lijst = useRef<HTMLDivElement>(null);
  const sessie = useRef<Session | null>(null);
  const typenRef = useRef(false);
  const ctxIn = useRef<AudioContext | null>(null);
  const ctxUit = useRef<AudioContext | null>(null);
  const analyserIn = useRef<AnalyserNode | null>(null);
  const analyserUit = useRef<AnalyserNode | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const volgende = useRef(0);
  const bronnen = useRef<AudioBufferSourceNode[]>([]);
  const laatsteRol = useRef<"roos" | "jij" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ronde = useRef(0);

  const verbonden = stand === "aan";
  const bezig = stand === "verbinden";
  const actief = verbonden || bezig;

  function voegToe(rol: "roos" | "jij", tekstDeel: string) {
    laatsteGeluid.current = Date.now();
    const vorige = laatsteRol.current;
    laatsteRol.current = rol;
    setBerichten((b) => {
      if (vorige === rol && b.length > 0) {
        const kopie = b.slice();
        kopie[kopie.length - 1] = { rol, tekst: kopie[kopie.length - 1].tekst + tekstDeel };
        return kopie;
      }
      return [...b, { rol, tekst: tekstDeel.trimStart() }];
    });
  }

  function stopAfspelen() {
    bronnen.current.forEach((s) => {
      try {
        s.stop();
      } catch {}
    });
    bronnen.current = [];
    volgende.current = 0;
    setPraat(false);
  }

  const afsluiten = useRef(false);
  const laatsteUitGeluid = useRef(0);
  const VULLERS_UIT = true as boolean;
  function speelVuller(soort: "reactie" | "wacht") {
    if (VULLERS_UIT) return;
    if (typenRef.current || bronnen.current.length) return;
    const lijst = VULLERS[soort];
    if (!lijst.length) return;
    speel(lijst[Math.floor(Math.random() * lijst.length)].pcm);
  }

  function speel(b64: string) {
    if (typenRef.current) return;
    const ctx = ctxUit.current;
    if (!ctx || !analyserUit.current) return;
    const bin = atob(b64);
    const n = bin.length >> 1;
    const buf = ctx.createBuffer(1, n, 24000);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) {
      const v = (bin.charCodeAt(i * 2) | (bin.charCodeAt(i * 2 + 1) << 8)) << 16 >> 16;
      data[i] = v / 32768;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(analyserUit.current);
    const eerste = bronnen.current.length === 0 || volgende.current < ctx.currentTime;
    const t = eerste ? ctx.currentTime + 0.05 : volgende.current;
    src.start(t);
    laatsteUitGeluid.current = performance.now();
    volgende.current = t + buf.duration;
    bronnen.current.push(src);
    setPraat(true);
    src.onended = () => {
      laatsteUitGeluid.current = performance.now();
      bronnen.current = bronnen.current.filter((x) => x !== src);
      if (bronnen.current.length === 0) setPraat(false);
    };
  }

  const router = useRouter();

  // De klant tikt zelf in het formulier: na een korte pauze laten we Roos dat weten, zodat ze meteen doorgaat.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const bijTik = (e: Event) => {
      const veld = (e as CustomEvent<{ veld: string }>).detail?.veld;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const w = formulier.waarden;
        if (!sessie.current) return;
        if (veld === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(w.email)) return; // pas melden als het adres compleet is
        sessie.current.sendRealtimeInput({ text: veld === "email" ? "Ik heb mijn e-mailadres ingetypt." : "Ik heb het in het formulier aangepast." });
      }, 1800);
    };
    window.addEventListener("roos-formulier-getikt", bijTik);
    return () => {
      window.removeEventListener("roos-formulier-getikt", bijTik);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const [overdracht, setOverdracht] = useState("");
  const [autoStart, setAutoStart] = useState(false);
  useEffect(() => {
    const hervat = () => ctxUit.current?.resume().catch(() => {});
    window.addEventListener("pointerdown", hervat);
    window.addEventListener("keydown", hervat);
    return () => {
      window.removeEventListener("pointerdown", hervat);
      window.removeEventListener("keydown", hervat);
    };
  }, []);
  useEffect(() => {
    if (autoStart && overdracht) {
      setAutoStart(false);
      verderPraten();
    }
  }, [autoStart, overdracht]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("roos");
      if (p) {
        setOverdracht(p);
        setOpen(true);
        setAutoStart(true);
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch {}
  }, []);
  // Komt de bezoeker uit de chat met een prijs (?uitchat=1), dan opent Roos meteen en begint het gesprek.
  const uitChatGestart = useRef(false);
  useEffect(() => {
    if (uitChatGestart.current) return;
    try {
      if (new URLSearchParams(window.location.search).get("uitchat") !== "1") return;
    } catch {
      return;
    }
    uitChatGestart.current = true;
    setOpen(true);
    setTimeout(() => void begin(false), 800);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function verderPraten() {
    if (!overdracht) return;
    const tekst =
      "[Overdracht van de website] De klant praatte net met je op de website van BartMooi en is nu doorgestuurd naar de offerte-app. Dit is al besproken: " +
      overdracht +
      ". Begroet de klant NIET opnieuw en stel je niet opnieuw voor. Ga direct door alsof het één gesprek is. Zet alleen in de calculator wat de klant echt heeft gezegd, met open_kozijn en zet_keuzes. Heeft de klant nog geen kozijntype genoemd, open dan niets en vraag welk kozijn hij wil. Verzin nooit een type of maat.";
    setOverdracht("");
    void begin(false, tekst, true);
  }

  /** Roos bedient de calculator en het formulier. Prijzen worden niet teruggegeven: die noemt ze nooit. */
  async function voerUit(naam: string, input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const zonderPrijs = (x: unknown) => {
      if (!x || typeof x !== "object") return x;
      const { prijsInEuro, prijsInclusief, horPrijs, ...rest } = x as Record<string, unknown>;
      void prijsInEuro; void prijsInclusief;
      return { ...rest, horrenBeschikbaar: typeof horPrijs === "number" && horPrijs > 0 };
    };
    const wacht = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const brug = () => brugRef.current;
    if (naam === "ga_naar_product") {
      const groepen = ["kozijnen", "aluminium-kozijnen", "deuren", "schuifpui", "harmonicadeur", "rolluiken", "horren"];
      if (!groepen.includes(String(input.groep))) return { fout: "Onbekende productgroep." };
      router.push(input.groep === "aluminium-kozijnen" ? "/aluminium/kozijnen" : `/${input.groep}`);
      if (input.groep === "aluminium-kozijnen") {
        return { ok: true, pagina: "aluminium kozijnen", let_op: "Bij aluminium kun je de calculator niet zelf invullen. Laat de klant zelf een type kiezen en help hem met uitleg." };
      }
      return { ok: true, pagina: String(input.groep) };
    }
    if (naam === "open_product") {
      const prod = ROOS_PRODUCTEN[String(input.product)];
      if (!prod) return { fout: "Onbekend product." };
      const type = String(input.type ?? "");
      if (!prod.typen[type]) return { fout: "Onbekend type. Kies uit: " + Object.keys(prod.typen).join(", ") };
      if (window.location.pathname.startsWith(prod.pad) && brug()) {
        brug()!.zet({ type });
        await wacht(40);
        return zonderPrijs(brug()!.staat()) as Record<string, unknown>;
      }
      router.push(prod.pad + type);
      const oud = brug();
      for (let i = 0; i < 40 && (!brug() || brug() === oud); i++) await wacht(50);
      return (zonderPrijs(brug()?.staat()) as Record<string, unknown>) ?? { fout: "De calculator kon niet geopend worden." };
    }
    if (naam === "open_kozijn") {
      if (!KOZIJN_TYPEN.some((t) => t.slug === input.type)) return { fout: "Onbekend kozijntype. Vraag de klant welk kozijn hij wil en kies een type uit de lijst." };
      const slug = String(input.type);
      if (window.location.pathname.startsWith("/kozijnconfigurator") && brug()) {
        brug()!.zet({ type: slug });
      } else {
        const oud = brug();
        router.push(`/kozijnconfigurator/${slug}`);
        for (let i = 0; i < 40 && (!brug() || brug() === oud); i++) await wacht(50);
      }
      await wacht(40);
      return (zonderPrijs(brug()?.staat()) as Record<string, unknown>) ?? { fout: "De calculator kon niet geopend worden." };
    }
    if (naam === "lees_offerte") {
      for (let i = 0; i < 25 && !document.querySelector("[data-roos-product]"); i++) await wacht(150);
      const zeg = (n: number) => {
        const euro = Math.floor(n + 0.0001);
        const cent = Math.round((n - euro) * 100);
        return `${euro} euro${cent ? ` en ${cent} cent` : ""}`;
      };
      const producten = Array.from(document.querySelectorAll<HTMLElement>("[data-roos-product]")).map((el) => {
        const prijs = Number(el.dataset.roosPrijs);
        return { product: el.dataset.roosProduct, prijsUitgesproken: zeg(prijs), btw: el.dataset.roosBtw, specificaties: el.innerText.replace(/\n{2,}/g, "\n").trim().slice(0, 1200) };
      });
      if (!producten.length) return { fout: "De offerte is nog niet te zien." };
      const totEl = document.querySelector<HTMLElement>("[data-roos-totaal]");
      const totaal = totEl ? Number(totEl.dataset.roosTotaal) : Array.from(document.querySelectorAll<HTMLElement>("[data-roos-product]")).reduce((a, el) => a + Number(el.dataset.roosPrijs), 0);
      return { producten, totaalUitgesproken: zeg(totaal), btw: producten[0].btw, let_op: "Noem bedragen precies zoals bij 'Uitgesproken' staat. Reken nooit zelf." };
    }
    if (naam === "ga_naar_akkoord") {
      const el = document.getElementById("digitaal-akkoord");
      if (!el) return { fout: "Het akkoordvak is hier niet te zien." };
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      return { ok: true };
    }
    if (naam === "lees_formulier") return { formulierOpen: formulier.open, ...formulier.waarden };
    if (naam === "vul_formulier") {
      if (!formulier.open) return { fout: "Het formulier is nog niet open. Gebruik eerst open_formulier." };
      formulier.vul?.(input as never);
      await wacht(60);
      return { ok: true, ...formulier.waarden };
    }
    if (naam === "verstuur_formulier") {
      if (!formulier.open || !formulier.verstuur) return { fout: "Het formulier is niet open." };
      const r = await formulier.verstuur();
      if (!r.ok) return { ...r };
      if (r.offerteId) router.push(`/offerte/${r.offerteId}`);
      afsluiten.current = true;
      const offerte = await voerUit("lees_offerte", {});
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { ok: true, opmerking: "Aangevraagd. De offerte staat nu op het scherm.", offerte };
    }
    if (naam === "voeg_product_toe") {
      if (!brug()) return { fout: "Er is nog geen product open." };
      brug()!.voegToeAanOfferte?.();
      await wacht(60);
      return { ok: true, opmerking: "Opgeslagen. Stel nu de maten en keuzes in voor het volgende product." };
    }
    if (!brug()) return { fout: "Er is nog geen kozijn open. Gebruik eerst open_kozijn." };
    if (naam === "open_formulier") {
      brug()!.toonFormulier();
      await wacht(80);
      return { ok: true, formulierOpen: formulier.open };
    }
    if (naam === "zet_keuzes") {
      brug()!.zet(input);
      await wacht(60);
      return zonderPrijs(brug()!.staat()) as Record<string, unknown>;
    }
    return { fout: "Onbekende functie" };
  }

  async function bijToolCall(m: LiveServerMessage) {
    const calls = m.toolCall?.functionCalls;
    if (!calls?.length) return;
    const momentje = setTimeout(() => speelVuller("wacht"), 500);
    if (ingebed) {
      for (const c of calls) {
        if (c.name !== "naar_offerte") continue;
        const samenvatting = String((c.args as { samenvatting?: string } | undefined)?.samenvatting ?? "");
        try {
          sessie.current?.sendToolResponse({ functionResponses: [{ id: c.id, name: c.name, response: { output: { ok: true } } }] });
        } catch {}
        setTimeout(() => {
          try {
            window.parent.postMessage({ soort: "roos-ga", samenvatting }, "*");
          } catch {}
        }, 1800);
      }
      clearTimeout(momentje);
      return;
    }
    const antwoorden: { id?: string; name?: string; response: Record<string, unknown> }[] = [];
    for (const c of calls) {
      let response: Record<string, unknown>;
      try {
        const uit = await voerUit(c.name ?? "", (c.args ?? {}) as Record<string, unknown>);
        if (process.env.NODE_ENV !== "production") console.info("Roos actie:", c.name, JSON.stringify(c.args ?? {}), "=>", JSON.stringify(uit).slice(0, 300));
        response = { output: uit };
      } catch (e) {
        response = { fout: String((e as Error)?.message ?? e) };
      }
      const opAchtergrond = ["ga_naar_product", "open_product", "open_kozijn", "zet_keuzes", "voeg_product_toe", "open_formulier", "vul_formulier", "ga_naar_akkoord"].includes(c.name ?? "");
      antwoorden.push({ id: c.id, name: c.name, response: opAchtergrond ? { ...response, scheduling: "WHEN_IDLE" } : response });
    }
    clearTimeout(momentje);
    try {
      sessie.current?.sendToolResponse({ functionResponses: antwoorden });
    } catch {}
  }

  function bij(m: LiveServerMessage) {
    if (m.toolCall) void bijToolCall(m);
    const sc = m.serverContent;
    if (!sc) return;
    if (sc.interrupted) {
      stopAfspelen();
    }
    for (const p of sc.modelTurn?.parts ?? []) if (p.inlineData?.data) speel(p.inlineData.data);
    if (sc.inputTranscription?.text) voegToe("jij", sc.inputTranscription.text);
    if (sc.outputTranscription?.text) voegToe("roos", sc.outputTranscription.text);
    if (sc.turnComplete) {
      laatsteRol.current = null;
      if (afsluiten.current) {
        afsluiten.current = false;
        const klaar = setInterval(() => {
          if (bronnen.current.length || performance.now() - laatsteUitGeluid.current < 800) return;
          clearInterval(klaar);
          setTimeout(() => sluit(), 350);
        }, 250);
      }
    }
  }

  function opruimen() {
    ronde.current++;
    if (timer.current) clearTimeout(timer.current);
    if (stilteTimer.current) clearInterval(stilteTimer.current);
    stilteTimer.current = null;
    timer.current = null;
    try {
      sessie.current?.close();
    } catch {}
    sessie.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    ctxIn.current?.close().catch(() => {});
    ctxIn.current = null;
    stopAfspelen();
    ctxUit.current?.close().catch(() => {});
    ctxUit.current = null;
    analyserIn.current = null;
    analyserUit.current = null;
    laatsteRol.current = null;
    setStand("uit");
  }

  async function begin(modusTypen: boolean, eersteVraag?: string, verborgen = false) {
    if (actief) return;
    const mijn = ++ronde.current;
    const afgebroken = () => ronde.current !== mijn;
    setFout("");
    setTypen(modusTypen);
    typenRef.current = modusTypen;
    setStand("verbinden");
    try {
      if (!modusTypen) {
        try {
          stream.current = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          });
        } catch {
          setFout("Zet je microfoon aan om te praten, of kies Liever typen.");
          setStand("uit");
          return;
        }
        if (afgebroken()) {
          stream.current?.getTracks().forEach((t) => t.stop());
          return;
        }
      }
      // ---- ElevenLabs: de agent luistert, denkt en praat; de acties voert de browser uit (client tools) ----
      const r = await fetch("/api/elevenlabs-token", { method: "POST" });
      const d = await r.json();
      if (afgebroken()) return;
      if (!d.signedUrl) throw new Error(d.fout || "Geen toegang");
      const uur = Number(new Intl.DateTimeFormat("nl-NL", { hour: "numeric", hour12: false, timeZone: "Europe/Amsterdam" }).format(new Date()));
      const groet = uur < 6 ? "Goedenavond" : uur < 12 ? "Goedemorgen" : uur < 18 ? "Goedemiddag" : "Goedenavond";
      const NAMEN = ["ga_naar_product", "open_product", "open_kozijn", "zet_keuzes", "voeg_product_toe", "open_formulier", "vul_formulier", "lees_formulier", "verstuur_formulier", "lees_offerte", "ga_naar_akkoord"];
      const clientTools = Object.fromEntries(
        NAMEN.map((naam) => [
          naam,
          async (params: Record<string, unknown>) => {
            const p = { ...(params ?? {}) };
            if (p.soort !== undefined && p.type === undefined) p.type = p.soort; // bij ElevenLabs heet "type" hier "soort"
            const uit = await voerUit(naam, p);
            if (process.env.NODE_ENV !== "production") console.info("Roos actie:", naam, JSON.stringify(p), "=>", JSON.stringify(uit).slice(0, 300));
            return JSON.stringify(uit);
          },
        ]),
      );
      // Komt de bezoeker uit de chat met een kozijn (?uitchat=1&b=..&h=..), dan weet Roos dat na haar begroeting.
      const vanChat = (() => {
        try {
          const q = new URLSearchParams(window.location.search);
          if (q.get("uitchat") !== "1") return "";
          const type = window.location.pathname.split("/").filter(Boolean).pop() ?? "";
          const naam = KOZIJN_TYPEN.find((t) => t.slug === type)?.naam ?? Object.values(ROOS_PRODUCTEN).map((p) => p.typen[type]).find(Boolean) ?? type.replace(/-/g, " ");
          const glasTekst = q.get("glas") ? `, ${q.get("glas") === "triple" ? "triple glas" : "dubbel glas (HR++)"}` : ", standaarduitvoering";
          const kleurTekst = q.get("kleur") ? `, kleur buiten ${q.get("kleur")!.replace(/-/g, " ")}` : "";
          const meer = (q.get("meer") ?? "").slice(0, 200);
          return `Ik kom uit de chat en heb daar al alles uitgerekend. Hiervoor wil ik een vrijblijvende prijsopgave (offerte): ${q.get("n") ?? "1"} × ${naam}, ${q.get("b")} bij ${q.get("h")} mm${glasTekst}${kleurTekst}.${meer ? ` Daarnaast wil ik: ${meer}.` : ""} Het eerste product staat al ingevuld in de calculator, met de prijs. Volg precies deze volgorde. Eerst blijft alleen de calculator in beeld, met de technische tekening: zet de weergave op foto en weer terug op tekening als dat helpt, maar open nog géén formulier, géén offerte en geen pop-up. Zeg kort en vrolijk, zonder jezelf voor te stellen: "Hier wilt u een vrijblijvende prijsopgave voor, klopt dat?" en noem het product. Heb ik meer producten, laat die dan één voor één zien met open_kozijn of open_product en de maten die ik noemde, en vraag aan het eind: "Klopt dit allemaal?" Wacht op mijn antwoord. Pas als ik zeg dat het klopt, ga je verder: open het formulier en vraag mijn naam, woonplaats, telefoonnummer en e-mailadres met je stem, achter elkaar. Vul alles zelf in met vul_formulier, ook mijn e-mailadres, zonder dat ik het hoef in te tikken. Vraag daarna: "Heb ik alles goed geschreven? Anders verbeter je het even zelf." Wacht dan even, en verstuur de offerte zodra het klopt. Vraag níet opnieuw naar type, maat, kamer, glas of kleur. Houd het gesprek zo kort mogelijk.`;
        } catch {
          return "";
        }
      })();
      let contextVerstuurd = false;
      let begroetGehoord = false;
      let gesprekRef: { sendUserMessage: (t: string) => void } | null = null;
      const conv = await Conversation.startSession({
        signedUrl: d.signedUrl,
        connectionType: "websocket",
        dynamicVariables: { groet },
        clientTools,
        onMessage: ({ message, source }: { message: string; source: "user" | "ai" }) => {
          laatsteRol.current = null;
          voegToe(source === "ai" ? "roos" : "jij", message);
          laatsteRol.current = null;
        },
        onModeChange: ({ mode }: { mode: string }) => {
          setPraat(mode === "speaking");
          if (mode === "speaking") begroetGehoord = true;
          if (mode === "listening" && begroetGehoord && vanChat && !contextVerstuurd && gesprekRef) {
            contextVerstuurd = true;
            const g = gesprekRef;
            setTimeout(() => g.sendUserMessage(vanChat), 400);
          }
          if (mode === "speaking") laatsteUitGeluid.current = performance.now();
        },
        onDisconnect: () => {
          if (sessie.current) {
            sessie.current = null;
            opruimen();
            setOpen(false);
          }
        },
        onError: (m: unknown) => setFout("Fout: " + String(m)),
      });
      if (afgebroken()) {
        conv.endSession().catch(() => {});
        return;
      }
      gesprekRef = conv;
      if (modusTypen) conv.setVolume({ volume: 0 });
      // Kleine vertaler: de rest van de code (tekst sturen, ophangen) blijft gewoon werken.
      const meter = setInterval(() => {
        const vol = praatRef.current ? conv.getOutputVolume() : conv.getInputVolume();
        if (bol.current) bol.current.style.transform = `scale(${1 + Math.min(1, vol) * 0.07})`;
      }, 80);
      const adapter = {
        sendRealtimeInput: (x: { text?: string }) => {
          if (x?.text) conv.sendUserMessage(x.text);
        },
        sendToolResponse: () => {},
        close: () => {
          clearInterval(meter);
          conv.endSession().catch(() => {});
        },
      };
      sessie.current = adapter as unknown as Session;
      const s = adapter;
      void s;

      ctxUit.current?.resume().catch(() => {});
      setStand("aan");
      timer.current = setTimeout(() => {
        setFout("Het gesprek is na een kwartier gestopt. Start gerust opnieuw.");
        opruimen();
      }, MAX_SECONDEN * 1000);
      laatsteGeluid.current = Date.now();
      stilteTimer.current = setInterval(() => {
        if (Date.now() - laatsteGeluid.current > STILTE_SECONDEN * 1000) {
          setFout("Het gesprek is gestopt omdat het even stil was. Start gerust opnieuw.");
          opruimen();
        }
      }, 5000);

      if (eersteVraag) {
        if (!verborgen) setBerichten((b) => [...b, { rol: "jij", tekst: eersteVraag }]);
        laatsteRol.current = null;
        adapter.sendRealtimeInput({ text: eersteVraag });
      }
    } catch (e) {
      setFout("Fout: " + (e instanceof Error ? e.message : "het lukte niet") + ". Probeer het opnieuw.");
      opruimen();
    }
  }

  const startPraten = () => begin(false);
  const startTypen = (vraag?: string) => {
    if (actief && vraag) {
      setBerichten((b) => [...b, { rol: "jij", tekst: vraag }]);
      laatsteRol.current = null;
      sessie.current?.sendRealtimeInput({ text: vraag });
    } else if (!actief) begin(true, vraag);
  };

  function sluit() {
    setToonGesprek(false);
    opruimen();
    setTypen(false);
    setUitgeklapt(false);
    setOpen(false);
  }

  function verstuur(e: React.FormEvent) {
    e.preventDefault();
    const t = tekst.trim();
    if (!t || !verbonden) return;
    setBerichten((b) => [...b, { rol: "jij", tekst: t }]);
    laatsteRol.current = null;
    sessie.current?.sendRealtimeInput({ text: t });
    setTekst("");
  }

  useEffect(() => {
    window.addEventListener("pagehide", opruimen);
    return () => {
      window.removeEventListener("pagehide", opruimen);
      opruimen();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const toets = (e: KeyboardEvent) => {
      if (e.key === "Escape") opruimen();
    };
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!verbonden || typen) {
      if (bol.current) bol.current.style.transform = "";
      return;
    }
    const buf = new Uint8Array(128);
    let raf = 0;
    let zacht = 0;
    const tick = () => {
      const an = praat ? analyserUit.current : analyserIn.current;
      if (!an) {
        // Bij ElevenLabs beweegt de bal via het volume van het gesprek zelf.
        raf = requestAnimationFrame(tick);
        return;
      }
      let vol = 0;
      if (an) {
        an.getByteTimeDomainData(buf);
        let max = 0;
        for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i] - 128));
        vol = Math.min(max / 128 / (praat ? 0.6 : 0.4), 1);
      }
      zacht += (vol - zacht) * 0.06;
      if (bol.current) bol.current.style.transform = `scale(${1 + zacht * 0.07})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [verbonden, typen, praat]);

  useEffect(() => {
    lijst.current?.scrollTo({ top: lijst.current.scrollHeight, behavior: "smooth" });
  }, [berichten]);

  const status = fout
    ? fout
    : bezig
      ? "Verbinden…"
      : verbonden
        ? typen
          ? "Typ je vraag hieronder"
          : praat
            ? "Roos praat…"
            : "Ik luister. Je kunt ook typen"
        : "Stel je vraag hardop of typ hem";

  const keyframes = <style>{`@keyframes orb-ademen{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>;

  const widgetModus = actief ? "bal" : klein && !fout ? "rust" : "kaart";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!ingebed) return;
    try {
      if (sessionStorage.getItem("roos-klein")) setKlein(true);
    } catch {}
  }, [ingebed]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!ingebed) return;
    const maat = widgetModus === "kaart" ? { w: 360, h: fout ? 200 : 178 } : { w: 112, h: 112 };
    try {
      window.parent.postMessage({ soort: "roos-maat", ...maat }, "*");
    } catch {}
  }, [ingebed, widgetModus, fout]);

  if (ingebed) {
    const naarRust = () => {
      setKlein(true);
      try {
        sessionStorage.setItem("roos-klein", "1");
      } catch {}
    };
    const ophangen = () => {
      opruimen();
      naarRust();
    };
    if (widgetModus === "kaart") {
      return (
        <div className="fixed inset-0 p-1">
          <style>{`html,body{background:transparent!important}`}</style>
          <div className="relative flex h-full w-full gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg">
            <button
              type="button"
              onClick={naarRust}
              aria-label="Sluiten"
              className="absolute top-2 right-2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="size-4" />
            </button>
            <div className="mt-0.5 size-11 shrink-0 rounded-full" style={{ background: BAL, boxShadow: "0 6px 16px rgba(39,146,220,0.35)" }} />
            <div className="min-w-0 flex-1 pr-5">
              <p className="text-[15px] font-bold leading-tight">Hallo, ik ben Roos</p>
              <p className={`mt-1 text-[13.5px] leading-snug ${fout ? "font-semibold text-red-700" : "text-slate-600"}`}>
                {fout || "Zal ik je in één minuut aan een offerte helpen? Praat gewoon met me, dan loop ik met je door de calculator."}
              </p>
              <button
                type="button"
                onClick={startPraten}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark active:scale-[0.98]">
                <Mic className="size-4" /> Praat met Roos
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 grid place-items-center">
        <style>{`html,body{background:transparent!important}`}</style>
        <button
          type="button"
          onClick={widgetModus === "rust" ? startPraten : undefined}
          aria-label={widgetModus === "rust" ? "Praat met Roos" : bezig ? "Verbinden" : praat ? "Roos praat" : "Roos luistert"}
          className="relative transition active:scale-95">
          <div
            ref={bol}
            className="size-[72px] rounded-full transition-transform duration-300 ease-out"
            style={{
              background: BAL,
              boxShadow: "0 10px 26px rgba(39,146,220,0.4)",
              animation: widgetModus === "rust" || bezig ? "orb-ademen 3.5s ease-in-out infinite" : undefined,
            }}
          />
          {widgetModus === "rust" && <Mic className="absolute inset-0 m-auto size-7 text-white drop-shadow" />}
        </button>
        {widgetModus === "bal" && (
          <button
            type="button"
            onClick={ophangen}
            aria-label="Ophangen"
            title="Ophangen"
            className="absolute top-1.5 left-1.5 grid size-8 place-items-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700">
            <PhoneOff className="size-4" />
          </button>
        )}
        {keyframes}
      </div>
    );
  }

  if (open && actief && !typen && !toonGesprek) {
    return (
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setToonGesprek(true)}
          aria-label="Gesprek tonen"
          title="Gesprek tonen"
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50">
          <Maximize2 className="size-4" />
        </button>
        <div className="relative">
          <div
            ref={bol}
            className="size-[72px] rounded-full transition-transform duration-300 ease-out"
            style={{ background: BAL, boxShadow: "0 10px 26px rgba(39,146,220,0.4)", animation: bezig ? "orb-ademen 3.5s ease-in-out infinite" : undefined }}
          />
          <button
            type="button"
            onClick={sluit}
            aria-label="Ophangen"
            title="Ophangen"
            className="absolute -top-1 -left-1 grid size-8 place-items-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700">
            <PhoneOff className="size-4" />
          </button>
        </div>
        {keyframes}
      </div>
    );
  }

  if (!open) {
    if (ingebed) return null;
    return (
      <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-xl hover:bg-slate-50">
          <Sparkles className="size-4 text-brand-text" /> Stel een vraag
        </button>
        <button type="button" onClick={() => setOpen(true)} aria-label="Praat met Roos" className="transition active:scale-95">
          <Orb />
        </button>
        {keyframes}
      </div>
    );
  }

  const breedte = uitgeklapt ? "max-w-2xl h-[calc(100dvh-1.5rem)]" : "max-w-sm max-h-[calc(100dvh-1.5rem)]";

  return (
    <div
      className={`fixed right-3 bottom-3 z-50 flex w-[calc(100vw-1.5rem)] ${breedte} flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl shadow-black/30`}>
      <div className="flex items-start justify-between px-6 pt-5">
        <div>
          <p className="text-lg font-bold">Roos</p>
          <p className="text-sm text-slate-500">AI-assistent · praten of typen</p>
        </div>
        <div className="flex items-center gap-1">
          {actief && (
            <button
              onClick={sluit}
              aria-label="Ophangen"
              title="Ophangen"
              className="rounded-full p-2 text-red-600 hover:bg-red-50">
              <PhoneOff className="size-5" />
            </button>
          )}
          {actief && !typen && (
            <button onClick={() => setToonGesprek(false)} aria-label="Alleen de bal" title="Alleen de bal" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <Minimize2 className="size-5" />
            </button>
          )}
          <button
            onClick={() => setUitgeklapt((u) => !u)}
            aria-label={uitgeklapt ? "Kleiner maken" : "Groter maken"}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
            {uitgeklapt ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
          </button>
          <button onClick={sluit} aria-label="Sluiten en gesprek stoppen" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="grid place-items-center py-6">
        <Orb refEl={bol} groot ademen={!(verbonden && !typen)} />
      </div>

      <p className={`px-6 pb-4 text-center text-[15px] ${fout ? "font-semibold text-red-700" : "text-slate-500"}`}>{status}</p>

      {berichten.length > 0 && (
        <div ref={lijst} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-6 pb-3">
          {berichten.map((b, i) => (
            <div
              key={i}
              className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug ${
                b.rol === "roos" ? "bg-slate-100 text-slate-900" : "ml-auto bg-brand text-white"
              }`}>
              {b.tekst}
            </div>
          ))}
        </div>
      )}

      {verbonden && (
        <form onSubmit={verstuur} className="mx-6 mb-3 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5">
          <input
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            placeholder="Typ je vraag…"
            autoFocus={typen}
            className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button type="submit" disabled={!tekst.trim()} aria-label="Versturen" className="rounded-full p-1.5 text-slate-700 disabled:text-slate-300">
            <Send className="size-5" />
          </button>
        </form>
      )}

      <div className="px-6">
        {actief ? null : (
          <button
            type="button"
            onClick={overdracht ? verderPraten : startPraten}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 text-base font-bold text-white transition hover:bg-brand-dark active:scale-[0.98]">
            <Mic className="size-5" /> {overdracht ? "Verder praten met Roos" : "Start gesprek"}
          </button>
        )}
      </div>

      {!actief && (
        <>
          <button type="button" onClick={() => startTypen()} className="py-4 text-center text-[15px] font-medium text-slate-600 hover:text-slate-900">
            Liever typen
          </button>
          <div className="flex flex-wrap justify-center gap-2 px-6 pb-3">
            {VOORBEELDEN.map((v) => (
              <button
                key={v.kort}
                type="button"
                onClick={() => startTypen(v.vraag)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Sparkles className="size-3.5 text-brand-text" /> {v.kort}
              </button>
            ))}
          </div>
        </>
      )}

      <p className="px-6 pt-1 pb-5 text-center text-sm text-slate-400">
        Je praat met een AI. Je microfoon wordt alleen gebruikt tijdens het gesprek.
      </p>
      {keyframes}
    </div>
  );
}

export function GeminiAssistent({ ingebed = false }: { ingebed?: boolean }) {
  return <Chat ingebed={ingebed} />;
}
