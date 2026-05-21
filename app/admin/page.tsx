"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { FileText, Users, TrendingUp, ExternalLink } from "lucide-react"

const offertes = [
  {
    id: "OFF-2026-001",
    klant: "Jan de Vries",
    type: "Kozijnen",
    status: "Nieuw",
    datum: "20 mei 2026",
  },
  {
    id: "OFF-2026-002",
    klant: "Pieter Bakker",
    type: "Schuifpui",
    status: "In behandeling",
    datum: "19 mei 2026",
  },
  {
    id: "OFF-2026-003",
    klant: "Anja Meijer",
    type: "Deuren",
    status: "Verzonden",
    datum: "18 mei 2026",
  },
  {
    id: "OFF-2026-004",
    klant: "Bart Schouten",
    type: "Kozijnen",
    status: "Nieuw",
    datum: "17 mei 2026",
  },
]

const stats = [
  {
    title: "Nieuwe Leads",
    value: "21",
    icon: Users,
  },
  {
    title: "Totaal Offertes",
    value: "148",
    icon: FileText,
  },
  {
    title: "Geconverteerd",
    value: "64%",
    icon: TrendingUp,
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

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welkom terug!</p>
        </div>
        <Button asChild>
          <a
            href="https://offerte.budgetkozijnenshop.nl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink data-icon="inline-start" />
            Bekijk App
          </a>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Offertes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recente Offertes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Klant</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Datum</TableHead>
                  <TableHead>Status</TableHead>
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
                      {offerte.datum}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(offerte.status)}>
                        {offerte.status}
                      </Badge>
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
