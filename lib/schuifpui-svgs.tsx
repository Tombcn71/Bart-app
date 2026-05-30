// Architecturale stijl — zelfde principes als deur-svgs.tsx en kozijn-svgs.tsx.
// Coördinaten: elk vak is 100×100 units.
// 2-vak: viewBox "0 0 200 100", 4-vak: viewBox "0 0 400 100"

const S = {
  stroke:    "#000000",
  lineWidth: 0.8,
  lineThin:  0.5,
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const VastPanel = ({ ox }: { ox: number }) => (
  <>
    <rect x={ox+5} y={5} width={90} height={90} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x={ox+9} y={9} width={82} height={82} fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
  </>
);

// Schuivend paneel — pijl wijst in schuifrichting
const SchuifPanel = ({ ox, dir }: { ox: number; dir: "l" | "r" }) => {
  const ax1 = ox + 30, ax2 = ox + 70, ay = 50;
  const head = dir === "r"
    ? `M${ax2} ${ay} L${ax2-7} ${ay-3} L${ax2-7} ${ay+3} Z`
    : `M${ax1} ${ay} L${ax1+7} ${ay-3} L${ax1+7} ${ay+3} Z`;
  return (
    <>
      <rect x={ox+5} y={5} width={90} height={90} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={ox+9} y={9} width={82} height={82} fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      <line x1={ax1} y1={ay} x2={ax2} y2={ay} stroke={S.stroke} strokeWidth={S.lineThin} />
      <path d={head} fill={S.stroke} />
    </>
  );
};

// ─── COMPONENTEN ─────────────────────────────────────────────────────────────

/** 2-vaks: links vast, rechts schuivend → */
export const SchuifpuiTweevaks = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <VastPanel  ox={0} />
    <SchuifPanel ox={100} dir="r" />
  </g>
);

/** 4-vaks: vast · ← schuivend · schuivend → · vast */
export const SchuifpuiViervaks = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <VastPanel   ox={0} />
    <SchuifPanel ox={100} dir="l" />
    <SchuifPanel ox={200} dir="r" />
    <VastPanel   ox={300} />
  </g>
);

/** Detail SVG (gebruikt in configurator detail-pagina) */
export const SlidingDoorDetailSVG = ({ sections }: { sections: number }) => {
  const vW = sections === 4 ? 400 : 200;
  return (
    <svg viewBox={`0 0 ${vW} 100`} style={{ width: "100%", height: "auto" }}>
      {sections === 4 ? <SchuifpuiViervaks /> : <SchuifpuiTweevaks />}
    </svg>
  );
};
