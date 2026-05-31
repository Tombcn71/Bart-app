import { buildDeurSvgString } from "./deur-svg-strings";
import { buildKozijnSvgString } from "./kozijn-svg-strings";
import { buildSchuifpuiSvgString } from "./schuifpui-svg-strings";
import { buildHarmonicaSvgString } from "./harmonica-svg-strings";
import { buildHorSvgString } from "./hor-svg-strings";
import { buildRolluikSvgString } from "./rolluik-svg-strings";
import path from "path";
import fs from "fs";

// Inter als base64 injecteren zodat resvg de maattekst kan renderen
const fontB64 = fs.readFileSync(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf")).toString("base64");
const FONT_DEFS = `<defs><style>@font-face{font-family:'Arial';src:url('data:font/truetype;base64,${fontB64}')format('truetype');}</style></defs>`;

// Kozijn en deur tonen glas al via hun eigen glasLabel bovenaan — niet dubbel injecteren
function heeftEigenGlasLabel(slug: string): boolean {
  return (!slug.includes("harmonica") && !slug.includes("schuifpui") &&
    slug !== "driedelig" && slug !== "vierdelig" && slug !== "vijfdelig" &&
    slug !== "inzethor" && slug !== "klemhor" && slug !== "plisse-hordeur" &&
    slug !== "rolluik" && slug !== "inbouw-rolluik" && slug !== "screen");
}

function injectFontAndLabel(svg: string, slug: string, glas?: string, materiaal?: string): string {
  const labelTekst = [materiaal, glas ? glas.replace(/-/g, " ") : ""].filter(Boolean).join(" · ");
  const label = labelTekst && !heeftEigenGlasLabel(slug)
    ? `<text x="50%" y="96%" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="#9ca3af">${labelTekst}</text>`
    : "";
  return svg
    .replace(/<svg([^>]*)>/, `<svg$1>${FONT_DEFS}`)
    .replace(/<\/svg>/, `${label}</svg>`);
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
  return injectFontAndLabel(svg, slug, glas, materiaal);
}

export function renderSvgForPdf(slug: string): string | null {
  const svg = getSvgString(slug);
  if (!svg) return null;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
