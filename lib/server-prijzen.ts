import { getMatrix } from "@/lib/matrix";
import { isStandaardModel, nieuwStandaardModel } from "@/lib/prijsmodel";

/**
 * De prijzen van Bart, op de server opgehaald zodat de calculator ze al heeft als de pagina er is (geen
 * "Prijzen ophalen…" en geen extra aanvragen vanuit de browser). Dezelfde omzetting als de calculator zelf deed.
 */
export async function prijzenVoor(sleutel: string) {
  const data = await getMatrix(sleutel);
  return isStandaardModel(data) ? data : nieuwStandaardModel();
}

/** Zoals opgeslagen (voor de kunststof-kozijncalculator, die zelf ook de oude prijstabel omzet). */
export async function ruwePrijzenVoor(sleutel: string) {
  return getMatrix(sleutel);
}
