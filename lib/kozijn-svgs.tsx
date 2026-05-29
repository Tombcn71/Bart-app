// Architecturale stijl — zelfde principes als deur-svgs.tsx
// Coördinaten: elk vak is 100×100 units. x-prop voor horizontale positionering.

const S = {
  stroke:    "#000000",
  lineWidth: 0.8,   // paneel / frame buitenrand
  lineThin:  0.5,   // binnenste inset, openingsindicator
};

// ─── BASIS HULP-COMPONENTEN ───────────────────────────────────────────────────

// Scharnier-rechthoekjes (outlined, wit gevuld)
const Sch3 = ({ x, y, h }: { x: number; y: number; h: number }) => (
  <>
    <rect x={x-2} y={y + h*0.12} width="4" height="7" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x={x-2} y={y + h*0.45} width="4" height="7" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x={x-2} y={y + h*0.78} width="4" height="7" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
  </>
);

// ─── ENKELVOUDIGE VAKKEN ──────────────────────────────────────────────────────

/** Vast raam — dubbele rand, geen openingsindicator */
export const GlassVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="5" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

/** Draai-kiep raam — scharnieren links (of gespiegeld rechts) */
export const GlassDK = ({ x, mirror = false }: { x: number; mirror?: boolean }) => (
  <g transform={`translate(${x}, 0)${mirror ? " scale(-1,1) translate(-100,0)" : ""}`}>
    <rect x="5" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* Openingsindicator: V van links naar rechts-midden */}
    <path d="M9 9 L91 50 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* Kruk */}
    <rect x="87" y="47" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    {/* Scharnieren */}
    <Sch3 x={9} y={9} h={82} />
  </g>
);

/** Kiep raam — kiepaanslaande bovenkant */
export const GlassKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="5" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* Openingsindicator: Λ van onderkant naar bovenmidden */}
    <path d="M9 91 L50 9 L91 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* Handgreep boven */}
    <rect x="46" y="7" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
  </g>
);

// ─── 1-VAK MET KALF ──────────────────────────────────────────────────────────

/** Bovenlicht kiep + vast onderraam */
export const GlassVastBovenlichtKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht kiep (y=5..32) */}
    <rect x="5" y="5" width="90" height="27" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="19" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 28 L50 9 L91 28" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="46" y="7" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    {/* vast onderraam (y=36..95) */}
    <rect x="5" y="36" width="90" height="59" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="40" width="82" height="51" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

/** Bovenlicht vast + draai-kiep onderraam */
export const GlassDkBovenlichtVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht vast (y=5..30) */}
    <rect x="5" y="5" width="90" height="25" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="17" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* dk onderraam (y=34..95) */}
    <rect x="5" y="34" width="90" height="61" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="38" width="82" height="53" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 38 L91 65 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="61" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={38} h={53} />
  </g>
);

/** Bovenlicht kiep + draai-kiep onderraam */
export const GlassDkBovenlichtKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht kiep (y=5..32) */}
    <rect x="5" y="5" width="90" height="27" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="19" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 28 L50 9 L91 28" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="46" y="7" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    {/* dk onderraam (y=36..95) */}
    <rect x="5" y="36" width="90" height="59" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="40" width="82" height="51" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 40 L91 66 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="62" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={40} h={51} />
  </g>
);

/** Draai-kiep bovenraam + borstwering */
export const GlassDkBorstweringVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* dk bovenraam (y=5..62) */}
    <rect x="5" y="5" width="90" height="57" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="49" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 9 L91 34 L9 58" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="30" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={9} h={49} />
    {/* borstwering (y=66..95) */}
    <rect x="5" y="66" width="90" height="29" fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

// ─── 2-VAK COMBINATIES ───────────────────────────────────────────────────────

/** Twee kiep-vakken naast elkaar */
export const GlassKiepKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* links kiep */}
    <rect x="5" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 91 L50 9 L91 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="46" y="7" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    {/* rechts kiep */}
    <rect x="105" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M109 91 L150 9 L191 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="146" y="7" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
  </g>
);

/** Bovenlicht vast + draai-kiep links + draai-kiep rechts (gespiegeld) */
export const GlassDkDkStolpBovenlichtVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht (y=5..26, doorlopend) */}
    <rect x="5" y="5" width="190" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="182" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* links dk (y=30..95) */}
    <rect x="5" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 34 L91 63 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="59" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={34} h={57} />
    {/* rechts dk gespiegeld (y=30..95) */}
    <rect x="105" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M191 34 L109 63 L191 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="105" y="59" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={191} y={34} h={57} />
  </g>
);

/** Bovenlichten + draai-kiep links + vast rechts */
export const GlassDkVastBovenlichtenVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht links (y=5..26) */}
    <rect x="5" y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* bovenlicht rechts (y=5..26) */}
    <rect x="105" y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* links dk (y=30..95) */}
    <rect x="5" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 34 L91 63 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="59" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={34} h={57} />
    {/* rechts vast (y=30..95) */}
    <rect x="105" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

/** Bovenlicht kiep links + draai-kiep links + vast rechts */
export const GlassDkBovenlichtKiepVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht links kiep (y=5..30) */}
    <rect x="5" y="5" width="90" height="25" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="17" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 26 L50 9 L91 26" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="46" y="7" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    {/* links dk (y=34..95) */}
    <rect x="5" y="34" width="90" height="61" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="38" width="82" height="53" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 38 L91 65 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="61" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={38} h={53} />
    {/* rechts vast (y=5..95) */}
    <rect x="105" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

/** Bovenlicht kiep links + vast links + vast rechts */
export const GlassVastBovenlichtKiepVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht links kiep (y=5..30) */}
    <rect x="5" y="5" width="90" height="25" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="17" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 26 L50 9 L91 26" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="46" y="7" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    {/* links vast (y=34..95) */}
    <rect x="5" y="34" width="90" height="61" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="38" width="82" height="53" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* rechts vast (y=5..95) */}
    <rect x="105" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

/** Bovenlicht vast links + draai-kiep links + vast rechts */
export const GlassDkBovenlichtVastVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* bovenlicht links vast (y=5..22) */}
    <rect x="5" y="5" width="90" height="17" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="9" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* links dk (y=26..95) */}
    <rect x="5" y="26" width="90" height="69" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="30" width="82" height="61" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 30 L91 61 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="57" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={30} h={61} />
    {/* rechts vast (y=5..95) */}
    <rect x="105" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

// ─── 3-VAK COMBINATIES ───────────────────────────────────────────────────────

/** Draai-kiep + vast + vast */
export const GlassDkVastVastKozijn = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* vak 1: dk */}
    <rect x="5" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 9 L91 50 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="47" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={9} h={82} />
    {/* vak 2: vast */}
    <rect x="105" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* vak 3: vast */}
    <rect x="205" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="209" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);

/** Draai-kiep + draai-kiep + draai-kiep (gespiegeld) */
export const GlassDkDkDkKozijn = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* vak 1: dk */}
    <rect x="5" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 9 L91 50 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="47" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={9} h={82} />
    {/* vak 2: dk */}
    <rect x="105" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M109 9 L191 50 L109 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="187" y="47" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={109} y={9} h={82} />
    {/* vak 3: dk gespiegeld */}
    <rect x="205" y="5" width="90" height="90" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="209" y="9" width="82" height="82" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M291 9 L209 50 L291 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="205" y="47" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={291} y={9} h={82} />
  </g>
);

/** 3 bovenlichten + draai-kiep links + vast midden + draai-kiep rechts (gespiegeld) */
export const GlassDkVastDkBovenlichtenVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* 3 bovenlichten (y=5..26) */}
    <rect x="5"   y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9"   y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="105" y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="205" y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="209" y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* vak 1 onder: dk (y=30..95) */}
    <rect x="5" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M9 34 L91 63 L9 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="87" y="59" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={9} y={34} h={57} />
    {/* vak 2 onder: vast (y=30..95) */}
    <rect x="105" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* vak 3 onder: dk gespiegeld (y=30..95) */}
    <rect x="205" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="209" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M291 34 L209 63 L291 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="205" y="59" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={291} y={34} h={57} />
  </g>
);

/** 3 bovenlichten + vast links + draai-kiep midden + vast rechts */
export const GlassVastDkVastBovenlichtenVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    {/* 3 bovenlichten (y=5..26) */}
    <rect x="5"   y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9"   y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="105" y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="205" y="5" width="90" height="21" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="209" y="9" width="82" height="13" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* vak 1 onder: vast (y=30..95) */}
    <rect x="5" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="9" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    {/* vak 2 onder: dk (y=30..95) */}
    <rect x="105" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="109" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <path d="M109 34 L191 63 L109 91" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
    <rect x="187" y="59" width="8" height="3" rx="1" fill={S.stroke} stroke="none" />
    <Sch3 x={109} y={34} h={57} />
    {/* vak 3 onder: vast (y=30..95) */}
    <rect x="205" y="30" width="90" height="65" fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
    <rect x="209" y="34" width="82" height="57" fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
  </g>
);
