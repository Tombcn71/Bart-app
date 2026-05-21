"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Save } from "lucide-react"

export default function KozijnenPrijzen() {
  const [prijzen, setPrijzen] = useState({
    kunststof: 280,
    vast: 0.7,
    dk: 1.0,
    kiep: 0.95,
    hr2: 120,
    triple: 180,
    wit: 0,
    antraciet: 50,
  })

  const labels: Record<string, string> = {
    kunststof: "Kunststof Basisprijs",
    vast: "Vast Raam (Factor)",
    dk: "Draai/Kiep (Factor)",
    kiep: "Alleen Kiep (Factor)",
    hr2: "HR++ Glas",
    triple: "Triple Glas",
    wit: "Wit (Meerprijs)",
    antraciet: "Antraciet (Meerprijs)",
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Kozijnen Prijzen
          </h1>
          <p className="text-sm text-muted-foreground">
            Beheer de tarieven voor de kozijnen calculator.
          </p>
        </div>
        <Button>
          <Save data-icon="inline-start" />
          Opslaan
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Prijslijst</CardTitle>
          <CardDescription>
            Pas de basis tarieven en factoren aan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Optie</TableHead>
                  <TableHead className="w-[150px]">Prijs / Factor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(prijzen).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">
                      {labels[key] || key}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={value}
                        onChange={(e) =>
                          setPrijzen({
                            ...prijzen,
                            [key]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
