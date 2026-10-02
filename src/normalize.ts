// Analyse des champs bruts : prix, kilométrage, date, puissance.

export const KW_TO_PS = 1.35962;

export interface Parsed {
  source: string;
  extId: string;
  url: string;
  country: "CH" | "DE" | string;
  currency: "CHF" | "EUR" | string;
  title: string;
  description: string;
  price: number | null;
  year: number | null;
  month: number | null;
  km: number | null;
  powerPs: number | null;
  gearbox: string;
  publishedAt: string | null;
  make: string;
  /** famille de couleur (français) et libellé d'origine */
  color: string | null;
  colorName: string | null;
  /** options / indicateurs lus dans des champs structurés (en plus du texte) */
  extraOptions: string[];
  extraFlags: string[];
}

export function newParsed(p: Partial<Parsed> & Pick<Parsed, "source" | "extId" | "url" | "country" | "currency">): Parsed {
  return {
    title: "", description: "", price: null, year: null, month: null, km: null, powerPs: null, gearbox: "",
    publishedAt: null, make: "BMW", color: null, colorName: null, extraOptions: [], extraFlags: [], ...p,
  };
}

export function parsePrice(s: unknown): number | null {
  if (s == null) return null;
  if (typeof s === "number") return s > 0 ? s : null;
  const m = String(s).match(/\d[\d'’.,\s ]*\d|\d/);
  if (!m) return null;
  let num = m[0].replace(/[\s'’ ]/g, "");
  if (/[.,]\d{1,2}$/.test(num) && !/[.,]\d{3}$/.test(num)) num = num.replace(/[.,](\d{1,2})$/, "#$1");
  num = num.replace(/[.,]/g, "").replace("#", ".");
  const v = Number(num);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export function parseKm(s: unknown): number | null {
  if (s == null) return null;
  if (typeof s === "number") return s >= 0 ? Math.trunc(s) : null;
  let m = String(s).match(/(\d[\d'’.,\s ]*)\s*km/i);
  if (!m) m = String(s).match(/^\s*(\d[\d'’.,\s ]*)\s*$/);
  if (!m) return null;
  const digits = m[1].replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

export function parseFirstReg(s: unknown): [number | null, number | null] {
  if (s == null) return [null, null];
  const t = String(s);
  let m = t.match(/\b(0?[1-9]|1[0-2])\s*[/.\-]\s*((?:19|20)\d{2})\b/);
  if (m) return [Number(m[2]), Number(m[1])];
  m = t.match(/\b((?:19|20)\d{2})\s*[/.\-]\s*(0?[1-9]|1[0-2])\b/);
  if (m) return [Number(m[1]), Number(m[2])];
  m = t.match(/\b((?:19|20)\d{2})\b/);
  if (m) return [Number(m[1]), null];
  return [null, null];
}

export function parsePower(s: unknown): number | null {
  if (s == null) return null;
  if (typeof s === "number") return s > 0 ? Math.trunc(s) : null;
  const t = String(s);
  let m = t.match(/(\d{2,4})\s*(?:ps|cv|ch|hp|bhp)\b/i);
  if (m) return Number(m[1]);
  m = t.match(/(\d{2,4})\s*kw\b/i);
  if (m) return Math.round(Number(m[1]) * KW_TO_PS);
  return null;
}

/** Retire les balises HTML et normalise les espaces. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x27;/g, "'")
    .replace(/[ \t ]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

/**
 * Les informations lues dans des champs structurés (boîte manuelle, historique, garantie…) sont ajoutées à la description sous forme de mots-clés :
 * la détection ne dépend ainsi que du texte enregistré et reste reproductible (relecture avec un dictionnaire amélioré).
 */
export const STRUCT_MARKERS: Record<string, string> = {
  manual: "Schaltgetriebe", xdrive: "xDrive", winter_tires: "Winterräder", accident: "Unfallschaden", damaged: "Unfallfahrzeug",
  accident_free: "unfallfrei", service_history: "Scheckheftgepflegt", first_owner: "Erstbesitz", warranty: "Garantie",
};
export function addMarkers(description: string, keys: string[]): string {
  let d = description ?? "";
  const add: string[] = [];
  for (const k of new Set(keys)) {
    const m = STRUCT_MARKERS[k];
    if (m && !d.toLowerCase().includes(m.toLowerCase())) add.push(m);
  }
  return add.length ? (d ? d + "\n" : "") + "Champs structurés : " + add.join(", ") : d;
}
