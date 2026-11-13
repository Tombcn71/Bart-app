import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { SendLink } from "./send-link";

const BERICHT = `Hoi! Bedankt voor je aanvraag. Via deze link stel je je kozijnen samen en zie je meteen de prijs, inclusief montage: ${SITE_URL.replace(/^https?:\/\//, "")}\n\nGroet, Bart`;

/** "Reageer op aanvraag": het kant-en-klare bericht met het linkje, voor WhatsApp, mail of kopiëren. */
export default function ReageerPage() {
  return (
    <main className="mx-auto w-full max-w-md px-5 pt-6 pb-10">
      <Link href="/meten" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="size-4" /> Terug
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Reageer op aanvraag</h1>
      <p className="mt-1 text-sm text-slate-500">Je klant stelt zelf zijn kozijnen samen en ziet meteen je prijs.</p>
      <div className="mt-6">
        <SendLink defaultMessage={BERICHT} />
      </div>
    </main>
  );
}
