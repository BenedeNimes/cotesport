// Autolina.ch — marché suisse (AutoScout24.ch refuse les accès automatisés, on ne le contourne pas).
// Pages de liste /bmw/<modèle>[/page/N] : 15 annonces, rendu serveur ; détail /auto/<slug>/<id>.
// robots.txt : ces chemins sont autorisés (seuls /auto/d/, /member… sont interdits).
import { htmlToText, newParsed, parseKm, parsePrice, parsePower, parseFirstReg, type Parsed } from "../normalize";
import { normColor } from "../colors";
import { type PageResult, type Source } from "./types";

const ORIGIN = "https://www.autolina.ch";
const QUERIES = ["m2", "m3", "m4", "m5", "m6", "m8", "1er-m", "m135", "m140", "m235", "m240", "m340", "m440"];
const PER_PAGE = 15;

function clean(s: string): string {
  return htmlToText(s).replace(/\s+/g, " ").trim();
}

export const autolinaCh: Source = {
  name: "autolina_ch",
  label: "Autolina.ch",
  country: "CH",
  currency: "CHF",
  firstPage: 1,
  maxPages: 20,
  baseQueries: () => QUERIES,
  split: () => null,
  pageUrl(qkey, page) {
    return page > 1 ? `${ORIGIN}/bmw/${qkey}/page/${page}` : `${ORIGIN}/bmw/${qkey}`;
  },
  parseResults(html): PageResult {
    const totM = html.match(/"numberOfItems"\s*:\s*(\d+)/);
    const total = totM ? Number(totM[1]) : null;
    const items: Parsed[] = [];
    const cards = html.split(/class="url-wrapper tr-srp-item/).slice(1);
    for (const c of cards) {
      try {
        const href = c.match(/href="(\/auto\/[^"]+?\/(\d+))"/);
        if (!href) continue;
        const end = c.indexOf("</app-car-row>");
        const card = end > 0 ? c.slice(0, end) : c.slice(0, 8000);
        const titleM = card.match(/class="make-model[\s\S]*?title="BMW"[\s\S]*?title="([^"]+)"/);
        const text = clean(card.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/^[^>]*>/, ""));
        const price = (() => {
          const m = text.match(/CHF\s*(\d{1,3}(?:\s*['’]\s*\d{3})*)/);
          return m ? parsePrice(m[1].replace(/[\s'’]/g, "")) : null;
        })();
        const after = price != null ? text.slice(text.search(/CHF\s*\d/)) : text;
        const yearM = after.match(/CHF\s*\d{1,3}(?:\s*['’]\s*\d{3})*\s+((?:19|20)\d{2})\s/);
        const kmM = after.match(/(\d{1,3}(?:\s*['’]\s*\d{3})*)\s*km\b/i);
        const km = kmM ? parseKm(kmM[1].replace(/[\s'’]/g, "") + " km") : null;
        const ps = parsePower(after);
        const gear = /Automat/i.test(after) ? "Automatik" : /Schalt|Hand/i.test(after) ? "Manuell" : "";
        const it = newParsed({
          source: "autolina_ch", extId: href[2], url: ORIGIN + href[1], country: "CH", currency: "CHF",
          title: ("BMW " + (titleM ? titleM[1] : "")).trim(), price,
          year: yearM ? Number(yearM[1]) : /Neuwagen/i.test(after) ? new Date().getFullYear() : null,
          km, powerPs: ps, gearbox: gear,
        });
        if (/manuell/i.test(gear)) it.extraOptions.push("manual");
        if (it.price != null && it.year != null) items.push(it);
      } catch { /* annonce illisible : ignorée */ }
    }
    return { items, total, pages: total != null ? Math.ceil(total / PER_PAGE) : null };
  },
  parseDetail(html, item) {
    const body = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
    // une ligne par élément du DOM : les équipements restent séparés (pas de mots collés d'un équipement à l'autre)
    const text = htmlToText(body);
    const flat = text.replace(/\s+/g, " ");
    const h2 = body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const headline = h2 ? clean(h2[1]) : "";
    // équipements optionnels (hors « Serienmässige Ausstattung », qui est l'équipement de série)
    const o = text.search(/Optionale Ausstattung/);
    let opts = "";
    if (o >= 0) {
      const rest = text.slice(o + "Optionale Ausstattung".length);
      const e = rest.search(/Mehr anzeigen|Serienmässige Ausstattung/);
      const seen = new Set<string>();
      opts = (e >= 0 ? rest.slice(0, e) : rest.slice(0, 3000)).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l && !seen.has(l) && seen.add(l)).join("; ");
    }
    const er = flat.match(/Erstzulassung\s+(\d{1,2})\s*\.\s*((?:19|20)\d{2})/);
    if (er) { item.month = Number(er[1]); item.year = Number(er[2]); } else {
      const [y, m] = parseFirstReg(flat.match(/Erstzulassung\s+([\d. /]+)/)?.[1]); if (y) { item.year = y; item.month = m; }
    }
    if (/Antrieb\s+Allrad/i.test(flat)) item.extraOptions.push("xdrive");
    if (/Getriebeart\s+(Schalt|Hand|Manuell)/i.test(flat)) item.extraOptions.push("manual");
    const g = flat.match(/\bGarantie\s+(Ja|Nein)\b/);
    if (g && g[1] === "Ja") item.extraFlags.push("warranty");
    if (/Der Händler meldet sich/.test(flat)) item.extraFlags.push("_dealer");
    // couleur de carrosserie : « Farbe (aussen & innen) Grün Weiss » → premier mot = extérieur
    const col = flat.match(/Farbe \(aussen (?:&amp;|&) innen\)\s+([A-Za-zÀ-ÿ]+)/);
    if (col) { const c = normColor(col[1]); if (c) { item.color = c; item.colorName = col[1]; } }
    const parts = [headline, opts ? "Ausstattung: " + opts : ""].filter(Boolean);
    if (parts.length) item.description = [item.description, ...parts].filter(Boolean).join("\n").slice(0, 12000);
  },
};
