import { redirect } from "next/navigation";

/** Kunststof harmonicadeuren bestaan niet; een oude link gaat naar de aluminium harmonicadeuren. */
export default function HarmonicadeurOverzicht() {
  redirect("/aluminium/harmonicadeur");
}
