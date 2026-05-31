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

const DARK = "#1a1a1a";
const GREY = "#64748b";
const LIGHT_GREY = "#f1f5f9";
const LINE = "#d1d5db";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    paddingTop: 44,
    paddingBottom: 72,
    paddingHorizontal: 48,
    backgroundColor: "white",
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  logo: {
    width: 130,
    height: 46,
    objectFit: "contain",
  },
  companyBlock: {
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 3,
  },
  companyInfo: {
    fontSize: 8.5,
    color: GREY,
    lineHeight: 1.5,
    textAlign: "right",
  },

  // ── Divider ────────────────────────────────────────────────────────────────
  divider: {
    borderTopWidth: 1,
    borderTopColor: LINE,
    marginBottom: 22,
  },
  thinDivider: {
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY,
    marginVertical: 10,
  },

  // ── Offerte titel ──────────────────────────────────────────────────────────
  offerteBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  offerteTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    letterSpacing: -0.5,
  },
  offerteSubtitle: {
    fontSize: 10,
    color: GREY,
    marginTop: 3,
  },
  dateBlock: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 8.5,
    color: GREY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 2,
  },

  // ── Klant info ─────────────────────────────────────────────────────────────
  clientBlock: {
    marginBottom: 22,
  },
  clientName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 1,
  },
  clientInfo: {
    fontSize: 9,
    color: GREY,
    lineHeight: 1.5,
  },

  // ── Section ────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 20,
  },

  // ── Specs tabel ────────────────────────────────────────────────────────────
  specRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY,
  },
  specLabel: {
    width: 160,
    fontSize: 9.5,
    color: GREY,
  },
  specValue: {
    flex: 1,
    fontSize: 9.5,
    color: DARK,
  },
  specValueBold: {
    flex: 1,
    fontSize: 9.5,
    color: DARK,
    fontFamily: "Helvetica-Bold",
  },

  // ── Tekening ───────────────────────────────────────────────────────────────
  drawingWrapper: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 18,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: LINE,
  },
  drawingImage: {
    width: 420,
    objectFit: "contain",
  },
  drawingCaption: {
    fontSize: 7.5,
    color: "#aaa",
    marginTop: 8,
  },

  // ── Bullets ────────────────────────────────────────────────────────────────
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 9.5,
    color: DARK,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: DARK,
    lineHeight: 1.55,
  },

  // ── Betaling 2-kolommen ────────────────────────────────────────────────────
  twoCol: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  colBlock: {
    flex: 1,
  },
  colLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: GREY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  colText: {
    fontSize: 9.5,
    color: DARK,
    lineHeight: 1.6,
  },

  // ── Handtekening ───────────────────────────────────────────────────────────
  signBlock: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  signTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 6,
  },
  signIntro: {
    fontSize: 9.5,
    color: GREY,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  signFields: {
    flexDirection: "row",
    gap: 24,
  },
  signField: {
    flex: 1,
  },
  signLabel: {
    fontSize: 8,
    color: GREY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: DARK,
    marginBottom: 4,
  },
  signLineLabel: {
    fontSize: 7.5,
    color: GREY,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY,
    paddingTop: 7,
  },
  footerText: {
    fontSize: 7.5,
    color: "#aaa",
  },
});

interface OfferteData {
  naam?: string;
  woonplaats?: string;
  product?: string;
  kozijnNaam?: string;
  deurNaam?: string;
  materiaal?: string;
  slug?: string;
  breedte?: number;
  hoogte?: number;
  kleur?: string;
  kleurBuitenkant?: string;
  glas?: string;
  glasType?: string;
  beslag?: string;
  paneel?: string;
  profiel?: string;
  onderdorpel?: string;
  draairichting?: string;
  afstandshouder?: string;
  roeden?: string;
  bediening?: string;
  aantal?: number;
  prijs?: number;
  subsidieIndicatie?: number;
  offerteId?: string;
  items?: CartItemData[];
}

interface CartItemData {
  slug: string;
  product: string;
  specs: Record<string, string | number>;
  prijs: number;
}

function clean(s?: string) {
  if (!s) return null;
  return s.replace(/-/g, " ").replace(/creon /gi, "").trim();
}

const SPEC_LABELS: Record<string, string> = {
  materiaal: "Materiaal",
  glas: "Type glas",
  glasType: "Type glas",
  kleur: "Kleur binnenkant",
  kleurBuitenkant: "Kleur buitenkant",
  paneel: "Paneel",
  profiel: "Profiel",
  beslag: "Beslag",
  onderdorpel: "Onderdorpel",
  draairichting: "Draairichting",
  afstandshouder: "Afstandshouder",
  roeden: "Roeden",
  bediening: "Bediening",
  aanslag: "Aanslag",
  ventilatieRooster: "Ventilatieroosters",
  voorboren: "Voorboren",
};

// Bouwt nette spec-regels uit een cart-item specs object
function buildItemSpecs(specs: Record<string, string | number>): [string, string][] {
  const out: [string, string][] = [];
  if (specs.breedte && specs.hoogte) out.push(["Maat (B × H)", `${specs.breedte} mm × ${specs.hoogte} mm`]);
  for (const [key, label] of Object.entries(SPEC_LABELS)) {
    const v = specs[key];
    if (v !== undefined && v !== null && v !== "") out.push([label, clean(String(v)) || String(v)]);
  }
  if (specs.aantal) out.push(["Aantal", `${specs.aantal} stuks`]);
  return out;
}

export async function generateOffertePdf(_email: string, data: OfferteData): Promise<Buffer> {
  const logoPath = path.join(process.cwd(), "public", "bartmooi-logo-1.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  const naam = data.naam || "Geachte klant";
  const datum = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  // Producten: uit winkelmand (items[]) of één enkel product (legacy)
  const rawItems: CartItemData[] = data.items && data.items.length > 0
    ? data.items
    : [{
        slug: data.slug || "",
        product: data.product || data.kozijnNaam || data.deurNaam || "product",
        prijs: data.prijs || 0,
        specs: {
          ...(data.breedte ? { breedte: data.breedte } : {}),
          ...(data.hoogte ? { hoogte: data.hoogte } : {}),
          ...(data.materiaal ? { materiaal: data.materiaal } : {}),
          ...(data.glasType || data.glas ? { glas: data.glasType || data.glas! } : {}),
          ...(data.kleur ? { kleur: data.kleur } : {}),
          ...(data.kleurBuitenkant ? { kleurBuitenkant: data.kleurBuitenkant } : {}),
          ...(data.paneel ? { paneel: data.paneel } : {}),
          ...(data.profiel ? { profiel: data.profiel } : {}),
          ...(data.beslag ? { beslag: data.beslag } : {}),
          ...(data.onderdorpel ? { onderdorpel: data.onderdorpel } : {}),
          ...(data.draairichting ? { draairichting: data.draairichting } : {}),
          ...(data.afstandshouder ? { afstandshouder: data.afstandshouder } : {}),
          ...(data.roeden ? { roeden: data.roeden } : {}),
          ...(data.bediening ? { bediening: data.bediening } : {}),
          ...(data.aantal ? { aantal: data.aantal } : {}),
        },
      }];

  const producten = await Promise.all(rawItems.map(async (item) => {
    let png: string | null = null;
    const glas = String(item.specs.glas ?? item.specs.glasType ?? "");
    const svgStr = item.slug
      ? getSvgString(item.slug, Number(item.specs.breedte) || undefined, Number(item.specs.hoogte) || undefined, glas || undefined)
      : null;
    if (svgStr) {
      const pngBuf = await svgToPng(svgStr, 900);
      png = `data:image/png;base64,${pngBuf.toString("base64")}`;
    }
    return { item, png, specs: buildItemSpecs(item.specs) };
  }));

  const meerdere = producten.length > 1;
  const productNaam = meerdere ? `${producten.length} producten` : producten[0].item.product;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Image src={logoBase64} style={styles.logo} />
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>BartMooi B.V.</Text>
            <Text style={styles.companyInfo}>
              Burgemeester Hovylaan 157{"\n"}
              2552 XB Den Haag{"\n"}
              info@offerte-bartmooi.nl
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* ── Offerte titel + datum ── */}
        <View style={styles.offerteBlock}>
          <View>
            <Text style={styles.offerteTitle}>Offerte aanvraag</Text>
            <Text style={styles.offerteSubtitle}>{productNaam}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Datum</Text>
            <Text style={styles.dateValue}>{datum}</Text>
          </View>
        </View>

        {/* ── Klantgegevens ── */}
        <View style={styles.clientBlock}>
          <Text style={styles.clientName}>{naam}</Text>
          <Text style={styles.clientInfo}>
            {[data.woonplaats, _email].filter(Boolean).join("  ·  ")}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* ── Producten ── */}
        {producten.map((p, idx) => (
          <View key={idx} wrap={false}>
            <Text style={styles.sectionTitle}>
              {meerdere ? `Product ${idx + 1} — ${p.item.product}` : "Productspecificaties"}
            </Text>

            {meerdere && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Product</Text>
                <Text style={styles.specValueBold}>{p.item.product}</Text>
              </View>
            )}
            {p.specs.map(([label, value], i) => (
              <View key={i} style={styles.specRow}>
                <Text style={styles.specLabel}>{label}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Prijsindicatie</Text>
              <Text style={styles.specValueBold}>
                € {p.item.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} excl. btw
              </Text>
            </View>

            {p.png && (
              <View style={styles.drawingWrapper}>
                <Image src={p.png} style={styles.drawingImage} />
                <Text style={styles.drawingCaption}>Schematische weergave — niet op schaal</Text>
              </View>
            )}
          </View>
        ))}

        {/* ── Totaal + subsidie ── */}
        {meerdere && (
          <View style={[styles.specRow, { marginTop: 6, borderBottomWidth: 0 }]}>
            <Text style={[styles.specLabel, { fontFamily: "Helvetica-Bold", color: DARK }]}>Totaal</Text>
            <Text style={styles.specValueBold}>
              € {(data.prijs ?? producten.reduce((s, p) => s + p.item.prijs, 0)).toLocaleString("nl-NL", { minimumFractionDigits: 2 })} excl. btw
            </Text>
          </View>
        )}
        {data.subsidieIndicatie && data.subsidieIndicatie > 0 ? (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>ISDE subsidie-indicatie</Text>
            <Text style={styles.specValueBold}>≈ € {data.subsidieIndicatie.toLocaleString("nl-NL")}</Text>
          </View>
        ) : null}

        {/* ── Inclusief montage ── */}
        <Text style={styles.sectionTitle}>In de prijs inbegrepen</Text>
        {[
          "Verwijderen en afvoeren van de bestaande kozijnen.",
          "Plaatsen van nieuwe kozijnen met HR+++ glas.",
          "Water- en winddichte buiten afwerking.",
          "Binnen afwerking (zonder schilderwerk) met witte PVC vensterbanken.",
          "Vakkundige montage door gecertificeerde monteurs.",
          "Reinigen van het werkgebied na oplevering.",
        ].map((item, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>–</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        {/* ── Betaling & levertijd ── */}
        <Text style={styles.sectionTitle}>Betaling & levertijd</Text>
        <View style={styles.twoCol}>
          <View style={styles.colBlock}>
            <Text style={styles.colLabel}>Betalingstermijnen</Text>
            <Text style={styles.colText}>
              30% direct na akkoord{"\n"}
              40% bij aanvang werkzaamheden{"\n"}
              30% na oplevering
            </Text>
          </View>
          <View style={styles.colBlock}>
            <Text style={styles.colLabel}>Levertijd</Text>
            <Text style={styles.colText}>Circa 6 weken na aanbetaling.</Text>
            <Text style={[styles.colLabel, { marginTop: 10 }]}>Geldigheid offerte</Text>
            <Text style={styles.colText}>30 dagen na offertedatum.</Text>
          </View>
        </View>

        {/* ── Garantie ── */}
        <Text style={styles.sectionTitle}>Garantie</Text>
        {([
          ["Kozijnen & isolatieglas", "10 jaar"],
          ["Hang- en sluitwerk", "5 jaar"],
          ["Ventilatieroosters", "2 jaar"],
        ] as [string, string][]).map(([label, years], i) => (
          <View key={i} style={styles.specRow}>
            <Text style={styles.specLabel}>{label}</Text>
            <Text style={styles.specValue}>{years}</Text>
          </View>
        ))}

        {/* ── Digitale acceptatie ── */}
        <View style={styles.signBlock}>
          <Text style={styles.signTitle}>Akkoord offerte</Text>
          <Text style={styles.signIntro}>
            Door ondertekening van deze offerte gaat u akkoord met de bovenstaande specificaties, prijzen en voorwaarden van BartMooi B.V. U ontvangt na ontvangst van de aanbetaling een bevestiging en planning.
          </Text>

          {/* Digitale optie */}
          {data.offerteId && (
            <View style={{ marginBottom: 16, padding: 10, borderWidth: 1, borderColor: LINE, borderRadius: 4 }}>
              <Text style={{ fontSize: 8.5, color: GREY, marginBottom: 4 }}>Liever digitaal akkoord geven?</Text>
              <Text style={{ fontSize: 9, color: DARK, fontFamily: "Helvetica-Bold" }}>
                {"https://offerte-bartmooi.nl/accepteer/" + data.offerteId}
              </Text>
            </View>
          )}

          {/* Papieren handtekening */}
          <View style={styles.signFields}>
            <View style={styles.signField}>
              <Text style={styles.signLabel}>Naam</Text>
              <View style={styles.signLine} />
              <Text style={styles.signLineLabel}>{naam}</Text>
            </View>
            <View style={styles.signField}>
              <Text style={styles.signLabel}>Datum</Text>
              <View style={styles.signLine} />
              <Text style={styles.signLineLabel}>________________________</Text>
            </View>
            <View style={styles.signField}>
              <Text style={styles.signLabel}>Handtekening</Text>
              <View style={styles.signLine} />
              <Text style={styles.signLineLabel}> </Text>
            </View>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BartMooi B.V. · KvK 12345678 · BTW NL123456789B01</Text>
          <Text style={styles.footerText}>info@offerte-bartmooi.nl · bartmooi.nl</Text>
        </View>

      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
