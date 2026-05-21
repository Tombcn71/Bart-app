"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// SVG Schuifpui Component
const SlidingDoorSVG = ({ sections }: { sections: 2 | 4 }) => {
  const isFourVaks = sections === 4
  const baseWidth = isFourVaks ? 180 : 90
  const sectionWidth = baseWidth / sections

  return (
    <g transform="translate(0, 5)">
      <rect x="0" y="0" width={baseWidth} height="90" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" />

      {sections === 2 ? (
        <>
          <rect x="2" y="2" width={sectionWidth - 3} height="86" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
          <g transform={`translate(${sectionWidth / 2 - 2}, 43)`}>
            <line x1="0" y1="0" x2="4" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" />
            <line x1="2" y1="-2" x2="2" y2="2" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" />
          </g>

          <rect x={sectionWidth + 1} y="2" width={sectionWidth - 3} height="86" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
          <g transform={`translate(${sectionWidth + 10}, 45)`}>
            <line x1="0" y1="0" x2="12" y2="0" stroke="hsl(var(--foreground))" strokeWidth="1" />
            <line x1="0" y1="0" x2="3" y2="-3" stroke="hsl(var(--foreground))" strokeWidth="1" />
            <line x1="0" y1="0" x2="3" y2="3" stroke="hsl(var(--foreground))" strokeWidth="1" />
          </g>
        </>
      ) : (
        <>
          {[0, 1, 2, 3].map((i) => {
            const xPos = i * sectionWidth
            const isFixed = i === 0 || i === 3
            const isMovingLeft = i === 1

            return (
              <g key={i}>
                <rect x={xPos + 1} y="2" width={sectionWidth - 2} height="86" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
                {isFixed ? (
                  <g transform={`translate(${xPos + sectionWidth / 2 - 2}, 43)`}>
                    <line x1="0" y1="0" x2="4" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" />
                    <line x1="2" y1="-2" x2="2" y2="2" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" />
                  </g>
                ) : (
                  <g transform={`translate(${xPos + (isMovingLeft ? 5 : sectionWidth - 15)}, 45)`}>
                    <line x1="0" y1="0" x2="10" y2="0" stroke="hsl(var(--foreground))" strokeWidth="1" />
                    <line x1={isMovingLeft ? 0 : 10} y1="0" x2={isMovingLeft ? 3 : 7} y2="-3" stroke="hsl(var(--foreground))" strokeWidth="1" />
                    <line x1={isMovingLeft ? 0 : 10} y1="0" x2={isMovingLeft ? 3 : 7} y2="3" stroke="hsl(var(--foreground))" strokeWidth="1" />
                  </g>
                )}
              </g>
            )
          })}
        </>
      )}
    </g>
  )
}

export default function SchuifpuiOverview() {
  const [activeType, setActiveType] = useState("2-vaks")

  const puien = [
    { id: 1, category: "2-vaks", slug: "schuifpui-2-vaks", name: "Schuifpui 2-vaks", best: true, v: 1, components: <SlidingDoorSVG sections={2} /> },
    { id: 2, category: "4-vaks", slug: "schuifpui-4-vaks", name: "Schuifpui 4-vaks", best: true, v: 1.8, components: <SlidingDoorSVG sections={4} /> },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 md:mb-12">
        <div className="border-l-4 border-primary pl-4 md:pl-6">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
            Kunststof schuifpuien
          </h1>
          <p className="text-primary font-medium text-sm md:text-lg uppercase tracking-tight">
            Kies uw gewenste indeling
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeType} onValueChange={setActiveType}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="2-vaks" className="flex-1 sm:flex-none">
              2-vaks
            </TabsTrigger>
            <TabsTrigger value="4-vaks" className="flex-1 sm:flex-none">
              4-vaks
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {puien
          .filter((p) => p.category === activeType)
          .map((item) => (
            <Link href={`/configurators/schuifpuiconfigurator/${item.slug}`} key={item.id} className="group">
              <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
                {item.best && (
                  <Badge className="absolute top-3 left-3 z-10">Populair</Badge>
                )}
                <CardContent className="p-6 md:p-8">
                  <div className="aspect-[4/3] flex items-center justify-center">
                    <div style={{ width: item.v > 1.5 ? "100%" : "70%" }}>
                      <svg viewBox={`0 0 ${item.v * 100} 100`} className="w-full h-auto">
                        {item.components}
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-center font-semibold text-foreground text-sm md:text-base group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Stel nu samen
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}
