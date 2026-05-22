import React from "react";

const COLORS = {
  frame: "#475569",
  glass: "#94a3b8",
  primary: "#1066a3",
};

export const SlidingDoorDetailSVG = ({ sections }: { sections: number }) => {
  const isFourVaks = sections === 4;
  const width = isFourVaks ? 160 : 100;
  const sectionWidth = width / sections;

  return (
    <svg
      viewBox={`0 0 ${width + 10} 85`}
      className="w-full h-auto drop-shadow-xl transition-all duration-300"
      style={{ maxHeight: "350px" }}
      preserveAspectRatio="xMidYMid meet">
      <g transform="translate(5, 5)">
        {/* Buitenkader */}
        <rect
          x="0"
          y="0"
          width={width}
          height="75"
          fill="none"
          stroke={COLORS.frame}
          strokeWidth="1.5"
        />

        {sections === 2 ? (
          <>
            {/* 2-VAKS: Links vast, rechts schuivend */}
            <rect
              x="1.5"
              y="1.5"
              width={sectionWidth - 2}
              height="72"
              fill="none"
              stroke={COLORS.frame}
              strokeWidth="1"
            />
            <g transform={`translate(${sectionWidth / 2 - 3}, 35)`}>
              <line
                x1="0"
                y1="0"
                x2="6"
                y2="0"
                stroke={COLORS.glass}
                strokeWidth="1"
              />
              <line
                x1="3"
                y1="-3"
                x2="3"
                y2="3"
                stroke={COLORS.glass}
                strokeWidth="1"
              />
            </g>

            <rect
              x={sectionWidth + 0.5}
              y="1.5"
              width={sectionWidth - 2}
              height="72"
              fill="none"
              stroke={COLORS.frame}
              strokeWidth="1"
            />
            <g
              transform={`translate(${sectionWidth + sectionWidth / 2 - 10}, 37)`}>
              <line
                x1="0"
                y1="0"
                x2="16"
                y2="0"
                stroke={COLORS.primary}
                strokeWidth="1.2"
              />
              <line
                x1="0"
                y1="0"
                x2="4"
                y2="-3"
                stroke={COLORS.primary}
                strokeWidth="1.2"
              />
              <line
                x1="0"
                y1="0"
                x2="4"
                y2="3"
                stroke={COLORS.primary}
                strokeWidth="1.2"
              />
            </g>
          </>
        ) : (
          <>
            {/* 4-VAKS: Buiten vast, midden schuift */}
            {[0, 1, 2, 3].map((i) => {
              const xPos = i * sectionWidth;
              const isFixed = i === 0 || i === 3;
              const isMovingLeft = i === 1;

              return (
                <g key={i}>
                  <rect
                    x={xPos + 1}
                    y="1.5"
                    width={sectionWidth - 2}
                    height="72"
                    fill="none"
                    stroke={COLORS.frame}
                    strokeWidth="1"
                  />
                  {isFixed ? (
                    <g
                      transform={`translate(${xPos + sectionWidth / 2 - 3}, 35)`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="6"
                        y2="0"
                        stroke={COLORS.glass}
                        strokeWidth="1"
                      />
                      <line
                        x1="3"
                        y1="-3"
                        x2="3"
                        y2="3"
                        stroke={COLORS.glass}
                        strokeWidth="1"
                      />
                    </g>
                  ) : (
                    <g
                      transform={`translate(${xPos + sectionWidth / 2 - 7}, 37)`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="14"
                        y2="0"
                        stroke={COLORS.primary}
                        strokeWidth="1.2"
                      />
                      {isMovingLeft ? (
                        <>
                          <line
                            x1="0"
                            y1="0"
                            x2="4"
                            y2="-3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
                          <line
                            x1="0"
                            y1="0"
                            x2="4"
                            y2="3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
                        </>
                      ) : (
                        <>
                          <line
                            x1="14"
                            y1="0"
                            x2="10"
                            y2="-3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
                          <line
                            x1="14"
                            y1="0"
                            x2="10"
                            y2="3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
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
