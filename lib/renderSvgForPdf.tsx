const DARK = "#2d3748";

function vastSymbol(cx: number): string {
  return `
    <line x1="${cx + 10}" y1="20" x2="${cx + 90}" y2="80" stroke="${DARK}" stroke-width="0.5"/>
    <line x1="${cx + 90}" y1="20" x2="${cx + 10}" y2="80" stroke="${DARK}" stroke-width="0.5"/>
  `;
}

function dkSymbol(cx: number, mirror = false): string {
  const ax = mirror ? cx + 70 : cx + 30;
  const bx = mirror ? cx + 30 : cx + 70;
  return `
    <line x1="${ax}" y1="80" x2="${cx + 50}" y2="20" stroke="${DARK}" stroke-width="0.7"/>
    <line x1="${cx + 50}" y1="20" x2="${bx}" y2="80" stroke="${DARK}" stroke-width="0.7"/>
    <line x1="${ax}" y1="80" x2="${bx}" y2="80" stroke="${DARK}" stroke-width="0.7"/>
    <polyline points="${cx + 50},20 ${cx + 50},50 ${mirror ? cx + 40 : cx + 60},50" fill="none" stroke="${DARK}" stroke-width="0.7"/>
  `;
}

function kiepSymbol(cx: number): string {
  return `
    <line x1="${cx + 20}" y1="80" x2="${cx + 50}" y2="20" stroke="${DARK}" stroke-width="0.7"/>
    <line x1="${cx + 50}" y1="20" x2="${cx + 80}" y2="80" stroke="${DARK}" stroke-width="0.7"/>
    <line x1="${cx + 20}" y1="80" x2="${cx + 80}" y2="80" stroke="${DARK}" stroke-width="0.7"/>
  `;
}

function kozijnSvg(v: number, symbols: string): string {
  const w = v * 100;
  const dividers = Array.from({ length: v - 1 }, (_, i) =>
    `<line x1="${(i + 1) * 100}" y1="0" x2="${(i + 1) * 100}" y2="100" stroke="${DARK}" stroke-width="1"/>`
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 100" width="${w}" height="100">
    <rect x="0.5" y="0.5" width="${w - 1}" height="99" fill="none" stroke="${DARK}" stroke-width="1"/>
    ${dividers}
    ${symbols}
  </svg>`;
}

const slugToSvg: Record<string, string> = {
  "vast-kozijn":                              kozijnSvg(1, vastSymbol(0)),
  "draai-kiep-kozijn":                        kozijnSvg(1, dkSymbol(0)),
  "kiep-kozijn":                              kozijnSvg(1, kiepSymbol(0)),
  "draai-kiep-vast-kozijn":                   kozijnSvg(2, dkSymbol(0) + vastSymbol(100)),
  "draai-kiep-draai-stolp-kozijn":            kozijnSvg(2, dkSymbol(0) + dkSymbol(100, true)),
  "vast-vast-kozijn":                         kozijnSvg(2, vastSymbol(0) + vastSymbol(100)),
  "kiep-vast-liggend":                        kozijnSvg(2, kiepSymbol(0) + vastSymbol(100)),
  "kiep-kiep-kozijn":                         kozijnSvg(2, kiepSymbol(0) + kiepSymbol(100)),
  "dk-dk-gelijk":                             kozijnSvg(2, dkSymbol(0) + dkSymbol(100, true)),
  "vast-bovenlicht-kiep":                     kozijnSvg(1, vastSymbol(0)),
  "dk-bovenlicht-vast":                       kozijnSvg(1, dkSymbol(0)),
  "dk-bovenlicht-kiep":                       kozijnSvg(1, dkSymbol(0)),
  "dk-borstwering-vast":                      kozijnSvg(1, dkSymbol(0)),
  "draai-kiep-vast-draai-kiep-kozijn":        kozijnSvg(3, dkSymbol(0) + vastSymbol(100) + dkSymbol(200, true)),
  "vast-vast-vast-kozijn":                    kozijnSvg(3, vastSymbol(0) + vastSymbol(100) + vastSymbol(200)),
  "vast-draai-kiep-vast-kozijn":              kozijnSvg(3, vastSymbol(0) + dkSymbol(100) + vastSymbol(200)),
  "draai-kiep-vast-vast-kozijn":              kozijnSvg(3, dkSymbol(0) + vastSymbol(100) + vastSymbol(200)),
  "draai-kiep-draai-kiep-draai-kiep-kozijn":  kozijnSvg(3, dkSymbol(0) + dkSymbol(100) + dkSymbol(200, true)),
  "draai-kiep-vast-vast-draai-kiep-kozijn":   kozijnSvg(4, dkSymbol(0) + vastSymbol(100) + vastSymbol(200) + dkSymbol(300, true)),
  "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn": kozijnSvg(4, dkSymbol(0) + dkSymbol(100) + dkSymbol(200) + dkSymbol(300, true)),
};

export function renderSvgForPdf(slug: string): string | null {
  const svg = slugToSvg[slug];
  if (svg) {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }

  // Schuifpui
  if (slug.includes("schuifpui")) {
    const sections = slug.includes("4-vaks") ? 4 : 2;
    const w = sections * 45;
    const arrow = `
      <line x1="${w / 2 - 12}" y1="50" x2="${w / 2 + 12}" y2="50" stroke="${DARK}" stroke-width="1"/>
      <line x1="${w / 2 + 6}" y1="44" x2="${w / 2 + 12}" y2="50" stroke="${DARK}" stroke-width="1"/>
      <line x1="${w / 2 + 6}" y1="56" x2="${w / 2 + 12}" y2="50" stroke="${DARK}" stroke-width="1"/>
    `;
    const dividers = Array.from({ length: sections - 1 }, (_, i) =>
      `<line x1="${(i + 1) * 45}" y1="0" x2="${(i + 1) * 45}" y2="100" stroke="${DARK}" stroke-width="0.8"/>`
    ).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 100" width="${w}" height="100">
      <rect x="0.5" y="0.5" width="${w - 1}" height="99" fill="none" stroke="${DARK}" stroke-width="1"/>
      ${dividers}${arrow}
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }

  // Harmonicadeur
  if (slug.includes("harmonica")) {
    const sections = slug.includes("vijf") ? 5 : slug.includes("vier") ? 4 : 3;
    const w = sections * 30;
    const folds = Array.from({ length: sections - 1 }, (_, i) =>
      `<line x1="${(i + 1) * 30}" y1="0" x2="${(i + 1) * 30}" y2="100" stroke="${DARK}" stroke-width="0.8" stroke-dasharray="4,3"/>`
    ).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 100" width="${w}" height="100">
      <rect x="0.5" y="0.5" width="${w - 1}" height="99" fill="none" stroke="${DARK}" stroke-width="1"/>
      ${folds}
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }

  // Deur (fallback)
  if (slug.includes("deur") || slug.includes("voordeur") || slug.includes("achterdeur")) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="80" height="120">
      <rect x="0.5" y="0.5" width="79" height="119" fill="none" stroke="${DARK}" stroke-width="1"/>
      <rect x="8" y="8" width="64" height="104" fill="none" stroke="${DARK}" stroke-width="0.6"/>
      <path d="M 8 112 Q 72 112 72 8" fill="none" stroke="${DARK}" stroke-width="0.5" stroke-dasharray="3,3"/>
      <circle cx="14" cy="60" r="2.5" fill="${DARK}"/>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }

  return null;
}
