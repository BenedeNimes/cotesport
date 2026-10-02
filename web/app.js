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
  if (t === "options") loadOptions();
  if (t === "listings") loadListings();
  if (t === "watch") loadWatch();
  if (t === "sources") loadSources();
  if (t === "leasing" || t === "import") { const f = $("#fr-" + t); if (!f.getAttribute("src")) f.src = f.dataset.src; }
  history.replaceState(null, "", "#" + t);
});

// ---------- marché
let segSort = { key: "n", dir: -1 };
async function loadMarket() {
  SUMMARY = await api("/api/summary");
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
/** Le choix Suisse / Allemagne n'apparaît que s'il existe des annonces suisses ; sinon tout porte sur l'Allemagne. */
function applyMarketAvailability() {
  const hasCH = SUMMARY.segments.some((s) => s.n_ch > 0);
  CFG.hasCH = hasCH;
  document.body.classList.toggle("no-ch", !hasCH);
  $("#f-market").closest("label").hidden = !hasCH;
  if (!hasCH) { $("#f-market").value = "DE"; $("#l-market").value = ""; }
  $("#l-market").hidden = !hasCH;
}
function renderSegments() {
  const cur = $("#mk-currency").value, fx = SUMMARY.fx_chf_eur;
  const conv = (v) => (v == null ? null : cur === "chf" ? v / fx : v);
  const rows = [...SUMMARY.segments].sort((a, b) => {
    const x = a[segSort.key], y = b[segSort.key];
    if (x == null) return 1; if (y == null) return -1;
    return (typeof x === "string" ? x.localeCompare(y) : x - y) * segSort.dir;
  });
  $("#segtable tbody").innerHTML = rows.map((s) => `<tr>
    <td><b>${esc(s.segment)}</b></td><td class="num">${s.n} ${CFG.hasCH ? `<small class="muted">(${s.n_de} DE · ${s.n_ch} CH)</small>` : ""}</td>
    <td class="num">${s.median_age} ans</td><td class="num">${nf.format(s.median_km)}</td>
    <td class="num">${money(conv(s.median_de_eur), cur)}</td><td class="num col-ch">${money(conv(s.median_ch_eur), cur)}</td>
    <td class="num col-ch ${cls(s.ch_premium_pct)}">${s.ch_premium_pct == null ? "—" : pct(s.ch_premium_pct)}</td>
    <td class="num ${cls(s.trend_pct)}">${s.trend_pct == null ? "—" : pct(s.trend_pct)}</td></tr>`).join("") || `<tr><td colspan="8" class="muted">Aucune donnée.</td></tr>`;
}
$("#mk-currency").addEventListener("change", renderSegments);
$("#segtable thead").addEventListener("click", (e) => {
  const th = e.target.closest("th[data-sort]"); if (!th) return;
  const k = th.dataset.sort; segSort = { key: k, dir: segSort.key === k ? -segSort.dir : -1 }; renderSegments();
});

// ---------- formulaire d'estimation
function fillFamilySelects() {
  const fams = Object.keys(CFG.families);
  for (const id of ["#f-family", "#o-family"]) $(id).innerHTML = fams.map((f) => `<option>${esc(f)}</option>`).join("");
  $("#l-family").innerHTML = `<option value="">Tous les modèles</option>` + fams.map((f) => `<option>${esc(f)}</option>`).join("");
  $("#f-family").value = "M3"; $("#o-family").value = "M3"; fillOptGens();
  renderListingChips();
  $("#l-color").innerHTML = '<option value="">Toutes couleurs</option>' + (CFG.colors || []).map((c) => `<option>${esc(c)}</option>`).join("");
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
  const av = compatKeys($("#l-family").value, "");
  const kinds = [["#l-options", "option"], ["#l-bodies", "body"], ["#l-flags", "cond"]];
  for (const [sel, k] of kinds) { const prev = $$(sel + " input:checked").map((i) => i.value); $(sel).innerHTML = CFG.options.filter((o) => o.kind === k && (k === "cond" || !av || av.has(o.key))).map(chip).join(""); $$(sel + " input").forEach((i) => { i.checked = prev.includes(i.value); }); }
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
  if (!r.value) { box.innerHTML = `<h2>${esc(r.segment)}</h2><p class="warn">${esc(r.message || "Estimation impossible.")}</p>`; return; }
  const main = spec.market === "CH" ? "chf" : "eur", other = main === "chf" ? "eur" : "chf";
  const v = r.value;
  let h = `<h2>${esc(r.segment)} · ${esc(spec.version || "")}</h2>
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
  h += `<div class="calcbar"><b>Et si je l'achète ?</b><br>${calcButtons(spec.market === "CH" ? "Comparer à l'import DE" : "Simuler l'import en Suisse", "est")}</div>`;
  if (!CFG.hasCH) h += `<p class="hint">Aucune annonce suisse n'est encore collectée : cette cote est celle du marché allemand.</p>`;
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

// ---------- annonces
async function loadListings() {
  const q = new URLSearchParams({ family: $("#l-family").value, market: $("#l-market").value, sort: $("#l-sort").value, q: $("#l-q").value, limit: 80,
    color: $("#l-color").value, year_min: $("#l-yearmin").value, km_max: $("#l-kmmax").value,
    options: $$("#l-options input:checked, #l-bodies input:checked").map((i) => i.value).join(","), flags: $$("#l-flags input:checked").map((i) => i.value).join(",") });
  const nsel = $$("#l-options input:checked, #l-bodies input:checked, #l-flags input:checked").length; $("#l-opt-n").textContent = nsel ? `(${nsel} sélectionnée${nsel > 1 ? "s" : ""})` : "";
  const r = await api("/api/listings?" + q);
  LISTINGS.clear(); r.items.forEach((i) => LISTINGS.set(String(i.id), i));
  $("#l-count").textContent = `${r.total} annonces${r.total > 80 ? " (80 affichées)" : ""}. « Cote » = prix demandé attendu par le modèle ; un écart négatif = moins cher que prévu.`;
  $("#ltable tbody").innerHTML = r.items.map((i) => {
    const link = /^https?:\/\//.test(i.url || "") ? `<a href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${esc(i.title)}</a>` : esc(i.title);
    const opts = [...i.options.slice(0, 3), ...i.flags.slice(0, 2)].map((o) => `<span class="tag">${esc(labelOf(o))}</span>`).join("");
    return `<tr><td>${link}<br><small class="muted">${esc(i.segment)} · ${esc(i.version)} · ${esc(i.country)}${i.color ? " · " + esc(i.color) : ""}${i.model_conf < 0.7 ? " · modèle incertain" : ""}</small><div>${opts}</div>${calcButtons(i.country === "CH" ? "Comparer à l'import DE" : "Simuler l'import en Suisse", i.id)}</td>
      <td class="num">${i.year}</td><td class="num">${nf.format(i.km)}</td><td class="num">${money(i.price, i.currency.toLowerCase())}</td>
      <td class="num">${money(i.expected_eur, "eur")}</td><td class="num ${i.gap_pct == null ? "" : i.gap_pct < 0 ? "good" : "bad"}">${i.gap_pct == null ? "—" : pct(i.gap_pct)}${i.gap_pct != null && i.gap_pct <= -8 ? '<br><span class="tag deal">bonne affaire</span>' : ""}</td></tr>`;
  }).join("") || `<tr><td colspan="6" class="muted">Aucune annonce.</td></tr>`;
}
const LISTINGS = new Map();
const calcButtons = (importLabel, id) => `<div class="calcbar-l"><button type="button" class="mini" data-act="import" data-id="${esc(id)}">${esc(importLabel)}</button><button type="button" class="mini" data-act="credit" data-id="${esc(id)}">Crédit / leasing</button></div>`;
const labelOf = (k) => (CFG.options.find((o) => o.key === k) || { label: k }).label;
["#l-market", "#l-sort", "#l-color"].forEach((s) => $(s).addEventListener("change", loadListings));
$("#l-family").addEventListener("change", () => { renderListingChips(); loadListings(); });
["#l-yearmin", "#l-kmmax"].forEach((s) => $(s).addEventListener("input", () => { clearTimeout(lt); lt = setTimeout(loadListings, 500); }));
["#l-options", "#l-bodies", "#l-flags"].forEach((s) => $(s).addEventListener("change", loadListings));
let lt; $("#l-q").addEventListener("input", () => { clearTimeout(lt); lt = setTimeout(loadListings, 350); });

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
$("#ltable").addEventListener("click", (e) => {
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
async function loadWatch() {
  const r = await api("/api/watch"), box = $("#watchlist");
  if (!r.length) { box.innerHTML = `<p class="hint">Rien à suivre pour l'instant. Utilisez « Suivre ce véhicule » dans l'onglet Estimer.</p>`; return; }
  box.innerHTML = r.map((w) => {
    const e = w.estimate || {}, cur = w.spec.market === "CH" ? "chf" : "eur", v = e.value;
    const p36 = e.projection?.available ? e.projection.points[2] : null;
    return `<div class="item"><span><b>${esc(w.name)}</b><small>${esc(w.spec.family)} ${esc(w.spec.generation)} · ${w.spec.year} · ${nf.format(w.spec.km)} km · ${esc(w.spec.market)}${e.confidence ? " · confiance " + esc(e.confidence) : ""}</small></span>
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
    await loadMarket();
    const t = location.hash.slice(1); if (t) $(`#tabs button[data-tab="${t}"]`)?.click();
  } catch (e) { if (e.message !== "401") $("#banner").hidden = false, ($("#banner").textContent = "Erreur : " + e.message); }
}
init();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
