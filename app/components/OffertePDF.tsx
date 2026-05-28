import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#333",
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2px solid #1066a3",
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: "contain",
  },
  headerRight: {
    textAlign: "right",
  },
  headerCompany: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 8,
    color: "#666",
    lineHeight: 1.4,
  },
  offerteBox: {
    backgroundColor: "#1066a3",
    padding: "10 16",
    borderRadius: 4,
    marginBottom: 24,
    alignSelf: "flex-end",
    textAlign: "right",
  },
  offerteTitle: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  offerteDate: {
    color: "#cce5f7",
    fontSize: 8,
    marginTop: 2,
  },
  twoCol: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 24,
  },
  col: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "1px solid #e2e8f0",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: "1px solid #f1f5f9",
  },
  label: {
    width: "45%",
    color: "#666",
  },
  value: {
    width: "55%",
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  subsidieBox: {
    backgroundColor: "#e0f2fe",
    border: "1.5px solid #1066a3",
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
  },
  subsidieTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    marginBottom: 4,
  },
  subsidieAmount: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    marginVertical: 4,
  },
  subsidieSub: {
    fontSize: 7,
    color: "#666",
    fontStyle: "italic",
  },
  priceBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabelBig: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  priceAmount: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    padding: 10,
    border: "1px solid #e2e8f0",
  },
  infoBoxTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1066a3",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoBoxText: {
    fontSize: 8,
    color: "#444",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 12,
    borderTop: "1px solid #e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#999",
  },
  signatureBox: {
    marginTop: 30,
    borderTop: "1px solid #333",
    paddingTop: 6,
    width: 200,
  },
  signatureLabel: {
    fontSize: 7,
    color: "#666",
  },
});

interface OffertePDFProps {
  data: any;
  email: string;
  offerteNummer: string;
  datum: string;
  subsidie: number;
}

export function OffertePDF({ data, email, offerteNummer, datum, subsidie }: OffertePDFProps) {
  const productNaam = data.product || data.kozijnNaam || "Product";

  const specs = [
    data.breedte && { label: "Breedte", value: `${data.breedte} mm` },
    data.hoogte && { label: "Hoogte", value: `${data.hoogte} mm` },
    data.kleur && { label: "Kleur binnenzijde", value: data.kleur },
    data.kleurBuitenkant && { label: "Kleur buitenzijde", value: data.kleurBuitenkant },
    data.glas && { label: "Glas", value: data.glas },
    data.profiel && { label: "Profiel", value: data.profiel },
    data.aanslag && { label: "Aanslag", value: data.aanslag },
    data.afstandshouder && { label: "Afstandshouder", value: data.afstandshouder },
    data.roeden && { label: "Roeden", value: data.roeden },
    data.draairichting && { label: "Draairichting", value: data.draairichting },
    data.ventilatierooster && { label: "Ventilatierooster", value: data.ventilatierooster },
    data.voorboren && { label: "Voorboren", value: data.voorboren },
    data.aantal && { label: "Aantal", value: `${data.aantal} stuks` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1066a3" }}>BartMooi B.V.</Text>
            <Text style={styles.headerSub}>Burgemeester Hovylaan 157{"\n"}2552 XB 's-Gravenhage{"\n"}Nederland</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.offerteBox}>
              <Text style={styles.offerteTitle}>Offerte {offerteNummer}</Text>
              <Text style={styles.offerteDate}>{datum}</Text>
            </View>
          </View>
        </View>

        {/* KLANT + PRODUCT */}
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Klant</Text>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 3 }}>{data.naam || ""}</Text>
            <Text style={{ color: "#666", fontSize: 8 }}>{email}</Text>
            {data.telefoon && <Text style={{ color: "#666", fontSize: 8 }}>{data.telefoon}</Text>}
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Product</Text>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: "#1066a3" }}>{productNaam}</Text>
          </View>
        </View>

        {/* SPECIFICATIES */}
        <Text style={styles.sectionTitle}>Configuratie specificaties</Text>
        <View style={{ marginBottom: 20 }}>
          {specs.map((spec, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.label}>{spec.label}</Text>
              <Text style={styles.value}>{spec.value}</Text>
            </View>
          ))}
        </View>

        {/* PRIJS */}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabelBig}>Totaalprijs (incl. BTW)</Text>
          <Text style={styles.priceAmount}>
            € {data.prijs?.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* SUBSIDIE */}
        {subsidie > 0 && (
          <View style={styles.subsidieBox}>
            <Text style={styles.subsidieTitle}>Subsidiekans — ISDE Regeling</Text>
            <Text style={{ fontSize: 8, color: "#444", marginBottom: 4 }}>
              Op basis van uw configuratie komt u mogelijk in aanmerking voor:
            </Text>
            <Text style={styles.subsidieAmount}>€ {subsidie.toLocaleString("nl-NL")}</Text>
            <Text style={styles.subsidieSub}>
              Indicatie op basis van de huidige ISDE-regeling (bij 2+ isolatiemaatregelen).
            </Text>
          </View>
        )}

        {/* INFO VAKJES */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Betaling</Text>
            <Text style={styles.infoBoxText}>
              30% bij akkoord{"\n"}40% bij aanvang werkzaamheden{"\n"}30% na oplevering
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Levertijd</Text>
            <Text style={styles.infoBoxText}>Ongeveer 6 weken na aanbetaling</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Garantie</Text>
            <Text style={styles.infoBoxText}>
              Kozijnen & glas: 10 jaar{"\n"}Hang- en sluitwerk: 5 jaar{"\n"}Ventilatieroosters: 2 jaar
            </Text>
          </View>
        </View>

        {/* IN DE PRIJS */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>In de prijs inbegrepen</Text>
          <Text style={{ fontSize: 8, color: "#444", lineHeight: 1.6 }}>
            • Verwijderen en afvoeren bestaande kozijnen{"\n"}
            • Plaatsen nieuwe kozijnen met HR+++ glas{"\n"}
            • Water- en winddicht buiten afwerking{"\n"}
            • Binnen afwerking (zonder schilderwerk) met wit PVC vensterbanken
          </Text>
        </View>

        {/* HANDTEKENING */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Handtekening klant</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BartMooi B.V. — Burgemeester Hovylaan 157, 2552 XB 's-Gravenhage</Text>
          <Text style={styles.footerText}>Offerte {offerteNummer} — {datum}</Text>
        </View>

      </Page>
    </Document>
  );
}
