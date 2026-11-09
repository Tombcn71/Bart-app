import { RolluikCalculator } from "@/app/components/RolluikCalculator";
import { prijzenVoor } from "@/lib/server-prijzen";

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prijzen = await prijzenVoor("rolluiken_matrix");
  return <RolluikCalculator startSlug={id} matrix={prijzen} />;
}
