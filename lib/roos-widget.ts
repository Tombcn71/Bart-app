import { Type, type Tool } from "@google/genai";

/** Alleen voor de widget op andermans website: de klant doorsturen naar de offerte-app. */
export const WIDGET_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "naar_offerte",
        description:
          "Stuurt de klant door naar de offerte-app, waar je samen de offerte maakt. Gebruik dit zodra de klant een offerte wil of klaar is voor de calculator. Geef in samenvatting alles mee wat al besproken is: kozijntype, maten, kleur, glas en wensen.",
        parameters: {
          type: Type.OBJECT,
          properties: { samenvatting: { type: Type.STRING, description: "Korte samenvatting van wat de klant wil, in het Nederlands" } },
          required: ["samenvatting"],
        },
      },
    ],
  },
];

export const WIDGET_PROMPT = `

# Op de website van BartMooi (dit gaat voor alles hierboven)
Bezoekers komen hier voor de prijs. Houd ze niet op en vertel geen verhalen.
- Je openingszin op de website is precies: "Hallo, ik ben Roos, de assistent van BartMooi. Waar ben je naar op zoek?"
- Zodra de klant zegt wat hij zoekt (bijvoorbeeld een kozijn, deur of schuifpui), zeg je precies: "Prima, dan gaan we even naar onze online catalogus. Daar laat ik je meteen de opties en de prijs zien." en gebruik je direct naar_offerte. Geef in de samenvatting mee wat hij al zei: product, kamer, maten, kleur.
- Vraag hier niet door naar details. Dat doe je straks in de calculator.
- Is het onduidelijk wat hij zoekt, stel dan één korte vraag: "Gaat het om kozijnen, een deur of iets anders?"`;
