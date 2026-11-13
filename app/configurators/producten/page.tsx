import { ProductTegel } from "@/app/components/ProductTegel";
import { TEGELS } from "@/lib/start-tegels";

/**
 * Overzicht met een tekening per product dat BartMooi aanbiedt. Netjes uitgelijnd bij elk aantal:
 * 1 groot, 2 naast elkaar, 3 in een rij, 4 in een vierkant, 5 als 3 + 2 en 6 als 3 + 3.
 */
export default function ProductenPagina() {
  const tegels = TEGELS;
  const n = tegels.length;

  const kolommen = n <= 1 ? "grid-cols-1" : n === 5 ? "grid-cols-2 md:grid-cols-6" : n === 3 ? "grid-cols-2 md:grid-cols-3" : n === 4 ? "grid-cols-2" : n === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3";
  // Bij 5 tegels op een groot scherm: bovenaan 3 smalle, onderaan 2 brede. Bij een oneven aantal op de telefoon: de laatste over de volle breedte.
  const span = (i: number) => {
    const telefoon = n % 2 === 1 && i === n - 1 ? "col-span-2" : "";
    const groot = n === 5 ? (i < 3 ? "md:col-span-2" : "md:col-span-3") : n === 3 ? "md:col-span-1" : "";
    return `${telefoon} ${groot}`.trim();
  };

  return (
    <div className="h-[calc(100svh-5rem)] bg-white md:h-[calc(100svh-6rem)]">
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col px-4 pt-6 pb-4 md:px-6 md:py-10">
        <h1 className="mb-4 shrink-0 text-center text-2xl font-bold tracking-tight text-slate-900 md:mb-8 md:text-4xl">
          Wat wilt u berekenen?
        </h1>
        <div className={`grid min-h-0 flex-1 auto-rows-fr gap-x-4 gap-y-8 md:gap-x-10 ${kolommen} ${n <= 2 ? "mx-auto w-full max-w-4xl" : ""}`}>
          {tegels.map((p, i) => (
            <ProductTegel key={p.name} {...p} className={span(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
