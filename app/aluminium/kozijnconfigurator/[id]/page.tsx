import { KozijnConfigurator } from "@/app/components/KozijnConfigurator";
import { ruwePrijzenVoor } from "@/lib/server-prijzen";

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prijzen = await ruwePrijzenVoor("alu_kozijn_matrix");
  return <KozijnConfigurator preview={false} product="aluminium" startSlug={id} startMatrix={prijzen} />;
}
