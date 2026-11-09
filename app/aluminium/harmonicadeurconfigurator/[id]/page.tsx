import { HarmonicaCalculator } from "@/app/components/HarmonicaCalculator";
import { prijzenVoor } from "@/lib/server-prijzen";

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prijzen = await prijzenVoor("alu_harmonicadeur_matrix");
  return <HarmonicaCalculator startSlug={id} matrix={prijzen} />;
}
