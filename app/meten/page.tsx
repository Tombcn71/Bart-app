import NextLink from "next/link";
import { FileText, Link, MapPin } from "lucide-react";
import { InstallHint } from "./install-hint";

/**
 * Voorkant van de web app van BartMooi: precies één scherm, zonder scrollen.
 * Snel reageren op een aanvraag en inmeten bij de klant, groot genoeg om met één duim te raken.
 */
export default function MetenPage() {
  const knoppen = [
    {
      href: "/admin/offertes",
      Icon: FileText,
      titel: "Offertes",
      tekst: "Bekijk je verstuurde offertes en wie akkoord heeft gegeven.",
    },
    {
      href: "/meten/reageer",
      Icon: Link,
      titel: "Link versturen",
      tekst: "Stuur je klant je linkje via WhatsApp of mail, om zelf zijn prijs te berekenen.",
    },
    {
      href: "/meten/inmeten",
      Icon: MapPin,
      titel: "Inmeten",
      tekst: "Bij de klant: maten per raam invoeren en de offerte ter plekke mailen.",
    },
  ];

  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <InstallHint />

      <div className="grid min-h-0 flex-1 grid-rows-3 gap-3">
        {knoppen.map((k) => (
          <NextLink
            key={k.href}
            href={k.href}
            className="flex min-h-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-5 text-center transition hover:border-brand active:scale-[0.98]">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
              <k.Icon className="size-6" />
            </span>
            <span className="text-lg font-bold">{k.titel}</span>
            <span className="text-sm leading-snug text-slate-500">{k.tekst}</span>
          </NextLink>
        ))}
      </div>
    </main>
  );
}
