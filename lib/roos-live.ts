import { EndSensitivity, Modality, StartSensitivity } from "@google/genai";
import { ROOS_PROMPT, BASIS, AFSLUITING } from "./roos-prompt";
import { ROOS_TOOLS } from "./roos-tools";
import { WIDGET_PROMPT, WIDGET_TOOLS } from "./roos-widget";

export const MODELLEN = ["gemini-3.8-live", "gemini-3.1-flash-live-preview"] as const;
export const ROOS_MODEL = MODELLEN[0];

export const STEMMEN = [
  "Aoede", "Leda", "Kore", "Sulafat", "Gacrux",
  "Vindemiatrix", "Despina", "Achernar", "Callirrhoe", "Erinome"
] as const;

export const DOMEIN_WOORDEN = [
  "BartMooi", "Roos", "kozijn", "kozijnen", "draai-kiepraam",
  "kiepraam", "schuifpui", "schuifpuien", "harmonicadeur", "rolluik", "hor",
  "maten", "breedte", "hoogte", "millimeter", "centimeter",
  "tweede", "derde", "antraciet", "HR++", "triple glas", "dubbel glas",
  "kunststof", "aluminium", "offerte", "inmeting"
];

const WOORDEN_INSTRUCTIE = `\n# Herkenning en uitspraak\nBelangrijke woorden in dit gesprek: ${DOMEIN_WOORDEN.join(", ")}. Spreek "BartMooi" uit als één vloeiend woord en "HR++" als "H R plus plus".\n`;

export function roosConfig(stem: string = "Aoede", model: string = ROOS_MODEL, widget = false) {
  const baseInstruction = widget ? BASIS + WIDGET_PROMPT + AFSLUITING : ROOS_PROMPT;
  void model;

  return {
    responseModalities: [Modality.AUDIO],
    tools: widget ? WIDGET_TOOLS : ROOS_TOOLS,
    systemInstruction: baseInstruction + WOORDEN_INSTRUCTIE,
    speechConfig: {
      languageCode: "nl-NL",
      voiceConfig: { prebuiltVoiceConfig: { voiceName: stem } },
    },
    realtimeInputConfig: {
      automaticActivityDetection: {
        startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
        endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
        prefixPaddingMs: 120,
        silenceDurationMs: 650,
      },
    },
    contextWindowCompression: { slidingWindow: {} },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
  };
}
