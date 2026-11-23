import { Behavior, Type, type Tool } from "@google/genai";

const tekst = (beschrijving: string) => ({
  type: Type.STRING,
  description: beschrijving,
});

/** De functies waarmee Roos de calculator en het offerteformulier bedient. */
export const ROOS_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "ga_naar_product",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Opent een productgroep in de catalogus. Gebruik dit alleen als het exacte type nog niet bekend is, of bij aluminium kozijnen.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            groep: {
              type: Type.STRING,
              enum: [
                "kozijnen",
                "aluminium-kozijnen",
                "deuren",
                "schuifpui",
                "harmonicadeur",
                "rolluiken",
                "horren",
              ],
              description: "De productgroep die geopend moet worden.",
            },
          },
          required: ["groep"],
        },
      },
      {
        name: "open_product",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Opent direct de calculator voor schuifpui, deur, hor, rolluik of harmonicadeur met het gekozen type. Geeft de actuele staat en beschikbare optiegroepen en optie-ID's terug.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            product: {
              type: Type.STRING,
              enum: ["schuifpui", "deur", "hor", "rolluik", "harmonicadeur"],
              description: "Het product.",
            },
            type: tekst("De slug van het type uit de lijst met producttypen in je instructies."),
          },
          required: ["product", "type"],
        },
      },
      {
        name: "open_kozijn",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Opent direct de calculator met het gekozen kozijntype (of wisselt van type). Geeft de huidige staat, toegestane maten en geldige optie-ID's terug.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            type: tekst("De slug van het kozijntype uit de lijst in je instructies."),
          },
          required: ["type"],
        },
      },
      {
        name: "zet_keuzes",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Past één of meer keuzes aan in de open calculator en geeft de bijgewerkte staat terug. Geef alleen gewijzigde velden mee.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            type: tekst("Slug van het type, alleen meegeven als het type wijzigt."),
            breedte: { type: Type.NUMBER, description: "Breedte in millimeters (bijv. 3000 voor 3 meter). Reken zelf om." },
            hoogte: { type: Type.NUMBER, description: "Hoogte in millimeters (bijv. 2200 voor 2,20 meter). Reken zelf om." },
            aantal: { type: Type.NUMBER, description: "Aantal stuks van exact dezelfde uitvoering en maten." },
            horren: { type: Type.NUMBER, description: "Aantal bijpassende horren bij kozijnen (0 = geen)." },
            kleurBinnen: tekst("Alleen bij kozijnen: optie-ID voor binnenkleur uit open_kozijn."),
            kleurBuiten: tekst("Alleen bij kozijnen: optie-ID voor buitenkleur uit open_kozijn."),
            glas: tekst("Alleen bij kozijnen: optie-ID voor glastype uit open_kozijn."),
            profiel: tekst("Alleen bij kozijnen: profiel-ID indien gevraagd."),
            aanslag: tekst("Alleen bij kozijnen: aanslag-ID indien gevraagd."),
            afstandshouder: tekst("Alleen bij kozijnen: afstandshouder-ID indien gevraagd."),
            roeden: tekst("Alleen bij kozijnen: roeden-ID indien gevraagd."),
            ventilatie: tekst("Alleen bij kozijnen: ventilatie-ID indien gevraagd."),
            voorboren: tekst("Alleen bij kozijnen: voorboren-ID indien gevraagd."),
            keuzes: {
              type: Type.ARRAY,
              description:
                "Voor schuifpui, deur, hor, rolluik en harmonicadeur: kies per keuzegroep { groep, id } uit de opties in de productstaat.",
              items: {
                type: Type.OBJECT,
                properties: {
                  groep: tekst("ID van de keuzegroep uit opties."),
                  id: tekst("ID van de gekozen optie binnen die groep."),
                },
              },
            },
            viaDeTuinBereikbaar: {
              type: Type.BOOLEAN,
              description: "Bij schuifpui: true als de monteurs via de tuin bij de plek kunnen, anders false.",
            },
            klantType: {
              type: Type.STRING,
              enum: ["particulier", "zakelijk"],
              description: "Standaard particulier; alleen zakelijk als de klant dit expliciet zegt.",
            },
            weergave: {
              type: Type.STRING,
              enum: ["tekening", "foto"],
              description: "Zet op 'foto' zodra de klant een kleur of uitvoering kiest, zodat de foto verschijnt.",
            },
          },
        },
      },
      {
        name: "voeg_product_toe",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Slaat het huidige product met zijn maten en keuzes op in de offerte-selectie zodat je daarna een 2e of 3e schuifpui of kozijn met andere maten kunt samenstellen.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "open_formulier",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Zet het samengestelde product (en eventueel eerder opgeslagen producten) op de offerte en opent het contactformulier.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "vul_formulier",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Vult bekende contactgegevens in het zichtbare offerteformulier in. Geef alleen de velden mee die de klant heeft genoemd.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            naam: tekst("Voor- en achternaam van de klant."),
            woonplaats: tekst("Woonplaats van de klant."),
            telefoon: tekst("Telefoonnummer zonder spaties of streepjes."),
            email: tekst("E-mailadres zonder spaties."),
          },
        },
      },
      {
        name: "lees_formulier",
        description:
          "Leest de huidige waarden uit het formulier (inclusief wat de klant zelf heeft getypt).",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "verstuur_formulier",
        description:
          "Verstuurt het formulier en opent direct de offertepagina (bovenaan). Geeft de offertegegevens inclusief totaalUitgesproken terug.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "lees_offerte",
        description:
          "Haalt de gegevens van de huidige offerte op als de offerte open staat.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "ga_naar_akkoord",
        behavior: Behavior.NON_BLOCKING,
        description:
          "Scrolt de offertepagina naar het vak Digitaal akkoord.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
    ],
  },
];
