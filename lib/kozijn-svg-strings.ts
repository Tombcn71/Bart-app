// Pure string-based SVG generatie voor kozijn types (geen React, werkt in server actions).
// Zelfde architecturale stijl als kozijn-svgs.tsx en deur-svg-strings.ts.

const C  = "#000000";
const LW = 0.8;   // lineWidth — panelen en frame
const LT = 0.5;   // lineThin  — details, borstwering
const DC = "#1066a3"; // dimension color
const DS = 0.4;   // dimension stroke width

function r(n: number) { return n.toFixed(1); }

// ─── SVG primitieven ─────────────────────────────────────────────────────────

function sRect(x: number, y: number, w: number, h: number, fill: string, stroke: string, sw: number) {
  return `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function sLine(x1: number, y1: number, x2: number, y2: number, stroke: string, sw: number) {
  return `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function sPoly(points: string, fill: string) {
  return `<polygon points="${points}" fill="${fill}"/>`;
}
function sText(x: number, y: number, txt: string, anchor: string, fs: number, fill: string, transform = "") {
  return `<text x="${r(x)}" y="${r(y)}" text-anchor="${anchor}" font-family="Arial,sans-serif" font-size="${fs}" fill="${fill}" ${transform}>${txt}</text>`;
}

// ─── Maatpijlen ──────────────────────────────────────────────────────────────

function dimH(x1: number, x2: number, y: number, label: string) {
  const mx = (x1 + x2) / 2;
  return sLine(x1, y+3, x1, y-3, DC, DS)
    + sLine(x2, y+3, x2, y-3, DC, DS)
    + sLine(x1, y, x2, y, DC, DS)
    + sPoly(`${r(x1)},${r(y)} ${r(x1+7)},${r(y-2.5)} ${r(x1+7)},${r(y+2.5)}`, DC)
    + sPoly(`${r(x2)},${r(y)} ${r(x2-7)},${r(y-2.5)} ${r(x2-7)},${r(y+2.5)}`, DC)
    + sRect(mx-16, y-5, 32, 10, "white", "none", 0)
    + sText(mx, y+3.5, label, "middle", 11, DC);
}
function dimV(y1: number, y2: number, x: number, label: string) {
  const my = (y1 + y2) / 2;
  return sLine(x-3, y1, x+3, y1, DC, DS)
    + sLine(x-3, y2, x+3, y2, DC, DS)
    + sLine(x, y1, x, y2, DC, DS)
    + sPoly(`${r(x)},${r(y1)} ${r(x-2.5)},${r(y1+7)} ${r(x+2.5)},${r(y1+7)}`, DC)
    + sPoly(`${r(x)},${r(y2)} ${r(x-2.5)},${r(y2-7)} ${r(x+2.5)},${r(y2-7)}`, DC)
    + sRect(x-5, my-16, 10, 32, "white", "none", 0)
    + sText(x, my+3.5, label, "middle", 11, DC, `transform="rotate(-90,${r(x)},${r(my)})"`);
}

// ─── Vak helpers ─────────────────────────────────────────────────────────────
// ox = vak offset (0, 100, 200, 300)
// Elk vak = 100px breed. Paneel x=ox+5, width=90. Inner x=ox+9, width=82.

function sch3(x: number, y: number, h: number): string {
  return [0.12, 0.45, 0.78].map(p => sRect(x-2, y+h*p, 4, 7, "white", C, LT)).join("");
}

// Vast paneel (of vast bovenlicht)
function vastP(ox: number, y: number, h: number): string {
  return sRect(ox+5, y, 90, h, "white", C, LW)
    + sRect(ox+9, y+4, 82, h-8, "none", C, LT);
}

// Draai-kiep paneel; mirror=true → scharnieren rechts, openingsrichting links
function dkP(ox: number, y: number, h: number, mirror = false): string {
  const ix = ox+9, iy = y+4, iw = 82, ih = h-8;
  const vPath = mirror
    ? `M${r(ix+iw)} ${r(iy)} L${r(ix)} ${r(iy+ih/2)} L${r(ix+iw)} ${r(iy+ih)}`
    : `M${r(ix)} ${r(iy)} L${r(ix+iw)} ${r(iy+ih/2)} L${r(ix)} ${r(iy+ih)}`;
  const kx = mirror ? ix-4 : ix+iw-4;
  const sx = mirror ? ix+iw : ix;
  return sRect(ox+5, y, 90, h, "white", C, LW)
    + sRect(ix, iy, iw, ih, "none", C, LT)
    + `<path d="${vPath}" fill="none" stroke="${C}" stroke-width="${LT}"/>`
    + `<rect x="${r(kx)}" y="${r(iy+ih/2-1.5)}" width="8" height="3" rx="1" fill="${C}" stroke="none"/>`
    + sch3(sx, iy, ih);
}

// Kiep paneel (of kiep bovenlicht): Λ-indicator, handgreep boven
function kiepP(ox: number, y: number, h: number): string {
  const ix = ox+9, iy = y+4, iw = 82, ih = h-8;
  const mx = ox+50;
  return sRect(ox+5, y, 90, h, "white", C, LW)
    + sRect(ix, iy, iw, ih, "none", C, LT)
    + `<path d="M${r(ix)} ${r(iy+ih)} L${r(mx)} ${r(iy)} L${r(ix+iw)} ${r(iy+ih)}" fill="none" stroke="${C}" stroke-width="${LT}"/>`
    + `<rect x="${r(mx-4)}" y="${r(iy-2)}" width="8" height="3" rx="1" fill="${C}" stroke="none"/>`;
}

// Borstwering: blind paneel (dun lint)
function borst(ox: number, y: number, h: number): string {
  return sRect(ox+5, y, 90, h, "white", C, LT);
}

// Doorlopend bovenlicht over meerdere vakken
function blSpan(x1: number, x2: number, y: number, h: number): string {
  const w = x2 - x1;
  return sRect(x1, y, w, h, "white", C, LW)
    + sRect(x1+4, y+4, w-8, h-8, "none", C, LT);
}

// ─── Body per slug ────────────────────────────────────────────────────────────

function buildKozijnBody(slug: string): { body: string; vW: number } {

  // ── 1-vak (vW=100) ─────────────────────────────────────────────────────────
  if (slug === "vast-kozijn")
    return { vW: 100, body: vastP(0, 5, 90) };

  if (slug === "draai-kiep-kozijn")
    return { vW: 100, body: dkP(0, 5, 90) };

  if (slug === "kiep-kozijn")
    return { vW: 100, body: kiepP(0, 5, 90) };

  if (slug === "vast-bovenlicht-kiep")
    return { vW: 100, body: kiepP(0, 5, 27) + vastP(0, 36, 59) };

  if (slug === "dk-bovenlicht-vast")
    return { vW: 100, body: vastP(0, 5, 25) + dkP(0, 34, 61) };

  if (slug === "dk-bovenlicht-kiep")
    return { vW: 100, body: kiepP(0, 5, 27) + dkP(0, 36, 59) };

  if (slug === "dk-borstwering-vast")
    return { vW: 100, body: dkP(0, 5, 57) + borst(0, 66, 29) };

  // ── 2-vak (vW=200) ─────────────────────────────────────────────────────────
  if (slug === "draai-kiep-vast-kozijn")
    return { vW: 200, body: dkP(0, 5, 90) + vastP(100, 5, 90) };

  if (slug === "draai-kiep-draai-stolp-kozijn")
    return { vW: 200, body: dkP(0, 5, 90) + dkP(100, 5, 90, true) };

  if (slug === "vast-vast-kozijn" || slug === "vast-vast-horizontaal")
    return { vW: 200, body: vastP(0, 5, 90) + vastP(100, 5, 90) };

  if (slug === "kiep-vast-liggend")
    return { vW: 200, body: kiepP(0, 5, 90) + vastP(100, 5, 90) };

  if (slug === "kiep-kiep-kozijn")
    return { vW: 200, body: kiepP(0, 5, 90) + kiepP(100, 5, 90) };

  if (slug === "dk-dk-gelijk")
    return { vW: 200, body: dkP(0, 5, 90) + dkP(100, 5, 90, true) };

  if (slug === "dk-13-vast-23")
    return { vW: 200, body: dkP(0, 5, 90) + vastP(100, 5, 90) };

  if (slug === "dk-dk-stolp-bovenlicht-vast-2vaks")
    return { vW: 200, body: blSpan(5, 195, 5, 21) + dkP(0, 30, 65) + dkP(100, 30, 65, true) };

  if (slug === "dk-vast-bovenlichten-vast-2vaks")
    return { vW: 200, body: vastP(0, 5, 21) + vastP(100, 5, 21) + dkP(0, 30, 65) + vastP(100, 30, 65) };

  if (slug === "dk-bovenlicht-kiep-vast-2vaks")
    return { vW: 200, body: kiepP(0, 5, 25) + dkP(0, 34, 61) + vastP(100, 5, 90) };

  if (slug === "vast-bovenlicht-kiep-vast-2vaks")
    return { vW: 200, body: kiepP(0, 5, 25) + vastP(0, 34, 61) + vastP(100, 5, 90) };

  if (slug === "dk-bovenlicht-vast-vast-2vaks")
    return { vW: 200, body: vastP(0, 5, 17) + dkP(0, 26, 69) + vastP(100, 5, 90) };

  // ── 3-vak (vW=300) ─────────────────────────────────────────────────────────
  if (slug === "draai-kiep-vast-draai-kiep-kozijn")
    return { vW: 300, body: dkP(0, 5, 90) + vastP(100, 5, 90) + dkP(200, 5, 90, true) };

  if (slug === "vast-vast-vast-kozijn")
    return { vW: 300, body: vastP(0, 5, 90) + vastP(100, 5, 90) + vastP(200, 5, 90) };

  if (slug === "vast-draai-kiep-vast-kozijn")
    return { vW: 300, body: vastP(0, 5, 90) + dkP(100, 5, 90) + vastP(200, 5, 90) };

  if (slug === "draai-kiep-vast-vast-kozijn")
    return { vW: 300, body: dkP(0, 5, 90) + vastP(100, 5, 90) + vastP(200, 5, 90) };

  if (slug === "draai-kiep-draai-kiep-draai-kiep-kozijn")
    return { vW: 300, body: dkP(0, 5, 90) + dkP(100, 5, 90) + dkP(200, 5, 90, true) };

  if (slug === "draai-kiep-vast-dk-bovenlichten-vast")
    return { vW: 300, body:
      vastP(0, 5, 21) + vastP(100, 5, 21) + vastP(200, 5, 21) +
      dkP(0, 30, 65) + vastP(100, 30, 65) + dkP(200, 30, 65, true) };

  if (slug === "vast-dk-vast-bovenlichten-vast")
    return { vW: 300, body:
      vastP(0, 5, 21) + vastP(100, 5, 21) + vastP(200, 5, 21) +
      vastP(0, 30, 65) + dkP(100, 30, 65) + vastP(200, 30, 65) };

  // ── 4-vak (vW=400) ─────────────────────────────────────────────────────────
  if (slug === "draai-kiep-vast-vast-draai-kiep-kozijn")
    return { vW: 400, body: dkP(0, 5, 90) + vastP(100, 5, 90) + vastP(200, 5, 90) + dkP(300, 5, 90, true) };

  if (slug === "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn")
    return { vW: 400, body: dkP(0, 5, 90) + dkP(100, 5, 90) + dkP(200, 5, 90) + dkP(300, 5, 90, true) };

  // Fallback
  return { vW: 100, body: vastP(0, 5, 90) };
}

// ─── Hoofd export ─────────────────────────────────────────────────────────────

export function buildKozijnSvgString(slug: string, breedte: number, hoogte: number, glas?: string): string {
  const { body, vW } = buildKozijnBody(slug);
  const vH = 100;

  const PL = 30, PT = glas ? 18 : 8, PB = 24, PR = 6;
  const totalW = vW + PL + PR;
  const totalH = vH + PT + PB;

  const wY = PT + vH + 15;
  const hX = PL - 18;

  const witnesses =
    sLine(PL,      PT+vH+3, PL,      wY-2,  DC, DS) +
    sLine(PL+vW,   PT+vH+3, PL+vW,   wY-2,  DC, DS) +
    sLine(PL-3,    PT,      hX+2,    PT,    DC, DS) +
    sLine(PL-3,    PT+vH,   hX+2,    PT+vH, DC, DS);

  const glasLabel = glas
    ? sText(PL+vW/2, PT-6, glas, "middle", 8, DC)
    : "";

  const dims =
    dimH(PL, PL+vW, wY, `${breedte} mm`) +
    dimV(PT, PT+vH, hX, `${hoogte} mm`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="white"/>
  ${glasLabel}
  <g transform="translate(${PL},${PT})">${body}</g>
  ${witnesses}${dims}
</svg>`;
}
