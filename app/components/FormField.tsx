"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  value: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function FormField({ label, value, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const vak = useRef<HTMLDivElement>(null);
  // De assistent kan dit vak openklappen en in beeld brengen, zodat de klant ziet wat er verandert.
  useEffect(() => {
    const bij = (e: Event) => {
      const d = (e as CustomEvent<string | { label: string; scroll?: boolean }>).detail;
      const naam = typeof d === "string" ? d : d?.label;
      if (naam !== label) return;
      setOpen(true);
      const scroll = typeof d === "string" ? true : d?.scroll !== false;
      if (scroll) setTimeout(() => vak.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    };
    window.addEventListener("marleen-open-vak", bij);
    return () => window.removeEventListener("marleen-open-vak", bij);
  }, [label]);
  return (
    <div ref={vak} className="border-b border-slate-200 last:border-0">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex justify-between items-center py-3 gap-3 text-left">
        <span className="text-sm font-bold text-slate-900 flex-shrink-0">{label}</span>
        <div className="flex items-center gap-2 min-w-0">
          {!open && value && (
            <span className="text-sm font-medium text-slate-700 truncate max-w-[160px]">{value}</span>
          )}
          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            open ? "border-brand bg-brand text-white" : "border-slate-500 text-slate-800"
          }`}>
            <span className="text-base font-bold leading-none">{open ? "−" : "+"}</span>
          </div>
        </div>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}
