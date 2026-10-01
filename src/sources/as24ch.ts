// AutoScout24.ch — les annonces sont dans la charge utile Next.js (`self.__next_f.push`) ; pagination `pagination[page]` (base 0).
import { htmlToText, newParsed, parseFirstReg, type Parsed } from "../normalize";
import { type PageResult, type Source } from "./types";

const ORIGIN = "https://www.autoscout24.ch";
const QUERIES = ["m2", "m3", "m4", "m5", "m6", "m8", "1er-m", "m135", "m140", "m235", "m240", "m340", "m440"];

/** Concatène et décode les morceaux `self.__next_f.push([1,"…"])`. */
export function rscText(html: string): string {
  const out: string[] = [];
  const re = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    try { out.push(JSON.parse('"' + m[1] + '"')); } catch { /* morceau illisible */ }
  }
  return out.join("");
}

/** Extrait le tableau JSON commençant au premier « [ » après `marker`, en respectant chaînes et imbrications. */
export function jsonArrayAfter(text: string, marker: string): unknown[] | null {
  const i = text.indexOf(marker);
  if (i < 0) return null;
  const start = text.indexOf("[", i);
  let depth = 0, inStr = false;
  for (let j = start; j < text.length; j++) {
    const c = text[j];
    if (inStr) { if (c === "\\") j++; else if (c === '"') inStr = false; }
    else if (c === '"') inStr = true;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") { depth--; if (depth === 0) { try { return JSON.parse(text.slice(start, j + 1)); } catch { return null; } } }
  }
  return null;
}

export const as24ch: Source = {
  name: "autoscout24_ch",
  label: "AutoScout24.ch",
  country: "CH",
  currency: "CHF",
  firstPage: 0,
  maxPages: 60,
  baseQueries: () => QUERIES,
  split: () => null,
  pageUrl(qkey, page) {
    const base = `${ORIGIN}/de/s/mo-${qkey}/mk-bmw`;
    return page > 0 ? `${base}?pagination%5Bpage%5D=${page}` : base;
  },
  parseResults(html): PageResult {
    const text = rscText(html);
    const arr = jsonArrayAfter(text, '"content":[{"conditionType"') as any[] | null;
    if (!arr) return { items: [], total: null, pages: null };
    const meta = text.match(/"prefetchedListings":\{[^{}]*?"totalElements":(\d+),"totalPages":(\d+)/);
    const items: Parsed[] = [];
    for (const l of arr) {
      try {
        const [year, month] = parseFirstReg(l.firstRegistrationDate ?? l.firstRegistrationYear);
        const title = ["BMW", l.model?.name, l.versionFullName].filter(Boolean).join(" ");
        const it = newParsed({
          source: "autoscout24_ch", extId: String(l.id), url: `${ORIGIN}/de/d/${l.id}`, country: "CH", currency: "CHF",
          title, description: String(l.teaser ?? ""), price: typeof l.price === "number" && l.price > 0 ? l.price : null,
          year: year ?? (typeof l.firstRegistrationYear === "number" ? l.firstRegistrationYear : null), month,
          km: typeof l.mileage === "number" ? l.mileage : null,
          powerPs: typeof l.horsePower === "number" && l.horsePower > 0 ? l.horsePower : (l.kiloWatts ? Math.round(l.kiloWatts * 1.35962) : null),
          gearbox: String(l.transmissionTypeGroup ?? l.transmissionType ?? ""),
          publishedAt: l.createdDate ?? null,
        });
        if (/manual/i.test(it.gearbox)) it.extraOptions.push("manual");
        if (l.hadAccident === true) it.extraFlags.push("accident");
        if (l.hadAccident === false) it.extraFlags.push("accident_free");
        if (l.warranty && l.warranty.type && l.warranty.type !== "none") it.extraFlags.push("warranty");
        if (l.hasAdditionalSetOfTires === true) it.extraOptions.push("winter_tires");
        if (l.seller?.type === "professional") it.extraFlags.push("_dealer");
        items.push(it);
      } catch { /* annonce illisible : ignorée */ }
    }
    return { items, total: meta ? Number(meta[1]) : null, pages: meta ? Number(meta[2]) : null };
  },
  parseDetail(html, item) {
    // sections de la page : on ne garde que équipements, modifications et description (pas la navigation ni les mentions générales)
    const parts: string[] = [];
    const sections = html.split(/<h2\b/i).slice(1);
    for (const s of sections) {
      const heading = htmlToText("<h2" + s.slice(0, s.search(/<\/h2>/i) + 5)).trim();
      if (/Ausstattung|Modifikation|Fahrzeugbeschreibung|Beschreibung/i.test(heading)) {
        const body = s.split(/<h2\b/i)[0];
        parts.push(htmlToText(body.replace(/^[^>]*>/, "")).slice(0, 6000));
      }
    }
    if (parts.length) item.description = [item.description, ...parts].filter(Boolean).join("\n").slice(0, 12000);
  },
};
