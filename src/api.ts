// API HTTP (appelée par l'interface web) et point d'entrée du déclencheur planifié.
import { WEB } from "./webassets";
import { waitUntil } from "@neon/functions";
import { db, type Sql } from "./db";
import { STATUS, isRunning, refreshStats, runCycle, type CollectConfig } from "./collector";
import { median } from "./linalg";
import { catalogPublic } from "./options";
import { reference } from "./modelid";
import { REGISTRY, DEFAULT_SOURCES } from "./sources";
import { ValuationService, ageOf, DEFAULTS, type EstimateSpec, type Row } from "./valuation";

const env = (k: string, d: string) => process.env[k] ?? d;
export const collectConfig = (): CollectConfig => ({
  delayS: Number(env("REQUEST_DELAY_S", "4")),
  respectRobots: !/^(0|false|non|no)$/i.test(env("RESPECT_ROBOTS", "true")),
  maxDetailsPerDay: Number(env("MAX_DETAILS_PER_DAY", "1200")),
  staleAfterDays: Number(env("STALE_AFTER_DAYS", "3")),
  fxFallback: Number(env("FX_CHF_EUR", "1.07")),
  sources: env("SOURCES", DEFAULT_SOURCES.join(",")).split(",").map((s) => s.trim()).filter((s) => REGISTRY[s]),
});

const CYCLE_BUDGET_MS = Number(env("CYCLE_BUDGET_S", "660")) * 1000;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-token, authorization",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...CORS } });
const fail = (status: number, detail: string) => json({ detail }, status);

// --------------------------------------------------------------------------- données → service de valorisation
let svc: ValuationService | null = null;
let svcKey = "";

async function service(sql: Sql): Promise<ValuationService> {
  const k = await sql`SELECT count(*) AS c, max(last_seen) AS m, count(*) FILTER (WHERE active) AS a FROM listings`;
  const key = `${k[0].c}|${k[0].m ? new Date(k[0].m).getTime() : 0}|${k[0].a}`;
  if (svc && key === svcKey) return svc;
  const raw = await sql`
    SELECT id, source, url, title, country, family, generation, version, segment, price, price_eur, currency, year, month, km, power_ps,
           options, flags, first_seen, published_at, active, model_conf
    FROM listings WHERE active AND segment IS NOT NULL AND price_eur > 0 AND year IS NOT NULL AND km IS NOT NULL`;
  const rows: Row[] = raw.map((r) => ({
    id: r.id, source: r.source, url: r.url, title: r.title ?? "", country: r.country, family: r.family, generation: r.generation,
    version: r.version ?? "", segment: r.segment, priceEur: r.price_eur, price: r.price, currency: r.currency, year: r.year, month: r.month,
    km: r.km, powerPs: r.power_ps, opts: new Set<string>(r.options ?? []), conds: new Set<string>(r.flags ?? []),
    firstSeen: r.first_seen ? new Date(r.first_seen) : null, publishedAt: r.published_at ? new Date(r.published_at) : null,
    active: r.active, isDemo: false, modelConf: r.model_conf, age: ageOf(r.year, r.month) ?? 0, ch: r.country === "CH" ? 1 : 0,
  }));
  const fx = (await sql`SELECT chf_eur FROM fx_rates ORDER BY day DESC LIMIT 1`)[0]?.chf_eur ?? null;
  // écart entre premier et dernier prix des annonces retirées (≥ 15 pour être publié)
  const gone = await sql`
    SELECT (array_agg(h.price_eur ORDER BY h.seen_at))[1] AS first, (array_agg(h.price_eur ORDER BY h.seen_at DESC))[1] AS last
    FROM listings l JOIN price_history h ON h.listing_id = l.id WHERE NOT l.active AND l.removed_at IS NOT NULL GROUP BY l.id`;
  const ratios = gone.filter((g) => g.first > 0 && g.last > 0).map((g) => g.last / g.first - 1);
  const discount = ratios.length >= 15 ? { medianPct: median(ratios) * 100, n: ratios.length } : null;
  const rem = await sql`
    SELECT family, options, flags, COALESCE(published_at, first_seen) AS s, removed_at AS e FROM listings WHERE NOT active AND removed_at IS NOT NULL AND family IS NOT NULL`;
  const dom = rem.map((r) => ({
    family: r.family as string, keys: new Set<string>([...(r.options ?? []), ...(r.flags ?? [])]),
    days: Math.floor((new Date(r.e).getTime() - new Date(r.s).getTime()) / 86400000),
  })).filter((d) => d.days >= 0);
  const s = new ValuationService({
    minSegmentN: Number(env("MIN_SEGMENT_N", String(DEFAULTS.minSegmentN))), minProjectionN: Number(env("MIN_PROJECTION_N", String(DEFAULTS.minProjectionN))),
    marketVol: Number(env("MARKET_VOL", String(DEFAULTS.marketVol))), fxFallback: Number(env("FX_CHF_EUR", String(DEFAULTS.fxFallback))),
  });
  s.load(rows, fx, discount, dom);
  svc = s; svcKey = key;
  return s;
}

// --------------------------------------------------------------------------- authentification
function authorized(req: Request): boolean {
  const tok = process.env.APP_TOKEN;
  if (!tok) return true;
  const got = req.headers.get("x-token") || (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  return got === tok;
}

// --------------------------------------------------------------------------- routes
export async function handle(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  // déclencheur planifié (appel POST sans identifiants, attesté par l'en-tête posé par Neon)
  if (req.method === "POST" && path === "/") {
    if (!req.headers.get("x-neon-trigger-invocation-id")) return fail(403, "appel non planifié");
    const sql = db();
    waitUntil(runCycle(sql, collectConfig(), CYCLE_BUDGET_MS).catch((e) => console.error("cycle", e)));
    return json({ accepted: true });
  }
  if (path === "/healthz") return json({ ok: true, app: "cotesport" });
  if (req.method === "GET" && !path.startsWith("/api/")) {
    const a = WEB[path === "/" ? "/index.html" : path];
    if (a) return new Response(a.b, { headers: { "content-type": a.t, "cache-control": path === "/sw.js" ? "no-cache" : "public, max-age=300" } });
  }

  if (path === "/api/auth-check") {
    const need = !!process.env.APP_TOKEN;
    return json({ required: need, ok: !need || authorized(req) });
  }
  if (!path.startsWith("/api/")) return fail(404, "introuvable");
  if (!authorized(req)) return fail(401, "Jeton requis");

  const sql = db();
  try {
    if (path === "/api/config" && req.method === "GET") {
      const ref = reference().BMW.families;
      return json({
        auth_required: !!process.env.APP_TOKEN,
        families: Object.fromEntries(Object.entries(ref).map(([f, fd]) => [f, fd.generations.map((g) => ({ code: g.code, years: g.years, versions: g.versions }))])),
        options: catalogPublic(),
        sources: collectConfig().sources.map((n) => ({ name: n, label: REGISTRY[n].label, country: REGISTRY[n].country })),
      });
    }

    if (path === "/api/summary" && req.method === "GET") return json(await summary(sql));

    if (path === "/api/estimate" && req.method === "POST") {
      const body = (await req.json().catch(() => null)) as EstimateSpec | null;
      if (!body || !body.family || !body.generation || !Number.isFinite(Number(body.year)) || !Number.isFinite(Number(body.km)) || Number(body.km) < 0) return fail(400, "Paramètres invalides");
      if (!reference().BMW.families[body.family]) return fail(400, "Famille inconnue");
      const s = await service(sql);
      return json(s.estimate({ ...body, options: (body.options ?? []).slice(0, 40), flags: (body.flags ?? []).slice(0, 20) }));
    }

    let m = path.match(/^\/api\/options\/([^/]+)$/);
    if (m && req.method === "GET") return json((await service(sql)).optionsRanking(decodeURIComponent(m[1])));

    if (path === "/api/listings" && req.method === "GET") return json(await listings(sql, url));

    if (path === "/api/watch" && req.method === "GET") {
      const s = await service(sql);
      const rows = await sql`SELECT id, label, params, created_at FROM watch ORDER BY id DESC`;
      return json(rows.map((r) => {
        let est: unknown = {};
        try { est = s.estimate(r.params); } catch { /* suivi sans estimation */ }
        return { id: r.id, name: r.label, spec: r.params, created_at: r.created_at, estimate: est };
      }));
    }
    if (path === "/api/watch" && req.method === "POST") {
      const b = (await req.json().catch(() => null)) as { name?: string; spec?: unknown } | null;
      if (!b?.name || typeof b.spec !== "object" || !b.spec) return fail(400, "Paramètres invalides");
      await sql`INSERT INTO watch(label, params) VALUES (${String(b.name).slice(0, 80)}, ${JSON.stringify(b.spec)}::jsonb)`;
      return json({ ok: true });
    }
    m = path.match(/^\/api\/watch\/(\d+)$/);
    if (m && req.method === "DELETE") { await sql`DELETE FROM watch WHERE id = ${Number(m[1])}`; return json({ ok: true }); }

    if (path === "/api/health" && req.method === "GET") return json(await health(sql));

    if (path === "/api/collect" && req.method === "POST") {
      if (await isRunning(sql)) return fail(409, "Une collecte est déjà en cours");
      const only = url.searchParams.get("source");
      waitUntil(runCycle(sql, collectConfig(), CYCLE_BUDGET_MS, only ? [only] : undefined).catch((e) => console.error("cycle", e)));
      return json({ started: true });
    }
    if (path === "/api/demo") return fail(404, "Pas de données de démonstration : l'outil travaille sur les annonces réelles.");
  } catch (e) {
    console.error(path, e);
    return fail(500, "Erreur interne : " + (e as Error).message);
  }
  return fail(404, "introuvable");
}

// --------------------------------------------------------------------------- réponses composées
async function summary(sql: Sql) {
  const s = await service(sql);
  const tot = (await sql`SELECT count(*) AS c, count(*) FILTER (WHERE active) AS a FROM listings`)[0];
  const last = (await sql`SELECT max(finished_at) AS m FROM runs WHERE status IN ('ok','partial')`)[0].m;
  const seg = new Map<string, { family: string; generation: string; ch: number[]; de: number[]; km: number[]; age: number[] }>();
  for (const r of s.rows) {
    const e = seg.get(r.segment) ?? seg.set(r.segment, { family: r.family, generation: r.generation, ch: [], de: [], km: [], age: [] }).get(r.segment)!;
    (r.country === "CH" ? e.ch : e.de).push(r.priceEur); e.km.push(r.km); e.age.push(r.age);
  }
  const hist = await sql`SELECT segment, day, median_eur FROM segment_stats WHERE country = 'ALL' ORDER BY day`;
  const byseg = new Map<string, Array<[string, number]>>();
  for (const h of hist) (byseg.get(h.segment) ?? byseg.set(h.segment, []).get(h.segment)!).push([h.day, h.median_eur]);
  const r0 = (v: number) => Math.round(v), r1 = (v: number) => Math.round(v * 10) / 10;
  const out = [...seg.entries()].map(([segment, e]) => {
    const all = [...e.ch, ...e.de];
    const h = byseg.get(segment) ?? [];
    let trend: number | null = null, since: string | undefined;
    if (h.length >= 2 && h[0][0] !== h[h.length - 1][0]) { trend = r1((h[h.length - 1][1] / h[0][1] - 1) * 100); since = h[0][0]; }
    return {
      segment, family: e.family, generation: e.generation, n: all.length, n_ch: e.ch.length, n_de: e.de.length,
      median_eur: r0(median(all)), median_ch_eur: e.ch.length ? r0(median(e.ch)) : null, median_de_eur: e.de.length ? r0(median(e.de)) : null,
      median_km: r0(median(e.km)), median_age: r1(median(e.age)),
      ch_premium_pct: e.ch.length >= 5 && e.de.length >= 5 ? r1((median(e.ch) / median(e.de) - 1) * 100) : null,
      trend_pct: trend, trend_since: since,
    };
  }).sort((a, b) => b.n - a.n);
  return { listings: tot.c, active: tot.a, demo: false, last_collect: last, fx_chf_eur: s.fx, segments: out, collecting: STATUS.running || (await isRunning(sql)) };
}

async function listings(sql: Sql, url: URL) {
  const s = await service(sql);
  const q = url.searchParams;
  const family = q.get("family") || "", generation = q.get("generation") || "", market = (q.get("market") || "").toUpperCase(), text = (q.get("q") || "").toLowerCase();
  const sort = ["gap", "price", "recent", "km"].includes(q.get("sort") ?? "") ? q.get("sort")! : "gap";
  const limit = Math.min(Math.max(Number(q.get("limit") ?? 60) || 60, 1), 300);
  let rows = s.rows;
  if (family) rows = rows.filter((r) => r.family === family);
  if (generation) rows = rows.filter((r) => r.generation === generation);
  if (market) rows = rows.filter((r) => (r.country === "CH") === (market === "CH"));
  if (text) rows = rows.filter((r) => r.title.toLowerCase().includes(text));
  const scores = s.scoreListings(rows);
  const out = rows.map((r) => {
    const sc = scores.get(r.id);
    return {
      id: r.id, url: r.url, title: r.title, segment: r.segment, version: r.version, year: r.year, km: r.km, country: r.country, price: r.price,
      currency: r.currency, price_eur: Math.round(r.priceEur), options: [...r.opts].sort(), flags: [...r.conds].sort(),
      first_seen: r.firstSeen?.toISOString() ?? null, source: r.source, demo: false,
      expected_eur: sc?.expected_eur ?? null, gap_pct: sc?.gap_pct ?? null, model_conf: r.modelConf,
    };
  });
  const keyf: Record<string, (a: any, b: any) => number> = {
    gap: (a, b) => (a.gap_pct == null ? 1 : b.gap_pct == null ? -1 : a.gap_pct - b.gap_pct),
    price: (a, b) => a.price_eur - b.price_eur,
    recent: (a, b) => String(b.first_seen ?? "").localeCompare(String(a.first_seen ?? "")),
    km: (a, b) => (a.km ?? 0) - (b.km ?? 0),
  };
  out.sort(keyf[sort]);
  return { total: out.length, items: out.slice(0, limit) };
}

async function health(sql: Sql) {
  const cfg = collectConfig();
  const last = await sql`SELECT DISTINCT ON (source) source, day, started_at, finished_at, status, pages, seen AS found, new_count AS new, details, removed, skipped, error AS message
                         FROM runs ORDER BY source, day DESC`;
  const hist = await sql`SELECT day, source, status, pages, seen AS found, new_count AS new, details, removed, error AS message FROM runs ORDER BY day DESC, source LIMIT 30`;
  const fx = (await sql`SELECT day, chf_eur, origin AS source FROM fx_rates ORDER BY day DESC LIMIT 1`)[0] ?? null;
  const bySrc = await sql`SELECT source, count(*) AS n, count(*) FILTER (WHERE active) AS a, count(*) FILTER (WHERE has_detail) AS d FROM listings GROUP BY source`;
  const queue = await sql`SELECT source, status, count(*) AS n FROM crawl_queue WHERE day = CURRENT_DATE GROUP BY source, status`;
  const blocked = await sql`SELECT source, blocked_until, last_error FROM source_state WHERE blocked_until > now()`;
  const running = STATUS.running || (await isRunning(sql));
  return {
    last: last.map((r) => ({ ...r, finished_at: r.finished_at ?? null, status: r.status })), history: hist, fx, by_source: bySrc, queue, blocked,
    status: { running, current: STATUS.current },
    settings: { sources: cfg.sources, delay_s: cfg.delayS, robots: cfg.respectRobots, mode: "http", collect_hour: "toute la journée (reprise toutes les 15 min)", scheduler: true },
  };
}

export { refreshStats };
