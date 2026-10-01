import type { Parsed } from "../normalize";

/** Une recherche = une clé (ex. « m3 » ou « m3@2015-2019 ») ; la source sait construire l'URL d'une page. */
export interface PageResult {
  items: Parsed[];
  /** nombre total de résultats annoncé par la plateforme */
  total: number | null;
  /** nombre de pages annoncé */
  pages: number | null;
}

export interface Source {
  name: string;
  label: string;
  country: string;
  currency: string;
  /** première page (0 ou 1) */
  firstPage: number;
  /** nombre max de pages lisibles pour une même recherche (la plateforme plafonne) */
  maxPages: number;
  /** recherches de départ */
  baseQueries(): string[];
  /** si la recherche dépasse le plafond, découpe en deux (ex. par années) ; null = pas de découpe possible */
  split(qkey: string): [string, string] | null;
  pageUrl(qkey: string, page: number): string;
  parseResults(html: string): PageResult;
  parseDetail(html: string, item: Parsed): void;
}

export function pickJson(html: string, re: RegExp): unknown | null {
  const m = html.match(re);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}
