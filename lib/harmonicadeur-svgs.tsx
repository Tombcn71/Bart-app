const C = {
  frame:  "#334155",
  glass:  "#eff6ff",
};

export const HarmonicadeurSVG = ({ sections }: { sections: 3 | 4 | 5 }) => {
  const panelW = 50;
  const totalH = 120;
  const totalW = sections * panelW + 16;

  const fX = 4, fY = 4;
  const fW = totalW - 8, fH = totalH - 8;
  const ifX = fX + 4, ifY = fY + 4;
  const ifW = fW - 8, ifH = fH - 8;

  const postW = 4;
  const numPosts = sections - 1;
  const pW = (ifW - numPosts * postW) / sections;
  const pH = ifH;
  const getPX = (i: number) => ifX + i * (pW + postW);

  const pad = 4;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet">

      {/* buitenkader */}
      <rect x={fX} y={fY} width={fW} height={fH} fill="none" stroke={C.frame} strokeWidth="2.5" />
      {/* binnenkader */}
      <rect x={ifX} y={ifY} width={ifW} height={ifH} fill="none" stroke={C.frame} strokeWidth="1" />

      {/* stijlen tussen panelen */}
      {Array.from({ length: numPosts }, (_, i) => (
        <rect key={i} x={getPX(i) + pW} y={ifY} width={postW} height={pH} fill={C.frame} />
      ))}

      {/* scharnierpaneel (links) */}
      {(() => {
        const px = getPX(0);
        const bx = px + pad, by = ifY + pad;
        const bw = pW - pad * 2, bh = pH - pad * 2;
        const hx = bx + bw, hy = by + bh / 2;
        return (
          <>
            <rect x={px} y={ifY} width={pW} height={pH} fill={C.glass} />
            <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={C.frame} strokeWidth="1.5" />
            {/* openingsindicator: V naar handgreep */}
            <line x1={bx} y1={by}      x2={hx} y2={hy} stroke={C.frame} strokeWidth="1" />
            <line x1={bx} y1={by + bh} x2={hx} y2={hy} stroke={C.frame} strokeWidth="1" />
            {/* handgreep */}
            <circle cx={hx - 1} cy={hy} r="2.5" fill="none" stroke={C.frame} strokeWidth="1.2" />
          </>
        );
      })()}

      {/* schuifpanelen */}
      {Array.from({ length: sections - 1 }, (_, i) => {
        const px = getPX(i + 1);
        const bx = px + pad, by = ifY + pad;
        const bw = pW - pad * 2, bh = pH - pad * 2;
        const cx = bx + bw / 2, cy = by + bh / 2;
        const al = 9;
        return (
          <g key={i}>
            <rect x={px} y={ifY} width={pW} height={pH} fill={C.glass} />
            <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={C.frame} strokeWidth="1.5" />
            {/* pijl naar rechts */}
            <line x1={cx - al} y1={cy} x2={cx + al} y2={cy} stroke={C.frame} strokeWidth="1.2" />
            <line x1={cx + al - 5} y1={cy - 4} x2={cx + al} y2={cy} stroke={C.frame} strokeWidth="1.2" />
            <line x1={cx + al - 5} y1={cy + 4} x2={cx + al} y2={cy} stroke={C.frame} strokeWidth="1.2" />
          </g>
        );
      })}
    </svg>
  );
};

export const HarmonicadeurDriedelig  = () => <HarmonicadeurSVG sections={3} />;
export const HarmonicadeurVierdelig  = () => <HarmonicadeurSVG sections={4} />;
export const HarmonicadeurVijfdelig  = () => <HarmonicadeurSVG sections={5} />;
