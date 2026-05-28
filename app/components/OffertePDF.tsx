import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const BLAUW = "#1066a3";
const LICHTBLAUW = "#e0f2fe";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#222", padding: 40, backgroundColor: "#fff" },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${BLAUW}` },
  logo: { width: 140, height: 48, objectFit: "contain" },
  headerRight: { textAlign: "right" },
  companyName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: BLAUW },
  companyInfo: { fontSize: 8, color: "#555", lineHeight: 1.5, marginTop: 2 },

  // Offerte badge
  offerteBadge: { backgroundColor: BLAUW, padding: "8 14", borderRadius: 4, marginBottom: 4 },
  offerteNr: { color: "#fff", fontSize: 11, fontFamily: "Helvetica-Bold" },
  offerteDatum: { color: "#cce5f7", fontSize: 8, marginTop: 2 },

  // Klant blok
  klantBox: { backgroundColor: "#f8fafc", border: `1px solid #e2e8f0`, borderRadius: 4, padding: "10 14", marginBottom: 20 },
  klantTitel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: BLAUW, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  klantNaam: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a1a1a", marginBottom: 2 },
  klantInfo: { fontSize: 8, color: "#555", lineHeight: 1.5 },

  // Sectie
  sectionTitle: { fontSize: 7, fontFamily: "Helvetica-Bold", color: BLAUW, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, paddingBottom: 3, borderBottom: `1px solid #e2e8f0` },

  // Specs tabel
  specRow: { flexDirection: "row", paddingVertical: 5, borderBottom: `1px solid #f1f5f9` },
  specLabel: { width: "42%", color: "#666", fontSize: 8 },
  specValue: { width: "58%", fontFamily: "Helvetica-Bold", color: "#1a1a1a", fontSize: 8 },

  // Prijs
  prijsBox: { backgroundColor: BLAUW, borderRadius: 4, padding: "12 16", marginTop: 16, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  prijsLabel: { color: "#cce5f7", fontSize: 9 },
  prijsBedrag: { color: "#fff", fontSize: 20, fontFamily: "Helvetica-Bold" },

  // Subsidie
  subsidieBox: { backgroundColor: LICHTBLAUW, border: `1.5px solid ${BLAUW}`, borderRadius: 4, padding: "10 14", marginBottom: 16 },
  subsidieTitel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: BLAUW, marginBottom: 3 },
  subsidieBedrag: { fontSize: 18, fontFamily: "Helvetica-Bold", color: BLAUW, marginVertical: 3 },
  subsidieSub: { fontSize: 7, color: "#555", fontStyle: "italic" },

  // Info grid
  infoGrid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  infoBox: { flex: 1, backgroundColor: "#f8fafc", border: `1px solid #e2e8f0`, borderRadius: 4, padding: "8 10" },
  infoTitel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: BLAUW, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  infoTekst: { fontSize: 7.5, color: "#444", lineHeight: 1.6 },

  // Handtekening
  handtekeningBox: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20, marginBottom: 20 },
  handtekeningLijn: { borderTop: `1px solid #333`, width: 180, paddingTop: 4 },
  handtekeningLabel: { fontSize: 7, color: "#666" },

  // Footer
  footer: { marginTop: "auto", paddingTop: 10, borderTop: `1px solid #e2e8f0`, flexDirection: "row", justifyContent: "space-between" },
  footerTekst: { fontSize: 7, color: "#aaa" },
});

interface Props {
  data: any;
  email: string;
  offerteNummer: string;
  datum: string;
  subsidie: number;
  logoBase64: string;
}

export function OffertePDF({ data, email, offerteNummer, datum, subsidie, logoBase64 }: Props) {
  const product = data.product || data.kozijnNaam || "Product";

  const specs: { label: string; value: string }[] = [
    data.breedte      && { label: "Breedte",              value: `${data.breedte} mm` },
    data.hoogte       && { label: "Hoogte",               value: `${data.hoogte} mm` },
    data.breedte && data.hoogte && { label: "Binnenwerkse maat", value: `${data.breedte - 54} × ${data.hoogte - 54} mm` },
    data.kleur        && { label: "Kleur binnenzijde",    value: data.kleur },
    data.kleurBuitenkant && { label: "Kleur buitenzijde", value: data.kleurBuitenkant },
    data.glas         && { label: "Glas",                 value: data.glas },
    data.profiel      && { label: "Profiel",              value: data.profiel },
    data.aanslag      && { label: "Aanslag",              value: data.aanslag },
    data.afstandshouder && { label: "Afstandshouder",     value: data.afstandshouder },
    data.roeden       && { label: "Roeden",               value: data.roeden },
    data.draairichting && { label: "Draairichting",       value: data.draairichting },
    data.ventilatierooster && { label: "Ventilatierooster", value: data.ventilatierooster },
    data.voorboren    && { label: "Voorboren",            value: data.voorboren },
    data.aantal       && { label: "Aantal",               value: `${data.aantal} stuks` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Document title={`Offerte ${offerteNummer}`} author="BartMooi B.V.">
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <Image src={`data:image/png;base64,${logoBase64}`} style={styles.logo} />
          <View style={styles.headerRight}>
            <View style={styles.offerteBadge}>
              <Text style={styles.offerteNr}>{offerteNummer}</Text>
              <Text style={styles.offerteDatum}>{datum}</Text>
            </View>
            <Text style={styles.companyName}>BartMooi B.V.</Text>
            <Text style={styles.companyInfo}>
              Burgemeester Hovylaan 157{"\n"}
              2552 XB 's-Gravenhage{"\n"}
              Nederland{"\n"}
              info@bartmooi.nl
            </Text>
          </View>
        </View>

        {/* KLANT */}
        <View style={styles.klantBox}>
          <Text style={styles.klantTitel}>Klant</Text>
          <Text style={styles.klantNaam}>{data.naam || ""}</Text>
          <Text style={styles.klantInfo}>
            {email}
            {data.telefoon ? `\n${data.telefoon}` : ""}
          </Text>
        </View>

        {/* PRODUCT TITEL */}
        <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
          Product — {product}
        </Text>

        {/* SPECIFICATIES */}
        <Text style={styles.sectionTitle}>Configuratie specificaties</Text>
        <View style={{ marginBottom: 4 }}>
          {specs.map((s, i) => (
            <View key={i} style={[styles.specRow, i % 2 === 0 ? { backgroundColor: "#f8fafc" } : {}]}>
              <Text style={styles.specLabel}>{s.label}</Text>
              <Text style={styles.specValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* PRIJS */}
        <View style={styles.prijsBox}>
          <Text style={styles.prijsLabel}>Totaalprijs (incl. 21% BTW)</Text>
          <Text style={styles.prijsBedrag}>
            € {data.prijs?.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* SUBSIDIE */}
        {subsidie > 0 && (
          <View style={styles.subsidieBox}>
            <Text style={styles.subsidieTitel}>Subsidiekans — ISDE Regeling</Text>
            <Text style={{ fontSize: 8, color: "#444", marginBottom: 4 }}>
              Op basis van uw configuratie komt u mogelijk in aanmerking voor:
            </Text>
            <Text style={styles.subsidieBedrag}>€ {subsidie.toLocaleString("nl-NL")}</Text>
            <Text style={styles.subsidieSub}>
              Indicatie op basis van de huidige ISDE-regeling (bij 2+ isolatiemaatregelen).
            </Text>
          </View>
        )}

        {/* IN DE PRIJS */}
        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>In de prijs inbegrepen</Text>
        <Text style={{ fontSize: 8, color: "#444", lineHeight: 1.7, marginBottom: 16 }}>
          {"• Verwijderen en afvoeren bestaande kozijnen\n"}
          {"• Plaatsen nieuwe kozijnen met HR+++ glas\n"}
          {"• Water- en winddicht buiten afwerking\n"}
          {"• Binnen afwerking (zonder schilderwerk) met wit PVC vensterbanken"}
        </Text>

        {/* INFO GRID */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitel}>Betaling</Text>
            <Text style={styles.infoTekst}>
              {"30% bij akkoord\n40% bij aanvang\n30% na oplevering"}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitel}>Levertijd</Text>
            <Text style={styles.infoTekst}>Ca. 6 weken na aanbetaling</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitel}>Garantie</Text>
            <Text style={styles.infoTekst}>
              {"Kozijnen & glas: 10 jaar\nHang- en sluitwerk: 5 jaar\nVentilatieroosters: 2 jaar"}
            </Text>
          </View>
        </View>

        {/* HANDTEKENING */}
        <Text style={{ fontSize: 8, color: "#555", marginBottom: 16 }}>
          Ondergetekende verklaart zich akkoord met de inhoud van deze offerte.
        </Text>
        <View style={styles.handtekeningBox}>
          <View style={styles.handtekeningLijn}>
            <Text style={styles.handtekeningLabel}>Handtekening klant</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerTekst}>BartMooi B.V. · Burgemeester Hovylaan 157 · 2552 XB 's-Gravenhage · Nederland</Text>
          <Text style={styles.footerTekst}>{offerteNummer} · {datum}</Text>
        </View>

      </Page>
    </Document>
  );
}
