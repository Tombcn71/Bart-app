// Architecturale stijl — zelfde principes als deur-svgs.tsx.
// Hoogte 160, breedte 50px per paneel + 10px frame.

const S = {
  stroke:    "#000000",
  lineWidth: 0.8,
  lineThin:  0.5,
};

const H  = 160;
const PW = 50;   // panel breedte

export const HarmonicadeurSVG = ({ sections }: { sections: 3 | 4 | 5 }) => {
  const totalW = sections * PW + 10;

  return (
    <svg viewBox={`0 0 ${totalW} ${H}`} style={{ width: "100%", height: "auto" }}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: sections }, (_, i) => {
          const x1 = 5 + i * PW;
          const x2 = i === sections - 1 ? totalW - 5 : x1 + PW;
          const w  = x2 - x1;
          const ix = x1 + 4, iy = 9, iw = w - 8, ih = H - 18;

          return (
            <g key={i}>
              <rect x={x1} y={5} width={w} height={H-10}
                fill="white" stroke={S.stroke} strokeWidth={S.lineWidth} />
              <rect x={ix} y={iy} width={iw} height={ih}
                fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
              {/* openingsindicator op vrij paneel (zelfde kant als greep) */}
              {i === sections - 1 && (
                <path d={`M${ix+iw} ${iy} L${ix} ${iy+ih}`} fill="none" stroke={S.stroke} strokeWidth={S.lineThin} />
              )}
              {/* scharnier bij elke paneelaansluiting */}
              {i < sections - 1 && (
                <rect x={x2-2} y={H/2-5} width={4} height={10}
                  fill="white" stroke={S.stroke} strokeWidth={S.lineThin} />
              )}
            </g>
          );
        })}
        {/* greep op vrije zijde (rechts van laatste paneel) */}
        <rect
          x={totalW - 9} y={H/2 - 12}
          width={4} height={24} rx="2"
          fill="white" stroke={S.stroke} strokeWidth={S.lineThin}
        />
      </g>
    </svg>
  );
};

export const HarmonicadeurDriedelig  = () => <HarmonicadeurSVG sections={3} />;
export const HarmonicadeurVierdelig  = () => <HarmonicadeurSVG sections={4} />;
export const HarmonicadeurVijfdelig  = () => <HarmonicadeurSVG sections={5} />;
