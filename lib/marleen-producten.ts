/** De andere producten die Marleen kan openen: waar hun calculator staat en welke typen er zijn (slug = naam). */
export const MARLEEN_PRODUCTEN: Record<string, { pad: string; typen: Record<string, string> }> = {
  schuifpui: { pad: "/schuifpuiconfigurator/", typen: { "schuifpui-2-vaks": "tweedelige schuifpui", "schuifpui-4-vaks": "vierdelige schuifpui" } },
  deur: {
    pad: "/deurconfigurator/",
    typen: {
      voordeur: "voordeur",
      achterdeur: "achterdeur",
      "voordeur-met-bovenlicht": "voordeur met bovenlicht",
      "achterdeur-met-bovenlicht": "achterdeur met bovenlicht",
      "achterdeur-met-borstwering": "achterdeur met borstwering",
      "deur-met-zijlicht": "deur met zijlicht",
      "voordeur-met-zijlicht": "voordeur met zijlicht",
      "dubbele-deur": "dubbele deur",
      "dubbele-deur-met-bovenlicht": "dubbele deur met bovenlicht",
    },
  },
  hor: { pad: "/horrenconfigurateur/", typen: { inzethor: "inzethor", klemhor: "klemhor", "plisse-hordeur": "plissé hordeur" } },
  rolluik: { pad: "/rolluikconfigurator/", typen: { rolluik: "rolluik", "inbouw-rolluik": "inbouw rolluik", screen: "screen" } },
  harmonicadeur: {
    pad: "/aluminium/harmonicadeurconfigurator/",
    typen: { "aluminium-harmonicadeur-3delig": "driedelige harmonicadeur", "aluminium-harmonicadeur-4delig": "vierdelige harmonicadeur", "aluminium-harmonicadeur-5delig": "vijfdelige harmonicadeur" },
  },
};
