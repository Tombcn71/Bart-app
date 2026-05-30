// Pure string-based SVG generatie voor deur types (geen React, werkt in server actions).
// Zelfde architecturale stijl als deur-svgs.tsx.

const C = "#000000";
const LW = 0.8;   // lineWidth — panelen en frame
const LT = 0.5;   // lineThin  — details
const DC = "#9ca3af"; // subtiele maat-kleur // dimension color
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

// ─── Panel helpers ────────────────────────────────────────────────────────────

function frame(x: number, y: number, w: number, h: number) {
  return sRect(x, y, w, h, "white", C, LW);
}
function profiel(x: number, y: number, w: number, h: number) {
  return sRect(x+4, y+4, w-8, h-8, "none", C, LT);
}
function dkPaneel(x: number, y: number, w: number, h: number) {
  return sRect(x, y, w, h, "white", C, LW)
    + sRect(x+4, y+4, w-8, h-8, "none", C, LT)
    + `<path d="M${r(x)} ${r(y)} L${r(x+w)} ${r(y+h/2)} L${r(x)} ${r(y+h)}" fill="none" stroke="${C}" stroke-width="${LT}"/>`;
}
function dkPaneelR(x: number, y: number, w: number, h: number) {
  return sRect(x, y, w, h, "white", C, LW)
    + sRect(x+4, y+4, w-8, h-8, "none", C, LT)
    + `<path d="M${r(x+w)} ${r(y)} L${r(x)} ${r(y+h/2)} L${r(x+w)} ${r(y+h)}" fill="none" stroke="${C}" stroke-width="${LT}"/>`;
}
function voordeurPaneel(x: number, y: number, w: number, h: number) {
  const archH = Math.round(h * 0.32);
  const gridY = y + archH + 5;
  const gridH = Math.round(h * 0.30);
  const plankY = gridY + gridH + 5;
  const mx = x + w / 2;
  return sRect(x, y, w, h, "white", C, LW)
    + sRect(x+4, y+4, w-8, h-8, "none", C, LT)
    + `<path d="M${r(x+7)} ${r(y+archH+4)} Q${r(x+7)} ${r(y+7)} ${r(mx)} ${r(y+7)} Q${r(x+w-7)} ${r(y+7)} ${r(x+w-7)} ${r(y+archH+4)}" fill="none" stroke="${C}" stroke-width="${LT}"/>`
    + sRect(x+7, gridY, w-14, gridH, "none", C, LT)
    + sLine(mx, gridY, mx, gridY+gridH, C, LT)
    + sLine(x+7, gridY+gridH/2, x+w-7, gridY+gridH/2, C, LT)
    + sRect(x+7, plankY, w-14, (y+h-7)-plankY, "none", C, LT);
}
function bovenlicht(x: number, y: number, w: number, h: number) {
  return sRect(x, y, w, h, "white", C, LT)
    + sLine(x+w/2-4, y+h/2, x+w/2+4, y+h/2, C, LT)
    + sLine(x+w/2, y+h/2-4, x+w/2, y+h/2+4, C, LT);
}
function zijlicht(x: number, y: number, w: number, h: number) {
  return sRect(x, y, w, h, "white", C, LT)
    + sLine(x+w/2-3, y+h/2, x+w/2+3, y+h/2, C, LT)
    + sLine(x+w/2, y+h/2-3, x+w/2, y+h/2+3, C, LT);
}
function borstwering(x: number, y: number, w: number, h: number) {
  return sRect(x, y, w, h, "white", C, LT);
}
function kruk(x: number, y: number, side: "l"|"r") {
  const rx = side === "r" ? x : x - 9;
  return `<rect x="${r(rx)}" y="${r(y-1.5)}" width="9" height="3" rx="1" fill="${C}" stroke="none"/>`;
}
function scharnieren(x: number, y: number, h: number) {
  return [0.12, 0.45, 0.78].map(p => sRect(x-2, y+h*p, 4, 8, "white", C, LT)).join("");
}

// ─── Maatpijlen ──────────────────────────────────────────────────────────────

function dimH(x1: number, x2: number, y: number, label: string) {
  const mx = (x1+x2)/2;
  return sLine(x1, y+3, x1, y-3, DC, DS)
    + sLine(x2, y+3, x2, y-3, DC, DS)
    + sLine(x1, y, x2, y, DC, DS)
    + sPoly(`${r(x1)},${r(y)} ${r(x1+5)},${r(y-2)} ${r(x1+5)},${r(y+2)}`, DC)
    + sPoly(`${r(x2)},${r(y)} ${r(x2-5)},${r(y-2)} ${r(x2-5)},${r(y+2)}`, DC)
    + sRect(mx-16, y-5, 32, 10, "white", "none", 0)
    + sText(mx, y+3.5, label, "middle", 8, DC);
}
function dimV(y1: number, y2: number, x: number, label: string) {
  const my = (y1+y2)/2;
  return sLine(x-3, y1, x+3, y1, DC, DS)
    + sLine(x-3, y2, x+3, y2, DC, DS)
    + sLine(x, y1, x, y2, DC, DS)
    + sPoly(`${r(x)},${r(y1)} ${r(x-2)},${r(y1+5)} ${r(x+2.5)},${r(y1+7)}`, DC)
    + sPoly(`${r(x)},${r(y2)} ${r(x-2)},${r(y2-5)} ${r(x+2.5)},${r(y2-7)}`, DC)
    + sRect(x-5, my-16, 10, 32, "white", "none", 0)
    + sText(x, my+3.5, label, "middle", 8, DC, `transform="rotate(-90,${r(x)},${r(my)})"`);
}

// ─── Deur body per slug ───────────────────────────────────────────────────────

function buildBody(slug: string): { body: string; vW: number } {
  // v=1 — enkle deuren (viewBox breedte 100)
  if (slug === "voordeur") {
    return { vW: 100, body: frame(10,5,80,150) + voordeurPaneel(22,14,56,132) + kruk(76,80,"r") + scharnieren(24,14,132) + profiel(10,5,80,150) };
  }
  if (slug === "achterdeur") {
    return { vW: 100, body: frame(10,5,80,150) + dkPaneel(22,14,56,132) + kruk(76,80,"r") + scharnieren(24,14,132) + profiel(10,5,80,150) };
  }
  if (slug === "voordeur-bovenlicht") {
    return { vW: 100, body: frame(10,5,80,150) + bovenlicht(22,14,56,29) + voordeurPaneel(22,47,56,100) + kruk(76,97,"r") + scharnieren(24,47,100) + profiel(10,5,80,150) };
  }
  if (slug === "achterdeur-bovenlicht") {
    return { vW: 100, body: frame(10,5,80,150) + bovenlicht(22,14,56,29) + dkPaneel(22,47,56,100) + kruk(76,97,"r") + scharnieren(24,47,100) + profiel(10,5,80,150) };
  }
  if (slug === "achterdeur-borstwering") {
    return { vW: 100, body: frame(10,5,80,150) + dkPaneel(22,14,56,99) + borstwering(22,117,56,30) + kruk(76,63,"r") + scharnieren(24,14,133) + profiel(10,5,80,150) };
  }
  if (slug === "achterdeur-borstwering-bovenlicht") {
    return { vW: 100, body: frame(10,5,80,150) + bovenlicht(22,14,56,29) + dkPaneel(22,47,56,66) + borstwering(22,117,56,30) + kruk(76,80,"r") + scharnieren(24,47,100) + profiel(10,5,80,150) };
  }

  // v=1.5 — enkle deur met zijlicht (viewBox breedte 150)
  if (slug === "deur-zijlicht") {
    return { vW: 150, body: frame(19,5,112,150) + dkPaneel(31,14,56,132) + zijlicht(91,14,28,132) + kruk(85,80,"r") + scharnieren(33,14,132) + profiel(19,5,112,150) };
  }
  if (slug === "voordeur-zijlicht") {
    return { vW: 150, body: frame(19,5,112,150) + voordeurPaneel(31,14,56,132) + zijlicht(91,14,28,132) + kruk(85,80,"r") + scharnieren(33,14,132) + profiel(19,5,112,150) };
  }
  if (slug === "deur-zijlicht-bovenlicht") {
    return { vW: 150, body: frame(19,5,112,150) + bovenlicht(31,14,88,29) + zijlicht(31,47,28,100) + dkPaneel(63,47,56,100) + kruk(117,97,"r") + scharnieren(65,47,100) + profiel(19,5,112,150) };
  }
  if (slug === "voordeur-zijlicht-bovenlicht") {
    return { vW: 150, body: frame(19,5,112,150) + bovenlicht(31,14,88,29) + voordeurPaneel(31,47,56,100) + zijlicht(91,47,28,100) + kruk(85,97,"r") + scharnieren(33,47,100) + profiel(19,5,112,150) };
  }
  if (slug === "deur-zijlicht-borstwering") {
    return { vW: 150, body: frame(19,5,112,150) + dkPaneel(31,14,56,97) + borstwering(31,115,56,31) + zijlicht(91,14,28,132) + kruk(85,62,"r") + scharnieren(33,14,132) + profiel(19,5,112,150) };
  }

  // v=1.5 — dubbele deur (viewBox breedte 150)
  if (slug === "dubbele-deur") {
    return { vW: 150, body: frame(5,5,140,150) + dkPaneel(17,14,56,132) + dkPaneelR(77,14,56,132) + kruk(71,80,"r") + kruk(79,80,"l") + scharnieren(19,14,132) + scharnieren(131,14,132) + profiel(5,5,140,150) };
  }
  if (slug === "dubbele-deur-borstwering") {
    return { vW: 150, body: frame(5,5,140,150) + dkPaneel(17,14,56,99) + dkPaneelR(77,14,56,99) + borstwering(17,115,56,31) + borstwering(77,115,56,31) + kruk(71,80,"r") + kruk(79,80,"l") + scharnieren(19,14,99) + scharnieren(131,14,99) + profiel(5,5,140,150) };
  }
  if (slug === "dubbele-deur-bovenlicht") {
    return { vW: 150, body: frame(5,5,140,150) + bovenlicht(17,14,116,29) + dkPaneel(17,47,56,100) + dkPaneelR(77,47,56,100) + kruk(71,97,"r") + kruk(79,97,"l") + scharnieren(19,47,100) + scharnieren(131,47,100) + profiel(5,5,140,150) };
  }
  if (slug === "dubbele-deur-borstwering-bovenlicht") {
    return { vW: 150, body: frame(5,5,140,150) + bovenlicht(17,14,116,29) + dkPaneel(17,47,56,66) + dkPaneelR(77,47,56,66) + borstwering(17,117,56,29) + borstwering(77,117,56,29) + kruk(71,80,"r") + kruk(79,80,"l") + scharnieren(19,47,100) + scharnieren(131,47,100) + profiel(5,5,140,150) };
  }

  // v=1.8 — met twee zijlichten (viewBox breedte 180)
  if (slug === "deur-zijlichten") {
    return { vW: 180, body: frame(18,5,144,150) + zijlicht(30,14,28,132) + dkPaneel(62,14,56,132) + zijlicht(122,14,28,132) + kruk(116,80,"r") + scharnieren(64,14,132) + profiel(18,5,144,150) };
  }
  if (slug === "dubbele-deur-zijlichten") {
    return { vW: 180, body: frame(5,5,170,150) + zijlicht(17,14,22,132) + dkPaneel(43,14,45,132) + dkPaneelR(92,14,45,132) + zijlicht(141,14,22,132) + kruk(86,80,"r") + kruk(94,80,"l") + scharnieren(45,14,132) + scharnieren(135,14,132) + profiel(5,5,170,150) };
  }
  if (slug === "dubbele-deur-zijlicht") {
    return { vW: 180, body: frame(5,5,170,150) + dkPaneel(17,14,56,132) + dkPaneelR(77,14,56,132) + zijlicht(137,14,28,132) + kruk(71,80,"r") + kruk(79,80,"l") + scharnieren(19,14,132) + scharnieren(131,14,132) + profiel(5,5,170,150) };
  }
  if (slug === "dubbele-deur-zijlichten-bovenlichten") {
    return { vW: 180, body: frame(5,5,170,150) + bovenlicht(17,14,22,29) + bovenlicht(43,14,94,29) + bovenlicht(141,14,22,29) + zijlicht(17,47,22,100) + dkPaneel(43,47,45,100) + dkPaneelR(92,47,45,100) + zijlicht(141,47,22,100) + kruk(86,97,"r") + kruk(94,97,"l") + scharnieren(45,47,100) + scharnieren(135,47,100) + profiel(5,5,170,150) };
  }

  // Fallback
  return { vW: 100, body: frame(10,5,80,150) + dkPaneel(22,14,56,132) + kruk(76,80,"r") + scharnieren(24,14,132) + profiel(10,5,80,150) };
}

// ─── Hoofd export ─────────────────────────────────────────────────────────────

export function buildDeurSvgString(slug: string, breedte: number, hoogte: number, glas?: string): string {
  const { body, vW } = buildBody(slug);
  const vH = 160;

  // Marges voor maatpijlen
  const PL = 30, PT = glas ? 18 : 8, PB = 24, PR = 6;
  const totalW = vW + PL + PR;
  const totalH = vH + PT + PB;

  const wY = PT + vH + 15;   // y horizontale pijl
  const hX = PL - 18;        // x verticale pijl

  // Hulplijnen
  const witnesses =
    sLine(PL,     PT+vH+3, PL,     wY-2, DC, DS) +
    sLine(PL+vW,  PT+vH+3, PL+vW,  wY-2, DC, DS) +
    sLine(PL-3,   PT,      hX+2,   PT,   DC, DS) +
    sLine(PL-3,   PT+vH,   hX+2,   PT+vH, DC, DS);

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
