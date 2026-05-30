"use server";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "path";
import fs from "fs";
import { getSvgString } from "@/lib/renderSvgForPdf";
import { svgToPng } from "./svg-to-png";

const BLUE  = "#1066a3";
const DARK  = "#1a1a1a";
const GREY  = "#64748b";
const LIGHT = "#f8fafc";
const BORDER = "#e2e8f0";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    paddingTop: 0,
    paddingBottom: 64,
    paddingHorizontal: 0,
  },

  // ── Header banner ──────────────────────────────────────────────────────────
  headerBand: {
    backgroundColor: BLUE,
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 42,
    objectFit: "contain",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerDate: {
    fontSize: 10,
    color: "white",
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },

  // ── Body ───────────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 40,
    paddingTop: 28,
  },

  greeting: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 6,
  },
  intro: {
    fontSize: 10,
    lineHeight: 1.7,
    color: GREY,
    marginBottom: 22,
    maxWidth: 460,
  },

  // ── Section ────────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionBar: {
    width: 3,
    height: 14,
    backgroundColor: BLUE,
    marginRight: 8,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },

  // ── Specs card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  lastRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  label: {
    width: 150,
    fontSize: 9.5,
    color: GREY,
  },
  value: {
    flex: 1,
    fontSize: 9.5,
    color: DARK,
    fontFamily: "Helvetica-Bold",
  },

  // ── Prijs + subsidie ───────────────────────────────────────────────────────
  priceRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  priceBox: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 8.5,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "white",
  },
  subsidieBox: {
    flex: 1,
    backgroundColor: "#e0f2fe",
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
  },
  subsidieLabel: {
    fontSize: 8.5,
    color: BLUE,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  subsidieAmount: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
  },
  subsidieNote: {
    fontSize: 7.5,
    color: GREY,
    marginTop: 3,
    textAlign: "center",
  },

  // ── Tekening ───────────────────────────────────────────────────────────────
  drawingBox: {
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 12,
    backgroundColor: "white",
  },
  drawingCaption: {
    fontSize: 7.5,
    color: "#aaa",
    marginTop: 6,
  },

  // ── Bullets ────────────────────────────────────────────────────────────────
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bulletDot: {
    width: 14,
    fontSize: 9.5,
    color: BLUE,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: DARK,
    lineHeight: 1.5,
  },

  // ── Garantie ───────────────────────────────────────────────────────────────
  warrantyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  warrantyLabel: {
    fontSize: 9.5,
    color: DARK,
  },
  warrantyValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: "#aaa",
  },
});

interface OfferteData {
  naam?: string;
  product?: string;
  kozijnNaam?: string;
  deurNaam?: string;
  slug?: string;
  breedte?: number;
  hoogte?: number;
  kleur?: string;
  glas?: string;
  glasType?: string;
  aantal?: number;
  prijs?: number;
  subsidieIndicatie?: number;
}

export async function generateOffertePdf(_email: string, data: OfferteData): Promise<Buffer> {
  const logoPath = path.join(process.cwd(), "public", "bartmooi-logo-1.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  let kozijnPng: string | null = null;
  if (data.slug) {
    const svgStr = getSvgString(data.slug, data.breedte, data.hoogte);
    if (svgStr) {
      const pngBuf = await svgToPng(svgStr, 600);
      kozijnPng = `data:image/png;base64,${pngBuf.toString("base64")}`;
    }
  }

  const productNaam = data.product || data.kozijnNaam || data.deurNaam || "product";
  const naam = data.naam || "Geachte klant";
  const glasLabel = data.glasType || data.glas || null;
  const datum = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header banner ── */}
        <View style={styles.headerBand}>
          <Image src={logoBase64} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.headerLabel}>Offerte aanvraag</Text>
            <Text style={styles.headerDate}>{datum}</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* ── Aanhef ── */}
          <Text style={styles.greeting}>Geachte {naam},</Text>
          <Text style={styles.intro}>
            Hartelijk dank voor uw aanvraag voor een <Text style={{ fontFamily: "Helvetica-Bold", color: DARK }}>{productNaam}</Text>. Wij hebben uw aanvraag in goede orde ontvangen en zijn verheugd u onderstaande offerte aan te bieden.
          </Text>

          {/* ── Prijs + subsidie ── */}
          <View style={styles.priceRow}>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Prijsindicatie</Text>
              <Text style={styles.priceAmount}>
                € {data.prijs?.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.subsidieNote, { color: "rgba(255,255,255,0.6)" }]}>excl. btw · indicatie</Text>
            </View>
            {data.subsidieIndicatie && data.subsidieIndicatie > 0 ? (
              <View style={styles.subsidieBox}>
                <Text style={styles.subsidieLabel}>ISDE subsidie-indicatie</Text>
                <Text style={styles.subsidieAmount}>
                  ≈ € {data.subsidieIndicatie.toLocaleString("nl-NL")}
                </Text>
                <Text style={styles.subsidieNote}>indicatie — afhankelijk van uw situatie</Text>
              </View>
            ) : null}
          </View>

          {/* ── Specificaties ── */}
          <SectionHeader title={`Uw aanvraag — ${productNaam}`} />
          <View style={styles.card}>
            {data.breedte && data.hoogte && (
              <View style={styles.row}>
                <Text style={styles.label}>Maat (B × H)</Text>
                <Text style={styles.value}>{data.breedte} mm × {data.hoogte} mm</Text>
              </View>
            )}
            {data.kleur && (
              <View style={styles.row}>
                <Text style={styles.label}>Kleur</Text>
                <Text style={styles.value}>{data.kleur}</Text>
              </View>
            )}
            {glasLabel && (
              <View style={styles.row}>
                <Text style={styles.label}>Glas</Text>
                <Text style={styles.value}>{glasLabel}</Text>
              </View>
            )}
            <View style={styles.lastRow}>
              <Text style={styles.label}>Aantal</Text>
              <Text style={styles.value}>{data.aantal} stuks</Text>
            </View>
          </View>

          {/* ── Technische tekening ── */}
          {kozijnPng && (
            <View style={styles.drawingBox}>
              <Image src={kozijnPng} style={{ width: 200, objectFit: "contain" }} />
              <Text style={styles.drawingCaption}>Schematische weergave — niet op schaal</Text>
            </View>
          )}

          {/* ── Inbegrepen ── */}
          <SectionHeader title="In de prijs inbegrepen" />
          <View style={styles.card}>
            {[
              "Verwijderen en afvoeren van de bestaande kozijnen.",
              "Plaatsen van nieuwe kozijnen met HR+++ glas.",
              "Water- en winddichte buiten afwerking.",
              "Binnen afwerking (zonder schilderwerk) met witte PVC vensterbanken.",
            ].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>›</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* ── Betaling ── */}
          <SectionHeader title="Betaling & levertijd" />
          <View style={styles.card}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>›</Text>
              <Text style={styles.bulletText}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Betaling: </Text>
                30% direct na akkoord · 40% bij aanvang · 30% na oplevering.
              </Text>
            </View>
            <View style={[styles.bulletRow, { marginBottom: 0 }]}>
              <Text style={styles.bulletDot}>›</Text>
              <Text style={styles.bulletText}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>Levertijd: </Text>
                Ongeveer 6 weken na aanbetaling.
              </Text>
            </View>
          </View>

          {/* ── Garantie ── */}
          <SectionHeader title="Garantie" />
          <View style={styles.card}>
            {([
              ["Kozijnen & isolatieglas", "10 jaar"],
              ["Hang- en sluitwerk", "5 jaar"],
              ["Ventilatieroosters", "2 jaar"],
            ] as [string, string][]).map(([label, years], i, arr) => (
              <View key={i} style={i < arr.length - 1 ? styles.warrantyRow : { ...styles.warrantyRow, borderBottomWidth: 0 }}>
                <Text style={styles.warrantyLabel}>{label}</Text>
                <Text style={styles.warrantyValue}>{years}</Text>
              </View>
            ))}
          </View>

        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BARTMOOI B.V. · Burgemeester Hovylaan 157 · 2552 XB Den Haag</Text>
          <Text style={styles.footerText}>info@offerte-bartmooi.nl</Text>
        </View>

      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
