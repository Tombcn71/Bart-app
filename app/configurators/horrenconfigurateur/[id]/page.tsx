import { HorCalculator } from "@/app/components/HorCalculator";
import { prijzenVoor } from "@/lib/server-prijzen";

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prijzen = await prijzenVoor(id === "plisse-hordeur" ? "plisse_hor_matrix" : "horren_matrix");
  return <HorCalculator startSlug={id} matrix={prijzen} />;
}
