import { buildDeurSvgString } from "./deur-svg-strings";
import { buildKozijnSvgString } from "./kozijn-svg-strings";
import { buildSchuifpuiSvgString } from "./schuifpui-svg-strings";
import { buildHarmonicaSvgString } from "./harmonica-svg-strings";
import { buildHorSvgString } from "./hor-svg-strings";
import { buildRolluikSvgString } from "./rolluik-svg-strings";

// Kozijn en deur tonen glas al via hun eigen glasLabel bovenaan
function heeftEigenGlasLabel(slug: string): boolean {
  return (
    !slug.includes("harmonica") &&
    !slug.includes("schuifpui") &&
    slug !== "driedelig" && slug !== "vierdelig" && slug !== "vijfdelig" &&
    slug !== "inzethor" && slug !== "klemhor" && slug !== "plisse-hordeur" &&
    slug !== "rolluik" && slug !== "inbouw-rolluik" && slug !== "screen"
  );
}

function injectLabel(svg: string, slug: string, glas?: string, materiaal?: string): string {
  const labelTekst = [materiaal, glas ? glas.replace(/-/g, " ") : ""].filter(Boolean).join(" · ");
  if (!labelTekst || heeftEigenGlasLabel(slug)) return svg;

  // Lees viewBox breedte en hoogte voor absolute positionering
  const match = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const totalW = match ? parseFloat(match[1]) : 200;
  const totalH = match ? parseFloat(match[2]) : 200;

  const label = `<text x="${(totalW / 2).toFixed(1)}" y="${(totalH - 4).toFixed(1)}" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#9ca3af">${labelTekst}</text>`;
  return svg.replace(/<\/svg>/, `${label}</svg>`);
}

export function getSvgString(slug: string, breedte = 1000, hoogte = 1200, glas?: string, materiaal?: string): string | null {
  if (!slug) return null;
  let svg: string;
  if (slug === "inzethor" || slug === "klemhor" || slug === "plisse-hordeur") svg = buildHorSvgString(slug, breedte, hoogte);
  else if (slug === "rolluik" || slug === "inbouw-rolluik" || slug === "screen") svg = buildRolluikSvgString(slug, breedte, hoogte);
  else if (slug.includes("schuifpui")) svg = buildSchuifpuiSvgString(slug, breedte, hoogte);
  else if (slug.includes("harmonica") || slug === "driedelig" || slug === "vierdelig" || slug === "vijfdelig") svg = buildHarmonicaSvgString(slug, breedte, hoogte);
  else if (slug.includes("deur") && !slug.includes("kozijn")) svg = buildDeurSvgString(slug, breedte, hoogte, glas);
  else svg = buildKozijnSvgString(slug, breedte, hoogte, glas);
  return injectLabel(svg, slug, glas, materiaal);
}

export function renderSvgForPdf(slug: string): string | null {
  const svg = getSvgString(slug);
  if (!svg) return null;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
