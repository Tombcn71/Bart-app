/**
 * Foto's van kozijnen op een gevel, gemaakt in Blender uit dezelfde indeling als de technische tekening.
 * Bestandsnaam: public/kozijnfotos/<gevel>-<type>-<kleur>.jpg, met kleur wit, antraciet of zwart.
 */
export const FOTO_GEVELS = [
  { id: "zand", naam: "Zandkleurige steen" },
  // Rode en donkere steen kunnen er later bij: render ze met scripts/blender/render-alles.sh en zet ze hier neer.
] as const;

export type FotoGevel = (typeof FOTO_GEVELS)[number]["id"];

/** Types waarvoor foto's zijn gemaakt (kozijnen, deuren, puien, rolluiken, horren). Andere types houden alleen de tekening. */
export const FOTO_TYPES = new Set<string>([
  "dk-13-vast-23",
  "dk-borstwering-vast",
  "dk-bovenlicht-kiep",
  "dk-bovenlicht-kiep-vast-2vaks",
  "dk-bovenlicht-vast",
  "dk-bovenlicht-vast-vast-2vaks",
  "dk-dk-gelijk",
  "dk-dk-stolp-bovenlicht-vast-2vaks",
  "dk-vast-bovenlichten-vast-2vaks",
  "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn",
  "draai-kiep-draai-kiep-draai-kiep-kozijn",
  "draai-kiep-draai-stolp-kozijn",
  "draai-kiep-kozijn",
  "draai-kiep-vast-dk-bovenlichten-vast",
  "draai-kiep-vast-draai-kiep-kozijn",
  "draai-kiep-vast-kozijn",
  "draai-kiep-vast-vast-draai-kiep-kozijn",
  "draai-kiep-vast-vast-kozijn",
  "kiep-kiep-kozijn",
  "kiep-kozijn",
  "kiep-vast-liggend",
  "vast-bovenlicht-kiep",
  "vast-bovenlicht-kiep-vast-2vaks",
  "vast-dk-vast-bovenlichten-vast",
  "vast-draai-kiep-vast-kozijn",
  "vast-kozijn",
  "vast-vast-kozijn",
  "vast-vast-vast-kozijn",
  // Deuren, schuifpuien, harmonicadeuren, rolluiken en horren
  "achterdeur",
  "achterdeur-met-borstwering",
  "achterdeur-met-borstwering-en-bovenlicht",
  "achterdeur-met-bovenlicht",
  "aluminium-deur",
  "aluminium-deur-2-vaks",
  "aluminium-deur-3vaks",
  "aluminium-deur-met-zijlicht",
  "aluminium-deur-met-zijlicht-met-borstwering",
  "aluminium-deur-met-zijlichten",
  "aluminium-dubbele-deur",
  "aluminium-dubbele-deur-2-vaks",
  "aluminium-dubbele-deur-met-zijlichten",
  "aluminium-harmonicadeur-3delig",
  "aluminium-harmonicadeur-4delig",
  "aluminium-harmonicadeur-5delig",
  "deur-met-zijlicht",
  "deur-met-zijlicht-en-bovenlicht",
  "deur-met-zijlicht-met-borstwering",
  "dubbele-deur",
  "dubbele-deur-met-borstwering",
  "dubbele-deur-met-borstwering-en-bovenlicht",
  "dubbele-deur-met-bovenlicht",
  "dubbele-deur-met-zijlicht",
  "dubbele-deur-met-zijlichten",
  "dubbele-deur-met-zijlichten-en-bovenlichten",
  "enkele-deur-met-zijlichten",
  "inbouw-rolluik",
  "inzethor",
  "klemhor",
  "plisse-hordeur",
  "rolluik",
  "schuifpui",
  "schuifpui-2-vaks",
  "schuifpui-4-vaks",
  "screen",
  "voordeur",
  "voordeur-met-bovenlicht",
  "voordeur-met-zijlicht",
  "voordeur-met-zijlicht-en-bovenlicht",
]);

/** De 28 kozijntypes staan al live als -v2; de nieuwe productfoto's (deuren, puien, rolluiken, horren) zijn -v3. */
const KOZIJNTYPES = new Set<string>([
  "dk-13-vast-23",
  "dk-borstwering-vast",
  "dk-bovenlicht-kiep",
  "dk-bovenlicht-kiep-vast-2vaks",
  "dk-bovenlicht-vast",
  "dk-bovenlicht-vast-vast-2vaks",
  "dk-dk-gelijk",
  "dk-dk-stolp-bovenlicht-vast-2vaks",
  "dk-vast-bovenlichten-vast-2vaks",
  "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn",
  "draai-kiep-draai-kiep-draai-kiep-kozijn",
  "draai-kiep-draai-stolp-kozijn",
  "draai-kiep-kozijn",
  "draai-kiep-vast-dk-bovenlichten-vast",
  "draai-kiep-vast-draai-kiep-kozijn",
  "draai-kiep-vast-kozijn",
  "draai-kiep-vast-vast-draai-kiep-kozijn",
  "draai-kiep-vast-vast-kozijn",
  "kiep-kiep-kozijn",
  "kiep-kozijn",
  "kiep-vast-liggend",
  "vast-bovenlicht-kiep",
  "vast-bovenlicht-kiep-vast-2vaks",
  "vast-dk-vast-bovenlichten-vast",
  "vast-draai-kiep-vast-kozijn",
  "vast-kozijn",
  "vast-vast-kozijn",
  "vast-vast-vast-kozijn",

]);

export const kozijnFotoPad = (gevel: string, slug: string, kleur: string) =>
  `/kozijnfotos/${gevel}-${slug}-${kleur}-${KOZIJNTYPES.has(slug) ? "v2" : "v3"}.jpg`;

/** Welke fotokleur hoort bij een gekozen kleurnaam of -id (wit, antraciet of zwart); anders geen foto. */
export function fotoKleurVan(keuze: string | undefined): "wit" | "antraciet" | "zwart" | null {
  const k = (keuze ?? "").toLowerCase();
  if (!k || /houtmotief|cr-?me|creme|9001/.test(k)) return null;
  if (/antraciet|7016/.test(k)) return "antraciet";
  if (/zwart|9005|7021/.test(k)) return "zwart";
  if (/^wit$|9016|9010/.test(k)) return "wit";
  return null;
}
