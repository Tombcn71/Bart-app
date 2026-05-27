const C = {
  primary: "#1066a3",  // blauwe indicator-lijnen
  frame:   "#334155",  // donker frame / vleugel
  glass:   "#eff6ff",  // licht blauw glas
  border:  "#94a3b8",  // rand voor vast-ramen
};

// ─── VAST ────────────────────────────────────────────────────────────────────
export const GlassVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="5" y="5" width="90" height="90" fill={C.glass} />
    <rect x="5" y="5" width="90" height="90" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);

// ─── DRAAI-KIEP ──────────────────────────────────────────────────────────────
export const GlassDK = ({ x, mirror = false }: { x: number; mirror?: boolean }) => (
  <g transform={`translate(${x}, 0)${mirror ? " scale(-1,1) translate(-100,0)" : ""}`}>
    <rect x="5" y="5" width="90" height="90" fill={C.glass} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 11 L89 50 L11 89" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="43" width="3" height="14" rx="1.2" fill={C.frame} />
  </g>
);

// ─── KIEP ────────────────────────────────────────────────────────────────────
export const GlassKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="5" y="5" width="90" height="90" fill={C.glass} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 11 L50 89 L89 11" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="43" y="9" width="14" height="3" rx="1.2" fill={C.frame} />
  </g>
);

// ─── 1-VAK COMBINATIES ───────────────────────────────────────────────────────

export const GlassVastBovenlichtKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="34" x2="97" y2="34" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht kiep */}
    <rect x="5" y="5" width="90" height="27" fill={C.glass} />
    <rect x="9" y="9" width="82" height="19" fill="none" stroke={C.frame} strokeWidth="1.6" />
    <path d="M11 28 L50 11 L89 28" fill="none" stroke={C.primary} strokeWidth="1.1" strokeDasharray="4,3" />
    <rect x="43" y="9" width="14" height="2.5" rx="1" fill={C.frame} />
    {/* onderraam vast */}
    <rect x="5" y="36" width="90" height="59" fill={C.glass} />
    <rect x="5" y="36" width="90" height="59" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);

export const GlassDkBovenlichtVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="32" x2="97" y2="32" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht vast */}
    <rect x="5" y="5" width="90" height="25" fill={C.glass} />
    <rect x="5" y="5" width="90" height="25" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* onderraam dk */}
    <rect x="5" y="34" width="90" height="61" fill={C.glass} />
    <rect x="9" y="38" width="82" height="55" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 40 L89 66 L11 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="62" width="3" height="12" rx="1.2" fill={C.frame} />
  </g>
);

export const GlassDkBovenlichtKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="34" x2="97" y2="34" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht kiep */}
    <rect x="5" y="5" width="90" height="27" fill={C.glass} />
    <rect x="9" y="9" width="82" height="19" fill="none" stroke={C.frame} strokeWidth="1.6" />
    <path d="M11 28 L50 11 L89 28" fill="none" stroke={C.primary} strokeWidth="1.1" strokeDasharray="4,3" />
    <rect x="43" y="9" width="14" height="2.5" rx="1" fill={C.frame} />
    {/* onderraam dk */}
    <rect x="5" y="36" width="90" height="59" fill={C.glass} />
    <rect x="9" y="40" width="82" height="53" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 42 L89 67 L11 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="63" width="3" height="12" rx="1.2" fill={C.frame} />
  </g>
);

export const GlassDkBorstweringVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="64" x2="97" y2="64" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenraam dk */}
    <rect x="5" y="5" width="90" height="57" fill={C.glass} />
    <rect x="9" y="9" width="82" height="51" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 11 L89 37 L11 62" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="33" width="3" height="12" rx="1.2" fill={C.frame} />
    {/* borstwering */}
    <rect x="5" y="66" width="90" height="29" fill="#dde3ea" stroke={C.border} strokeWidth="1.2" />
  </g>
);

// ─── 2-VAK COMBINATIES ───────────────────────────────────────────────────────

export const GlassKiepKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* links kiep */}
    <rect x="5" y="5" width="90" height="90" fill={C.glass} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 11 L50 89 L89 11" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="43" y="9" width="14" height="3" rx="1.2" fill={C.frame} />
    {/* rechts kiep */}
    <rect x="105" y="5" width="90" height="90" fill={C.glass} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M111 11 L150 89 L189 11" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="143" y="9" width="14" height="3" rx="1.2" fill={C.frame} />
  </g>
);

export const GlassDkDkStolpBovenlichtVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="28" x2="197" y2="28" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht vast (doorlopend) */}
    <rect x="5" y="5" width="190" height="21" fill={C.glass} />
    <rect x="5" y="5" width="190" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* links dk */}
    <rect x="5" y="30" width="90" height="65" fill={C.glass} />
    <rect x="9" y="34" width="82" height="59" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 36 L89 63 L11 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="59" width="3" height="12" rx="1.2" fill={C.frame} />
    {/* rechts dk gespiegeld */}
    <rect x="105" y="30" width="90" height="65" fill={C.glass} />
    <rect x="109" y="34" width="82" height="59" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M189 36 L111 63 L189 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="112" y="59" width="3" height="12" rx="1.2" fill={C.frame} />
  </g>
);

export const GlassDkVastBovenlichtenVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="28" x2="197" y2="28" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht links */}
    <rect x="5" y="5" width="90" height="21" fill={C.glass} />
    <rect x="5" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* bovenlicht rechts */}
    <rect x="105" y="5" width="90" height="21" fill={C.glass} />
    <rect x="105" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* links dk */}
    <rect x="5" y="30" width="90" height="65" fill={C.glass} />
    <rect x="9" y="34" width="82" height="59" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 36 L89 63 L11 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="59" width="3" height="12" rx="1.2" fill={C.frame} />
    {/* rechts vast */}
    <rect x="105" y="30" width="90" height="65" fill={C.glass} />
    <rect x="105" y="30" width="90" height="65" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);

export const GlassDkBovenlichtKiepVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf links */}
    <line x1="3" y1="32" x2="97" y2="32" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht links kiep */}
    <rect x="5" y="5" width="90" height="25" fill={C.glass} />
    <rect x="9" y="9" width="82" height="17" fill="none" stroke={C.frame} strokeWidth="1.6" />
    <path d="M11 26 L50 11 L89 26" fill="none" stroke={C.primary} strokeWidth="1.1" strokeDasharray="4,3" />
    <rect x="43" y="9" width="14" height="2.5" rx="1" fill={C.frame} />
    {/* links dk onder */}
    <rect x="5" y="34" width="90" height="61" fill={C.glass} />
    <rect x="9" y="38" width="82" height="55" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 40 L89 66 L11 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="62" width="3" height="12" rx="1.2" fill={C.frame} />
    {/* rechts vast */}
    <rect x="105" y="5" width="90" height="90" fill={C.glass} />
    <rect x="105" y="5" width="90" height="90" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);

export const GlassVastBovenlichtKiepVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf links */}
    <line x1="3" y1="32" x2="97" y2="32" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht links kiep */}
    <rect x="5" y="5" width="90" height="25" fill={C.glass} />
    <rect x="9" y="9" width="82" height="17" fill="none" stroke={C.frame} strokeWidth="1.6" />
    <path d="M11 26 L50 11 L89 26" fill="none" stroke={C.primary} strokeWidth="1.1" strokeDasharray="4,3" />
    <rect x="43" y="9" width="14" height="2.5" rx="1" fill={C.frame} />
    {/* links vast onder */}
    <rect x="5" y="34" width="90" height="61" fill={C.glass} />
    <rect x="5" y="34" width="90" height="61" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* rechts vast */}
    <rect x="105" y="5" width="90" height="90" fill={C.glass} />
    <rect x="105" y="5" width="90" height="90" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);

export const GlassDkBovenlichtVastVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf links */}
    <line x1="3" y1="24" x2="97" y2="24" stroke={C.frame} strokeWidth="2.5" />
    {/* bovenlicht links vast */}
    <rect x="5" y="5" width="90" height="17" fill={C.glass} />
    <rect x="5" y="5" width="90" height="17" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* links dk onder */}
    <rect x="5" y="26" width="90" height="69" fill={C.glass} />
    <rect x="9" y="30" width="82" height="63" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 32 L89 61 L11 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="57" width="3" height="12" rx="1.2" fill={C.frame} />
    {/* rechts vast */}
    <rect x="105" y="5" width="90" height="90" fill={C.glass} />
    <rect x="105" y="5" width="90" height="90" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);

// ─── 3-VAK COMBINATIES ───────────────────────────────────────────────────────

export const GlassDkVastVastKozijn = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* vak 1: dk */}
    <rect x="5" y="5" width="90" height="90" fill={C.glass} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 11 L89 50 L11 89" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="43" width="3" height="14" rx="1.2" fill={C.frame} />
    {/* vak 2: vast */}
    <rect x="105" y="5" width="90" height="90" fill={C.glass} />
    <rect x="105" y="5" width="90" height="90" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* vak 3: vast */}
    <rect x="205" y="5" width="90" height="90" fill={C.glass} />
    <rect x="205" y="5" width="90" height="90" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);

export const GlassDkDkDkKozijn = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* vak 1: dk */}
    <rect x="5" y="5" width="90" height="90" fill={C.glass} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 11 L89 50 L11 89" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="43" width="3" height="14" rx="1.2" fill={C.frame} />
    {/* vak 2: dk */}
    <rect x="105" y="5" width="90" height="90" fill={C.glass} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M111 11 L189 50 L111 89" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="185" y="43" width="3" height="14" rx="1.2" fill={C.frame} />
    {/* vak 3: dk gespiegeld */}
    <rect x="205" y="5" width="90" height="90" fill={C.glass} />
    <rect x="209" y="9" width="82" height="82" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M289 11 L211 50 L289 89" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="211" y="43" width="3" height="14" rx="1.2" fill={C.frame} />
  </g>
);

export const GlassDkVastDkBovenlichtenVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="28" x2="297" y2="28" stroke={C.frame} strokeWidth="2.5" />
    {/* 3 bovenlichten */}
    <rect x="5" y="5" width="90" height="21" fill={C.glass} />
    <rect x="5" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    <rect x="105" y="5" width="90" height="21" fill={C.glass} />
    <rect x="105" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    <rect x="205" y="5" width="90" height="21" fill={C.glass} />
    <rect x="205" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* vak 1 onder: dk */}
    <rect x="5" y="30" width="90" height="65" fill={C.glass} />
    <rect x="9" y="34" width="82" height="59" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M11 36 L89 63 L11 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="85" y="59" width="3" height="12" rx="1.2" fill={C.frame} />
    {/* vak 2 onder: vast */}
    <rect x="105" y="30" width="90" height="65" fill={C.glass} />
    <rect x="105" y="30" width="90" height="65" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* vak 3 onder: dk gespiegeld */}
    <rect x="205" y="30" width="90" height="65" fill={C.glass} />
    <rect x="209" y="34" width="82" height="59" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M289 36 L211 63 L289 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="211" y="59" width="3" height="12" rx="1.2" fill={C.frame} />
  </g>
);

export const GlassVastDkVastBovenlichtenVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* kalf */}
    <line x1="3" y1="28" x2="297" y2="28" stroke={C.frame} strokeWidth="2.5" />
    {/* 3 bovenlichten */}
    <rect x="5" y="5" width="90" height="21" fill={C.glass} />
    <rect x="5" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    <rect x="105" y="5" width="90" height="21" fill={C.glass} />
    <rect x="105" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    <rect x="205" y="5" width="90" height="21" fill={C.glass} />
    <rect x="205" y="5" width="90" height="21" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* vak 1 onder: vast */}
    <rect x="5" y="30" width="90" height="65" fill={C.glass} />
    <rect x="5" y="30" width="90" height="65" fill="none" stroke={C.border} strokeWidth="1.2" />
    {/* vak 2 onder: dk */}
    <rect x="105" y="30" width="90" height="65" fill={C.glass} />
    <rect x="109" y="34" width="82" height="59" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <path d="M111 36 L189 63 L111 91" fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3" />
    <rect x="185" y="59" width="3" height="12" rx="1.2" fill={C.frame} />
    {/* vak 3 onder: vast */}
    <rect x="205" y="30" width="90" height="65" fill={C.glass} />
    <rect x="205" y="30" width="90" height="65" fill="none" stroke={C.border} strokeWidth="1.2" />
  </g>
);
