// Cote par régression hédonique (ridge sur ln du prix), fourchettes, projections et classement des options.
import { COND_KEYS, OPT_KEYS, CATALOG } from "./options";
import {
  cholesky, dot, inverse, matmul, matvec, median, mulberry32, normal, percentile, quad, std, xtx, xty, eye, type Mat,
} from "./linalg";

export const RIDGE = 0.5;
export const KM_PRIOR_LAMBDA = 30;
export const Z80 = 1.2816;

export interface Settings { minSegmentN: number; minProjectionN: number; marketVol: number; fxFallback: number }
export const DEFAULTS: Settings = { minSegmentN: 15, minProjectionN: 30, marketVol: 0.05, fxFallback: 1.07 };

export interface Row {
  id: number; source: string; url: string; title: string; country: string; family: string; generation: string; version: string;
  segment: string; priceEur: number; price: number; currency: string; year: number; month: number | null; km: number;
  powerPs: number | null; opts: Set<string>; conds: Set<string>; firstSeen: Date | null; publishedAt: Date | null;
  active: boolean; isDemo: boolean; modelConf: number | null;
  age: number; ch: 0 | 1; _t?: Date | null;
}

export function decimalYear(d = new Date()): number {
  return d.getUTCFullYear() + d.getUTCMonth() / 12 + (d.getUTCDate() - 1) / 365;
}
export function ageOf(year: number | null, month: number | null): number | null {
  if (!year) return null;
  return Math.max(0, decimalYear() - (year + ((month || 6) - 1) / 12));
}
const monthsSince = (t0: Date | null, t: Date | null | undefined) => (!t0 || !t ? 0 : (t.getTime() - t0.getTime()) / (86400000 * 30.44));

export interface Fit {
  cols: string[]; beta: number[]; cov: Mat; sigma: number; n: number; r2: number; t0: Date | null; refVersion: string;
  ageMax: number; kmMax: number; support: Map<string, [number, number]>;
}
const idx = (f: Fit, col: string): number => f.cols.indexOf(col);

function rowX(row: Partial<Row> & { age: number; km: number; ch: number; opts: Set<string>; conds: Set<string> }, cols: string[], t0: Date | null): number[] {
  return cols.map((c) => {
    if (c === "const") return 1;
    if (c === "age") return row.age || 0;
    if (c === "km") return (row.km || 0) / 10000;
    if (c === "ch") return row.ch;
    if (c === "t") return monthsSince(t0, row._t ?? row.firstSeen ?? null);
    const [k, v] = [c.slice(0, c.indexOf(":")), c.slice(c.indexOf(":") + 1)];
    if (k === "ver") return row.version === v ? 1 : 0;
    if (k === "gen") return row.generation === v ? 1 : 0;
    if (k === "opt") return row.opts.has(v) ? 1 : 0;
    if (k === "cond") return row.conds.has(v) ? 1 : 0;
    return 0;
  });
}

export function fitModel(rows: Row[], o: { withGeneration: boolean; minSupport?: number; useOptions?: boolean; kmPrior?: number | null }): Fit | null {
  const n = rows.length;
  if (n < 8) return null;
  const minSupport = o.minSupport ?? 5;
  const useOptions = o.useOptions ?? true;
  const ages = rows.map((r) => r.age), kms = rows.map((r) => r.km);
  let cols = ["const", "age", "km"];
  if (std(ages) < 0.3) cols = cols.filter((c) => c !== "age");
  if (std(kms) < 500) cols = cols.filter((c) => c !== "km");
  const chn = rows.reduce((s, r) => s + r.ch, 0);
  if (chn >= 3 && chn <= n - 3) cols.push("ch");
  if (o.withGeneration) {
    const gcount = new Map<string, number>();
    for (const r of rows) gcount.set(r.generation, (gcount.get(r.generation) ?? 0) + 1);
    const refG = [...gcount.entries()].sort((a, b) => b[1] - a[1])[0][0];
    for (const [g, c] of [...gcount.entries()].sort()) if (g !== refG && c >= 3) cols.push(`gen:${g}`);
  }
  const vcount = new Map<string, number>();
  for (const r of rows) vcount.set(r.version, (vcount.get(r.version) ?? 0) + 1);
  const refV = [...vcount.entries()].sort((a, b) => b[1] - a[1])[0][0];
  for (const [v, c] of vcount) if (v !== refV && c >= 3) cols.push(`ver:${v}`);
  const support = new Map<string, [number, number]>();
  const cands: Array<[number, string]> = [];
  if (useOptions) {
    for (const [kind, keys] of [["opt", OPT_KEYS], ["cond", COND_KEYS]] as const) {
      for (const key of keys) {
        const withN = rows.reduce((s, r) => s + ((kind === "opt" ? r.opts : r.conds).has(key) ? 1 : 0), 0);
        support.set(`${kind}:${key}`, [withN, n - withN]);
        if (withN >= minSupport && n - withN >= minSupport) cands.push([Math.min(withN, n - withN), `${kind}:${key}`]);
      }
    }
  }
  // pas plus d'un paramètre pour 3 annonces : on garde les caractéristiques les mieux représentées
  const room = Math.max(0, Math.floor(n / 3) - cols.length - 1);
  cands.sort((a, b) => b[0] - a[0]);
  cols.push(...cands.slice(0, room).map((c) => c[1]));
  // dérive du marché dans le temps : seulement après 6 mois d'historique
  const fss = rows.map((r) => r.firstSeen).filter((d): d is Date => !!d);
  const t0 = fss.length ? new Date(Math.min(...fss.map((d) => d.getTime()))) : null;
  if (fss.length && (Math.max(...fss.map((d) => d.getTime())) - Math.min(...fss.map((d) => d.getTime()))) / 86400000 >= 180) cols.push("t");

  const X = rows.map((r) => rowX(r, cols, t0));
  const y = rows.map((r) => Math.log(r.priceEur));
  const p = cols.length;
  const lam = new Array(p).fill(RIDGE); lam[0] = 0;
  const beta0 = new Array(p).fill(0);
  if (o.kmPrior != null && cols.includes("km")) { const i = cols.indexOf("km"); lam[i] = KM_PRIOR_LAMBDA; beta0[i] = o.kmPrior; }
  const XtX = xtx(X);
  const A = XtX.map((r, i) => r.map((v, j) => v + (i === j ? lam[i] : 0)));
  let Ainv = inverse(A);
  if (!Ainv) Ainv = inverse(A.map((r, i) => r.map((v, j) => v + (i === j ? 1e-6 : 0)))) ?? eye(p);
  const rhs = xty(X, y).map((v, i) => v + lam[i] * beta0[i]);
  const beta = matvec(Ainv, rhs);
  const resid = y.map((v, i) => v - dot(X[i], beta));
  const ssr = resid.reduce((s, e) => s + e * e, 0);
  const dof = Math.max(1, n - p);
  const sigma = Math.sqrt(ssr / dof);
  const cov = matmul(matmul(Ainv, XtX), Ainv).map((r) => r.map((v) => v * sigma * sigma));
  const ym = y.reduce((a, b) => a + b, 0) / n;
  const ssTot = y.reduce((s, v) => s + (v - ym) ** 2, 0) || 1;
  return { cols, beta, cov, sigma, n, r2: 1 - ssr / ssTot, t0, refVersion: refV, ageMax: Math.max(...ages), kmMax: Math.max(...kms), support };
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const pctOf = (b: number) => r1((Math.exp(b) - 1) * 100);

export interface EstimateSpec {
  family: string; generation: string; version?: string; year: number; month?: number | null; km: number;
  market?: string; options?: string[]; flags?: string[]; km_per_year?: number | null;
}

export class ValuationService {
  rows: Row[] = [];
  fx: number;
  discount: { medianPct: number; n: number } | null = null;
  private seg = new Map<string, Fit | null>();
  private fam = new Map<string, Fit | null>();
  /** durée de vie des annonces retirées : [options+état, jours] */
  private dom: Array<{ keys: Set<string>; days: number; family: string }> = [];

  constructor(public s: Settings = DEFAULTS) { this.fx = s.fxFallback; }

  load(rows: Row[], fx: number | null, discount: { medianPct: number; n: number } | null, dom: Array<{ keys: Set<string>; days: number; family: string }>) {
    this.rows = rows; this.fx = fx ?? this.s.fxFallback; this.discount = discount; this.dom = dom;
    this.seg.clear(); this.fam.clear();
  }

  segmentRows = (segment: string) => this.rows.filter((r) => r.segment === segment);
  familyRows = (family: string) => this.rows.filter((r) => r.family === family);

  segFit(segment: string): Fit | null {
    if (!this.seg.has(segment)) {
      const rows = this.segmentRows(segment);
      if (rows.length >= this.s.minSegmentN) {
        const ff = this.famFit(rows[0].family);
        let prior: number | null = null;
        if (ff && idx(ff, "km") >= 0) prior = Math.min(ff.beta[idx(ff, "km")], 0);
        this.seg.set(segment, fitModel(rows, { withGeneration: false, kmPrior: prior }));
      } else this.seg.set(segment, null);
    }
    return this.seg.get(segment) ?? null;
  }

  famFit(family: string): Fit | null {
    if (!this.fam.has(family)) {
      const rows = this.familyRows(family);
      this.fam.set(family, rows.length >= this.s.minSegmentN ? fitModel(rows, { withGeneration: true }) : null);
    }
    return this.fam.get(family) ?? null;
  }

  private money(mid: number, low: number, high: number) {
    const fx = this.fx;
    return { eur: Math.round(mid), low_eur: Math.round(low), high_eur: Math.round(high), chf: Math.round(mid / fx), low_chf: Math.round(low / fx), high_chf: Math.round(high / fx) };
  }

  estimate(spec: EstimateSpec): Record<string, any> {
    const fam = spec.family, gen = spec.generation, segment = `${fam} ${gen}`;
    const market = (spec.market || "DE").toUpperCase();
    const age = ageOf(Number(spec.year), spec.month ?? null) ?? 0;
    const km = Number(spec.km);
    const row = { age, km, ch: market === "CH" ? 1 : 0, version: spec.version || "", generation: gen, opts: new Set(spec.options ?? []), conds: new Set(spec.flags ?? []), _t: new Date() } as any;
    const segN = this.segmentRows(segment).length;
    let method: string | null = null, fit: Fit | null = this.segFit(segment);
    if (fit) method = "regression_segment";
    else { fit = this.famFit(fam); if (fit) method = "regression_famille"; }
    const out: Record<string, any> = { segment, market, fx: this.fx, age: r1(age), n_segment: segN, n_famille: this.familyRows(fam).length };
    if (!fit) return this.byComparables(segment, row, out);

    const x = rowX(row, fit.cols, fit.t0);
    let mu = dot(x, fit.beta);
    let v = quad(x, fit.cov);
    const borrowed: Array<[string, number, number]> = [];
    if (method === "regression_segment") {
      const ff = this.famFit(fam);
      if (ff) {
        for (const [kind, keys] of [["opt", row.opts], ["cond", row.conds]] as const) {
          for (const key of keys as Set<string>) {
            const col = `${kind}:${key}`;
            if (idx(fit, col) < 0 && idx(ff, col) >= 0) {
              const j = idx(ff, col);
              mu += ff.beta[j]; v += ff.cov[j][j];
              borrowed.push([key, ff.beta[j], ff.cov[j][j]]);
            }
          }
        }
      }
    }
    const sd = Math.sqrt(fit.sigma ** 2 + v);
    const mid = Math.exp(mu), low = Math.exp(mu - Z80 * sd), high = Math.exp(mu + Z80 * sd);
    const nRef = fit.n;
    let conf = nRef >= 60 && fit.sigma < 0.10 ? "élevée" : nRef >= 25 && fit.sigma < 0.16 ? "moyenne" : "faible";
    const extrap = age > fit.ageMax + 1 || km / 10000 > (fit.kmMax / 10000) * 1.2;
    if (extrap) conf = "faible";
    Object.assign(out, {
      method, n: nRef, sigma_pct: r1(fit.sigma * 100), r2: Math.round(fit.r2 * 100) / 100, confidence: conf, extrapolation: extrap,
      value: this.money(mid, low, high),
      adjustments: [
        ...this.adjustments(fit, row),
        ...borrowed.map(([k, b, vv]) => ({ label: CATALOG[k].label + " (effet estimé sur toute la famille)", pct: pctOf(b), significatif: Math.abs(b / Math.sqrt(Math.max(vv, 1e-12))) >= 2 })),
      ],
      comparables: this.comparables(segment, row),
    });
    if (this.discount) {
      const d = this.discount.medianPct / 100;
      out.transaction = { eur: Math.round(mid * (1 + d)), chf: Math.round((mid * (1 + d)) / this.fx), discount_pct: r1(this.discount.medianPct), n: this.discount.n };
    } else out.transaction = null;
    out.projection = this.projection(fit, row, spec, nRef, mu);
    return out;
  }

  private adjustments(fit: Fit, row: any) {
    const out: any[] = [];
    const ia = idx(fit, "age"), ik = idx(fit, "km"), ic = idx(fit, "ch");
    if (ia >= 0) out.push({ label: "Par année d'âge supplémentaire", pct: pctOf(fit.beta[ia]) });
    if (ik >= 0) out.push({ label: "Par tranche de 10 000 km", pct: pctOf(fit.beta[ik]) });
    if (ic >= 0) out.push({ label: "Marché suisse vs allemand (à équipement égal)", pct: pctOf(fit.beta[ic]) });
    for (const [kind, keys] of [["opt", row.opts], ["cond", row.conds]] as const) {
      for (const key of keys as Set<string>) {
        const i = idx(fit, `${kind}:${key}`);
        if (i >= 0) {
          const se = Math.sqrt(Math.max(fit.cov[i][i], 1e-12));
          out.push({ label: CATALOG[key].label, pct: pctOf(fit.beta[i]), significatif: Math.abs(fit.beta[i] / se) >= 2 });
        }
      }
    }
    return out;
  }

  private comparables(segment: string, row: any, k = 6) {
    const dist = (r: Row) => Math.abs((r.age || 0) - row.age) / 2 + Math.abs((r.km || 0) - row.km) / 30000 + (r.version === row.version ? 0 : 0.5);
    return [...this.segmentRows(segment)].sort((a, b) => dist(a) - dist(b)).slice(0, k).map((r) => ({
      id: r.id, url: r.url, title: r.title, year: r.year, km: r.km, country: r.country, price: r.price, currency: r.currency,
      price_eur: Math.round(r.priceEur), version: r.version,
    }));
  }

  private byComparables(segment: string, row: any, out: Record<string, any>) {
    const rows = this.segmentRows(segment);
    if (rows.length < 3) {
      return Object.assign(out, { method: "insuffisant", confidence: "aucune", n: rows.length, message: "Pas assez d'annonces dans ce segment pour estimer une cote." });
    }
    let close = rows.filter((r) => Math.abs((r.age || 0) - row.age) <= 1.5 && Math.abs((r.km || 0) - row.km) <= 40000);
    if (!close.length) close = rows;
    const prices = close.map((r) => r.priceEur).sort((a, b) => a - b);
    const mid = median(prices), lo = prices[Math.max(0, Math.floor(prices.length * 0.1))], hi = prices[Math.min(prices.length - 1, Math.floor(prices.length * 0.9))];
    return Object.assign(out, {
      method: "comparables", n: close.length, confidence: "faible", value: this.money(mid, lo, hi), adjustments: [], projection: null, transaction: null,
      comparables: this.comparables(segment, row), message: "Segment peu fourni : médiane des annonces proches, sans ajustement par option.",
    });
  }

  private projection(fit: Fit, row: any, spec: EstimateSpec, nRef: number, mu0: number) {
    if (nRef < this.s.minProjectionN) {
      return { available: false, reason: `Moins de ${this.s.minProjectionN} annonces comparables : projection désactivée plutôt qu'inventée.` };
    }
    let kmpy = spec.km_per_year || (row.age >= 1 ? row.km / row.age : 10000);
    kmpy = Math.min(Math.max(Number(kmpy), 3000), 30000);
    const rng = mulberry32(12345);
    const p = fit.cols.length;
    const cov = fit.cov.map((r, i) => r.map((v, j) => v + (i === j ? 1e-12 : 0)));
    const L = cholesky(cov);
    const N = 600, vol = this.s.marketVol;
    const draws: number[][] = [];
    for (let d = 0; d < N; d++) {
      const z = Array.from({ length: p }, () => normal(rng));
      draws.push(fit.beta.map((b, i) => b + L[i].reduce((s, l, j) => s + l * z[j], 0)));
    }
    const ti = idx(fit, "t");
    const res: any = { available: true, km_per_year: Math.round(kmpy), points: [], market_trend_included: ti >= 0, vol_hypothesis: vol };
    for (const h of [12, 24, 36]) {
      const r2 = { ...row, age: row.age + h / 12, km: row.km + (kmpy * h) / 12, _t: new Date() };
      const x = rowX(r2, fit.cols, fit.t0);
      if (ti >= 0) x[ti] += Math.min(h, 12); // la dérive de marché n'est pas extrapolée au-delà de 12 mois
      const extra = vol * Math.sqrt(h / 12);
      const vals = draws.map((dr) => Math.exp(dot(dr, x) + normal(rng) * extra)).sort((a, b) => a - b);
      const [p10, p50, p90] = [10, 50, 90].map((q) => percentile(vals, q));
      res.points.push({
        months: h, central_eur: Math.round(p50), low_eur: Math.round(p10), high_eur: Math.round(p90),
        central_chf: Math.round(p50 / this.fx), low_chf: Math.round(p10 / this.fx), high_chf: Math.round(p90 / this.fx),
        change_pct: r1((p50 / Math.exp(mu0) - 1) * 100),
      });
    }
    res.warning = "Extrapolation à partir de véhicules plus âgés observés aujourd'hui, pas une prévision. La tendance de marché n'est prise en compte qu'après plusieurs semaines de collecte.";
    return res;
  }

  /** Écart de chaque annonce par rapport à la cote attendue. */
  scoreListings(rows: Row[]): Map<number, { expected_eur: number; gap_pct: number }> {
    const out = new Map<number, { expected_eur: number; gap_pct: number }>();
    const now = new Date();
    for (const r of rows) {
      const fit = this.segFit(r.segment) ?? this.famFit(r.family);
      if (!fit) continue;
      const pred = Math.exp(dot(rowX({ ...r, _t: now }, fit.cols, fit.t0), fit.beta));
      out.set(r.id, { expected_eur: Math.round(pred), gap_pct: r1((r.priceEur / pred - 1) * 100) });
    }
    return out;
  }

  private daysOnMarket(family: string): Record<string, { with: number; without: number }> {
    const recs = this.dom.filter((d) => d.family === family);
    const out: Record<string, { with: number; without: number }> = {};
    for (const key of [...OPT_KEYS, ...COND_KEYS]) {
      const w = recs.filter((r) => r.keys.has(key)).map((r) => r.days);
      const wo = recs.filter((r) => !r.keys.has(key)).map((r) => r.days);
      if (w.length >= 12 && wo.length >= 12) out[key] = { with: Math.trunc(median(w)), without: Math.trunc(median(wo)) };
    }
    return out;
  }

  optionsRanking(family: string) {
    const rows = this.familyRows(family);
    const res: { family: string; n: number; items: any[]; note: string } = { family, n: rows.length, items: [], note: "" };
    const fit = this.famFit(family);
    if (!fit) { res.note = `Pas assez d'annonces pour ${family} (minimum ${this.s.minSegmentN}).`; return res; }
    const chRows = rows.filter((r) => r.country === "CH"), deRows = rows.filter((r) => r.country !== "CH");
    const fitCh = chRows.length >= 40 ? fitModel(chRows, { withGeneration: true, minSupport: 5 }) : null;
    const fitDe = deRows.length >= 40 ? fitModel(deRows, { withGeneration: true, minSupport: 5 }) : null;
    const days = this.daysOnMarket(family);
    for (const [kind, key] of [...OPT_KEYS.map((k) => ["opt", k]), ...COND_KEYS.map((k) => ["cond", k])] as Array<[string, string]>) {
      const [nWith, nWo] = fit.support.get(`${kind}:${key}`) ?? [0, 0];
      const item: any = { key, label: CATALOG[key].label, kind: kind === "opt" ? "option" : "etat", n_with: nWith, n_without: nWo };
      const i = idx(fit, `${kind}:${key}`);
      if (i < 0) { item.verdict = "insuffisant"; item.detail = "Trop peu d'annonces avec ou sans cette caractéristique."; res.items.push(item); continue; }
      const b = fit.beta[i], se = Math.sqrt(Math.max(fit.cov[i][i], 1e-12)), t = b / se;
      item.pct = pctOf(b); item.t = r1(t);
      const sd = days[key];
      if (sd) { item.days_with = sd.with; item.days_without = sd.without; }
      const gap = sd ? sd.without - sd.with : 0;
      const rel = sd ? gap / Math.max(sd.without, 1) : 0;
      const slow = !!sd && gap <= -14 && rel <= -0.3;
      const fast = !!sd && gap >= 14 && rel >= 0.3;
      const positiveGood = key !== "accident" && key !== "tuned";
      let verdict = t >= 2 ? (positiveGood ? "privilegier" : "neutre") : t <= -2 ? "eviter" : "neutre";
      if (verdict === "neutre" && fast) { verdict = "privilegier"; item.detail = "Prix sans écart net, mais ces annonces partent plus vite."; }
      if (verdict === "privilegier" && slow) item.detail = "Prix plus élevé, mais vente plus lente.";
      const mk: Record<string, { pct: number; t: number }> = {};
      for (const [lab, f2] of [["CH", fitCh], ["DE", fitDe]] as Array<[string, Fit | null]>) {
        if (f2) {
          const j = idx(f2, `${kind}:${key}`);
          if (j >= 0) mk[lab] = { pct: pctOf(f2.beta[j]), t: r1(f2.beta[j] / Math.sqrt(Math.max(f2.cov[j][j], 1e-12))) };
        }
      }
      if (mk.CH && mk.DE) {
        item.by_market = mk;
        const [a, c] = [mk.CH, mk.DE];
        if ((Math.abs(a.t) >= 2 || Math.abs(c.t) >= 2) && (a.pct * c.pct < 0 || Math.min(Math.abs(a.t), Math.abs(c.t)) < 1)) {
          item.market_dependent = true;
          item.detail = ((item.detail ?? "") + " Effet différent selon le marché (CH/DE).").trim();
        }
      }
      item.verdict = verdict;
      res.items.push(item);
    }
    res.note = "Effets mesurés à état, âge et kilométrage comparables. Ce sont des corrélations : une option présente sur des voitures mieux entretenues peut paraître plus rentable qu'elle ne l'est.";
    const order: Record<string, number> = { privilegier: 0, eviter: 1, neutre: 2, insuffisant: 3 };
    res.items.sort((a, b) => order[a.verdict] - order[b.verdict] || Math.abs(b.t ?? 0) - Math.abs(a.t ?? 0));
    return res;
  }
}
