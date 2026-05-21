"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

export default function SchuifpuiPrijzenPagina() {
  const [puiData, setPuiData] = useState({
    basis: { "2-vaks": 1850, "4-vaks": 2950, "Constructie p/m²": 140 },
    profiel: {
      "EvolutionDrive (Factor)": 1.0,
      "EvolutionDrive Plus (Factor)": 1.15,
    },
    glas: {
      "HR++ Dubbel": 90,
      "Dubbel Gelaagd": 165,
      "Triple Gelaagd": 245,
      "Zwarte Afstandshouder": 35,
    },
    kleur: {
      "Wit/Crème (Binnen)": 0,
      "Houtstructuur Wit/Crème (Binnen)": 95,
      "Antraciet (Binnen)": 145,
      "Zwart (Binnen)": 165,
    },
    beslag: {
      "Roeden 6-vaks": 185,
      "Roeden 8-vaks": 245,
      "Rooster Vast Deel": 195,
      "Rooster Alle Delen": 380,
      "Kruk Beide Zijden": 85,
      "Kruk Binnen/Kom Buiten": 115,
    },
  })

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
              <span className="text-sm text-muted-foreground truncate">
                {key}
              </span>
              <Input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0
                  setPuiData((prev) => ({
                    ...prev,
                    [sectionKey]: {
                      ...(prev[sectionKey as keyof typeof puiData] as Record<string, number>),
                      [key]: val,
                    },
                  }))
                }}
                className="w-24 shrink-0"
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
          <h1 className="text-2xl font-bold text-foreground">
            Schuifpui Prijzen
          </h1>
          <p className="text-sm text-muted-foreground">
            Beheer de tarieven voor de schuifpui calculator.
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
          title="Basis & Profiel"
          description="Startprijzen en profielfactoren"
          data={{ ...puiData.basis, ...puiData.profiel }}
          sectionKey="basis"
        />
        <Section
          title="Glas Opties"
          description="Prijzen voor glassoorten"
          data={puiData.glas}
          sectionKey="glas"
        />
        <Section
          title="Kleuren"
          description="Meerprijs voor kleuren (binnen)"
          data={puiData.kleur}
          sectionKey="kleur"
        />
        <Section
          title="Beslag & Roeden"
          description="Extra opties en accessoires"
          data={puiData.beslag}
          sectionKey="beslag"
        />
      </div>
    </div>
  )
}
