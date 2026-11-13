"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Smartphone, X } from "lucide-react";

const DISMISS_KEY = "bartmooi:install-hint-dismissed";

type InstallPrompt = Event & { prompt: () => Promise<void> };

const noSubscribe = () => () => {};

/** "hidden" als de app al geïnstalleerd draait of de melding is weggeklikt. */
function detectDevice(): "hidden" | "ios" | "other" {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  let dismissed = false;
  try {
    dismissed = localStorage.getItem(DISMISS_KEY) === "1";
  } catch {}
  if (standalone || dismissed) return "hidden";
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ? "ios" : "other";
}

/** "Zet de app op je startscherm": Android krijgt een installeerknop, iPhone de stappen. Verborgen als de app al draait. */
export function InstallHint() {
  const device = useSyncExternalStore(noSubscribe, detectDevice, () => null);
  const [closed, setClosed] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    setClosed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  }

  if (!device || device === "hidden" || closed) return null;
  const ios = device === "ios";

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 p-4">
      <Smartphone className="mt-0.5 size-5 shrink-0 text-brand-text" />
      <div className="flex-1 text-sm">
        <p className="font-semibold">Zet BartMooi op je startscherm</p>
        <p className="mt-1 text-slate-500">Open de app met één tik, schermvullend en met je eigen logo.</p>
        {prompt ? (
          <button
            type="button"
            className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark"
            onClick={async () => {
              await prompt.prompt();
              dismiss();
            }}>
            Installeer de app
          </button>
        ) : ios ? (
          <p className="mt-2 text-slate-600">Open deze pagina in Safari, tik onderin op Delen (het vierkantje met de pijl) en kies &lsquo;Zet op beginscherm&rsquo;.</p>
        ) : (
          <p className="mt-2 text-slate-600">Kies in het menu van je browser &lsquo;App installeren&rsquo; of &lsquo;Toevoegen aan startscherm&rsquo;.</p>
        )}
      </div>
      <button type="button" aria-label="Sluiten" onClick={dismiss} className="self-start text-slate-400 hover:text-slate-700">
        <X className="size-4" />
      </button>
    </div>
  );
}
