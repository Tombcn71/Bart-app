import { KozijnConfigurator } from "@/app/components/KozijnConfigurator";
import { ruwePrijzenVoor } from "@/lib/server-prijzen";

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prijzen = await ruwePrijzenVoor("kozijn_matrix");
  return <KozijnConfigurator startSlug={id} startMatrix={prijzen} />;
}
