import { Type, type Tool } from "@google/genai";

const tekst = (beschrijving?: string) => ({ type: Type.STRING, ...(beschrijving ? { description: beschrijving } : {}) });

/** De functies waarmee Marleen de calculator en het offerteformulier bedient. */
export const MARLEEN_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "open_kozijn",
        description: "Opent de calculator met dit kozijntype, of wisselt naar een ander type. Geeft de staat terug.",
        parameters: { type: Type.OBJECT, properties: { type: tekst("Kozijntype (slug uit de lijst)") }, required: ["type"] },
      },
      {
        name: "zet_keuzes",
        description: "Zet keuzes in de calculator van de klant. Geef alleen de velden mee die veranderen. Geeft de nieuwe staat terug.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            type: tekst("Kozijntype (slug uit de lijst)"),
            breedte: { type: Type.NUMBER, description: "Buitenwerkse breedte in mm" },
            hoogte: { type: Type.NUMBER, description: "Buitenwerkse hoogte in mm" },
            aantal: { type: Type.NUMBER, description: "Aantal kozijnen" },
            horren: { type: Type.NUMBER, description: "Aantal horren, 0 = geen" },
            kleurBinnen: tekst(),
            kleurBuiten: tekst(),
            glas: tekst(),
            profiel: tekst(),
            aanslag: tekst(),
            afstandshouder: tekst(),
            roeden: tekst(),
            ventilatie: tekst(),
            voorboren: tekst(),
            klantType: { type: Type.STRING, enum: ["particulier", "zakelijk"] },
            weergave: { type: Type.STRING, enum: ["tekening", "foto"], description: "foto = het kozijn op een gevel, tekening = de technische tekening" },
          },
        },
      },
      {
        name: "open_formulier",
        description: "Zet het kozijn op de offerte en opent het formulier waar de klant zijn gegevens invult. Pas gebruiken als de klant een offerte wil.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "vul_formulier",
        description: "Vult velden van het zichtbare formulier in. Geef alleen mee wat de klant heeft gezegd.",
        parameters: { type: Type.OBJECT, properties: { naam: tekst(), woonplaats: tekst(), telefoon: tekst(), email: tekst() } },
      },
      {
        name: "lees_formulier",
        description: "Leest wat er nu in het formulier staat, ook wat de klant zelf heeft getypt.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "verstuur_formulier",
        description: "Verstuurt het formulier en opent de offerte. Alleen na een duidelijk ja van de klant, als alles klopt.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "lees_offerte",
        description: "Leest de tekst van de offerte die de klant nu ziet, zodat je hem kunt doornemen. Gebruik dit zodra de offerte open staat.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
      {
        name: "ga_naar_akkoord",
        description: "Scrolt de offertepagina naar het vak Digitaal akkoord, waar de klant zijn naam invult en op Akkoord geven klikt. De klant klikt zelf; jij doet dat nooit.",
        parameters: { type: Type.OBJECT, properties: {} },
      },
    ],
  },
];
