"use client";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { X } from "lucide-react";
import { KOZIJN_TYPEN } from "@/lib/kozijntypen";
import { formulier } from "@/lib/assistent-formulier";

/** Wat de assistent in de calculator mag doen. De calculator zet deze functies in `api.current`. */
export type AssistentBrug = {
  typen: () => { slug: string; naam: string }[];
  staat: () => unknown;
  zet: (patch: Record<string, unknown>) => void;
  verstuur: (klant: { naam: string; woonplaats: string; telefoon: string; email: string }) => Promise<{ ok: boolean; offerteId?: string | null; fout?: string }>;
  /** Zet het kozijn op de offerte en toont het formulier (de pop-up) waar de klant zijn gegevens invult. */
  toonFormulier: () => void;
};

type Bericht = { rol: "klant" | "bot"; tekst: string };

function begroeting() {
  const u = new Date().getHours();
  const dag = u < 6 ? "Goedenacht" : u < 12 ? "Goedemorgen" : u < 18 ? "Goedemiddag" : "Goedenavond";
  return `${dag}, welkom bij Bart Mooi! Ik help je graag aan een kozijn. Zeg maar gewoon wat je zoekt, bijvoorbeeld voor welke kamer het is.`;
}
const BEGROETING = begroeting();

function spraakHerkenning(): any {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function Assistent({ api, ga, pad }: { api: MutableRefObject<AssistentBrug | null>; ga?: (url: string) => void; pad?: string }) {
  const [open, setOpen] = useState(false);
  const [lijst, setLijst] = useState<Bericht[]>([]);
  const [tekst, setTekst] = useState("");
  const [bezig, setBezig] = useState(false);
  const [luistert, setLuistert] = useState(false); // gespreksmodus aan
  const [spreekt, setSpreekt] = useState(false);
  const [offerteId, setOfferteId] = useState<string | null>(null);
  const [fout, setFout] = useState("");
  // Het formulier of de offerte is in beeld: dan blijft alleen de bal over, zodat niets in de weg zit.
  const [formOpen, setFormOpen] = useState(false);
  const [uitgeklapt, setUitgeklapt] = useState(false);
  useEffect(() => {
    const bij = () => { setFormOpen(formulier.open); setUitgeklapt(false); };
    window.addEventListener("assistent-formulier", bij);
    return () => window.removeEventListener("assistent-formulier", bij);
  }, []);
  useEffect(() => { setUitgeklapt(false); }, [pad]);
  // Natuurlijke stem (OpenAI Realtime): in welke fase het gesprek is, of null als we de browserstem gebruiken.
  const [rtStand, setRtStand] = useState<"luistert" | "denkt" | "praat" | null>(null);
  const rt = useRef<{ pc?: RTCPeerConnection; dc?: RTCDataChannel; stream?: MediaStream; audio?: HTMLAudioElement; timer?: any } | null>(null);

  const apiBerichten = useRef<any[]>([]);
  const modus = useRef(false);
  const rec = useRef<any>(null);
  const eindeRef = useRef<HTMLDivElement>(null);
  const begroet = useRef(false);

  useEffect(() => { eindeRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lijst, bezig, open]);
  useEffect(() => () => { stopRealtime(); modus.current = false; rec.current?.abort?.(); window.speechSynthesis?.cancel(); }, []);

  function spreek(t: string, daarna?: () => void) {
    const s = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!s || !modus.current) { daarna?.(); return; }
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "nl-NL";
    const nl = s.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("nl"));
    const score = (v: SpeechSynthesisVoice) => (/natural|premium|enhanced|google/i.test(v.name) ? 2 : 0) + (v.lang.toLowerCase().includes("nl-nl") ? 1 : 0) + (v.localService ? 0 : 0.5);
    const stem = nl.sort((a, b) => score(b) - score(a))[0];
    if (stem) u.voice = stem;
    u.rate = 1.12;
    u.onstart = () => setSpreekt(true);
    u.onend = () => { setSpreekt(false); daarna?.(); };
    u.onerror = () => { setSpreekt(false); daarna?.(); };
    s.speak(u);
  }

  function luister() {
    const SR = spraakHerkenning();
    if (!SR || !modus.current) return;
    const r = new SR();
    rec.current = r;
    r.lang = "nl-NL";
    r.interimResults = false;
    r.continuous = false;
    let kreeg = false;
    r.onresult = (e: any) => {
      const t = e.results?.[0]?.[0]?.transcript?.trim();
      if (t) { kreeg = true; stilte.current = 0; stuur(t); }
    };
    r.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        modus.current = false; setLuistert(false);
        setFout("De microfoon staat uit. Zet hem aan in je browser, of typ je bericht.");
      }
    };
    r.onend = () => {
      if (!modus.current || kreeg || bezigRef.current) return;
      stilte.current += 1;
      if (stilte.current === 3) {
        const duw = "Ben je er nog? Zeg maar wat je zoekt, dan zet ik het voor je klaar.";
        setLijst((l) => [...l, { rol: "bot", tekst: duw }]);
        spreek(duw, luister);
      } else setTimeout(luister, 300);
    };
    try { r.start(); } catch { /* al bezig */ }
  }

  const bezigRef = useRef(false);
  const stilte = useRef(0);

  function zetModus(aan: boolean) {
    modus.current = aan;
    setLuistert(aan);
    setFout("");
    if (aan) {
      startRealtime().then((gelukt) => {
        if (gelukt || !modus.current) return;
        // Niet beschikbaar: de browserstem als reserve.
        if (!spraakHerkenning()) { modus.current = false; setLuistert(false); setFout("Praten werkt in Chrome of Safari."); return; }
        if (!begroet.current) { begroet.current = true; setLijst([{ rol: "bot", tekst: BEGROETING }]); spreek(BEGROETING, luister); } else luister();
      });
      return;
    }
    if (false) {
      if (!spraakHerkenning()) { modus.current = false; setLuistert(false); setFout("Praten werkt in Chrome of Safari. Je kunt ook typen."); return; }
      // Eerste keer: de begroeting hardop, daarna luisteren.
      if (!begroet.current) { begroet.current = true; spreek(BEGROETING, luister); } else luister();
    } else {
      stopRealtime();
      rec.current?.abort?.();
      window.speechSynthesis?.cancel();
      setSpreekt(false);
    }
  }

  const typenLijst = () => api.current?.typen() ?? KOZIJN_TYPEN;
  const staatNu = () => api.current?.staat() ?? { scherm: "startpagina" };

  // Gaat de klant naar een ander scherm, dan weet de assistent dat meteen en kan hij erover praten.
  useEffect(() => {
    const dc = rt.current?.dc;
    if (!pad || !dc || dc.readyState !== "open") return;
    const scherm = pad.startsWith("/kozijnconfigurator") ? "calculator" : pad.startsWith("/offerte") || pad.startsWith("/accepteer") ? "offerte" : "startpagina";
    dc.send(JSON.stringify({ type: "conversation.item.create", item: { type: "message", role: "system", content: [{ type: "input_text", text: `De klant ziet nu het scherm "${scherm}".` }] } }));
  }, [pad]);

  async function voerUit(naam: string, input: any): Promise<unknown> {
    if (naam === "open_kozijn") {
      const slug = KOZIJN_TYPEN.some((t) => t.slug === input?.type) ? input.type : "draai-kiep-kozijn";
      if (!api.current) {
        ga?.(`/kozijnconfigurator/${slug}`);
        for (let i = 0; i < 30 && !api.current; i++) await new Promise((r) => setTimeout(r, 150));
      } else api.current.zet({ type: slug });
      await new Promise((r) => setTimeout(r, 350));
      return api.current?.staat() ?? { fout: "De calculator kon niet geopend worden." };
    }
    if (naam === "lees_formulier") return { formulierOpen: formulier.open, ...formulier.waarden };
    if (naam === "vul_formulier") {
      if (!formulier.open) return { fout: "Het formulier is nog niet open. Gebruik eerst open_formulier." };
      formulier.vul?.(input ?? {});
      await new Promise((r) => setTimeout(r, 250));
      return { ok: true, ...formulier.waarden };
    }
    if (naam === "verstuur_formulier") {
      if (!formulier.open || !formulier.verstuur) return { fout: "Het formulier is niet open." };
      const r = await formulier.verstuur();
      if (r.ok && r.offerteId) {
        setOfferteId(r.offerteId);
        setTimeout(() => ga?.(`/offerte/${r.offerteId}`), 1200); // zelfde tabblad: het gesprek loopt door
      }
      return r.ok ? { ok: true, scherm: "offerte", opmerking: "De offerte opent nu." } : r;
    }
    if (naam === "open_formulier") {
      if (!api.current) return { fout: "Er is nog geen kozijn open. Gebruik eerst open_kozijn." };
      api.current.toonFormulier();
      await new Promise((r) => setTimeout(r, 400));
      return { ok: true, formulierOpen: formulier.open };
    }
    if (!api.current) return { fout: "Er is nog geen kozijn open. Gebruik eerst open_kozijn." };
    if (naam === "zet_keuzes") {
      api.current?.zet(input ?? {});
      await new Promise((r) => setTimeout(r, 350)); // wacht tot de calculator is bijgewerkt
      return api.current?.staat();
    }
    if (naam === "verstuur_offerte") {
      const r = await (api.current?.verstuur(input) ?? Promise.resolve({ ok: false, fout: "Niet beschikbaar" }));
      if (r.ok && r.offerteId) setOfferteId(r.offerteId);
      return r;
    }
    return { fout: "Onbekend hulpmiddel" };
  }

  // ---- Natuurlijke stem: de browser praat rechtstreeks met OpenAI Realtime (WebRTC) ----
  function stopRealtime() {
    const r = rt.current;
    if (!r) return;
    clearTimeout(r.timer);
    try { r.dc?.close(); } catch {}
    try { r.pc?.close(); } catch {}
    r.stream?.getTracks().forEach((t) => t.stop());
    if (r.audio) { r.audio.srcObject = null; r.audio.remove(); }
    rt.current = null;
    setRtStand(null);
  }

  /** true = gelukt; false = niet beschikbaar (dan valt hij terug op de browserstem). */
  async function startRealtime(): Promise<boolean> {
    if (typeof RTCPeerConnection === "undefined" || !navigator.mediaDevices?.getUserMedia) return false;
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
    catch { setFout("De microfoon staat uit. Zet hem aan in je browser en probeer het nog eens."); return true; }
    const res = await fetch("/api/assistent/token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ typen: typenLijst(), staat: staatNu(), stem: new URLSearchParams(location.search).get("stem") }),
    }).catch(() => null);
    if (res?.status === 429) { stream.getTracks().forEach((t) => t.stop()); setFout("Je hebt veel gebeld. Probeer het over een uur nog eens, of bel Bart."); return true; }
    if (!res || !res.ok) { stream.getTracks().forEach((t) => t.stop()); return false; }
    const { sleutel } = await res.json();

    const pc = new RTCPeerConnection();
    const audio = document.createElement("audio");
    audio.autoplay = true;
    document.body.appendChild(audio);
    pc.ontrack = (e) => { audio.srcObject = e.streams[0]; };
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    const dc = pc.createDataChannel("oai-events");
    rt.current = { pc, dc, stream, audio };
    if (process.env.NODE_ENV !== "production") (window as any).__rtDc = dc; // alleen om te testen

    // Een gesprek duurt hooguit 5 minuten: dat houdt de kosten in de hand.
    rt.current.timer = setTimeout(() => {
      setLijst((l) => [...l, { rol: "bot", tekst: "Ik hang even op. Wil je verder, start dan opnieuw, of bel Bart." }]);
      modus.current = false; setLuistert(false); stopRealtime();
    }, 5 * 60_000);

    let wachtOpTools = 0;
    let moetAntwoorden = false;
    const stuurEvent = (o: unknown) => { if (dc.readyState === "open") dc.send(JSON.stringify(o)); };
    let klantSprak = false;
    let streamt = false;
    let nasleep = "";
    const antwoordAlsKlaar = () => {
      if (moetAntwoorden && wachtOpTools === 0) {
        moetAntwoorden = false;
        stuurEvent(nasleep ? { type: "response.create", response: { instructions: nasleep } } : { type: "response.create" });
        nasleep = "";
      }
    };

    // Begeleiden in het tempo van de klant: begroeten, luisteren, en pas de calculator openen als duidelijk is wat voor raam het is.
    dc.onopen = () => {
      const opCalculator = !!api.current;
      const u = new Date().getHours();
      const dag = u < 6 ? "Goedenacht" : u < 12 ? "Goedemorgen" : u < 18 ? "Goedemiddag" : "Goedenavond";
      stuurEvent({ type: "response.create", response: { tool_choice: "none", instructions: opCalculator
        ? 'Zeg warm en vriendelijk in een of twee volledige zinnen goedendag, dat je graag helpt, en vraag hoe zijn raam eruitziet. Bijvoorbeeld: "Goedemiddag! Ik help je graag met je kozijn. Hoe ziet je raam eruit?"'
        : `Zeg precies dit, en niets meer: "${dag}, welkom bij Bart Mooi. Waarmee kan ik je helpen?"` } });
      setRtStand("denkt");
    };
    dc.onmessage = async (m) => {
      let e: any; try { e = JSON.parse(m.data); } catch { return; }
      switch (e.type) {
        case "input_audio_buffer.speech_started": setRtStand("luistert"); break;
        case "input_audio_buffer.speech_stopped": setRtStand("denkt"); break;
        case "response.created": setRtStand((x) => (x === "luistert" ? x : "denkt")); break;
        case "output_audio_buffer.started": setRtStand("praat"); break;
        case "output_audio_buffer.stopped":
        case "output_audio_buffer.cleared":
          setRtStand("luistert");
          break;
        case "conversation.item.input_audio_transcription.completed": {
          const t = (e.transcript ?? "").trim();
          if (t) { klantSprak = true; setLijst((l) => [...l, { rol: "klant", tekst: t }]); }
          break;
        }
        case "response.output_audio_transcript.delta":
        case "response.audio_transcript.delta": {
          const d = e.delta ?? "";
          if (!d) break;
          if (!streamt) { streamt = true; setLijst((l) => [...l, { rol: "bot", tekst: d }]); }
          else setLijst((l) => { const n = [...l]; n[n.length - 1] = { rol: "bot", tekst: n[n.length - 1].tekst + d }; return n; });
          break;
        }
        case "response.output_audio_transcript.done":
        case "response.audio_transcript.done": {
          const t = (e.transcript ?? "").trim();
          if (process.env.NODE_ENV !== "production") ((window as any).__tr ||= []).push(t); // alleen om te testen
          if (t) {
            if (streamt) setLijst((l) => { const n = [...l]; n[n.length - 1] = { rol: "bot", tekst: t }; return n; });
            else setLijst((l) => [...l, { rol: "bot", tekst: t }]);
          }
          streamt = false;
          break;
        }
        case "response.function_call_arguments.done": {
          wachtOpTools++; moetAntwoorden = true;
          if (false) nasleep = 'Heeft de klant zijn raam al beschreven, ga dan gewoon verder met wat hij zei. Anders vraag je in een heel korte, gezellige zin hoe zijn raam eruitziet, bijvoorbeeld "En, hoe ziet je raam eruit?" Noem het kozijntype of de maten niet en zeg niet dat je iets geopend hebt.';
          let uit: unknown;
          try { uit = await voerUit(e.name, JSON.parse(e.arguments || "{}")); } catch { uit = { fout: "Dat lukte niet." }; }
          stuurEvent({ type: "conversation.item.create", item: { type: "function_call_output", call_id: e.call_id, output: JSON.stringify(uit) } });
          wachtOpTools--; antwoordAlsKlaar();
          break;
        }
        case "response.done": antwoordAlsKlaar(); break;
        case "error": console.error("realtime:", e); break;
      }
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        if (rt.current?.pc === pc) { setFout("De verbinding is weg. Start het gesprek opnieuw."); modus.current = false; setLuistert(false); stopRealtime(); }
      }
    };

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdp = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: { Authorization: `Bearer ${sleutel}`, "Content-Type": "application/sdp" },
      });
      if (!sdp.ok) throw new Error("sdp");
      await pc.setRemoteDescription({ type: "answer", sdp: await sdp.text() });
      return true;
    } catch {
      stopRealtime();
      return false;
    }
  }

  async function vraag(): Promise<string> {
    // Het model mag meerdere keren hulpmiddelen gebruiken voor het antwoord geeft.
    for (let ronde = 0; ronde < 6; ronde++) {
      const res = await fetch("/api/assistent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ berichten: apiBerichten.current, typen: typenLijst(), staat: staatNu() }),
      });
      if (res.status === 503) throw new Error("De assistent is nog niet ingesteld.");
      if (res.status === 429) throw new Error("Je hebt veel gevraagd. Probeer het over een uur nog eens, of bel Bart.");
      if (!res.ok) throw new Error("Er ging iets mis. Probeer het nog eens.");
      const data = await res.json();
      apiBerichten.current.push({ role: "assistant", content: data.content });
      const gebruik = (data.content as any[]).filter((b) => b.type === "tool_use");
      const tussen = (data.content as any[]).filter((b) => b.type === "text").map((b) => b.text).join(" ").trim();
      if (gebruik.length > 0 && tussen) {
        setLijst((l) => [...l, { rol: "bot", tekst: tussen }]);
        spreek(tussen);
      }
      if (gebruik.length === 0) {
        return (data.content as any[]).filter((b) => b.type === "text").map((b) => b.text).join(" ").trim();
      }
      const uitkomsten: any[] = [];
      for (const g of gebruik) {
        const uit = await voerUit(g.name, g.input);
        uitkomsten.push({ type: "tool_result", tool_use_id: g.id, content: JSON.stringify(uit) });
      }
      apiBerichten.current.push({ role: "user", content: uitkomsten });
    }
    return "Sorry, dat lukt me even niet. Wil je het nog eens zeggen?";
  }

  async function stuur(t: string) {
    const schoon = t.trim();
    if (!schoon || bezigRef.current) return;
    bezigRef.current = true;
    setBezig(true);
    setFout("");
    setTekst("");
    setLijst((l) => [...l, { rol: "klant", tekst: schoon }]);
    apiBerichten.current.push({ role: "user", content: schoon });
    try {
      const antwoord = await vraag();
      setLijst((l) => [...l, { rol: "bot", tekst: antwoord }]);
      bezigRef.current = false;
      setBezig(false);
      spreek(antwoord, luister);
      if (!modus.current) return;
    } catch (e: any) {
      bezigRef.current = false;
      setBezig(false);
      setFout(e?.message || "Er ging iets mis.");
      // Een mislukte ronde mag het gesprek niet breken: haal het laatste klantbericht weg.
      while (apiBerichten.current.length && apiBerichten.current[apiBerichten.current.length - 1].role !== "user") apiBerichten.current.pop();
      apiBerichten.current.pop();
    }
  }

  const gestart = luistert;
  const status = rtStand ? { luistert: "Ik luister…", denkt: "Ik denk na…", praat: "Ik praat…" }[rtStand] : bezig ? "Ik denk na…" : spreekt ? "Ik praat…" : luistert ? "Ik luister…" : "";
  const stand = rtStand ?? (bezig ? "denkt" : spreekt ? "praat" : luistert ? "luistert" : "stil");
  const laatste = [...lijst].reverse().find((b) => b.rol === "bot")?.tekst ?? "";
  const gezegd = [...lijst].reverse().find((b) => b.rol === "klant")?.tekst ?? "";

  const compact = (formOpen || !!pad?.startsWith("/kozijnconfigurator") || !!pad?.startsWith("/offerte") || !!pad?.startsWith("/accepteer")) && luistert && !uitgeklapt;
  if (open && compact)
    return (
      <>
        <style>{ORB_CSS}</style>
        <button
          onClick={() => setUitgeklapt(true)}
          aria-label={status || "Assistent"}
          className="fixed right-4 bottom-24 md:bottom-4 z-[10000] transition active:scale-95"
        >
          <span className="orb orb-groot" data-stand={stand}><i /><i /><i /></span>
        </button>
      </>
    );

  if (!open)
    return (
      <>
        <style>{ORB_CSS}</style>
        <button
          onClick={() => setOpen(true)}
          aria-label="Praat met ons"
          className="fixed right-5 bottom-24 md:bottom-5 z-[9000] flex flex-col items-center gap-2 transition active:scale-95"
        >
          <span className="orb orb-groot" data-stand="luistert"><i /><i /><i /></span>
          <span className="rounded-full bg-brand-dark px-4 py-1.5 text-sm font-bold text-white shadow-lg">Praat met ons</span>
        </button>
      </>
    );

  return (
    <div className="fixed right-3 bottom-24 md:bottom-3 z-[9000] flex w-[calc(100vw-1.5rem)] max-w-sm flex-col items-center overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 pt-4 pb-6 shadow-2xl shadow-black/35">
      <style>{ORB_CSS}</style>
      <div className="flex w-full items-center justify-between">
        <p className="text-base font-bold text-slate-900">Bart Mooi</p>
        <button onClick={() => { zetModus(false); setOpen(false); }} aria-label="Sluiten" className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"><X className="size-5" /></button>
      </div>

      <span className="orb mt-6" data-stand={stand}><i /><i /><i /></span>
      <p className="mt-4 h-6 text-base font-semibold text-slate-800">{status}</p>

      <div className="mt-2 max-h-56 min-h-16 w-full space-y-2 overflow-y-auto">
        {lijst.map((b, i) => (
          <div key={i} className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug ${b.rol === "bot" ? "bg-slate-100 text-slate-900" : "ml-auto bg-brand text-white"}`}>
            {b.tekst}
          </div>
        ))}
        {fout && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{fout}</p>}
        {offerteId && (
          <a href={`/offerte/${offerteId}`} target="_blank" rel="noopener" className="block rounded-full bg-brand px-4 py-3 text-base font-bold text-white hover:bg-brand-dark">
            Bekijk je offerte
          </a>
        )}
      </div>
      <div ref={eindeRef} />

      <button
        onClick={() => zetModus(!luistert)}
        className={`mt-5 w-full rounded-full py-4 text-lg font-bold text-white shadow-lg transition active:scale-[0.98] ${luistert ? "bg-slate-600 hover:bg-slate-700" : "bg-brand hover:bg-brand-dark"}`}
      >
        {luistert ? "Stop gesprek" : "Start gesprek"}
      </button>
    </div>
  );
}

/** De grote bol: rustig bij stil, ringen bij luisteren, golven bij praten, draaiend bij nadenken. */
const ORB_CSS = `
.orb{position:relative;display:block;width:132px;height:132px;border-radius:50%;
 background:radial-gradient(circle at 32% 28%,#8fe3f2 0,#2b8fb3 28%,#14507a 58%,#0a2742 100%);
 box-shadow:0 14px 40px rgba(20,80,122,.45),inset -10px -14px 30px rgba(5,25,50,.55),inset 8px 10px 24px rgba(180,240,255,.35);
 animation:orb-adem 4s ease-in-out infinite}
.orb::after{content:"";position:absolute;left:18%;top:12%;width:38%;height:22%;border-radius:50%;
 background:radial-gradient(ellipse,rgba(255,255,255,.7),rgba(255,255,255,0));filter:blur(3px)}
.orb i{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(43,143,179,.55);opacity:0;pointer-events:none}
.orb[data-stand=luistert] i{animation:orb-ring 2.2s ease-out infinite}
.orb-groot[data-stand=luistert],.orb-groot[data-stand=stil]{animation:orb-puls 1.8s ease-in-out infinite}
.orb-groot i{border-width:3px;border-color:rgba(43,143,179,.7)}
.orb-groot[data-stand=praat]{animation:orb-praat .7s ease-in-out infinite}
.orb-groot[data-stand=denkt]{animation:orb-denk 1.4s linear infinite}
.orb[data-stand=luistert] i:nth-child(2){animation-delay:.7s}
.orb[data-stand=luistert] i:nth-child(3){animation-delay:1.4s}
.orb[data-stand=praat]{animation:orb-praat .7s ease-in-out infinite}
.orb[data-stand=praat] i{animation:orb-ring 1.1s ease-out infinite}
.orb[data-stand=denkt]{animation:orb-denk 1.4s linear infinite;filter:hue-rotate(-20deg) saturate(1.2)}
.orb-groot{width:92px;height:92px;box-shadow:0 10px 30px rgba(20,80,122,.55),inset -8px -10px 22px rgba(5,25,50,.55),inset 6px 8px 18px rgba(180,240,255,.35)}
.orb-klein{width:46px;height:46px;box-shadow:0 4px 14px rgba(20,80,122,.5),inset -4px -5px 12px rgba(5,25,50,.55),inset 3px 4px 10px rgba(180,240,255,.35)}
.orb-klein::after{filter:blur(1.5px)}
@keyframes orb-puls{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes orb-adem{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@keyframes orb-praat{0%,100%{transform:scale(1)}30%{transform:scale(1.09)}60%{transform:scale(.97)}}
@keyframes orb-denk{0%{transform:rotate(0) scale(1.02)}100%{transform:rotate(360deg) scale(1.02)}}
@keyframes orb-ring{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.7);opacity:0}}
`;
