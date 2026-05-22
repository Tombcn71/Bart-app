import React from "react";

const COLORS = { primary: "#1066a3", frame: "#2d3748" };

export const SingleDoorBase = ({
  type,
}: {
  type: "voordeur" | "achterdeur";
}) => (
  <g transform="translate(20, 5)">
    <rect
      x="0"
      y="0"
      width="60"
      height="90"
      fill="none"
      stroke={COLORS.frame}
      strokeWidth="1"
    />
    {type === "voordeur" ? (
      <>
        <rect
          x="10"
          y="10"
          width="40"
          height="35"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <line
          x1="30"
          y1="10"
          x2="30"
          y2="45"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <rect
          x="15"
          y="60"
          width="30"
          height="20"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
      </>
    ) : (
      <path
        d="M5 5 L55 45 L5 85"
        fill="none"
        stroke={COLORS.primary}
        strokeWidth="0.6"
        strokeDasharray="1.5,1.5"
      />
    )}
    <circle cx="56" cy="45" r="1.5" fill={COLORS.frame} />
  </g>
);

export const DoubleDoorBase = ({
  hasSideLights = false,
  hasPlinth = false,
}) => (
  <g>
    <rect
      x="5"
      y="5"
      width={hasSideLights ? 170 : 90}
      height="90"
      fill="none"
      stroke={COLORS.frame}
      strokeWidth="1"
    />
    <g transform={hasSideLights ? "translate(45, 0)" : "translate(0, 0)"}>
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="none"
        stroke={COLORS.frame}
        strokeWidth="1"
      />
      <line
        x1="50"
        y1="5"
        x2="50"
        y2="95"
        stroke={COLORS.frame}
        strokeWidth="1"
      />
      <path
        d="M10 10 L45 50 L10 90"
        fill="none"
        stroke={COLORS.primary}
        strokeWidth="0.6"
        strokeDasharray="1.5,1.5"
      />
      <path
        d="M90 10 L55 50 L90 90"
        fill="none"
        stroke={COLORS.primary}
        strokeWidth="0.6"
        strokeDasharray="1.5,1.5"
      />
      {hasPlinth && (
        <rect x="10" y="70" width="35" height="20" fill="#f1f5f9" />
      )}
      <circle cx="46" cy="50" r="1.5" fill={COLORS.frame} />
      <circle cx="54" cy="50" r="1.5" fill={COLORS.frame} />
    </g>
  </g>
);
