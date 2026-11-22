import { EndSensitivity, Modality, StartSensitivity, ThinkingLevel } from "@google/genai";
import { MARLEEN_PROMPT } from "./marleen-prompt";

export const MODELLEN = ["gemini-3.8-live", "gemini-3.8-live-extended-thinking", "gemini-3.1-flash-live-preview"] as const;
export const MARLEEN_MODEL = MODELLEN[0];

/** Instellingen van het gesprek. Alleen op de server gebruiken: de prompt blijft hier. */
export const STEMMEN = ["Sulafat", "Gacrux", "Vindemiatrix", "Despina", "Achernar", "Callirrhoe", "Erinome", "Kore", "Aoede", "Leda"] as const;

export function marleenConfig(stem: string = "Kore", model: string = MARLEEN_MODEL) {
  return {
    ...(model.includes("extended-thinking") ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } : {}),
    responseModalities: [Modality.AUDIO],
    systemInstruction: MARLEEN_PROMPT,
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
    inputAudioTranscription: {},
    outputAudioTranscription: {},
  };
}
