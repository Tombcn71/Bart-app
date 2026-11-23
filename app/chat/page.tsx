"use client";
import { useRef, useState, useEffect } from "react";

function linkjes(t: string) {
  return t.split(/(https?:\/\/[^\s]+)/g).map((d, i) =>
    /^https?:\/\//.test(d) ? <a key={i} href={d.replace(/[.,)]+$/, "")} target="_blank" rel="noopener noreferrer" className="underline break-all">{d}</a> : d,
  );
}

type Bericht = { rol: "klant" | "chat"; tekst: string };

export default function Chat() {
  const [berichten, setBerichten] = useState<Bericht[]>([{ rol: "chat", tekst: "Goedendag! Ik beantwoord uw vragen over kozijnen, glas, onderhoud en meer. Waarmee kan ik u helpen?" }]);
  const [invoer, setInvoer] = useState("");
  const [bezig, setBezig] = useState(false);
  const onder = useRef<HTMLDivElement>(null);
  const [luistert, setLuistert] = useState(false);
  const [kanSpraak, setKanSpraak] = useState(false);
  const herkenner = useRef<any>(null);
  useEffect(() => {
    const w = window as any;
    setKanSpraak(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  function spreek() {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    if (luistert) { herkenner.current?.stop(); return; }
    const h = new SR();
    h.lang = "nl-NL";
    h.interimResults = true;
    h.continuous = false;
    const voor = invoer ? invoer.trim() + " " : "";
    h.onresult = (e: any) => setInvoer(voor + Array.from(e.results).map((r: any) => r[0].transcript).join(""));
    h.onend = () => setLuistert(false);
    h.onerror = () => setLuistert(false);
    herkenner.current = h;
    setLuistert(true);
    h.start();
  }
  useEffect(() => { onder.current?.scrollIntoView({ behavior: "smooth" }); }, [berichten, bezig]);

  async function stuur(e: React.FormEvent) {
    e.preventDefault();
    const tekst = invoer.trim();
    if (!tekst || bezig) return;
    const nieuw = [...berichten, { rol: "klant" as const, tekst }];
    setBerichten(nieuw);
    setInvoer("");
    setBezig(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ berichten: nieuw }) });
      const d = await r.json();
      setBerichten([...nieuw, { rol: "chat", tekst: d.tekst ?? d.fout ?? "Er ging iets mis." }]);
    } catch {
      setBerichten([...nieuw, { rol: "chat", tekst: "Er ging iets mis. Probeer het zo nog eens." }]);
    }
    setBezig(false);
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-xl flex-col bg-white">
      <div className="bg-[#1E5079] px-4 py-3 text-white"><p className="font-black">BartMooi</p><p className="text-xs opacity-80">Stel uw vraag over kozijnen</p></div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-[#f4f7fa] p-4">
        {berichten.map((b, i) => (
          <div key={i} className={`flex ${b.rol === "klant" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-snug ${b.rol === "klant" ? "bg-[#1E5079] text-white" : "bg-white text-[#13334D] shadow-sm"}`}>{linkjes(b.tekst)}</p>
          </div>
        ))}
        {bezig && <p className="text-sm text-black/40">Even denken…</p>}
        <div ref={onder} />
      </div>
      <div className="border-t border-black/5 bg-white px-3 pt-2"><a href="https://offerte.bartmooi.nl" target="_top" className="block rounded-full border border-[#1E5079] py-2 text-center text-sm font-bold text-[#1E5079]">Prijs berekenen met Roos</a></div>
      <form onSubmit={stuur} className="flex gap-2 bg-white p-3">
        <input value={invoer} onChange={(e) => setInvoer(e.target.value)} placeholder="Typ uw vraag…" className="min-w-0 flex-1 rounded-full border border-black/15 px-4 py-2.5 text-[15px] outline-none focus:border-[#1E5079]" />
        {kanSpraak && (
          <button type="button" onClick={spreek} aria-label={luistert ? "Stop met luisteren" : "Praat uw vraag in"} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${luistert ? "animate-pulse border-red-500 bg-red-50 text-red-600" : "border-black/15 text-[#1E5079]"}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4" /></svg>
          </button>
        )}
        <button disabled={bezig || !invoer.trim()} className="rounded-full bg-[#1E5079] px-5 font-bold text-white disabled:opacity-40">Stuur</button>
      </form>
    </div>
  );
}
