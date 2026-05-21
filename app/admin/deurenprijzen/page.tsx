"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

export default function DeurenPrijzenPagina() {
  const [deurData, setDeurData] = useState({
    basis: {
      voordeur: 950,
      achterdeur: 880,
      dubbel: 1650,
      zijlichten: 2100,
      borstwering: 1750,
    },
    profiel: { vlak82: 1.0, verdiept120: 1.12, verdiept120hvl: 1.25 },
    dorpels: { alu: 0, kader: -30, dts: 95 },
    m2Tarief: 185,
  })

  const labels: Record<string, Record<string, string>> = {
    basis: {
      voordeur: "Voordeur",
      achterdeur: "Achterdeur",
      dubbel: "Dubbele Deur",
      zijlichten: "Met Zijlichten",
      borstwering: "Met Borstwering",
    },
    profiel: {
      vlak82: "Vlak 82mm (Factor)",
      verdiept120: "Verdiept 120mm (Factor)",
      verdiept120hvl: "Verdiept 120mm HVL (Factor)",
    },
    dorpels: {
      alu: "Aluminium Dorpel",
      kader: "Kader Dorpel",
      dts: "DTS Dorpel",
    },
  }

  const Section = ({
    title,
    description,
    data,
    sectionKey,
  }: {
    title: string
    description: string
    data: Record<string, number>
    sectionKey: string
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-sm text-muted-foreground">
                {labels[sectionKey]?.[key] || key}
              </span>
              <Input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0
                  setDeurData((prev) => ({
                    ...prev,
                    [sectionKey]: {
                      ...(prev[sectionKey as keyof typeof deurData] as Record<string, number>),
                      [key]: val,
                    },
                  }))
                }}
                className="w-28"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deuren Prijzen</h1>
          <p className="text-sm text-muted-foreground">
            Beheer de tarieven voor alle deurtypen en opties.
          </p>
        </div>
        <Button>
          <Save data-icon="inline-start" />
          Opslaan
        </Button>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="Basis Deurtypen"
          description="Startprijzen per deurtype"
          data={deurData.basis}
          sectionKey="basis"
        />
        <Section
          title="Profiel Multipliers"
          description="Factoren voor verschillende profielen"
          data={deurData.profiel}
          sectionKey="profiel"
        />
        <Section
          title="Dorpels & Extra&apos;s"
          description="Toeslagen voor dorpeltypen"
          data={deurData.dorpels}
          sectionKey="dorpels"
        />

        {/* M2 Tarief Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grootte Toeslag</CardTitle>
            <CardDescription>
              Standaard m² tarief voor de berekening
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={deurData.m2Tarief}
              onChange={(e) =>
                setDeurData((prev) => ({
                  ...prev,
                  m2Tarief: parseFloat(e.target.value) || 0,
                }))
              }
              className="text-lg font-semibold"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
