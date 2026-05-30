import React from "react";
// Architecturale stijl — horren vierkant (100×100), plisse hordeur portret (100×160).

const S = {
  stroke:    "#000000",
  lineWidth: 0.8,
  lineThin:  0.5,
  mesh:      0.3,  // gaas lijntjes
};

// Gaas patroon binnen het binnenframe
const Gaas = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => {
  const step = 6;
  const lines: React.ReactElement[] = [];
  // horizontale gaaslijnen
  for (let dy = step; dy < h; dy += step) {
    lines.push(<line key={`h${dy}`} x1={x} y1={y+dy} x2={x+w} y2={y+dy} stroke={S.stroke} strokeWidth={S.mesh} />);
  }
  // verticale gaaslijnen
  for (let dx = step; dx < w; dx += step) {
    lines.push(<line key={`v${dx}`} x1={x+dx} y1={y} x2={x+dx} y2={y+h} stroke={S.stroke} strokeWidth={S.mesh} />);
  }
  return <>{lines}</>;
};

/** Inzethor — vierkant frame met gaas */
export const InzethorSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "auto" }}>
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x={5}  y={5}  width={90} height={90} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={9}  y={9}  width={82} height={82} fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
      <Gaas x={9} y={9} w={82} h={82} />
    </g>
  </svg>
);

/** Klemhor — vierkant frame met gaas en klembeugels */
export const KlemhorSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "auto" }}>
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x={5}  y={5}  width={90} height={90} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={9}  y={9}  width={82} height={82} fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
      <Gaas x={9} y={9} w={82} h={82} />
      {/* klembeugels rechts */}
      <rect x={91} y={28} width={6} height={14} rx="2" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
      <rect x={91} y={58} width={6} height={14} rx="2" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
    </g>
  </svg>
);

/** Plisse hordeur — deurhoogte (100×160), gaas + horizontale rail + greep */
export const PlisseHordeurSVG = () => (
  <svg viewBox="0 0 100 160" style={{ width: "100%", height: "auto" }}>
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x={10} y={5}  width={80} height={150} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={14} y={9}  width={72} height={142} fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
      <Gaas x={14} y={9} w={72} h={142} />
      {/* horizontale middenrail (plisse mechaniek) */}
      <rect x={10} y={78} width={80} height={4} fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
      {/* greep midden rechts */}
      <rect x={86} y={77} width={5} height={6} rx="1" fill={S.stroke} stroke="none" />
    </g>
  </svg>
);
