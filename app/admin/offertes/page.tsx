"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil } from "lucide-react"

const initialOffertes = [
  {
    id: "OFF-2026-001",
    klant: "Jan de Vries",
    type: "Kozijnen",
    status: "Nieuw",
    datum: "20 mei 2026",
    bedrag: "€ 2.450",
  },
  {
    id: "OFF-2026-002",
    klant: "Pieter Bakker",
    type: "Schuifpui",
    status: "In behandeling",
    datum: "19 mei 2026",
    bedrag: "€ 4.100",
  },
  {
    id: "OFF-2026-003",
    klant: "Anja Meijer",
    type: "Deuren",
    status: "Verzonden",
    datum: "18 mei 2026",
    bedrag: "€ 1.850",
  },
]

function getStatusVariant(status: string) {
  switch (status) {
    case "Nieuw":
      return "default"
    case "In behandeling":
      return "secondary"
    case "Verzonden":
      return "outline"
    default:
      return "secondary"
  }
}

export default function OffertesPagina() {
  const [offertes] = useState(initialOffertes)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offertes</h1>
          <p className="text-sm text-muted-foreground">
            Beheer al je klantoffertes op één plek.
          </p>
        </div>
        <Button>
          <Plus data-icon="inline-start" />
          Nieuwe Offerte
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Offertes</CardTitle>
          <CardDescription>
            Overzicht van alle aangevraagde offertes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Klant</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Bedrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offertes.map((offerte) => (
                  <TableRow key={offerte.id}>
                    <TableCell className="font-medium">{offerte.id}</TableCell>
                    <TableCell>{offerte.klant}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {offerte.type}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {offerte.bedrag}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(offerte.status)}>
                        {offerte.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Pencil data-icon="inline-start" />
                        <span className="hidden sm:inline">Bewerken</span>
                      </Button>
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
