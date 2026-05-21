"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// SVG Componenten
const SingleDoorBase = ({ type }: { type: "voordeur" | "achterdeur" }) => (
  <g transform="translate(20, 5)">
    <rect x="0" y="0" width="60" height="90" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" />
    {type === "voordeur" ? (
      <>
        <rect x="10" y="10" width="40" height="35" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        <line x1="10" y1="27.5" x2="50" y2="27.5" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        <line x1="30" y1="10" x2="30" y2="45" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        <rect x="15" y="60" width="30" height="20" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
      </>
    ) : (
      <>
        <rect x="5" y="5" width="50" height="80" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        <path d="M5 5 L55 45 L5 85" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
      </>
    )}
    <circle cx="56" cy="45" r="1.5" fill="hsl(var(--foreground))" />
  </g>
)

const DoubleDoorBase = ({ hasSideLights = false, hasPlinth = false }) => {
  const width = hasSideLights ? 180 : 100
  return (
    <g>
      <rect x="5" y="5" width={width - 10} height="90" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" />
      {hasSideLights && (
        <>
          <line x1="45" y1="5" x2="45" y2="95" stroke="hsl(var(--foreground))" strokeWidth="1" />
          <line x1="135" y1="5" x2="135" y2="95" stroke="hsl(var(--foreground))" strokeWidth="1" />
          <line x1="20" y1="48" x2="30" y2="48" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
          <line x1="155" y1="43" x2="155" y2="53" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
        </>
      )}
      <g transform={hasSideLights ? "translate(45, 0)" : "translate(0, 0)"}>
        <rect x="5" y="5" width="90" height="90" fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(var(--foreground))" strokeWidth="1" />
        <path d="M10 10 L45 50 L10 90" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
        <path d="M90 10 L55 50 L90 90" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
        {hasPlinth && (
          <>
            <line x1="5" y1="65" x2="95" y2="65" stroke="hsl(var(--foreground))" strokeWidth="1" />
            <rect x="10" y="70" width="35" height="20" fill="hsl(var(--muted))" stroke="none" />
            <rect x="55" y="70" width="35" height="20" fill="hsl(var(--muted))" stroke="none" />
          </>
        )}
        <circle cx="46" cy="50" r="1.5" fill="hsl(var(--foreground))" />
        <circle cx="54" cy="50" r="1.5" fill="hsl(var(--foreground))" />
      </g>
    </g>
  )
}

export default function DeurenConfigurator() {
  const [activeType, setActiveType] = useState("enkel")

  const deuren = [
    { id: 1, category: "enkel", slug: "voordeur", name: "Voordeur", best: true, v: 1, components: <SingleDoorBase type="voordeur" /> },
    { id: 2, category: "enkel", slug: "achterdeur", name: "Achterdeur", best: true, v: 1, components: <SingleDoorBase type="achterdeur" /> },
    { id: 3, category: "dubbel", slug: "dubbele-deur", name: "Dubbele deur", best: true, v: 1, components: <DoubleDoorBase /> },
    { id: 4, category: "dubbel", slug: "dubbele-deur-zijlichten", name: "Dubbele deur met zijlichten", best: true, v: 1.8, components: <DoubleDoorBase hasSideLights /> },
    { id: 5, category: "dubbel", slug: "dubbele-deur-borstwering", name: "Dubbele deur met borstwering", best: true, v: 1, components: <DoubleDoorBase hasPlinth /> },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 md:mb-12">
        <div className="border-l-4 border-primary pl-4 md:pl-6">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
            Kunststof deuren
          </h1>
          <p className="text-primary font-medium text-sm md:text-lg uppercase tracking-tight">
            Kies uw gewenste indeling
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeType} onValueChange={setActiveType}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="enkel" className="flex-1 sm:flex-none">
              Enkele deur
            </TabsTrigger>
            <TabsTrigger value="dubbel" className="flex-1 sm:flex-none">
              Dubbele deur
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {deuren
          .filter((d) => d.category === activeType)
          .map((item) => (
            <Link href={`/configurators/deurconfigurator/${item.slug}`} key={item.id} className="group">
              <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
                {item.best && (
                  <Badge className="absolute top-3 left-3 z-10">Populair</Badge>
                )}
                <CardContent className="p-6 md:p-8">
                  <div className="aspect-[4/3] flex items-center justify-center">
                    <div style={{ width: item.v > 1.5 ? "100%" : "60%" }}>
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
