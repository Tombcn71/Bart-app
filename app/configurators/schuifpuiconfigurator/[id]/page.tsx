import { SchuifpuiCalculator } from "@/app/components/SchuifpuiCalculator";
import { prijzenVoor } from "@/lib/server-prijzen";

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prijzen = await prijzenVoor("schuifpui_matrix");
  return <SchuifpuiCalculator materiaal="kunststof" startSlug={id} matrix={prijzen} />;
}
