import Link from "next/link";
import { Info } from "lucide-react";

export function InmeetServiceCard() {
  return (
    <Link href="/inmeet" className="group">
      <div className="relative h-80 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-4 shadow-sm overflow-hidden">
        <div className="relative w-full h-3/4 rounded-xl overflow-hidden">
          <img
            src="/inmeet.jpg"
            alt="Inmeet service"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border-2 border-[#1066a3] text-[#1066a3] flex items-center justify-center shadow-sm hover:bg-[#1066a3] hover:text-white transition-colors">
            <Info size={14} />
          </button>
        </div>
      </div>
      <h3 className="mt-6 text-center font-bold text-[#1a1a1a] text-base group-hover:text-[#1066a3] transition-colors uppercase tracking-tight">
        Inmeet service
      </h3>
      <div className="mt-2 text-center text-[10px] font-bold text-[#1066a3] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
        Plan een afspraak →
      </div>
    </Link>
  );
}
