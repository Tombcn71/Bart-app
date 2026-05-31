import { buildDeurSvgString } from "./deur-svg-strings";
import { buildKozijnSvgString } from "./kozijn-svg-strings";
import { buildSchuifpuiSvgString } from "./schuifpui-svg-strings";
import { buildHarmonicaSvgString } from "./harmonica-svg-strings";
import { buildHorSvgString } from "./hor-svg-strings";
import { buildRolluikSvgString } from "./rolluik-svg-strings";

export function getSvgString(slug: string, breedte = 1000, hoogte = 1200, glas?: string): string | null {
  if (!slug) return null;
  if (slug === "inzethor" || slug === "klemhor" || slug === "plisse-hordeur") return buildHorSvgString(slug, breedte, hoogte);
  if (slug === "rolluik" || slug === "inbouw-rolluik" || slug === "screen") return buildRolluikSvgString(slug, breedte, hoogte);
  if (slug.includes("schuifpui")) return buildSchuifpuiSvgString(slug, breedte, hoogte);
  if (slug.includes("harmonica") || slug === "driedelig" || slug === "vierdelig" || slug === "vijfdelig") return buildHarmonicaSvgString(slug, breedte, hoogte);
  if (slug.includes("deur") && !slug.includes("kozijn")) return buildDeurSvgString(slug, breedte, hoogte, glas);
  return buildKozijnSvgString(slug, breedte, hoogte, glas);
}

export function renderSvgForPdf(slug: string): string | null {
  const svg = getSvgString(slug);
  if (!svg) return null;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
