import { redirect } from "next/navigation";

/** Kunststof harmonicadeuren bestaan niet; een oude link gaat naar de aluminium configurator van hetzelfde type. */
export default async function HarmonicadeurDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/aluminium/harmonicadeurconfigurator/${encodeURIComponent(id)}`);
}
