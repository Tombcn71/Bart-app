import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StartInmeten } from "./start-inmeten";

/**
 * Inmeten: Bart meet bij de klant in. Alleen met een inlog (zijn admin-wachtwoord); daarna opent de calculator
 * in inmeetmodus, schermvullend op de telefoon.
 */
export default async function InmetenPage() {
  const ingelogd = !!process.env.ADMIN_TOKEN && (await cookies()).get("admin_token")?.value === process.env.ADMIN_TOKEN;
  if (!ingelogd) redirect("/admin/login?next=/meten/inmeten");
  return <StartInmeten />;
}
