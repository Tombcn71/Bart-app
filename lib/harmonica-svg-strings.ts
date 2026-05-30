// Pure string-based SVG generatie voor harmonicadeuren (geen React, werkt in server actions).

const C  = "#000000";
const LW = 0.8;
const LT = 0.5;
const DC = "#1066a3";
const DS = 0.4;
const H  = 160;
const PW = 50;

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
  const mx = (x1+x2)/2;
  return sLine(x1, y+3, x1, y-3, DC, DS)
    + sLine(x2, y+3, x2, y-3, DC, DS)
    + sLine(x1, y, x2, y, DC, DS)
    + sPoly(`${r(x1)},${r(y)} ${r(x1+7)},${r(y-2.5)} ${r(x1+7)},${r(y+2.5)}`, DC)
    + sPoly(`${r(x2)},${r(y)} ${r(x2-7)},${r(y-2.5)} ${r(x2-7)},${r(y+2.5)}`, DC)
    + sRect(mx-16, y-5, 32, 10, "white", "none", 0)
    + sText(mx, y+3.5, label, "middle", 11, DC);
}
function dimV(y1: number, y2: number, x: number, label: string) {
  const my = (y1+y2)/2;
  return sLine(x-3, y1, x+3, y1, DC, DS)
    + sLine(x-3, y2, x+3, y2, DC, DS)
    + sLine(x, y1, x, y2, DC, DS)
    + sPoly(`${r(x)},${r(y1)} ${r(x-2.5)},${r(y1+7)} ${r(x+2.5)},${r(y1+7)}`, DC)
    + sPoly(`${r(x)},${r(y2)} ${r(x-2.5)},${r(y2-7)} ${r(x+2.5)},${r(y2-7)}`, DC)
    + sRect(x-5, my-16, 10, 32, "white", "none", 0)
    + sText(x, my+3.5, label, "middle", 11, DC, `transform="rotate(-90,${r(x)},${r(my)})"`);
}

export function buildHarmonicaSvgString(slug: string, breedte: number, hoogte: number): string {
  const sections = slug.includes("vijf") ? 5 : slug.includes("vier") ? 4 : 3;
  const vW = sections * PW + 10;
  const vH = H;

  let body = "";
  for (let i = 0; i < sections; i++) {
    const x1 = 5 + i * PW;
    const x2 = i === sections - 1 ? vW - 5 : x1 + PW;
    const w  = x2 - x1;
    const ix = x1 + 4, iy = 9, iw = w - 8, ih = H - 18;

    const d = i % 2 === 0
      ? `M${r(ix)} ${r(iy)} L${r(ix+iw)} ${r(iy+ih)}`
      : `M${r(ix+iw)} ${r(iy)} L${r(ix)} ${r(iy+ih)}`;

    body += sRect(x1, 5, w, H-10, "white", C, LW);
    body += sRect(ix, iy, iw, ih, "none", C, LT);
    body += `<path d="${d}" fill="none" stroke="${C}" stroke-width="${LT}"/>`;
    if (i < sections - 1) {
      body += sRect(x2-2, H/2-5, 4, 10, "white", C, LT);
    }
  }
  // greep op vrije zijde
  body += sRect(vW-9, H/2-12, 4, 24, "white", C, LT);

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
