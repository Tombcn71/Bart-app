// Professionele technische SVG voor deur types
// Gebruikt voor website (preview) en PDF (offerte)

const FONT  = "'Arial', Helvetica, sans-serif";
const LINE  = "#1a1a1a";
const DIM   = "#444";
const GLASS = "#aaaaaa";
const HINGE = "#888";
const DASH  = "9,5";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function r(n: number) { return +n.toFixed(1); }

function hdim(x1: number, x2: number, y: number, label: string, offset = 0): string {
  const mx = (x1 + x2) / 2;
  const ty = y - 6 + offset;
  return `
    <line x1="${r(x1)}" y1="${r(y)}" x2="${r(x2)}" y2="${r(y)}" stroke="${DIM}" stroke-width="0.9"/>
    <line x1="${r(x1)}" y1="${r(y-7)}" x2="${r(x1)}" y2="${r(y+7)}" stroke="${DIM}" stroke-width="0.9"/>
    <line x1="${r(x2)}" y1="${r(y-7)}" x2="${r(x2)}" y2="${r(y+7)}" stroke="${DIM}" stroke-width="0.9"/>
    <polygon points="${r(x1)},${r(y)} ${r(x1+9)},${r(y-3)} ${r(x1+9)},${r(y+3)}" fill="${DIM}"/>
    <polygon points="${r(x2)},${r(y)} ${r(x2-9)},${r(y-3)} ${r(x2-9)},${r(y+3)}" fill="${DIM}"/>
    <text x="${r(mx)}" y="${r(ty)}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="${DIM}">${label}</text>`;
}

function vdim(y1: number, y2: number, x: number, label: string): string {
  const my = (y1 + y2) / 2;
  return `
    <line x1="${r(x)}" y1="${r(y1)}" x2="${r(x)}" y2="${r(y2)}" stroke="${DIM}" stroke-width="0.9"/>
    <line x1="${r(x-7)}" y1="${r(y1)}" x2="${r(x+7)}" y2="${r(y1)}" stroke="${DIM}" stroke-width="0.9"/>
    <line x1="${r(x-7)}" y1="${r(y2)}" x2="${r(x+7)}" y2="${r(y2)}" stroke="${DIM}" stroke-width="0.9"/>
    <polygon points="${r(x)},${r(y1)} ${r(x-3)},${r(y1+9)} ${r(x+3)},${r(y1+9)}" fill="${DIM}"/>
    <polygon points="${r(x)},${r(y2)} ${r(x-3)},${r(y2-9)} ${r(x+3)},${r(y2-9)}" fill="${DIM}"/>
    <text x="${r(x-10)}" y="${r(my)}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="${DIM}"
      transform="rotate(-90 ${r(x-10)} ${r(my)})">${label}</text>`;
}

function label(x: number, y: number, lines: string[], fontSize = 10): string {
  return lines.map((t, i) =>
    `<text x="${r(x)}" y="${r(y + i * (fontSize + 3))}" text-anchor="middle" font-family="${FONT}" font-size="${fontSize}" fill="${LINE}">${t}</text>`
  ).join('');
}

function sideLabel(x: number, y: number, txt: string): string {
  return `<text x="${r(x)}" y="${r(y)}" text-anchor="start" font-family="${FONT}" font-size="10" fill="${DIM}">${txt}</text>`;
}

function arrowLine(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${DIM}" stroke-width="0.8"/>`;
}

// ─── Panel tekeningen ─────────────────────────────────────────────────────────

function dkPanel(
  x: number, y: number, w: number, h: number,
  hingeSide: "left" | "right",
  labelLines?: string[]
): string {
  const FI = Math.max(5, w * 0.045); // vleugel inset
  const vx = x + FI, vy = y + FI, vw = w - FI * 2, vh = h - FI * 2;

  // Glas diagonalen (licht grijs)
  const diags = `
    <line x1="${r(x)}" y1="${r(y)}" x2="${r(x+w)}" y2="${r(y+h)}" stroke="${GLASS}" stroke-width="0.8"/>
    <line x1="${r(x+w)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y+h)}" stroke="${GLASS}" stroke-width="0.8"/>`;

  // Openingsindicator stippellijnen (DK: X + bovenkant)
  const hx = hingeSide === "left" ? vx : vx + vw;
  const ox = hingeSide === "left" ? vx + vw : vx;
  const open = `
    <line x1="${r(hx)}" y1="${r(vy)}" x2="${r(ox)}" y2="${r(vy+vh)}" stroke="${LINE}" stroke-width="1.1" stroke-dasharray="${DASH}"/>
    <line x1="${r(hx)}" y1="${r(vy+vh)}" x2="${r(ox)}" y2="${r(vy)}" stroke="${LINE}" stroke-width="1.1" stroke-dasharray="${DASH}"/>
    <line x1="${r(vx)}" y1="${r(vy)}" x2="${r(vx+vw)}" y2="${r(vy)}" stroke="${LINE}" stroke-width="1.1" stroke-dasharray="${DASH}"/>`;

  // Vleugel binnenkader
  const vleugel = `<rect x="${r(vx)}" y="${r(vy)}" width="${r(vw)}" height="${r(vh)}" fill="none" stroke="${LINE}" stroke-width="1.8"/>`;

  // Greep
  const hndX = hingeSide === "left" ? r(vx + vw - 7) : r(vx + 3);
  const hndY = r(vy + vh * 0.38);
  const hndH = r(vh * 0.24);
  const handle = `<rect x="${hndX}" y="${hndY}" width="5" height="${hndH}" rx="2.5" fill="${HINGE}" stroke="${LINE}" stroke-width="0.8"/>`;

  // Scharnieren
  const scharX = hingeSide === "left" ? r(x + 1) : r(x + w - 7);
  const scharnieren = [0.14, 0.5, 0.86].map(pos =>
    `<rect x="${scharX}" y="${r(y + h * pos - 9)}" width="6" height="18" rx="2" fill="${HINGE}" stroke="${LINE}" stroke-width="0.8"/>`
  ).join('');

  const lbl = labelLines ? label(x + w / 2, y + h * 0.44, labelLines, Math.max(8, Math.min(10, w / 12))) : '';

  return diags + open + vleugel + handle + scharnieren + lbl;
}

function vastPanel(x: number, y: number, w: number, h: number, labelLines?: string[]): string {
  const diags = `
    <line x1="${r(x)}" y1="${r(y)}" x2="${r(x+w)}" y2="${r(y+h)}" stroke="${GLASS}" stroke-width="0.8"/>
    <line x1="${r(x+w)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y+h)}" stroke="${GLASS}" stroke-width="0.8"/>`;
  const lbl = labelLines ? label(x + w / 2, y + h * 0.46, labelLines, Math.max(8, Math.min(10, w / 12))) : '';
  return diags + lbl;
}

// ─── Frame ────────────────────────────────────────────────────────────────────

function frame(x: number, y: number, w: number, h: number, ft: number): string {
  return `
    <rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="white" stroke="${LINE}" stroke-width="2.5"/>
    <rect x="${r(x+ft)}" y="${r(y+ft)}" width="${r(w-ft*2)}" height="${r(h-ft*2)}" fill="none" stroke="${LINE}" stroke-width="1.2"/>`;
}

function tussenstijl(x: number, y: number, ft: number, h: number): string {
  return `<rect x="${r(x - ft/2)}" y="${r(y)}" width="${r(ft)}" height="${r(h)}" fill="white" stroke="${LINE}" stroke-width="1.2"/>`;
}

// ─── Hoofd SVG builder ────────────────────────────────────────────────────────

export interface DeurSvgOptions {
  breedte?: number;
  hoogte?:  number;
  profiel?: string;
  glas?:    string;
  showDims?: boolean;
}

export function getDeurSvg(slug: string, opts: DeurSvgOptions = {}): string {
  const B  = opts.breedte  || 1000;
  const H  = opts.hoogte   || 2200;
  const profiel = opts.profiel || "Kunststof - Wit";
  const glas    = opts.glas    || "HR++ Glas";
  const showDims = opts.showDims !== false;

  // Canvas
  const MAX_W = 320, MAX_H = 480;
  const scale = Math.min(MAX_W / B, MAX_H / H);
  const DW = r(B * scale);  // drawing width
  const DH = r(H * scale);  // drawing height

  const ML = showDims ? 75  : 10;  // left margin
  const MT = showDims ? 55  : 10;  // top margin
  const MR = showDims ? 115 : 10;  // right margin (voor labels)
  const MB = showDims ? 55  : 10;  // bottom margin

  const TW = DW + ML + MR;  // total svg width
  const TH = DH + MT + MB;  // total svg height

  // Frame thickness in pixels
  const FT = r(Math.max(5, B * scale * 0.05));  // ~5% of width, min 5px

  let s = `<rect x="0" y="0" width="${TW}" height="${TH}" fill="white"/>`;

  // ─── Layout per slug ──────────────────────────────────────────────────────

  if (slug === "voordeur" || slug === "achterdeur") {
    s += frame(ML, MT, DW, DH, FT);
    const isVoor = slug === "voordeur";
    s += dkPanel(ML + FT, MT + FT, DW - FT * 2, DH - FT * 2, "left",
      isVoor ? ["Voordeur", "(links draaiend & kiep)"] : ["Achterdeur", "(links draaiend & kiep)"]);

  } else if (slug === "dubbele-deur" || slug === "dubbele-deur-borstwering") {
    const hasBorstwering = slug === "dubbele-deur-borstwering";
    const borsH = hasBorstwering ? r(DH * 0.22) : 0;
    const deurH = DH - FT * 2 - borsH;
    const hw = r((DW - FT * 2) / 2);
    s += frame(ML, MT, DW, DH, FT);
    s += tussenstijl(ML + FT + hw, MT, FT * 0.7, DH);
    s += dkPanel(ML + FT, MT + FT, hw, deurH, "left", ["DK Links"]);
    s += dkPanel(ML + FT + hw, MT + FT, hw, deurH, "right", ["DK Rechts"]);
    if (hasBorstwering) {
      const by = MT + FT + deurH;
      s += vastPanel(ML + FT, by, DW - FT * 2, borsH, ["Borstwering"]);
      s += `<rect x="${r(ML+FT)}" y="${r(by)}" width="${r(DW-FT*2)}" height="${r(borsH)}" fill="none" stroke="${LINE}" stroke-width="1"/>`;
    }

  } else if (slug === "deur-zijlicht" || slug === "voordeur-zijlicht") {
    const deurW  = r((DW - FT * 2) * 0.6);
    const zijW   = r((DW - FT * 2) * 0.4);
    const isVoor = slug === "voordeur-zijlicht";
    s += frame(ML, MT, DW, DH, FT);
    s += tussenstijl(ML + FT + deurW, MT, FT * 0.7, DH);
    s += dkPanel(ML + FT, MT + FT, deurW, DH - FT * 2, "left",
      isVoor ? ["Voordeur", "(links draaiend)"] : ["Draaikiepdeur", "(links draaiend & kiep)"]);
    s += vastPanel(ML + FT + deurW, MT + FT, zijW, DH - FT * 2, ["Vast glas"]);

  } else if (slug === "deur-zijlichten") {
    const zijW  = r((DW - FT * 2) * 0.2);
    const deurW = r((DW - FT * 2) * 0.6);
    s += frame(ML, MT, DW, DH, FT);
    s += tussenstijl(ML + FT + zijW, MT, FT * 0.7, DH);
    s += tussenstijl(ML + FT + zijW + deurW, MT, FT * 0.7, DH);
    s += vastPanel(ML + FT, MT + FT, zijW, DH - FT * 2, ["Zijlicht"]);
    s += dkPanel(ML + FT + zijW, MT + FT, deurW, DH - FT * 2, "left", ["Draaikiepdeur"]);
    s += vastPanel(ML + FT + zijW + deurW, MT + FT, zijW, DH - FT * 2, ["Zijlicht"]);

  } else if (slug.includes("bovenlicht")) {
    const blH   = r(DH * 0.18);
    const deurH = DH - FT * 2 - blH;
    s += frame(ML, MT, DW, DH, FT);
    if (slug.includes("zijlicht")) {
      const deurW = r((DW - FT * 2) * 0.6);
      const zijW  = r((DW - FT * 2) * 0.4);
      s += tussenstijl(ML + FT + deurW, MT, FT * 0.7, DH);
      s += dkPanel(ML + FT, MT + FT, deurW, deurH, "left", ["Draaikiepdeur"]);
      s += vastPanel(ML + FT + deurW, MT + FT, zijW, deurH, ["Zijlicht"]);
      const blY = MT + FT + deurH;
      s += vastPanel(ML + FT, blY, DW - FT * 2, blH, ["Bovenlicht"]);
      s += `<rect x="${r(ML+FT)}" y="${r(blY)}" width="${r(DW-FT*2)}" height="${r(blH)}" fill="none" stroke="${LINE}" stroke-width="1"/>`;
    } else if (slug.includes("dubbele")) {
      const hw = r((DW - FT * 2) / 2);
      s += tussenstijl(ML + FT + hw, MT, FT * 0.7, DH);
      s += dkPanel(ML + FT, MT + FT, hw, deurH, "left", ["DK Links"]);
      s += dkPanel(ML + FT + hw, MT + FT, hw, deurH, "right", ["DK Rechts"]);
      const blY = MT + FT + deurH;
      s += vastPanel(ML + FT, blY, DW - FT * 2, blH, ["Bovenlicht"]);
      s += `<rect x="${r(ML+FT)}" y="${r(blY)}" width="${r(DW-FT*2)}" height="${r(blH)}" fill="none" stroke="${LINE}" stroke-width="1"/>`;
    } else {
      s += dkPanel(ML + FT, MT + FT, DW - FT * 2, deurH, "left", ["Draaikiepdeur"]);
      const blY = MT + FT + deurH;
      s += vastPanel(ML + FT, blY, DW - FT * 2, blH, ["Bovenlicht"]);
      s += `<rect x="${r(ML+FT)}" y="${r(blY)}" width="${r(DW-FT*2)}" height="${r(blH)}" fill="none" stroke="${LINE}" stroke-width="1"/>`;
    }

  } else if (slug.includes("borstwering")) {
    const borsH = r(DH * 0.22);
    const deurH = DH - FT * 2 - borsH;
    s += frame(ML, MT, DW, DH, FT);
    s += dkPanel(ML + FT, MT + FT, DW - FT * 2, deurH, "left", ["Draaikiepdeur"]);
    const by = MT + FT + deurH;
    s += `<rect x="${r(ML+FT)}" y="${r(by)}" width="${r(DW-FT*2)}" height="${r(borsH)}" fill="#f0f0f0" stroke="${LINE}" stroke-width="1"/>`;
    s += label(ML + DW / 2, by + borsH / 2, ["Borstwering"], 9);

  } else {
    // Fallback: enkele deur
    s += frame(ML, MT, DW, DH, FT);
    s += dkPanel(ML + FT, MT + FT, DW - FT * 2, DH - FT * 2, "left", ["Draaikiepdeur"]);
  }

  // ─── Maatvoering ──────────────────────────────────────────────────────────

  if (showDims) {
    const FMM = r(B * 0.05); // frame dikte in mm (approx 5%)

    // Boven: totale breedte
    s += hdim(ML, ML + DW, MT - 28, `${B}mm`);

    // Frame dikte boven
    s += hdim(ML, ML + FT, MT - 14, `${FMM}mm`, -2);

    // Linker hoogte dim
    s += vdim(MT, MT + DH, ML - 30, `${H}mm`);

    // Frame dikte links
    s += vdim(MT, MT + FT, ML - 14, `${FMM}mm`);

    // Rechter labels
    const lx = ML + DW + 14;
    s += arrowLine(ML + DW + 8, MT + FT * 0.5, lx, MT + FT * 0.5);
    s += sideLabel(lx + 2, MT + FT * 0.5 + 4, profiel);

    const glasY = MT + DH * 0.4;
    s += arrowLine(ML + DW + 8, glasY, lx, glasY);
    s += sideLabel(lx + 2, glasY + 4, glas);

    // Glas hoogte rechts
    const glasH = H - FMM * 2;
    s += vdim(MT + FT, MT + DH - FT, ML + DW + 55, `${glasH}mm`);

    // Onderbreedte
    s += hdim(ML, ML + DW, MT + DH + 28, `${B}mm`);

    // Per-vak breedte (voor 2-vaks layouts)
    if (slug.includes("zijlicht") && !slug.includes("zijlichten")) {
      const deurW = r(DW * 0.6);
      const zijW  = r(DW * 0.4);
      s += hdim(ML, ML + deurW, MT + DH + 14, `${r(B * 0.6)}mm`);
      s += hdim(ML + deurW, ML + DW, MT + DH + 14, `${r(B * 0.4)}mm`);
    } else if (slug.includes("dubbele") || slug === "dubbele-deur-borstwering") {
      const hw = r(DW / 2);
      s += hdim(ML, ML + hw, MT + DH + 14, `${r(B / 2)}mm`);
      s += hdim(ML + hw, ML + DW, MT + DH + 14, `${r(B / 2)}mm`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${TH}" width="${TW}" height="${TH}">
  ${s}
</svg>`;
}
