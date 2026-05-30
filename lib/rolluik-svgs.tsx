import React from "react";
// Architecturale stijl — rolluiken, vierkant (100×100).
// Lamellen = horizontale lijnen; screens = fijnere lijnen.

const S = {
  stroke:    "#000000",
  lineWidth: 0.8,
  lineThin:  0.5,
  slat:      0.4,   // rolluiklamellen
  mesh:      0.25,  // screen lijntjes
};

// Lamellen (horizontale lijnen)
const Lamellen = ({ x, y, w, h, step = 7 }: { x: number; y: number; w: number; h: number; step?: number }) => {
  const lines: React.ReactElement[] = [];
  for (let dy = step; dy < h; dy += step) {
    lines.push(<line key={dy} x1={x} y1={y+dy} x2={x+w} y2={y+dy} stroke={S.stroke} strokeWidth={S.slat} />);
  }
  return <>{lines}</>;
};

/** Rolluik — opbouw kast bovenaan + lamellen */
export const RolluikSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "auto" }}>
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* rolkast bovenaan */}
      <rect x={5}  y={5}  width={90} height={12} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={9}  y={7}  width={82} height={8}  fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      {/* rolluik paneel */}
      <rect x={5}  y={17} width={90} height={78} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={9}  y={21} width={82} height={70} fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      <Lamellen x={9} y={21} w={82} h={70} step={7} />
    </g>
  </svg>
);

/** Inbouw rolluik — kast verborgen in de muur, alleen lamellen zichtbaar */
export const InbouwRolluikSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "auto" }}>
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* rolluik paneel (geen opbouwkast) */}
      <rect x={5}  y={5}  width={90} height={90} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={9}  y={9}  width={82} height={82} fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      <Lamellen x={9} y={9} w={82} h={82} step={7} />
    </g>
  </svg>
);

/** Screen — fijne transparante doeklijnen */
export const ScreenSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "auto" }}>
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* rolkast bovenaan */}
      <rect x={5}  y={5}  width={90} height={12} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={9}  y={7}  width={82} height={8}  fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      {/* screen paneel */}
      <rect x={5}  y={17} width={90} height={78} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={9}  y={21} width={82} height={70} fill="none"  stroke={S.stroke} strokeWidth={S.lineThin} />
      <Lamellen x={9} y={21} w={82} h={70} step={4} />
    </g>
  </svg>
);
