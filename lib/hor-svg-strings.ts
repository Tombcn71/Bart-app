// Pure string-based SVG generatie voor horren (geen React, werkt in server actions).
// Vierkant: viewBox 0 0 100 100, met gaaspatroon.

const C  = "#000000";
const LW = 0.8;
const LT = 0.5;
const LM = 0.3;  // gaas
const DC = "#1066a3";
const DS = 0.4;

function r(n: number) { return n.toFixed(1); }
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

function gaas(x: number, y: number, w: number, h: number): string {
  const step = 6;
  let s = "";
  for (let dy = step; dy < h; dy += step) s += sLine(x, y+dy, x+w, y+dy, C, LM);
  for (let dx = step; dx < w; dx += step) s += sLine(x+dx, y, x+dx, y+h, C, LM);
  return s;
}

function dimH(x1: number, x2: number, y: number, label: string) {
  const mx = (x1+x2)/2;
  return sLine(x1, y+3, x1, y-3, DC, DS) + sLine(x2, y+3, x2, y-3, DC, DS) + sLine(x1, y, x2, y, DC, DS)
    + sPoly(`${r(x1)},${r(y)} ${r(x1+7)},${r(y-2.5)} ${r(x1+7)},${r(y+2.5)}`, DC)
    + sPoly(`${r(x2)},${r(y)} ${r(x2-7)},${r(y-2.5)} ${r(x2-7)},${r(y+2.5)}`, DC)
    + sRect(mx-16, y-5, 32, 10, "white", "none", 0) + sText(mx, y+3.5, label, "middle", 11, DC);
}
function dimV(y1: number, y2: number, x: number, label: string) {
  const my = (y1+y2)/2;
  return sLine(x-3, y1, x+3, y1, DC, DS) + sLine(x-3, y2, x+3, y2, DC, DS) + sLine(x, y1, x, y2, DC, DS)
    + sPoly(`${r(x)},${r(y1)} ${r(x-2.5)},${r(y1+7)} ${r(x+2.5)},${r(y1+7)}`, DC)
    + sPoly(`${r(x)},${r(y2)} ${r(x-2.5)},${r(y2-7)} ${r(x+2.5)},${r(y2-7)}`, DC)
    + sRect(x-5, my-16, 10, 32, "white", "none", 0)
    + sText(x, my+3.5, label, "middle", 11, DC, `transform="rotate(-90,${r(x)},${r(my)})"`);
}

export function buildHorSvgString(slug: string, breedte: number, hoogte: number): string {
  const isPlisse = slug === "plisse-hordeur";
  const vW = 100, vH = isPlisse ? 160 : 100;

  let body = isPlisse
    ? sRect(10, 5, 80, 150, "white", C, LW)
      + sRect(14, 9, 72, 142, "white", C, LT)
      + gaas(14, 9, 72, 142)
      + sRect(10, 78, 80, 4, "white", C, LT)
      + `<rect x="86" y="77" width="5" height="6" rx="1" fill="${C}" stroke="none"/>`
    : sRect(5, 5, 90, 90, "white", C, LW)
      + sRect(9, 9, 82, 82, "white", C, LT)
      + gaas(9, 9, 82, 82);

  if (slug === "klemhor") {
    body += sRect(91, 28, 6, 14, "white", C, LT);
    body += sRect(91, 58, 6, 14, "white", C, LT);
  }

  const PL = 30, PT = 8, PB = 24, PR = 6;
  const totalW = vW + PL + PR;
  const totalH = vH + PT + PB;
  const wY = PT + vH + 15;
  const hX = PL - 18;

  const witnesses =
    sLine(PL,    PT+vH+3, PL,    wY-2, DC, DS) +
    sLine(PL+vW, PT+vH+3, PL+vW, wY-2, DC, DS) +
    sLine(PL-3,  PT,      hX+2,  PT,   DC, DS) +
    sLine(PL-3,  PT+vH,   hX+2,  PT+vH, DC, DS);

  const dims = dimH(PL, PL+vW, wY, `${breedte} mm`) + dimV(PT, PT+vH, hX, `${hoogte} mm`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="white"/>
  <g transform="translate(${PL},${PT})">${body}</g>
  ${witnesses}${dims}
</svg>`;
}
