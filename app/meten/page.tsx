import NextLink from "next/link";
import { LayoutDashboard, Link, MapPin } from "lucide-react";
import { InstallHint } from "./install-hint";

/** Voorkant van de web app van BartMooi: snel reageren op een aanvraag en inmeten bij de klant. */
export default function MetenPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-10 pb-6">
      <div className="flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/webapp-logo.png" alt="BartMooi" className="size-28 object-contain" />
        <p className="text-2xl font-bold text-brand-text">BartMooi</p>
      </div>

      <div className="mt-6">
        <InstallHint />
      </div>

      <div className="my-auto space-y-4 py-6">
        <NextLink
          href="/meten/reageer"
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 px-6 py-8 text-center transition hover:border-brand active:scale-[0.98]">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-white">
            <Link className="size-7" />
          </span>
          <span className="text-lg font-bold">Reageer op aanvraag</span>
          <span className="text-sm text-slate-500">Aanvraag binnen? Stuur je linkje via WhatsApp of mail.</span>
        </NextLink>

        <NextLink
          href="/meten/inmeten"
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 px-6 py-8 text-center transition hover:border-brand active:scale-[0.98]">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-white">
            <MapPin className="size-7" />
          </span>
          <span className="text-lg font-bold">Inmeten</span>
          <span className="text-sm text-slate-500">Bij de klant: maten per raam invoeren en de offerte ter plekke mailen.</span>
        </NextLink>
      </div>

      <NextLink href="/admin/offertes" className="mx-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <LayoutDashboard className="size-4" /> Naar de offertes
      </NextLink>
    </main>
  );
}
