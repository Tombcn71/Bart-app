import { EndSensitivity, Modality, StartSensitivity, ThinkingLevel } from "@google/genai";
import { MARLEEN_PROMPT } from "./marleen-prompt";
import { MARLEEN_TOOLS } from "./marleen-tools";
import { WIDGET_PROMPT, WIDGET_TOOLS } from "./marleen-widget";
import { BASIS, AFSLUITING } from "./marleen-prompt";

export const MODELLEN = ["gemini-3.8-live", "gemini-3.8-live-extended-thinking", "gemini-3.1-flash-live-preview"] as const;
export const MARLEEN_MODEL = MODELLEN[0];

/** Instellingen van het gesprek. Alleen op de server gebruiken: de prompt blijft hier. */
export const STEMMEN = ["Sulafat", "Gacrux", "Vindemiatrix", "Despina", "Achernar", "Callirrhoe", "Erinome", "Kore", "Aoede", "Leda"] as const;

const WOORDEN = ["BartMooi", "Marleen", "kozijn", "kozijnen", "draai-kiepraam", "kiepraam", "schuifpui", "harmonicadeur", "rolluik", "hor", "HR++", "triple glas", "dubbel glas", "kunststof", "aluminium", "offerte", "inmeting"];

export function marleenConfig(stem: string = "Kore", model: string = MARLEEN_MODEL, widget = false) {
  return {
    ...(model.includes("extended-thinking") ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } : {}),
    responseModalities: [Modality.AUDIO],
    tools: widget ? WIDGET_TOOLS : MARLEEN_TOOLS,
    systemInstruction: widget ? BASIS + WIDGET_PROMPT + AFSLUITING : MARLEEN_PROMPT,
    speechConfig: {
      languageCode: "nl-NL",
      voiceConfig: { prebuiltVoiceConfig: { voiceName: stem } },
    },
    // Rustig luisteren: niet bij elk geluidje onderbreken, en antwoorden na een korte pauze.
    realtimeInputConfig: {
      automaticActivityDetection: {
        startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
        endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
        prefixPaddingMs: 100,
        silenceDurationMs: 500,
      },
    },
    contextWindowCompression: { slidingWindow: {} },
    // Wat de klant zegt en wat Marleen zegt altijd als Nederlands uitschrijven, met de vakwoorden erbij.
    inputAudioTranscription: { languageCodes: ["nl-NL"], customVocabulary: WOORDEN },
    outputAudioTranscription: { languageCodes: ["nl-NL"], customVocabulary: WOORDEN },
  };
}
