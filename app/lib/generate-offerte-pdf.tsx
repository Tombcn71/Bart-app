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

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333",
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#1066a3",
    paddingBottom: 16,
  },
  companyInfo: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.5,
  },
  companyName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    marginBottom: 4,
  },
  logo: {
    width: 140,
    height: 50,
    objectFit: "contain",
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    marginBottom: 12,
  },
  intro: {
    fontSize: 10,
    lineHeight: 1.7,
    color: "#444",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    marginBottom: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 140,
    fontSize: 10,
    color: "#666",
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: "#333",
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginVertical: 16,
  },
  conditionsBlock: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 4,
    marginTop: 8,
  },
  conditionItem: {
    fontSize: 9.5,
    color: "#444",
    marginBottom: 5,
    lineHeight: 1.5,
  },
  bullet: {
    color: "#1066a3",
    marginRight: 4,
  },
  warrantyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  warrantyLabel: {
    fontSize: 9.5,
    color: "#444",
    flex: 1,
  },
  warrantyValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#333",
    width: 80,
    textAlign: "right",
  },
  paymentBlock: {
    marginTop: 12,
    fontSize: 9.5,
    color: "#444",
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#999",
  },
});

interface OfferteData {
  naam?: string;
  product?: string;
  kozijnNaam?: string;
  slug?: string;
  breedte?: number;
  hoogte?: number;
  kleur?: string;
  glas?: string;
  aantal?: number;
  prijs?: number;
  subsidieIndicatie?: number;
}

export async function generateOffertePdf(
  _email: string,
  data: OfferteData
): Promise<Buffer> {
  const logoPath = path.join(process.cwd(), "public", "bartmooi-logo-1.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  // Kozijntekening: SVG → PNG (geen SVG in de PDF, veilig voor email)
  let kozijnPng: string | null = null;
  if (data.slug) {
    const svgStr = getSvgString(data.slug);
    if (svgStr) {
      const pngBuf = await svgToPng(svgStr, 500);
      kozijnPng = `data:image/png;base64,${pngBuf.toString("base64")}`;
    }
  }

  const productNaam = data.product || data.kozijnNaam || "kozijn";
  const naam = data.naam || "geachte klant";
  const datum = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>BARTMOOI B.V.</Text>
            <Text style={styles.companyInfo}>
              Burgemeester Hovylaan 157{"\n"}
              2552 XB Den Haag{"\n"}
              Nederland{"\n"}
              info@offerte-bartmooi.nl
            </Text>
          </View>
          <Image src={logoBase64} style={styles.logo} />
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>
          Geachte {naam},{"\n"}
        </Text>

        {/* Intro */}
        <Text style={styles.intro}>
          Hartelijk dank voor uw interesse in onze kozijnen en deuren. Wij
          hebben uw aanvraag in goede orde ontvangen en zijn verheugd u een
          offerte te kunnen aanbieden.{"\n\n"}
          Hieronder vindt u de specificaties van uw aanvraag, gevolgd door onze
          algemene voorwaarden en garantiebepalingen. Wij staan uiteraard open
          voor vragen of een vrijblijvend adviesgesprek.
        </Text>

        {/* Specifications */}
        <Text style={styles.sectionTitle}>Uw aanvraag — {productNaam}</Text>

        <View style={styles.conditionsBlock}>
          <View style={styles.row}>
            <Text style={styles.label}>Maat (B × H)</Text>
            <Text style={styles.value}>
              {data.breedte} mm × {data.hoogte} mm
            </Text>
          </View>
          {data.kleur && (
            <View style={styles.row}>
              <Text style={styles.label}>Kleur</Text>
              <Text style={styles.value}>{data.kleur}</Text>
            </View>
          )}
          {data.glas && (
            <View style={styles.row}>
              <Text style={styles.label}>Glas</Text>
              <Text style={styles.value}>{data.glas}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Aantal</Text>
            <Text style={styles.value}>{data.aantal} stuks</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Prijsindicatie</Text>
            <Text style={[styles.value, { fontFamily: "Helvetica-Bold" }]}>
              €{" "}
              {data.prijs?.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
          {data.subsidieIndicatie && data.subsidieIndicatie > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Subsidiekans (ISDE)</Text>
              <Text style={[styles.value, { color: "#1066a3" }]}>
                ≈ € {data.subsidieIndicatie.toLocaleString("nl-NL")} indicatie
              </Text>
            </View>
          )}
        </View>

        {/* Kozijntekening als PNG */}
        {kozijnPng && (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <Image src={kozijnPng} style={{ width: 180, objectFit: "contain" }} />
            <Text style={{ fontSize: 7, color: "#aaa", marginTop: 4 }}>
              Schematische weergave — niet op schaal
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* What's included */}
        <Text style={styles.sectionTitle}>In de prijs inbegrepen</Text>
        <View style={styles.conditionsBlock}>
          {[
            "Verwijderen en afvoeren van de bestaande kozijnen.",
            "Plaatsen van nieuwe kozijnen met HR+++ glas.",
            "Water- en winddichte buiten afwerking.",
            "Binnen afwerking (zonder schilderwerk) met witte PVC vensterbanken.",
          ].map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.conditionItem}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Payment */}
        <Text style={styles.sectionTitle}>Betaling & levertijd</Text>
        <View style={styles.conditionsBlock}>
          <Text style={styles.paymentBlock}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Betaling: </Text>
            30% direct na akkoord · 40% bij aanvang van de werkzaamheden · 30%
            na oplevering.{"\n\n"}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Levertijd: </Text>
            Ongeveer 6 weken na aanbetaling.
          </Text>
        </View>

        {/* Warranty */}
        <Text style={styles.sectionTitle}>Garantie</Text>
        <View style={styles.conditionsBlock}>
          {[
            ["Kozijnen & isolatieglas", "10 jaar"],
            ["Hang- en sluitwerk", "5 jaar"],
            ["Ventilatieroosters", "2 jaar"],
          ].map(([label, years], i) => (
            <View key={i} style={styles.warrantyRow}>
              <Text style={styles.warrantyLabel}>{label}</Text>
              <Text style={styles.warrantyValue}>{years}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BARTMOOI B.V. · Den Haag</Text>
          <Text style={styles.footerText}>{datum}</Text>
          <Text style={styles.footerText}>info@offerte-bartmooi.nl</Text>
        </View>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
