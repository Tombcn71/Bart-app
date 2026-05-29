import React from "react";

// ─── STIJL ───────────────────────────────────────────────────────────────────
const D = {
  color: "#1066a3",
  sw:    0.4,   // stroke width maatlijnen
  fs:    6.5,   // font size labels
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

interface Props {
  /** De deur SVG component (een <g>-element uit deur-svgs.tsx) */
  comp:      React.ReactNode;
  /** viewBox-breedte factor: 1 / 1.5 / 1.8  */
  v:         number;
  /** Breedte in mm (staat op horizontale pijl) */
  breedte:   number;
  /** Hoogte in mm (staat op verticale pijl) */
  hoogte:    number;
  /** Glastype label bovenin, bijv. "HR++ glas" */
  glasType?: string;
}

export function TechnischeTekeningSVG({ comp, v, breedte, hoogte, glasType }: Props) {
  const uid = React.useId().replace(/:/g, "-");
  const arrowId = `da${uid}`;

  const W  = v * 100;   // SVG-breedte van de deur
  const H  = 160;       // SVG-hoogte van de deur (altijd 160)

  const PL = 30;                     // linker padding  (verticale pijl)
  const PT = glasType ? 18 : 8;      // boven padding   (glastype label)
  const PB = 24;                     // onder padding   (horizontale pijl)
  const PR = 6;                      // rechter margin

  const vbW = PL + W + PR;
  const vbH = PT + H + PB;

  const wArrowY = PT + H + 15;       // y van horizontale maatpijl
  const hArrowX = PL - 18;           // x van verticale maatpijl

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        {/* Enkelvoudige pijlpunt — orient="auto-start-reverse" zorgt voor correcte richting aan beide uiteinden */}
        <marker
          id={arrowId}
          viewBox="0 0 8 6"
          refX="8" refY="3"
          markerWidth="5" markerHeight="4"
          orient="auto-start-reverse"
        >
          <polygon points="0,0 8,3 0,6" fill={D.color} />
        </marker>
      </defs>

      {/* ── Deur SVG ─────────────────────────────────────────────────────── */}
      <g transform={`translate(${PL}, ${PT})`}>
        {comp}
      </g>

      {/* ── Glastype label ───────────────────────────────────────────────── */}
      {glasType && (
        <text
          x={PL + W / 2} y={PT - 6}
          textAnchor="middle"
          fontSize={D.fs} fill={D.color}
          fontFamily="system-ui, sans-serif" fontWeight="600"
          letterSpacing="0.3"
        >
          {glasType}
        </text>
      )}

      {/* ── Horizontale maatpijl (breedte) ───────────────────────────────── */}
      {/* Hulplijnen */}
      <line x1={PL}     y1={PT + H + 3}  x2={PL}     y2={wArrowY - 2} stroke={D.color} strokeWidth={D.sw} />
      <line x1={PL + W} y1={PT + H + 3}  x2={PL + W} y2={wArrowY - 2} stroke={D.color} strokeWidth={D.sw} />
      {/* Pijllijn */}
      <line
        x1={PL} y1={wArrowY} x2={PL + W} y2={wArrowY}
        stroke={D.color} strokeWidth={D.sw}
        markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`}
      />
      {/* Tekst (wit vlak erachter voor leesbaarheid) */}
      <rect x={PL + W/2 - 16} y={wArrowY - 5} width="32" height="10" fill="white" />
      <text
        x={PL + W / 2} y={wArrowY + 3.2}
        textAnchor="middle"
        fontSize={D.fs} fill={D.color}
        fontFamily="system-ui, sans-serif"
      >
        {breedte} mm
      </text>

      {/* ── Verticale maatpijl (hoogte) ──────────────────────────────────── */}
      {/* Hulplijnen */}
      <line x1={PL - 3}      y1={PT}     x2={hArrowX + 2} y2={PT}     stroke={D.color} strokeWidth={D.sw} />
      <line x1={PL - 3}      y1={PT + H} x2={hArrowX + 2} y2={PT + H} stroke={D.color} strokeWidth={D.sw} />
      {/* Pijllijn */}
      <line
        x1={hArrowX} y1={PT} x2={hArrowX} y2={PT + H}
        stroke={D.color} strokeWidth={D.sw}
        markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`}
      />
      {/* Tekst (geroteerd) */}
      <rect
        x={hArrowX - 5} y={PT + H/2 - 16}
        width="10" height="32"
        fill="white"
      />
      <text
        x={hArrowX} y={PT + H / 2 + 3.2}
        textAnchor="middle"
        fontSize={D.fs} fill={D.color}
        fontFamily="system-ui, sans-serif"
        transform={`rotate(-90, ${hArrowX}, ${PT + H / 2})`}
      >
        {hoogte} mm
      </text>
    </svg>
  );
}
