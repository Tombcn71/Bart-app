import { redirect } from "next/navigation";

/** Geen apart overzicht: Aanvragen is het beginscherm. */
export default function AdminStart() {
  redirect("/admin/offertes");
}
