// AutoScout24.de — pages de résultats : JSON `__NEXT_DATA__` ; page d'annonce : listingDetails.
import { htmlToText, newParsed, parseFirstReg, parseKm, parsePower, type Parsed } from "../normalize";
import { findColorDeep, normColor } from "../colors";
import { pickJson, type PageResult, type Source } from "./types";

const ORIGIN = "https://www.autoscout24.de";
const ND = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/;

/** Recherches de départ ; « ?powerfrom=… » (en kW) écarte les motorisations hors périmètre. */
const QUERIES = [
  "m2", "m3", "m4", "m5", "m6", "m8", "1er-m-coupe",
  "135?powerfrom=220", "140?powerfrom=240", "240?powerfrom=240", "340?powerfrom=270", "440?powerfrom=270",
];

/** Sur AutoScout24 les M Performance s'appellent « 135 / 140 / 240 / 340 / 440 » ; le « M » manque souvent du titre. */
const M_PERF: Record<string, { name: string; minPs: number }> = {
  "135": { name: "M135i", minPs: 316 }, "140": { name: "M140i", minPs: 330 }, "235": { name: "M235i", minPs: 320 },
  "240": { name: "M240i", minPs: 330 }, "340": { name: "M340i", minPs: 365 }, "440": { name: "M440i", minPs: 365 },
};

export function inferTitle(model: string, versionInput: string, variant: string, ps: number | null): string {
  let title = [model, versionInput, variant].filter(Boolean).join(" ");
  const m = M_PERF[String(model).trim()];
  if (m && ps && ps >= m.minPs && !/(^|[^a-z0-9])m\s?\d{3}/i.test(title)) title = `${m.name} ${title}`;
  return title;
}

function chainYear(qkey: string): { base: string; lo: number | null; hi: number | null } {
  const [base, range] = qkey.split("@");
  if (!range) return { base, lo: null, hi: null };
  const [lo, hi] = range.split("-").map(Number);
  return { base, lo, hi };
}

export const as24de: Source = {
  name: "autoscout24_de",
  label: "AutoScout24.de",
  country: "DE",
  currency: "EUR",
  firstPage: 1,
  maxPages: 20,
  baseQueries: () => QUERIES,
  split(qkey) {
    const { base, lo, hi } = chainYear(qkey);
    const a = lo ?? 2004, b = hi ?? new Date().getUTCFullYear() + 1;
    if (a >= b) return null;
    const mid = Math.floor((a + b) / 2);
    return [`${base}@${a}-${mid}`, `${base}@${mid + 1}-${b}`];
  },
  pageUrl(qkey, page) {
    const { base, lo, hi } = chainYear(qkey);
    const [slug, extra] = base.split("?");
    const q = new URLSearchParams(extra ?? "");
    q.set("atype", "C"); q.set("cy", "D"); q.set("sort", "age"); q.set("desc", "1");
    if (lo != null && hi != null) { q.set("fregfrom", String(lo)); q.set("fregto", String(hi)); }
    q.set("page", String(page));
    return `${ORIGIN}/lst/bmw/${slug}?${q.toString()}`;
  },
  parseResults(html): PageResult {
    const nd = pickJson(html, ND) as { props?: { pageProps?: Record<string, unknown> } } | null;
    const pp = nd?.props?.pageProps as { listings?: any[]; numberOfResults?: number; numberOfPages?: number } | undefined;
    if (!pp?.listings) return { items: [], total: null, pages: null };
    const items: Parsed[] = [];
    for (const l of pp.listings) {
      try {
        const v = l.vehicle ?? {};
        const det: Array<{ iconName: string; data: string }> = l.vehicleDetails ?? [];
        const power = parsePower(det.find((d) => d.iconName === "speedometer")?.data);
        const [year, month] = parseFirstReg(l.tracking?.firstRegistration ?? det.find((d) => d.iconName === "calendar")?.data);
        const price = typeof l.price?.priceRaw === "number" ? l.price.priceRaw : null;
        const it = newParsed({
          source: "autoscout24_de", extId: String(l.id), url: ORIGIN + l.url, country: "DE", currency: "EUR",
          title: inferTitle(`${v.model ?? ""}`, v.modelVersionInput ?? "", v.variant ?? "", power),
          description: String(v.subtitle ?? ""),
          price, year, month, km: parseKm(l.tracking?.mileage ?? v.mileageInKm), powerPs: power,
          gearbox: String(v.transmission ?? ""),
        });
        if (/schalt|manuell/i.test(it.gearbox) && !/automat/i.test(it.gearbox)) it.extraOptions.push("manual");
        const cn = findColorDeep(l); if (cn) { it.colorName = cn; it.color = normColor(cn); }
        if (v.isCurrentlyDamaged === true) it.extraFlags.push("accident");
        if (l.seller?.type === "Dealer") it.extraFlags.push("_dealer");
        items.push(it);
      } catch { /* annonce illisible : ignorée */ }
    }
    return { items, total: pp.numberOfResults ?? null, pages: pp.numberOfPages ?? null };
  },
  parseDetail(html, item) {
    const nd = pickJson(html, ND) as { props?: { pageProps?: { listingDetails?: any } } } | null;
    const d = nd?.props?.pageProps?.listingDetails;
    if (!d) return;
    const parts: string[] = [];
    if (d.description) parts.push(htmlToText(String(d.description)));
    const eq = d.vehicle?.equipment;
    if (eq && typeof eq === "object") {
      const names: string[] = [];
      for (const group of Object.values(eq) as any[]) if (Array.isArray(group)) for (const e of group) if (e?.id) names.push(String(e.id));
      if (names.length) parts.push("Ausstattung: " + names.join(", "));
    }
    if (parts.length) item.description = [item.description, ...parts].filter(Boolean).join("\n").slice(0, 12000);
    if (d.createdTimestampWithOffset) item.publishedAt = String(d.createdTimestampWithOffset);
    const v = d.vehicle ?? {};
    const cn = findColorDeep(v) ?? findColorDeep(d);
    if (cn && !item.color) { item.colorName = cn; item.color = normColor(cn); }
    if (v.hasFullServiceHistory === true) item.extraFlags.push("service_history");
    if (v.hadAccident === false) item.extraFlags.push("accident_free");
    if (v.hadAccident === true) item.extraFlags.push("accident");
    if (v.noOfPreviousOwners === 1) item.extraFlags.push("first_owner");
    if (d.warrantyExists === true) item.extraFlags.push("warranty");
    const kw = Number(v.powerInKw), hp = Number(v.powerInHp);
    if (!item.powerPs && hp > 0) item.powerPs = hp; else if (!item.powerPs && kw > 0) item.powerPs = Math.round(kw * 1.35962);
  },
};
