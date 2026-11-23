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
      <form onSubmit={stuur} className="flex gap-2 border-t border-black/10 bg-white p-3">
        <input value={invoer} onChange={(e) => setInvoer(e.target.value)} placeholder="Typ uw vraag…" className="min-w-0 flex-1 rounded-full border border-black/15 px-4 py-2.5 text-[15px] outline-none focus:border-[#1E5079]" />
        <button disabled={bezig || !invoer.trim()} className="rounded-full bg-[#1E5079] px-5 font-bold text-white disabled:opacity-40">Stuur</button>
      </form>
    </div>
  );
}
