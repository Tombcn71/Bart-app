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

function injectFont(svg: string): string {
  return svg.replace(/<svg([^>]*)>/, `<svg$1>${FONT_DEFS}`);
}

export function getSvgString(slug: string, breedte = 1000, hoogte = 1200, glas?: string): string | null {
  if (!slug) return null;
  let svg: string;
  if (slug === "inzethor" || slug === "klemhor" || slug === "plisse-hordeur") svg = buildHorSvgString(slug, breedte, hoogte);
  else if (slug === "rolluik" || slug === "inbouw-rolluik" || slug === "screen") svg = buildRolluikSvgString(slug, breedte, hoogte);
  else if (slug.includes("schuifpui")) svg = buildSchuifpuiSvgString(slug, breedte, hoogte);
  else if (slug.includes("harmonica") || slug === "driedelig" || slug === "vierdelig" || slug === "vijfdelig") svg = buildHarmonicaSvgString(slug, breedte, hoogte);
  else if (slug.includes("deur") && !slug.includes("kozijn")) svg = buildDeurSvgString(slug, breedte, hoogte, glas);
  else svg = buildKozijnSvgString(slug, breedte, hoogte, glas);
  return injectFont(svg);
}

export function renderSvgForPdf(slug: string): string | null {
  const svg = getSvgString(slug);
  if (!svg) return null;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
