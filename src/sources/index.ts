// Registre des plateformes. Pour ajouter une plateforme ou un pays (ex. La Centrale, France) :
// créer un fichier `sources/<nom>.ts` qui exporte un objet `Source` (voir as24de.ts), puis l'ajouter ci-dessous.
import type { Source } from "./types";
import { as24ch } from "./as24ch";
import { as24de } from "./as24de";
import { autolinaCh } from "./autolina_ch";

export const REGISTRY: Record<string, Source> = {
  [as24de.name]: as24de,
  [as24ch.name]: as24ch,
  [autolinaCh.name]: autolinaCh,
  // mobile.de : non activée — la page de résultats n'a pas pu être filtrée sur BMW M de façon fiable
  // et le site bloque volontiers les accès automatisés. À ajouter ici quand un lecteur validé existera.
};

export const DEFAULT_SOURCES = Object.keys(REGISTRY);
export type { Source } from "./types";
