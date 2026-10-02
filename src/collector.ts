// Collecte : file de pages par jour, lecture polie (une requête toutes les ~4 s par site), historique de prix,
// descriptions des nouvelles annonces, annonces retirées. Chaque passage a un budget de temps ; la file reprend au passage suivant.
import type { Sql } from "./db";
import { Blocked, Fetcher, FetchError, RobotsDisallowed } from "./fetcher";
import { addMarkers, newParsed, type Parsed } from "./normalize";
import { extract } from "./options";
import { resolve } from "./modelid";
import { colorFromText } from "./colors";
import { median } from "./linalg";
import { REGISTRY, type Source } from "./sources";

export interface CollectConfig {
  delayS: number; respectRobots: boolean; maxDetailsPerDay: number; staleAfterDays: number; fxFallback: number; sources: string[];
}

export const STATUS = { running: false, current: "" };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --------------------------------------------------------------------------- verrou (un seul passage à la fois)
async function acquire(sql: Sql, ms: number): Promise<boolean> {
  const rows = await sql`
    INSERT INTO locks(name, until) VALUES ('collect', now() + make_interval(secs => ${ms / 1000}::float8))
    ON CONFLICT (name) DO UPDATE SET until = EXCLUDED.until WHERE locks.until < now()
    RETURNING name`;
  return rows.length > 0;
}
const release = (sql: Sql) => sql`UPDATE locks SET until = now() - interval '1 second' WHERE name = 'collect'`;
export const requestStop = (sql: Sql) => sql`INSERT INTO locks(name, until) VALUES ('stop', now() + interval '30 minutes') ON CONFLICT (name) DO UPDATE SET until = EXCLUDED.until`;
const clearStop = (sql: Sql) => sql`UPDATE locks SET until = now() - interval '1 second' WHERE name = 'stop'`;
export async function stopRequested(sql: Sql): Promise<boolean> {
  const r = await sql`SELECT 1 FROM locks WHERE name = 'stop' AND until > now()`;
  return r.length > 0;
}

/** Réévalue le modèle de toutes les annonces avec les règles actuelles (corrige les erreurs de classement passées). */
export async function reclassifyAll(sql: Sql): Promise<number> {
  const rows = await sql`SELECT id, source, has_detail, title, description, options, flags, color, year, power_ps, make, segment, version, model_conf FROM listings`;
  let changed = 0;
  for (const r of rows) {
    // options / état / couleur relus avec le dictionnaire courant : la détection est entièrement refaite à partir du texte enregistré.
    // Seules les informations issues de champs structurés, qui n'ont pas de trace dans le texte, sont conservées (et inscrites dans la description).
    const oldO: string[] = Array.isArray(r.options) ? r.options : [], oldF: string[] = Array.isArray(r.flags) ? r.flags : [];
    let desc: string = r.description ?? "";
    const structured = [...oldO.filter((k) => ["manual", "xdrive", "winter_tires"].includes(k)), ...oldF.filter((k) => k === "accident" ||
      (r.has_detail && r.source !== "autoscout24_de" && ["accident_free", "service_history", "first_owner", "warranty"].includes(k)))];
    const withMarkers = addMarkers(desc, structured);
    const [o, c] = extract(`${r.title}\n${withMarkers}`);
    const newO = uniq(o), newF = uniq(c.filter((f) => !f.startsWith("_")));
    const [col, colName] = r.color ? [null, null] : colorFromText(`${r.title}\n${withMarkers}`);
    const same = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
    if (!same(newO, oldO) || !same(newF, oldF) || col || withMarkers !== desc) {
      await sql`UPDATE listings SET options = ${JSON.stringify(newO)}::text::jsonb, flags = ${JSON.stringify(newF)}::text::jsonb, description = ${withMarkers},
                color = COALESCE(color, ${col}), color_name = COALESCE(color_name, ${colName}) WHERE id = ${r.id}`;
      changed++;
    }
    const res = resolve(r.title, r.year, r.power_ps, r.make ?? "BMW");
    if (!res) {
      if (r.segment !== null) { await sql`UPDATE listings SET family = NULL, generation = NULL, version = NULL, segment = NULL, model_conf = NULL WHERE id = ${r.id}`; changed++; }
    } else if (res.segment !== r.segment || res.version !== r.version) {
      await sql`UPDATE listings SET family = ${res.family}, generation = ${res.generation}, version = ${res.version}, segment = ${res.segment}, model_conf = ${res.confidence} WHERE id = ${r.id}`;
      changed++;
    }
  }
  if (changed) await refreshStats(sql);
  return changed;
}

export async function isRunning(sql: Sql): Promise<boolean> {
  const r = await sql`SELECT 1 FROM locks WHERE name = 'collect' AND until > now()`;
  return r.length > 0;
}

// --------------------------------------------------------------------------- taux de change
export async function getFx(sql: Sql, fallback: number): Promise<number> {
  const today = await sql`SELECT chf_eur FROM fx_rates WHERE day = CURRENT_DATE`;
  if (today.length) return today[0].chf_eur;
  let rate: number | null = null, origin = "BCE";
  try {
    const r = await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", { signal: AbortSignal.timeout(15000) });
    const m = (await r.text()).match(/currency='CHF'\s+rate='([\d.]+)'/);
    if (m) rate = 1 / Number(m[1]);
  } catch { /* repli ci-dessous */ }
  if (rate == null) {
    const last = await sql`SELECT chf_eur FROM fx_rates ORDER BY day DESC LIMIT 1`;
    rate = last.length ? (last[0].chf_eur as number) : fallback;
    origin = last.length ? "dernier connu" : "repli (réglage)";
  }
  const rateOk: number = rate;
  await sql`INSERT INTO fx_rates(day, chf_eur, origin) VALUES (CURRENT_DATE, ${rateOk}, ${origin}) ON CONFLICT (day) DO UPDATE SET chf_eur = EXCLUDED.chf_eur, origin = EXCLUDED.origin`;
  return rateOk;
}

// --------------------------------------------------------------------------- enregistrement d'une annonce
const toEur = (price: number | null, cur: string, fx: number) => (price == null ? null : cur === "EUR" ? price : price * fx);
const uniq = (a: string[]) => [...new Set(a)];

function enrich(p: Parsed) {
  p.description = addMarkers(p.description, [...p.extraOptions, ...p.extraFlags.filter((f) => !f.startsWith("_"))]);
  const res = resolve(p.title, p.year, p.powerPs, p.make);
  const [o, c] = extract(`${p.title}\n${p.description}`);
  const options = uniq([...o, ...p.extraOptions]);
  let flags = uniq([...c, ...p.extraFlags]).filter((f) => !f.startsWith("_"));
  // indicateurs structurés prioritaires sur le texte pour accident / sans accident
  if (p.extraFlags.includes("accident_free") && !p.extraFlags.includes("accident")) flags = flags.filter((f) => f !== "accident");
  if (p.extraFlags.includes("accident") && !p.extraFlags.includes("accident_free")) flags = flags.filter((f) => f !== "accident_free");
  let color = p.color, colorName = p.colorName;
  if (!color) { [color, colorName] = colorFromText(`${p.title}\n${p.description}`); }
  return { res, options, flags, color, colorName };
}

interface Counters { pages: number; seen: number; newCount: number; details: number; skipped: number }
const zero = (): Counters => ({ pages: 0, seen: 0, newCount: 0, details: 0, skipped: 0 });

async function saveItem(sql: Sql, p: Parsed, fx: number, c: Counters): Promise<void> {
  c.seen++;
  const e = enrich(p);
  if (!e.res || p.price == null) { c.skipped++; return; }
  const eur = toEur(p.price, p.currency, fx);
  const ex = await sql`SELECT id, price FROM listings WHERE source = ${p.source} AND ext_id = ${p.extId}`;
  if (ex.length) {
    const changed = Math.abs(ex[0].price - p.price) > 0.5;
    await sql`UPDATE listings SET last_seen = now(), active = true, removed_at = NULL, missed_scans = 0, price = ${p.price}, price_eur = ${eur},
              color = COALESCE(color, ${e.color}), color_name = COALESCE(color_name, ${e.colorName}),
              km = COALESCE(${p.km}, km), url = ${p.url}, published_at = COALESCE(published_at, ${p.publishedAt}) WHERE id = ${ex[0].id}`;
    if (changed) await sql`INSERT INTO price_history(listing_id, price, price_eur) VALUES (${ex[0].id}, ${p.price}, ${eur})`;
    return;
  }
  const r = e.res;
  const ins = await sql`
    INSERT INTO listings(source, ext_id, url, country, currency, title, description, price, price_eur, year, month, km, power_ps, make,
      family, generation, version, segment, model_conf, options, flags, published_at, has_detail, color, color_name)
    VALUES (${p.source}, ${p.extId}, ${p.url}, ${p.country}, ${p.currency}, ${p.title}, ${p.description}, ${p.price}, ${eur}, ${p.year}, ${p.month},
      ${p.km}, ${p.powerPs}, ${p.make}, ${r.family}, ${r.generation}, ${r.version}, ${r.segment}, ${r.confidence},
      ${JSON.stringify(e.options)}::text::jsonb, ${JSON.stringify(e.flags)}::text::jsonb, ${p.publishedAt}, false, ${e.color}, ${e.colorName})
    ON CONFLICT (source, ext_id) DO NOTHING RETURNING id`;
  if (ins.length) {
    c.newCount++;
    await sql`INSERT INTO price_history(listing_id, price, price_eur) VALUES (${ins[0].id}, ${p.price}, ${eur})`;
  }
}

// --------------------------------------------------------------------------- compteurs du jour
async function addCounters(sql: Sql, source: string, c: Counters, extra: { status?: string; error?: string | null } = {}) {
  await sql`
    INSERT INTO runs(day, source, status, pages, seen, new_count, details, skipped, error)
    VALUES (CURRENT_DATE, ${source}, ${extra.status ?? "running"}, ${c.pages}, ${c.seen}, ${c.newCount}, ${c.details}, ${c.skipped}, ${extra.error ?? null})
    ON CONFLICT (day, source) DO UPDATE SET pages = runs.pages + ${c.pages}, seen = runs.seen + ${c.seen},
      new_count = runs.new_count + ${c.newCount}, details = runs.details + ${c.details}, skipped = runs.skipped + ${c.skipped},
      status = CASE WHEN ${extra.status ?? null}::text IS NULL THEN runs.status ELSE ${extra.status ?? null} END,
      error = CASE WHEN ${extra.error ?? null}::text IS NULL THEN runs.error ELSE ${extra.error ?? null} END`;
}

// --------------------------------------------------------------------------- une page de résultats
const QUICK_MAX_PAGES = 8;       // passage rapide : au plus 8 pages par recherche (les plus récentes)
const FULL_EVERY_MS = 6.5 * 86400_000; // balayage complet environ une fois par semaine
const PASS_GAP_MS = 30 * 60_000;       // un nouveau passage rapide n'est lancé que 30 min après la fin du précédent

async function processTask(sql: Sql, src: Source, fetcher: Fetcher, fx: number, mode: "quick" | "full",
  t: { id: number; qkey: string; page: number }): Promise<Counters> {
  const c = zero();
  const url = src.pageUrl(t.qkey, t.page);
  STATUS.current = `${src.label} · ${t.qkey} · page ${t.page}`;
  const html = await fetcher.get(url);
  const res = src.parseResults(html);
  c.pages++;
  if (!res.items.length) {
    await sql`UPDATE crawl_queue SET status = 'done', note = ${t.page === src.firstPage ? "aucune annonce reconnue" : "fin"}, updated_at = now() WHERE id = ${t.id}`;
    if (t.page === src.firstPage) await addCounters(sql, src.name, c, { error: `Aucune annonce reconnue sur « ${t.qkey} » : la structure de la page a peut-être changé.` });
    else await addCounters(sql, src.name, c);
    return c;
  }
  for (const it of res.items) await saveItem(sql, it, fx, c);

  if (mode === "quick") {
    // passage rapide : les annonces sont triées de la plus récente à la plus ancienne ; on s'arrête dès qu'une page n'apporte rien de nouveau
    if (c.newCount > 0 && t.page - src.firstPage + 1 < QUICK_MAX_PAGES) {
      await sql`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${src.name}, ${t.qkey}, ${t.page + 1}) ON CONFLICT DO NOTHING`;
    }
    await sql`UPDATE crawl_queue SET status = 'done', note = ${c.newCount > 0 ? null : "rien de nouveau"}, updated_at = now() WHERE id = ${t.id}`;
    await addCounters(sql, src.name, c);
    return c;
  }

  const pageSize = res.items.length;
  const cap = src.maxPages * (res.pages && res.total ? Math.ceil(res.total / res.pages) : pageSize);
  let note: string | null = null;
  if (t.page === src.firstPage && res.total != null && res.total > cap * 0.95) {
    const kids = src.split(t.qkey);
    if (kids) {
      for (const k of kids) {
        await sql`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${src.name}, ${k}, ${src.firstPage}) ON CONFLICT DO NOTHING`;
      }
      await sql`UPDATE crawl_queue SET status = 'done', note = 'découpée', updated_at = now() WHERE id = ${t.id}`;
      await addCounters(sql, src.name, c);
      return c;
    }
    note = "plafonnée";
  }
  const totalPages = Math.min(res.pages ?? (res.total ? Math.ceil(res.total / pageSize) : 1), src.maxPages);
  if (t.page - src.firstPage + 1 < totalPages) {
    await sql`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${src.name}, ${t.qkey}, ${t.page + 1}) ON CONFLICT DO NOTHING`;
  } else if (res.pages && res.pages > src.maxPages) note = "plafonnée";
  await sql`UPDATE crawl_queue SET status = 'done', note = ${note}, updated_at = now() WHERE id = ${t.id}`;
  await addCounters(sql, src.name, c);
  return c;
}

// --------------------------------------------------------------------------- une page d'annonce (description, options)
async function processDetail(sql: Sql, src: Source, fetcher: Fetcher, fx: number): Promise<boolean> {
  const rows = await sql`
    SELECT id, url, title, description, year, month, km, power_ps, price, currency, country, ext_id, published_at, flags
    FROM listings WHERE source = ${src.name} AND active AND NOT has_detail AND segment IS NOT NULL
    ORDER BY first_seen DESC LIMIT 1`;
  if (!rows.length) return false;
  const r = rows[0];
  STATUS.current = `${src.label} · annonce ${r.ext_id}`;
  const c = zero();
  try {
    const html = await fetcher.get(r.url);
    const p = newParsed({ source: src.name, extId: r.ext_id, url: r.url, country: r.country, currency: r.currency, title: r.title,
      description: r.description ?? "", price: r.price, year: r.year, month: r.month, km: r.km, powerPs: r.power_ps });
    p.publishedAt = r.published_at ? new Date(r.published_at).toISOString() : null;
    src.parseDetail(html, p);
    const e = enrich(p);
    const prevFlags: string[] = r.flags ?? [];
    const flags = uniq([...e.flags, ...prevFlags.filter((f) => f === "accident" || f === "accident_free")]);
    await sql`UPDATE listings SET description = ${p.description}, options = ${JSON.stringify(e.options)}::text::jsonb, flags = ${JSON.stringify(flags)}::text::jsonb,
              published_at = COALESCE(${p.publishedAt}, published_at), power_ps = COALESCE(${p.powerPs}, power_ps),
              color = COALESCE(${e.color}, color), color_name = COALESCE(${e.colorName}, color_name), has_detail = true WHERE id = ${r.id}`;
    if (e.res) {
      await sql`UPDATE listings SET family = ${e.res.family}, generation = ${e.res.generation}, version = ${e.res.version},
                segment = ${e.res.segment}, model_conf = ${e.res.confidence} WHERE id = ${r.id}`;
    } else {
      await sql`UPDATE listings SET family = NULL, generation = NULL, version = NULL, segment = NULL, model_conf = NULL WHERE id = ${r.id}`;
    }
    c.details++;
  } catch (err) {
    if (err instanceof Blocked) throw err;
    if (err instanceof RobotsDisallowed) await sql`UPDATE listings SET has_detail = true WHERE id = ${r.id}`;
    else if (err instanceof FetchError && /HTTP (404|410)/.test(err.message)) {
      await sql`UPDATE listings SET has_detail = true, active = false, removed_at = now() WHERE id = ${r.id}`;
    } else {
      await sql`UPDATE listings SET has_detail = true WHERE id = ${r.id}`; // on n'insiste pas
      await addCounters(sql, src.name, c, { error: `Page d'annonce illisible (${r.ext_id}) : ${String((err as Error).message).slice(0, 160)}` });
    }
  }
  await addCounters(sql, src.name, c);
  void fx;
  return true;
}

// --------------------------------------------------------------------------- fin d'un passage pour une source
async function finalize(sql: Sql, src: Source, cfg: CollectConfig) {
  void cfg;
  const st = await sql`SELECT pass_mode, pass_started_at, pass_done_at FROM source_state WHERE source = ${src.name}`;
  if (!st.length || st[0].pass_done_at || !st[0].pass_started_at) return;
  const q = await sql`
    SELECT count(*) FILTER (WHERE status = 'pending') AS pending, count(*) FILTER (WHERE status = 'error') AS errors,
           count(*) FILTER (WHERE note = 'plafonnée') AS capped, count(*) AS total
    FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${src.name}`;
  if (!q[0].total || q[0].pending > 0) return;
  const mode: string = st[0].pass_mode ?? "full";
  const started: string = st[0].pass_started_at;
  const seen = (await sql`SELECT count(*)::int AS n FROM listings WHERE source = ${src.name} AND last_seen >= ${started}`)[0].n;
  let removed = 0, status = q[0].errors > 0 || q[0].capped > 0 ? "partial" : "ok", msg: string | null = null;
  let fullOk = false;
  if (mode === "full") {
    if (q[0].capped > 0) msg = "Certaines recherches dépassent le plafond de pages de la plateforme : retraits non évalués pour ce balayage.";
    if (seen === 0) { status = "empty"; msg = "Aucune annonce reconnue : la structure des pages a peut-être changé."; }
    else if (q[0].errors === 0 && q[0].capped === 0) {
      fullOk = true;
      // une annonce absente de deux balayages complets consécutifs est considérée comme vendue (ou retirée)
      await sql`UPDATE listings SET missed_scans = missed_scans + 1 WHERE source = ${src.name} AND active AND last_seen < ${started}`;
      const gone = await sql`UPDATE listings SET active = false, removed_at = last_seen WHERE source = ${src.name} AND active AND missed_scans >= 2 RETURNING id`;
      removed = gone.length;
    }
  }
  await sql`UPDATE runs SET removed = removed + ${removed}, finished_at = now(), status = ${status}, error = COALESCE(${msg}, error) WHERE day = CURRENT_DATE AND source = ${src.name}`;
  await sql`UPDATE source_state SET pass_done_at = now(), finalized_day = CURRENT_DATE, last_status = ${status}, updated_at = now(),
            last_full_at = CASE WHEN ${fullOk} THEN now() ELSE last_full_at END WHERE source = ${src.name}`;
  await refreshStats(sql);
}

export async function refreshStats(sql: Sql) {
  const rows = await sql`SELECT segment, country, price_eur FROM listings WHERE active AND segment IS NOT NULL AND price_eur > 0`;
  const g = new Map<string, number[]>();
  for (const r of rows) {
    for (const c of [r.country, "ALL"]) { const k = `${r.segment}\u0000${c}`; (g.get(k) ?? g.set(k, []).get(k)!).push(r.price_eur); }
  }
  for (const [k, vals] of g) {
    const [segment, country] = k.split("\u0000");
    await sql`INSERT INTO segment_stats(day, segment, country, n, median_eur) VALUES (CURRENT_DATE, ${segment}, ${country}, ${vals.length}, ${median(vals)})
              ON CONFLICT (day, segment, country) DO UPDATE SET n = EXCLUDED.n, median_eur = EXCLUDED.median_eur`;
  }
}

// --------------------------------------------------------------------------- un passage
export interface CycleResult { skipped?: string; sources: Record<string, string>; fx?: number }

export async function runCycle(sql: Sql, cfg: CollectConfig, budgetMs: number, only?: string[]): Promise<CycleResult> {
  if (!(await acquire(sql, budgetMs + 90_000))) return { skipped: "un passage est déjà en cours", sources: {} };
  const deadline = Date.now() + budgetMs;
  const out: CycleResult = { sources: {} };
  STATUS.running = true;
  await clearStop(sql);
  try {
    await reclassifyAll(sql);
    const fx = await getFx(sql, cfg.fxFallback);
    out.fx = fx;
    const fetcher = new Fetcher({ delayS: cfg.delayS, respectRobots: cfg.respectRobots });
    const names = (only?.length ? only : cfg.sources).filter((n) => REGISTRY[n]);
    await Promise.all(names.map(async (name) => {
      const src = REGISTRY[name];
      try { out.sources[name] = await work(sql, src, fetcher, fx, cfg, deadline); }
      catch (e) { out.sources[name] = `erreur : ${(e as Error).message}`; await addCounters(sql, name, zero(), { status: "error", error: `Erreur inattendue : ${(e as Error).message}` }); }
    }));
  } finally {
    STATUS.running = false; STATUS.current = "";
    await clearStop(sql);
    await release(sql);
  }
  return out;
}

async function work(sql: Sql, src: Source, fetcher: Fetcher, fx: number, cfg: CollectConfig, deadline: number): Promise<string> {
  const stt = await sql`SELECT blocked_until FROM source_state WHERE source = ${src.name} AND blocked_until > now()`;
  if (stt.length) return `bloquée jusqu'à ${new Date(stt[0].blocked_until).toISOString()}`;
  // plan du passage : rapide (annonces récentes) la plupart du temps, complet environ une fois par semaine
  const stRows = await sql`SELECT last_full_at, pass_mode, pass_started_at, pass_done_at FROM source_state WHERE source = ${src.name}`;
  const st = stRows[0] ?? null;
  const qn = (await sql`SELECT count(*)::int AS total, count(*) FILTER (WHERE status = 'pending')::int AS pending FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${src.name}`)[0];
  const lastDone = st?.pass_done_at ? new Date(st.pass_done_at).getTime() : null;
  let mode: "quick" | "full" = (st?.pass_mode as "quick" | "full") ?? "full";
  if (!qn.total || (qn.pending === 0 && lastDone != null && Date.now() - lastDone > PASS_GAP_MS)) {
    const lastFull = st?.last_full_at ? new Date(st.last_full_at).getTime() : 0;
    mode = Date.now() - lastFull >= FULL_EVERY_MS ? "full" : "quick";
    await sql`DELETE FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${src.name}`;
    for (const q of src.baseQueries()) {
      await sql`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${src.name}, ${q}, ${src.firstPage}) ON CONFLICT DO NOTHING`;
    }
    await sql`INSERT INTO runs(day, source, status) VALUES (CURRENT_DATE, ${src.name}, 'running') ON CONFLICT (day, source) DO UPDATE SET status = 'running', finished_at = NULL`;
    await sql`INSERT INTO source_state(source, pass_mode, pass_started_at, pass_done_at, updated_at) VALUES (${src.name}, ${mode}, now(), NULL, now())
              ON CONFLICT (source) DO UPDATE SET pass_mode = ${mode}, pass_started_at = now(), pass_done_at = NULL, updated_at = now()`;
  } else if (st && !st.pass_mode) {
    await sql`UPDATE source_state SET pass_mode = 'full', pass_started_at = COALESCE(pass_started_at, (SELECT started_at FROM runs WHERE day = CURRENT_DATE AND source = ${src.name})) WHERE source = ${src.name}`;
  }
  let did = 0;
  try {
    while (Date.now() < deadline - 25_000 && !(await stopRequested(sql))) {
      const t = await sql`SELECT id, qkey, page FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${src.name} AND status = 'pending' ORDER BY id LIMIT 1`;
      if (t.length) {
        try { await processTask(sql, src, fetcher, fx, mode, { id: t[0].id, qkey: t[0].qkey, page: t[0].page }); did++; }
        catch (e) {
          if (e instanceof Blocked) throw e;
          if (e instanceof RobotsDisallowed) await sql`UPDATE crawl_queue SET status = 'skipped', note = 'robots.txt', updated_at = now() WHERE id = ${t[0].id}`;
          else await sql`UPDATE crawl_queue SET attempts = attempts + 1, status = CASE WHEN attempts + 1 >= 3 THEN 'error' ELSE 'pending' END, note = ${String((e as Error).message).slice(0, 200)}, updated_at = now() WHERE id = ${t[0].id}`;
        }
        continue;
      }
      await finalize(sql, src, cfg);
      const used = await sql`SELECT details FROM runs WHERE day = CURRENT_DATE AND source = ${src.name}`;
      if ((used[0]?.details ?? 0) >= cfg.maxDetailsPerDay) break;
      if (!(await processDetail(sql, src, fetcher, fx))) break;
      did++;
    }
  } catch (e) {
    if (e instanceof Blocked) {
      await sql`INSERT INTO source_state(source, blocked_until, last_status, last_error, updated_at) VALUES (${src.name}, now() + interval '6 hours', 'blocked', ${e.message}, now())
                ON CONFLICT (source) DO UPDATE SET blocked_until = now() + interval '6 hours', last_status = 'blocked', last_error = ${e.message}, updated_at = now()`;
      await addCounters(sql, src.name, zero(), { status: "blocked", error: `Accès refusé par la plateforme (${e.message}). Collecte suspendue 6 h, rien n'est contourné.` });
      return "bloquée";
    }
    throw e;
  }
  await finalize(sql, src, cfg);
  return (await stopRequested(sql)) ? `arrêtée (${did} étapes)` : `${did} étapes`;
}

export { sleep };
