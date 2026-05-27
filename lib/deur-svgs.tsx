// Alle deur-SVG componenten werken in een 160-hoog coördinatensysteem.
// Breedte varieert via de 'v' waarde op de deur-entry:
//   v=1   → viewBox "0 0 100 160"  (enkele deur)
//   v=1.5 → viewBox "0 0 150 160"  (met zijlicht)
//   v=1.8 → viewBox "0 0 180 160"  (met twee zijlichten)

const C = {
  primary: "#1066a3",
  frame:   "#334155",
  glass:   "#eff6ff",
  panel:   "#e2e8f0",
  border:  "#94a3b8",
};

// ─── INTERNE HELPERS ─────────────────────────────────────────────────────────

const DKPaneel = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill={C.glass} />
    <rect x={x+4} y={y+4} width={w-8} height={h-8} fill="none" stroke={C.frame} strokeWidth="1.5" />
    <path
      d={`M${x+6} ${y+6} L${x+w-6} ${y+h/2} L${x+6} ${y+h-6}`}
      fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3"
    />
  </>
);

const VoordeurPaneel = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => {
  const archH = Math.round(h * 0.32);
  const gridY = y + archH + 5;
  const gridH = Math.round(h * 0.30);
  const plankY = gridY + gridH + 5;
  const plankH = (y + h - 3) - plankY;
  const mx = x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={C.panel} />
      <path
        d={`M${x+6} ${y+archH} Q${x+6} ${y+4} ${mx} ${y+4} Q${x+w-6} ${y+4} ${x+w-6} ${y+archH} Z`}
        fill={C.glass} stroke={C.frame} strokeWidth="1.2"
      />
      <rect x={x+6} y={gridY} width={w-12} height={gridH} fill={C.glass} stroke={C.frame} strokeWidth="1.2" />
      <line x1={mx} y1={gridY} x2={mx} y2={gridY+gridH} stroke={C.frame} strokeWidth="0.9" />
      <line x1={x+6} y1={gridY+gridH/2} x2={x+w-6} y2={gridY+gridH/2} stroke={C.frame} strokeWidth="0.9" />
      {plankH > 5 && (
        <rect x={x+6} y={plankY} width={w-12} height={plankH} fill={C.panel} stroke={C.border} strokeWidth="1" />
      )}
    </>
  );
};

const Bovenlicht = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill={C.glass} stroke={C.border} strokeWidth="1.2" />
    <line x1={x+w/2-5} y1={y+h/2} x2={x+w/2+5} y2={y+h/2} stroke={C.border} strokeWidth="1" />
    <line x1={x+w/2} y1={y+h/2-5} x2={x+w/2}   y2={y+h/2+5} stroke={C.border} strokeWidth="1" />
  </>
);

const Zijlicht = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill={C.glass} stroke={C.border} strokeWidth="1.2" />
    <line x1={x+w/2-4} y1={y+h/2} x2={x+w/2+4} y2={y+h/2} stroke={C.border} strokeWidth="1" />
    <line x1={x+w/2} y1={y+h/2-4} x2={x+w/2}   y2={y+h/2+4} stroke={C.border} strokeWidth="1" />
  </>
);

const Borstwering = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x} y={y} width={w} height={h} fill={C.panel} stroke={C.border} strokeWidth="1.2" />
);

const Kruk = ({ x, y }: { x: number; y: number }) => (
  <circle cx={x} cy={y} r="2.5" fill={C.frame} />
);

const Scharnieren = ({ x, y, h }: { x: number; y: number; h: number }) => (
  <>
    <rect x={x-1.5} y={y + h*0.12} width="3" height="7" rx="0.8" fill={C.border} />
    <rect x={x-1.5} y={y + h*0.45} width="3" height="7" rx="0.8" fill={C.border} />
    <rect x={x-1.5} y={y + h*0.78} width="3" height="7" rx="0.8" fill={C.border} />
  </>
);

// ─── BESTAANDE COMPONENTEN (gebruikt door detail-pagina) ──────────────────────

/** v=1  → viewBox "0 0 100 160" */
export const SingleDoorBase = ({ type }: { type: "voordeur" | "achterdeur" }) => (
  <g>
    <rect x="20" y="5" width="60" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    {type === "voordeur"
      ? <VoordeurPaneel x={22} y={7} w={56} h={146} />
      : <DKPaneel       x={22} y={7} w={56} h={146} />
    }
    <Kruk x={76} y={80} />
    <Scharnieren x={24} y={7} h={146} />
  </g>
);

/** v=1 of v=1.8 → viewBox "0 0 100 160" of "0 0 180 160" */
export const DoubleDoorBase = ({
  hasSideLights = false,
  hasPlinth = false,
}: {
  hasSideLights?: boolean;
  hasPlinth?: boolean;
}) => {
  const totalW = hasSideLights ? 170 : 90;
  const doorOffset = hasSideLights ? 44 : 0;
  const kalf = hasPlinth ? 115 : null;

  return (
    <g>
      <rect x="5" y="5" width={totalW} height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
      {hasSideLights && (
        <>
          <Zijlicht x={7} y={7} w={35} h={146} />
          <line x1={44} y1={5} x2={44} y2={155} stroke={C.frame} strokeWidth="2.2" />
          <Zijlicht x={148} y={7} w={25} h={146} />
          <line x1={145} y1={5} x2={145} y2={155} stroke={C.frame} strokeWidth="2.2" />
        </>
      )}
      <g transform={`translate(${doorOffset}, 0)`}>
        <rect x="6" y="6" width="88" height="148" fill="none" stroke={C.frame} strokeWidth="1.8" />
        <line x1="50" y1="6" x2="50" y2="154" stroke={C.frame} strokeWidth="1.8" />
        {kalf && <line x1="6" y1={kalf} x2="94" y2={kalf} stroke={C.frame} strokeWidth="2.2" />}
        {/* linker vleugel */}
        <DKPaneel x={8} y={8} w={38} h={kalf ? kalf-10 : 138} />
        {/* rechter vleugel (gespiegeld) */}
        <rect x={52} y={8} width={38} height={kalf ? kalf-10 : 138} fill={C.glass} />
        <rect x={56} y={12} width={30} height={kalf ? kalf-16 : 130} fill="none" stroke={C.frame} strokeWidth="1.4" />
        <path
          d={`M${86} ${12} L${56} ${kalf ? (kalf-10)/2+8 : 77} L${86} ${kalf ? kalf-10 : 138}`}
          fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3"
        />
        {hasPlinth && (
          <>
            <Borstwering x={8}  y={kalf!+2} w={38} h={150-kalf!-4} />
            <Borstwering x={52} y={kalf!+2} w={38} h={150-kalf!-4} />
          </>
        )}
        <Kruk x={46} y={80} />
        <Kruk x={54} y={80} />
      </g>
    </g>
  );
};

// ─── NIEUWE ENKELE DEUR VARIANTEN ────────────────────────────────────────────

// ── v=1  (viewBox "0 0 100 160") ─────────────────────────────────────────────

/** Achterdeur met bovenlicht (vast) */
export const AchterdeurBovenlicht = () => (
  <g>
    <rect x="20" y="5" width="60" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="20" y1="40" x2="80" y2="40" stroke={C.frame} strokeWidth="2.2" />
    <Bovenlicht x={22} y={7}  w={56} h={31} />
    <DKPaneel   x={22} y={42} w={56} h={111} />
    <Kruk x={76} y={97} />
    <Scharnieren x={24} y={42} h={111} />
  </g>
);

/** Voordeur met bovenlicht (vast) */
export const VoordeurBovenlicht = () => (
  <g>
    <rect x="20" y="5" width="60" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="20" y1="40" x2="80" y2="40" stroke={C.frame} strokeWidth="2.2" />
    <Bovenlicht     x={22} y={7}  w={56} h={31} />
    <VoordeurPaneel x={22} y={42} w={56} h={111} />
    <Kruk x={76} y={97} />
    <Scharnieren x={24} y={42} h={111} />
  </g>
);

/** Achterdeur met borstwering */
export const AchterdeurBorstwering = () => (
  <g>
    <rect x="20" y="5" width="60" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="20" y1="115" x2="80" y2="115" stroke={C.frame} strokeWidth="2.2" />
    <DKPaneel    x={22} y={7}   w={56} h={106} />
    <Borstwering x={22} y={117} w={56} h={36} />
    <Kruk x={76} y={60} />
    <Scharnieren x={24} y={7} h={146} />
  </g>
);

/** Achterdeur met borstwering en bovenlicht */
export const AchterdeurBorstweringBovenlicht = () => (
  <g>
    <rect x="20" y="5" width="60" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="20" y1="40"  x2="80" y2="40"  stroke={C.frame} strokeWidth="2.2" />
    <line x1="20" y1="115" x2="80" y2="115" stroke={C.frame} strokeWidth="2.2" />
    <Bovenlicht  x={22} y={7}   w={56} h={31} />
    <DKPaneel    x={22} y={42}  w={56} h={71} />
    <Borstwering x={22} y={117} w={56} h={36} />
    <Kruk x={76} y={77} />
    <Scharnieren x={24} y={42} h={111} />
  </g>
);

// ── v=1.5  (viewBox "0 0 150 160") ───────────────────────────────────────────

/** Achterdeur met zijlicht rechts */
export const DeurZijlicht = () => (
  <g>
    <rect x="5" y="5" width="140" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="107" y1="5" x2="107" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <DKPaneel  x={7}   y={7} w={98} h={146} />
    <Zijlicht  x={109} y={7} w={34} h={146} />
    <Kruk x={101} y={80} />
    <Scharnieren x={9} y={7} h={146} />
  </g>
);

/** Voordeur met zijlicht rechts */
export const VoordeurZijlicht = () => (
  <g>
    <rect x="5" y="5" width="140" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="107" y1="5" x2="107" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <VoordeurPaneel x={7}   y={7} w={98} h={146} />
    <Zijlicht       x={109} y={7} w={34} h={146} />
    <Kruk x={101} y={80} />
    <Scharnieren x={9} y={7} h={146} />
  </g>
);

/** Deur met zijlicht en bovenlicht — zijlicht links */
export const DeurZijlichtBovenlicht = () => (
  <g>
    <rect x="5" y="5" width="140" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="5"  y1="40" x2="145" y2="40" stroke={C.frame} strokeWidth="2.2" />
    <line x1="47" y1="40" x2="47"  y2="155" stroke={C.frame} strokeWidth="2.2" />
    <Bovenlicht x={7}  y={7}  w={136} h={31} />
    <Zijlicht   x={7}  y={42} w={38}  h={111} />
    <DKPaneel   x={49} y={42} w={94}  h={111} />
    <Kruk x={139} y={97} />
    <Scharnieren x={51} y={42} h={111} />
  </g>
);

/** Voordeur met zijlicht en bovenlicht — zijlicht rechts */
export const VoordeurZijlichtBovenlicht = () => (
  <g>
    <rect x="5" y="5" width="140" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="5"   y1="40" x2="145" y2="40"  stroke={C.frame} strokeWidth="2.2" />
    <line x1="105" y1="40" x2="105" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <Bovenlicht     x={7}   y={7}  w={136} h={31} />
    <VoordeurPaneel x={7}   y={42} w={96}  h={111} />
    <Zijlicht       x={107} y={42} w={36}  h={111} />
    <Kruk x={101} y={97} />
    <Scharnieren x={9} y={42} h={111} />
  </g>
);

/** Achterdeur met zijlicht en borstwering — zijlicht rechts */
export const DeurZijlichtBorstwering = () => (
  <g>
    <rect x="5" y="5" width="140" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="107" y1="5"   x2="107" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <line x1="5"   y1="115" x2="107" y2="115" stroke={C.frame} strokeWidth="2.2" />
    <DKPaneel    x={7}   y={7}   w={98} h={106} />
    <Borstwering x={7}   y={117} w={98} h={36} />
    <Zijlicht    x={109} y={7}   w={34} h={146} />
    <Kruk x={101} y={60} />
    <Scharnieren x={9} y={7} h={146} />
  </g>
);

// ── v=1.8  (viewBox "0 0 180 160") ───────────────────────────────────────────

/** Achterdeur met twee zijlichten */
export const DeurZijlichten = () => (
  <g>
    <rect x="5" y="5" width="170" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="47"  y1="5" x2="47"  y2="155" stroke={C.frame} strokeWidth="2.2" />
    <line x1="133" y1="5" x2="133" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <Zijlicht x={7}   y={7} w={38}  h={146} />
    <DKPaneel x={49}  y={7} w={82}  h={146} />
    <Zijlicht x={135} y={7} w={38}  h={146} />
    <Kruk x={127} y={80} />
    <Scharnieren x={51} y={7} h={146} />
  </g>
);

// ─── DUBBELE DEUR VARIANTEN ──────────────────────────────────────────────────
// DKPaneel = linkscharnier (driehoek wijst rechts)
// DKPaneelR = rechtscharnier (driehoek wijst links) voor rechter deurvleugel

const DKPaneelR = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill={C.glass} />
    <rect x={x+4} y={y+4} width={w-8} height={h-8} fill="none" stroke={C.frame} strokeWidth="1.5" />
    <path
      d={`M${x+w-6} ${y+6} L${x+6} ${y+h/2} L${x+w-6} ${y+h-6}`}
      fill="none" stroke={C.primary} strokeWidth="1.3" strokeDasharray="5,3"
    />
  </>
);

/** Dubbele deur met bovenlicht — v=1 */
export const DubbeleDeurBovenlicht = () => (
  <g>
    <rect x="5" y="5" width="90" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="5"  y1="40" x2="95" y2="40" stroke={C.frame} strokeWidth="2.2" />
    <line x1="50" y1="40" x2="50" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <Bovenlicht x={7}  y={7}  w={86} h={31} />
    <DKPaneel   x={7}  y={42} w={41} h={111} />
    <DKPaneelR  x={52} y={42} w={41} h={111} />
    <Kruk x={46} y={97} />
    <Kruk x={54} y={97} />
    <Scharnieren x={9}  y={42} h={111} />
    <Scharnieren x={93} y={42} h={111} />
  </g>
);

/** Dubbele deur met zijlicht rechts — v=1.5 */
export const DubbeleDeurZijlicht = () => (
  <g>
    <rect x="5" y="5" width="140" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="107" y1="5"  x2="107" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <line x1="55"  y1="5"  x2="55"  y2="155" stroke={C.frame} strokeWidth="2.2" />
    <DKPaneel  x={7}   y={7} w={46} h={146} />
    <DKPaneelR x={57}  y={7} w={48} h={146} />
    <Zijlicht  x={109} y={7} w={34} h={146} />
    <Kruk x={51} y={80} />
    <Kruk x={59} y={80} />
    <Scharnieren x={9}   y={7} h={146} />
    <Scharnieren x={103} y={7} h={146} />
  </g>
);

/** Dubbele deur met zijlichten en bovenlichten — v=1.8 */
export const DubbeleDeurZijlichtenBovenlichten = () => (
  <g>
    <rect x="5" y="5" width="170" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="5"   y1="40" x2="175" y2="40" stroke={C.frame} strokeWidth="2.2" />
    <line x1="46"  y1="5"  x2="46"  y2="155" stroke={C.frame} strokeWidth="2.2" />
    <line x1="134" y1="5"  x2="134" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <line x1="90"  y1="40" x2="90"  y2="155" stroke={C.frame} strokeWidth="2.2" />
    {/* 3 bovenlichten */}
    <Bovenlicht x={7}   y={7} w={37} h={31} />
    <Bovenlicht x={48}  y={7} w={84} h={31} />
    <Bovenlicht x={136} y={7} w={37} h={31} />
    {/* zijlichten */}
    <Zijlicht x={7}   y={42} w={37} h={111} />
    <Zijlicht x={136} y={42} w={37} h={111} />
    {/* dubbele deur */}
    <DKPaneel  x={48} y={42} w={40} h={111} />
    <DKPaneelR x={92} y={42} w={40} h={111} />
    <Kruk x={86} y={97} />
    <Kruk x={94} y={97} />
    <Scharnieren x={50}  y={42} h={111} />
    <Scharnieren x={130} y={42} h={111} />
  </g>
);

/** Dubbele deur met borstwering en bovenlicht — v=1 */
export const DubbeleDeurBorstweringBovenlicht = () => (
  <g>
    <rect x="5" y="5" width="90" height="150" fill="none" stroke={C.frame} strokeWidth="1.8" />
    <line x1="5"  y1="40"  x2="95" y2="40"  stroke={C.frame} strokeWidth="2.2" />
    <line x1="5"  y1="115" x2="95" y2="115" stroke={C.frame} strokeWidth="2.2" />
    <line x1="50" y1="40"  x2="50" y2="155" stroke={C.frame} strokeWidth="2.2" />
    <Bovenlicht  x={7}  y={7}   w={86} h={31} />
    <DKPaneel    x={7}  y={42}  w={41} h={71} />
    <DKPaneelR   x={52} y={42}  w={41} h={71} />
    <Borstwering x={7}  y={117} w={41} h={36} />
    <Borstwering x={52} y={117} w={41} h={36} />
    <Kruk x={46} y={77} />
    <Kruk x={54} y={77} />
    <Scharnieren x={9}  y={42} h={111} />
    <Scharnieren x={93} y={42} h={111} />
  </g>
);
