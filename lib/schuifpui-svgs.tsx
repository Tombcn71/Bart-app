// Architecturale stijl — zelfde principes als deur-svgs.tsx.
// Hoogte 160 (zelfde als deuren), breedte 100 per vak.
// 2-vak: viewBox "0 0 200 160", 4-vak: viewBox "0 0 400 160"

const S = {
  stroke:    "#000000",
  lineWidth: 0.8,
  lineThin:  0.5,
};

const H  = 160;  // totale hoogte
const CY = 80;   // verticaal centrum

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const VastPanel = ({ x1, x2 }: { x1: number; x2: number }) => {
  const cx = (x1 + x2) / 2, w = x2 - x1;
  return (
    <>
      <rect x={x1}   y={5} width={w}   height={H-10} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={x1+4} y={9} width={w-8} height={H-18} fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      <line x1={cx-6} y1={CY}   x2={cx+6} y2={CY}   stroke={S.stroke} strokeWidth={S.lineThin} />
      <line x1={cx}   y1={CY-6} x2={cx}   y2={CY+6} stroke={S.stroke} strokeWidth={S.lineThin} />
    </>
  );
};

const SchuifPanel = ({ x1, x2, dir }: { x1: number; x2: number; dir: "l" | "r" }) => {
  const cx = (x1 + x2) / 2, w = x2 - x1;
  const ax1 = cx - 18, ax2 = cx + 18;
  const head = dir === "r"
    ? `M${ax2},${CY} L${ax2-8},${CY-3.5} L${ax2-8},${CY+3.5} Z`
    : `M${ax1},${CY} L${ax1+8},${CY-3.5} L${ax1+8},${CY+3.5} Z`;
  const hx = dir === "r" ? x1 + 3 : x2 - 8;
  return (
    <>
      <rect x={x1}   y={5} width={w}   height={H-10} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={x1+4} y={9} width={w-8} height={H-18} fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      <rect x={hx} y={CY-12} width={5} height={24} rx="2" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
      <line x1={ax1} y1={CY} x2={ax2} y2={CY} stroke={S.stroke} strokeWidth={S.lineThin} />
      <path d={head} fill={S.stroke} />
    </>
  );
};

// ─── COMPONENTEN ─────────────────────────────────────────────────────────────

/** 2-vaks: links schuivend →, rechts vast */
export const SchuifpuiTweevaks = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <SchuifPanel x1={5}   x2={100} dir="r" />
    <VastPanel   x1={100} x2={195} />
  </g>
);

/** 4-vaks: vast · ← schuivend · schuivend → · vast */
export const SchuifpuiViervaks = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <VastPanel   x1={5}   x2={100} />
    <SchuifPanel x1={100} x2={200} dir="l" />
    <SchuifPanel x1={200} x2={300} dir="r" />
    <VastPanel   x1={300} x2={395} />
  </g>
);

/** Detail SVG (gebruikt in configurator detail-pagina) */
export const SlidingDoorDetailSVG = ({ sections }: { sections: number }) => {
  const vW = sections === 4 ? 400 : 200;
  return (
    <svg viewBox={`0 0 ${vW} ${H}`} style={{ width: "100%", height: "auto" }}>
      {sections === 4 ? <SchuifpuiViervaks /> : <SchuifpuiTweevaks />}
    </svg>
  );
};
