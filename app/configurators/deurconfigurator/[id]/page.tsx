import { DeurCalculator } from "@/app/components/DeurCalculator";
import { prijzenVoor } from "@/lib/server-prijzen";

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prijzen = await prijzenVoor("deur_matrix");
  return <DeurCalculator materiaal="kunststof" startSlug={id} matrix={prijzen} />;
}
