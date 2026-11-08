import { technischSvg, TECHNISCH } from "../app/components/KozijnTechnisch";
import { jsxNaarSvg } from "./jsx-naar-svg";
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

/**
 * De technische tekening van de site, als svg-tekst voor de pdf: dezelfde tekening als in de calculator, met de maten.
 * Het glas en het materiaal komen als regel onder de tekening.
 */
function technischeSvg(slug: string, breedte: number, hoogte: number, glas?: string, materiaal?: string): string {
  const html = jsxNaarSvg(technischSvg({ breedte, hoogte, spec: TECHNISCH[slug], maten: true }, "pdf"));
  // De losse stijlregel is voor de browser; de pdf-omzetter heeft hem niet nodig.
  let svg = html.replace(/<style>[\s\S]*?<\/style>/, "").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  const vb = svg.match(/viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/);
  if (!vb) return svg;
  const [x, y, w, h] = vb.slice(1).map(Number);
  const regel = [materiaal, glas ? glas.replace(/-/g, " ") : ""].filter(Boolean).join(" · ");
  const extra = regel ? h * 0.07 : 0;
  svg = svg.replace(vb[0], `viewBox="${x} ${y} ${w} ${h + extra}" width="${w}" height="${h + extra}"`);
  if (regel) {
    const label = `<text x="${x + w / 2}" y="${y + h + extra * 0.7}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${extra * 0.55}" fill="#9ca3af">${regel}</text>`;
    svg = svg.replace("</svg>", `${label}</svg>`);
  }
  // Witte achtergrond onder de hele tekening.
  return svg.replace(/(<svg[^>]*>)/, `$1<rect x="${x}" y="${y}" width="${w}" height="${h + extra}" fill="white"/>`);
}

export function getSvgString(slug: string, breedte = 1000, hoogte = 1200, glas?: string, materiaal?: string): string | null {
  if (!slug) return null;
  if (TECHNISCH[slug]) return technischeSvg(slug, breedte, hoogte, glas, materiaal);
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
