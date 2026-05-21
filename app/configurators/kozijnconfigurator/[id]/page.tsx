"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { saveOfferte } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

const BASE_RATES = {
  materiaal: { kunststof: 280 },
  vakMultiplier: { vast: 0.7, dk: 1.0, kiep: 0.95 },
  glasType: { "hr-2": 120, triple: 180 },
  kleur: { wit: 0, antraciet: 50 },
}

// SVG componenten
const GlassVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="6" y="6" width="88" height="88" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" />
    <line x1="48" y1="50" x2="52" y2="50" stroke="hsl(var(--muted-foreground))" strokeWidth="0.6" />
    <line x1="50" y1="48" x2="50" y2="52" stroke="hsl(var(--muted-foreground))" strokeWidth="0.6" />
  </g>
)

const GlassDK = ({ x, mirror = false }: { x: number; mirror?: boolean }) => (
  <g transform={`translate(${x}, 0) ${mirror ? "scale(-1, 1) translate(-100, 0)" : ""}`}>
    <rect x="6" y="6" width="88" height="88" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" />
    <path d="M12 12 L88 50 L12 88" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
    <rect x="10" y="10" width="80" height="80" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.6" />
    <rect x="85" y="46" width="1.5" height="8" rx="0.5" fill="hsl(var(--foreground))" />
  </g>
)

const GlassKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect x="6" y="6" width="88" height="88" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" />
    <path d="M12 12 L50 88 L88 12" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
    <rect x="10" y="10" width="80" height="80" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.6" />
    <rect x="46" y="8" width="8" height="1.5" rx="0.5" fill="hsl(var(--foreground))" />
  </g>
)

const getKozijnData = (slug: string) => {
  const data = [
    { slug: "vast-kozijn", v: 1, types: ["vast"], name: "Vast kozijn", components: <GlassVast x={0} /> },
    { slug: "draai-kiep-kozijn", v: 1, types: ["dk"], name: "Draai kiep kozijn", components: <GlassDK x={0} /> },
    { slug: "kiep-kozijn", v: 1, types: ["kiep"], name: "Kiep kozijn", components: <GlassKiep x={0} /> },
    { slug: "draai-kiep-vast-kozijn", v: 2, types: ["dk", "vast"], name: "Draai kiep - vast", components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />] },
    { slug: "draai-kiep-draai-stolp-kozijn", v: 2, types: ["dk", "dk"], name: "Draai kiep - Draai kiep", components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} mirror />] },
    { slug: "vast-vast-kozijn", v: 2, types: ["vast", "vast"], name: "Vast - Vast", components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />] },
    { slug: "draai-kiep-vast-draai-kiep-kozijn", v: 3, types: ["dk", "vast", "dk"], name: "Draai kiep - vast - Draai kiep", components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassDK key="3" x={200} mirror />] },
    { slug: "vast-vast-vast-kozijn", v: 3, types: ["vast", "vast", "vast"], name: "Vast - Vast - Vast", components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />] },
    { slug: "vast-draai-kiep-vast-kozijn", v: 3, types: ["vast", "dk", "vast"], name: "Vast - Draai kiep - Vast", components: [<GlassVast key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassVast key="3" x={200} />] },
    { slug: "draai-kiep-vast-vast-draai-kiep-kozijn", v: 4, types: ["dk", "vast", "vast", "dk"], name: "Draai kiep - Vast - Vast - Draai kiep", components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />, <GlassDK key="4" x={300} mirror />] },
    { slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn", v: 4, types: ["dk", "dk", "dk", "dk"], name: "4x Draai kiep", components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassDK key="3" x={200} />, <GlassDK key="4" x={300} />] },
  ]
  return data.find((k) => k.slug === slug) || data[0]
}

export default function ConfiguratorDetail() {
  const { id } = useParams()
  const slug = typeof id === "string" ? id : "vast-kozijn"
  const kozijn = getKozijnData(slug)

  const [breedte, setBreedte] = useState<number>(1000)
  const [hoogte, setHoogte] = useState<number>(1000)
  const [profiel, setProfiel] = useState<string>("verdiept")
  const [kleur, setKleur] = useState<string>("wit")
  const [glas, setGlas] = useState<string>("hr-2")

  const berekendePrijs = useMemo(() => {
    if (!breedte || !hoogte) return 0
    const m2PerVak = (breedte / 1000) * (hoogte / 1000)
    let totaleKozijnPrijs = 0

    kozijn.types.forEach((vakType) => {
      const multiplier = BASE_RATES.vakMultiplier[vakType as keyof typeof BASE_RATES.vakMultiplier] || 1.0
      const vakMateriaalKosten = m2PerVak * BASE_RATES.materiaal.kunststof * multiplier
      const glasTarief = BASE_RATES.glasType[glas as keyof typeof BASE_RATES.glasType] || 120
      const vakGlasKosten = m2PerVak * glasTarief
      const kleurToeslag = BASE_RATES.kleur[kleur as keyof typeof BASE_RATES.kleur] || 0
      totaleKozijnPrijs += vakMateriaalKosten + vakGlasKosten + kleurToeslag
    })

    return parseFloat(totaleKozijnPrijs.toFixed(2))
  }, [breedte, hoogte, kleur, glas, kozijn])

  const geformatteerdePrijs = berekendePrijs.toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/configurators/kozijnen">
            <ArrowLeft data-icon="inline-start" />
            Terug naar overzicht
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Visualisatie */}
          <div className="lg:col-span-7">
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">{kozijn.name}</h1>
            <Card>
              <CardContent className="p-6 md:p-10">
                <div className="aspect-video flex items-center justify-center bg-muted/30 rounded-lg">
                  <svg
                    viewBox={`0 0 ${kozijn.v * 100} 100`}
                    className="w-full h-auto max-h-[300px]"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <rect x="0.4" y="0.4" width={kozijn.v * 100 - 0.8} height="99.2" fill="white" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
                    {Array.from({ length: kozijn.v - 1 }).map((_, i) => (
                      <line key={i} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="100" stroke="hsl(var(--foreground))" strokeWidth="0.8" />
                    ))}
                    {kozijn.components}
                  </svg>
                </div>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Buitenaanzicht schematisch
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulier */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Prijsindicatie</p>
                    <CardTitle className="text-3xl font-light">€ {geformatteerdePrijs}</CardTitle>
                  </div>
                  <Badge variant="secondary">Incl. BTW</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="breedte">Breedte per vak (mm)</Label>
                    <Input
                      id="breedte"
                      type="number"
                      value={breedte}
                      onChange={(e) => setBreedte(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="hoogte">Hoogte (mm)</Label>
                    <Input
                      id="hoogte"
                      type="number"
                      value={hoogte}
                      onChange={(e) => setHoogte(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Profiel</Label>
                    <Select value={profiel} onValueChange={setProfiel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verdiept">Klassiek Verdiept Profiel (120mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Kleur</Label>
                    <Select value={kleur} onValueChange={setKleur}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wit">Wit (Standaard)</SelectItem>
                        <SelectItem value="antraciet">Antraciet structuur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Isolatie</Label>
                    <Select value={glas} onValueChange={setGlas}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr-2">HR++ Glas</SelectItem>
                        <SelectItem value="triple">Triple Glas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={async () => {
                    const data = {
                      kozijnNaam: kozijn.name,
                      breedte,
                      hoogte,
                      profiel,
                      kleur,
                      glas,
                      prijs: berekendePrijs,
                    }
                    await saveOfferte("kozijn", data)
                    alert("Offerte opgeslagen!")
                  }}
                >
                  Voeg toe aan aanvraag
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
