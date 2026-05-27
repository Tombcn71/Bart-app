const C = {
  frame:   "#334155",
  glass:   "#eff6ff",
  border:  "#94a3b8",
  primary: "#1066a3",
};

export const SlidingDoorDetailSVG = ({ sections }: { sections: number }) => {
  const isFourVaks = sections === 4;
  const width = isFourVaks ? 160 : 100;
  const sw = width / sections; // section width

  return (
    <svg
      viewBox={`0 0 ${width + 10} 85`}
      className="w-full h-auto drop-shadow-xl transition-all duration-300"
      style={{ maxHeight: "350px" }}
      preserveAspectRatio="xMidYMid meet">
      <g transform="translate(5, 5)">
        {/* buitenkader */}
        <rect x="0" y="0" width={width} height="75" fill="none" stroke={C.frame} strokeWidth="2" />

        {sections === 2 ? (
          <>
            {/* links: vast */}
            <rect x="1.5" y="1.5" width={sw - 3} height="72" fill={C.glass} />
            <rect x="1.5" y="1.5" width={sw - 3} height="72" fill="none" stroke={C.border} strokeWidth="1.2" />
            {/* vast-kruis */}
            <line x1={sw / 2 - 4} y1="37" x2={sw / 2 + 4} y2="37" stroke={C.border} strokeWidth="1.2" />
            <line x1={sw / 2} y1="33" x2={sw / 2} y2="41" stroke={C.border} strokeWidth="1.2" />

            {/* rechts: schuivend */}
            <rect x={sw + 1.5} y="1.5" width={sw - 3} height="72" fill={C.glass} />
            <rect x={sw + 1.5} y="1.5" width={sw - 3} height="72" fill="none" stroke={C.frame} strokeWidth="1.6" />
            {/* schuifpijl rechts */}
            <g transform={`translate(${sw + sw / 2 - 10}, 37)`}>
              <line x1="0" y1="0" x2="18" y2="0" stroke={C.primary} strokeWidth="1.5" />
              <line x1="0" y1="0" x2="5" y2="-4" stroke={C.primary} strokeWidth="1.5" />
              <line x1="0" y1="0" x2="5" y2="4" stroke={C.primary} strokeWidth="1.5" />
            </g>
          </>
        ) : (
          <>
            {[0, 1, 2, 3].map((i) => {
              const xPos = i * sw;
              const isFixed = i === 0 || i === 3;
              const isMovingLeft = i === 1;

              return (
                <g key={i}>
                  {/* glasvlak */}
                  <rect x={xPos + 1.5} y="1.5" width={sw - 3} height="72" fill={C.glass} />
                  <rect
                    x={xPos + 1.5} y="1.5"
                    width={sw - 3} height="72"
                    fill="none"
                    stroke={isFixed ? C.border : C.frame}
                    strokeWidth={isFixed ? 1.2 : 1.6}
                  />
                  {isFixed ? (
                    /* vast-kruis */
                    <g transform={`translate(${xPos + sw / 2 - 4}, 33)`}>
                      <line x1="0" y1="4" x2="8" y2="4" stroke={C.border} strokeWidth="1.2" />
                      <line x1="4" y1="0" x2="4" y2="8" stroke={C.border} strokeWidth="1.2" />
                    </g>
                  ) : (
                    /* schuifpijl */
                    <g transform={`translate(${xPos + sw / 2 - 8}, 37)`}>
                      <line x1="0" y1="0" x2="16" y2="0" stroke={C.primary} strokeWidth="1.5" />
                      {isMovingLeft ? (
                        <>
                          <line x1="0" y1="0" x2="5" y2="-4" stroke={C.primary} strokeWidth="1.5" />
                          <line x1="0" y1="0" x2="5" y2="4" stroke={C.primary} strokeWidth="1.5" />
                        </>
                      ) : (
                        <>
                          <line x1="16" y1="0" x2="11" y2="-4" stroke={C.primary} strokeWidth="1.5" />
                          <line x1="16" y1="0" x2="11" y2="4" stroke={C.primary} strokeWidth="1.5" />
                        </>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </>
        )}
      </g>
    </svg>
  );
};
