"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// SVG Componenten
const GlassVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="6" y="6" width="88" height="88" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.4" />
    <line x1="48" y1="50" x2="52" y2="50" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" />
    <line x1="50" y1="48" x2="50" y2="52" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" />
  </g>
)

const GlassDK = ({ x, mirror = false }: { x: number; mirror?: boolean }) => (
  <g transform={`translate(${x}, 0) ${mirror ? "scale(-1, 1) translate(-100, 0)" : ""}`}>
    <rect x="6" y="6" width="88" height="88" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.4" />
    <path d="M12 12 L88 50 L12 88" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
    <rect x="10" y="10" width="80" height="80" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
    <rect x="84" y="46" width="1.5" height="8" rx="0.5" fill="hsl(var(--foreground))" />
  </g>
)

const GlassKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="6" y="6" width="88" height="88" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.4" />
    <path d="M12 12 L50 88 L88 12" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
    <rect x="10" y="10" width="80" height="80" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
    <rect x="46" y="8" width="8" height="1.5" rx="0.5" fill="hsl(var(--foreground))" />
  </g>
)

export default function KozijnConfigurator() {
  const [activeTab, setActiveTab] = useState("1")

  const kozijnen = [
    { id: 1, slug: "vast-kozijn", v: 1, name: "Vast kozijn", best: true, components: [<GlassVast key="1" x={0} />] },
    { id: 2, slug: "draai-kiep-kozijn", v: 1, name: "Draai kiep kozijn", best: true, components: [<GlassDK key="1" x={0} />] },
    { id: 3, slug: "kiep-kozijn", v: 1, name: "Kiep kozijn", best: true, components: [<GlassKiep key="1" x={0} />] },
    { id: 4, slug: "draai-kiep-vast-kozijn", v: 2, name: "Draai kiep - vast", best: true, components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />] },
    { id: 5, slug: "draai-kiep-draai-stolp-kozijn", v: 2, name: "Draai kiep - Draai kiep", best: true, components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} mirror />] },
    { id: 6, slug: "vast-vast-kozijn", v: 2, name: "Vast - Vast", best: true, components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />] },
    { id: 7, slug: "draai-kiep-vast-draai-kiep-kozijn", v: 3, name: "Draai kiep - vast - Draai kiep", best: true, components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassDK key="3" x={200} mirror />] },
    { id: 8, slug: "vast-vast-vast-kozijn", v: 3, name: "Vast - Vast - Vast", best: true, components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />] },
    { id: 9, slug: "vast-draai-kiep-vast-kozijn", v: 3, name: "Vast - Draai kiep - Vast", best: true, components: [<GlassVast key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassVast key="3" x={200} />] },
    { id: 10, slug: "draai-kiep-vast-vast-draai-kiep-kozijn", v: 4, name: "Draai kiep - Vast - Vast - Draai kiep", best: true, components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />, <GlassDK key="4" x={300} mirror />] },
    { id: 11, slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn", v: 4, name: "4x Draai kiep kozijn", best: true, components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassDK key="3" x={200} />, <GlassDK key="4" x={300} />] },
  ]

  const activeV = parseInt(activeTab)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:py-16">
      {/* Header */}
      <div className="mb-8 md:mb-12 border-l-4 border-primary pl-4 md:pl-6">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
          Kunststof kozijnen
        </h1>
        <p className="text-primary font-medium text-sm md:text-lg uppercase tracking-tight">
          Kies uw gewenste indeling
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 md:mb-12">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
          {[1, 2, 3, 4].map((n) => (
            <TabsTrigger key={n} value={String(n)} className="text-xs sm:text-sm">
              {n} {n === 1 ? "vak" : "vakken"}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {kozijnen
          .filter((k) => k.v === activeV)
          .map((item) => (
            <Link href={`/configurators/kozijnconfigurator/${item.slug}`} key={item.id} className="group">
              <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
                {item.best && (
                  <Badge className="absolute top-3 left-3 z-10">Populair</Badge>
                )}
                <CardContent className="p-6 md:p-8">
                  <div className="aspect-square flex items-center justify-center">
                    <div style={{ width: `${item.v * 20 + 20}%`, maxWidth: "100%" }}>
                      <svg viewBox={`0 0 ${item.v * 100} 100`} className="w-full h-auto">
                        <rect x="0.5" y="0.5" width={item.v * 100 - 1} height="99" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" />
                        {Array.from({ length: item.v - 1 }).map((_, i) => (
                          <line key={i} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="100" stroke="hsl(var(--foreground))" strokeWidth="1" />
                        ))}
                        {item.components}
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-center font-semibold text-foreground text-sm md:text-base group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Bekijk configurator
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}
