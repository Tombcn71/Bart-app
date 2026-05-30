// Pure string-based SVG generatie voor schuifpui (geen React, werkt in server actions).
// Zelfde architecturale stijl als schuifpui-svgs.tsx.

const C  = "#000000";
const LW = 0.8;
const LT = 0.5;
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

// x1/x2 = exacte linker/rechtergrens van het paneel
const VH = 160;   // deur-hoogte
const CY = 80;    // verticaal centrum

function vastP(x1: number, x2: number): string {
  const cx = (x1+x2)/2, w = x2-x1;
  return sRect(x1, 5, w, VH-10, "white", C, LW)
    + sRect(x1+4, 9, w-8, VH-18, "none", C, LT)
    + sLine(cx-6, CY, cx+6, CY, C, LT)
    + sLine(cx, CY-6, cx, CY+6, C, LT);
}

function schuifP(x1: number, x2: number, dir: "l" | "r"): string {
  const cx = (x1+x2)/2, w = x2-x1;
  const ax1 = cx-18, ax2 = cx+18;
  const head = dir === "r"
    ? `${r(ax2)},${r(CY)} ${r(ax2-8)},${r(CY-3.5)} ${r(ax2-8)},${r(CY+3.5)}`
    : `${r(ax1)},${r(CY)} ${r(ax1+8)},${r(CY-3.5)} ${r(ax1+8)},${r(CY+3.5)}`;
  const hx = dir === "r" ? x1+3 : x2-8;
  return sRect(x1, 5, w, VH-10, "white", C, LW)
    + sRect(x1+4, 9, w-8, VH-18, "none", C, LT)
    + sRect(hx, CY-12, 5, 24, "white", C, LT)
    + sLine(ax1, CY, ax2, CY, C, LT)
    + sPoly(head, C);
}

export function buildSchuifpuiSvgString(slug: string, breedte: number, hoogte: number): string {
  const vH = VH;
  const vW = slug.includes("4-vaks") ? 400 : 200;

  const body = slug.includes("4-vaks")
    ? vastP(5,100) + schuifP(100,200,"l") + schuifP(200,300,"r") + vastP(300,395)
    : schuifP(5,100,"r") + vastP(100,195);

  const PL = 30, PT = 8, PB = 24, PR = 6;
  const totalW = vW + PL + PR;
  const totalH = vH + PT + PB;
  const wY = PT + vH + 15;
  const hX = PL - 18;

  const witnesses =
    sLine(PL,    PT+vH+3, PL,    wY-2,  DC, DS) +
    sLine(PL+vW, PT+vH+3, PL+vW, wY-2,  DC, DS) +
    sLine(PL-3,  PT,      hX+2,  PT,    DC, DS) +
    sLine(PL-3,  PT+vH,   hX+2,  PT+vH, DC, DS);

  const dims =
    dimH(PL, PL+vW, wY, `${breedte} mm`) +
    dimV(PT, PT+vH, hX, `${hoogte} mm`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="white"/>
  <g transform="translate(${PL},${PT})">${body}</g>
  ${witnesses}${dims}
</svg>`;
}
