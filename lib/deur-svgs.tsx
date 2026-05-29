// Alle deur-SVG componenten werken in een 160-hoog coördinatensysteem.
// Breedte varieert via de 'v' waarde op de deur-entry:
//   v=1   → viewBox "0 0 100 160"  (enkele deur)
//   v=1.5 → viewBox "0 0 150 160"  (met zijlicht)
//   v=1.8 → viewBox "0 0 180 160"  (met twee zijlichten)

const S = {
  stroke:     "#000000",
  lineWidth:  0.8,
  lineThin:   0.5,
};

// ─── INTERNE HELPERS ─────────────────────────────────────────────────────────

// Profiel-effect: dunne binnenlijn, rendert NAA de panelen zodat hij altijd zichtbaar is
const Profiel = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x+4} y={y+4} width={w-8} height={h-8} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
);

// Draaipaneel links (V wijst rechts → scharnieren links)
const DKPaneel = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x={x+4} y={y+4} width={w-8} height={h-8} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d={`M${x} ${y} L${x+w} ${y+h/2} L${x} ${y+h}`} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </>
);

// Draaipaneel rechts (V wijst links → scharnieren rechts)
const DKPaneelR = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x={x+4} y={y+4} width={w-8} height={h-8} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d={`M${x+w} ${y} L${x} ${y+h/2} L${x+w} ${y+h}`} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </>
);

const VoordeurPaneel = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => {
  const archH  = Math.round(h * 0.32);
  const gridY  = y + archH + 5;
  const gridH  = Math.round(h * 0.30);
  const plankY = gridY + gridH + 5;
  const mx     = x + w / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <rect x={x+4} y={y+4} width={w-8} height={h-8} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
      <path
        d={`M${x+7} ${y+archH+4} Q${x+7} ${y+7} ${mx} ${y+7} Q${x+w-7} ${y+7} ${x+w-7} ${y+archH+4}`}
        fill="none" stroke={S.stroke} strokeWidth={S.lineThin}
      />
      <rect x={x+7} y={gridY} width={w-14} height={gridH} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
      <line x1={mx}    y1={gridY}          x2={mx}    y2={gridY+gridH}    stroke={S.stroke} strokeWidth={S.lineThin} />
      <line x1={x+7}   y1={gridY+gridH/2}  x2={x+w-7} y2={gridY+gridH/2} stroke={S.stroke} strokeWidth={S.lineThin} />
      <rect x={x+7} y={plankY} width={w-14} height={(y+h-7)-plankY} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    </>
  );
};

const Bovenlicht = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
    <line x1={x+w/2-4} y1={y+h/2}   x2={x+w/2+4} y2={y+h/2}   stroke={S.stroke} strokeWidth={S.lineThin} />
    <line x1={x+w/2}   y1={y+h/2-4} x2={x+w/2}   y2={y+h/2+4} stroke={S.stroke} strokeWidth={S.lineThin} />
  </>
);

const Zijlicht = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <>
    <rect x={x} y={y} width={w} height={h} fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
    <line x1={x+w/2-3} y1={y+h/2}   x2={x+w/2+3} y2={y+h/2}   stroke={S.stroke} strokeWidth={S.lineThin} />
    <line x1={x+w/2}   y1={y+h/2-3} x2={x+w/2}   y2={y+h/2+3} stroke={S.stroke} strokeWidth={S.lineThin} />
  </>
);

const Borstwering = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x} y={y} width={w} height={h} fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
);

// side="r" → klinkstang wijst rechts; side="l" → klinkstang wijst links
const Kruk = ({ x, y, side = "r" }: { x: number; y: number; side?: "l" | "r" }) => (
  <rect
    x={side === "r" ? x : x - 9}
    y={y - 1.5}
    width="9"
    height="3"
    rx="1"
    fill={S.stroke}
    stroke="none"
  />
);

const Scharnieren = ({ x, y, h }: { x: number; y: number; h: number }) => (
  <>
    <rect x={x-2} y={y + h*0.12} width="4" height="8" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x={x-2} y={y + h*0.45} width="4" height="8" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x={x-2} y={y + h*0.78} width="4" height="8" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
  </>
);

// ─── BESTAANDE COMPONENTEN (gebruikt door detail-pagina) ──────────────────────

/** v=1  → viewBox "0 0 100 160" */
export const SingleDoorBase = ({ type }: { type: "voordeur" | "achterdeur" }) => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="5" width="80" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    {type === "voordeur"
      ? <VoordeurPaneel x={22} y={14} w={56} h={132} />
      : <DKPaneel       x={22} y={14} w={56} h={132} />
    }
    <Kruk x={76} y={80} side="r" />
    <Scharnieren x={24} y={14} h={132} />
    <Profiel x={10} y={5} w={80} h={150} />
  </g>
);

/** v=1.5 (geen zijlichten) of v=1.8 (met zijlichten) */
export const DoubleDoorBase = ({
  hasSideLights = false,
  hasPlinth = false,
}: {
  hasSideLights?: boolean;
  hasPlinth?: boolean;
}) => {
  if (hasSideLights) {
    // 12+22+4+45+4+45+4+22+12 = 170px — deur (45px) is 2× zijlicht (22px)
    return (
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="170" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
        <Zijlicht  x={17} y={14} w={22} h={132} />
        <DKPaneel  x={43} y={14} w={45} h={132} />
        <DKPaneelR x={92} y={14} w={45} h={132} />
        <Zijlicht  x={141} y={14} w={22} h={132} />
        <Kruk x={86} y={80} side="r" />
        <Kruk x={94} y={80} side="l" />
        <Scharnieren x={45}  y={14} h={132} />
        <Scharnieren x={135} y={14} h={132} />
        <Profiel x={5} y={5} w={170} h={150} />
      </g>
    );
  }

  const wingH = hasPlinth ? 99 : 132;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="140" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
      <DKPaneel  x={17} y={14} w={56} h={wingH} />
      <DKPaneelR x={77} y={14} w={56} h={wingH} />
      {hasPlinth && (
        <>
          <Borstwering x={17} y={115} w={56} h={31} />
          <Borstwering x={77} y={115} w={56} h={31} />
        </>
      )}
      <Kruk x={71} y={80} side="r" />
      <Kruk x={79} y={80} side="l" />
      <Scharnieren x={19}  y={14} h={wingH} />
      <Scharnieren x={131} y={14} h={wingH} />
      <Profiel x={5} y={5} w={140} h={150} />
    </g>
  );
};

// ─── ENKELE DEUR VARIANTEN ────────────────────────────────────────────────────

// ── v=1  (viewBox "0 0 100 160") — frame x=10, w=80 ──────────────────────────

/** Achterdeur met bovenlicht (vast) */
export const AchterdeurBovenlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="5" width="80" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht x={22} y={14} w={56} h={29} />
    <DKPaneel   x={22} y={47} w={56} h={100} />
    <Kruk x={76} y={97} side="r" />
    <Scharnieren x={24} y={47} h={100} />
    <Profiel x={10} y={5} w={80} h={150} />
  </g>
);

/** Voordeur met bovenlicht (vast) */
export const VoordeurBovenlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="5" width="80" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht     x={22} y={14} w={56} h={29} />
    <VoordeurPaneel x={22} y={47} w={56} h={100} />
    <Kruk x={76} y={97} side="r" />
    <Scharnieren x={24} y={47} h={100} />
    <Profiel x={10} y={5} w={80} h={150} />
  </g>
);

/** Achterdeur met borstwering */
export const AchterdeurBorstwering = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="5" width="80" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <DKPaneel    x={22} y={14}  w={56} h={99} />
    <Borstwering x={22} y={117} w={56} h={30} />
    <Kruk x={76} y={63} side="r" />
    <Scharnieren x={24} y={14} h={133} />
    <Profiel x={10} y={5} w={80} h={150} />
  </g>
);

/** Achterdeur met borstwering en bovenlicht */
export const AchterdeurBorstweringBovenlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="5" width="80" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht  x={22} y={14}  w={56} h={29} />
    <DKPaneel    x={22} y={47}  w={56} h={66} />
    <Borstwering x={22} y={117} w={56} h={30} />
    <Kruk x={76} y={80} side="r" />
    <Scharnieren x={24} y={47} h={100} />
    <Profiel x={10} y={5} w={80} h={150} />
  </g>
);

// ── v=1.5  (viewBox "0 0 150 160") ───────────────────────────────────────────
// Deurblad = 56px, zijlicht = 28px (helft van deur).
// Frame sluit strak: 12px marge + 56px deur + 4px rail + 28px zijlicht + 12px marge = 112px.
// Frame x=19, w=112 → symmetrisch gecentreerd in de 150px viewBox.

/** Achterdeur met zijlicht rechts */
export const DeurZijlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="19" y="5" width="112" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <DKPaneel x={31} y={14} w={56} h={132} />
    <Zijlicht x={91} y={14} w={28} h={132} />
    <Kruk x={85} y={80} side="r" />
    <Scharnieren x={33} y={14} h={132} />
    <Profiel x={19} y={5} w={112} h={150} />
  </g>
);

/** Voordeur met zijlicht rechts */
export const VoordeurZijlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="19" y="5" width="112" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <VoordeurPaneel x={31} y={14} w={56} h={132} />
    <Zijlicht       x={91} y={14} w={28} h={132} />
    <Kruk x={85} y={80} side="r" />
    <Scharnieren x={33} y={14} h={132} />
    <Profiel x={19} y={5} w={112} h={150} />
  </g>
);

/** Deur met zijlicht en bovenlicht — zijlicht links, deur rechts */
export const DeurZijlichtBovenlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="19" y="5" width="112" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht x={31} y={14} w={88} h={29} />
    <Zijlicht   x={31} y={47} w={28} h={100} />
    <DKPaneel   x={63} y={47} w={56} h={100} />
    <Kruk x={117} y={97} side="r" />
    <Scharnieren x={65} y={47} h={100} />
    <Profiel x={19} y={5} w={112} h={150} />
  </g>
);

/** Voordeur met zijlicht en bovenlicht — voordeur links, zijlicht rechts */
export const VoordeurZijlichtBovenlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="19" y="5" width="112" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht     x={31} y={14} w={88} h={29} />
    <VoordeurPaneel x={31} y={47} w={56} h={100} />
    <Zijlicht       x={91} y={47} w={28} h={100} />
    <Kruk x={85} y={97} side="r" />
    <Scharnieren x={33} y={47} h={100} />
    <Profiel x={19} y={5} w={112} h={150} />
  </g>
);

/** Achterdeur met zijlicht en borstwering — deur links, zijlicht rechts */
export const DeurZijlichtBorstwering = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="19" y="5" width="112" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <DKPaneel    x={31} y={14}  w={56} h={97} />
    <Borstwering x={31} y={115} w={56} h={31} />
    <Zijlicht    x={91} y={14}  w={28} h={132} />
    <Kruk x={85} y={62} side="r" />
    <Scharnieren x={33} y={14} h={132} />
    <Profiel x={19} y={5} w={112} h={150} />
  </g>
);

// ── v=1.8  (viewBox "0 0 180 160") ───────────────────────────────────────────
// Deur=56px, elk zijlicht=28px (helft van deur).
// Frame: 12+28+4+56+4+28+12 = 144px → x=18, w=144.

/** Achterdeur met twee zijlichten */
export const DeurZijlichten = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="5" width="144" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Zijlicht x={30} y={14} w={28} h={132} />
    <DKPaneel x={62} y={14} w={56} h={132} />
    <Zijlicht x={122} y={14} w={28} h={132} />
    <Kruk x={116} y={80} side="r" />
    <Scharnieren x={64} y={14} h={132} />
    <Profiel x={18} y={5} w={144} h={150} />
  </g>
);

// ─── DUBBELE DEUR VARIANTEN ──────────────────────────────────────────────────

/** Dubbele deur met bovenlicht — v=1.5 */
export const DubbeleDeurBovenlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="140" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht x={17} y={14} w={116} h={29} />
    <DKPaneel   x={17} y={47} w={56}  h={100} />
    <DKPaneelR  x={77} y={47} w={56}  h={100} />
    <Kruk x={71} y={97} side="r" />
    <Kruk x={79} y={97} side="l" />
    <Scharnieren x={19}  y={47} h={100} />
    <Scharnieren x={131} y={47} h={100} />
    <Profiel x={5} y={5} w={140} h={150} />
  </g>
);

/** Dubbele deur met zijlicht rechts — v=1.8 (2×56px deur + 28px zijlicht past in 170px frame) */
export const DubbeleDeurZijlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="170" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <DKPaneel  x={17} y={14} w={56} h={132} />
    <DKPaneelR x={77} y={14} w={56} h={132} />
    <Zijlicht  x={137} y={14} w={28} h={132} />
    <Kruk x={71} y={80} side="r" />
    <Kruk x={79} y={80} side="l" />
    <Scharnieren x={19}  y={14} h={132} />
    <Scharnieren x={131} y={14} h={132} />
    <Profiel x={5} y={5} w={170} h={150} />
  </g>
);

/** Dubbele deur met zijlichten en bovenlichten — v=1.8 */
export const DubbeleDeurZijlichtenBovenlichten = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="170" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht x={17}  y={14} w={22} h={29} />
    <Bovenlicht x={43}  y={14} w={94} h={29} />
    <Bovenlicht x={141} y={14} w={22} h={29} />
    <Zijlicht  x={17}  y={47} w={22} h={100} />
    <DKPaneel  x={43}  y={47} w={45} h={100} />
    <DKPaneelR x={92}  y={47} w={45} h={100} />
    <Zijlicht  x={141} y={47} w={22} h={100} />
    <Kruk x={86} y={97} side="r" />
    <Kruk x={94} y={97} side="l" />
    <Scharnieren x={45}  y={47} h={100} />
    <Scharnieren x={135} y={47} h={100} />
    <Profiel x={5} y={5} w={170} h={150} />
  </g>
);

/** Dubbele deur met borstwering en bovenlicht — v=1.5 */
export const DubbeleDeurBorstweringBovenlicht = () => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="140" height="150" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <Bovenlicht  x={17} y={14}  w={116} h={29} />
    <DKPaneel    x={17} y={47}  w={56}  h={66} />
    <DKPaneelR   x={77} y={47}  w={56}  h={66} />
    <Borstwering x={17} y={117} w={56}  h={29} />
    <Borstwering x={77} y={117} w={56}  h={29} />
    <Kruk x={71} y={80} side="r" />
    <Kruk x={79} y={80} side="l" />
    <Scharnieren x={19}  y={47} h={100} />
    <Scharnieren x={131} y={47} h={100} />
    <Profiel x={5} y={5} w={140} h={150} />
  </g>
);
