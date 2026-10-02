"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nf = new Intl.NumberFormat("fr-CH", { maximumFractionDigits: 0 });
const money = (v, cur) => (v == null ? "—" : nf.format(v).replace(/ /g, " ") + " " + (cur === "chf" ? "CHF" : "€"));
const pct = (v, plus = true) => (v == null ? "—" : (v > 0 && plus ? "+" : "") + v.toLocaleString("fr-CH", { maximumFractionDigits: 1 }) + " %");
const cls = (v) => (v == null ? "" : v > 0 ? "good" : v < 0 ? "bad" : "");

let CFG = null, SUMMARY = null, TOKEN = localStorage.getItem("cs_token") || "";
let lastSpec = null;

async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(TOKEN ? { "X-Token": TOKEN } : {}) };
  const r = await fetch(path, { ...opts, headers });
  if (r.status === 401) { showLogin(); throw new Error("401"); }
  if (!r.ok) { let m = r.statusText; try { m = (await r.json()).detail || m; } catch (e) {} throw new Error(m); }
  return r.json();
}

function showLogin(err) { $("#login").hidden = false; $("#login-err").textContent = err || ""; setTimeout(() => $("#tok").focus(), 50); }
$("#login form").addEventListener("submit", async (e) => {
  e.preventDefault();
  TOKEN = $("#tok").value.trim();
  const r = await fetch("/api/auth-check", { headers: { "X-Token": TOKEN } }).then((r) => r.json());
  if (r.ok) { localStorage.setItem("cs_token", TOKEN); $("#login").hidden = true; init(); }
  else showLogin("Jeton incorrect.");
});

// ---------- onglets
$("#tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  $$("#tabs button").forEach((x) => x.classList.toggle("on", x === b));
  $$(".tab").forEach((t) => t.classList.toggle("on", t.id === "tab-" + b.dataset.tab));
  const t = b.dataset.tab;
  if (t === "market") refreshMarket(true);
  if (t === "options") loadOptions();
  if (t === "listings") loadListings();
  if (t === "watch") loadWatch();
  if (t === "sources") loadSources();
  if (t === "leasing" || t === "import") { const f = $("#fr-" + t); if (!f.getAttribute("src")) f.src = f.dataset.src; }
  history.replaceState(null, "", "#" + t);
});

// ---------- marché
let segSort = { key: "n", dir: -1 };
const sig = (s) => `${s.listings}|${s.active}|${s.last_collect}|${s.segments.length}`;
async function loadMarket() {
  SUMMARY = await api("/api/summary");
  SUMMARY._sig = sig(SUMMARY);
  $("#mk-updated").textContent = "mis à jour à " + new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });
  $("#fxline").textContent = `1 CHF = ${SUMMARY.fx_chf_eur.toFixed(3)} €`;
  const b = $("#banner");
  if (SUMMARY.demo) { b.hidden = false; b.textContent = "Données de DÉMONSTRATION (synthétiques). Elles seront remplacées dès la première collecte réelle (onglet Sources)."; }
  else if (!SUMMARY.listings) { b.hidden = false; b.textContent = "Aucune donnée pour l'instant : lancez une collecte ou chargez la démo dans l'onglet Sources."; }
  else b.hidden = true;
  $("#kpis").innerHTML = [
    ["Annonces actives", nf.format(SUMMARY.active)], ["Annonces suivies", nf.format(SUMMARY.listings)],
    ["Segments", SUMMARY.segments.length], ["Dernière collecte", SUMMARY.last_collect ? new Date(SUMMARY.last_collect).toLocaleString("fr-CH", { dateStyle: "short", timeStyle: "short" }) : "—"],
  ].map(([k, v]) => `<div class="card"><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join("");
  applyMarketAvailability();
  renderSegments();
}
const MARKETS = { CH: ["🇨🇭", "Suisse"], DE: ["🇩🇪", "Allemagne"], FR: ["🇫🇷", "France"], ES: ["🇪🇸", "Espagne"] };
const MARKET_ORDER = ["CH", "DE", "FR", "ES"];
/** Pays pour lesquels il existe des annonces ; les choix de pays n'apparaissent que pour ceux-là. */
function applyMarketAvailability() {
  const has = (c) => SUMMARY.segments.some((s) => s["n_" + c.toLowerCase()] > 0);
  const av = MARKET_ORDER.filter(has);
  CFG.markets = av.length ? av : ["DE"];
  CFG.hasCH = CFG.markets.includes("CH");
  const sel = $("#f-market"), prev = sel.value;
  sel.innerHTML = CFG.markets.map((c) => `<option value="${c}">${MARKETS[c][0]} ${MARKETS[c][1]}</option>`).join("");
  sel.value = CFG.markets.includes(prev) ? prev : CFG.markets.includes("CH") ? "CH" : CFG.markets[0];
  sel.closest("label").hidden = CFG.markets.length < 2;
}
function renderSegments() {
  const cur = $("#mk-currency").value, fx = SUMMARY.fx_chf_eur, mk = CFG.markets;
  const conv = (v) => (v == null ? null : cur === "chf" ? v / fx : v);
  const cols = [["segment", "Segment", ""], ["n", "Annonces", "num"], ["median_age", "Âge méd.", "num"], ["median_km", "Km méd.", "num"],
    ...mk.map((c) => [`median_${c.toLowerCase()}_eur`, `Médiane ${c}`, "num"]),
    ...(mk.includes("DE") ? mk.filter((c) => c !== "DE").map((c) => [`${c.toLowerCase()}_premium_pct`, `${c} vs DE`, "num"]) : []), ["trend_pct", "Tendance", "num"]];
  $("#segtable thead").innerHTML = "<tr>" + cols.map(([k, t, c]) => `<th data-sort="${k}" class="${c}">${t}</th>`).join("") + "</tr>";
  const rows = [...SUMMARY.segments].sort((a, b) => {
    const x = a[segSort.key], y = b[segSort.key];
    if (x == null) return 1; if (y == null) return -1;
    return (typeof x === "string" ? x.localeCompare(y) : x - y) * segSort.dir;
  });
  $("#segtable tbody").innerHTML = rows.map((s) => {
    const split = mk.length > 1 ? `<small class="muted">(${mk.map((c) => s["n_" + c.toLowerCase()] + " " + c).join(" · ")})</small>` : "";
    const tds = cols.slice(2).map(([k]) => {
      const v = s[k];
      if (k === "median_age") return `<td class="num">${v} ans</td>`;
      if (k === "median_km") return `<td class="num">${nf.format(v)}</td>`;
      if (k.endsWith("_eur")) return `<td class="num">${money(conv(v), cur)}</td>`;
      return `<td class="num ${cls(v)}">${v == null ? "—" : pct(v)}</td>`;
    }).join("");
    return `<tr><td><b>${esc(s.segment)}</b></td><td class="num">${s.n} ${split}</td>${tds}</tr>`;
  }).join("") || `<tr><td colspan="${cols.length}" class="muted">Aucune donnée.</td></tr>`;
}
$("#mk-currency").addEventListener("change", renderSegments);
/** Recharge le marché (et la compatibilité des options) ; avertit si de nouvelles données sont arrivées. */
async function refreshMarket(quiet) {
  const btn = $("#btn-refresh"); btn.disabled = true;
  try {
    const before = SUMMARY?._sig;
    CFG = await api("/api/config");
    await loadMarket(); fillFamilySelectsKeep();
    if (before && before !== SUMMARY._sig) { toast("Nouvelles données de marché chargées."); if ($("#tab-listings").classList.contains("on")) loadListings(); }
    else if (!quiet) toast("Le marché est déjà à jour.");
  } catch (e) { if (e.message !== "401" && !quiet) toast("Actualisation impossible : " + e.message); }
  finally { btn.disabled = false; }
}
$("#btn-refresh").addEventListener("click", () => refreshMarket(false));
// actualisation automatique : à l'ouverture de l'onglet, au retour sur la page, et toutes les 60 s (plus vite pendant une collecte)
let autoT = null;
function scheduleAuto() {
  clearTimeout(autoT);
  autoT = setTimeout(async () => { if (!document.hidden && CFG) await refreshMarket(true); scheduleAuto(); }, SUMMARY?.collecting ? 15000 : 60000);
}
document.addEventListener("visibilitychange", () => { if (!document.hidden && CFG) refreshMarket(true); });
$("#segtable thead").addEventListener("click", (e) => {
  const th = e.target.closest("th[data-sort]"); if (!th) return;
  const k = th.dataset.sort; segSort = { key: k, dir: segSort.key === k ? -segSort.dir : -1 }; renderSegments();
});

// ---------- formulaire d'estimation
/** Après un rechargement de la configuration : conserve les choix en cours, met à jour les puces compatibles. */
function fillFamilySelectsKeep() { renderEstimateChips(); renderListingChips(); fillListGens(); fillBodySelect(); }
function fillFamilySelects() {
  const fams = Object.keys(CFG.families);
  for (const id of ["#f-family", "#o-family"]) $(id).innerHTML = fams.map((f) => `<option>${esc(f)}</option>`).join("");
  $("#l-family").innerHTML = `<option value="">Tous les modèles</option>` + fams.map((f) => `<option>${esc(f)}</option>`).join("");
  $("#f-family").value = "M3"; $("#o-family").value = "M3"; fillOptGens();
  renderListingChips(); fillListGens(); fillBodySelect();
  onFamily();
}
const chip = (o) => `<label class="chip"><input type="checkbox" value="${esc(o.key)}"><span>${esc(o.label)}</span></label>`;
/** Clés d'équipements réellement proposées pour un modèle (ou une génération) ; null = pas d'information, tout afficher. */
function compatKeys(family, generation) {
  if (!CFG.compat) return null;
  if (family && generation) { const c = CFG.compat[`${family} ${generation}`]; return c ? new Set(c.options) : null; }
  if (family) { const u = new Set(); for (const [k, c] of Object.entries(CFG.compat)) if (k.startsWith(family + " ")) c.options.forEach((x) => u.add(x)); return u; }
  return null;
}
function fillChips(sel, kind, av) {
  const sels = $$(sel + " input:checked").map((i) => i.value);
  $(sel).innerHTML = CFG.options.filter((o) => o.kind === kind && (kind === "cond" || !av || av.has(o.key))).map(chip).join("");
  $$(sel + " input").forEach((i) => { i.checked = sels.includes(i.value); });
  const fs = $(sel).closest("fieldset"); if (fs) fs.hidden = !$(sel).innerHTML;
}
function renderEstimateChips() {
  const av = compatKeys($("#f-family").value, $("#f-gen").value);
  fillChips("#f-options", "option", av); fillChips("#f-bodies", "body", av); fillChips("#f-flags", "cond", av);
}
function renderListingChips() {
  const av = compatKeys($("#l-family").value, $("#l-gen").value);
  const kinds = [["#l-options", "option"], ["#l-bodies", "body"], ["#l-flags", "cond"]];
  for (const [sel, k] of kinds) { const prev = $$(sel + " input:checked").map((i) => i.value); $(sel).innerHTML = CFG.options.filter((o) => o.kind === k && !(sel === "#l-bodies" && o.key.startsWith("body_")) && (k === "cond" || !av || av.has(o.key))).map(chip).join(""); $$(sel + " input").forEach((i) => { i.checked = prev.includes(i.value); }); }
}
function onFamily() {
  const gens = CFG.families[$("#f-family").value];
  $("#f-gen").innerHTML = gens.map((g) => `<option value="${esc(g.code)}">${esc(g.code)} (${g.years[0]}–${g.years[1] > 2030 ? "…" : g.years[1]})</option>`).join("");
  $("#f-gen").value = gens[gens.length - 1].code; onGen();
}
function onGen() {
  const g = CFG.families[$("#f-family").value].find((x) => x.code === $("#f-gen").value);
  $("#f-version").innerHTML = g.versions.map((v) => `<option value="${esc(v.name)}">${esc(v.name)} · ${v.ps} ch</option>`).join("");
  const y = parseInt($("#f-year").value) || 2022;
  const hi = Math.min(g.years[1], new Date().getFullYear());
  if (y < g.years[0] || y > hi) $("#f-year").value = Math.min(Math.max(y, g.years[0]), hi);
  renderEstimateChips();
}
$("#f-family").addEventListener("change", onFamily);
$("#f-gen").addEventListener("change", onGen);

function readSpec() {
  const v = (id) => $(id).value;
  return {
    family: v("#f-family"), generation: v("#f-gen"), version: v("#f-version"), year: parseInt(v("#f-year")),
    month: v("#f-month") ? parseInt(v("#f-month")) : null, km: parseInt(v("#f-km") || "0"), market: v("#f-market"),
    km_per_year: v("#f-kmpy") ? parseInt(v("#f-kmpy")) : null,
    options: $$("#f-options input:checked, #f-bodies input:checked").map((i) => i.value), flags: $$("#f-flags input:checked").map((i) => i.value),
  };
}
$("#estform").addEventListener("submit", async (e) => {
  e.preventDefault();
  const spec = readSpec(); lastSpec = spec;
  const box = $("#result"); box.innerHTML = `<p class="hint">Calcul…</p>`;
  try { renderResult(await api("/api/estimate", { method: "POST", body: JSON.stringify(spec) }), spec); }
  catch (err) { box.innerHTML = `<p class="bad">${esc(err.message)}</p>`; }
});
$("#btn-watch").addEventListener("click", async () => {
  const spec = readSpec();
  const name = prompt("Nom du véhicule suivi", `${spec.family} ${spec.generation} ${spec.year}`);
  if (!name) return;
  await api("/api/watch", { method: "POST", body: JSON.stringify({ name, spec }) });
  $('#tabs button[data-tab="watch"]').click();
});

function confBadge(c) {
  const m = { "élevée": "high", moyenne: "mid", faible: "low", aucune: "low" }[c] || "low";
  return `<span class="badge ${m}">confiance ${esc(c)}</span>`;
}
function renderResult(r, spec) {
  const box = $("#result");
  if (!r.value) { box.classList.remove("has-rail"); box.innerHTML = `<h2>${esc(r.segment)}</h2><p class="warn">${esc(r.message || "Estimation impossible.")}</p>`; return; }
  const main = spec.market === "CH" ? "chf" : "eur", other = main === "chf" ? "eur" : "chf";
  const v = r.value;
  box.classList.add("has-rail");
  let h = `<div class="res-main"><h2>${esc(r.segment)} · ${esc(spec.version || "")}</h2>
    <div class="big">${money(v[main], main)}</div>
    <div class="range">fourchette 80 % : ${money(v["low_" + main], main)} – ${money(v["high_" + main], main)} · ${money(v[other], other)}</div>
    <p>${confBadge(r.confidence)} <span class="muted">${r.n} annonces · écart-type du modèle ${r.sigma_pct ?? "—"} % · méthode ${esc((r.method || "").replace("_", " "))}</span></p>`;
  if (r.message) h += `<p class="warn">${esc(r.message)}</p>`;
  if (r.extrapolation) h += `<p class="warn">Ce véhicule sort de la plage observée (âge ou kilométrage) : estimation peu fiable.</p>`;
  if (r.transaction) h += `<p>Prix de transaction indicatif : <b>${money(r.transaction[main], main)}</b> <span class="muted">(baisse médiane observée avant retrait : ${pct(r.transaction.discount_pct)}, sur ${r.transaction.n} annonces)</span></p>`;
  else h += `<p class="hint">C'est un prix demandé attendu. L'écart avec le prix de vente réel n'est pas encore mesuré (il faut quelques semaines de collecte).</p>`;
  if (r.adjustments?.length) {
    h += `<h3>Ce qui compose la cote</h3>` + r.adjustments.map((a) => `<div class="item"><span>${esc(a.label)}${a.significatif === false ? ' <small>effet non significatif</small>' : ""}</span><b class="${cls(a.pct)}">${pct(a.pct)}</b></div>`).join("");
  }
  if (r.projection) {
    if (!r.projection.available) h += `<h3>Projection</h3><p class="hint">${esc(r.projection.reason)}</p>`;
    else h += `<h3>Projection de valeur</h3>${projectionSvg(v, r.projection, main)}
      <p class="hint">${esc(r.projection.warning)} Hypothèse de volatilité annuelle du marché : ${Math.round(r.projection.vol_hypothesis * 100)} %. Km/an retenus : ${nf.format(r.projection.km_per_year)}.</p>`;
  }
  if (r.comparables?.length) {
    h += `<h3>Annonces comparables</h3>` + r.comparables.map((c) => `<div class="item"><span>${compLink(c)}<small>${c.year} · ${nf.format(c.km)} km · ${esc(c.country)}</small></span><b>${money(c.price, c.currency.toLowerCase())}</b></div>`).join("");
  }
  lastResult = { r, spec };
  if (!CFG.hasCH) h += `<p class="hint">Aucune annonce suisse n'est encore collectée : cette cote est celle du marché allemand.</p>`;
  h += `</div><aside class="rail-side"><b>Et si je l'achète ?</b><div class="rail-btns">${calcButtons(spec.market === "CH" ? "Comparer à l'import DE" : "Simuler l'import en Suisse", "est")}</div></aside>`;
  box.innerHTML = h;
}
function compLink(c) {
  const t = esc(c.title || c.version || "Annonce");
  return /^https?:\/\//.test(c.url || "") ? `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${t}</a>` : t;
}
function projectionSvg(v, p, cur) {
  const pts = [{ m: 0, c: v[cur], lo: v[cur], hi: v[cur] }, ...p.points.map((x) => ({ m: x.months, c: x["central_" + cur], lo: x["low_" + cur], hi: x["high_" + cur] }))];
  const W = 520, H = 220, L = 56, R = 14, T = 14, B = 34;
  const lo = Math.min(...pts.map((x) => x.lo)) * 0.97, hi = Math.max(...pts.map((x) => x.hi)) * 1.03;
  const X = (m) => L + (m / 36) * (W - L - R), Y = (val) => T + (1 - (val - lo) / (hi - lo)) * (H - T - B);
  const band = pts.map((x) => `${X(x.m)},${Y(x.hi)}`).join(" ") + " " + [...pts].reverse().map((x) => `${X(x.m)},${Y(x.lo)}`).join(" ");
  const line = pts.map((x) => `${X(x.m)},${Y(x.c)}`).join(" ");
  const ticks = [0, 12, 24, 36].map((m) => `<text x="${X(m)}" y="${H - 10}" text-anchor="middle" fill="var(--muted)" font-size="11">${m === 0 ? "aujourd'hui" : m + " mois"}</text>`).join("");
  const yt = [lo, (lo + hi) / 2, hi].map((val) => `<text x="${L - 6}" y="${Y(val) + 4}" text-anchor="end" fill="var(--muted)" font-size="11">${nf.format(Math.round(val / 1000))} k</text><line x1="${L}" x2="${W - R}" y1="${Y(val)}" y2="${Y(val)}" stroke="var(--line)"/>`).join("");
  const dots = pts.map((x) => `<circle cx="${X(x.m)}" cy="${Y(x.c)}" r="4" fill="var(--accent)"/><text x="${X(x.m) + (x.m === 0 ? 6 : x.m === 36 ? -6 : 0)}" y="${Y(x.c) - 9}" text-anchor="${x.m === 0 ? "start" : x.m === 36 ? "end" : "middle"}" fill="var(--ink)" font-size="11">${nf.format(Math.round(x.c / 100) * 100)}</text>`).join("");
  return `<svg class="proj" viewBox="0 0 ${W} ${H}" role="img" aria-label="Projection de la valeur à 12, 24 et 36 mois, avec fourchette">${yt}<polygon points="${band}" fill="var(--accent)" opacity=".15"/><polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2"/>${dots}${ticks}</svg>`;
}

// ---------- options
function fillOptGens() {
  const gens = CFG.families[$("#o-family").value] || [];
  $("#o-gen").innerHTML = `<option value="">Toutes générations</option>` + gens.map((g) => `<option value="${esc(g.code)}">${esc(g.code)} (${g.years[0]}–${g.years[1] > 2030 ? "…" : g.years[1]})</option>`).join("");
}
async function loadOptions() {
  const fam = $("#o-family").value, gen = $("#o-gen").value, box = $("#o-groups");
  box.innerHTML = `<p class="hint">Chargement…</p>`;
  const r = await api("/api/options/" + encodeURIComponent(fam) + (gen ? "?generation=" + encodeURIComponent(gen) : ""));
  $("#o-note").textContent = r.note || "";
  const groups = [["privilegier", "À privilégier", "good"], ["eviter", "À éviter", "bad"], ["neutre", "Sans effet mesurable", "muted"], ["non_mesurable", "Effet non fiable (non retenu)", "muted"], ["insuffisant", "Pas assez de données", "muted"]];
  box.innerHTML = groups.map(([k, title, c]) => {
    const items = r.items.filter((i) => i.verdict === k);
    if (!items.length) return "";
    return `<div class="group"><h3 class="${c}">${title} <span class="muted">(${items.length})</span></h3>` + items.map((i) => `<div class="item">
      <span>${esc(i.label)} ${i.kind === "etat" ? '<span class="tag">état</span>' : i.kind === "carrosserie" ? '<span class="tag">modèle</span>' : ""}<small>${i.n_with} annonces avec · ${i.n_without} sans${i.days_with != null ? ` · vend en ${i.days_with} j contre ${i.days_without} j` : ""}${i.detail ? " · " + esc(i.detail) : ""}${i.by_market ? ` · CH ${pct(i.by_market.CH.pct)} / DE ${pct(i.by_market.DE.pct)}` : ""}</small></span>
      <b class="${i.verdict === "non_mesurable" ? "" : cls(i.pct)}">${i.pct == null ? "—" : pct(i.pct)}</b></div>`).join("") + `</div>`;
  }).join("") || `<p class="hint">${esc(r.note)}</p>`;
}
$("#o-family").addEventListener("change", () => { fillOptGens(); loadOptions(); });
$("#o-gen").addEventListener("change", loadOptions);

// ---------- annonces (cartes + filtres latéraux)
const LISTINGS = new Map(), WATCHED = new Map();
const COLOR_HEX = { Noir: "#1b1b1f", Blanc: "#f1f1ee", Gris: "#8a8f98", Argent: "#c5c9d0", Bleu: "#1f5fbf", Rouge: "#c8202f", Vert: "#2e7d4f", Jaune: "#f1c40f", Orange: "#f07f1a", "Brun / beige": "#9a7b5a", Violet: "#7b4fb0", Autre: "#a9adb5" };
const LF = { market: "", color: "", offset: 0, total: 0 };
const BODY_KEYS = ["body_touring", "body_convertible", "body_gran_coupe"];
const labelOf = (k) => (CFG.options.find((o) => o.key === k) || { label: k }).label;
const flagOf = (c) => (MARKETS[c] ? MARKETS[c][0] : c);
const calcButtons = (importLabel, id, extra = "") => `<button type="button" class="mini" data-act="import" data-id="${esc(id)}">⇄ ${esc(importLabel)}</button><button type="button" class="mini" data-act="credit" data-id="${esc(id)}">▤ Crédit / leasing</button>${extra}`;

/** Liste « carrosserie » : seulement les carrosseries qui existent pour le modèle (et la génération) choisis. */
function fillBodySelect() {
  const sel = $("#l-body"), prev = sel.value, fam = $("#l-family").value, gen = $("#l-gen").value;
  let av = compatKeys(fam, gen);
  if (!fam && CFG.compat) { av = new Set(); for (const c of Object.values(CFG.compat)) c.options.forEach((x) => av.add(x)); }
  const bodies = BODY_KEYS.filter((k) => !av || av.has(k));
  sel.hidden = !bodies.length;
  sel.innerHTML = `<option value="">Toutes carrosseries</option><option value="standard">Coupé / berline</option>` +
    bodies.map((k) => `<option value="${k}">${esc(labelOf(k).replace(/^Carrosserie /, ""))}</option>`).join("");
  sel.value = bodies.includes(prev) || prev === "standard" ? prev : "";
}
function fillListGens() {
  const fam = $("#l-family").value, sel = $("#l-gen"), prev = sel.value, gens = CFG.families[fam] || [];
  sel.hidden = !fam;
  sel.innerHTML = `<option value="">Toutes générations</option>` + gens.map((g) => `<option value="${esc(g.code)}">${esc(g.code)} (${g.years[0]}–${g.years[1] > 2030 ? "…" : g.years[1]})</option>`).join("");
  sel.value = gens.some((g) => g.code === prev) ? prev : "";
}
function listParams(offset, limit) {
  const q = new URLSearchParams({ family: $("#l-family").value, generation: $("#l-gen").value, market: LF.market, sort: $("#l-sort").value, q: $("#l-q").value.trim(), limit, offset,
    color: LF.color, year_min: $("#l-yearmin").value, year_max: $("#l-yearmax").value, km_max: $("#l-kmmax").value, price_max: $("#l-pricemax").value,
    options: [...$$("#l-options input:checked, #l-bodies input:checked").map((i) => i.value), ...(BODY_KEYS.includes($("#l-body").value) ? [$("#l-body").value] : [])].join(","),
    flags: $$("#l-flags input:checked").map((i) => i.value).join(","), hide_damaged: $("#l-hide-damaged").checked ? "1" : "0", deals: $("#l-deals").checked ? "1" : "0" });
  if ($("#l-body").value === "standard") q.set("body", "standard");
  return q;
}
/** Puces des filtres actifs, chacune supprimable. */
function renderActive() {
  const chips = [];
  const add = (label, clear) => chips.push([label, clear]);
  if (LF.market) add(`${flagOf(LF.market)} ${MARKETS[LF.market][1]}`, () => (LF.market = ""));
  if ($("#l-family").value) add($("#l-family").value, () => { $("#l-family").value = ""; fillListGens(); renderListingChips(); fillBodySelect(); });
  if ($("#l-gen").value) add($("#l-gen").value, () => { $("#l-gen").value = ""; fillBodySelect(); });
  if ($("#l-body").value) add($("#l-body").selectedOptions[0].textContent, () => ($("#l-body").value = ""));
  if ($("#l-yearmin").value || $("#l-yearmax").value) add(`Année ${$("#l-yearmin").value || "…"}–${$("#l-yearmax").value || "…"}`, () => { $("#l-yearmin").value = ""; $("#l-yearmax").value = ""; });
  if ($("#l-kmmax").value) add(`≤ ${nf.format($("#l-kmmax").value)} km`, () => ($("#l-kmmax").value = ""));
  if ($("#l-pricemax").value) add(`≤ ${nf.format($("#l-pricemax").value)} €`, () => ($("#l-pricemax").value = ""));
  if (LF.color) add(LF.color, () => (LF.color = ""));
  if ($("#l-q").value.trim()) add(`« ${$("#l-q").value.trim()} »`, () => ($("#l-q").value = ""));
  if ($("#l-deals").checked) add("Bonnes affaires", () => ($("#l-deals").checked = false));
  if (!$("#l-hide-damaged").checked) add("Accidentés inclus", () => ($("#l-hide-damaged").checked = true));
  for (const i of $$("#l-options input:checked, #l-bodies input:checked, #l-flags input:checked")) add(labelOf(i.value), () => (i.checked = false));
  $("#l-active").innerHTML = chips.map(([l], n) => `<button type="button" class="achip" data-n="${n}">${esc(l)} <span aria-hidden="true">✕</span></button>`).join("");
  renderActive.chips = chips;
}
$("#l-active").addEventListener("click", (e) => { const b = e.target.closest(".achip"); if (!b) return; renderActive.chips[Number(b.dataset.n)][1](); loadListings(); });

function renderFacets(f) {
  const total = Object.values(f.markets).reduce((a, b) => a + b, 0);
  const mk = MARKET_ORDER.filter((c) => f.markets[c] || LF.market === c);
  $("#lg-market").hidden = mk.length < 2;
  $("#l-market").innerHTML = `<button type="button" data-m="" class="${LF.market ? "" : "on"}">Tous <small>${total}</small></button>` +
    mk.map((c) => `<button type="button" data-m="${c}" class="${LF.market === c ? "on" : ""}">${MARKETS[c][0]} <small>${f.markets[c] ?? 0}</small></button>`).join("");
  const cols = (CFG.colors || []).filter((c) => f.colors[c] || LF.color === c);
  $("#lg-color").hidden = !cols.length;
  $("#l-colors").innerHTML = cols.map((c) => `<button type="button" class="sw${LF.color === c ? " on" : ""}" data-c="${esc(c)}" title="${esc(c)} (${f.colors[c] ?? 0})"><i style="background:${COLOR_HEX[c] || "#aaa"}"></i><small>${f.colors[c] ?? 0}</small></button>`).join("");
}
$("#l-market").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; LF.market = b.dataset.m; loadListings(); });
$("#l-colors").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; LF.color = LF.color === b.dataset.c ? "" : b.dataset.c; loadListings(); });

function gauge(gap) {
  if (gap == null) return "";
  const w = Math.min(Math.abs(gap), 30) / 30 * 50;
  return `<div class="gauge" title="Écart à la cote : ${pct(gap)}"><span class="mid"></span><i class="${gap < 0 ? "neg" : "pos"}" style="${gap < 0 ? `right:50%` : `left:50%`};width:${w}%"></i></div>`;
}
function cardHtml(i) {
  const cur = i.currency.toLowerCase();
  const warn = (i.damaged ? '<span class="tag dmg">épave / défectueux</span>' : "") + (i.accident && !i.damaged ? '<span class="tag dmg">accidenté</span>' : "")
    + (i.suspect && !i.damaged ? '<span class="tag chk">prix très bas : à vérifier</span>' : "");
  const keys = [...i.options.filter((o) => !BODY_KEYS.includes(o)), ...i.flags.filter((f) => f !== "accident")];
  const shown = keys.slice(0, 6).map((o) => `<span class="tag">${esc(labelOf(o))}</span>`).join("");
  const more = keys.length > 6 ? `<span class="tag more" title="${esc(keys.slice(6).map(labelOf).join(", "))}">+${keys.length - 6}</span>` : "";
  const on = WATCHED.has(String(i.id));
  const deal = i.gap_pct != null && i.gap_pct <= -8 && !i.suspect && !i.damaged && !i.accident;
  const link = /^https?:\/\//.test(i.url || "") ? i.url : null;
  const sub = [flagOf(i.country), esc(i.segment), i.version && i.version !== i.segment.split(" ")[0] ? esc(i.version) : "", `${i.month ? String(i.month).padStart(2, "0") + "/" : ""}${i.year}`, `${nf.format(i.km)} km`, i.power_ps ? `${i.power_ps} ch` : "", i.color ? esc(i.color) : ""].filter(Boolean).join(" · ");
  return `<article class="lcard${deal ? " deal" : ""}${i.damaged || i.accident ? " dmgcard" : ""}">
    <span class="lc-color" style="background:${COLOR_HEX[i.color] || "var(--line)"}" title="${esc(i.color || "couleur inconnue")}"></span>
    <div class="lc-main">
      <div class="lc-title">${link ? `<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">${esc(i.title)}</a>` : esc(i.title)}</div>
      <div class="lc-sub">${sub}${i.model_conf < 0.7 ? " · modèle incertain" : ""}</div>
      <div class="lc-tags">${warn}${shown}${more}</div>
    </div>
    <div class="lc-price">
      <div class="lc-p">${money(i.price, cur)}</div>
      ${cur === "chf" ? `<div class="lc-s muted">≈ ${money(i.price_eur, "eur")}</div>` : ""}
      <div class="lc-s muted">cote ${money(i.expected_eur, "eur")}</div>
      ${gauge(i.gap_pct)}
      <div class="lc-gap ${i.gap_pct == null ? "" : i.gap_pct < 0 ? "good" : "bad"}">${i.gap_pct == null ? "—" : pct(i.gap_pct)}${deal ? ' <span class="tag deal">bonne affaire</span>' : ""}</div>
    </div>
    <div class="rail"><div class="rail-btns">
      ${link ? `<a class="mini linkbtn" href="${esc(link)}" target="_blank" rel="noopener noreferrer">↗ Voir l'annonce</a>` : ""}
      ${calcButtons(i.country === "CH" ? "Comparer à l'import DE" : "Import en Suisse", i.id, `<button type="button" class="mini follow${on ? " on" : ""}" data-follow="${esc(i.id)}">${on ? "★ Suivie" : "☆ Suivre"}</button>`)}
    </div></div></article>`;
}
let listSeq = 0;
async function loadListings(more = false) {
  const seq = ++listSeq, PAGE = 24;
  if (!more) LF.offset = 0;
  const [r, wl] = await Promise.all([api("/api/listings?" + listParams(more ? LF.offset : 0, PAGE)), api("/api/watch?light=1").catch(() => [])]);
  if (seq !== listSeq) return;                           // une requête plus récente a été lancée
  WATCHED.clear(); wl.forEach((w) => { if (w.spec?.kind === "listing") WATCHED.set(String(w.spec.listing_id), w.id); });
  if (!more) LISTINGS.clear();
  r.items.forEach((i) => LISTINGS.set(String(i.id), i));
  LF.offset += r.items.length; LF.total = r.total;
  renderFacets(r.facets); renderActive();
  $("#l-count").innerHTML = `<b>${nf.format(r.total)}</b> annonce${r.total > 1 ? "s" : ""}`;
  const html = r.items.map(cardHtml).join("");
  if (more) $("#l-cards").insertAdjacentHTML("beforeend", html);
  else $("#l-cards").innerHTML = html || `<div class="empty"><b>Aucune annonce</b><br>Essayez d'élargir les filtres${$("#l-hide-damaged").checked ? " ou d'inclure les véhicules accidentés" : ""}.</div>`;
  $("#l-more").hidden = LF.offset >= r.total;
}
$("#l-more").addEventListener("click", () => loadListings(true));
let lt;
const later = () => { clearTimeout(lt); lt = setTimeout(loadListings, 350); };
["#l-sort", "#l-hide-damaged", "#l-deals", "#l-body"].forEach((s) => $(s).addEventListener("change", () => loadListings()));
["#l-yearmin", "#l-yearmax", "#l-kmmax", "#l-pricemax", "#l-q"].forEach((s) => $(s).addEventListener("input", later));
["#l-options", "#l-bodies", "#l-flags"].forEach((s) => $(s).addEventListener("change", () => loadListings()));
$("#l-family").addEventListener("change", () => { fillListGens(); renderListingChips(); fillBodySelect(); loadListings(); });
$("#l-gen").addEventListener("change", () => { renderListingChips(); fillBodySelect(); loadListings(); });
$("#l-reset").addEventListener("click", () => {
  LF.market = ""; LF.color = "";
  for (const id of ["#l-q", "#l-yearmin", "#l-yearmax", "#l-kmmax", "#l-pricemax"]) $(id).value = "";
  $("#l-family").value = ""; $("#l-gen").value = ""; $("#l-body").value = ""; $("#l-sort").value = "gap";
  $("#l-hide-damaged").checked = true; $("#l-deals").checked = false;
  $$("#l-options input, #l-bodies input, #l-flags input").forEach((i) => (i.checked = false));
  fillListGens(); renderListingChips(); fillBodySelect(); loadListings();
});
$("#l-toggle").addEventListener("click", () => $("#lst-filters").classList.toggle("open"));

// ---------- calculateurs intégrés : l'iframe prend la hauteur de son contenu (pas de défilement dans le cadre)
window.addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data || typeof e.data.cotesportCalcHeight !== "number") return;
  const h = e.data.cotesportCalcHeight; if (h < 200) return;
  for (const f of $$("iframe.calc")) if (f.contentWindow === e.source) f.style.height = h + "px";
});

// ---------- passerelles vers les calculateurs (préremplis depuis une annonce ou une estimation)
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 7000); }
function openCalc(kind, params) {
  $(`#tabs button[data-tab="${kind}"]`).click();
  const f = $("#fr-" + kind);
  const h = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== "").map(([k, v]) => [k, String(v)])).toString();
  f.src = f.dataset.src + "#" + h;
}
const splitSegment = (seg) => { const i = seg.lastIndexOf(" "); return [seg.slice(0, i), seg.slice(i + 1)]; };
const roundTo = (v, step) => Math.round(v / step) * step;
/** item : { country, price (monnaie de l'annonce), price_eur, segment, version, year, km, options, flags } */
async function calcAction(act, item, btn) {
  const [family, generation] = splitSegment(item.segment);
  const spec = { family, generation, version: item.version, year: item.year, km: item.km, options: item.options || [], flags: item.flags || [] };
  const fx = SUMMARY.fx_chf_eur;                    // 1 CHF = fx €
  const isCH = item.country === "CH";
  const est = (market) => api("/api/estimate", { method: "POST", body: JSON.stringify({ ...spec, market }) });
  const label = btn?.textContent; if (btn) { btn.disabled = true; btn.textContent = "Calcul…"; }
  try {
    const neuf = new Date().getFullYear() - item.year <= 0 && item.km < 5000;
    if (act === "import") {
      const p = { etat: neuf ? "neuf" : "occ", remiseDE: 0, remiseCH: 0, taux: (1 / fx).toFixed(4) };
      if (isCH) {
        p.prixCH = Math.round(item.price);
        const e = await est("DE");
        if (e.value) p.prixDE = e.value.eur; else toast("Pas assez d'annonces allemandes comparables : saisissez l'offre allemande.");
      } else {
        p.prixDE = Math.round(item.price);
        if (CFG.hasCH) {
          const e = await est("CH");
          if (e.value) p.prixCH = e.value.chf; else toast("Pas assez d'annonces suisses comparables : saisissez l'offre suisse.");
        } else toast("Marché suisse pas encore mesuré : saisissez le prix d'une offre suisse équivalente pour comparer.");
      }
      openCalc("import", p);
    } else {
      const chf = isCH ? item.price : item.price_eur / fx;
      const e = await est(isCH ? "CH" : "DE");
      const p = { prix: roundTo(chf, 100), apport: roundTo(chf * 0.2, 500), premier: roundTo(chf * 0.1, 500) };
      const p36 = e.projection?.available ? e.projection.points.find((x) => x.months === 36) : null;
      if (p36) { p.dC = 36; p.dL = 36; p.vr = roundTo(p36.central_chf, 100); p.revente = roundTo(p36.central_chf, 100); p.reventeRachat = p.vr; }
      else toast("Valeur de revente non estimée (trop peu d'annonces comparables) : saisissez-la dans le calculateur.");
      openCalc("leasing", p);
    }
  } catch (err) { toast("Erreur : " + err.message); }
  finally { if (btn) { btn.disabled = false; btn.textContent = label; } }
}
$("#l-cards").addEventListener("click", async (e) => {
  const f = e.target.closest("button[data-follow]");
  if (f) {
    const item = LISTINGS.get(f.dataset.follow); if (!item) return;
    f.disabled = true;
    try {
      if (WATCHED.has(f.dataset.follow)) await api("/api/watch/" + WATCHED.get(f.dataset.follow), { method: "DELETE" });
      else await api("/api/watch", { method: "POST", body: JSON.stringify({ name: item.title.slice(0, 80), spec: { kind: "listing", listing_id: item.id, price: item.price, currency: item.currency, url: item.url } }) });
      await loadListings();
    } catch (err) { toast("Erreur : " + err.message); f.disabled = false; }
    return;
  }
  const b = e.target.closest("button[data-act]"); if (!b) return;
  const item = LISTINGS.get(b.dataset.id); if (item) calcAction(b.dataset.act, item, b);
});
$("#result").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-act]"); if (!b || !lastResult) return;
  const { r, spec } = lastResult, main = spec.market === "CH" ? "chf" : "eur";
  calcAction(b.dataset.act, { country: spec.market, price: r.value[main], price_eur: r.value.eur, segment: r.segment, version: spec.version, year: spec.year, km: spec.km, options: spec.options, flags: spec.flags }, b);
});
let lastResult = null;

// ---------- suivi
const dshort = (d) => new Date(d).toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit", year: "2-digit" });
async function loadWatch() {
  const r = await api("/api/watch"), box = $("#watchlist");
  if (!r.length) { box.innerHTML = `<p class="hint">Rien à suivre pour l'instant. Utilisez ☆ Suivre dans la liste des annonces, ou « Suivre ce véhicule » dans l'onglet Estimer.</p>`; return; }
  box.innerHTML = r.map((w) => {
    if (w.spec?.kind === "listing") {
      const l = w.listing, cur = (l?.currency || w.spec.currency || "EUR").toLowerCase();
      if (!l) return `<div class="item"><span><b>${esc(w.name)}</b><small>Annonce introuvable (supprimée de la base).</small></span><span><button class="ghost" data-del="${w.id}">Retirer</button></span></div>`;
      const first = l.history[0]?.price ?? w.spec.price, last = l.price, ch = first ? (last / first - 1) * 100 : null;
      const state = l.active ? '<span class="tag deal">en ligne</span>' : `<span class="tag dmg">retirée${l.removed_at ? " le " + dshort(l.removed_at) : ""} (vendue ou supprimée)</span>`;
      const link = /^https?:\/\//.test(l.url || "") ? `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.title)}</a>` : esc(l.title);
      const hist = l.history.length > 1 ? `<div class="pricehist">Historique : ${l.history.map((h) => money(h.price, cur) + " (" + dshort(h.at) + ")").join(" → ")}</div>` : "";
      return `<div class="item"><span><b>${link}</b> ${state}<small>${l.year} · ${nf.format(l.km)} km · ${esc(l.country)} · suivie depuis le ${dshort(w.created_at)}${l.gap_pct != null && l.active ? " · écart à la cote " + pct(l.gap_pct) : ""}${l.damaged ? " · épave / défectueux" : ""}</small>${hist}</span>
        <span style="text-align:right"><b>${money(last, cur)}</b>${ch != null && Math.abs(ch) >= 0.1 ? `<small class="${ch < 0 ? "good" : "bad"}">${pct(ch)} depuis le suivi</small>` : `<small class="muted">prix inchangé</small>`}
        <br><button class="ghost" data-del="${w.id}">Retirer</button></span></div>`;
    }
    const e = w.estimate || {}, cur = w.spec.market === "CH" ? "chf" : "eur", v = e.value;
    const p36 = e.projection?.available ? e.projection.points[2] : null;
    return `<div class="item"><span><b>${esc(w.name)}</b> <span class="tag">cote</span><small>${esc(w.spec.family)} ${esc(w.spec.generation)} · ${w.spec.year} · ${nf.format(w.spec.km)} km · ${esc(w.spec.market)}${e.confidence ? " · confiance " + esc(e.confidence) : ""}</small></span>
      <span style="text-align:right"><b>${v ? money(v[cur], cur) : "—"}</b>${p36 ? `<small class="muted">dans 36 mois : ${money(p36["central_" + cur], cur)}</small>` : ""}
      <br><button class="ghost" data-del="${w.id}">Retirer</button></span></div>`;
  }).join("");
}
$("#watchlist").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-del]"); if (!b) return;
  await api("/api/watch/" + b.dataset.del, { method: "DELETE" }); loadWatch();
});

// ---------- sources
async function loadSources() {
  const h = await api("/api/health"), s = h.settings;
  const names = Object.fromEntries(CFG.sources.map((x) => [x.name, x.label]));
  const st = h.status;
  if (loadSources.was && !st.running) refreshMarket(true);
  loadSources.was = st.running;
  $("#s-status").textContent = st.running ? `Collecte en cours : ${st.current || "…"}` : "Aucune collecte en cours.";
  $("#btn-collect").disabled = st.running;
  $("#btn-stop").hidden = !st.running;
  const badge = (x) => ({ ok: '<span class="good">ok</span>', blocked: '<span class="bad">bloqué</span>', empty: '<span class="warn">rien reconnu</span>', partial: '<span class="warn">partiel</span>', error: '<span class="bad">erreur</span>', running: "en cours" }[x] || esc(x));
  const rows = s.sources.map((n) => h.last.find((r) => r.source === n) || { source: n });
  $("#stable tbody").innerHTML = rows.map((r) => `<tr><td>${esc(names[r.source] || r.source)}</td>
    <td>${r.finished_at ? new Date(r.finished_at).toLocaleString("fr-CH", { dateStyle: "short", timeStyle: "short" }) : "jamais"}</td><td>${r.status ? badge(r.status) : "—"}</td>
    <td class="num">${r.pages ?? "—"}</td><td class="num">${r.found ?? "—"}</td><td class="num">${r.new ?? "—"}</td><td class="num">${r.removed ?? "—"}</td><td>${esc(r.message || "")}</td></tr>`).join("");
  $("#s-settings").textContent = `Collecte automatique ${s.scheduler ? "tous les jours à " + s.collect_hour : "désactivée"} · pause entre requêtes ~${s.delay_s} s · robots.txt ${s.robots ? "respecté" : "ignoré"} · mode ${s.mode}. Taux de change : ${h.fx ? h.fx.chf_eur.toFixed(4) + " (" + h.fx.source + ")" : "—"}.`;
  if (st.running) setTimeout(() => $("#tab-sources").classList.contains("on") && loadSources(), 5000);
}
$("#btn-stop").addEventListener("click", async () => {
  try { await api("/api/collect/stop", { method: "POST" }); $("#s-status").textContent = "Arrêt demandé : la collecte s'interrompt après la page en cours…"; } catch (e) { alert(e.message); }
  setTimeout(loadSources, 3000);
});
$("#btn-collect").addEventListener("click", async () => {
  try { await api("/api/collect", { method: "POST" }); } catch (e) { alert(e.message); }
  setTimeout(loadSources, 800);
});

// ---------- démarrage
async function init() {
  try {
    const a = await fetch("/api/auth-check", { headers: TOKEN ? { "X-Token": TOKEN } : {} }).then((r) => r.json());
    if (a.required && !a.ok) { showLogin(); return; }
    CFG = await api("/api/config");
    fillFamilySelects();
    await loadMarket(); scheduleAuto();
    const t = location.hash.slice(1); if (t) $(`#tabs button[data-tab="${t}"]`)?.click();
  } catch (e) { if (e.message !== "401") $("#banner").hidden = false, ($("#banner").textContent = "Erreur : " + e.message); }
}
init();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
