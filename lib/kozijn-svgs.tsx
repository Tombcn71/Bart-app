import React from "react";

const COLORS = { primary: "#1066a3", frame: "#2d3748" };

export const GlassVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="0.3"
    />
    <line x1="48" y1="50" x2="52" y2="50" stroke="#cbd5e1" strokeWidth="0.6" />
    <line x1="50" y1="48" x2="50" y2="52" stroke="#cbd5e1" strokeWidth="0.6" />
  </g>
);

export const GlassDK = ({
  x,
  mirror = false,
}: {
  x: number;
  mirror?: boolean;
}) => (
  <g
    transform={`translate(${x}, 0) ${mirror ? "scale(-1, 1) translate(-100, 0)" : ""}`}>
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="0.3"
    />
    <path
      d="M12 12 L88 50 L12 88"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="0.5"
      strokeDasharray="1.5,1.5"
    />
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      fill="none"
      stroke={COLORS.frame}
      strokeWidth="0.6"
    />
    <rect x="85" y="46" width="1.5" height="8" rx="0.5" fill={COLORS.frame} />
  </g>
);

export const GlassKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="0.3"
    />
    <path
      d="M12 12 L50 88 L88 12"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="0.5"
      strokeDasharray="1.5,1.5"
    />
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      fill="none"
      stroke={COLORS.frame}
      strokeWidth="0.6"
    />
    <rect x="46" y="8" width="8" height="1.5" rx="0.5" fill={COLORS.frame} />
  </g>
);
