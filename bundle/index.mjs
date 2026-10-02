import{createRequire as ___cr}from'module';const require=___cr(import.meta.url);
var In={"/index.html":{t:"text/html; charset=utf-8",b:`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0d1015">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon.svg">
<title>CoteSport \u2014 cote des sportives</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="top">
  <div class="brand"><svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 52 L20 18 L30 18 L18 52Z" fill="#ffb703"/><path d="M22 52 L34 18 L44 18 L32 52Z" fill="#fb5607"/><path d="M36 52 L48 18 L58 18 L46 52Z" fill="#e63946"/></svg><span class="brand-name">CoteSport</span> <small id="fxline"></small></div>
  <nav id="tabs">
    <button data-tab="market" class="on">March\xE9</button>
    <button data-tab="estimate">Estimer</button>
    <button data-tab="options">Options</button>
    <button data-tab="listings">Annonces</button>
    <button data-tab="leasing">Cr\xE9dit / leasing</button>
    <button data-tab="import">Import DE \u2194 CH</button>
    <button data-tab="watch">Suivi</button>
    <button data-tab="sources">Sources</button>
  </nav>
</header>

<div id="banner" class="banner" hidden></div>

<main>
  <!-- MARCH\xC9 -->
  <section id="tab-market" class="tab on">
    <div class="cards" id="kpis"></div>
    <div class="panel">
      <div class="panel-h"><h2>Segments</h2>
        <div class="actions"><span id="mk-updated" class="muted small"></span><button type="button" id="btn-refresh" class="ghost" title="Recharger les donn\xE9es du march\xE9">\u21BB Actualiser</button>
        <label class="inline">March\xE9
          <select id="mk-currency"><option value="eur">EUR</option><option value="chf">CHF</option></select></label></div>
      </div>
      <div class="scroll"><table id="segtable"><thead><tr>
        <th data-sort="segment">Segment</th><th data-sort="n" class="num">Annonces</th><th data-sort="median_age" class="num">\xC2ge m\xE9d.</th>
        <th data-sort="median_km" class="num">Km m\xE9d.</th><th data-sort="median_de_eur" class="num">M\xE9diane DE</th>
        <th data-sort="median_ch_eur" class="num col-ch">M\xE9diane CH</th><th data-sort="ch_premium_pct" class="num col-ch">CH vs DE</th>
        <th data-sort="trend_pct" class="num">Tendance</th></tr></thead><tbody></tbody></table></div>
      <p class="hint">Prix demand\xE9s (pas de transactions). La tendance n'appara\xEEt qu'apr\xE8s plusieurs jours de collecte.</p>
    </div>
  </section>

  <!-- ESTIMER -->
  <section id="tab-estimate" class="tab">
    <div class="grid2">
      <form id="estform" class="panel">
        <h2>Votre v\xE9hicule</h2>
        <div class="row">
          <label>Mod\xE8le<select id="f-family"></select></label>
          <label>G\xE9n\xE9ration<select id="f-gen"></select></label>
        </div>
        <div class="row">
          <label>Version<select id="f-version"></select></label>
          <label>March\xE9 de vente<select id="f-market"><option value="CH">Suisse</option><option value="DE">Allemagne</option></select></label>
        </div>
        <div class="row">
          <label>Ann\xE9e de mise en circulation<input type="number" id="f-year" min="2000" max="2035" value="2022"></label>
          <label>Mois<input type="number" id="f-month" min="1" max="12" placeholder="facultatif"></label>
        </div>
        <div class="row">
          <label>Kilom\xE9trage<input type="number" id="f-km" min="0" step="500" value="30000"></label>
          <label>Km par an pr\xE9vus<input type="number" id="f-kmpy" min="0" step="500" placeholder="auto"></label>
        </div>
        <fieldset><legend>\xC9quipements propos\xE9s sur ce mod\xE8le</legend><div id="f-options" class="chips"></div></fieldset>
        <fieldset><legend>Carrosserie et transmission</legend><div id="f-bodies" class="chips"></div></fieldset>
        <fieldset><legend>\xC9tat et historique</legend><div id="f-flags" class="chips"></div></fieldset>
        <div class="actions">
          <button type="submit" class="primary">Estimer</button>
          <button type="button" id="btn-watch" class="ghost">Suivre ce v\xE9hicule</button>
        </div>
      </form>
      <div id="result" class="panel result"><p class="hint">Renseignez le v\xE9hicule puis lancez l'estimation.</p></div>
    </div>
  </section>

  <!-- OPTIONS -->
  <section id="tab-options" class="tab">
    <div class="panel">
      <div class="panel-h"><h2>Quelles options pour la revente ?</h2>
        <div class="actions"><label class="inline">Mod\xE8le<select id="o-family"></select></label>
          <label class="inline">G\xE9n\xE9ration<select id="o-gen"></select></label></div></div>
      <div id="o-note" class="hint"></div>
      <div id="o-groups"></div>
    </div>
  </section>

  <!-- ANNONCES -->
  <section id="tab-listings" class="tab">
    <div class="panel">
      <div class="panel-h"><h2>Annonces</h2></div>
      <div class="filters">
        <select id="l-family"><option value="">Tous les mod\xE8les</option></select>
        <select id="l-market"><option value="">CH + DE</option><option value="CH">Suisse</option><option value="DE">Allemagne</option></select>
        <select id="l-sort"><option value="gap">Meilleures affaires d'abord</option><option value="price">Prix</option><option value="recent">Plus r\xE9centes</option><option value="km">Kilom\xE9trage</option></select>
        <select id="l-body" hidden><option value="">Toutes carrosseries</option></select>
        <input id="l-q" placeholder="Rechercher (ex. Competition)">
        <select id="l-color"><option value="">Toutes couleurs</option></select>
        <input id="l-yearmin" type="number" min="2000" max="2035" placeholder="Ann\xE9e min">
        <input id="l-kmmax" type="number" min="0" step="1000" placeholder="Km max">
      </div>
      <label class="switch"><input type="checkbox" id="l-hide-damaged" checked><span>Masquer les v\xE9hicules accident\xE9s, d\xE9fectueux ou \xE9paves</span></label>
      <details class="more"><summary>Options exig\xE9es <span id="l-opt-n" class="muted"></span></summary>
        <div id="l-options" class="chips"></div><div id="l-bodies" class="chips"></div><div id="l-flags" class="chips"></div></details>
      <div class="scroll"><table id="ltable"><thead><tr><th>Annonce</th><th class="num">Ann\xE9e</th><th class="num">Km</th>
        <th class="num">Prix</th><th class="num">Cote</th><th class="num">\xC9cart</th><th class="rail-h">Actions</th></tr></thead><tbody></tbody></table></div>
      <p class="hint" id="l-count"></p>
    </div>
  </section>

  <!-- CR\xC9DIT / LEASING -->
  <section id="tab-leasing" class="tab">
    <iframe id="fr-leasing" class="calc" data-src="/leasing" title="Comparateur cr\xE9dit vs leasing" scrolling="no"></iframe>
  </section>

  <!-- IMPORT DE \u2194 CH -->
  <section id="tab-import" class="tab">
    <iframe id="fr-import" class="calc" data-src="/import" title="Comparateur achat en Suisse ou import d'Allemagne" scrolling="no"></iframe>
  </section>

  <!-- SUIVI -->
  <section id="tab-watch" class="tab">
    <div class="panel"><div class="panel-h"><h2>Suivi</h2></div>
      <div id="watchlist"><p class="hint">Rien \xE0 suivre pour l'instant. Utilisez \u2606 dans la liste des annonces, ou \xAB Suivre ce v\xE9hicule \xBB dans l'onglet Estimer.</p></div></div>
  </section>

  <!-- SOURCES -->
  <section id="tab-sources" class="tab">
    <div class="panel">
      <div class="panel-h"><h2>Collecte des donn\xE9es</h2>
        <div class="actions"><button id="btn-collect" class="primary">Lancer la collecte</button> <button id="btn-stop" class="danger" hidden>Arr\xEAter la collecte</button></div></div>
      <div id="s-status" class="hint"></div>
      <div class="scroll"><table id="stable"><thead><tr><th>Source</th><th>Dernier passage</th><th>\xC9tat</th><th class="num">Pages</th><th class="num">Vues</th>
        <th class="num">Nouvelles</th><th class="num">Retir\xE9es</th><th>Message</th></tr></thead><tbody></tbody></table></div>
      <p class="hint" id="s-settings"></p>
    </div>
  </section>
</main>

<div id="login" class="modal" hidden>
  <form class="panel"><h2>Acc\xE8s prot\xE9g\xE9</h2><label>Jeton d'acc\xE8s<input type="password" id="tok" inputmode="numeric" autocomplete="current-password"></label>
    <button class="primary" type="submit">Entrer</button><p class="hint" id="login-err"></p></form>
</div>

<div id="toast" class="toast" role="status" hidden></div>
<footer>Estimations statistiques indicatives \xE0 partir d'annonces publiques : ce n'est ni une expertise ni un conseil en investissement.</footer>
<script src="app.js"></script>
</body>
</html>
`},"/app.js":{t:"text/javascript; charset=utf-8",b:`"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nf = new Intl.NumberFormat("fr-CH", { maximumFractionDigits: 0 });
const money = (v, cur) => (v == null ? "\u2014" : nf.format(v).replace(/\u202F/g, " ") + " " + (cur === "chf" ? "CHF" : "\u20AC"));
const pct = (v, plus = true) => (v == null ? "\u2014" : (v > 0 && plus ? "+" : "") + v.toLocaleString("fr-CH", { maximumFractionDigits: 1 }) + " %");
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

// ---------- march\xE9
let segSort = { key: "n", dir: -1 };
const sig = (s) => \`\${s.listings}|\${s.active}|\${s.last_collect}|\${s.segments.length}\`;
async function loadMarket() {
  SUMMARY = await api("/api/summary");
  SUMMARY._sig = sig(SUMMARY);
  $("#mk-updated").textContent = "mis \xE0 jour \xE0 " + new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });
  $("#fxline").textContent = \`1 CHF = \${SUMMARY.fx_chf_eur.toFixed(3)} \u20AC\`;
  const b = $("#banner");
  if (SUMMARY.demo) { b.hidden = false; b.textContent = "Donn\xE9es de D\xC9MONSTRATION (synth\xE9tiques). Elles seront remplac\xE9es d\xE8s la premi\xE8re collecte r\xE9elle (onglet Sources)."; }
  else if (!SUMMARY.listings) { b.hidden = false; b.textContent = "Aucune donn\xE9e pour l'instant : lancez une collecte ou chargez la d\xE9mo dans l'onglet Sources."; }
  else b.hidden = true;
  $("#kpis").innerHTML = [
    ["Annonces actives", nf.format(SUMMARY.active)], ["Annonces suivies", nf.format(SUMMARY.listings)],
    ["Segments", SUMMARY.segments.length], ["Derni\xE8re collecte", SUMMARY.last_collect ? new Date(SUMMARY.last_collect).toLocaleString("fr-CH", { dateStyle: "short", timeStyle: "short" }) : "\u2014"],
  ].map(([k, v]) => \`<div class="card"><b>\${esc(v)}</b><span>\${esc(k)}</span></div>\`).join("");
  applyMarketAvailability();
  renderSegments();
}
/** Le choix Suisse / Allemagne n'appara\xEEt que s'il existe des annonces suisses ; sinon tout porte sur l'Allemagne. */
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
  $("#segtable tbody").innerHTML = rows.map((s) => \`<tr>
    <td><b>\${esc(s.segment)}</b></td><td class="num">\${s.n} \${CFG.hasCH ? \`<small class="muted">(\${s.n_de} DE \xB7 \${s.n_ch} CH)</small>\` : ""}</td>
    <td class="num">\${s.median_age} ans</td><td class="num">\${nf.format(s.median_km)}</td>
    <td class="num">\${money(conv(s.median_de_eur), cur)}</td><td class="num col-ch">\${money(conv(s.median_ch_eur), cur)}</td>
    <td class="num col-ch \${cls(s.ch_premium_pct)}">\${s.ch_premium_pct == null ? "\u2014" : pct(s.ch_premium_pct)}</td>
    <td class="num \${cls(s.trend_pct)}">\${s.trend_pct == null ? "\u2014" : pct(s.trend_pct)}</td></tr>\`).join("") || \`<tr><td colspan="8" class="muted">Aucune donn\xE9e.</td></tr>\`;
}
$("#mk-currency").addEventListener("change", renderSegments);
/** Recharge le march\xE9 (et la compatibilit\xE9 des options) ; avertit si de nouvelles donn\xE9es sont arriv\xE9es. */
async function refreshMarket(quiet) {
  const btn = $("#btn-refresh"); btn.disabled = true;
  try {
    const before = SUMMARY?._sig;
    CFG = await api("/api/config");
    await loadMarket(); fillFamilySelectsKeep();
    if (before && before !== SUMMARY._sig) { toast("Nouvelles donn\xE9es de march\xE9 charg\xE9es."); if ($("#tab-listings").classList.contains("on")) loadListings(); }
    else if (!quiet) toast("Le march\xE9 est d\xE9j\xE0 \xE0 jour.");
  } catch (e) { if (e.message !== "401" && !quiet) toast("Actualisation impossible : " + e.message); }
  finally { btn.disabled = false; }
}
$("#btn-refresh").addEventListener("click", () => refreshMarket(false));
// actualisation automatique : \xE0 l'ouverture de l'onglet, au retour sur la page, et toutes les 60 s (plus vite pendant une collecte)
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
/** Apr\xE8s un rechargement de la configuration : conserve les choix en cours, met \xE0 jour les puces compatibles. */
function fillFamilySelectsKeep() { renderEstimateChips(); renderListingChips(); fillBodySelect(); }
function fillFamilySelects() {
  const fams = Object.keys(CFG.families);
  for (const id of ["#f-family", "#o-family"]) $(id).innerHTML = fams.map((f) => \`<option>\${esc(f)}</option>\`).join("");
  $("#l-family").innerHTML = \`<option value="">Tous les mod\xE8les</option>\` + fams.map((f) => \`<option>\${esc(f)}</option>\`).join("");
  $("#f-family").value = "M3"; $("#o-family").value = "M3"; fillOptGens();
  renderListingChips(); fillBodySelect();
  $("#l-color").innerHTML = '<option value="">Toutes couleurs</option>' + (CFG.colors || []).map((c) => \`<option>\${esc(c)}</option>\`).join("");
  onFamily();
}
const chip = (o) => \`<label class="chip"><input type="checkbox" value="\${esc(o.key)}"><span>\${esc(o.label)}</span></label>\`;
/** Cl\xE9s d'\xE9quipements r\xE9ellement propos\xE9es pour un mod\xE8le (ou une g\xE9n\xE9ration) ; null = pas d'information, tout afficher. */
function compatKeys(family, generation) {
  if (!CFG.compat) return null;
  if (family && generation) { const c = CFG.compat[\`\${family} \${generation}\`]; return c ? new Set(c.options) : null; }
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
  for (const [sel, k] of kinds) { const prev = $$(sel + " input:checked").map((i) => i.value); $(sel).innerHTML = CFG.options.filter((o) => o.kind === k && !(sel === "#l-bodies" && o.key.startsWith("body_")) && (k === "cond" || !av || av.has(o.key))).map(chip).join(""); $$(sel + " input").forEach((i) => { i.checked = prev.includes(i.value); }); }
}
const BODY_KEYS = ["body_touring", "body_convertible", "body_gran_coupe"];
/** Liste d\xE9roulante \xAB carrosserie \xBB : seulement les carrosseries qui existent pour le mod\xE8le choisi. */
function fillBodySelect() {
  const sel = $("#l-body"), prev = sel.value, fam = $("#l-family").value;
  let av = compatKeys(fam, "");
  if (!fam && CFG.compat) { av = new Set(); for (const c of Object.values(CFG.compat)) c.options.forEach((x) => av.add(x)); }
  const bodies = BODY_KEYS.filter((k) => !av || av.has(k));
  sel.hidden = !bodies.length;
  sel.innerHTML = \`<option value="">Toutes carrosseries</option><option value="standard">Coup\xE9 / berline</option>\` +
    bodies.map((k) => \`<option value="\${k}">\${esc(labelOf(k).replace(/^Carrosserie /, ""))}</option>\`).join("");
  sel.value = bodies.includes(prev) || prev === "standard" ? prev : "";
}
function onFamily() {
  const gens = CFG.families[$("#f-family").value];
  $("#f-gen").innerHTML = gens.map((g) => \`<option value="\${esc(g.code)}">\${esc(g.code)} (\${g.years[0]}\u2013\${g.years[1] > 2030 ? "\u2026" : g.years[1]})</option>\`).join("");
  $("#f-gen").value = gens[gens.length - 1].code; onGen();
}
function onGen() {
  const g = CFG.families[$("#f-family").value].find((x) => x.code === $("#f-gen").value);
  $("#f-version").innerHTML = g.versions.map((v) => \`<option value="\${esc(v.name)}">\${esc(v.name)} \xB7 \${v.ps} ch</option>\`).join("");
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
  const box = $("#result"); box.innerHTML = \`<p class="hint">Calcul\u2026</p>\`;
  try { renderResult(await api("/api/estimate", { method: "POST", body: JSON.stringify(spec) }), spec); }
  catch (err) { box.innerHTML = \`<p class="bad">\${esc(err.message)}</p>\`; }
});
$("#btn-watch").addEventListener("click", async () => {
  const spec = readSpec();
  const name = prompt("Nom du v\xE9hicule suivi", \`\${spec.family} \${spec.generation} \${spec.year}\`);
  if (!name) return;
  await api("/api/watch", { method: "POST", body: JSON.stringify({ name, spec }) });
  $('#tabs button[data-tab="watch"]').click();
});

function confBadge(c) {
  const m = { "\xE9lev\xE9e": "high", moyenne: "mid", faible: "low", aucune: "low" }[c] || "low";
  return \`<span class="badge \${m}">confiance \${esc(c)}</span>\`;
}
function renderResult(r, spec) {
  const box = $("#result");
  if (!r.value) { box.classList.remove("has-rail"); box.innerHTML = \`<h2>\${esc(r.segment)}</h2><p class="warn">\${esc(r.message || "Estimation impossible.")}</p>\`; return; }
  const main = spec.market === "CH" ? "chf" : "eur", other = main === "chf" ? "eur" : "chf";
  const v = r.value;
  box.classList.add("has-rail");
  let h = \`<div class="res-main"><h2>\${esc(r.segment)} \xB7 \${esc(spec.version || "")}</h2>
    <div class="big">\${money(v[main], main)}</div>
    <div class="range">fourchette 80 % : \${money(v["low_" + main], main)} \u2013 \${money(v["high_" + main], main)} \xB7 \${money(v[other], other)}</div>
    <p>\${confBadge(r.confidence)} <span class="muted">\${r.n} annonces \xB7 \xE9cart-type du mod\xE8le \${r.sigma_pct ?? "\u2014"} % \xB7 m\xE9thode \${esc((r.method || "").replace("_", " "))}</span></p>\`;
  if (r.message) h += \`<p class="warn">\${esc(r.message)}</p>\`;
  if (r.extrapolation) h += \`<p class="warn">Ce v\xE9hicule sort de la plage observ\xE9e (\xE2ge ou kilom\xE9trage) : estimation peu fiable.</p>\`;
  if (r.transaction) h += \`<p>Prix de transaction indicatif : <b>\${money(r.transaction[main], main)}</b> <span class="muted">(baisse m\xE9diane observ\xE9e avant retrait : \${pct(r.transaction.discount_pct)}, sur \${r.transaction.n} annonces)</span></p>\`;
  else h += \`<p class="hint">C'est un prix demand\xE9 attendu. L'\xE9cart avec le prix de vente r\xE9el n'est pas encore mesur\xE9 (il faut quelques semaines de collecte).</p>\`;
  if (r.adjustments?.length) {
    h += \`<h3>Ce qui compose la cote</h3>\` + r.adjustments.map((a) => \`<div class="item"><span>\${esc(a.label)}\${a.significatif === false ? ' <small>effet non significatif</small>' : ""}</span><b class="\${cls(a.pct)}">\${pct(a.pct)}</b></div>\`).join("");
  }
  if (r.projection) {
    if (!r.projection.available) h += \`<h3>Projection</h3><p class="hint">\${esc(r.projection.reason)}</p>\`;
    else h += \`<h3>Projection de valeur</h3>\${projectionSvg(v, r.projection, main)}
      <p class="hint">\${esc(r.projection.warning)} Hypoth\xE8se de volatilit\xE9 annuelle du march\xE9 : \${Math.round(r.projection.vol_hypothesis * 100)} %. Km/an retenus : \${nf.format(r.projection.km_per_year)}.</p>\`;
  }
  if (r.comparables?.length) {
    h += \`<h3>Annonces comparables</h3>\` + r.comparables.map((c) => \`<div class="item"><span>\${compLink(c)}<small>\${c.year} \xB7 \${nf.format(c.km)} km \xB7 \${esc(c.country)}</small></span><b>\${money(c.price, c.currency.toLowerCase())}</b></div>\`).join("");
  }
  lastResult = { r, spec };
  if (!CFG.hasCH) h += \`<p class="hint">Aucune annonce suisse n'est encore collect\xE9e : cette cote est celle du march\xE9 allemand.</p>\`;
  h += \`</div><aside class="rail-side"><b>Et si je l'ach\xE8te ?</b>\${calcButtons(spec.market === "CH" ? "Comparer \xE0 l'import DE" : "Simuler l'import en Suisse", "est")}</aside>\`;
  box.innerHTML = h;
}
function compLink(c) {
  const t = esc(c.title || c.version || "Annonce");
  return /^https?:\\/\\//.test(c.url || "") ? \`<a href="\${esc(c.url)}" target="_blank" rel="noopener noreferrer">\${t}</a>\` : t;
}
function projectionSvg(v, p, cur) {
  const pts = [{ m: 0, c: v[cur], lo: v[cur], hi: v[cur] }, ...p.points.map((x) => ({ m: x.months, c: x["central_" + cur], lo: x["low_" + cur], hi: x["high_" + cur] }))];
  const W = 520, H = 220, L = 56, R = 14, T = 14, B = 34;
  const lo = Math.min(...pts.map((x) => x.lo)) * 0.97, hi = Math.max(...pts.map((x) => x.hi)) * 1.03;
  const X = (m) => L + (m / 36) * (W - L - R), Y = (val) => T + (1 - (val - lo) / (hi - lo)) * (H - T - B);
  const band = pts.map((x) => \`\${X(x.m)},\${Y(x.hi)}\`).join(" ") + " " + [...pts].reverse().map((x) => \`\${X(x.m)},\${Y(x.lo)}\`).join(" ");
  const line = pts.map((x) => \`\${X(x.m)},\${Y(x.c)}\`).join(" ");
  const ticks = [0, 12, 24, 36].map((m) => \`<text x="\${X(m)}" y="\${H - 10}" text-anchor="middle" fill="var(--muted)" font-size="11">\${m === 0 ? "aujourd'hui" : m + " mois"}</text>\`).join("");
  const yt = [lo, (lo + hi) / 2, hi].map((val) => \`<text x="\${L - 6}" y="\${Y(val) + 4}" text-anchor="end" fill="var(--muted)" font-size="11">\${nf.format(Math.round(val / 1000))} k</text><line x1="\${L}" x2="\${W - R}" y1="\${Y(val)}" y2="\${Y(val)}" stroke="var(--line)"/>\`).join("");
  const dots = pts.map((x) => \`<circle cx="\${X(x.m)}" cy="\${Y(x.c)}" r="4" fill="var(--accent)"/><text x="\${X(x.m) + (x.m === 0 ? 6 : x.m === 36 ? -6 : 0)}" y="\${Y(x.c) - 9}" text-anchor="\${x.m === 0 ? "start" : x.m === 36 ? "end" : "middle"}" fill="var(--ink)" font-size="11">\${nf.format(Math.round(x.c / 100) * 100)}</text>\`).join("");
  return \`<svg class="proj" viewBox="0 0 \${W} \${H}" role="img" aria-label="Projection de la valeur \xE0 12, 24 et 36 mois, avec fourchette">\${yt}<polygon points="\${band}" fill="var(--accent)" opacity=".15"/><polyline points="\${line}" fill="none" stroke="var(--accent)" stroke-width="2"/>\${dots}\${ticks}</svg>\`;
}

// ---------- options
function fillOptGens() {
  const gens = CFG.families[$("#o-family").value] || [];
  $("#o-gen").innerHTML = \`<option value="">Toutes g\xE9n\xE9rations</option>\` + gens.map((g) => \`<option value="\${esc(g.code)}">\${esc(g.code)} (\${g.years[0]}\u2013\${g.years[1] > 2030 ? "\u2026" : g.years[1]})</option>\`).join("");
}
async function loadOptions() {
  const fam = $("#o-family").value, gen = $("#o-gen").value, box = $("#o-groups");
  box.innerHTML = \`<p class="hint">Chargement\u2026</p>\`;
  const r = await api("/api/options/" + encodeURIComponent(fam) + (gen ? "?generation=" + encodeURIComponent(gen) : ""));
  $("#o-note").textContent = r.note || "";
  const groups = [["privilegier", "\xC0 privil\xE9gier", "good"], ["eviter", "\xC0 \xE9viter", "bad"], ["neutre", "Sans effet mesurable", "muted"], ["non_mesurable", "Effet non fiable (non retenu)", "muted"], ["insuffisant", "Pas assez de donn\xE9es", "muted"]];
  box.innerHTML = groups.map(([k, title, c]) => {
    const items = r.items.filter((i) => i.verdict === k);
    if (!items.length) return "";
    return \`<div class="group"><h3 class="\${c}">\${title} <span class="muted">(\${items.length})</span></h3>\` + items.map((i) => \`<div class="item">
      <span>\${esc(i.label)} \${i.kind === "etat" ? '<span class="tag">\xE9tat</span>' : i.kind === "carrosserie" ? '<span class="tag">mod\xE8le</span>' : ""}<small>\${i.n_with} annonces avec \xB7 \${i.n_without} sans\${i.days_with != null ? \` \xB7 vend en \${i.days_with} j contre \${i.days_without} j\` : ""}\${i.detail ? " \xB7 " + esc(i.detail) : ""}\${i.by_market ? \` \xB7 CH \${pct(i.by_market.CH.pct)} / DE \${pct(i.by_market.DE.pct)}\` : ""}</small></span>
      <b class="\${i.verdict === "non_mesurable" ? "" : cls(i.pct)}">\${i.pct == null ? "\u2014" : pct(i.pct)}</b></div>\`).join("") + \`</div>\`;
  }).join("") || \`<p class="hint">\${esc(r.note)}</p>\`;
}
$("#o-family").addEventListener("change", () => { fillOptGens(); loadOptions(); });
$("#o-gen").addEventListener("change", loadOptions);

// ---------- annonces
async function loadListings() {
  const q = new URLSearchParams({ family: $("#l-family").value, market: $("#l-market").value, sort: $("#l-sort").value, q: $("#l-q").value, limit: 80,
    color: $("#l-color").value, year_min: $("#l-yearmin").value, km_max: $("#l-kmmax").value,
    options: [...$$("#l-options input:checked, #l-bodies input:checked").map((i) => i.value), ...(BODY_KEYS.includes($("#l-body").value) ? [$("#l-body").value] : [])].join(","),
    flags: $$("#l-flags input:checked").map((i) => i.value).join(","), hide_damaged: $("#l-hide-damaged").checked ? "1" : "0" });
  if ($("#l-body").value === "standard") q.set("body", "standard");
  const nsel = $$("#l-options input:checked, #l-bodies input:checked, #l-flags input:checked").length; $("#l-opt-n").textContent = nsel ? \`(\${nsel} s\xE9lectionn\xE9e\${nsel > 1 ? "s" : ""})\` : "";
  const [r, wl] = await Promise.all([api("/api/listings?" + q), api("/api/watch?light=1").catch(() => [])]);
  WATCHED.clear(); wl.forEach((w) => { if (w.spec?.kind === "listing") WATCHED.set(String(w.spec.listing_id), w.id); });
  LISTINGS.clear(); r.items.forEach((i) => LISTINGS.set(String(i.id), i));
  $("#l-count").textContent = \`\${r.total} annonces\${r.total > 80 ? " (80 affich\xE9es)" : ""}. \xAB Cote \xBB = prix demand\xE9 attendu par le mod\xE8le ; un \xE9cart n\xE9gatif = moins cher que pr\xE9vu.\`;
  $("#ltable tbody").innerHTML = r.items.map((i) => {
    const link = /^https?:\\/\\//.test(i.url || "") ? \`<a href="\${esc(i.url)}" target="_blank" rel="noopener noreferrer">\${esc(i.title)}</a>\` : esc(i.title);
    const warn = (i.damaged ? '<span class="tag dmg">\xE9pave / d\xE9fectueux</span>' : "") + (i.accident && !i.damaged ? '<span class="tag dmg">accident\xE9</span>' : "")
      + (i.suspect && !i.damaged ? '<span class="tag chk">prix tr\xE8s bas : \xE0 v\xE9rifier</span>' : "");
    const opts = warn + [...i.options.slice(0, 3), ...i.flags.filter((f) => f !== "accident").slice(0, 2)].map((o) => \`<span class="tag">\${esc(labelOf(o))}</span>\`).join("");
    const on = WATCHED.has(String(i.id));
    const follow = \`<button type="button" class="mini follow\${on ? " on" : ""}" data-follow="\${esc(i.id)}">\${on ? "\u2605 Suivie" : "\u2606 Suivre"}</button>\`;
    return \`<tr><td>\${link}<br><small class="muted">\${esc(i.segment)} \xB7 \${esc(i.version)} \xB7 \${esc(i.country)}\${i.color ? " \xB7 " + esc(i.color) : ""}\${i.model_conf < 0.7 ? " \xB7 mod\xE8le incertain" : ""}</small><div>\${opts}</div></td>
      <td class="num">\${i.year}</td><td class="num">\${nf.format(i.km)}</td><td class="num">\${money(i.price, i.currency.toLowerCase())}</td>
      <td class="num">\${money(i.expected_eur, "eur")}</td><td class="num \${i.gap_pct == null ? "" : i.gap_pct < 0 ? "good" : "bad"}">\${i.gap_pct == null ? "\u2014" : pct(i.gap_pct)}\${i.gap_pct != null && i.gap_pct <= -8 && !i.suspect && !i.damaged && !i.accident ? '<br><span class="tag deal">bonne affaire</span>' : ""}</td>
      <td class="rail">\${calcButtons(i.country === "CH" ? "Comparer \xE0 l'import DE" : "Import en Suisse", i.id, follow)}</td></tr>\`;
  }).join("") || \`<tr><td colspan="7" class="muted">Aucune annonce.</td></tr>\`;
}
const LISTINGS = new Map(), WATCHED = new Map();
const calcButtons = (importLabel, id, extra = "") => \`<div class="rail-btns"><button type="button" class="mini" data-act="import" data-id="\${esc(id)}">\u21C4 \${esc(importLabel)}</button><button type="button" class="mini" data-act="credit" data-id="\${esc(id)}">\u25A4 Cr\xE9dit / leasing</button>\${extra}</div>\`;
const labelOf = (k) => (CFG.options.find((o) => o.key === k) || { label: k }).label;
["#l-market", "#l-sort", "#l-color", "#l-body", "#l-hide-damaged"].forEach((s) => $(s).addEventListener("change", loadListings));
$("#l-family").addEventListener("change", () => { renderListingChips(); fillBodySelect(); loadListings(); });
["#l-yearmin", "#l-kmmax"].forEach((s) => $(s).addEventListener("input", () => { clearTimeout(lt); lt = setTimeout(loadListings, 500); }));
["#l-options", "#l-bodies", "#l-flags"].forEach((s) => $(s).addEventListener("change", loadListings));
let lt; $("#l-q").addEventListener("input", () => { clearTimeout(lt); lt = setTimeout(loadListings, 350); });

// ---------- calculateurs int\xE9gr\xE9s : l'iframe prend la hauteur de son contenu (pas de d\xE9filement dans le cadre)
window.addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data || typeof e.data.cotesportCalcHeight !== "number") return;
  const h = e.data.cotesportCalcHeight; if (h < 200) return;
  for (const f of $$("iframe.calc")) if (f.contentWindow === e.source) f.style.height = h + "px";
});

// ---------- passerelles vers les calculateurs (pr\xE9remplis depuis une annonce ou une estimation)
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 7000); }
function openCalc(kind, params) {
  $(\`#tabs button[data-tab="\${kind}"]\`).click();
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
  const fx = SUMMARY.fx_chf_eur;                    // 1 CHF = fx \u20AC
  const isCH = item.country === "CH";
  const est = (market) => api("/api/estimate", { method: "POST", body: JSON.stringify({ ...spec, market }) });
  const label = btn?.textContent; if (btn) { btn.disabled = true; btn.textContent = "Calcul\u2026"; }
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
        } else toast("March\xE9 suisse pas encore mesur\xE9 : saisissez le prix d'une offre suisse \xE9quivalente pour comparer.");
      }
      openCalc("import", p);
    } else {
      const chf = isCH ? item.price : item.price_eur / fx;
      const e = await est(isCH ? "CH" : "DE");
      const p = { prix: roundTo(chf, 100), apport: roundTo(chf * 0.2, 500), premier: roundTo(chf * 0.1, 500) };
      const p36 = e.projection?.available ? e.projection.points.find((x) => x.months === 36) : null;
      if (p36) { p.dC = 36; p.dL = 36; p.vr = roundTo(p36.central_chf, 100); p.revente = roundTo(p36.central_chf, 100); p.reventeRachat = p.vr; }
      else toast("Valeur de revente non estim\xE9e (trop peu d'annonces comparables) : saisissez-la dans le calculateur.");
      openCalc("leasing", p);
    }
  } catch (err) { toast("Erreur : " + err.message); }
  finally { if (btn) { btn.disabled = false; btn.textContent = label; } }
}
$("#ltable").addEventListener("click", async (e) => {
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
  if (!r.length) { box.innerHTML = \`<p class="hint">Rien \xE0 suivre pour l'instant. Utilisez \u2606 Suivre dans la liste des annonces, ou \xAB Suivre ce v\xE9hicule \xBB dans l'onglet Estimer.</p>\`; return; }
  box.innerHTML = r.map((w) => {
    if (w.spec?.kind === "listing") {
      const l = w.listing, cur = (l?.currency || w.spec.currency || "EUR").toLowerCase();
      if (!l) return \`<div class="item"><span><b>\${esc(w.name)}</b><small>Annonce introuvable (supprim\xE9e de la base).</small></span><span><button class="ghost" data-del="\${w.id}">Retirer</button></span></div>\`;
      const first = l.history[0]?.price ?? w.spec.price, last = l.price, ch = first ? (last / first - 1) * 100 : null;
      const state = l.active ? '<span class="tag deal">en ligne</span>' : \`<span class="tag dmg">retir\xE9e\${l.removed_at ? " le " + dshort(l.removed_at) : ""} (vendue ou supprim\xE9e)</span>\`;
      const link = /^https?:\\/\\//.test(l.url || "") ? \`<a href="\${esc(l.url)}" target="_blank" rel="noopener noreferrer">\${esc(l.title)}</a>\` : esc(l.title);
      const hist = l.history.length > 1 ? \`<div class="pricehist">Historique : \${l.history.map((h) => money(h.price, cur) + " (" + dshort(h.at) + ")").join(" \u2192 ")}</div>\` : "";
      return \`<div class="item"><span><b>\${link}</b> \${state}<small>\${l.year} \xB7 \${nf.format(l.km)} km \xB7 \${esc(l.country)} \xB7 suivie depuis le \${dshort(w.created_at)}\${l.gap_pct != null && l.active ? " \xB7 \xE9cart \xE0 la cote " + pct(l.gap_pct) : ""}\${l.damaged ? " \xB7 \xE9pave / d\xE9fectueux" : ""}</small>\${hist}</span>
        <span style="text-align:right"><b>\${money(last, cur)}</b>\${ch != null && Math.abs(ch) >= 0.1 ? \`<small class="\${ch < 0 ? "good" : "bad"}">\${pct(ch)} depuis le suivi</small>\` : \`<small class="muted">prix inchang\xE9</small>\`}
        <br><button class="ghost" data-del="\${w.id}">Retirer</button></span></div>\`;
    }
    const e = w.estimate || {}, cur = w.spec.market === "CH" ? "chf" : "eur", v = e.value;
    const p36 = e.projection?.available ? e.projection.points[2] : null;
    return \`<div class="item"><span><b>\${esc(w.name)}</b> <span class="tag">cote</span><small>\${esc(w.spec.family)} \${esc(w.spec.generation)} \xB7 \${w.spec.year} \xB7 \${nf.format(w.spec.km)} km \xB7 \${esc(w.spec.market)}\${e.confidence ? " \xB7 confiance " + esc(e.confidence) : ""}</small></span>
      <span style="text-align:right"><b>\${v ? money(v[cur], cur) : "\u2014"}</b>\${p36 ? \`<small class="muted">dans 36 mois : \${money(p36["central_" + cur], cur)}</small>\` : ""}
      <br><button class="ghost" data-del="\${w.id}">Retirer</button></span></div>\`;
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
  $("#s-status").textContent = st.running ? \`Collecte en cours : \${st.current || "\u2026"}\` : "Aucune collecte en cours.";
  $("#btn-collect").disabled = st.running;
  $("#btn-stop").hidden = !st.running;
  const badge = (x) => ({ ok: '<span class="good">ok</span>', blocked: '<span class="bad">bloqu\xE9</span>', empty: '<span class="warn">rien reconnu</span>', partial: '<span class="warn">partiel</span>', error: '<span class="bad">erreur</span>', running: "en cours" }[x] || esc(x));
  const rows = s.sources.map((n) => h.last.find((r) => r.source === n) || { source: n });
  $("#stable tbody").innerHTML = rows.map((r) => \`<tr><td>\${esc(names[r.source] || r.source)}</td>
    <td>\${r.finished_at ? new Date(r.finished_at).toLocaleString("fr-CH", { dateStyle: "short", timeStyle: "short" }) : "jamais"}</td><td>\${r.status ? badge(r.status) : "\u2014"}</td>
    <td class="num">\${r.pages ?? "\u2014"}</td><td class="num">\${r.found ?? "\u2014"}</td><td class="num">\${r.new ?? "\u2014"}</td><td class="num">\${r.removed ?? "\u2014"}</td><td>\${esc(r.message || "")}</td></tr>\`).join("");
  $("#s-settings").textContent = \`Collecte automatique \${s.scheduler ? "tous les jours \xE0 " + s.collect_hour : "d\xE9sactiv\xE9e"} \xB7 pause entre requ\xEAtes ~\${s.delay_s} s \xB7 robots.txt \${s.robots ? "respect\xE9" : "ignor\xE9"} \xB7 mode \${s.mode}. Taux de change : \${h.fx ? h.fx.chf_eur.toFixed(4) + " (" + h.fx.source + ")" : "\u2014"}.\`;
  if (st.running) setTimeout(() => $("#tab-sources").classList.contains("on") && loadSources(), 5000);
}
$("#btn-stop").addEventListener("click", async () => {
  try { await api("/api/collect/stop", { method: "POST" }); $("#s-status").textContent = "Arr\xEAt demand\xE9 : la collecte s'interrompt apr\xE8s la page en cours\u2026"; } catch (e) { alert(e.message); }
  setTimeout(loadSources, 3000);
});
$("#btn-collect").addEventListener("click", async () => {
  try { await api("/api/collect", { method: "POST" }); } catch (e) { alert(e.message); }
  setTimeout(loadSources, 800);
});

// ---------- d\xE9marrage
async function init() {
  try {
    const a = await fetch("/api/auth-check", { headers: TOKEN ? { "X-Token": TOKEN } : {} }).then((r) => r.json());
    if (a.required && !a.ok) { showLogin(); return; }
    CFG = await api("/api/config");
    fillFamilySelects();
    await loadMarket(); scheduleAuto();
    const t = location.hash.slice(1); if (t) $(\`#tabs button[data-tab="\${t}"]\`)?.click();
  } catch (e) { if (e.message !== "401") $("#banner").hidden = false, ($("#banner").textContent = "Erreur : " + e.message); }
}
init();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
`},"/style.css":{t:"text/css; charset=utf-8",b:`:root{
  --bg:#f6f7f9;--panel:#fff;--ink:#1a1f29;--muted:#667085;--line:#e3e6eb;--accent:#1c64f2;--accent-ink:#fff;
  --good:#16794c;--bad:#b42318;--warn:#a15c07;--chip:#eef1f5;--shadow:0 1px 2px rgba(16,24,40,.06);
}
@media (prefers-color-scheme:dark){:root{
  --bg:#101319;--panel:#171b23;--ink:#e8ebf0;--muted:#98a2b3;--line:#262c38;--accent:#5b8dff;--accent-ink:#0b0f17;
  --good:#47c28b;--bad:#f97066;--warn:#f0b34a;--chip:#222836;--shadow:none;}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  padding-bottom:env(safe-area-inset-bottom)}
.top{position:sticky;top:0;z-index:5;background:var(--panel);border-bottom:1px solid var(--line);
  padding:10px 16px 0;padding-top:max(10px,env(safe-area-inset-top))}
.brand{font-weight:700;font-size:17px;display:flex;align-items:baseline;gap:8px}
.brand small{font-weight:400;color:var(--muted);font-size:12px}
.logo{color:var(--accent)}
nav{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;margin:8px -4px 0}
nav button{background:none;border:0;border-bottom:2px solid transparent;color:var(--muted);font:inherit;padding:8px 12px;cursor:pointer;white-space:nowrap}
nav button.on{color:var(--ink);border-bottom-color:var(--accent);font-weight:600}
main{max-width:1100px;margin:0 auto;padding:16px}
.tab{display:none}.tab.on{display:block}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px;box-shadow:var(--shadow);margin-bottom:16px}
.panel h2{margin:0 0 12px;font-size:16px}
.panel-h{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.panel-h h2{margin:0}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.card b{display:block;font-size:22px}.card span{color:var(--muted);font-size:12px}
.grid2{display:grid;grid-template-columns:minmax(0,420px) minmax(0,1fr);gap:16px;align-items:start}
@media (max-width:860px){.grid2{grid-template-columns:1fr}}
label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:var(--muted)}
label.inline{flex-direction:row;align-items:center;gap:8px}
input,select{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:9px 10px;min-width:0;width:100%}
label.inline select{width:auto}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
fieldset{border:1px solid var(--line);border-radius:10px;margin:0 0 12px;padding:8px 10px}
legend{font-size:12px;color:var(--muted);padding:0 4px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{display:inline-flex}
.chip input{position:absolute;opacity:0;pointer-events:none}
.chip span{background:var(--chip);border:1px solid transparent;border-radius:999px;padding:5px 11px;font-size:13px;color:var(--ink);cursor:pointer;user-select:none}
.chip input:checked+span{background:var(--accent);color:var(--accent-ink)}
.chip input:focus-visible+span{outline:2px solid var(--accent);outline-offset:2px}
button{font:inherit;border-radius:8px;padding:9px 14px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer}
button.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);font-weight:600}
button.ghost{background:none}
button:disabled{opacity:.5;cursor:default}
.actions{display:flex;gap:8px;flex-wrap:wrap}
.scroll{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{font-size:12px;color:var(--muted);font-weight:600;white-space:nowrap;cursor:default}
th[data-sort]{cursor:pointer}
.num{text-align:right;white-space:nowrap}
.good{color:var(--good)}.bad{color:var(--bad)}.warn{color:var(--warn)}.muted{color:var(--muted)}
.hint{color:var(--muted);font-size:13px;margin:8px 0 0}
.banner{background:#fff4d6;color:#5b3d00;padding:10px 16px;text-align:center;font-size:14px}
@media (prefers-color-scheme:dark){.banner{background:#3a2e0e;color:#f6dc9a}}
.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:8px}
.big{font-size:34px;font-weight:700;letter-spacing:-.5px}
.range{color:var(--muted)}
.badge{display:inline-block;border-radius:999px;padding:2px 9px;font-size:12px;font-weight:600;background:var(--chip)}
.badge.high{background:#d6f2e4;color:#0b5a37}.badge.mid{background:#fdecc8;color:#7a4a00}.badge.low{background:#fbdcd8;color:#8a1c12}
.group h3{margin:16px 0 6px;font-size:14px}
.item{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--line)}
.item small{display:block;color:var(--muted)}
.bar{height:8px;border-radius:4px;background:var(--chip);position:relative;margin-top:6px;overflow:hidden}
.bar i{position:absolute;top:0;bottom:0;background:var(--accent);opacity:.8;border-radius:4px}
svg.proj{width:100%;height:auto;margin-top:8px}
.modal{position:fixed;inset:0;background:rgba(10,12,18,.6);display:flex;align-items:center;justify-content:center;z-index:20;padding:16px}
.modal[hidden]{display:none}
.modal form{max-width:340px;width:100%}
footer{color:var(--muted);font-size:12px;text-align:center;padding:16px 16px 28px}
a{color:var(--accent)}
.tag{display:inline-block;background:var(--chip);border-radius:6px;padding:1px 6px;font-size:11px;margin:0 3px 0 0;color:var(--muted)}
button.danger{background:#b3261e;color:#fff;border-color:#b3261e}
.tag.deal{background:#1f7a45;color:#fff}details.more{margin:.5rem 0}details.more summary{cursor:pointer}

iframe.calc{width:100%;height:900px;min-height:420px;border:0;background:transparent;display:block;overflow:hidden}
.no-ch .col-ch{display:none}
button.mini{padding:3px 9px;font-size:12px;border-radius:999px;margin:6px 6px 0 0;color:var(--accent);border-color:var(--accent);background:none}
button.mini:disabled{opacity:.5}
.toast{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom));transform:translateX(-50%);max-width:min(560px,92vw);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:12px;font-size:14px;z-index:30;box-shadow:0 4px 18px rgba(0,0,0,.25)}
.toast[hidden]{display:none}
.tag.state{background:none;border:1px solid var(--line)}
.calcbar{margin-top:12px;padding-top:10px;border-top:1px solid var(--line)}

/* en-t\xEAte sport */
.top{background:#0d1015;color:#e8ebf0;border-bottom:0;position:sticky}
.top::after{content:"";display:block;height:3px;margin:0 -16px;background:linear-gradient(100deg,#ffb703 0 33%,#fb5607 33% 66%,#e63946 66%)}
.brand{align-items:center;font-size:18px;letter-spacing:.04em;text-transform:uppercase;font-weight:800;font-style:italic}
.brand small{text-transform:none;font-style:normal;letter-spacing:0;color:#98a2b3}
.logo-mark{width:30px;height:30px;flex:none;align-self:center}
.top nav button{color:#98a2b3}
.top nav button:hover{color:#fff}
.top nav button.on{color:#fff;border-bottom-color:#fb5607}
.small{font-size:12px}
label.switch{flex-direction:row;align-items:center;gap:8px;margin:2px 0 8px;color:var(--ink);font-size:14px}
label.switch input{width:auto}
/* colonne d'actions : s\xE9par\xE9e de la cotation / de l'annonce */
#ltable th.rail-h,#ltable td.rail{background:color-mix(in srgb,var(--accent) 6%,var(--panel));border-left:2px solid var(--accent);width:1%;white-space:nowrap}
#ltable td.rail{vertical-align:middle}
.rail-btns{display:flex;flex-direction:column;gap:6px;align-items:stretch}
.rail-btns button.mini{margin:0;text-align:left;padding:5px 11px}
button.mini.follow{color:var(--ink);border-color:var(--line)}
button.mini.follow.on{background:#ffb703;border-color:#ffb703;color:#1a1f29}
.result.has-rail{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:0;padding:0}
.result.has-rail .res-main{padding:16px}
.rail-side{border-left:2px solid var(--accent);background:color-mix(in srgb,var(--accent) 6%,var(--panel));padding:16px 14px;border-radius:0 12px 12px 0}
.rail-side b{display:block;margin-bottom:8px;font-size:13px}
.rail-side .rail-btns button.mini{white-space:normal}
@media (max-width:640px){.result.has-rail{grid-template-columns:1fr}.rail-side{border-left:0;border-top:2px solid var(--accent);border-radius:0 0 12px 12px}.rail-btns{flex-direction:row;flex-wrap:wrap}}
.tag.dmg{background:#fbdcd8;color:#8a1c12}.tag.chk{background:#fdecc8;color:#7a4a00}
@media (prefers-color-scheme:dark){.tag.dmg{background:#5a1f1a;color:#ffb4ab}.tag.chk{background:#4a3410;color:#f6dc9a}}
.pricehist{font-size:12px;color:var(--muted)}
`},"/manifest.json":{t:"application/manifest+json",b:`{
  "name": "CoteSport",
  "short_name": "CoteSport",
  "description": "Cote des v\xE9hicules sportifs, march\xE9s suisse et allemand",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0d1015",
  "theme_color": "#0d1015",
  "icons": [{ "src": "icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" }]
}
`},"/sw.js":{t:"text/javascript; charset=utf-8",b:`// Mise en cache de la coquille de l'application uniquement ; les donn\xE9es (API) passent toujours par le r\xE9seau.
const CACHE = "cotesport-shell-v7";
const SHELL = ["/", "/style.css", "/app.js", "/manifest.json", "/icon.svg", "/leasing", "/import"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.pathname.startsWith("/api/")) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
`},"/icon.svg":{t:"image/svg+xml",b:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#0d1015"/><g transform="translate(64 64) scale(6.25)"><path d="M8 52 L20 18 L30 18 L18 52Z" fill="#ffb703"/><path d="M22 52 L34 18 L44 18 L32 52Z" fill="#fb5607"/><path d="M36 52 L48 18 L58 18 L46 52Z" fill="#e63946"/></g></svg>
`},"/leasing.html":{t:"text/html; charset=utf-8",b:`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cr\xE9dit vs leasing \u2014 CoteSport</title>
<style>
:root{
  --bg:#f5f6f8;--card:#ffffff;--text:#1a1c20;--muted:#545b66;--border:#d5d9de;
  --credit:#0ea5b5;--credit-ink:#0b7a86;--credit-soft:#bfeef2;--credit-tint:#eafbfc;
  --leasing:#e8762c;--leasing-ink:#b85a1a;--leasing-soft:#fbd4ae;--leasing-tint:#fef2e6;
  --good:#14793f;--good-soft:#bfe8cf;--warn:#c23b3b;--warn-soft:#f6c4bd;
  box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#15171a;--card:#1f2226;--text:#eef0f2;--muted:#9aa2ad;--border:#3d4148;--credit-ink:#2ec4d6;--credit-soft:#0f4f56;--credit-tint:#123338;--leasing-ink:#f0975a;--leasing-soft:#5c3418;--leasing-tint:#2e2015;--good:#3ecf82;--good-soft:#164d2e;--warn:#ff6b5f;--warn-soft:#5a231d;}}
:root[data-theme="dark"]{--bg:#15171a;--card:#1f2226;--text:#eef0f2;--muted:#9aa2ad;--border:#3d4148;--credit-ink:#2ec4d6;--credit-soft:#0f4f56;--credit-tint:#123338;--leasing-ink:#f0975a;--leasing-soft:#5c3418;--leasing-tint:#2e2015;--good:#3ecf82;--good-soft:#164d2e;--warn:#ff6b5f;--warn-soft:#5a231d;}
*{box-sizing:border-box}
html{scroll-padding-top:env(safe-area-inset-top,0px);}
body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.45;}
.topbar{position:sticky;top:env(safe-area-inset-top,0px);z-index:10;background:var(--card);border-bottom:1px solid var(--border);padding:9px 16px;font-size:.85rem;font-weight:600;text-align:center;}
.wrap{max-width:1180px;margin:0 auto;padding:20px 16px 48px;}
h1{font-size:1.35rem;margin:0 0 4px;}
.sub{color:var(--muted);font-size:.88rem;margin:0 0 20px;}
.layout{display:grid;grid-template-columns:1.15fr 1fr;gap:20px;align-items:start;}
@media (max-width:880px){.layout{grid-template-columns:1fr}.output{position:static!important;max-height:none!important}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px 14px;}
details{border:1px solid var(--border);border-radius:12px;margin:0 0 12px;background:var(--card);overflow:hidden;}
summary{cursor:pointer;padding:13px 16px;font-weight:600;font-size:.88rem;list-style:none;display:flex;justify-content:space-between;align-items:center;}
summary::-webkit-details-marker{display:none}
summary::after{content:'+';color:var(--muted);font-size:1.15rem;font-weight:400;}
details[open] summary::after{content:'\u2212'}
.dbody{padding:2px 16px 16px;}
label{display:block;font-size:.78rem;color:var(--muted);margin-bottom:3px;}
input[type=number]{width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);font-size:.92rem;}
select{width:100%;padding:7px 9px;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);font-size:.9rem;}
.checkrow{display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--text);margin-top:10px;}
.checkrow input{width:auto;}
.hint{font-size:.74rem;color:var(--muted);margin-top:8px;}
.subhr{border:0;border-top:1px solid var(--border);margin:12px 0 10px;}
.output{position:sticky;top:calc(env(safe-area-inset-top,0px) + 52px);max-height:calc(100vh - 70px);overflow-y:auto;}
.verdict{background:var(--card);border:2px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;transition:border-color .2s;}
.verdict .big{font-size:1.15rem;font-weight:700;margin-bottom:4px;}
.verdict .sub2{color:var(--muted);font-size:.78rem;margin-bottom:10px;}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:.76rem;}
.bar-track{flex:1;background:var(--border);border-radius:6px;height:12px;overflow:hidden;}
.bar-fill{height:100%;border-radius:6px;}
.card{background:var(--card);border:2px solid var(--border);border-radius:14px;padding:16px 18px;margin-bottom:14px;}
.card:has(#creditBreak){border-color:var(--credit);}
.card:has(#leasingBreak){border-color:var(--leasing);}
.card h2{margin:-16px -18px 10px;padding:10px 18px;font-size:1rem;display:flex;align-items:center;gap:8px;border-radius:12px 12px 0 0;}
.card:has(#creditBreak) h2{background:var(--credit-tint);color:var(--credit-ink);}
.card:has(#leasingBreak) h2{background:var(--leasing-tint);color:var(--leasing-ink);}
.dot{width:12px;height:12px;border-radius:50%;display:inline-block;box-shadow:0 0 0 3px var(--card);}
.realpay{background:var(--bg);border-radius:10px;padding:10px 12px;margin-bottom:12px;}
.realpay .amt{font-size:1.4rem;font-weight:700;}
.realpay .lbl{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.03em;}
.subhead{font-size:.67rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:700;margin:10px 0 3px;}
.subhead:first-of-type{margin-top:0;}
.row{display:flex;justify-content:space-between;gap:8px;font-size:.82rem;padding:3.5px 6px;border-bottom:1px dashed var(--border);border-radius:6px;}
.row.total{font-weight:700;font-size:1rem;border-bottom:none;margin-top:8px;padding-top:10px;border-top:3px solid var(--border);}
.row.neg{color:var(--good);background:var(--good-soft);font-weight:600;}
.row.bad{color:var(--warn);background:var(--warn-soft);font-weight:600;}
#creditBreak .realpay{background:var(--credit-soft);box-shadow:inset 5px 0 0 var(--credit);}
#leasingBreak .realpay{background:var(--leasing-soft);box-shadow:inset 5px 0 0 var(--leasing);}
#creditBreak .realpay .amt{color:var(--credit-ink);}
#leasingBreak .realpay .amt{color:var(--leasing-ink);}
#creditBreak .row.total{border-top-color:var(--credit);background:var(--credit-tint);}
#leasingBreak .row.total{border-top-color:var(--leasing);background:var(--leasing-tint);}
.note{font-size:.73rem;color:var(--muted);margin-top:8px;padding-top:14px;border-top:1px solid var(--border);}
</style>
<style id="embed-css">
/* Mode int\xE9gr\xE9 dans CoteSport : pas de cadre, fond transparent, hauteur g\xE9r\xE9e par l'application h\xF4te */
html.embed{background:transparent}
html.embed body{background:transparent}
html.embed .topbar{display:none}
html.embed .wrap{max-width:none;padding:4px 0 28px}
html.embed .output{position:static!important;max-height:none!important;overflow:visible!important}
html.embed h1{font-size:1.15rem}
</style>
<script>
(function(){
  if(window.parent===window)return;
  var de=document.documentElement;de.classList.add('embed');
  var name=location.pathname.replace(/\\W/g,'')||'calc',last=0;
  function post(){var h=Math.ceil(de.getBoundingClientRect().height);if(Math.abs(h-last)>1){last=h;parent.postMessage({cotesportCalcHeight:h,name:name},location.origin);}}
  window.addEventListener('load',post);window.addEventListener('resize',post);
  if(window.ResizeObserver)new ResizeObserver(post).observe(de);else setInterval(post,500);
})();
</script>
</head>
<body>
<div class="topbar" id="topbar"></div>
<div class="wrap">
<h1>\u{1F697} Cr\xE9dit vs Leasing \u2014 Comparateur (Suisse)</h1>
<p class="sub">Co\xFBt net r\xE9el par mois, sur votre horizon r\xE9el de possession si vous revendez avant la fin du contrat.</p>

<div class="layout">
<div class="inputs">

<details open><summary>V\xE9hicule & financement</summary><div class="dbody">
<div class="grid"><div><label>Prix du v\xE9hicule (CHF)</label><input type="number" id="prix" value="25000" step="500"></div></div>
<hr class="subhr">
<b style="font-size:.78rem;color:var(--credit-ink);background:var(--credit-soft);padding:4px 10px;border-radius:20px;display:inline-block">Cr\xE9dit</b>
<div class="grid" style="margin-top:8px">
<div><label>Dur\xE9e du contrat (mois)</label><input type="number" id="dC" value="60" step="6"></div>
<div><label>Apport initial (CHF)</label><input type="number" id="apport" value="5000" step="500"></div>
<div><label>Taux d'int\xE9r\xEAt annuel (%)</label><input type="number" id="txC" value="4.9" step="0.1"></div>
<div><label>Frais de dossier (CHF)</label><input type="number" id="fraisC" value="250" step="50"></div>
<div><label>Valeur de revente si vous allez au bout (CHF)</label><input type="number" id="revente" value="8000" step="500"></div>
</div>
<hr class="subhr">
<b style="font-size:.78rem;color:var(--leasing-ink);background:var(--leasing-soft);padding:4px 10px;border-radius:20px;display:inline-block">Leasing</b>
<div class="grid" style="margin-top:8px">
<div><label>Dur\xE9e du contrat (mois)</label><input type="number" id="dL" value="36" step="6"></div>
<div><label>Premier loyer (CHF)</label><input type="number" id="premier" value="3000" step="500"></div>
<div><label>Valeur r\xE9siduelle fin de contrat (CHF)</label><input type="number" id="vr" value="13000" step="500"></div>
<div><label>Taux d'int\xE9r\xEAt annuel (%)</label><input type="number" id="txL" value="3.9" step="0.1"></div>
<div><label>Frais de dossier (CHF)</label><input type="number" id="fraisL" value="250" step="50"></div>
</div>
<div class="checkrow"><input type="checkbox" id="rachat"><label style="margin:0" for="rachat">Je compte racheter le v\xE9hicule \xE0 la valeur r\xE9siduelle en fin de contrat</label></div>
<div class="grid" id="fRachat" style="margin-top:8px;display:none">
<div><label>Valeur de revente estim\xE9e apr\xE8s rachat (CHF)</label><input type="number" id="reventeRachat" value="13000" step="500"></div>
</div>
</div></details>

<details open><summary>Revente anticip\xE9e / horizon r\xE9el</summary><div class="dbody">
<div class="checkrow" style="margin-top:0"><input type="checkbox" id="horizonActif"><label style="margin:0" for="horizonActif">Je compare sur un horizon de possession r\xE9el, plus court que les dur\xE9es contractuelles (cas fr\xE9quent : revente avant la fin du cr\xE9dit)</label></div>
<div class="grid" id="fHorizon" style="margin-top:10px;display:none">
<div><label>Horizon de possession r\xE9elle (mois)</label><input type="number" id="horizonMois" value="24" step="3"></div>
<div><label>Valeur de revente du v\xE9hicule \xE0 cet horizon (CHF)</label><input type="number" id="reventeHorizon" value="16000" step="500"></div>
<div><label>Indemnit\xE9 remb. anticip\xE9 cr\xE9dit (% du capital restant d\xFB)</label><input type="number" id="indemCredit" value="1" step="0.25"></div>
<div><label>P\xE9nalit\xE9 de sortie anticip\xE9e leasing (CHF)</label><input type="number" id="penaliteLeasing" value="0" step="100"></div>
</div>
<p class="hint">Si l'horizon d\xE9passe la dur\xE9e d'un contrat, celui-ci est calcul\xE9 normalement jusqu'\xE0 son terme (revente/rachat d\xE9j\xE0 d\xE9finis ci-dessus). Le cr\xE9dit revendu t\xF4t : vous soldez le capital restant d\xFB avec le prix de vente \u2014 le solde peut \xEAtre n\xE9gatif si la d\xE9pr\xE9ciation va plus vite que l'amortissement. Le leasing n'offre presque jamais de sortie anticip\xE9e sans frais : \xE0 d\xE9faut de clause connue dans votre contrat, restez prudent sur la p\xE9nalit\xE9 saisie.</p>
</div></details>

<details><summary>Kilom\xE9trage & usure</summary><div class="dbody">
<div class="grid">
<div><label>Forfait inclus (km/an)</label><input type="number" id="kmInc" value="15000" step="1000"></div>
<div><label>Kilom\xE9trage r\xE9el pr\xE9vu (km/an)</label><input type="number" id="kmReel" value="15000" step="1000"></div>
<div><label>Co\xFBt du km suppl\xE9mentaire (CHF)</label><input type="number" id="coutKm" value="0.25" step="0.05"></div>
<div><label>Provision usure / remise en \xE9tat (CHF, leasing)</label><input type="number" id="usure" value="0" step="100"></div>
</div>
<div class="checkrow"><input type="checkbox" id="usureCredit"><label style="margin:0" for="usureCredit">Appliquer aussi cette provision au cr\xE9dit (marge de prudence)</label></div>
<p class="hint">L'entretien courant est g\xE9r\xE9 dans la section suivante et d\xE9j\xE0 compt\xE9 des deux c\xF4t\xE9s. L'usure ci-dessus est le malus contractuel de fin de leasing \u2014 c\xF4t\xE9 cr\xE9dit elle est en principe d\xE9j\xE0 dans votre estimation de revente ; ne cochez que pour une marge suppl\xE9mentaire.</p>
</div></details>

<details><summary>Entretien & assurance</summary><div class="dbody">
<div class="grid">
<div><label>Entretien & pneus estim\xE9s (CHF/an)</label><input type="number" id="entretien" value="800" step="50"></div>
<div><label>Assurance casco compl\xE8te (CHF/mois)</label><input type="number" id="assurance" value="80" step="5"></div>
</div>
<div class="checkrow"><input type="checkbox" id="inclusL"><label style="margin:0" for="inclusL">Entretien & pneus d\xE9j\xE0 inclus dans le loyer leasing</label></div>
<div class="checkrow"><input type="checkbox" id="assCredit"><label style="margin:0" for="assCredit">Appliquer aussi l'assurance casco au cr\xE9dit</label></div>
</div></details>

<details><summary>Fiscalit\xE9</summary><div class="dbody">
<div class="grid">
<div><label>Usage du v\xE9hicule</label><select id="usage"><option value="prive">Priv\xE9</option><option value="independant">Ind\xE9pendant</option></select></div>
<div><label>Taux marginal d'imposition (%)</label><input type="number" id="txMarg" value="30" step="1"></div>
<div id="fFortune"><label>Taux d'imp\xF4t sur la fortune (%)</label><input type="number" id="txFort" value="0.3" step="0.05"></div>
<div id="fRendement"><label>Rendement imposable fortune, hors immo (CHF/an)</label><input type="number" id="rendFort" value="0" step="500"></div>
</div>
<p class="hint" id="fiscNote"></p>
</div></details>

<details><summary>Co\xFBt d'opportunit\xE9 du capital</summary><div class="dbody">
<div class="grid"><div><label>Taux de placement alternatif (%/an)</label><input type="number" id="txPlacement" value="2" step="0.25"></div></div>
<p class="hint">Croissance perdue sur l'apport/premier loyer + frais de dossier, calcul\xE9e sur votre horizon r\xE9el de possession.</p>
</div></details>

</div>

<div class="output">
<div class="verdict" id="verdictBox"><div id="verdict"></div><div id="bars"></div></div>
<div class="card"><h2><span class="dot" style="background:var(--credit)"></span>Cr\xE9dit</h2><div id="creditBreak"></div></div>
<div class="card"><h2><span class="dot" style="background:var(--leasing)"></span>Leasing</h2><div id="leasingBreak"></div></div>
</div>
</div>

<p class="note">Mod\xE8le indicatif : amortissement cr\xE9dit \xE0 mensualit\xE9 constante, plafond de d\xE9duction des int\xE9r\xEAts passifs (rendement de la fortune + CHF 50'000/an) en usage priv\xE9 \u2014 r\xE8gle en vigueur jusqu'\xE0 fin 2028 au moins. En cas de revente/sortie anticip\xE9e, le capital restant d\xFB est calcul\xE9 comme la valeur actuelle des mensualit\xE9s restantes ; l'indemnit\xE9 de remboursement anticip\xE9 et la p\xE9nalit\xE9 leasing d\xE9pendent de votre contrat r\xE9el, v\xE9rifiez-les. Le co\xFBt d'opportunit\xE9 ne porte que sur le capital vers\xE9 d'avance. V\xE9rifiez vos taux fiscaux r\xE9els (fortement variables par canton) avant toute d\xE9cision.</p>
</div>

<script>
const $=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat('fr-CH',{maximumFractionDigits:0}).format(Math.round(n))+' CHF';

function calc(){
  const prix=+$('prix').value;
  const dC=+$('dC').value, apport=+$('apport').value, txC=+$('txC').value, fraisC=+$('fraisC').value, revente=+$('revente').value;
  const dL=+$('dL').value, premier=+$('premier').value, vr=+$('vr').value, txL=+$('txL').value, fraisL=+$('fraisL').value, rachat=$('rachat').checked, reventeRachat=+$('reventeRachat').value;
  const kmInc=+$('kmInc').value, kmReel=+$('kmReel').value, coutKm=+$('coutKm').value, usure=+$('usure').value, usureCredit=$('usureCredit').checked;
  const entretien=+$('entretien').value, inclusL=$('inclusL').checked;
  const assM=+$('assurance').value, assCredit=$('assCredit').checked;
  const usage=$('usage').value, txMarg=+$('txMarg').value, txFort=+$('txFort').value, rendFort=+$('rendFort').value;
  const txPlacement=+$('txPlacement').value;
  const horizonOn=$('horizonActif').checked, horizonMois=+$('horizonMois').value, reventeHorizon=+$('reventeHorizon').value, indemCredit=+$('indemCredit').value, penaliteLeasingV=+$('penaliteLeasing').value;

  $('fRachat').style.display = rachat ? '' : 'none';
  $('fHorizon').style.display = horizonOn ? '' : 'none';
  $('fFortune').style.display = usage==='prive' ? '' : 'none';
  $('fRendement').style.display = usage==='prive' ? '' : 'none';
  $('fiscNote').textContent = usage==='prive'
    ? "Priv\xE9 : int\xE9r\xEAts d\xE9ductibles (plafonn\xE9s \xE0 rendement de la fortune + CHF 50'000/an), dette qui r\xE9duit la fortune imposable. Leasing priv\xE9 : aucune d\xE9duction."
    : "Ind\xE9pendant : int\xE9r\xEAts + d\xE9pr\xE9ciation r\xE9ellement subie d\xE9ductibles c\xF4t\xE9 cr\xE9dit, totalit\xE9 des loyers d\xE9ductible c\xF4t\xE9 leasing.";

  const capF=Math.max(prix-apport,0);
  const rM=txC/100/12;
  const mensC = rM===0 ? capF/dC : capF*rM/(1-Math.pow(1+rM,-dC));
  const interetsCFull = mensC*dC-capF;

  const mensL = (prix-vr)/dL + ((prix+vr)/2*(txL/100))/12;

  const HC = horizonOn ? Math.min(horizonMois,dC) : dC;
  const HL = horizonOn ? Math.min(horizonMois,dL) : dL;
  const creditFullTerm = HC>=dC, leasingFullTerm = HL>=dL;

  let crd=0, penalCredit=0, netAssetCredit;
  if(creditFullTerm){ netAssetCredit=revente; }
  else{
    crd = rM===0 ? Math.max(capF-mensC*HC,0) : mensC*(1-Math.pow(1+rM,-(dC-HC)))/rM;
    penalCredit = crd*(indemCredit/100);
    netAssetCredit = reventeHorizon-crd-penalCredit;
  }
  const totMensCPeriod = mensC*HC;
  const interetsCPeriod = creditFullTerm ? interetsCFull : (totMensCPeriod-(capF-crd));
  const detteMoyPeriod = creditFullTerm ? capF/2 : (capF+crd)/2;

  let achatRachat=0, actifRachat=0, penaliteLeasingApplied=0;
  if(leasingFullTerm){ achatRachat=rachat?vr:0; actifRachat=rachat?reventeRachat:0; }
  else{ penaliteLeasingApplied=penaliteLeasingV; }
  const totMensLPeriod = mensL*HL;
  const interetsLPeriod = totMensLPeriod-Math.min((prix-vr)*(HL/dL),prix-vr);

  const kmSupp = Math.max(0,kmReel-kmInc)*(HL/12)*coutKm;
  const entretienC = entretien*(HC/12);
  const entretienL = inclusL?0:entretien*(HL/12);
  const usureC = usureCredit?usure:0;
  const assTotC = assCredit?assM*HC:0;
  const assTotL = assM*HL;

  let avCredit, avLeasing;
  if(usage==='prive'){
    const plafond=rendFort+50000;
    const interetsAnnMoy=interetsCPeriod/(HC/12);
    const interetsDeduct=Math.min(interetsAnnMoy,plafond)*(HC/12);
    avCredit = interetsDeduct*(txMarg/100) + detteMoyPeriod*(txFort/100)*(HC/12);
    avLeasing = 0;
  } else {
    const deprDeduct = Math.max(prix-Math.max(netAssetCredit,0),0);
    avCredit = (interetsCPeriod+deprDeduct)*(txMarg/100);
    avLeasing = totMensLPeriod*(txMarg/100);
  }

  const capInitC=apport+fraisC, capInitL=premier+fraisL;
  const oppC = capInitC*(Math.pow(1+txPlacement/100,HC/12)-1);
  const oppL = capInitL*(Math.pow(1+txPlacement/100,HL/12)-1);

  const coutCredit = apport+fraisC+totMensCPeriod+assTotC+entretienC+usureC-netAssetCredit-avCredit+oppC;
  const coutLeasing = premier+fraisL+totMensLPeriod+assTotL+entretienL+kmSupp+usure+achatRachat-actifRachat+penaliteLeasingApplied-avLeasing+oppL;
  const mensNetC=coutCredit/HC, mensNetL=coutLeasing/HL;

  const creditTermHTML = creditFullTerm
    ? \`<div class="subhead">Ajustements</div>
       <div class="row"><span>Co\xFBt d'opportunit\xE9 de l'apport</span><span>+\${fmt(oppC)}</span></div>
       <div class="row neg"><span>\u2212 Valeur de revente (actif conserv\xE9)</span><span>\u2212\${fmt(revente)}</span></div>\`
    : \`<div class="subhead">Revente anticip\xE9e (mois \${HC})</div>
       <div class="row"><span>Prix de revente estim\xE9</span><span>\${fmt(reventeHorizon)}</span></div>
       <div class="row"><span>\u2212 Capital restant d\xFB</span><span>\u2212\${fmt(crd)}</span></div>
       <div class="row"><span>\u2212 Indemnit\xE9 remb. anticip\xE9</span><span>\u2212\${fmt(penalCredit)}</span></div>
       <div class="row \${netAssetCredit>=0?'neg':'bad'}"><span>\${netAssetCredit>=0?'= Valeur nette r\xE9cup\xE9r\xE9e':'= Solde n\xE9gatif \xE0 combler'}</span><span>\${netAssetCredit>=0?'\u2212'+fmt(netAssetCredit):'+'+fmt(-netAssetCredit)}</span></div>
       <div class="subhead">Ajustements</div>
       <div class="row"><span>Co\xFBt d'opportunit\xE9 de l'apport</span><span>+\${fmt(oppC)}</span></div>\`;

  $('creditBreak').innerHTML=\`
    <div class="realpay"><div class="lbl">Mensualit\xE9 r\xE9ellement pay\xE9e</div><div class="amt">\${fmt(mensC)}/mois</div></div>
    <div class="subhead">Financement</div>
    <div class="row"><span>Apport initial</span><span>\${fmt(apport)}</span></div>
    <div class="row"><span>Frais de dossier</span><span>\${fmt(fraisC)}</span></div>
    <div class="row"><span>Capital emprunt\xE9</span><span>\${fmt(capF)}</span></div>
    <div class="row"><span>Int\xE9r\xEAts pay\xE9s (\${HC} mois)</span><span>\${fmt(interetsCPeriod)}</span></div>
    <div class="subhead">Co\xFBts d'usage</div>
    <div class="row"><span>Entretien & pneus</span><span>\${fmt(entretienC)}</span></div>
    <div class="row"><span>Assurance casco</span><span>\${fmt(assTotC)}</span></div>
    <div class="row"><span>Provision usure (optionnelle)</span><span>\${fmt(usureC)}</span></div>
    \${creditTermHTML}
    <div class="row neg"><span>\u2212 Avantage fiscal</span><span>\u2212\${fmt(avCredit)}</span></div>
    <div class="row total"><span>Co\xFBt net total (\${HC} mois)</span><span>\${fmt(coutCredit)}</span></div>
    <div class="row"><span>\u2248 co\xFBt net / mois</span><span>\${fmt(mensNetC)}</span></div>\`;

  const leasingTermHTML = leasingFullTerm
    ? \`<div class="subhead">Rachat en fin de contrat</div>
       <div class="row"><span>Achat v\xE9hicule (VR)</span><span>\${rachat?fmt(achatRachat):'\u2014'}</span></div>
       <div class="row neg"><span>\u2212 Valeur de l'actif acquis</span><span>\${rachat?'\u2212'+fmt(actifRachat):'\u2014'}</span></div>\`
    : \`<div class="subhead">Sortie anticip\xE9e (mois \${HL})</div>
       <div class="row"><span>P\xE9nalit\xE9 de r\xE9siliation</span><span>\${fmt(penaliteLeasingApplied)}</span></div>
       <div class="hint" style="margin:2px 0 8px">Aucun actif r\xE9cup\xE9r\xE9 : le v\xE9hicule est restitu\xE9 au bailleur.</div>\`;

  $('leasingBreak').innerHTML=\`
    <div class="realpay"><div class="lbl">Mensualit\xE9 r\xE9ellement pay\xE9e</div><div class="amt">\${fmt(mensL)}/mois</div></div>
    <div class="subhead">Financement</div>
    <div class="row"><span>Premier loyer</span><span>\${fmt(premier)}</span></div>
    <div class="row"><span>Frais de dossier</span><span>\${fmt(fraisL)}</span></div>
    <div class="row"><span>Loyers pay\xE9s (\${HL} mois, dt. int\xE9r\xEAts \${fmt(interetsLPeriod)})</span><span>\${fmt(totMensLPeriod)}</span></div>
    <div class="subhead">Co\xFBts d'usage</div>
    <div class="row"><span>Entretien & pneus</span><span>\${fmt(entretienL)}</span></div>
    <div class="row"><span>Assurance casco (obligatoire)</span><span>\${fmt(assTotL)}</span></div>
    <div class="row"><span>D\xE9passement kilom\xE9trique</span><span>\${fmt(kmSupp)}</span></div>
    <div class="row"><span>Provision usure</span><span>\${fmt(usure)}</span></div>
    \${leasingTermHTML}
    <div class="subhead">Ajustements</div>
    <div class="row"><span>Co\xFBt d'opportunit\xE9 du 1er loyer</span><span>+\${fmt(oppL)}</span></div>
    <div class="row neg"><span>\u2212 Avantage fiscal</span><span>\u2212\${fmt(avLeasing)}</span></div>
    <div class="row total"><span>Co\xFBt net total (\${HL} mois)</span><span>\${fmt(coutLeasing)}</span></div>
    <div class="row"><span>\u2248 co\xFBt net / mois</span><span>\${fmt(mensNetL)}</span></div>\`;

  const diff=mensNetL-mensNetC;
  const cheaper=diff>=0?'cr\xE9dit':'leasing';
  const color=diff>=0?'var(--credit-ink)':'var(--leasing-ink)';
  $('verdict').innerHTML=\`<div class="big" style="color:\${color}">Le \${cheaper} co\xFBte \${fmt(Math.abs(diff))}/mois de moins</div><div class="sub2">Co\xFBt net \xE9quivalent \u2014 compar\xE9 sur \${HC} mois (cr\xE9dit) vs \${HL} mois (leasing)</div>\`;
  $('topbar').innerHTML=\`\${cheaper==='cr\xE9dit'?'\u{1F535}':'\u{1F7E0}'} Le \${cheaper} est \${fmt(Math.abs(diff))}/mois moins cher (net)\`;
  $('topbar').style.color = color;
  const colorSolid = diff>=0?'var(--credit)':'var(--leasing)';
  $('verdictBox').style.borderColor = colorSolid;

  const max=Math.max(mensNetC,mensNetL,1);
  $('bars').innerHTML=\`
    <div class="bar-row"><span style="width:55px">Cr\xE9dit</span><div class="bar-track"><div class="bar-fill" style="width:\${mensNetC/max*100}%;background:var(--credit)"></div></div><span>\${fmt(mensNetC)}</span></div>
    <div class="bar-row"><span style="width:55px">Leasing</span><div class="bar-track"><div class="bar-fill" style="width:\${mensNetL/max*100}%;background:var(--leasing)"></div></div><span>\${fmt(mensNetL)}</span></div>\`;
}
document.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',calc));
calc();
</script>

<script>
// Pr\xE9remplissage depuis l'appli : leasing.html#prix=45000&dC=36 \u2026 (ids des champs ; cases \xE0 cocher : 1/0)
(function(){
  function apply(){
    var h=new URLSearchParams(location.hash.slice(1)),any=false;
    h.forEach(function(v,k){var el=document.getElementById(k);if(!el)return;any=true;if(el.type==='checkbox')el.checked=(v==='1'||v==='true');else el.value=v;});
    if(any){document.querySelectorAll('input,select').forEach(function(e){e.dispatchEvent(new Event('input',{bubbles:true}));});}
  }
  window.addEventListener('hashchange',apply);apply();
})();
</script>
</body>
</html>


<script>
// Pr\xE9remplissage depuis l'appli : leasing.html#prix=45000&dC=36 \u2026 (ids des champs ; cases \xE0 cocher : 1/0)
(function(){
  function apply(){
    var h=new URLSearchParams(location.hash.slice(1)),any=false;
    h.forEach(function(v,k){var el=document.getElementById(k);if(!el)return;any=true;if(el.type==='checkbox')el.checked=(v==='1'||v==='true');else el.value=v;});
    if(any){document.querySelectorAll('input,select').forEach(function(e){e.dispatchEvent(new Event('input',{bubbles:true}));});}
  }
  window.addEventListener('hashchange',apply);apply();
})();
</script>
</body></html>`},"/import.html":{t:"text/html; charset=utf-8",b:`<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Import Allemagne \u2194 Suisse \u2014 CoteSport</title>
<style>
/* Layout : saisie en sections color\xE9es \xE0 gauche, r\xE9sultat collant \xE0 droite. Couleurs : rouge suisse, or allemand, bleu change, vert verdict */
:root{
  --bg:#f3f5f9;--card:#ffffff;--text:#172030;--muted:#5f6b7c;--border:#e0e5ee;
  --ch:#d52b1e;--chSoft:#fdecea;--de:#c48600;--deSoft:#fdf4de;
  --fx:#2d6cdf;--fxSoft:#e8f0fd;--tr:#0f8f86;--trSoft:#e1f5f3;--dz:#7a4fd1;--dzSoft:#f0eafc;
  --veh:#4a5a74;--vehSoft:#eceff5;--good:#15924d;--goodSoft:#e2f6eb;--field:#f7f9fc;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#11151b;--card:#1b2029;--text:#edf1f6;--muted:#9ba6b6;--border:#2d3440;--ch:#ff6a5e;--chSoft:#3a1f1e;--de:#f0b53a;--deSoft:#362c14;--fx:#6d9cff;--fxSoft:#1b2a44;--tr:#3fc7bb;--trSoft:#14322f;--dz:#a88bff;--dzSoft:#2a2242;--veh:#aab6ca;--vehSoft:#252c37;--good:#3fd07f;--goodSoft:#16301f;--field:#141922;color-scheme:dark;}}
:root[data-theme="dark"]{--bg:#11151b;--card:#1b2029;--text:#edf1f6;--muted:#9ba6b6;--border:#2d3440;--ch:#ff6a5e;--chSoft:#3a1f1e;--de:#f0b53a;--deSoft:#362c14;--fx:#6d9cff;--fxSoft:#1b2a44;--tr:#3fc7bb;--trSoft:#14322f;--dz:#a88bff;--dzSoft:#2a2242;--veh:#aab6ca;--vehSoft:#252c37;--good:#3fd07f;--goodSoft:#16301f;--field:#141922;color-scheme:dark;}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.45;-webkit-text-size-adjust:100%;}
.topbar{position:sticky;top:env(safe-area-inset-top,0px);z-index:10;background:var(--card);border-bottom:1px solid var(--border);padding:10px 16px;font-size:.86rem;font-weight:600;display:flex;justify-content:center;gap:14px;flex-wrap:wrap;font-variant-numeric:tabular-nums;}
.topbar b{font-weight:700}
.tb-ch{color:var(--ch)} .tb-de{color:var(--de)} .tb-win{color:var(--good);background:var(--goodSoft);padding:1px 9px;border-radius:999px}
.wrap{max-width:1180px;margin:0 auto;padding:22px 16px 48px;}
h1{font-size:1.4rem;margin:0 0 6px;text-wrap:balance;letter-spacing:-.01em}
h1 .c1{color:var(--ch)} h1 .c2{color:var(--de)}
.sub{color:var(--muted);font-size:.88rem;margin:0 0 20px;max-width:70ch;}
.layout{display:grid;grid-template-columns:1.15fr 1fr;gap:22px;align-items:start;}
.layout>*{min-width:0}
@media (max-width:880px){.layout{grid-template-columns:1fr}.output{position:static!important;max-height:none!important}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px 14px;}
details{--c:var(--veh);--s:var(--vehSoft);border:1px solid var(--border);border-radius:14px;margin:0 0 12px;background:var(--card);overflow:hidden;}
details.t-ch{--c:var(--ch);--s:var(--chSoft)} details.t-de{--c:var(--de);--s:var(--deSoft)}
details.t-fx{--c:var(--fx);--s:var(--fxSoft)} details.t-tr{--c:var(--tr);--s:var(--trSoft)} details.t-dz{--c:var(--dz);--s:var(--dzSoft)}
summary{cursor:pointer;padding:12px 16px;font-weight:650;font-size:.9rem;list-style:none;display:flex;align-items:center;gap:10px;background:var(--s);color:var(--text);}
summary::-webkit-details-marker{display:none}
summary .ic{width:26px;height:26px;border-radius:8px;background:var(--c);color:#fff;display:grid;place-items:center;font-size:.72rem;font-weight:800;flex:none;letter-spacing:.02em}
summary .t{flex:1}
summary::after{content:'';width:8px;height:8px;border-right:2px solid var(--c);border-bottom:2px solid var(--c);transform:rotate(45deg);margin-right:4px;transition:transform .2s}
details[open] summary::after{transform:rotate(-135deg)}
@media (prefers-reduced-motion:reduce){summary::after{transition:none}}
.flag{display:none}
.dbody{padding:14px 16px 16px;border-top:1px solid var(--border)}
label{display:block;font-size:.77rem;color:var(--muted);margin-bottom:4px;}
input[type=number],select{width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:9px;background:var(--field);color:var(--text);font-size:.93rem;font-variant-numeric:tabular-nums;font-family:inherit}
input[disabled]{opacity:.65}
input:focus-visible,select:focus-visible{outline:2px solid var(--c,var(--fx));outline-offset:1px;border-color:transparent}
summary:focus-visible{outline:2px solid var(--c);outline-offset:-2px}
.checkrow{display:flex;align-items:flex-start;gap:9px;margin-top:12px;}
.checkrow input{width:18px;height:18px;margin-top:1px;accent-color:var(--c);flex:none}
.checkrow label{margin:0;color:var(--text);font-size:.83rem}
.hint{font-size:.75rem;color:var(--muted);margin:10px 0 0;}
.output{position:sticky;top:calc(env(safe-area-inset-top,0px) + 56px);max-height:calc(100vh - 72px);overflow-y:auto;}
.verdict{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:18px 16px 16px;margin-bottom:14px;text-align:center;}
body[data-win="de"] .verdict,body[data-win="ch"] .verdict{background:var(--goodSoft);border-color:transparent}
.big{font-size:1.2rem;font-weight:750;margin-bottom:4px;text-wrap:balance;line-height:1.3}
.big .amt{color:var(--good);white-space:nowrap}
.sub2{color:var(--muted);font-size:.78rem;margin-bottom:12px;}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:7px;font-size:.78rem;font-variant-numeric:tabular-nums;font-weight:600}
.bar-row .n{width:72px;text-align:left}
.bar-row .v{width:96px;text-align:right}
.bar-track{flex:1;background:var(--card);border-radius:7px;height:14px;overflow:hidden;}
.bar-fill{height:100%;border-radius:7px;}
.kpis{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.kpi{background:var(--card);border-radius:12px;padding:10px 11px;text-align:left}
.kpi .l{font-size:.64rem;text-transform:uppercase;letter-spacing:.05em;color:var(--fx);font-weight:750}
.kpi .a{font-size:1.06rem;font-weight:750;font-variant-numeric:tabular-nums}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:0;margin-bottom:14px;overflow:hidden}
.card h2{margin:0;font-size:.95rem;display:flex;align-items:center;gap:9px;padding:12px 16px;background:var(--vehSoft)}
.card.c-ch h2{background:var(--chSoft)} .card.c-de h2{background:var(--deSoft)} .card.chart h2{background:var(--fxSoft)}
.card .cb{padding:6px 16px 14px}
.dot{width:10px;height:10px;border-radius:50%;display:inline-block;}
.subhead{font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:750;margin:12px 0 3px;}
.row{display:flex;justify-content:space-between;gap:10px;font-size:.83rem;padding:4px 0;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;}
.row span:last-child{white-space:nowrap;font-weight:550}
.row.total{font-weight:750;font-size:1rem;border-bottom:none;margin-top:10px;padding:9px 11px;border-radius:10px;background:var(--vehSoft)}
.c-ch .row.total{background:var(--chSoft)} .c-de .row.total{background:var(--deSoft)}
.row.neg{color:var(--good);}
.row.mute{color:var(--muted)}
.row.mute span:last-child{font-weight:400}
.chart svg{width:100%;height:auto;display:block}
.fxbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px;font-size:.78rem;color:var(--muted)}
.fxbar span{flex:1 1 180px}
.fxbar button,.fxbar a{font:inherit;font-weight:650;color:var(--fx);background:var(--fxSoft);border:0;border-radius:999px;padding:7px 12px;text-decoration:none;cursor:pointer;min-height:34px;display:inline-flex;align-items:center}
.fxbar button:focus-visible,.fxbar a:focus-visible{outline:2px solid var(--fx);outline-offset:1px}
.note{font-size:.74rem;color:var(--muted);margin-top:12px;padding:14px 16px;border-radius:14px;background:var(--card);border:1px solid var(--border);max-width:110ch}
.note p{margin:0 0 7px}.note p:last-child{margin:0}
.note b{color:var(--text)}
</style>
<style id="embed-css">
/* Mode int\xE9gr\xE9 dans CoteSport : pas de cadre, fond transparent, hauteur g\xE9r\xE9e par l'application h\xF4te */
html.embed{background:transparent}
html.embed body{background:transparent}
html.embed .topbar{display:none}
html.embed .wrap{max-width:none;padding:4px 0 28px}
html.embed .output{position:static!important;max-height:none!important;overflow:visible!important}
html.embed h1{font-size:1.15rem}
</style>
<script>
(function(){
  if(window.parent===window)return;
  var de=document.documentElement;de.classList.add('embed');
  var name=location.pathname.replace(/\\W/g,'')||'calc',last=0;
  function post(){var h=Math.ceil(de.getBoundingClientRect().height);if(Math.abs(h-last)>1){last=h;parent.postMessage({cotesportCalcHeight:h,name:name},location.origin);}}
  window.addEventListener('load',post);window.addEventListener('resize',post);
  if(window.ResizeObserver)new ResizeObserver(post).observe(de);else setInterval(post,500);
})();
</script>

<div class="topbar" id="topbar"></div>
<div class="wrap">
<h1>Achat en <span class="c1">Suisse</span> ou import d'<span class="c2">Allemagne</span> ?</h1>
<p class="sub">Co\xFBt d'achat net des deux options en CHF, v\xE9hicule immatricul\xE9 en Suisse : prix, taxes d'importation, change et frais de rapatriement. Les valeurs de d\xE9part sont un exemple : remplacez-les par vos deux offres.</p>

<div class="layout">
<div class="inputs">

<details open class="t-veh"><summary><span class="ic">\u{1F697}</span><span class="t">V\xE9hicule & canton</span></summary><div class="dbody">
<div class="grid">
<div><label for="canton">Canton d'immatriculation</label><select id="canton"></select></div>
<div><label for="etat">\xC9tat du v\xE9hicule</label><select id="etat">
<option value="neuf">Neuf / r\xE9cent (&lt; 6 mois ou &lt; 5'000 km)</option>
<option value="occ">Occasion (&gt; 6 mois et &gt; 5'000 km)</option></select></div>
</div>
<p class="hint" id="cantonHint"></p>
</div></details>

<details open class="t-ch"><summary><span class="ic">CH</span><span class="t">Offre suisse, en CHF</span></summary><div class="dbody">
<div class="grid">
<div><label for="prixCH">Prix catalogue TTC (CHF)</label><input type="number" id="prixCH" value="45000" step="500"></div>
<div><label for="remiseCH">Remise concession (%)</label><input type="number" id="remiseCH" value="5" step="0.5"></div>
<div><label for="livrCH">Frais de livraison / pr\xE9paration (CHF)</label><input type="number" id="livrCH" value="0" step="50"></div>
<div><label for="bonusCH">Primes CH d\xE9duites du prix (cash, flotte) (CHF)</label><input type="number" id="bonusCH" value="0" step="100"></div>
</div>
<p class="hint">Prix TTC : la TVA suisse de 8,1 % est d\xE9j\xE0 incluse et reste \xE0 votre charge.</p>
</div></details>

<details open class="t-de"><summary><span class="ic">DE</span><span class="t">Offre allemande, en EUR</span></summary><div class="dbody">
<div class="grid">
<div><label for="prixDE">Prix affich\xE9 TTC (EUR)</label><input type="number" id="prixDE" value="42000" step="500"></div>
<div><label for="remiseDE">Remise (%)</label><input type="number" id="remiseDE" value="8" step="0.5"></div>
<div><label for="vendeur">Type de vendeur</label><select id="vendeur">
<option value="normal">Concession, TVA 19 % r\xE9cup\xE9rable \xE0 l'export</option>
<option value="marge">Concession, r\xE9gime de marge (\xA725a)</option>
<option value="prive">Particulier</option></select></div>
<div><label for="tvaDE">TVA allemande (%)</label><input type="number" id="tvaDE" value="19" step="1"></div>
<div><label for="ueberf">\xDCberf\xFChrung / frais de mise \xE0 disposition TTC (EUR)</label><input type="number" id="ueberf" value="990" step="50"></div>
<div><label for="exportFee">Frais d'export factur\xE9s par le vendeur (EUR)</label><input type="number" id="exportFee" value="150" step="50"></div>
</div>
<div id="fAvance">
<div class="checkrow"><input type="checkbox" id="avance"><label for="avance">Je paie TTC et la TVA allemande m'est rembours\xE9e apr\xE8s preuve d'export (sinon : facture directement hors TVA)</label></div>
<div class="grid" id="fDelai" style="margin-top:8px">
<div><label for="delai">D\xE9lai de remboursement (mois)</label><input type="number" id="delai" value="2" step="1"></div>
<div><label for="placement">Rendement perdu sur l'avance (%/an)</label><input type="number" id="placement" value="2" step="0.25"></div>
</div>
</div>
<p class="hint" id="vendeurHint"></p>
</div></details>

<details open class="t-fx"><summary><span class="ic">\u20AC\u2192</span><span class="t">Change EUR \u2192 CHF</span></summary><div class="dbody">
<div class="grid">
<div><label for="taux">Taux EUR/CHF (march\xE9)</label><input type="number" id="taux" value="0.9459" step="0.005"></div>
<div><label for="margeFx">Marge de change de votre banque (%)</label><input type="number" id="margeFx" value="1.5" step="0.1"></div>
<div><label for="virement">Frais de virement (CHF)</label><input type="number" id="virement" value="15" step="5"></div>
</div>
<div class="fxbar"><span id="fxRef"></span><button type="button" id="fxReset">\u21BA Taux de r\xE9f\xE9rence</button><a id="fxLink" href="https://www.xe.com/fr/currencyconverter/convert/?Amount=1&amp;From=EUR&amp;To=CHF" target="_blank" rel="noopener">Taux en direct \u2197</a></div>
<p class="hint"> Une banque classique prend souvent 1 \xE0 2,5 % de marge, un service de change en ligne 0,2 \xE0 0,6 %. La douane calcule les taxes au taux officiel du jour, proche du taux du march\xE9.</p>
</div></details>

<details class="t-tr"><summary><span class="ic">KM</span><span class="t">Transport & d\xE9placement</span></summary><div class="dbody">
<div class="grid">
<div><label for="mode">Rapatriement</label><select id="mode">
<option value="conduite">Je le ram\xE8ne moi-m\xEAme (plaques export)</option>
<option value="camion">Transporteur</option></select></div>
<div id="fPlaques"><label for="plaques">Plaques export + assurance (EUR)</label><input type="number" id="plaques" value="180" step="10"></div>
<div id="fCamion"><label for="camion">Prix du transporteur (EUR)</label><input type="number" id="camion" value="650" step="50"></div>
<div><label for="distCH">Distance domicile \u2192 fronti\xE8re DE (km)</label><input type="number" id="distCH" value="40" step="10"></div>
<div><label for="distDE">Distance fronti\xE8re \u2192 vendeur (km)</label><input type="number" id="distDE" value="150" step="10"></div>
<div><label for="kmAller">Co\xFBt aller sans le v\xE9hicule (CHF/km)</label><input type="number" id="kmAller" value="0.30" step="0.05"></div>
<div id="fRetour"><label for="kmRetour">Carburant/\xE9nergie au retour (CHF/km)</label><input type="number" id="kmRetour" value="0.12" step="0.01"></div>
<div><label for="hotel">H\xF4tel, repas, divers (CHF)</label><input type="number" id="hotel" value="0" step="50"></div>
<div><label for="heures">Temps pass\xE9 (heures)</label><input type="number" id="heures" value="10" step="1"></div>
<div><label for="tarifH">Valeur de votre temps (CHF/h)</label><input type="number" id="tarifH" value="0" step="10"></div>
</div>
<p class="hint" id="modeHint"></p>
</div></details>

<details open class="t-dz"><summary><span class="ic">%</span><span class="t">Douane & homologation</span></summary><div class="dbody">
<div class="grid">
<div><label>Imp\xF4t sur les automobiles</label><input type="number" value="4" disabled></div>
<div><label>TVA suisse \xE0 l'importation (%)</label><input type="number" value="8.1" disabled></div>
<div><label for="emol">\xC9moluments douane / rapport 13.20A (CHF)</label><input type="number" id="emol" value="20" step="5"></div>
<div><label for="transitaire">Transitaire / d\xE9clarant (CHF)</label><input type="number" id="transitaire" value="0" step="25"></div>
<div id="fCo2"><label for="co2">Sanction CO\u2082 (CHF)</label><input type="number" id="co2" value="0" step="100"></div>
<div><label for="mfk">Expertise d'importation au service des autos (CHF)</label><input type="number" id="mfk" value="120" step="10"></div>
<div><label for="emiss">Test antipollution / adaptations (CHF)</label><input type="number" id="emiss" value="0" step="50"></div>
</div>
<div class="checkrow"><input type="checkbox" id="coc" checked><label for="coc">Le v\xE9hicule a un certificat de conformit\xE9 europ\xE9en (COC) complet</label></div>
<div class="grid" id="fHomolog" style="margin-top:8px">
<div><label for="homolog">Homologation individuelle (CHF)</label><input type="number" id="homolog" value="1500" step="100"></div>
</div>
<p class="hint">Droits de douane : CHF 0 depuis le 1er janvier 2024 (suppression des droits sur les produits industriels). L'imp\xF4t de 4 % s'applique aussi aux voitures \xE9lectriques depuis 2024. <span id="co2Hint"></span></p>
</div></details>

<details class="t-veh"><summary><span class="ic">+</span><span class="t">Avantages non mon\xE9taires (optionnel)</span></summary><div class="dbody">
<div class="grid">
<div><label for="servCH">Entretien gratuit inclus en Suisse (CHF)</label><input type="number" id="servCH" value="0" step="100"></div>
<div><label for="equipCH">\xC9quipements en plus sur la version CH (CHF)</label><input type="number" id="equipCH" value="0" step="100"></div>
</div>
<div class="checkrow"><input type="checkbox" id="garOk" checked><label for="garOk">La garantie constructeur est honor\xE9e par le r\xE9seau suisse</label></div>
<div class="grid" id="fGar" style="margin-top:8px">
<div><label for="garCost">Co\xFBt d'une extension de garantie (CHF)</label><input type="number" id="garCost" value="1200" step="100"></div>
</div>
<p class="hint">Laissez \xE0 0 pour comparer uniquement les prix. Certains importateurs suisses incluent l'entretien gratuit sur plusieurs ann\xE9es ou vendent des \xAB Swiss Edition \xBB mieux \xE9quip\xE9es, avantages qu'un import direct n'a pas.</p>
</div></details>

</div>

<div class="output">
<div class="verdict">
<div class="big" id="verdict"></div>
<div class="sub2" id="verdictSub"></div>
<div id="bars"></div>
<div class="kpis">
<div class="kpi"><div class="l">Taux EUR/CHF d'\xE9quilibre</div><div class="a" id="beRate"></div></div>
<div class="kpi"><div class="l">Prix allemand d'\xE9quilibre</div><div class="a" id="bePrice"></div></div>
</div>
</div>

<div class="card chart"><h2>\xC9conomie selon le taux de change</h2><div class="cb"><div id="chart"></div><p class="hint" style="margin-top:4px">Au-dessus de la ligne z\xE9ro, l'import est plus avantageux. Le point marque le taux saisi.</p></div></div>

<div class="card c-ch"><h2><span class="dot" style="background:var(--ch)"></span>Achat en Suisse</h2><div class="cb" id="chBreak"></div></div>
<div class="card c-de"><h2><span class="dot" style="background:var(--de)"></span>Import depuis l'Allemagne</h2><div class="cb" id="deBreak"></div></div>
</div>
</div>

<div class="note">
<p><b>Ce que le canton change, et ce qu'il ne change pas.</b> L'imp\xF4t sur les automobiles (4 %) et la TVA \xE0 l'importation (8,1 %) sont f\xE9d\xE9raux, identiques partout. L'imp\xF4t cantonal annuel sur les v\xE9hicules et les frais de plaques sont les m\xEAmes quelle que soit l'origine de la voiture, ils n'entrent donc pas dans la comparaison. Le canton joue sur la distance jusqu'\xE0 l'Allemagne (pr\xE9remplie selon le chef-lieu) et sur le tarif de l'expertise d'importation, que vous devez v\xE9rifier aupr\xE8s de votre service des automobiles.</p>
<p><b>Base des taxes.</b> Imp\xF4t auto = 4 % du prix pay\xE9 hors TVA \xE9trang\xE8re, frais annexes et transport jusqu'\xE0 destination compris. TVA suisse = 8,1 % de cette valeur + l'imp\xF4t auto + les \xE9moluments. Un vendeur particulier ou en r\xE9gime de marge ne peut pas rembourser de TVA allemande : vous payez alors la TVA deux fois en partie, ce qui rend l'import rarement int\xE9ressant.</p>
<p><b>O\xF9 va la TVA.</b> Un achat en Suisse inclut 8,1 % de TVA suisse, qui reste \xE0 votre charge. \xC0 l'import, c'est la TVA allemande (19 %) qui vous est rembours\xE9e par le vendeur, et vous payez \xE0 la place la TVA suisse de 8,1 % \xE0 la douane.</p>
<p><b>Sanction CO\u2082.</b> Due sur les voitures neuves (ou de moins de 6 mois / 5'000 km) dont les \xE9missions d\xE9passent la valeur cible. Pour un v\xE9hicule achet\xE9 en Suisse, l'importateur officiel l'a d\xE9j\xE0 int\xE9gr\xE9e au prix. Calculez-la avec le calculateur de l'Office f\xE9d\xE9ral de l'\xE9nergie avant d'acheter un mod\xE8le thermique puissant.</p>
<p>Mod\xE8le indicatif, bas\xE9 sur les r\xE8gles de l'OFDF en vigueur en 2026. V\xE9rifiez les montants exacts avant toute d\xE9cision.</p>
</div>
</div>

<script>
const $=id=>document.getElementById(id);
const FX_REF={rate:0.9459,date:'30.09.2026'};
const fmt=n=>new Intl.NumberFormat('fr-CH',{maximumFractionDigits:0}).format(Math.round(n))+' CHF';
const fmtE=n=>new Intl.NumberFormat('fr-CH',{maximumFractionDigits:0}).format(Math.round(n))+' EUR';

// [code, nom, distance approx. du chef-lieu \xE0 la fronti\xE8re allemande la plus proche, km]
const CANTONS=[
['AG','Argovie',45],['AI','Appenzell Rh.-Int.',60],['AR','Appenzell Rh.-Ext.',50],['BE','Berne',100],
['BL','B\xE2le-Campagne',20],['BS','B\xE2le-Ville',5],['FR','Fribourg',135],['GE','Gen\xE8ve',255],
['GL','Glaris',105],['GR','Grisons',150],['JU','Jura',55],['LU','Lucerne',95],
['NE','Neuch\xE2tel',145],['NW','Nidwald',110],['OW','Obwald',115],['SG','Saint-Gall',40],
['SH','Schaffhouse',5],['SO','Soleure',70],['SZ','Schwyz',90],['TG','Thurgovie',25],
['TI','Tessin',230],['UR','Uri',125],['VD','Vaud',200],['VS','Valais',235],
['ZG','Zoug',75],['ZH','Zurich',40]];
const selC=$('canton');
CANTONS.forEach(c=>{const o=document.createElement('option');o.value=c[0];o.textContent=c[1]+' ('+c[0]+')';selC.appendChild(o)});
selC.value='ZH';
selC.addEventListener('change',()=>{const c=CANTONS.find(x=>x[0]===selC.value);$('distCH').value=c[2];calc();});

const NUM=['prixCH','remiseCH','livrCH','servCH','bonusCH','equipCH','prixDE','remiseDE','tvaDE','ueberf','exportFee','delai','taux','margeFx','virement','plaques','camion','distCH','distDE','kmAller','kmRetour','hotel','heures','tarifH','emol','transitaire','co2','mfk','emiss','homolog','garCost','placement'];
function read(){
  const p={};NUM.forEach(k=>p[k]=+$(k).value||0);
  ['etat','vendeur','mode'].forEach(k=>p[k]=$(k).value);
  ['avance','coc','garOk'].forEach(k=>p[k]=$(k).checked);
  return p;
}

function model(p){
  // --- Suisse
  const chTTC=p.prixCH*(1-p.remiseCH/100)+p.livrCH;
  const coutCH=chTTC-p.bonusCH-p.servCH-p.equipCH;

  // --- Allemagne
  const deTTC=p.prixDE*(1-p.remiseDE/100);
  const recup=p.vendeur==='normal';
  const k=1+p.tvaDE/100;
  const deNet=recup?deTTC/k:deTTC;
  const ueNet=recup?p.ueberf/k:p.ueberf;
  const tvaDEeur=(deTTC-deNet)+(p.ueberf-ueNet);
  const transpEUR=p.mode==='conduite'?p.plaques:p.camion;
  const eurPaid=deNet+ueNet+p.exportFee+transpEUR;
  const fxEff=p.taux*(1+p.margeFx/100);
  const chfPaid=eurPaid*fxEff+p.virement;
  const fraisChange=eurPaid*p.taux*(p.margeFx/100)+p.virement;

  let avanceCost=0, avanceFx=0;
  if(recup&&p.avance){
    avanceFx=tvaDEeur*p.taux*(p.margeFx/100)*2;      // conversion aller + retour
    avanceCost=tvaDEeur*fxEff*(p.placement/100)*(p.delai/12);
  }

  const valDouane=(deNet+ueNet+p.exportFee+transpEUR)*p.taux;
  const impotAuto=valDouane*0.04;
  const baseTVA=valDouane+impotAuto+p.emol;
  const tvaCH=baseTVA*0.081;
  const co2=p.etat==='neuf'?p.co2:0;
  const homolog=p.coc?0:p.homolog;
  const km=p.distCH+p.distDE;
  const deplacement=p.mode==='conduite'?km*p.kmAller+km*p.kmRetour+p.hotel:km*p.kmAller*2+p.hotel;
  const temps=p.heures*p.tarifH;
  const garantie=p.garOk?0:p.garCost;

  const coutDE=chfPaid+avanceFx+avanceCost+impotAuto+tvaCH+p.emol+p.transitaire+co2+p.mfk+p.emiss+homolog+deplacement+temps+garantie;
  return {chTTC,coutCH,deTTC,recup,deNet,ueNet,tvaDEeur,transpEUR,eurPaid,chfPaid,fraisChange,avanceCost,avanceFx,valDouane,impotAuto,baseTVA,tvaCH,co2,homolog,deplacement,temps,garantie,coutDE,km};
}

function solve(p,key,lo,hi){
  const f=v=>{const q={...p,[key]:v};const m=model(q);return m.coutDE-m.coutCH;};
  let a=lo,b=hi,fa=f(a),fb=f(b);
  if(fa*fb>0) return null;
  for(let i=0;i<60;i++){const m=(a+b)/2,fm=f(m);if(fa*fm<=0){b=m;fb=fm}else{a=m;fa=fm}}
  return (a+b)/2;
}

function row(l,v,cls){return \`<div class="row \${cls||''}"><span>\${l}</span><span>\${v}</span></div>\`}
function sh(t){return \`<div class="subhead">\${t}</div>\`}

function chart(p,m){
  const W=460,H=190,L=48,R=12,T=12,B=28;
  const r0=0.85,r1=1.05,steps=40;
  const pts=[];for(let i=0;i<=steps;i++){const r=r0+(r1-r0)*i/steps;const mm=model({...p,taux:r});pts.push([r,mm.coutCH-mm.coutDE]);}
  let ymin=Math.min(0,...pts.map(x=>x[1])),ymax=Math.max(0,...pts.map(x=>x[1]));
  const pad=(ymax-ymin)*0.1||1000;ymin-=pad;ymax+=pad;
  const X=r=>L+(r-r0)/(r1-r0)*(W-L-R), Y=v=>T+(ymax-v)/(ymax-ymin)*(H-T-B);
  const step=niceStep((ymax-ymin)/4);
  let g='';
  for(let v=Math.ceil(ymin/step)*step;v<=ymax;v+=step){g+=\`<line x1="\${L}" x2="\${W-R}" y1="\${Y(v)}" y2="\${Y(v)}" stroke="var(--border)" stroke-width="1"/><text x="\${L-6}" y="\${Y(v)+3}" text-anchor="end" font-size="10" fill="var(--muted)">\${Math.round(v/1000)}k</text>\`;}
  for(let r=0.85;r<=1.0501;r+=0.05){g+=\`<text x="\${X(r)}" y="\${H-8}" text-anchor="middle" font-size="10" fill="var(--muted)">\${r.toFixed(2)}</text>\`;}
  const d=pts.map((q,i)=>(i?'L':'M')+X(q[0]).toFixed(1)+' '+Y(q[1]).toFixed(1)).join(' ');
  const cur=m.coutCH-m.coutDE;const cx=Math.min(Math.max(p.taux,r0),r1);
  const onChart=p.taux>=r0&&p.taux<=r1;
  $('chart').innerHTML=\`<svg viewBox="0 0 \${W} \${H}" role="img" aria-label="\xC9conomie de l'import selon le taux EUR/CHF">\${g}
  <line x1="\${L}" x2="\${W-R}" y1="\${Y(0)}" y2="\${Y(0)}" stroke="var(--muted)" stroke-width="1.2"/>
  <path d="\${d}" fill="none" stroke="var(--de)" stroke-width="2.5" stroke-linecap="round"/>
  \${onChart?\`<circle cx="\${X(cx)}" cy="\${Y(cur)}" r="5" fill="var(--de)" stroke="var(--card)" stroke-width="2"/>\`:''}
  </svg>\`;
}
function niceStep(x){const e=Math.pow(10,Math.floor(Math.log10(x)));const f=x/e;return (f<1.5?1:f<3.5?2:f<7.5?5:10)*e;}

function calc(){
  const p=read();
  $('fDelai').hidden=!p.avance;
  $('fAvance').hidden=p.vendeur!=='normal';
  $('fPlaques').hidden=p.mode!=='conduite';
  $('fRetour').hidden=p.mode!=='conduite';
  $('fCamion').hidden=p.mode!=='camion';
  $('fHomolog').hidden=p.coc;
  $('fGar').hidden=p.garOk;
  $('fCo2').hidden=p.etat!=='neuf';
  $('co2Hint').textContent=p.etat==='neuf'?"Sanction CO\u2082 : \xE0 calculer pour votre mod\xE8le sur le calculateur de l'OFEN, elle peut d\xE9passer plusieurs milliers de francs.":"Occasion de plus de 6 mois et 5'000 km : pas de sanction CO\u2082.";
  $('vendeurHint').textContent=p.vendeur==='normal'
    ?"Le vendeur vous facture hors TVA allemande contre preuve d'export (cachet de la douane sur le document d'export). Certains exigent une caution \xE9gale \xE0 la TVA, rembours\xE9e ensuite."
    :"Aucune TVA allemande r\xE9cup\xE9rable : le prix pay\xE9 entre en entier dans la base des taxes suisses.";
  $('modeHint').textContent=p.mode==='conduite'
    ?"Aller en train ou covoiturage, retour au volant. Passez par un poste de douane ouvert au d\xE9douanement commercial pendant ses heures d'ouverture."
    :"Le transporteur d\xE9douane souvent pour vous (frais de transitaire en plus). Un seul aller-retour est compt\xE9 pour signer ou voir le v\xE9hicule.";
  const c=CANTONS.find(x=>x[0]===p.canton||x[0]===selC.value);
  $('cantonHint').textContent=\`\${c[1]} : environ \${c[2]} km jusqu'\xE0 la fronti\xE8re allemande depuis le chef-lieu (modifiable dans Transport). Taxes d'importation f\xE9d\xE9rales, identiques dans tous les cantons.\`;

  const m=model(p);
  const diff=m.coutCH-m.coutDE; // >0 : import gagnant
  const pct=diff/m.coutCH*100;
  const win=diff>0?'de':'ch';
  $('verdict').innerHTML= Math.abs(diff)<200
    ?'Pratiquement \xE9quivalent'
    :(win==='de'?\`L'import d'Allemagne fait \xE9conomiser <span class="amt">\${fmt(diff)}</span>\`:\`Acheter en Suisse fait \xE9conomiser <span class="amt">\${fmt(-diff)}</span>\`);
  $('verdictSub').textContent=\`Co\xFBt d'achat net, v\xE9hicule immatricul\xE9, TVA suisse comprise. \xC9cart : \${Math.abs(pct).toFixed(1)} %.\`;
  document.body.dataset.win=Math.abs(diff)<200?'eq':win;
  $('topbar').innerHTML=\`<span class="tb-ch">Suisse <b>\${fmt(m.coutCH)}</b></span><span class="tb-de">Import <b>\${fmt(m.coutDE)}</b></span>\`+(Math.abs(diff)<200?'':\`<span class="tb-win">\${diff>0?'Import':'Suisse'} \u2212\${fmt(Math.abs(diff))}</span>\`);
  const mx=Math.max(m.coutCH,m.coutDE,1);
  $('bars').innerHTML=[['Suisse',m.coutCH,'--ch'],['Import DE',m.coutDE,'--de']].map(b=>\`<div class="bar-row"><span class="n">\${b[0]}</span><div class="bar-track"><div class="bar-fill" style="width:\${Math.max(b[1],0)/mx*100}%;background:var(\${b[2]})"></div></div><span class="v">\${fmt(b[1])}</span></div>\`).join('');

  const be=solve(p,'taux',0.3,2);
  $('beRate').textContent=be?be.toFixed(4):'\u2014';
  const bp=solve(p,'prixDE',0,Math.max(p.prixDE*4,100000));
  $('bePrice').textContent=bp?fmtE(bp)+' TTC':'\u2014';
  $('beRate').title=be?(win==='de'?"L'import reste gagnant tant que l'euro vaut moins que ce taux.":"L'import deviendrait gagnant si l'euro tombait sous ce taux."):'';

  let h='';
  h+=row('Prix TTC apr\xE8s remise'+(p.livrCH?' + livraison':''),fmt(m.chTTC));
  h+=row('dont TVA suisse 8,1 % (pay\xE9e)',fmt(m.chTTC-m.chTTC/1.081),'mute');
  if(p.bonusCH) h+=row('Primes suisses','\u2212'+fmt(p.bonusCH),'neg');
  if(p.servCH) h+=row('Entretien gratuit inclus','\u2212'+fmt(p.servCH),'neg');
  if(p.equipCH) h+=row('\xC9quipements en plus','\u2212'+fmt(p.equipCH),'neg');
  h+=row('Co\xFBt d\\'achat net',fmt(m.coutCH),'total');
  $('chBreak').innerHTML=h;

  h='';
  h+=sh('Achat en Allemagne');
  h+=row('Prix TTC apr\xE8s remise',fmtE(m.deTTC),'mute');
  if(m.recup) h+=row(\`TVA allemande \${p.tvaDE} % rembours\xE9e \xE0 l'export\`,'\u2212'+fmtE(m.tvaDEeur),'neg');
  h+=row('Prix + frais vendeur + '+(p.mode==='conduite'?'plaques export':'transport'),fmtE(m.eurPaid));
  h+=row(\`Converti \xE0 \${(p.taux*(1+p.margeFx/100)).toFixed(4)} + virement\`,fmt(m.chfPaid));
  h+=row('dont frais de change',fmt(m.fraisChange),'mute');
  if(m.avanceFx||m.avanceCost) h+=row('TVA avanc\xE9e : change aller-retour + capital immobilis\xE9',fmt(m.avanceFx+m.avanceCost));
  h+=sh('Douane suisse');
  h+=row(\`Valeur d\xE9clar\xE9e (au taux \${p.taux.toFixed(4)})\`,fmt(m.valDouane),'mute');
  h+=row('Imp\xF4t sur les automobiles 4 %',fmt(m.impotAuto));
  h+=row(\`TVA 8,1 % sur \${fmt(m.baseTVA)}\`,fmt(m.tvaCH));
  h+=row('\xC9moluments'+(p.transitaire?' + transitaire':''),fmt(p.emol+p.transitaire));
  if(m.co2) h+=row('Sanction CO\u2082',fmt(m.co2));
  h+=sh('Homologation & logistique');
  h+=row('Expertise d\\'importation'+(p.emiss?' + tests':''),fmt(p.mfk+p.emiss));
  if(m.homolog) h+=row('Homologation individuelle (pas de COC)',fmt(m.homolog));
  h+=row(\`D\xE9placement (\${m.km} km par trajet)\`,fmt(m.deplacement));
  if(m.temps) h+=row(\`Temps (\${p.heures} h)\`,fmt(m.temps));
  if(m.garantie) h+=row('Extension de garantie',fmt(m.garantie));
  h+=row('Co\xFBt d\\'achat net',fmt(m.coutDE),'total');
  $('deBreak').innerHTML=h;

  chart(p,m);
}
document.querySelectorAll('input,select').forEach(e=>e.addEventListener('input',calc));
$('fxRef').textContent=\`Taux de r\xE9f\xE9rence du \${FX_REF.date} : \${FX_REF.rate.toFixed(4)}\`;
$('fxReset').addEventListener('click',()=>{$('taux').value=FX_REF.rate;calc();});
calc();
</script>
<script>
// Pr\xE9remplissage depuis l'appli : leasing.html#prix=45000&dC=36 \u2026 (ids des champs ; cases \xE0 cocher : 1/0)
(function(){
  function apply(){
    var h=new URLSearchParams(location.hash.slice(1)),any=false;
    h.forEach(function(v,k){var el=document.getElementById(k);if(!el)return;any=true;if(el.type==='checkbox')el.checked=(v==='1'||v==='true');else el.value=v;});
    if(any){document.querySelectorAll('input,select').forEach(function(e){e.dispatchEvent(new Event('input',{bubbles:true}));});}
  }
  window.addEventListener('hashchange',apply);apply();
})();
</script>

</html>
`}};var Ks=Symbol.for("neon.websocket.bridge");function Mr(e){return typeof e=="object"&&e!==null&&"then"in e&&typeof e.then=="function"}function mt(e){if(!Mr(e))throw new TypeError(`waitUntil can only be called with a Promise, got ${typeof e}`);globalThis.NEON_REQUEST_CONTEXT?.waitUntil?.(e)}import Zr from"os";import es from"fs";var ft=new Map,Ut=new Map,It=Symbol("OriginError"),Be={},me=class extends Promise{constructor(t,n,a,s,r={}){let i,o;super((c,m)=>{i=c,o=m}),this.tagged=Array.isArray(t.raw),this.strings=t,this.args=n,this.handler=a,this.canceller=s,this.options=r,this.state=null,this.statement=null,this.resolve=c=>(this.active=!1,i(c)),this.reject=c=>(this.active=!1,o(c)),this.active=!1,this.cancelled=null,this.executed=!1,this.signature="",this[It]=this.handler.debug?new Error:this.tagged&&Rr(this.strings)}get origin(){return(this.handler.debug?this[It].stack:this.tagged&&Ut.has(this.strings)?Ut.get(this.strings):Ut.set(this.strings,this[It].stack).get(this.strings))||""}static get[Symbol.species](){return Promise}cancel(){return this.canceller&&(this.canceller(this),this.canceller=null)}simple(){return this.options.simple=!0,this.options.prepare=!1,this}async readable(){return this.simple(),this.streaming=!0,this}async writable(){return this.simple(),this.streaming=!0,this}cursor(t=1,n){if(this.options.simple=!1,typeof t=="function"&&(n=t,t=1),this.cursorRows=t,typeof n=="function")return this.cursorFn=n,this;let a;return{[Symbol.asyncIterator]:()=>({next:()=>{if(this.executed&&!this.active)return{done:!0};a&&a();let s=new Promise((r,i)=>{this.cursorFn=o=>(r({value:o,done:!1}),new Promise(c=>a=c)),this.resolve=()=>(this.active=!1,r({done:!0})),this.reject=o=>(this.active=!1,i(o))});return this.execute(),s},return(){return a&&a(Be),{done:!0}}})}}describe(){return this.options.simple=!1,this.onlyDescribe=this.options.prepare=!0,this}stream(){throw new Error(".stream has been renamed to .forEach")}forEach(t){return this.forEachFn=t,this.handle(),this}raw(){return this.isRaw=!0,this}values(){return this.isRaw="values",this}async handle(){!this.executed&&(this.executed=!0)&&await 1&&this.handler(this)}execute(){return this.handle(),this}then(){return this.handle(),super.then.apply(this,arguments)}catch(){return this.handle(),super.catch.apply(this,arguments)}finally(){return this.handle(),super.finally.apply(this,arguments)}};function Rr(e){if(ft.has(e))return ft.get(e);let t=Error.stackTraceLimit;return Error.stackTraceLimit=4,ft.set(e,new Error),Error.stackTraceLimit=t,ft.get(e)}var Le=class extends Error{constructor(t){super(t.message),this.name=this.constructor.name,Object.assign(this,t)}},Z={connection:jn,postgres:Bn,generic:Gn,notSupported:Wn};function jn(e,t,n){let{host:a,port:s}=n||t,r=Object.assign(new Error("write "+e+" "+(t.path||a+":"+s)),{code:e,errno:e,address:t.path||a},t.path?{}:{port:s});return Error.captureStackTrace(r,jn),r}function Bn(e){let t=new Le(e);return Error.captureStackTrace(t,Bn),t}function Gn(e,t){let n=Object.assign(new Error(e+": "+t),{code:e});return Error.captureStackTrace(n,Gn),n}function Wn(e){let t=Object.assign(new Error(e+" (B) is not supported"),{code:"MESSAGE_NOT_SUPPORTED",name:e});return Error.captureStackTrace(t,Wn),t}var Ar={string:{to:25,from:null,serialize:e=>""+e},number:{to:0,from:[21,23,26,700,701],serialize:e=>""+e,parse:e=>+e},json:{to:114,from:[114,3802],serialize:e=>JSON.stringify(e),parse:e=>JSON.parse(e)},boolean:{to:16,from:16,serialize:e=>e===!0?"t":"f",parse:e=>e==="t"},date:{to:1184,from:[1082,1114,1184],serialize:e=>(e instanceof Date?e:new Date(e)).toISOString(),parse:e=>new Date(e)},bytea:{to:17,from:17,serialize:e=>"\\x"+Buffer.from(e).toString("hex"),parse:e=>Buffer.from(e.slice(2),"hex")}},tt=class{then(){jt()}catch(){jt()}finally(){jt()}},Ge=class extends tt{constructor(t){super(),this.value=vt(t)}},be=class extends tt{constructor(t,n,a){super(),this.value=t,this.type=n,this.array=a}},nt=class extends tt{constructor(t,n){super(),this.first=t,this.rest=n}build(t,n,a,s){let r=Lr.map(([i,o])=>({fn:o,i:t.search(i)})).sort((i,o)=>i.i-o.i).pop();return r.i===-1?Vt(this.first,s):r.fn(this.first,this.rest,n,a,s)}};function bt(e,t,n,a){let s=e instanceof be?e.value:e;if(s===void 0&&(e instanceof be?e.value=a.transform.undefined:s=e=a.transform.undefined,s===void 0))throw Z.generic("UNDEFINED_VALUE","Undefined values are not allowed");return"$"+n.push(e instanceof be?(t.push(e.value),e.array?e.array[e.type||ht(e.value)]||e.type||Kn(e.value):e.type):(t.push(e),ht(e)))}var Vn=Jn(Ar);function Wt(e,t,n,a,s,r){for(let i=1;i<e.strings.length;i++)t+=qt(t,n,a,s,r)+e.strings[i],n=e.args[i];return t}function qt(e,t,n,a,s){return t instanceof nt?t.build(e,n,a,s):t instanceof me?Gt(t,n,a,s):t instanceof Ge?t.value:t&&t[0]instanceof me?t.reduce((r,i)=>r+" "+Gt(i,n,a,s),""):bt(t,n,a,s)}function Gt(e,t,n,a){return e.fragment=!0,Wt(e,e.strings[0],e.args[0],t,n,a)}function Yn(e,t,n,a,s){return e.map(r=>"("+a.map(i=>qt("values",r[i],t,n,s)).join(",")+")").join(",")}function qn(e,t,n,a,s){let r=Array.isArray(e[0]),i=t.length?t.flat():Object.keys(r?e[0]:e);return Yn(r?e:[e],n,a,i,s)}function gt(e,t,n,a,s){if(typeof e=="string"&&(e=[e].concat(t)),Array.isArray(e))return Vt(e,s);let r;return(t.length?t.flat():Object.keys(e)).map(o=>(r=e[o],(r instanceof me?Gt(r,n,a,s):r instanceof Ge?r.value:bt(r,n,a,s))+" as "+vt(s.transform.column.to?s.transform.column.to(o):o))).join(",")}var Lr=Object.entries({values:qn,in:(...e)=>{let t=qn(...e);return t==="()"?"(null)":t},select:gt,as:gt,returning:gt,"\\(":gt,update(e,t,n,a,s){return(t.length?t.flat():Object.keys(e)).map(r=>vt(s.transform.column.to?s.transform.column.to(r):r)+"="+qt("values",e[r],n,a,s))},insert(e,t,n,a,s){let r=t.length?t.flat():Object.keys(Array.isArray(e)?e[0]:e);return"("+Vt(r,s)+")values"+Yn(Array.isArray(e)?e:[e],n,a,r,s)}}).map(([e,t])=>[new RegExp("((?:^|[\\s(])"+e+"(?:$|[\\s(]))(?![\\s\\S]*\\1)","i"),t]);function jt(){throw Z.generic("NOT_TAGGED_CALL","Query not called as a tagged template literal")}var Or=Vn.serializers,Nr=Vn.parsers;function Kn(e){return Array.isArray(e)?Kn(e[0]):typeof e=="string"?1009:0}var Xn=function(e){let t=Jn(e||{});return{serializers:Object.assign({},Or,t.serializers),parsers:Object.assign({},Nr,t.parsers)}};function Jn(e){return Object.keys(e).reduce((t,n)=>(e[n].from&&[].concat(e[n].from).forEach(a=>t.parsers[a]=e[n].parse),e[n].serialize&&(t.serializers[e[n].to]=e[n].serialize,e[n].from&&[].concat(e[n].from).forEach(a=>t.serializers[a]=e[n].serialize)),t),{parsers:{},serializers:{}})}function Vt(e,{transform:{column:t}}){return e.map(n=>vt(t.to?t.to(n):n)).join(",")}var vt=function(t){return'"'+t.replace(/"/g,'""').replace(/\./g,'"."')+'"'},ht=function e(t){return t instanceof be?t.type:t instanceof Date?1184:t instanceof Uint8Array?17:t===!0||t===!1?16:typeof t=="bigint"?20:Array.isArray(t)?e(t[0]):0},Pr=/\\/g,Dr=/"/g;function Fr(e){return e.replace(Pr,"\\\\").replace(Dr,'\\"')}var Qn=function e(t,n,a,s){if(Array.isArray(t)===!1)return t;if(!t.length)return"{}";let r=t[0],i=s===1020?";":",";return Array.isArray(r)&&!r.type?"{"+t.map(o=>e(o,n,a,s)).join(i)+"}":"{"+t.map(o=>{if(o===void 0&&(o=a.transform.undefined,o===void 0))throw Z.generic("UNDEFINED_VALUE","Undefined values are not allowed");return o===null?"null":'"'+Fr(n?n(o.type?o.value:o):""+o)+'"'}).join(i)+"}"},Bt={i:0,char:null,str:"",quoted:!1,last:0},Zn=function(t,n,a){return Bt.i=Bt.last=0,ea(Bt,t,n,a)};function ea(e,t,n,a){let s=[],r=a===1020?";":",";for(;e.i<t.length;e.i++){if(e.char=t[e.i],e.quoted)e.char==="\\"?e.str+=t[++e.i]:e.char==='"'?(s.push(n?n(e.str):e.str),e.str="",e.quoted=t[e.i+1]==='"',e.last=e.i+2):e.str+=e.char;else if(e.char==='"')e.quoted=!0;else if(e.char==="{")e.last=++e.i,s.push(ea(e,t,n,a));else if(e.char==="}"){e.quoted=!1,e.last<e.i&&s.push(n?n(t.slice(e.last,e.i)):t.slice(e.last,e.i)),e.last=e.i+1;break}else e.char===r&&e.p!=="}"&&e.p!=='"'&&(s.push(n?n(t.slice(e.last,e.i)):t.slice(e.last,e.i)),e.last=e.i+1);e.p=e.char}return e.last<e.i&&s.push(n?n(t.slice(e.last,e.i+1)):t.slice(e.last,e.i+1)),s}var Oe=e=>{let t=e[0];for(let n=1;n<e.length;n++)t+=e[n]==="_"?e[++n].toUpperCase():e[n];return t},Ne=e=>{let t=e[0].toUpperCase();for(let n=1;n<e.length;n++)t+=e[n]==="_"?e[++n].toUpperCase():e[n];return t},Pe=e=>e.replace(/_/g,"-"),at=e=>e.replace(/([A-Z])/g,"_$1").toLowerCase(),rt=e=>(e.slice(0,1)+e.slice(1).replace(/([A-Z])/g,"_$1")).toLowerCase(),st=e=>e.replace(/-/g,"_");function Yt(e){return function t(n,a){return typeof n=="object"&&n!==null&&(a.type===114||a.type===3802)?Array.isArray(n)?n.map(s=>t(s,a)):Object.entries(n).reduce((s,[r,i])=>Object.assign(s,{[e(r)]:t(i,a)}),{}):n}}Oe.column={from:Oe};Oe.value={from:Yt(Oe)};at.column={to:at};var Kt={...Oe};Kt.column.to=at;Ne.column={from:Ne};Ne.value={from:Yt(Ne)};rt.column={to:rt};var Xt={...Ne};Xt.column.to=rt;Pe.column={from:Pe};Pe.value={from:Yt(Pe)};st.column={to:st};var Jt={...Pe};Jt.column.to=st;import ta from"net";import Ir from"tls";import it from"crypto";import Qt from"stream";import{performance as na}from"perf_hooks";var $e=class extends Array{constructor(){super(),Object.defineProperties(this,{count:{value:null,writable:!0},state:{value:null,writable:!0},command:{value:null,writable:!0},columns:{value:null,writable:!0},statement:{value:null,writable:!0}})}static get[Symbol.species](){return Array}};var fe=Hr;function Hr(e=[]){let t=e.slice(),n=0;return{get length(){return t.length-n},remove:a=>{let s=t.indexOf(a);return s===-1?null:(t.splice(s,1),a)},push:a=>(t.push(a),a),shift:()=>{let a=t[n++];return n===t.length?(n=0,t=[]):t[n-1]=void 0,a}}}var le=Buffer.allocUnsafe(256),zr="BCcDdEFfHPpQSX".split("").reduce((e,t)=>{let n=t.charCodeAt(0);return e[t]=()=>(le[0]=n,B.i=5,B),e},{}),B=Object.assign(Ur,zr,{N:"\0",i:0,inc(e){return B.i+=e,B},str(e){let t=Buffer.byteLength(e);return yt(t),B.i+=le.write(e,B.i,t,"utf8"),B},i16(e){return yt(2),le.writeUInt16BE(e,B.i),B.i+=2,B},i32(e,t){return t||t===0?(le.writeUInt32BE(e,t),B):(yt(4),le.writeUInt32BE(e,B.i),B.i+=4,B)},z(e){return yt(e),le.fill(0,B.i,B.i+e),B.i+=e,B},raw(e){return le=Buffer.concat([le.subarray(0,B.i),e]),B.i=le.length,B},end(e=1){le.writeUInt32BE(B.i-e,e);let t=le.subarray(0,B.i);return B.i=0,le=Buffer.allocUnsafe(256),t}}),C=B;function yt(e){if(le.length-B.i<e){let t=le,n=t.length;le=Buffer.allocUnsafe(n+(n>>1)+e),t.copy(le)}}function Ur(){return B.i=0,B}var en=sa,jr=1,Se=C().S().end(),aa=C().H().end(),Br=C().i32(8).i32(80877103).end(8),Gr=Buffer.concat([C().E().str(C.N).i32(0).end(),Se]),Wr=C().D().str("S").str(C.N).end(),We=()=>{},qr=new Set(["FetchPreparedStatement","RevalidateCachedQuery","transformAssignedExpr"]),Vr={83:"severity_local",86:"severity",67:"code",77:"message",68:"detail",72:"hint",80:"position",112:"internal_position",113:"internal_query",87:"where",115:"schema_name",116:"table_name",99:"column_name",100:"data type_name",110:"constraint_name",70:"file",76:"line",82:"routine"};function sa(e,t={},{onopen:n=We,onend:a=We,onclose:s=We}={}){let{sslnegotiation:r,ssl:i,max:o,user:c,host:m,port:u,database:p,parsers:d,transform:y,onnotice:v,onnotify:g,onparameter:E,max_pipeline:M,keep_alive:H,backoff:_,target_session_attrs:I}=e,T=fe(),x=jr++,N={pid:null,secret:null},D=Zt(Ht,e.idle_timeout),te=Zt(Ht,e.max_lifetime),w=Zt(ja,e.connect_timeout),b=null,L,R=null,O=new $e,j=Buffer.alloc(0),ee=e.fetch_types,V={},h={},S=Math.random().toString(36).slice(2),G=1,K=0,X=0,A=0,U=0,P=0,F=0,Y=0,ne=null,W=null,xe=!1,ye=null,Ee=null,se=null,J=null,q=null,pe=null,dt=null,Dt=null,k=null,Je=null,ie={queue:t.closed,idleTimer:D,connect(l){se=l,Dn()},terminate:et,execute:Qe,cancel:Ha,end:Ht,count:0,id:x};return t.closed&&t.closed.push(ie),ie;async function Fa(){let l;try{l=e.socket?await Promise.resolve(e.socket(e)):new ta.Socket}catch(f){je(f);return}return l.on("error",je),l.on("close",Fn),l.on("drain",Nn),l}async function Ha({pid:l,secret:f},$,z){try{L=C().i32(16).i32(80877102).i32(l).i32(f).end(16),await Pn(),b.once("error",z),b.once("close",$)}catch(Q){z(Q)}}function Qe(l){if(xe)return Ze(l,Z.connection("CONNECTION_DESTROYED",e));if(q)return Ze(l,Z.generic("COPY_IN_PROGRESS","You cannot execute queries during copy"));if(!l.cancelled)try{return l.state=N,k?T.push(l):(k=l,k.active=!0),Ia(l),re(za(l))&&!l.describeFirst&&!l.cursorFn&&T.length<M&&(!l.options.onexecute||l.options.onexecute(ie))}catch(f){return T.length===0&&re(Se),ge(f),!0}}function za(l){if(l.parameters.length>=65534)throw Z.generic("MAX_PARAMETERS_EXCEEDED","Max number of parameters (65534) exceeded");return l.options.simple?C().Q().str(l.statement.string+C.N).end():l.describeFirst?Buffer.concat([An(l),aa]):l.prepare?l.prepared?pt(l):Buffer.concat([An(l),pt(l)]):Ua(l)}function An(l){return Buffer.concat([zn(l.statement.string,l.parameters,l.statement.types,l.statement.name),Sr("S",l.statement.name)])}function pt(l){return Buffer.concat([$r(l.parameters,l.statement.types,l.statement.name,l.cursorName),l.cursorFn?Un("",l.cursorRows):Gr])}function Ua(l){return Buffer.concat([zn(l.statement.string,l.parameters,l.statement.types),Wr,pt(l)])}function Ia(l){let f=[],$=[],z=Wt(l,l.strings[0],l.args[0],f,$,e);!l.tagged&&l.args.forEach(Q=>bt(Q,f,$,e)),l.prepare=e.prepare&&("prepare"in l.options?l.options.prepare:!0),l.string=z,l.signature=l.prepare&&$+z,l.onlyDescribe&&delete h[l.signature],l.parameters=l.parameters||f,l.prepared=l.prepare&&l.signature in h,l.describeFirst=l.onlyDescribe||f.length&&!l.prepared,l.statement=l.prepared?h[l.signature]:{string:z,types:$,name:l.prepare?S+G++:""},typeof e.debug=="function"&&e.debug(x,z,f,$)}function re(l,f){return pe=pe?Buffer.concat([pe,l]):Buffer.from(l),f||pe.length>=1024?Ln(f):(W===null&&(W=setImmediate(Ln)),!0)}function Ln(l){let f=b.write(pe,l);return W!==null&&clearImmediate(W),pe=W=null,f}function ja(){ge(Z.connection("CONNECT_TIMEOUT",e,b)),b.destroy()}async function On(){if(r!=="direct"&&(re(Br),!await new Promise($=>b.once("data",z=>$(z[0]===83)))&&i==="prefer"))return Ie();let l={socket:b,servername:ta.isIP(b.host)?void 0:b.host};r==="direct"&&(l.ALPNProtocols=["postgresql"]),i==="require"||i==="allow"||i==="prefer"?l.rejectUnauthorized=!1:typeof i=="object"&&Object.assign(l,i),b.removeAllListeners(),b=Ir.connect(l),b.on("secureConnect",Ie),b.on("error",je),b.on("close",Fn),b.on("drain",Nn)}function Nn(){!k&&n(ie)}function Ft(l){if(!(ye&&(ye.push(l),X-=l.length,X>0)))for(j=ye?Buffer.concat(ye,P-X):j.length===0?l:Buffer.concat([j,l],j.length+l.length);j.length>4;){if(P=j.readUInt32BE(1),P>=j.length){X=P-j.length,ye=[j];break}try{Ba(j.subarray(0,P+1))}catch(f){k&&(k.cursorFn||k.describeFirst)&&re(Se),ge(f)}j=j.subarray(P+1),X=0,ye=null}}async function Pn(){if(xe=!1,V={},b||(b=await Fa()),!!b){if(w.start(),e.socket)return i?On():Ie();if(b.on("connect",i?On:Ie),e.path)return b.connect(e.path);b.ssl=i,b.connect(u[A],m[A]),b.host=m[A],b.port=u[A],A=(A+1)%u.length}}function Dn(){setTimeout(Pn,K?Math.max(0,K+F-na.now()):0)}function Ie(){try{h={},ee=e.fetch_types,S=Math.random().toString(36).slice(2),G=1,te.start(),b.on("data",Ft),H&&b.setKeepAlive&&b.setKeepAlive(!0,1e3*H);let l=Tr();re(l)}catch(l){je(l)}}function je(l){if(!(ie.queue===t.connecting&&e.host[U+1]))for(ge(l);T.length;)Ze(T.shift(),l)}function ge(l){q&&(q.destroy(l),q=null),k&&Ze(k,l),se&&(Ze(se,l),se=null)}function Ze(l,f){if(l.reserve)return l.reject(f);(!f||typeof f!="object")&&(f=new Error(f)),"query"in f||"parameters"in f||Object.defineProperties(f,{stack:{value:f.stack+l.origin.replace(/.*\n/,`
`),enumerable:e.debug},query:{value:l.string,enumerable:e.debug},parameters:{value:l.parameters,enumerable:e.debug},args:{value:l.args,enumerable:e.debug},types:{value:l.statement&&l.statement.types,enumerable:e.debug}}),l.reject(f)}function Ht(){return J||(!ie.reserved&&a(ie),!ie.reserved&&!se&&!k&&T.length===0?(et(),new Promise(l=>b&&b.readyState!=="closed"?b.once("close",l):l())):J=new Promise(l=>dt=l))}function et(){xe=!0,(q||k||se||T.length)&&je(Z.connection("CONNECTION_DESTROYED",e)),clearImmediate(W),b&&(b.removeListener("data",Ft),b.removeListener("connect",Ie),b.readyState==="open"&&b.end(C().X().end())),dt&&(dt(),J=dt=null)}async function Fn(l){if(j=Buffer.alloc(0),X=0,ye=null,clearImmediate(W),b.removeListener("data",Ft),b.removeListener("connect",Ie),D.cancel(),te.cancel(),w.cancel(),b.removeAllListeners(),b=null,se)return Dn();!l&&(k||T.length)&&je(Z.connection("CONNECTION_CLOSED",e,b)),K=na.now(),l&&e.shared.retries++,F=(typeof _=="function"?_(e.shared.retries):_)*1e3,s(ie,Z.connection("CONNECTION_CLOSED",e,b))}function Ba(l,f=l[0]){(f===68?Ga:f===100?br:f===65?dr:f===83?Wa:f===90?qa:f===67?Va:f===50?Hn:f===49?Ya:f===116?Ka:f===84?Xa:f===82?Ja:f===110?ar:f===75?rr:f===69?cr:f===115?pr:f===51?mr:f===71?fr:f===78?yr:f===72?gr:f===99?vr:f===73?wr:f===86?xr:f===118?kr:f===87?hr:Er)(l)}function Ga(l){let f=7,$,z,Q,oe=k.isRaw?new Array(k.statement.columns.length):{};for(let ce=0;ce<k.statement.columns.length;ce++)z=k.statement.columns[ce],$=l.readInt32BE(f),f+=4,Q=$===-1?null:k.isRaw===!0?l.subarray(f,f+=$):z.parser===void 0?l.toString("utf8",f,f+=$):z.parser.array===!0?z.parser(l.toString("utf8",f+1,f+=$)):z.parser(l.toString("utf8",f,f+=$)),k.isRaw?oe[ce]=k.isRaw===!0?Q:y.value.from?y.value.from(Q,z):Q:oe[z.name]=y.value.from?y.value.from(Q,z):Q;k.forEachFn?k.forEachFn(y.row.from?y.row.from(oe):oe,O):O[Y++]=y.row.from?y.row.from(oe):oe}function Wa(l){let[f,$]=l.toString("utf8",5,l.length-1).split(C.N);V[f]=$,e.parameters[f]!==$&&(e.parameters[f]=$,E&&E(f,$))}function qa(l){if(k?R?k.retried?ge(k.retried):k.prepared&&qr.has(R.routine)?ur(k,R):ge(R):k.resolve(Ee||O):R&&ge(R),k=Ee=R=null,O=new $e,w.cancel(),se){if(I){if(!V.in_hot_standby||!V.default_transaction_read_only)return lr();if(or(I,V))return et()}if(ee)return se.reserve&&(se=null),sr();se&&!se.reserve&&Qe(se),e.shared.retries=U=0,se=null;return}for(;T.length&&(k=T.shift())&&(k.active=!0,k.cancelled);)sa(e).cancel(k.state,k.cancelled.resolve,k.cancelled.reject);k||(ie.reserved?!ie.reserved.release&&l[5]===73?J?et():(ie.reserved=null,n(ie)):ie.reserved():J?et():n(ie))}function Va(l){Y=0;for(let f=l.length-1;f>0;f--)if(l[f]===32&&l[f+1]<58&&O.count===null&&(O.count=+l.toString("utf8",f+1,l.length-1)),l[f-1]>=65){O.command=l.toString("utf8",5,f),O.state=N;break}if(Je&&(Je(),Je=null),O.command==="BEGIN"&&o!==1&&!ie.reserved)return ge(Z.generic("UNSAFE_TRANSACTION","Only use sql.begin, sql.reserved or max: 1"));if(k.options.simple)return Hn();k.cursorFn&&(O.count&&k.cursorFn(O),re(Se))}function Ya(){k.parsing=!1}function Hn(){!O.statement&&(O.statement=k.statement),O.columns=k.statement.columns}function Ka(l){let f=l.readUInt16BE(5);for(let $=0;$<f;++$)!k.statement.types[$]&&(k.statement.types[$]=l.readUInt32BE(7+$*4));k.prepare&&(h[k.signature]=k.statement),k.describeFirst&&!k.onlyDescribe&&(re(pt(k)),k.describeFirst=!1)}function Xa(l){O.command&&(Ee=Ee||[O],Ee.push(O=new $e),O.count=null,k.statement.columns=null);let f=l.readUInt16BE(5),$=7,z;k.statement.columns=Array(f);for(let Q=0;Q<f;++Q){for(z=$;l[$++]!==0;);let oe=l.readUInt32BE($),ce=l.readUInt16BE($+4),Ce=l.readUInt32BE($+6);k.statement.columns[Q]={name:y.column.from?y.column.from(l.toString("utf8",z,$-1)):l.toString("utf8",z,$-1),parser:d[Ce],table:oe,number:ce,type:Ce},$+=18}if(O.statement=k.statement,k.onlyDescribe)return k.resolve(k.statement),re(Se)}async function Ja(l,f=l.readUInt32BE(5)){(f===3?Qa:f===5?Za:f===10?er:f===11?tr:f===12?nr:f!==0?Cr:We)(l,f)}async function Qa(){let l=await zt();re(C().p().str(l).z(1).end())}async function Za(l){let f="md5"+await ra(Buffer.concat([Buffer.from(await ra(await zt()+c)),l.subarray(9)]));re(C().p().str(f).z(1).end())}async function er(){Dt=(await it.randomBytes(18)).toString("base64"),C().p().str("SCRAM-SHA-256"+C.N);let l=C.i;re(C.inc(4).str("n,,n=*,r="+Dt).i32(C.i-l-4,l).end())}async function tr(l){let f=l.toString("utf8",9).split(",").reduce((ce,Ce)=>(ce[Ce[0]]=Ce.slice(2),ce),{}),$=await it.pbkdf2Sync(await zt(),Buffer.from(f.s,"base64"),parseInt(f.i),32,"sha256"),z=await xt($,"Client Key"),Q="n=*,r="+Dt+",r="+f.r+",s="+f.s+",i="+f.i+",c=biws,r="+f.r;ne=(await xt(await xt($,"Server Key"),Q)).toString("base64");let oe="c=biws,r="+f.r+",p="+Kr(z,Buffer.from(await xt(await Yr(z),Q))).toString("base64");re(C().p().str(oe).end())}function nr(l){l.toString("utf8",9).split(C.N,1)[0].slice(2)!==ne&&(ge(Z.generic("SASL_SIGNATURE_MISMATCH","The server did not return the correct signature")),b.destroy())}function zt(){return Promise.resolve(typeof e.pass=="function"?e.pass():e.pass)}function ar(){if(O.statement=k.statement,O.statement.columns=[],k.onlyDescribe)return k.resolve(k.statement),re(Se)}function rr(l){N.pid=l.readUInt32BE(5),N.secret=l.readUInt32BE(9)}async function sr(){ee=!1,(await new me([`
      select b.oid, b.typarray
      from pg_catalog.pg_type a
      left join pg_catalog.pg_type b on b.oid = a.typelem
      where a.typcategory = 'A'
      group by b.oid, b.typarray
      order by b.oid
    `],[],Qe)).forEach(({oid:f,typarray:$})=>ir(f,$))}function ir(l,f){if(e.parsers[f]&&e.serializers[f])return;let $=e.parsers[l];e.shared.typeArrayMap[l]=f,e.parsers[f]=z=>Zn(z,$,f),e.parsers[f].array=!0,e.serializers[f]=z=>Qn(z,e.serializers[l],e,f)}function or(l,f){return l==="read-write"&&f.default_transaction_read_only==="on"||l==="read-only"&&f.default_transaction_read_only==="off"||l==="primary"&&f.in_hot_standby==="on"||l==="standby"&&f.in_hot_standby==="off"||l==="prefer-standby"&&f.in_hot_standby==="off"&&e.host[U]}function lr(){let l=new me([`
      show transaction_read_only;
      select pg_catalog.pg_is_in_recovery()
    `],[],Qe,null,{simple:!0});l.resolve=([[f],[$]])=>{V.default_transaction_read_only=f.transaction_read_only,V.in_hot_standby=$.pg_is_in_recovery?"on":"off"},l.execute()}function cr(l){k?((k.cursorFn||k.describeFirst)&&re(Se),R=Z.postgres(wt(l))):ge(Z.postgres(wt(l)))}function ur(l,f){delete h[l.signature],l.retried=f,Qe(l)}function dr(l){if(!g)return;let f=9;for(;l[f++]!==0;);g(l.toString("utf8",9,f-1),l.toString("utf8",f,l.length-1))}async function pr(){try{let l=await Promise.resolve(k.cursorFn(O));Y=0,l===Be?re(_r(k.portal)):(O=new $e,re(Un("",k.cursorRows)))}catch(l){re(Se),k.reject(l)}}function mr(){O.count&&k.cursorFn(O),k.resolve(O)}function fr(){q=new Qt.Writable({autoDestroy:!0,write(l,f,$){b.write(C().d().raw(l).end(),$)},destroy(l,f){f(l),b.write(C().f().str(l+C.N).end()),q=null},final(l){b.write(C().c().end()),Je=l,q=null}}),k.resolve(q)}function gr(){q=new Qt.Readable({read(){b.resume()}}),k.resolve(q)}function hr(){q=new Qt.Duplex({autoDestroy:!0,read(){b.resume()},write(l,f,$){b.write(C().d().raw(l).end(),$)},destroy(l,f){f(l),b.write(C().f().str(l+C.N).end()),q=null},final(l){b.write(C().c().end()),Je=l}}),k.resolve(q)}function br(l){q&&(q.push(l.subarray(5))||b.pause())}function vr(){q&&q.push(null),q=null}function yr(l){v?v(wt(l)):console.log(wt(l))}function wr(){}function xr(){ge(Z.notSupported("FunctionCallResponse"))}function kr(){ge(Z.notSupported("NegotiateProtocolVersion"))}function Er(l){console.error("Postgres.js : Unknown Message:",l[0])}function Cr(l,f){console.error("Postgres.js : Unknown Auth:",f)}function $r(l,f,$="",z=""){let Q,oe;return C().B().str(z+C.N).str($+C.N).i16(0).i16(l.length),l.forEach((ce,Ce)=>{if(ce===null)return C.i32(4294967295);oe=f[Ce],l[Ce]=ce=oe in e.serializers?e.serializers[oe](ce):""+ce,Q=C.i,C.inc(4).str(ce).i32(C.i-Q-4,Q)}),C.i16(0),C.end()}function zn(l,f,$,z=""){return C().P().str(z+C.N).str(l+C.N).i16(f.length),f.forEach((Q,oe)=>C.i32($[oe]||0)),C.end()}function Sr(l,f=""){return C().D().str(l).str(f+C.N).end()}function Un(l="",f=0){return Buffer.concat([C().E().str(l+C.N).i32(f).end(),aa])}function _r(l=""){return Buffer.concat([C().C().str("P").str(l+C.N).end(),C().S().end()])}function Tr(){return L||C().inc(4).i16(3).z(2).str(Object.entries(Object.assign({user:c,database:p,client_encoding:"UTF8"},e.connection)).filter(([,l])=>l).map(([l,f])=>l+C.N+f).join(C.N)).z(2).end(0)}}function wt(e){let t={},n=5;for(let a=5;a<e.length-1;a++)e[a]===0&&(t[Vr[e[n]]]=e.toString("utf8",n+1,a),n=a+1);return t}function ra(e){return it.createHash("md5").update(e).digest("hex")}function xt(e,t){return it.createHmac("sha256",e).update(t).digest()}function Yr(e){return it.createHash("sha256").update(e).digest()}function Kr(e,t){let n=Math.max(e.length,t.length),a=Buffer.allocUnsafe(n);for(let s=0;s<n;s++)a[s]=e[s]^t[s];return a}function Zt(e,t){if(t=typeof t=="function"?t():t,!t)return{cancel:We,start:We};let n;return{cancel(){n&&(clearTimeout(n),n=null)},start(){n&&clearTimeout(n),n=setTimeout(a,t*1e3,arguments)}};function a(s){e.apply(null,s),n=null}}var ia=()=>{};function tn(e,t){let n=new Map,a="postgresjs_"+Math.random().toString(36).slice(2),s={},r,i,o=!1,c=p.sql=e({...t,transform:{column:{},value:{},row:{}},max:1,fetch_types:!1,idle_timeout:null,max_lifetime:null,connection:{...t.connection,replication:"database"},onclose:async function(){o||(i=null,s.pid=s.secret=void 0,d(await y(c,a,t.publications)),n.forEach(g=>g.forEach(({onsubscribe:E})=>E())))},no_subscribe:!0}),m=c.end,u=c.close;return c.end=async()=>(o=!0,i&&await new Promise(g=>(i.once("close",g),i.end())),m()),c.close=async()=>(i&&await new Promise(g=>(i.once("close",g),i.end())),u()),p;async function p(g,E,M=ia,H=ia){g=Qr(g),r||(r=y(c,a,t.publications));let _={fn:E,onsubscribe:M},I=n.has(g)?n.get(g).add(_):n.set(g,new Set([_])).get(g),T=()=>{I.delete(_),I.size===0&&n.delete(g)};return r.then(x=>(d(x),M(),i&&i.on("error",H),{unsubscribe:T,state:s,sql:c}))}function d(g){i=g.stream,s.pid=g.state.pid,s.secret=g.state.secret}async function y(g,E,M){if(!M)throw new Error("Missing publication names");let H=await g.unsafe(`CREATE_REPLICATION_SLOT ${E} TEMPORARY LOGICAL pgoutput NOEXPORT_SNAPSHOT`),[_]=H,I=await g.unsafe(`START_REPLICATION SLOT ${E} LOGICAL ${_.consistent_point} (proto_version '1', publication_names '${M}')`).writable(),T={lsn:Buffer.concat(_.consistent_point.split("/").map(w=>Buffer.from(("00000000"+w).slice(-8),"hex")))};return I.on("data",N),I.on("error",x),I.on("close",g.close),{stream:I,state:H.state};function x(w){console.error("Unexpected error during logical streaming - reconnecting",w)}function N(w){w[0]===119?Jr(w.subarray(25),T,g.options.parsers,D,t.transform):w[0]===107&&w[17]&&(T.lsn=w.subarray(1,9),te())}function D(w,b){let L=b.relation.schema+"."+b.relation.table;v("*",w,b),v("*:"+L,w,b),b.relation.keys.length&&v("*:"+L+"="+b.relation.keys.map(R=>w[R.name]),w,b),v(b.command,w,b),v(b.command+":"+L,w,b),b.relation.keys.length&&v(b.command+":"+L+"="+b.relation.keys.map(R=>w[R.name]),w,b)}function te(){let w=Buffer.alloc(34);w[0]=114,w.fill(T.lsn,1),w.writeBigInt64BE(BigInt(Date.now()-Date.UTC(2e3,0,1))*BigInt(1e3),25),I.write(w)}}function v(g,E,M){n.has(g)&&n.get(g).forEach(({fn:H})=>H(E,M,g))}}function Xr(e){return new Date(Date.UTC(2e3,0,1)+Number(e/BigInt(1e3)))}function Jr(e,t,n,a,s){let r=(i,[o,c])=>(i[o.charCodeAt(0)]=c,i);Object.entries({R:i=>{let o=1,c=t[i.readUInt32BE(o)]={schema:i.toString("utf8",o+=4,o=i.indexOf(0,o))||"pg_catalog",table:i.toString("utf8",o+1,o=i.indexOf(0,o+1)),columns:Array(i.readUInt16BE(o+=2)),keys:[]};o+=2;let m=0,u;for(;o<i.length;)u=c.columns[m++]={key:i[o++],name:s.column.from?s.column.from(i.toString("utf8",o,o=i.indexOf(0,o))):i.toString("utf8",o,o=i.indexOf(0,o)),type:i.readUInt32BE(o+=1),parser:n[i.readUInt32BE(o)],atttypmod:i.readUInt32BE(o+=4)},u.key&&c.keys.push(u),o+=4},Y:()=>{},O:()=>{},B:i=>{t.date=Xr(i.readBigInt64BE(9)),t.lsn=i.subarray(1,9)},I:i=>{let o=1,c=t[i.readUInt32BE(o)],{row:m}=kt(i,c.columns,o+=7,s);a(m,{command:"insert",relation:c})},D:i=>{let o=1,c=t[i.readUInt32BE(o)];o+=4;let m=i[o]===75;a(m||i[o]===79?kt(i,c.columns,o+=3,s).row:null,{command:"delete",relation:c,key:m})},U:i=>{let o=1,c=t[i.readUInt32BE(o)];o+=4;let m=i[o]===75,u=m||i[o]===79?kt(i,c.columns,o+=3,s):null;u&&(o=u.i);let{row:p}=kt(i,c.columns,o+3,s);a(p,{command:"update",relation:c,key:m,old:u&&u.row})},T:()=>{},C:()=>{}}).reduce(r,{})[e[0]](e)}function kt(e,t,n,a){let s,r,i,o=a.raw?new Array(t.length):{};for(let c=0;c<t.length;c++)s=e[n++],r=t[c],i=s===110?null:s===117?void 0:r.parser===void 0?e.toString("utf8",n+4,n+=4+e.readUInt32BE(n)):r.parser.array===!0?r.parser(e.toString("utf8",n+5,n+=4+e.readUInt32BE(n))):r.parser(e.toString("utf8",n+4,n+=4+e.readUInt32BE(n))),a.raw?o[c]=a.raw===!0?i:a.value.from?a.value.from(i,r):i:o[r.name]=a.value.from?a.value.from(i,r):i;return{i:n,row:a.row.from?a.row.from(o):o}}function Qr(e){let t=e.match(/^(\*|insert|update|delete)?:?([^.]+?\.?[^=]+)?=?(.+)?/i)||[];if(!t)throw new Error("Malformed subscribe pattern: "+e);let[,n,a,s]=t;return(n||"*")+(a?":"+(a.indexOf(".")===-1?"public."+a:a):"")+(s?"="+s:"")}import oa from"stream";function nn(e,t,n=393216){return new Promise(async(a,s)=>{await e.begin(async r=>{let i;!t&&([{oid:t}]=await r`select lo_creat(-1) as oid`);let[{fd:o}]=await r`select lo_open(${t}, ${n}) as fd`,c={writable:u,readable:m,close:()=>r`select lo_close(${o})`.then(i),tell:()=>r`select lo_tell64(${o})`,read:p=>r`select loread(${o}, ${p}) as data`,write:p=>r`select lowrite(${o}, ${p})`,truncate:p=>r`select lo_truncate64(${o}, ${p})`,seek:(p,d=0)=>r`select lo_lseek64(${o}, ${p}, ${d})`,size:()=>r`
          select
            lo_lseek64(${o}, location, 0) as position,
            seek.size
          from (
            select
              lo_lseek64($1, 0, 2) as size,
              tell.location
            from (select lo_tell64($1) as location) tell
          ) seek
        `};return a(c),new Promise(async p=>i=p);async function m({highWaterMark:p=2048*8,start:d=0,end:y=1/0}={}){let v=y-d;return d&&await c.seek(d),new oa.Readable({highWaterMark:p,async read(g){let E=g>v?g-v:g;v-=g;let[{data:M}]=await c.read(E);this.push(M),M.length<g&&this.push(null)}})}async function u({highWaterMark:p=2048*8,start:d=0}={}){return d&&await c.seek(d),new oa.Writable({highWaterMark:p,write(y,v,g){c.write(y).then(()=>g(),g)}})}}).catch(s)})}Object.assign(Et,{PostgresError:Le,toPascal:Ne,pascal:Xt,toCamel:Oe,camel:Kt,toKebab:Pe,kebab:Jt,fromPascal:rt,fromCamel:at,fromKebab:st,BigInt:{to:20,from:[20],parse:e=>BigInt(e),serialize:e=>e.toString()}});var la=Et;function Et(e,t){let n=ts(e,t),a=n.no_subscribe||tn(Et,{...n}),s=!1,r=fe(),i=fe(),o=fe(),c=fe(),m=fe(),u=fe(),p=fe(),d=fe(),y={connecting:i,reserved:o,closed:c,ended:m,open:u,busy:p,full:d},v=[...Array(n.max)].map(()=>en(n,y,{onopen:ee,onend:j,onclose:V})),g=E(D);return Object.assign(g,{get parameters(){return n.parameters},largeObject:nn.bind(null,g),subscribe:a,CLOSE:Be,END:Be,PostgresError:Le,options:n,reserve:_,listen:M,begin:I,close:L,end:b}),g;function E(h){return h.debug=n.debug,Object.entries(n.types).reduce((A,[U,P])=>(A[U]=F=>new be(F,P.to),A),S),Object.assign(G,{types:S,typed:S,unsafe:K,notify:H,array:N,json:x,file:X}),G;function S(A,U){return new be(A,U)}function G(A,...U){return A&&Array.isArray(A.raw)?new me(A,U,h,w):typeof A=="string"&&!U.length?new Ge(n.transform.column.to?n.transform.column.to(A):A):new nt(A,U)}function K(A,U=[],P={}){return arguments.length===2&&!Array.isArray(U)&&(P=U,U=[]),new me([A],U,h,w,{prepare:!1,...P,simple:"simple"in P?P.simple:U.length===0})}function X(A,U=[],P={}){return arguments.length===2&&!Array.isArray(U)&&(P=U,U=[]),new me([],U,Y=>{es.readFile(A,"utf8",(ne,W)=>{if(ne)return Y.reject(ne);Y.strings=[W],h(Y)})},w,{...P,simple:"simple"in P?P.simple:U.length===0})}}async function M(h,S,G){let K={fn:S,onlisten:G},X=M.sql||(M.sql=Et({...n,max:1,idle_timeout:null,max_lifetime:null,fetch_types:!1,onclose(){Object.entries(M.channels).forEach(([Y,{listeners:ne}])=>{delete M.channels[Y],Promise.all(ne.map(W=>M(Y,W.fn,W.onlisten).catch(()=>{})))})},onnotify(Y,ne){Y in M.channels&&M.channels[Y].listeners.forEach(W=>W.fn(ne))}})),A=M.channels||(M.channels={});if(h in A){A[h].listeners.push(K);let Y=await A[h].result;return K.onlisten&&K.onlisten(),{state:Y.state,unlisten:F}}A[h]={result:X`listen ${X.unsafe('"'+h.replace(/"/g,'""')+'"')}`,listeners:[K]};let P=await A[h].result;return K.onlisten&&K.onlisten(),{state:P.state,unlisten:F};async function F(){if(h in A&&(A[h].listeners=A[h].listeners.filter(Y=>Y!==K),!A[h].listeners.length))return delete A[h],X`unlisten ${X.unsafe('"'+h.replace(/"/g,'""')+'"')}`}}async function H(h,S){return await g`select pg_notify(${h}, ${""+S})`}async function _(){let h=fe(),S=u.length?u.shift():await new Promise((X,A)=>{let U={reserve:X,reject:A};r.push(U),c.length&&O(c.shift(),U)});T(S,o),S.reserved=()=>h.length?S.execute(h.shift()):T(S,o),S.reserved.release=!0;let G=E(K);return G.release=()=>{S.reserved=null,ee(S)},G;function K(X){S.queue===d?h.push(X):S.execute(X)||T(S,d)}}async function I(h,S){!S&&(S=h,h="");let G=fe(),K=0,X,A=null;try{return await g.unsafe("begin "+h.replace(/[^a-z ]/ig,""),[],{onexecute:P}).execute(),await Promise.race([U(X,S),new Promise((F,Y)=>X.onclose=Y)])}catch(F){throw F}async function U(F,Y,ne){let W=E(se);W.savepoint=Ee,W.prepare=J=>A=J.replace(/[^a-z0-9$-_. ]/gi);let xe,ye;ne&&await W`savepoint ${W(ne)}`;try{if(ye=await new Promise((J,q)=>{let pe=Y(W);Promise.resolve(Array.isArray(pe)?Promise.all(pe):pe).then(J,q)}),xe)throw xe}catch(J){throw await(ne?W`rollback to ${W(ne)}`:W`rollback`),J instanceof Le&&J.code==="25P02"&&xe||J}return ne||(A?await W`prepare transaction '${W.unsafe(A)}'`:await W`commit`),ye;function Ee(J,q){return J&&Array.isArray(J.raw)?Ee(pe=>pe.apply(pe,arguments)):(arguments.length===1&&(q=J,J=null),U(F,q,"s"+K+++(J?"_"+J:"")))}function se(J){J.catch(q=>xe||(xe=q)),F.queue===d?G.push(J):F.execute(J)||T(F,d)}}function P(F){X=F,T(F,o),F.reserved=()=>G.length?F.execute(G.shift()):T(F,o)}}function T(h,S){return h.queue.remove(h),S.push(h),h.queue=S,S===u?h.idleTimer.start():h.idleTimer.cancel(),h}function x(h){return new be(h,3802)}function N(h,S){return Array.isArray(h)?new be(h,S||(h.length?ht(h)||25:0),n.shared.typeArrayMap):N(Array.from(arguments))}function D(h){if(s)return h.reject(Z.connection("CONNECTION_ENDED",n,n));if(u.length)return te(u.shift(),h);if(c.length)return O(c.shift(),h);p.length?te(p.shift(),h):r.push(h)}function te(h,S){return h.execute(S)?T(h,p):T(h,d)}function w(h){return new Promise((S,G)=>{h.state?h.active?en(n).cancel(h.state,S,G):h.cancelled={resolve:S,reject:G}:(r.remove(h),h.cancelled=!0,h.reject(Z.generic("57014","canceling statement due to user request")),S())})}async function b({timeout:h=null}={}){if(s)return s;await 1;let S;return s=Promise.race([new Promise(G=>h!==null&&(S=setTimeout(R,h*1e3,G))),Promise.all(v.map(G=>G.end()).concat(M.sql?M.sql.end({timeout:0}):[],a.sql?a.sql.end({timeout:0}):[]))]).then(()=>clearTimeout(S))}async function L(){await Promise.all(v.map(h=>h.end()))}async function R(h){for(await Promise.all(v.map(S=>S.terminate()));r.length;)r.shift().reject(Z.connection("CONNECTION_DESTROYED",n));h()}function O(h,S){return T(h,i),h.connect(S),h}function j(h){T(h,m)}function ee(h){if(r.length===0)return T(h,u);let S=Math.ceil(r.length/(i.length+1)),G=!0;for(;G&&r.length&&S-- >0;){let K=r.shift();if(K.reserve)return K.reserve(h);G=h.execute(K)}G?T(h,p):T(h,d)}function V(h,S){T(h,c),h.reserved=null,h.onclose&&(h.onclose(S),h.onclose=null),n.onclose&&n.onclose(h.id),r.length&&O(h,r.shift())}}function ts(e,t){if(e&&e.shared)return e;let n=process.env,a=(!e||typeof e=="string"?t:e)||{},{url:s,multihost:r}=is(e),i=[...s.searchParams].reduce((d,[y,v])=>(d[y]=v,d),{}),o=a.hostname||a.host||r||s.hostname||n.PGHOST||"localhost",c=a.port||s.port||n.PGPORT||5432,m=a.user||a.username||s.username||n.PGUSERNAME||n.PGUSER||os();a.no_prepare&&(a.prepare=!1),i.sslmode&&(i.ssl=i.sslmode,delete i.sslmode),"timeout"in a&&(console.log("The timeout option is deprecated, use idle_timeout instead"),a.idle_timeout=a.timeout),i.sslrootcert==="system"&&(i.ssl="verify-full");let u=["idle_timeout","connect_timeout","max_lifetime","max_pipeline","backoff","keep_alive"],p={max:globalThis.Cloudflare?3:10,ssl:!1,sslnegotiation:null,idle_timeout:null,connect_timeout:30,max_lifetime:rs,max_pipeline:100,backoff:as,keep_alive:60,prepare:!0,debug:!1,fetch_types:!0,publications:"alltables",target_session_attrs:null};return{host:Array.isArray(o)?o:o.split(",").map(d=>d.split(":")[0]),port:Array.isArray(c)?c:o.split(",").map(d=>parseInt(d.split(":")[1]||c)),path:a.path||o.indexOf("/")>-1&&o+"/.s.PGSQL."+c,database:a.database||a.db||(s.pathname||"").slice(1)||n.PGDATABASE||m,user:m,pass:a.pass||a.password||s.password||n.PGPASSWORD||"",...Object.entries(p).reduce((d,[y,v])=>{let g=y in a?a[y]:y in i?i[y]==="disable"||i[y]==="false"?!1:i[y]:n["PG"+y.toUpperCase()]||v;return d[y]=typeof g=="string"&&u.includes(y)?+g:g,d},{}),connection:{application_name:n.PGAPPNAME||"postgres.js",...a.connection,...Object.entries(i).reduce((d,[y,v])=>(y in p||(d[y]=v),d),{})},types:a.types||{},target_session_attrs:ns(a,s,n),onnotice:a.onnotice,onnotify:a.onnotify,onclose:a.onclose,onparameter:a.onparameter,socket:a.socket,transform:ss(a.transform||{undefined:void 0}),parameters:{},shared:{retries:0,typeArrayMap:{}},...Xn(a.types)}}function ns(e,t,n){let a=e.target_session_attrs||t.searchParams.get("target_session_attrs")||n.PGTARGETSESSIONATTRS;if(!a||["read-write","read-only","primary","standby","prefer-standby"].includes(a))return a;throw new Error("target_session_attrs "+a+" is not supported")}function as(e){return(.5+Math.random()/2)*Math.min(3**e/100,20)}function rs(){return 60*(30+Math.random()*30)}function ss(e){return{undefined:e.undefined,column:{from:typeof e.column=="function"?e.column:e.column&&e.column.from,to:e.column&&e.column.to},value:{from:typeof e.value=="function"?e.value:e.value&&e.value.from,to:e.value&&e.value.to},row:{from:typeof e.row=="function"?e.row:e.row&&e.row.from,to:e.row&&e.row.to}}}function is(e){if(!e||typeof e!="string")return{url:{searchParams:new Map}};let t=e;t=t.slice(t.indexOf("://")+3).split(/[?/]/)[0],t=decodeURIComponent(t.slice(t.indexOf("@")+1));let n=new URL(e.replace(t,t.split(",")[0]));return{url:{username:decodeURIComponent(n.username),password:decodeURIComponent(n.password),host:n.host,hostname:n.hostname,port:n.port,pathname:n.pathname,searchParams:n.searchParams},multihost:t.indexOf(",")>-1&&t}}function os(){try{return Zr.userInfo().username}catch{return process.env.USERNAME||process.env.USER||process.env.LOGNAME}}var Ct=null;function an(){if(Ct)return Ct;let e=process.env.DATABASE_URL;if(!e)throw new Error("DATABASE_URL manquante");return Ct=la(e,{max:4,prepare:!1,idle_timeout:20,connect_timeout:30,onnotice:()=>{},types:{bigint:{to:20,from:[20],parse:t=>Number(t),serialize:t=>String(t)},numeric:{to:1700,from:[1700],parse:t=>parseFloat(t),serialize:t=>String(t)},date:{to:1082,from:[1082],parse:t=>t,serialize:t=>String(t)}}}),Ct}var _e=class extends Error{},qe=class extends Error{},De=class extends Error{},ls=["captcha","access denied","are you a robot","unusual traffic","pardon our interruption","request blocked","verify you are human","zugriff verweigert","robot check"],sn=process.env.USER_AGENT||"Mozilla/5.0 (compatible; CoteSport/1.0; collecte de donnees publiques; +https://github.com/BenedeNimes/cotesport)",rn=e=>new Promise(t=>setTimeout(t,e)),on=class{rules=[];constructor(t){let n=!1,a=!1,s=!1;for(let r of t.split(/\r?\n/)){let i=r.replace(/#.*/,"").trim();if(!i)continue;let o=i.indexOf(":");if(o<0)continue;let c=i.slice(0,o).trim().toLowerCase(),m=i.slice(o+1).trim();if(c==="user-agent"){s&&(n=!1,s=!1);let u=m.toLowerCase();(u==="*"||sn.toLowerCase().includes(u))&&(n=!0)}else if((c==="disallow"||c==="allow")&&n){if(s=!0,a=!0,!m)continue;let u=new RegExp("^"+m.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\\\$$/,"$"));this.rules.push({allow:c==="allow",re:u,len:m.length})}}}can(t){let n=null;for(let a of this.rules)a.re.test(t)&&(!n||a.len>n.len||a.len===n.len&&a.allow)&&(n=a);return n?n.allow:!0}},$t=class{constructor(t){this.o=t}last=new Map;robots=new Map;async wait(t){let n=this.o.delayS*1e3*(.8+Math.random()*.6),a=Date.now()-(this.last.get(t)??0);a<n&&await rn(n-a),this.last.set(t,Date.now())}async allowed(t){if(!this.o.respectRobots)return!0;let n=new URL(t);if(!this.robots.has(n.origin))try{let s=await fetch(`${n.origin}/robots.txt`,{headers:{"User-Agent":sn},signal:AbortSignal.timeout(15e3)});this.robots.set(n.origin,s.status===200?new on(await s.text()):null)}catch{this.robots.set(n.origin,null)}let a=this.robots.get(n.origin);return a?a.can(n.pathname+n.search):!0}async get(t){if(!await this.allowed(t))throw new qe(t);let n=new URL(t).host;await this.wait(n);let a=5e3;for(let s=0;s<3;s++){let r;try{r=await fetch(t,{headers:{"User-Agent":sn,Accept:"text/html,application/xhtml+xml;q=0.9,*/*;q=0.8","Accept-Language":"de-CH,de;q=0.9,fr;q=0.8,en;q=0.6"},redirect:"follow",signal:AbortSignal.timeout(3e4)})}catch(o){if(s===2)throw new De(String(o));await rn(a),a*=2;continue}if([403,429,503,451].includes(r.status))throw new _e(`HTTP ${r.status} sur ${n}`);if(r.status>=500&&s<2){await rn(a),a*=2;continue}if(r.status>=400)throw new De(`HTTP ${r.status} sur ${t}`);let i=await r.text();if(i.length<4e3&&ls.some(o=>i.slice(0,6e3).toLowerCase().includes(o)))throw new _e(`page de contr\xF4le anti-robot sur ${n}`);return i}throw new De(t)}};function Te(e){return{title:"",description:"",price:null,year:null,month:null,km:null,powerPs:null,gearbox:"",publishedAt:null,make:"BMW",color:null,colorName:null,extraOptions:[],extraFlags:[],...e}}function ca(e){if(e==null)return null;if(typeof e=="number")return e>0?e:null;let t=String(e).match(/\d[\d'’.,\s ]*\d|\d/);if(!t)return null;let n=t[0].replace(/[\s'’ ]/g,"");/[.,]\d{1,2}$/.test(n)&&!/[.,]\d{3}$/.test(n)&&(n=n.replace(/[.,](\d{1,2})$/,"#$1")),n=n.replace(/[.,]/g,"").replace("#",".");let a=Number(n);return Number.isFinite(a)&&a>0?a:null}function St(e){if(e==null)return null;if(typeof e=="number")return e>=0?Math.trunc(e):null;let t=String(e).match(/(\d[\d'’.,\s ]*)\s*km/i);if(t||(t=String(e).match(/^\s*(\d[\d'’.,\s ]*)\s*$/)),!t)return null;let n=t[1].replace(/\D/g,"");return n?Number(n):null}function Ve(e){if(e==null)return[null,null];let t=String(e),n=t.match(/\b(0?[1-9]|1[0-2])\s*[/.\-]\s*((?:19|20)\d{2})\b/);return n?[Number(n[2]),Number(n[1])]:(n=t.match(/\b((?:19|20)\d{2})\s*[/.\-]\s*(0?[1-9]|1[0-2])\b/),n?[Number(n[1]),Number(n[2])]:(n=t.match(/\b((?:19|20)\d{2})\b/),n?[Number(n[1]),null]:[null,null]))}function _t(e){if(e==null)return null;if(typeof e=="number")return e>0?Math.trunc(e):null;let t=String(e),n=t.match(/(\d{2,4})\s*(?:ps|cv|ch|hp|bhp)\b/i);return n?Number(n[1]):(n=t.match(/(\d{2,4})\s*kw\b/i),n?Math.round(Number(n[1])*1.35962):null)}function Fe(e){return e.replace(/<(script|style)[\s\S]*?<\/\1>/gi," ").replace(/<br\s*\/?>/gi,`
`).replace(/<\/(p|div|li|h\d|tr)>/gi,`
`).replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#x27;/g,"'").replace(/[ \t ]+/g," ").replace(/\n\s*\n+/g,`
`).trim()}var de={carbon_roof:{label:"Toit carbone",kind:"option",patterns:["carbon[- ]?dach","toit (en )?carbone","carbon roof","carbon[- ]?roof"]},carbon_seats:{label:"Si\xE8ges baquets carbone",kind:"option",patterns:["carbon[- ]?schalensitz","carbon bucket","baquets? (en )?carbone","m carbon[- ]?sitze"]},carbon_ceramic:{label:"Freins carbone-c\xE9ramique",kind:"option",patterns:["carbon[- ]?keramik","keramikbrems","carbon[- ]?ceramic","carbone[- ]?c[\xE9e]ramique"]},drivers_package:{label:"M Driver's Package",kind:"option",patterns:["m driver'?s? ?package","m fahrerpaket","fahrerpaket","driver'?s? package"]},carbon_package:{label:"Pack carbone ext\xE9rieur",kind:"option",patterns:["carbon[- ]?(ext|paket|package|aussen|au\xDFen)","pack carbone","carbon exterior","carbon[- ]?aero"]},m_performance_parts:{label:"M Performance Parts",kind:"option",patterns:["m performance (teile|parts|pi[e\xE8]ces|zubeh)","m performance (abgas|auspuff|exhaust)"]},adaptive_susp:{label:"Suspension M adaptative",kind:"option",patterns:["adaptives? m fahrwerk","suspension (m )?adaptative","adaptive m susp","adaptive suspension"]},m_diff:{label:"Diff\xE9rentiel M / autobloquant",kind:"option",patterns:["m differential","m differenzial","sperrdifferential","autobloquant"]},sport_exhaust:{label:"\xC9chappement sport M",kind:"option",patterns:["m sportabgas","sportabgas","[\xE9e]chappement sport","sport exhaust","klappenauspuff"]},head_up:{label:"Affichage t\xEAte haute",kind:"option",patterns:["head[- ]?up","\\bhud\\b","t[\xEAe]te haute"]},harman:{label:"Harman Kardon",kind:"option",patterns:["harman[ /-]?kardon","\\bh&k\\b","\\bhk\\b"]},bowers:{label:"Bowers & Wilkins",kind:"option",patterns:["bowers ?(&|and|und)? ?wilkins","\\bb&w\\b"]},laser:{label:"Phares laser",kind:"option",patterns:["laser ?licht","laser ?light","phares? laser"]},driving_assist_pro:{label:"Driving Assistant Professional",kind:"option",patterns:["driving assistant (pro|plus)","fahrassistent (pro|plus)","assistant de conduite pro"]},glass_roof:{label:"Toit ouvrant / panoramique",kind:"option",patterns:["panorama","glasdach","schiebedach","toit (ouvrant|panoramique)","sunroof","moonroof"]},ventilated_seats:{label:"Si\xE8ges ventil\xE9s",kind:"option",patterns:["sitzbel[\xFCu]ftung","si[\xE8e]ges? ventil","ventilated seats?"]},heated_seats:{label:"Si\xE8ges chauffants",kind:"option",patterns:["sitzheizung","si[\xE8e]ges? chauff","heated seats?"]},keyless:{label:"Acc\xE8s confort",kind:"option",patterns:["komfortzugang","acc[\xE8e]s confort","keyless","comfort access"]},individual:{label:"BMW Individual / couleur sp\xE9ciale",kind:"option",patterns:["bmw individual","individual[- ]?(lack|farbe|paint|peinture|color|colour)","sonderlackierung","peinture sp[\xE9e]ciale","frozen"]},manual:{label:"Bo\xEEte manuelle",kind:"option",patterns:["schaltgetriebe","6[- ]gang manuell","handschalt","bo[i\xEE]te (m[\xE9e]canique|manuelle)","manual (gearbox|transmission)","6[- ]?speed manual","\\bmanuell\\b","handschalter"]},ppf:{label:"Film de protection (PPF)",kind:"option",patterns:["lackschutzfolie","\\bppf\\b","paint protection","film de protection","xpel"]},winter_tires:{label:"Roues hiver incluses",kind:"option",patterns:["winterr[\xE4a]der","winterreifen","jeu de roues hiver","pneus? hiver","winter (wheels|tyres|tires)","komplettr\xE4der winter"]},m_sport_package:{label:"Pack M Sport",kind:"option",patterns:["m[- ]?sport(paket|package|pack)\\b","m sport pro"]},competition_package:{label:"Pack Competition",kind:"option",patterns:["competition[- ]?(paket|package|pack)"]},track_package:{label:"Pack Track / Race Track",kind:"option",patterns:["(race[- ]?)?track[- ]?(paket|package|pack)","m track","rennstrecken"]},m_sport_seats:{label:"Si\xE8ges M Sport",kind:"option",patterns:["m[- ]?sportsitze?","m sport seats?","si[\xE8e]ges? m sport","sedili sportivi m"]},comfort_seats:{label:"Si\xE8ges confort / m\xE9moire",kind:"option",patterns:["komfortsitze?","sitzmemory|memory[- ]?(sitz|seat|funktion)","elektr(isch)?e? (verstell|sitze)","si[\xE8e]ges? (confort|[\xE9e]lectriques|m[\xE9e]moire)","comfort seats?","power seats?","sedili (comfort|elettrici)"]},merino:{label:"Cuir Merino / cuir int\xE9gral",kind:"option",patterns:["merino","vollleder","volllederausstattung","full leather","cuir (int[\xE9e]gral|pleine fleur)","pelle (integrale|merino)","leder[- ]?(komplett|innenausstattung)"]},alcantara:{label:"Alcantara",kind:"option",patterns:["alcantara"]},carbon_trim:{label:"D\xE9cors carbone int\xE9rieur",kind:"option",patterns:["carbon[- ]?(interieur|innenraum|zierleisten|trim|decor|dekor|inlay)","d[\xE9e]cors? (en )?carbone","interni in carbonio","carbon interior"]},carbon_hood:{label:"Capot carbone",kind:"option",patterns:["carbon[- ]?(motorhaube|haube|hood|bonnet)","capot (en )?carbone","cofano in carbonio"]},carbon_mirrors:{label:"R\xE9troviseurs carbone",kind:"option",patterns:["carbon[- ]?(au[\xDFs]en)?spiegel","carbon (side )?mirrors?","r[\xE9e]troviseurs? (en )?carbone"]},carbon_aero:{label:"Aileron / lame carbone",kind:"option",patterns:["carbon[- ]?(heck)?spoiler","carbon[- ]?(lippe|splitter|diffusor|diffuser)","aileron (en )?carbone","carbon (rear )?spoiler"]},surround_view:{label:"Cam\xE9ra 360\xB0 / Surround View",kind:"option",patterns:["surround[- ]?view","top[- ]?view","360 ?(\xB0|grad)","rundum(sicht)?[- ]?kamera","cam[\xE9e]ra 360","kamera 360"]},parking_assistant:{label:"Assistant de stationnement",kind:"option",patterns:["parking assistant","park(ing)?[- ]?assistent","park assist","assistant de stationnement","aide au stationnement","assistente (al )?parcheggio","parkassistent"]},rear_camera:{label:"Cam\xE9ra de recul",kind:"option",patterns:["r[\xFCu]ckfahrkamera","(rear[- ]?view|reversing|backup) camera","cam[\xE9e]ra de recul","telecamera posteriore"]},adaptive_cruise:{label:"R\xE9gulateur de vitesse adaptatif",kind:"option",patterns:["aktive?r? geschwindigkeitsregel","adaptive[rn]? tempomat","adaptive cruise","\\bacc\\b","r[\xE9e]gulateur (de vitesse )?adaptatif","cruise control mit bremse","tempomat mit bremsfunktion"]},display_key:{label:"Cl\xE9 \xE9cran (Display Key)",kind:"option",patterns:["display[- ]?key","displayschl[\xFCu]ssel","cl[\xE9e] ([\xE9e]cran|display)"]},ambient:{label:"\xC9clairage d'ambiance",kind:"option",patterns:["ambiente?[- ]?(beleuchtung|licht|light)","ambient (light|lighting)","[\xE9e]clairage d'?ambiance","illuminazione ambient"]},wireless_charging:{label:"Recharge smartphone sans fil",kind:"option",patterns:["wireless charging","induktiv(es)? laden","kabellos(es)? laden","ladeschale","charge(ment)? sans fil","ricarica wireless"]},carplay:{label:"Apple CarPlay",kind:"option",patterns:["apple ?carplay","carplay"]},led_headlights:{label:"Phares LED adaptatifs",kind:"option",patterns:["adaptive led","led[- ]?scheinwerfer","led[- ]?headlight","phares? led","fari led"]},heated_wheel:{label:"Volant chauffant",kind:"option",patterns:["lenkradheizung","heated steering","volant chauffant","volante riscaldato"]},tow_bar:{label:"Attelage",kind:"option",patterns:["anh[\xE4a]ngerkupplung","\\bahk\\b","tow ?bar","trailer hitch","attelage","gancio traino"]},parking_heater:{label:"Chauffage stationnaire",kind:"option",patterns:["standheizung","auxiliary heater","parking heater","chauffage (auxiliaire|stationnaire)"]},soft_close:{label:"Fermeture assist\xE9e des portes",kind:"option",patterns:["soft[- ]?close","komfortschlie[\xDFs]","fermeture (assist|confort)"]},forged_wheels:{label:"Jantes M forg\xE9es",kind:"option",patterns:["forged","geschmiedet","schmiede(r[\xE4a]der|felgen)","jantes? forg[\xE9e]es?","cerchi forgiati"]},m_brakes:{label:"Freins M Sport / Compound",kind:"option",patterns:["m[- ]?sportbremse","m[- ]?compound","compound[- ]?brems","freins? m (sport|compound)","m sport brakes?"]},active_steering:{label:"Direction int\xE9grale active",kind:"option",patterns:["integral[- ]?aktivlenkung","integral active steering","direction int[\xE9e]grale","hinterachslenkung"]},xdrive:{label:"Transmission int\xE9grale xDrive",kind:"body",patterns:["x[- ]?drive"]},body_touring:{label:"Carrosserie Touring (break)",kind:"body",patterns:["\\btouring\\b"]},body_convertible:{label:"Carrosserie Cabriolet",kind:"body",patterns:["cabrio(let)?","convertible","\\bcabrio\\b","decapotable","d[\xE9e]capotable"]},body_gran_coupe:{label:"Carrosserie Gran Coup\xE9",kind:"body",patterns:["gran ?coup[\xE9e]"]},sound_system:{label:"Syst\xE8me audio haut de gamme",kind:"option",patterns:["hifi[- ]?(system|lautsprecher)?\\s*(professional|prof\\.?)","hifi professional","hi-?fi pro","audio(system)? (haut de gamme|premium)","premium sound"]},nonsmoker:{label:"Non-fumeur",kind:"cond",patterns:["nichtraucher","non[- ]?fumeur","non[- ]?smoker","no smoking","non fumatore"]},recent_inspection:{label:"Contr\xF4le / entretien r\xE9cent",kind:"cond",patterns:["frisch(e|er)? (service|t[\xFCu]v|hu\\b|inspektion)","neu(e|er)? (t[\xFCu]v|hu\\b)","t[\xFCu]v neu","service neu","inspection (neuve|r[\xE9e]cente)","expertis[\xE9e]e? (r[\xE9e]cemment|du jour)","mfk (neu|frisch)","frisch ab mfk","gerade gewartet"]},service_history:{label:"Historique d'entretien complet",kind:"cond",patterns:["scheckheft","serviceheft","l[\xFCu]ckenlos","carnet d'?entretien","full service history","service history","historique (d'?entretien|complet)","checkheft","serviceheft gepflegt"]},accident_free:{label:"Sans accident",kind:"cond",patterns:["unfallfrei","sans accident","accident[- ]?free","no accident","non accident[\xE9e]","kein unfall"]},first_owner:{label:"Premi\xE8re main",kind:"cond",patterns:["erstbesitz","1\\. ?hand","erste hand","1 vorbesitzer","ein vorbesitzer","premi[\xE8e]re main","1st owner","first owner","one owner","1 propri[\xE9e]taire","unique propri[\xE9e]taire","1\\.hd","1\\. ?hd"]},warranty:{label:"Garantie",kind:"cond",patterns:["garantie","warranty","premium selection","anschlussgarantie"]},accident:{label:"Dommage / accident d\xE9clar\xE9",kind:"cond",patterns:["unfallschaden","unfallfahrzeug","vorschaden","accident[\xE9e](?!\\s*free)","v[\xE9e]hicule accident","damaged","reparierter? (schaden|unfall)"]},tuned:{label:"Modifi\xE9 / tuning",kind:"cond",patterns:["tuning","chip ?tuning","stage ?[123]","downpipe","remap","akrapovi[c\u010D]","capristo","eisenmann","\\bdinan\\b","\\bjb4\\b","leistungssteigerung","reprogramm","\\bhre\\b","\\bkw suspension","schnitzer","\\bac schnitzer","\\bg-power\\b","manhart"]}},cs={accident:-1,tuned:0,manual:0,tow_bar:0,parking_heater:0,winter_tires:0,individual:0,m_performance_parts:0,competition_package:0,track_package:0,xdrive:0,body_touring:0,body_convertible:0,body_gran_coupe:0};for(let[e,t]of Object.entries(de))t.sign=cs[e]??1;var us={laser:2015,display_key:2020,wireless_charging:2017,carplay:2017,driving_assist_pro:2017,surround_view:2013};for(let[e,t]of Object.entries(us))de[e]&&(de[e].minYear=t);var ln=e=>de[e]?.sign??0,ds=Object.fromEntries(Object.entries(de).map(([e,t])=>[e,t.patterns.map(n=>new RegExp(n,"i"))])),ot=Object.entries(de).filter(([,e])=>e.kind!=="cond").map(([e])=>e),lt=["accident_free","service_history","first_owner","warranty","accident","tuned","nonsmoker","recent_inspection"];function cn(e){if(!e)return[[],[]];let t=e.replace(/_/g," ").replace(/\b(keine|ohne|sans|no|kein)\s+(garantie|warranty|unfall)/gi," "),n=[],a=[];for(let[s,r]of Object.entries(ds))r.some(i=>i.test(t))&&(de[s].kind==="cond"?a:n).push(s);return a.includes("accident_free")&&a.includes("accident")&&(!/unfallschaden|unfallfahrzeug|vorschaden|accident[ée]\b(?! free)/i.test(t)||/unfallfrei/i.test(t))&&a.splice(a.indexOf("accident"),1),[n,a]}function ua(){return Object.entries(de).map(([e,t])=>({key:e,label:t.label,kind:t.kind,min_year:t.minYear??null}))}var ps=/\b(kein(e|en)?|ohne|sans|no|nicht|pas de|senza)\s+(\w+\s+)?(unfall(schaden|fahrzeug)?|schaden|sch[äa]den|defekt(e)?|accident|damage|motorschaden|totalschaden)/gi,ms=new RegExp(["unfall(fahrzeug|wagen|auto)","rund herum defekt","[\xFCu]berschlag","[\xFCu]berschlagen","totalschaden","wirtschaftlicher totalschaden","motor(schaden|defekt)","getriebe(schaden|defekt)","motor (ist )?defekt","(?<![a-z\xE4\xF6\xFC])defekt(e[rsmn]?)?(?![a-z\xE4\xF6\xFC])","besch[\xE4a]digt","bastler","ersatzteil(spender|tr[\xE4a]ger)","schlachtfest","nicht (mehr )?(fahr(bereit|t[\xFCu]chtig)|angemeldet|startf[\xE4a]hig)","reparaturbed[\xFCu]rftig","nicht rollf[\xE4a]hig","export(fahrzeug)?\\b.*(defekt|unfall)","bergungs?fahrzeug","[\xE9e]pave","accident[\xE9e]e?\\b(?!\\s*free)","non roulant","hors service","moteur (hs|cass[\xE9e]|d[\xE9e]fectueux)","pour pi[\xE8e]ces","d[\xE9e]fectueux","endommag[\xE9e]","incidentat[ao]","sinistrat[ao]","motore (rotto|difettoso)","non marciante","wreck(ed)?","salvage","non[- ]?runner","for parts","spares or repair","crash(ed)?\\b","totaled","engine (failure|damage|blown)","blown (engine|motor)"].join("|"),"i");function da(e){if(!e)return!1;let t=e.replace(/_/g," ").replace(ps," ").replace(/unfallfrei|schadenfrei|schadensfrei|schadenfreigabe|accident[- ]?free|sans accident|d[ée]faut de/gi," ");return ms.test(t)}var pa={_comment:"R\xE9f\xE9rentiel des mod\xE8les. Ann\xE9es = ann\xE9e de premi\xE8re immatriculation (approximatif). Pour ajouter une marque ou un mod\xE8le, ajoutez une entr\xE9e sous 'makes' : le reste de l'outil s'adapte.",makes:{BMW:{families:{M2:{patterns:["(?<![a-z0-9])m2(?![a-z0-9])"],generations:[{code:"F87",years:[2016,2021],versions:[{name:"M2",ps:370},{name:"M2 Competition",ps:410},{name:"M2 CS",ps:450}]},{code:"G87",years:[2022,2035],versions:[{name:"M2",ps:460}]}]},M3:{patterns:["(?<![a-z0-9])m3(?![a-z0-9])"],generations:[{code:"E9x",years:[2007,2013],versions:[{name:"M3",ps:420},{name:"M3 GTS",ps:450}]},{code:"F80",years:[2014,2020],versions:[{name:"M3",ps:431},{name:"M3 Competition",ps:450},{name:"M3 CS",ps:460}]},{code:"G80",years:[2021,2035],versions:[{name:"M3",ps:480},{name:"M3 Competition",ps:510}]}]},M4:{patterns:["(?<![a-z0-9])m4(?![a-z0-9])"],generations:[{code:"F82",years:[2014,2020],versions:[{name:"M4",ps:431},{name:"M4 Competition",ps:450},{name:"M4 CS",ps:460},{name:"M4 GTS",ps:500}]},{code:"G82",years:[2021,2035],versions:[{name:"M4",ps:480},{name:"M4 Competition",ps:510},{name:"M4 CS",ps:550},{name:"M4 CSL",ps:550}]}]},M5:{patterns:["(?<![a-z0-9])m5(?![a-z0-9])"],generations:[{code:"E60",years:[2005,2010],versions:[{name:"M5",ps:507}]},{code:"F10",years:[2011,2016],versions:[{name:"M5",ps:560},{name:"M5 Competition",ps:575},{name:"M5 30 Jahre",ps:600}]},{code:"F90",years:[2017,2023],versions:[{name:"M5",ps:600},{name:"M5 Competition",ps:625},{name:"M5 CS",ps:635}]},{code:"G90",years:[2024,2035],versions:[{name:"M5",ps:727}]}]},M6:{patterns:["(?<![a-z0-9])m6(?![a-z0-9])"],generations:[{code:"E6x",years:[2005,2010],versions:[{name:"M6",ps:507}]},{code:"F1x",years:[2012,2019],versions:[{name:"M6",ps:560},{name:"M6 Competition",ps:575}]}]},M8:{patterns:["(?<![a-z0-9])m8(?![a-z0-9])"],generations:[{code:"F9x",years:[2019,2035],versions:[{name:"M8",ps:600},{name:"M8 Competition",ps:625}]}]},"1M":{patterns:["(?<![a-z0-9])1\\s?m\\s?(coup|cabrio)","1er\\s?m\\s?coup","1\\s?series\\s?m\\s?coup"],generations:[{code:"E82",years:[2011,2012],versions:[{name:"1M Coup\xE9",ps:340}]}]},M135i:{patterns:["(?<![a-z0-9])m\\s?135\\s?i?(?![a-z0-9])"],generations:[{code:"F20",years:[2012,2019],versions:[{name:"M135i",ps:320},{name:"M135i (2015+)",ps:326}]},{code:"F40",years:[2019,2035],versions:[{name:"M135i xDrive",ps:306}]}]},M140i:{patterns:["(?<![a-z0-9])m\\s?140\\s?i?(?![a-z0-9])"],generations:[{code:"F20",years:[2016,2019],versions:[{name:"M140i",ps:340}]}]},M240i:{patterns:["(?<![a-z0-9])m\\s?2[34]0\\s?i?(?![a-z0-9])","(?<![a-z0-9])m\\s?235\\s?i?(?![a-z0-9])"],generations:[{code:"F22",years:[2014,2021],versions:[{name:"M235i",ps:326},{name:"M240i",ps:340}]},{code:"G42",years:[2022,2035],versions:[{name:"M240i xDrive",ps:374}]}]},M340i:{patterns:["(?<![a-z0-9])m\\s?340\\s?i(?![a-z0-9])"],generations:[{code:"G20",years:[2019,2035],versions:[{name:"M340i",ps:374},{name:"M340i (LCI)",ps:387}]}]},M440i:{patterns:["(?<![a-z0-9])m\\s?440\\s?i(?![a-z0-9])"],generations:[{code:"G22",years:[2020,2035],versions:[{name:"M440i",ps:374},{name:"M440i (LCI)",ps:387}]}]},M340d:{patterns:["(?<![a-z0-9])m\\s?340\\s?d(?![a-z0-9])"],generations:[{code:"G20",years:[2019,2035],versions:[{name:"M340d",ps:340}]}]},M440d:{patterns:["(?<![a-z0-9])m\\s?440\\s?d(?![a-z0-9])"],generations:[{code:"G22",years:[2020,2035],versions:[{name:"M440d",ps:340}]}]}}}}};var dn=pa.makes,pn=()=>dn,ma=[];for(let[e,t]of Object.entries(dn))for(let[n,a]of Object.entries(t.families))ma.push([e,n,a.patterns.map(s=>new RegExp(s,"i"))]);var gs=(e,t)=>`${e} ${t}`;function un(e,t="BMW"){let n=(e||"").toLowerCase().replace(/ /g," "),a=null;for(let[s,r,i]of ma)s===t&&i.some(o=>o.test(n))&&(a===null||r.length>a.length)&&(a=r);return a}var hs=30,Tt=(e,t)=>Math.min(...e.versions.map(n=>Math.abs(n.ps-t)));function mn(e,t,n,a="BMW",s=""){let r=(e||"").match(/(?<![a-z0-9])m\s?\d{3}\s?[a-z]{0,2}(?![a-z0-9])/gi),i;if(r){if(i=un(r.join(" "),a),!i)return null}else i=un(`${s} ${e}`,a)||un(s,a);if(!i)return null;let o=dn[a].families[i].generations,c=1,m=null;if(t){if(m=o.find(v=>v.years[0]<=t&&t<=v.years[1])??null,!m){let v=o.map(g=>[Math.min(Math.abs(t-g.years[0]),Math.abs(t-g.years[1])),g]).sort((g,E)=>g[0]-E[0]);if(v.length&&v[0][0]<=1)m=v[0][1],c=.7;else return null}}else if(o.length===1)m=o[0],c=.8;else if(n)m=o.reduce((v,g)=>Tt(v,n)<=Tt(g,n)?v:g),c=.5;else return null;if(t&&n){let v=o.filter(g=>g.years[0]-1<=t&&t<=g.years[1]+1);v.length>1&&(m=v.reduce((g,E)=>Tt(g,n)<=Tt(E,n)?g:E),c=Math.min(c,.8))}let u=m.versions,p=u[0].name;if(n){let v=u.reduce((E,M)=>Math.abs(E.ps-n)<=Math.abs(M.ps-n)?E:M),g=Math.abs(v.ps-n);if(p=v.name,g>hs)return null;g>25?c=Math.min(c,.5):g>8&&(c=Math.min(c,.8))}let d=(e||"").toLowerCase(),y=!1;for(let v of u){let g=v.name.includes(" ")?v.name.split(" ").slice(1).join(" ").toLowerCase():"";if(g&&new RegExp(`\\b${g.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`).test(d)){p=v.name,y=!0;break}}return!y&&u.length>1&&!n&&(c=Math.min(c,.6)),{make:a,family:i,generation:m.code,version:p,segment:gs(i,m.code),confidence:Math.round(c*100)/100}}var fa=["Noir","Blanc","Gris","Argent","Bleu","Rouge","Vert","Jaune","Orange","Brun / beige","Violet","Autre"],bs=[["Noir",/(?<![a-zà-ÿ])(schwarz|black|noir|nero|saphir|sapphire|carbon ?schwarz|jet ?black|frozen ?(deep )?black|cosmos|azurit? ?schwarz|oxford)/i],["Blanc",/(?<![a-zà-ÿ])(wei(ss|ß)|white|blanc|bianco|alpin(weiss|weiß| white)?|mineral(wei(ss|ß)| white)|brooklyn white)/i],["Argent",/(?<![a-zà-ÿ])(silber|silver|argent|argento|glacier|rhodonit|rhodonite|arktis|arctic silver)/i],["Gris",/(?<![a-zà-ÿ])(grau|gr[ae]y|gris|grigio|anthrazit|anthracite|brooklyn|dravit|donington|sophisto|skyscraper|bernina|space ?gr|storm ?bay|titan|oxid|thunder ?night|frozen ?(dark )?(gr|silver|brooklyn)|portimao? ?grau|nardo|cashmere|tanzanite? ?grau)/i],["Bleu",/(?<![a-zà-ÿ])(blau|blue|bleu|blu|portim[aã]o|san ?marino|estoril|laguna ?seca|interlagos|tanzanit|yas ?marina|marina ?bay|mauritius|le ?mans|long ?beach|tansanit|dark ?blue|imperial|sparkling)/i],["Rouge",/(?<![a-zà-ÿ])(rot|red|rouge|rosso|imola|toronto|melbourne|fire ?red|sakhir ?rot|barcelona|aventurin|vermilion|burgund|bordeaux)/i],["Vert",/(?<![a-zà-ÿ])(gr[uü]n|green|vert|verde|british ?racing|isle ?of ?man|java ?gr|dunkelgr|oliv|brooklands|ilbi)/i],["Jaune",/(?<![a-zà-ÿ])(gelb|yellow|jaune|giallo|sao ?paulo|austin ?yellow|speed ?yellow|phoenix|dakar ?yellow)/i],["Orange",/(?<![a-zà-ÿ])(orange|sakhir|fire ?orange|valencia|atlantis ?orange)/i],["Brun / beige",/(?<![a-zà-ÿ])(braun|brown|marron|marrone|beige|champagne|havanna|sunset|mocca|kupfer|bronze|sand|tobacco|cognac)/i],["Violet",/(?<![a-zà-ÿ])(violett?|purple|violet|viola|ametrin|techno ?violet|daytona ?violet|lila|amethyst|ultraviolet)/i]],vs=bs.map(([e,t])=>[e,new RegExp(t.source.replace("(?<![a-z\xE0-\xFF])",""),"i")]);function He(e){let t=String(e??"").trim();if(!t||t.length>60)return null;for(let[n,a]of vs)if(a.test(t))return n;return null}var ys=/(?<![a-zà-ÿ])(saphirschwarz|sapphire black|carbonschwarz|carbon black|frozen [a-z ]{3,18}|alpinwei(ss|ß)|alpine white|mineralwei(ss|ß)|brooklyn grau|brooklyn grey|dravit grau|dravit grey|donington grau|sophistograu|skyscraper grau|portim[aã]o blau|san marino blau|estoril blau|laguna seca blau|interlagos blau|tanzanitblau|yas marina|marina bay blau|isle of man gr[uü]n|british racing green|java gr[uü]n|toronto rot|imola rot|melbourne rot|fire red|sakhir orange|sao paulo gelb|austin yellow|speed yellow|daytona violet|techno violett?|ametrin|motegi rot|misano blau|thunder grau|oxidgrau|bernina grau|snapper rock blau|ruby black|aventurin rot|barcelona blau|ocean blue|storm bay|silverstone|champagne quartz|marrakesh braun|havanna|mugello rot|bluestone|frozen)/i,ws=/(?:farbe|lackierung|lack|couleur|peinture|colou?r|paint|exterieur|exterior|außenfarbe|aussenfarbe)\s*[:=\-]?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ \-]{2,30})/i;function fn(e){if(!e)return[null,null];let t=e.match(ws);if(t){let a=He(t[1]);if(a)return[a,t[1].trim()]}let n=e.match(ys);if(n){let a=He(n[0]);if(a)return[a,n[0]]}return[null,null]}function ze(e,t=0){if(!e||typeof e!="object"||t>5)return null;let n=null;for(let[a,s]of Object.entries(e))if(typeof s=="string"&&s.length<60&&/^(body|exterior|outer)?colou?r(original|name|manufacturer)?$/i.test(a)&&!/interior|inner|upholster/i.test(a)){if(/original|manufacturer|name/i.test(a))return s;n=n??s}if(n)return n;for(let a of Object.values(e))if(a&&typeof a=="object"){let s=ze(a,t+1);if(s)return s}return null}var Mt=(e,t)=>Array.from({length:e},()=>new Array(t).fill(0)),Rt=e=>{let t=Mt(e,e);for(let n=0;n<e;n++)t[n][n]=1;return t};function gn(e,t){let n=e.length,a=t.length,s=t[0].length,r=Mt(n,s);for(let i=0;i<n;i++)for(let o=0;o<a;o++){let c=e[i][o];if(c!==0)for(let m=0;m<s;m++)r[i][m]+=c*t[o][m]}return r}function ga(e){let t=e[0].length,n=Mt(t,t);for(let a of e)for(let s=0;s<t;s++){let r=a[s];if(r!==0)for(let i=s;i<t;i++)n[s][i]+=r*a[i]}for(let a=0;a<t;a++)for(let s=0;s<a;s++)n[a][s]=n[s][a];return n}function ha(e,t){let n=e[0].length,a=new Array(n).fill(0);for(let s=0;s<e.length;s++)for(let r=0;r<n;r++)a[r]+=e[s][r]*t[s];return a}function hn(e){let t=e.length,n=e.map((a,s)=>[...a,...Rt(t)[s]]);for(let a=0;a<t;a++){let s=a;for(let i=a+1;i<t;i++)Math.abs(n[i][a])>Math.abs(n[s][a])&&(s=i);if(Math.abs(n[s][a])<1e-12)return null;[n[a],n[s]]=[n[s],n[a]];let r=n[a][a];for(let i=0;i<2*t;i++)n[a][i]/=r;for(let i=0;i<t;i++){if(i===a)continue;let o=n[i][a];if(o!==0)for(let c=0;c<2*t;c++)n[i][c]-=o*n[a][c]}}return n.map(a=>a.slice(t))}function bn(e,t){return e.map(n=>n.reduce((a,s,r)=>a+s*t[r],0))}var Ye=(e,t)=>e.reduce((n,a,s)=>n+a*t[s],0),ba=(e,t)=>Ye(e,bn(t,e));function va(e){let t=e.length;for(let n=1e-12;n<1;n*=100){let a=Mt(t,t),s=!0;for(let r=0;r<t&&s;r++)for(let i=0;i<=r;i++){let o=e[r][i]+(r===i?n:0);for(let c=0;c<i;c++)o-=a[r][c]*a[i][c];if(r===i){if(o<=0){s=!1;break}a[r][i]=Math.sqrt(o)}else a[r][i]=o/a[i][i]}if(s)return a}return Rt(t)}function ya(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let n=t;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function vn(e){let t=Math.max(e(),1e-12),n=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*n)}function wa(e,t){let n=(e.length-1)*(t/100),a=Math.floor(n),s=Math.ceil(n);return e[a]+(e[s]-e[a])*(n-a)}function ue(e){if(!e.length)return NaN;let t=[...e].sort((a,s)=>a-s),n=t.length>>1;return t.length%2?t[n]:(t[n-1]+t[n])/2}var yn=e=>{let t=e.reduce((n,a)=>n+a,0)/e.length;return Math.sqrt(e.reduce((n,a)=>n+(a-t)**2,0)/e.length)};var xa="https://www.autoscout24.ch",xs=["m2","m3","m4","m5","m6","m8","1er-m","m135","m140","m235","m240","m340","m440"];function ks(e){let t=[],n=/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;for(let a=n.exec(e);a;a=n.exec(e))try{t.push(JSON.parse('"'+a[1]+'"'))}catch{}return t.join("")}function Es(e,t){let n=e.indexOf(t);if(n<0)return null;let a=e.indexOf("[",n),s=0,r=!1;for(let i=a;i<e.length;i++){let o=e[i];if(r)o==="\\"?i++:o==='"'&&(r=!1);else if(o==='"')r=!0;else if(o==="["||o==="{")s++;else if((o==="]"||o==="}")&&(s--,s===0))try{return JSON.parse(e.slice(a,i+1))}catch{return null}}return null}var wn={name:"autoscout24_ch",label:"AutoScout24.ch",country:"CH",currency:"CHF",firstPage:0,maxPages:60,baseQueries:()=>xs,split:()=>null,pageUrl(e,t){let n=`${xa}/de/s/mo-${e}/mk-bmw`;return t>0?`${n}?pagination%5Bpage%5D=${t}`:n},parseResults(e){let t=ks(e),n=Es(t,'"content":[{"conditionType"');if(!n)return{items:[],total:null,pages:null};let a=t.match(/"prefetchedListings":\{[^{}]*?"totalElements":(\d+),"totalPages":(\d+)/),s=[];for(let r of n)try{let[i,o]=Ve(r.firstRegistrationDate??r.firstRegistrationYear),c=["BMW",r.model?.name,r.versionFullName].filter(Boolean).join(" "),m=Te({source:"autoscout24_ch",extId:String(r.id),url:`${xa}/de/d/${r.id}`,country:"CH",currency:"CHF",title:c,description:String(r.teaser??""),price:typeof r.price=="number"&&r.price>0?r.price:null,year:i??(typeof r.firstRegistrationYear=="number"?r.firstRegistrationYear:null),month:o,km:typeof r.mileage=="number"?r.mileage:null,powerPs:typeof r.horsePower=="number"&&r.horsePower>0?r.horsePower:r.kiloWatts?Math.round(r.kiloWatts*1.35962):null,gearbox:String(r.transmissionTypeGroup??r.transmissionType??""),publishedAt:r.createdDate??null}),u=ze(r);u&&(m.colorName=u,m.color=He(u)),/manual/i.test(m.gearbox)&&m.extraOptions.push("manual"),r.hadAccident===!0&&m.extraFlags.push("accident"),r.hadAccident===!1&&m.extraFlags.push("accident_free"),r.warranty&&r.warranty.type&&r.warranty.type!=="none"&&m.extraFlags.push("warranty"),r.hasAdditionalSetOfTires===!0&&m.extraOptions.push("winter_tires"),r.seller?.type==="professional"&&m.extraFlags.push("_dealer"),s.push(m)}catch{}return{items:s,total:a?Number(a[1]):null,pages:a?Number(a[2]):null}},parseDetail(e,t){let n=[],a=e.split(/<h2\b/i).slice(1);for(let s of a){let r=Fe("<h2"+s.slice(0,s.search(/<\/h2>/i)+5)).trim();if(/Ausstattung|Modifikation|Fahrzeugbeschreibung|Beschreibung/i.test(r)){let i=s.split(/<h2\b/i)[0];n.push(Fe(i.replace(/^[^>]*>/,"")).slice(0,6e3))}}n.length&&(t.description=[t.description,...n].filter(Boolean).join(`
`).slice(0,12e3))}};function xn(e,t){let n=e.match(t);if(!n)return null;try{return JSON.parse(n[1])}catch{return null}}var ka="https://www.autoscout24.de",Ea=/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,Cs=["m2","m3","m4","m5","m6","m8","1er-m-coupe","135?powerfrom=220","140?powerfrom=240","240?powerfrom=240","340?powerfrom=270","440?powerfrom=270"],$s={135:{name:"M135i",minPs:316},140:{name:"M140i",minPs:330},235:{name:"M235i",minPs:320},240:{name:"M240i",minPs:330},340:{name:"M340i",minPs:365},440:{name:"M440i",minPs:365}};function Ss(e,t,n,a){let s=[e,t,n].filter(Boolean).join(" "),r=$s[String(e).trim()];return r&&a&&a>=r.minPs&&!/(^|[^a-z0-9])m\s?\d{3}/i.test(s)&&(s=`${r.name} ${s}`),s}function Ca(e){let[t,n]=e.split("@");if(!n)return{base:t,lo:null,hi:null};let[a,s]=n.split("-").map(Number);return{base:t,lo:a,hi:s}}var kn={name:"autoscout24_de",label:"AutoScout24.de",country:"DE",currency:"EUR",firstPage:1,maxPages:20,baseQueries:()=>Cs,split(e){let{base:t,lo:n,hi:a}=Ca(e),s=n??2004,r=a??new Date().getUTCFullYear()+1;if(s>=r)return null;let i=Math.floor((s+r)/2);return[`${t}@${s}-${i}`,`${t}@${i+1}-${r}`]},pageUrl(e,t){let{base:n,lo:a,hi:s}=Ca(e),[r,i]=n.split("?"),o=new URLSearchParams(i??"");return o.set("atype","C"),o.set("cy","D"),o.set("sort","age"),o.set("desc","1"),a!=null&&s!=null&&(o.set("fregfrom",String(a)),o.set("fregto",String(s))),o.set("page",String(t)),`${ka}/lst/bmw/${r}?${o.toString()}`},parseResults(e){let n=xn(e,Ea)?.props?.pageProps;if(!n?.listings)return{items:[],total:null,pages:null};let a=[];for(let s of n.listings)try{let r=s.vehicle??{},i=s.vehicleDetails??[],o=_t(i.find(y=>y.iconName==="speedometer")?.data),[c,m]=Ve(s.tracking?.firstRegistration??i.find(y=>y.iconName==="calendar")?.data),u=typeof s.price?.priceRaw=="number"?s.price.priceRaw:null,p=Te({source:"autoscout24_de",extId:String(s.id),url:ka+s.url,country:"DE",currency:"EUR",title:Ss(`${r.model??""}`,r.modelVersionInput??"",r.variant??"",o),description:String(r.subtitle??""),price:u,year:c,month:m,km:St(s.tracking?.mileage??r.mileageInKm),powerPs:o,gearbox:String(r.transmission??"")});/schalt|manuell/i.test(p.gearbox)&&!/automat/i.test(p.gearbox)&&p.extraOptions.push("manual");let d=ze(s);d&&(p.colorName=d,p.color=He(d)),r.isCurrentlyDamaged===!0&&p.extraFlags.push("accident"),s.seller?.type==="Dealer"&&p.extraFlags.push("_dealer"),a.push(p)}catch{}return{items:a,total:n.numberOfResults??null,pages:n.numberOfPages??null}},parseDetail(e,t){let a=xn(e,Ea)?.props?.pageProps?.listingDetails;if(!a)return;let s=[];a.description&&s.push(Fe(String(a.description)));let r=a.vehicle?.equipment;if(r&&typeof r=="object"){let u=[];for(let p of Object.values(r))if(Array.isArray(p))for(let d of p)d?.id&&u.push(String(d.id));u.length&&s.push("Ausstattung: "+u.join(", "))}s.length&&(t.description=[t.description,...s].filter(Boolean).join(`
`).slice(0,12e3)),a.createdTimestampWithOffset&&(t.publishedAt=String(a.createdTimestampWithOffset));let i=a.vehicle??{},o=ze(i)??ze(a);o&&!t.color&&(t.colorName=o,t.color=He(o)),i.hasFullServiceHistory===!0&&t.extraFlags.push("service_history"),i.hadAccident===!1&&t.extraFlags.push("accident_free"),i.hadAccident===!0&&t.extraFlags.push("accident"),i.noOfPreviousOwners===1&&t.extraFlags.push("first_owner"),a.warrantyExists===!0&&t.extraFlags.push("warranty");let c=Number(i.powerInKw),m=Number(i.powerInHp);!t.powerPs&&m>0?t.powerPs=m:!t.powerPs&&c>0&&(t.powerPs=Math.round(c*1.35962))}};var En="https://www.autolina.ch",_s=["m2","m3","m4","m5","m6","m8","1er-m","m135","m140","m235","m240","m340","m440"],Ts=15;function Cn(e){return Fe(e).replace(/\s+/g," ").trim()}var $n={name:"autolina_ch",label:"Autolina.ch",country:"CH",currency:"CHF",firstPage:1,maxPages:20,baseQueries:()=>_s,split:()=>null,pageUrl(e,t){return t>1?`${En}/bmw/${e}/page/${t}`:`${En}/bmw/${e}`},parseResults(e){let t=e.match(/"numberOfItems"\s*:\s*(\d+)/),n=t?Number(t[1]):null,a=[],s=e.split(/class="url-wrapper tr-srp-item/).slice(1);for(let r of s)try{let i=r.match(/href="(\/auto\/[^"]+?\/(\d+))"/);if(!i)continue;let o=r.indexOf("</app-car-row>"),c=o>0?r.slice(0,o):r.slice(0,8e3),m=c.match(/class="make-model[\s\S]*?title="BMW"[\s\S]*?title="([^"]+)"/),u=Cn(c.replace(/<script[\s\S]*?<\/script>/g," ").replace(/^[^>]*>/,"")),p=(()=>{let _=u.match(/CHF\s*(\d{1,3}(?:\s*['’]\s*\d{3})*)/);return _?ca(_[1].replace(/[\s'’]/g,"")):null})(),d=p!=null?u.slice(u.search(/CHF\s*\d/)):u,y=d.match(/CHF\s*\d{1,3}(?:\s*['’]\s*\d{3})*\s+((?:19|20)\d{2})\s/),v=d.match(/(\d{1,3}(?:\s*['’]\s*\d{3})*)\s*km\b/i),g=v?St(v[1].replace(/[\s'’]/g,"")+" km"):null,E=_t(d),M=/Automat/i.test(d)?"Automatik":/Schalt|Hand/i.test(d)?"Manuell":"",H=Te({source:"autolina_ch",extId:i[2],url:En+i[1],country:"CH",currency:"CHF",title:("BMW "+(m?m[1]:"")).trim(),price:p,year:y?Number(y[1]):/Neuwagen/i.test(d)?new Date().getFullYear():null,km:g,powerPs:E,gearbox:M});/manuell/i.test(M)&&H.extraOptions.push("manual"),H.price!=null&&H.year!=null&&a.push(H)}catch{}return{items:a,total:n,pages:n!=null?Math.ceil(n/Ts):null}},parseDetail(e,t){let n=e.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," "),a=Cn(n),s=n.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i),r=s?Cn(s[1]):"",i=a.search(/Optionale Ausstattung/),o="";if(i>=0){let p=a.slice(i+21),d=p.search(/Mehr anzeigen|Serienmässige Ausstattung/),y=new Set;o=(d>=0?p.slice(0,d):p.slice(0,3e3)).split(/\s(?=[A-ZÄÖÜ][\wäöüÄÖÜ\/ ]{1,20}:\s)/).map(v=>v.trim()).filter(v=>v&&!y.has(v)&&y.add(v)).join("; ")}let c=a.match(/Erstzulassung\s+(\d{1,2})\s*\.\s*((?:19|20)\d{2})/);if(c)t.month=Number(c[1]),t.year=Number(c[2]);else{let[p,d]=Ve(a.match(/Erstzulassung\s+([\d. /]+)/)?.[1]);p&&(t.year=p,t.month=d)}/Antrieb\s+Allrad/i.test(a)&&t.extraOptions.push("xdrive");let m=a.match(/\bGarantie\s+(Ja|Nein)\b/);m&&m[1]==="Ja"&&t.extraFlags.push("warranty"),/Der Händler meldet sich/.test(a)&&t.extraFlags.push("_dealer");let u=[r,o?"Ausstattung: "+o:""].filter(Boolean);u.length&&(t.description=[t.description,...u].filter(Boolean).join(`
`).slice(0,12e3))}};var Me={[kn.name]:kn,[wn.name]:wn,[$n.name]:$n},$a=Object.keys(Me);var ke={running:!1,current:""};async function Ms(e,t){return(await e`
    INSERT INTO locks(name, until) VALUES ('collect', now() + make_interval(secs => ${t/1e3}::float8))
    ON CONFLICT (name) DO UPDATE SET until = EXCLUDED.until WHERE locks.until < now()
    RETURNING name`).length>0}var Rs=e=>e`UPDATE locks SET until = now() - interval '1 second' WHERE name = 'collect'`,Ma=e=>e`INSERT INTO locks(name, until) VALUES ('stop', now() + interval '30 minutes') ON CONFLICT (name) DO UPDATE SET until = EXCLUDED.until`,Sa=e=>e`UPDATE locks SET until = now() - interval '1 second' WHERE name = 'stop'`;async function _a(e){return(await e`SELECT 1 FROM locks WHERE name = 'stop' AND until > now()`).length>0}async function Sn(e){let t=await e`SELECT id, title, description, options, flags, color, year, power_ps, make, segment, version, model_conf FROM listings`,n=0;for(let a of t){let[s,r]=cn(`${a.title}
${a.description??""}`),i=Array.isArray(a.options)?a.options:[],o=Array.isArray(a.flags)?a.flags:[],c=ct([...i,...s]),m=ct([...o,...r.filter(y=>!y.startsWith("_"))]),[u,p]=a.color?[null,null]:fn(`${a.title}
${a.description??""}`);(c.length!==i.length||m.length!==o.length||u)&&(await e`UPDATE listings SET options = ${JSON.stringify(c)}::text::jsonb, flags = ${JSON.stringify(m)}::text::jsonb,
                color = COALESCE(color, ${u}), color_name = COALESCE(color_name, ${p}) WHERE id = ${a.id}`,n++);let d=mn(a.title,a.year,a.power_ps,a.make??"BMW");d?(d.segment!==a.segment||d.version!==a.version)&&(await e`UPDATE listings SET family = ${d.family}, generation = ${d.generation}, version = ${d.version}, segment = ${d.segment}, model_conf = ${d.confidence} WHERE id = ${a.id}`,n++):a.segment!==null&&(await e`UPDATE listings SET family = NULL, generation = NULL, version = NULL, segment = NULL, model_conf = NULL WHERE id = ${a.id}`,n++)}return n&&await _n(e),n}async function ut(e){return(await e`SELECT 1 FROM locks WHERE name = 'collect' AND until > now()`).length>0}async function As(e,t){let n=await e`SELECT chf_eur FROM fx_rates WHERE day = CURRENT_DATE`;if(n.length)return n[0].chf_eur;let a=null,s="BCE";try{let o=(await(await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",{signal:AbortSignal.timeout(15e3)})).text()).match(/currency='CHF'\s+rate='([\d.]+)'/);o&&(a=1/Number(o[1]))}catch{}if(a==null){let i=await e`SELECT chf_eur FROM fx_rates ORDER BY day DESC LIMIT 1`;a=i.length?i[0].chf_eur:t,s=i.length?"dernier connu":"repli (r\xE9glage)"}let r=a;return await e`INSERT INTO fx_rates(day, chf_eur, origin) VALUES (CURRENT_DATE, ${r}, ${s}) ON CONFLICT (day) DO UPDATE SET chf_eur = EXCLUDED.chf_eur, origin = EXCLUDED.origin`,r}var Ls=(e,t,n)=>e==null?null:t==="EUR"?e:e*n,ct=e=>[...new Set(e)];function Ra(e){let t=mn(e.title,e.year,e.powerPs,e.make),[n,a]=cn(`${e.title}
${e.description}`),s=ct([...n,...e.extraOptions]),r=ct([...a,...e.extraFlags]).filter(c=>!c.startsWith("_"));e.extraFlags.includes("accident_free")&&!e.extraFlags.includes("accident")&&(r=r.filter(c=>c!=="accident")),e.extraFlags.includes("accident")&&!e.extraFlags.includes("accident_free")&&(r=r.filter(c=>c!=="accident_free"));let i=e.color,o=e.colorName;return i||([i,o]=fn(`${e.title}
${e.description}`)),{res:t,options:s,flags:r,color:i,colorName:o}}var At=()=>({pages:0,seen:0,newCount:0,details:0,skipped:0});async function Os(e,t,n,a){a.seen++;let s=Ra(t);if(!s.res||t.price==null){a.skipped++;return}let r=Ls(t.price,t.currency,n),i=await e`SELECT id, price FROM listings WHERE source = ${t.source} AND ext_id = ${t.extId}`;if(i.length){let m=Math.abs(i[0].price-t.price)>.5;await e`UPDATE listings SET last_seen = now(), active = true, removed_at = NULL, missed_scans = 0, price = ${t.price}, price_eur = ${r},
              color = COALESCE(color, ${s.color}), color_name = COALESCE(color_name, ${s.colorName}),
              km = COALESCE(${t.km}, km), url = ${t.url}, published_at = COALESCE(published_at, ${t.publishedAt}) WHERE id = ${i[0].id}`,m&&await e`INSERT INTO price_history(listing_id, price, price_eur) VALUES (${i[0].id}, ${t.price}, ${r})`;return}let o=s.res,c=await e`
    INSERT INTO listings(source, ext_id, url, country, currency, title, description, price, price_eur, year, month, km, power_ps, make,
      family, generation, version, segment, model_conf, options, flags, published_at, has_detail, color, color_name)
    VALUES (${t.source}, ${t.extId}, ${t.url}, ${t.country}, ${t.currency}, ${t.title}, ${t.description}, ${t.price}, ${r}, ${t.year}, ${t.month},
      ${t.km}, ${t.powerPs}, ${t.make}, ${o.family}, ${o.generation}, ${o.version}, ${o.segment}, ${o.confidence},
      ${JSON.stringify(s.options)}::text::jsonb, ${JSON.stringify(s.flags)}::text::jsonb, ${t.publishedAt}, false, ${s.color}, ${s.colorName})
    ON CONFLICT (source, ext_id) DO NOTHING RETURNING id`;c.length&&(a.newCount++,await e`INSERT INTO price_history(listing_id, price, price_eur) VALUES (${c[0].id}, ${t.price}, ${r})`)}async function Re(e,t,n,a={}){await e`
    INSERT INTO runs(day, source, status, pages, seen, new_count, details, skipped, error)
    VALUES (CURRENT_DATE, ${t}, ${a.status??"running"}, ${n.pages}, ${n.seen}, ${n.newCount}, ${n.details}, ${n.skipped}, ${a.error??null})
    ON CONFLICT (day, source) DO UPDATE SET pages = runs.pages + ${n.pages}, seen = runs.seen + ${n.seen},
      new_count = runs.new_count + ${n.newCount}, details = runs.details + ${n.details}, skipped = runs.skipped + ${n.skipped},
      status = CASE WHEN ${a.status??null}::text IS NULL THEN runs.status ELSE ${a.status??null} END,
      error = CASE WHEN ${a.error??null}::text IS NULL THEN runs.error ELSE ${a.error??null} END`}var Ns=8,Ps=6.5*864e5,Ds=30*6e4;async function Fs(e,t,n,a,s,r){let i=At(),o=t.pageUrl(r.qkey,r.page);ke.current=`${t.label} \xB7 ${r.qkey} \xB7 page ${r.page}`;let c=await n.get(o),m=t.parseResults(c);if(i.pages++,!m.items.length)return await e`UPDATE crawl_queue SET status = 'done', note = ${r.page===t.firstPage?"aucune annonce reconnue":"fin"}, updated_at = now() WHERE id = ${r.id}`,r.page===t.firstPage?await Re(e,t.name,i,{error:`Aucune annonce reconnue sur \xAB ${r.qkey} \xBB : la structure de la page a peut-\xEAtre chang\xE9.`}):await Re(e,t.name,i),i;for(let v of m.items)await Os(e,v,a,i);if(s==="quick")return i.newCount>0&&r.page-t.firstPage+1<Ns&&await e`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${t.name}, ${r.qkey}, ${r.page+1}) ON CONFLICT DO NOTHING`,await e`UPDATE crawl_queue SET status = 'done', note = ${i.newCount>0?null:"rien de nouveau"}, updated_at = now() WHERE id = ${r.id}`,await Re(e,t.name,i),i;let u=m.items.length,p=t.maxPages*(m.pages&&m.total?Math.ceil(m.total/m.pages):u),d=null;if(r.page===t.firstPage&&m.total!=null&&m.total>p*.95){let v=t.split(r.qkey);if(v){for(let g of v)await e`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${t.name}, ${g}, ${t.firstPage}) ON CONFLICT DO NOTHING`;return await e`UPDATE crawl_queue SET status = 'done', note = 'découpée', updated_at = now() WHERE id = ${r.id}`,await Re(e,t.name,i),i}d="plafonn\xE9e"}let y=Math.min(m.pages??(m.total?Math.ceil(m.total/u):1),t.maxPages);return r.page-t.firstPage+1<y?await e`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${t.name}, ${r.qkey}, ${r.page+1}) ON CONFLICT DO NOTHING`:m.pages&&m.pages>t.maxPages&&(d="plafonn\xE9e"),await e`UPDATE crawl_queue SET status = 'done', note = ${d}, updated_at = now() WHERE id = ${r.id}`,await Re(e,t.name,i),i}async function Hs(e,t,n,a){let s=await e`
    SELECT id, url, title, description, year, month, km, power_ps, price, currency, country, ext_id, published_at, flags
    FROM listings WHERE source = ${t.name} AND active AND NOT has_detail AND segment IS NOT NULL
    ORDER BY first_seen DESC LIMIT 1`;if(!s.length)return!1;let r=s[0];ke.current=`${t.label} \xB7 annonce ${r.ext_id}`;let i=At();try{let o=await n.get(r.url),c=Te({source:t.name,extId:r.ext_id,url:r.url,country:r.country,currency:r.currency,title:r.title,description:r.description??"",price:r.price,year:r.year,month:r.month,km:r.km,powerPs:r.power_ps});c.publishedAt=r.published_at?new Date(r.published_at).toISOString():null,t.parseDetail(o,c);let m=Ra(c),u=r.flags??[],p=ct([...m.flags,...u.filter(d=>d==="accident"||d==="accident_free")]);await e`UPDATE listings SET description = ${c.description}, options = ${JSON.stringify(m.options)}::text::jsonb, flags = ${JSON.stringify(p)}::text::jsonb,
              published_at = COALESCE(${c.publishedAt}, published_at), power_ps = COALESCE(${c.powerPs}, power_ps),
              color = COALESCE(${m.color}, color), color_name = COALESCE(${m.colorName}, color_name), has_detail = true WHERE id = ${r.id}`,m.res?await e`UPDATE listings SET family = ${m.res.family}, generation = ${m.res.generation}, version = ${m.res.version},
                segment = ${m.res.segment}, model_conf = ${m.res.confidence} WHERE id = ${r.id}`:await e`UPDATE listings SET family = NULL, generation = NULL, version = NULL, segment = NULL, model_conf = NULL WHERE id = ${r.id}`,i.details++}catch(o){if(o instanceof _e)throw o;o instanceof qe?await e`UPDATE listings SET has_detail = true WHERE id = ${r.id}`:o instanceof De&&/HTTP (404|410)/.test(o.message)?await e`UPDATE listings SET has_detail = true, active = false, removed_at = now() WHERE id = ${r.id}`:await e`UPDATE listings SET has_detail = true WHERE id = ${r.id}`}return await Re(e,t.name,i),!0}async function Ta(e,t,n){let a=await e`SELECT pass_mode, pass_started_at, pass_done_at FROM source_state WHERE source = ${t.name}`;if(!a.length||a[0].pass_done_at||!a[0].pass_started_at)return;let s=await e`
    SELECT count(*) FILTER (WHERE status = 'pending') AS pending, count(*) FILTER (WHERE status = 'error') AS errors,
           count(*) FILTER (WHERE note = 'plafonnée') AS capped, count(*) AS total
    FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${t.name}`;if(!s[0].total||s[0].pending>0)return;let r=a[0].pass_mode??"full",i=a[0].pass_started_at,o=(await e`SELECT count(*)::int AS n FROM listings WHERE source = ${t.name} AND last_seen >= ${i}`)[0].n,c=0,m=s[0].errors>0||s[0].capped>0?"partial":"ok",u=null,p=!1;r==="full"&&(s[0].capped>0&&(u="Certaines recherches d\xE9passent le plafond de pages de la plateforme : retraits non \xE9valu\xE9s pour ce balayage."),o===0?(m="empty",u="Aucune annonce reconnue : la structure des pages a peut-\xEAtre chang\xE9."):s[0].errors===0&&s[0].capped===0&&(p=!0,await e`UPDATE listings SET missed_scans = missed_scans + 1 WHERE source = ${t.name} AND active AND last_seen < ${i}`,c=(await e`UPDATE listings SET active = false, removed_at = last_seen WHERE source = ${t.name} AND active AND missed_scans >= 2 RETURNING id`).length)),await e`UPDATE runs SET removed = removed + ${c}, finished_at = now(), status = ${m}, error = COALESCE(${u}, error) WHERE day = CURRENT_DATE AND source = ${t.name}`,await e`UPDATE source_state SET pass_done_at = now(), finalized_day = CURRENT_DATE, last_status = ${m}, updated_at = now(),
            last_full_at = CASE WHEN ${p} THEN now() ELSE last_full_at END WHERE source = ${t.name}`,await _n(e)}async function _n(e){let t=await e`SELECT segment, country, price_eur FROM listings WHERE active AND segment IS NOT NULL AND price_eur > 0`,n=new Map;for(let a of t)for(let s of[a.country,"ALL"]){let r=`${a.segment}\0${s}`;(n.get(r)??n.set(r,[]).get(r)).push(a.price_eur)}for(let[a,s]of n){let[r,i]=a.split("\0");await e`INSERT INTO segment_stats(day, segment, country, n, median_eur) VALUES (CURRENT_DATE, ${r}, ${i}, ${s.length}, ${ue(s)})
              ON CONFLICT (day, segment, country) DO UPDATE SET n = EXCLUDED.n, median_eur = EXCLUDED.median_eur`}}async function Tn(e,t,n,a){if(!await Ms(e,n+9e4))return{skipped:"un passage est d\xE9j\xE0 en cours",sources:{}};let s=Date.now()+n,r={sources:{}};ke.running=!0,await Sa(e);try{await Sn(e);let i=await As(e,t.fxFallback);r.fx=i;let o=new $t({delayS:t.delayS,respectRobots:t.respectRobots}),c=(a?.length?a:t.sources).filter(m=>Me[m]);await Promise.all(c.map(async m=>{let u=Me[m];try{r.sources[m]=await zs(e,u,o,i,t,s)}catch(p){r.sources[m]=`erreur : ${p.message}`,await Re(e,m,At(),{status:"error",error:`Erreur inattendue : ${p.message}`})}}))}finally{ke.running=!1,ke.current="",await Sa(e),await Rs(e)}return r}async function zs(e,t,n,a,s,r){let i=await e`SELECT blocked_until FROM source_state WHERE source = ${t.name} AND blocked_until > now()`;if(i.length)return`bloqu\xE9e jusqu'\xE0 ${new Date(i[0].blocked_until).toISOString()}`;let c=(await e`SELECT last_full_at, pass_mode, pass_started_at, pass_done_at FROM source_state WHERE source = ${t.name}`)[0]??null,m=(await e`SELECT count(*)::int AS total, count(*) FILTER (WHERE status = 'pending')::int AS pending FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${t.name}`)[0],u=c?.pass_done_at?new Date(c.pass_done_at).getTime():null,p=c?.pass_mode??"full";if(!m.total||m.pending===0&&u!=null&&Date.now()-u>Ds){let y=c?.last_full_at?new Date(c.last_full_at).getTime():0;p=Date.now()-y>=Ps?"full":"quick",await e`DELETE FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${t.name}`;for(let v of t.baseQueries())await e`INSERT INTO crawl_queue(day, source, qkey, page) VALUES (CURRENT_DATE, ${t.name}, ${v}, ${t.firstPage}) ON CONFLICT DO NOTHING`;await e`INSERT INTO runs(day, source, status) VALUES (CURRENT_DATE, ${t.name}, 'running') ON CONFLICT (day, source) DO UPDATE SET status = 'running', finished_at = NULL`,await e`INSERT INTO source_state(source, pass_mode, pass_started_at, pass_done_at, updated_at) VALUES (${t.name}, ${p}, now(), NULL, now())
              ON CONFLICT (source) DO UPDATE SET pass_mode = ${p}, pass_started_at = now(), pass_done_at = NULL, updated_at = now()`}else c&&!c.pass_mode&&await e`UPDATE source_state SET pass_mode = 'full', pass_started_at = COALESCE(pass_started_at, (SELECT started_at FROM runs WHERE day = CURRENT_DATE AND source = ${t.name})) WHERE source = ${t.name}`;let d=0;try{for(;Date.now()<r-25e3&&!await _a(e);){let y=await e`SELECT id, qkey, page FROM crawl_queue WHERE day = CURRENT_DATE AND source = ${t.name} AND status = 'pending' ORDER BY id LIMIT 1`;if(y.length){try{await Fs(e,t,n,a,p,{id:y[0].id,qkey:y[0].qkey,page:y[0].page}),d++}catch(g){if(g instanceof _e)throw g;g instanceof qe?await e`UPDATE crawl_queue SET status = 'skipped', note = 'robots.txt', updated_at = now() WHERE id = ${y[0].id}`:await e`UPDATE crawl_queue SET attempts = attempts + 1, status = CASE WHEN attempts + 1 >= 3 THEN 'error' ELSE 'pending' END, note = ${String(g.message).slice(0,200)}, updated_at = now() WHERE id = ${y[0].id}`}continue}if(await Ta(e,t,s),((await e`SELECT details FROM runs WHERE day = CURRENT_DATE AND source = ${t.name}`)[0]?.details??0)>=s.maxDetailsPerDay||!await Hs(e,t,n,a))break;d++}}catch(y){if(y instanceof _e)return await e`INSERT INTO source_state(source, blocked_until, last_status, last_error, updated_at) VALUES (${t.name}, now() + interval '6 hours', 'blocked', ${y.message}, now())
                ON CONFLICT (source) DO UPDATE SET blocked_until = now() + interval '6 hours', last_status = 'blocked', last_error = ${y.message}, updated_at = now()`,await Re(e,t.name,At(),{status:"blocked",error:`Acc\xE8s refus\xE9 par la plateforme (${y.message}). Collecte suspendue 6 h, rien n'est contourn\xE9.`}),"bloqu\xE9e";throw y}return await Ta(e,t,s),await _a(e)?`arr\xEAt\xE9e (${d} \xE9tapes)`:`${d} \xE9tapes`}var Us=.5,Is=30,Aa=1.2816,js=.25,Ke={minSegmentN:15,minProjectionN:30,marketVol:.05,fxFallback:1.07};function Bs(e=new Date){return e.getUTCFullYear()+e.getUTCMonth()/12+(e.getUTCDate()-1)/365}function Mn(e,t){return e?Math.max(0,Bs()-(e+((t||6)-1)/12)):null}var Gs=(e,t)=>!e||!t?0:(t.getTime()-e.getTime())/(864e5*30.44),he=(e,t)=>e.cols.indexOf(t);function Ot(e,t,n){return t.map(a=>{if(a==="const")return 1;if(a==="age")return e.age||0;if(a==="km")return(e.km||0)/1e4;if(a==="ch")return e.ch;if(a==="t")return Gs(n,e._t??e.firstSeen??null);let[s,r]=[a.slice(0,a.indexOf(":")),a.slice(a.indexOf(":")+1)];return s==="ver"?e.version===r?1:0:s==="gen"?e.generation===r?1:0:s==="opt"?e.opts.has(r)?1:0:s==="cond"&&e.conds.has(r)?1:0})}function Lt(e,t){let n=e.length;if(n<8)return null;let a=t.minSupport??5,s=t.useOptions??!0,r=e.map(w=>w.age),i=e.map(w=>w.km),o=["const","age","km"];yn(r)<.3&&(o=o.filter(w=>w!=="age")),yn(i)<500&&(o=o.filter(w=>w!=="km"));let c=e.reduce((w,b)=>w+b.ch,0);if(c>=3&&c<=n-3&&o.push("ch"),t.withGeneration){let w=new Map;for(let L of e)w.set(L.generation,(w.get(L.generation)??0)+1);let b=[...w.entries()].sort((L,R)=>R[1]-L[1])[0][0];for(let[L,R]of[...w.entries()].sort())L!==b&&R>=3&&o.push(`gen:${L}`)}let m=new Map;for(let w of e)m.set(w.version,(m.get(w.version)??0)+1);let u=[...m.entries()].sort((w,b)=>b[1]-w[1])[0][0];for(let[w,b]of m)w!==u&&b>=3&&o.push(`ver:${w}`);let p=new Map,d=[];if(s)for(let[w,b]of[["opt",ot],["cond",lt]])for(let L of b){let R=e.reduce((O,j)=>O+((w==="opt"?j.opts:j.conds).has(L)?1:0),0);p.set(`${w}:${L}`,[R,n-R]),R>=a&&n-R>=a&&d.push([Math.min(R,n-R),`${w}:${L}`])}let y=Math.max(0,Math.floor(n/3)-o.length-1);d.sort((w,b)=>b[0]-w[0]),o.push(...d.slice(0,y).map(w=>w[1]));let v=e.map(w=>w.firstSeen).filter(w=>!!w),g=v.length?new Date(Math.min(...v.map(w=>w.getTime()))):null;v.length&&(Math.max(...v.map(w=>w.getTime()))-Math.min(...v.map(w=>w.getTime())))/864e5>=180&&o.push("t");let E=e.map(w=>Math.log(w.priceEur)),M=E.reduce((w,b)=>w+b,0)/n,H=E.reduce((w,b)=>w+(b-M)**2,0)||1,_=new Map,I=w=>{let b=e.map(P=>Ot(P,w,g)),L=w.length,R=new Array(L).fill(Us);R[0]=0;let O=new Array(L).fill(0);if(t.kmPrior!=null&&w.includes("km")){let P=w.indexOf("km");R[P]=Is,O[P]=t.kmPrior}let j=ga(b),ee=j.map((P,F)=>P.map((Y,ne)=>Y+(F===ne?R[F]:0))),V=hn(ee);V||(V=hn(ee.map((P,F)=>P.map((Y,ne)=>Y+(F===ne?1e-6:0))))??Rt(L));let h=ha(b,E).map((P,F)=>P+R[F]*O[F]),S=bn(V,h),K=E.map((P,F)=>P-Ye(b[F],S)).reduce((P,F)=>P+F*F,0),X=Math.max(1,n-L),A=Math.sqrt(K/X),U=gn(gn(V,j),V).map(P=>P.map(F=>F*A*A));return{beta:S,cov:U,sigma:A,r2:1-K/H}},T=I(o);for(let w=0;w<4;w++){let b=[];if(o.forEach((L,R)=>{if(!L.startsWith("opt:")&&!L.startsWith("cond:"))return;let O=L.slice(L.indexOf(":")+1),j=T.beta[R],ee=ln(O);ee!==0&&j*ee<-.004?b.push([L,"sign"]):Math.abs(Math.exp(j)-1)>js&&b.push([L,"implausible"])}),!b.length)break;for(let[L,R]of b)_.set(L,R);o=o.filter(L=>!_.has(L)),T=I(o)}let{beta:x,cov:N,sigma:D,r2:te}=T;return{cols:o,beta:x,cov:N,sigma:D,n,r2:te,t0:g,refVersion:u,ageMax:Math.max(...r),kmMax:Math.max(...i),support:p,dropped:_}}var Ae=e=>Math.round(e*10)/10,Ue=e=>Ae((Math.exp(e)-1)*100),Nt=class{constructor(t=Ke){this.s=t;this.fx=t.fxFallback}rows=[];fx;discount=null;seg=new Map;fam=new Map;dom=[];load(t,n,a,s){this.rows=t,this.fx=n??this.s.fxFallback,this.discount=a,this.dom=s,this.seg.clear(),this.fam.clear()}segmentRows=t=>this.rows.filter(n=>n.segment===t&&!n.damaged);familyRows=t=>this.rows.filter(n=>n.family===t&&!n.damaged);segFit(t){if(!this.seg.has(t)){let n=this.segmentRows(t);if(n.length>=this.s.minSegmentN){let a=this.famFit(n[0].family),s=null;a&&he(a,"km")>=0&&(s=Math.min(a.beta[he(a,"km")],0)),this.seg.set(t,Lt(n,{withGeneration:!1,kmPrior:s}))}else this.seg.set(t,null)}return this.seg.get(t)??null}famFit(t){if(!this.fam.has(t)){let n=this.familyRows(t);this.fam.set(t,n.length>=this.s.minSegmentN?Lt(n,{withGeneration:!0}):null)}return this.fam.get(t)??null}money(t,n,a){let s=this.fx;return{eur:Math.round(t),low_eur:Math.round(n),high_eur:Math.round(a),chf:Math.round(t/s),low_chf:Math.round(n/s),high_chf:Math.round(a/s)}}estimate(t){let n=t.family,a=t.generation,s=`${n} ${a}`,r=(t.market||"DE").toUpperCase(),i=Mn(Number(t.year),t.month??null)??0,o=Number(t.km),c={age:i,km:o,ch:r==="CH"?1:0,version:t.version||"",generation:a,opts:new Set(t.options??[]),conds:new Set(t.flags??[]),_t:new Date},m=this.segmentRows(s).length,u=null,p=this.segFit(s);p?u="regression_segment":(p=this.famFit(n),p&&(u="regression_famille"));let d={segment:s,market:r,fx:this.fx,age:Ae(i),n_segment:m,n_famille:this.familyRows(n).length};if(!p)return this.byComparables(s,c,d);let y=Ot(c,p.cols,p.t0),v=Ye(y,p.beta),g=ba(y,p.cov),E=[];if(u==="regression_segment"){let D=this.famFit(n);if(D)for(let[te,w]of[["opt",c.opts],["cond",c.conds]])for(let b of w){let L=`${te}:${b}`;if(he(p,L)<0&&he(D,L)>=0){let R=he(D,L);v+=D.beta[R],g+=D.cov[R][R],E.push([b,D.beta[R],D.cov[R][R]])}}}let M=Math.sqrt(p.sigma**2+g),H=Math.exp(v),_=Math.exp(v-Aa*M),I=Math.exp(v+Aa*M),T=p.n,x=T>=60&&p.sigma<.1?"\xE9lev\xE9e":T>=25&&p.sigma<.16?"moyenne":"faible",N=i>p.ageMax+1||o/1e4>p.kmMax/1e4*1.2;if(N&&(x="faible"),Object.assign(d,{method:u,n:T,sigma_pct:Ae(p.sigma*100),r2:Math.round(p.r2*100)/100,confidence:x,extrapolation:N,value:this.money(H,_,I),adjustments:[...this.adjustments(p,c),...E.map(([D,te,w])=>({label:de[D].label+" (effet estim\xE9 sur toute la famille)",pct:Ue(te),significatif:Math.abs(te/Math.sqrt(Math.max(w,1e-12)))>=2}))],comparables:this.comparables(s,c)}),this.discount){let D=this.discount.medianPct/100;d.transaction={eur:Math.round(H*(1+D)),chf:Math.round(H*(1+D)/this.fx),discount_pct:Ae(this.discount.medianPct),n:this.discount.n}}else d.transaction=null;return d.projection=this.projection(p,c,t,T,v),d}adjustments(t,n){let a=[],s=he(t,"age"),r=he(t,"km"),i=he(t,"ch");s>=0&&a.push({label:"Par ann\xE9e d'\xE2ge suppl\xE9mentaire",pct:Ue(t.beta[s])}),r>=0&&a.push({label:"Par tranche de 10 000 km",pct:Ue(t.beta[r])}),i>=0&&a.push({label:"March\xE9 suisse vs allemand (\xE0 \xE9quipement \xE9gal)",pct:Ue(t.beta[i])});for(let[o,c]of[["opt",n.opts],["cond",n.conds]])for(let m of c){let u=he(t,`${o}:${m}`);if(u>=0){let p=Math.sqrt(Math.max(t.cov[u][u],1e-12));a.push({label:de[m].label,pct:Ue(t.beta[u]),significatif:Math.abs(t.beta[u]/p)>=2})}else t.dropped.has(`${o}:${m}`)&&a.push({label:de[m].label,pct:null,significatif:!1,note:"effet non mesurable de fa\xE7on fiable : non compt\xE9 dans la cote"})}return a}comparables(t,n,a=6){let s=r=>Math.abs((r.age||0)-n.age)/2+Math.abs((r.km||0)-n.km)/3e4+(r.version===n.version?0:.5);return[...this.segmentRows(t)].sort((r,i)=>s(r)-s(i)).slice(0,a).map(r=>({id:r.id,url:r.url,title:r.title,year:r.year,km:r.km,country:r.country,price:r.price,currency:r.currency,price_eur:Math.round(r.priceEur),version:r.version}))}byComparables(t,n,a){let s=this.segmentRows(t);if(s.length<3)return Object.assign(a,{method:"insuffisant",confidence:"aucune",n:s.length,message:"Pas assez d'annonces dans ce segment pour estimer une cote."});let r=s.filter(u=>Math.abs((u.age||0)-n.age)<=1.5&&Math.abs((u.km||0)-n.km)<=4e4);r.length||(r=s);let i=r.map(u=>u.priceEur).sort((u,p)=>u-p),o=ue(i),c=i[Math.max(0,Math.floor(i.length*.1))],m=i[Math.min(i.length-1,Math.floor(i.length*.9))];return Object.assign(a,{method:"comparables",n:r.length,confidence:"faible",value:this.money(o,c,m),adjustments:[],projection:null,transaction:null,comparables:this.comparables(t,n),message:"Segment peu fourni : m\xE9diane des annonces proches, sans ajustement par option."})}projection(t,n,a,s,r){if(s<this.s.minProjectionN)return{available:!1,reason:`Moins de ${this.s.minProjectionN} annonces comparables : projection d\xE9sactiv\xE9e plut\xF4t qu'invent\xE9e.`};let i=a.km_per_year||(n.age>=1?n.km/n.age:1e4);i=Math.min(Math.max(Number(i),3e3),3e4);let o=ya(12345),c=t.cols.length,m=t.cov.map((E,M)=>E.map((H,_)=>H+(M===_?1e-12:0))),u=va(m),p=600,d=this.s.marketVol,y=[];for(let E=0;E<p;E++){let M=Array.from({length:c},()=>vn(o));y.push(t.beta.map((H,_)=>H+u[_].reduce((I,T,x)=>I+T*M[x],0)))}let v=he(t,"t"),g={available:!0,km_per_year:Math.round(i),points:[],market_trend_included:v>=0,vol_hypothesis:d};for(let E of[12,24,36]){let M={...n,age:n.age+E/12,km:n.km+i*E/12,_t:new Date},H=Ot(M,t.cols,t.t0);v>=0&&(H[v]+=Math.min(E,12));let _=d*Math.sqrt(E/12),I=y.map(D=>Math.exp(Ye(D,H)+vn(o)*_)).sort((D,te)=>D-te),[T,x,N]=[10,50,90].map(D=>wa(I,D));g.points.push({months:E,central_eur:Math.round(x),low_eur:Math.round(T),high_eur:Math.round(N),central_chf:Math.round(x/this.fx),low_chf:Math.round(T/this.fx),high_chf:Math.round(N/this.fx),change_pct:Ae((x/Math.exp(r)-1)*100)})}return g.warning="Extrapolation \xE0 partir de v\xE9hicules plus \xE2g\xE9s observ\xE9s aujourd'hui, pas une pr\xE9vision. La tendance de march\xE9 n'est prise en compte qu'apr\xE8s plusieurs semaines de collecte.",g}scoreListings(t){let n=new Map,a=new Date;for(let s of t){let r=this.segFit(s.segment)??this.famFit(s.family);if(!r)continue;let i=Math.exp(Ye(Ot({...s,_t:a},r.cols,r.t0),r.beta));n.set(s.id,{expected_eur:Math.round(i),gap_pct:Ae((s.priceEur/i-1)*100)})}return n}daysOnMarket(t){let n=this.dom.filter(s=>s.family===t),a={};for(let s of[...ot,...lt]){let r=n.filter(o=>o.keys.has(s)).map(o=>o.days),i=n.filter(o=>!o.keys.has(s)).map(o=>o.days);r.length>=12&&i.length>=12&&(a[s]={with:Math.trunc(ue(r)),without:Math.trunc(ue(i))})}return a}compat(t,n,a){let s=this.segmentRows(`${t} ${n}`),r=this.familyRows(t),i=[];for(let o of ot){let c=de[o].minYear;if(c&&a!=null&&a<c)continue;let m=s.reduce((p,d)=>p+(d.opts.has(o)?1:0),0),u=r.reduce((p,d)=>p+(d.opts.has(o)?1:0),0);(m>=3||s.length<40&&u>=6)&&i.push(o)}return{options:i,conds:[...lt]}}optionsRanking(t,n){let a=n?`${t} ${n}`:"",s=n?this.segmentRows(a):this.familyRows(t),r=n?a:t,i={family:t,generation:n??null,n:s.length,items:[],note:""},o=n?this.segFit(a)??this.famFit(t):this.famFit(t);if(!o)return i.note=`Pas assez d'annonces pour ${r} (minimum ${this.s.minSegmentN}).`,i;let c=s.filter(v=>v.country==="CH"),m=s.filter(v=>v.country!=="CH"),u=c.length>=40?Lt(c,{withGeneration:!n,minSupport:5}):null,p=m.length>=40&&c.length>=40?Lt(m,{withGeneration:!n,minSupport:5}):null,d=this.daysOnMarket(t);for(let[v,g]of[...ot.map(E=>["opt",E]),...lt.map(E=>["cond",E])]){let[E,M]=o.support.get(`${v}:${g}`)??[0,0];if(E===0)continue;let H=de[g],_={key:g,label:H.label,kind:H.kind==="cond"?"etat":H.kind==="body"?"carrosserie":"option",n_with:E,n_without:M},I=he(o,`${v}:${g}`);if(I<0){let ee=o.dropped.get(`${v}:${g}`);ee==="sign"?(_.verdict="non_mesurable",_.detail="L'\xE9cart de prix mesur\xE9 va \xE0 l'inverse de la logique (autre facteur en jeu : vendeur, \xE9tat, historique) : non retenu."):ee==="implausible"?(_.verdict="non_mesurable",_.detail="\xC9cart de prix mesur\xE9 invraisemblable pour une seule caract\xE9ristique : non retenu."):(_.verdict="insuffisant",_.detail="Trop peu d'annonces avec ou sans cette caract\xE9ristique."),i.items.push(_);continue}let T=o.beta[I],x=Math.sqrt(Math.max(o.cov[I][I],1e-12)),N=T/x;_.pct=Ue(T),_.t=Ae(N);let D=d[g];D&&(_.days_with=D.with,_.days_without=D.without);let te=D?D.without-D.with:0,w=D?te/Math.max(D.without,1):0,b=!!D&&te<=-14&&w<=-.3,L=!!D&&te>=14&&w>=.3,R=ln(g),O=H.kind==="body"?"neutre":N>=2?R>=0?"privilegier":"neutre":N<=-2&&R<=0?"eviter":"neutre";H.kind==="body"&&(_.detail="\xC9cart de prix li\xE9 au type de mod\xE8le, pas un \xE9quipement \xE0 choisir."),O==="neutre"&&L&&H.kind!=="body"&&R>=0&&(O="privilegier",_.detail="Prix sans \xE9cart net, mais ces annonces partent plus vite."),O==="privilegier"&&b&&(_.detail="Prix plus \xE9lev\xE9, mais vente plus lente.");let j={};for(let[ee,V]of[["CH",u],["DE",p]])if(V){let h=he(V,`${v}:${g}`);h>=0&&(j[ee]={pct:Ue(V.beta[h]),t:Ae(V.beta[h]/Math.sqrt(Math.max(V.cov[h][h],1e-12)))})}if(j.CH&&j.DE){_.by_market=j;let[ee,V]=[j.CH,j.DE];(Math.abs(ee.t)>=2||Math.abs(V.t)>=2)&&(ee.pct*V.pct<0||Math.min(Math.abs(ee.t),Math.abs(V.t))<1)&&(_.market_dependent=!0,_.detail=((_.detail??"")+" Effet diff\xE9rent selon le march\xE9 (CH/DE).").trim())}_.verdict=O,i.items.push(_)}i.note="Effets mesur\xE9s \xE0 \xE9tat, \xE2ge et kilom\xE9trage comparables, uniquement pour les caract\xE9ristiques pr\xE9sentes sur ce mod\xE8le. Ce sont des corr\xE9lations : une option pr\xE9sente sur des voitures mieux entretenues peut para\xEEtre plus rentable qu'elle ne l'est.";let y={privilegier:0,eviter:1,neutre:2,non_mesurable:3,insuffisant:4};return i.items.sort((v,g)=>y[v.verdict]-y[g.verdict]||Math.abs(g.t??0)-Math.abs(v.t??0)),i}};var ve=(e,t)=>process.env[e]??t,Pt=()=>({delayS:Number(ve("REQUEST_DELAY_S","4")),respectRobots:!/^(0|false|non|no)$/i.test(ve("RESPECT_ROBOTS","true")),maxDetailsPerDay:Number(ve("MAX_DETAILS_PER_DAY","1200")),staleAfterDays:Number(ve("STALE_AFTER_DAYS","3")),fxFallback:Number(ve("FX_CHF_EUR","1.07")),sources:(()=>{let e={as24de:"autoscout24_de",as24ch:"autoscout24_ch",autolina:"autolina_ch"},t=ve("SOURCES","").split(",").map(n=>n.trim()).map(n=>e[n]??n).filter(n=>Me[n]);return t.length?t:$a})()}),La=Number(ve("CYCLE_BUDGET_S","660"))*1e3,Pa={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type, x-token, authorization","Access-Control-Allow-Methods":"GET, POST, DELETE, OPTIONS"},ae=(e,t=200)=>new Response(JSON.stringify(e),{status:t,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...Pa}}),we=(e,t)=>ae({detail:t},e),Rn=null,Oa="";async function Xe(e){let t=await e`SELECT count(*) AS c, max(last_seen) AS m, count(*) FILTER (WHERE active) AS a FROM listings`,n=`${t[0].c}|${t[0].m?new Date(t[0].m).getTime():0}|${t[0].a}`;if(Rn&&n===Oa)return Rn;let s=(await e`
    SELECT id, source, url, title, country, family, generation, version, segment, price, price_eur, currency, year, month, km, power_ps,
           options, flags, first_seen, published_at, active, model_conf, color, color_name, description
    FROM listings WHERE active AND segment IS NOT NULL AND price_eur > 0 AND year IS NOT NULL AND km IS NOT NULL`).map(d=>({id:d.id,source:d.source,url:d.url,title:d.title??"",country:d.country,family:d.family,generation:d.generation,version:d.version??"",segment:d.segment,priceEur:d.price_eur,price:d.price,currency:d.currency,year:d.year,month:d.month,km:d.km,powerPs:d.power_ps,opts:new Set(d.options??[]),conds:new Set(d.flags??[]),firstSeen:d.first_seen?new Date(d.first_seen):null,publishedAt:d.published_at?new Date(d.published_at):null,damaged:da(`${d.title??""}
${d.description??""}`)||(d.flags??[]).includes("damaged"),active:d.active,isDemo:!1,modelConf:d.model_conf,color:d.color,colorName:d.color_name,age:Mn(d.year,d.month)??0,ch:d.country==="CH"?1:0})),r=(await e`SELECT chf_eur FROM fx_rates ORDER BY day DESC LIMIT 1`)[0]?.chf_eur??null,o=(await e`
    SELECT (array_agg(h.price_eur ORDER BY h.seen_at))[1] AS first, (array_agg(h.price_eur ORDER BY h.seen_at DESC))[1] AS last
    FROM listings l JOIN price_history h ON h.listing_id = l.id WHERE NOT l.active AND l.removed_at IS NOT NULL GROUP BY l.id`).filter(d=>d.first>0&&d.last>0).map(d=>d.last/d.first-1),c=o.length>=15?{medianPct:ue(o)*100,n:o.length}:null,u=(await e`
    SELECT family, options, flags, COALESCE(published_at, first_seen) AS s, removed_at AS e FROM listings WHERE NOT active AND removed_at IS NOT NULL AND family IS NOT NULL`).map(d=>({family:d.family,keys:new Set([...d.options??[],...d.flags??[]]),days:Math.floor((new Date(d.e).getTime()-new Date(d.s).getTime())/864e5)})).filter(d=>d.days>=0),p=new Nt({minSegmentN:Number(ve("MIN_SEGMENT_N",String(Ke.minSegmentN))),minProjectionN:Number(ve("MIN_PROJECTION_N",String(Ke.minProjectionN))),marketVol:Number(ve("MARKET_VOL",String(Ke.marketVol))),fxFallback:Number(ve("FX_CHF_EUR",String(Ke.fxFallback)))});return p.load(s,r,c,u),Rn=p,Oa=n,p}function Na(e){let t=process.env.APP_TOKEN;if(!t)return!0;let n=e.headers.get("x-token")||(e.headers.get("authorization")??"").replace(/^Bearer\s+/i,"").trim(),a=s=>/^\d+$/.test(s)?s.replace(/^0+(?=\d)/,""):s;return n===t||a(n)===a(t)}async function Da(e){let t=new URL(e.url),n=t.pathname.replace(/\/+$/,"")||"/";if(e.method==="OPTIONS")return new Response(null,{status:204,headers:Pa});if(e.method==="POST"&&n==="/"){if(!e.headers.get("x-neon-trigger-invocation-id"))return we(403,"appel non planifi\xE9");let s=an();return mt(Tn(s,Pt(),La).catch(r=>console.error("cycle",r))),ae({accepted:!0})}if(n==="/healthz")return ae({ok:!0,app:"cotesport"});if(e.method==="GET"&&!n.startsWith("/api/")){let s=In[n==="/"?"/index.html":{"/leasing":"/leasing.html","/import":"/import.html"}[n]??n];if(s)return new Response(s.b,{headers:{"content-type":s.t,"cache-control":n==="/sw.js"?"no-cache":"public, max-age=300"}})}if(n==="/api/auth-check"){let s=!!process.env.APP_TOKEN;return ae({required:s,ok:!s||Na(e)})}if(!n.startsWith("/api/"))return we(404,"introuvable");if(!Na(e))return we(401,"Jeton requis");let a=an();try{if(n==="/api/config"&&e.method==="GET"){let r=pn().BMW.families,i=await Xe(a),o={};for(let[c,m]of Object.entries(r))for(let u of m.generations)o[`${c} ${u.code}`]=i.compat(c,u.code,u.years[1]);return ae({compat:o,auth_required:!!process.env.APP_TOKEN,families:Object.fromEntries(Object.entries(r).map(([c,m])=>[c,m.generations.map(u=>({code:u.code,years:u.years,versions:u.versions}))])),options:ua(),colors:fa,sources:Pt().sources.map(c=>({name:c,label:Me[c].label,country:Me[c].country}))})}if(n==="/api/summary"&&e.method==="GET")return ae(await Ws(a));if(n==="/api/estimate"&&e.method==="POST"){let r=await e.json().catch(()=>null);if(!r||!r.family||!r.generation||!Number.isFinite(Number(r.year))||!Number.isFinite(Number(r.km))||Number(r.km)<0)return we(400,"Param\xE8tres invalides");if(!pn().BMW.families[r.family])return we(400,"Famille inconnue");let i=await Xe(a);return ae(i.estimate({...r,options:(r.options??[]).slice(0,40),flags:(r.flags??[]).slice(0,20)}))}let s=n.match(/^\/api\/options\/([^/]+)$/);if(s&&e.method==="GET")return ae((await Xe(a)).optionsRanking(decodeURIComponent(s[1]),t.searchParams.get("generation")||void 0));if(n==="/api/listings"&&e.method==="GET")return ae(await qs(a,t));if(n==="/api/watch"&&e.method==="GET"){let r=await a`SELECT id, label, params, created_at FROM watch ORDER BY id DESC`;if(t.searchParams.get("light")==="1")return ae(r.map(c=>({id:c.id,spec:c.params})));let i=await Xe(a),o=[];for(let c of r){if(c.params?.kind==="listing"){let u=Number(c.params.listing_id),p=(await a`SELECT id, title, url, price, price_eur, currency, country, year, km, active, removed_at, first_seen, last_seen FROM listings WHERE id = ${u}`)[0]??null,d=p?await a`SELECT price, seen_at FROM price_history WHERE listing_id = ${u} ORDER BY seen_at`:[],y=i.rows.find(g=>g.id===u),v=y?i.scoreListings([y]).get(u)??null:null;o.push({id:c.id,name:c.label,spec:c.params,created_at:c.created_at,listing:p&&{title:p.title,url:p.url,price:p.price,currency:p.currency,country:p.country,year:p.year,km:p.km,active:p.active,removed_at:p.removed_at,gap_pct:v?.gap_pct??null,expected_eur:v?.expected_eur??null,damaged:!!y?.damaged,history:d.map(g=>({price:g.price,at:g.seen_at}))}});continue}let m={};try{m=i.estimate(c.params)}catch{}o.push({id:c.id,name:c.label,spec:c.params,created_at:c.created_at,estimate:m})}return ae(o)}if(n==="/api/watch"&&e.method==="POST"){let r=await e.json().catch(()=>null);return!r?.name||typeof r.spec!="object"||!r.spec?we(400,"Param\xE8tres invalides"):(await a`INSERT INTO watch(label, params) VALUES (${String(r.name).slice(0,80)}, ${JSON.stringify(r.spec)}::text::jsonb)`,ae({ok:!0}))}if(s=n.match(/^\/api\/watch\/(\d+)$/),s&&e.method==="DELETE")return await a`DELETE FROM watch WHERE id = ${Number(s[1])}`,ae({ok:!0});if(n==="/api/health"&&e.method==="GET")return ae(await Vs(a));if(n==="/api/collect"&&e.method==="POST"){if(await ut(a))return we(409,"Une collecte est d\xE9j\xE0 en cours");let r=t.searchParams.get("source");return mt(Tn(a,Pt(),La,r?[r]:void 0).catch(i=>console.error("cycle",i))),ae({started:!0})}if(n==="/api/collect/stop"&&e.method==="POST")return await ut(a)?(await Ma(a),ae({stopped:!0})):ae({stopped:!1,message:"Aucune collecte en cours"});if(n==="/api/reclassify"&&e.method==="POST")return ae({changed:await Sn(a)});if(n==="/api/demo")return we(404,"Pas de donn\xE9es de d\xE9monstration : l'outil travaille sur les annonces r\xE9elles.")}catch(s){return console.error(n,s),we(500,"Erreur interne : "+s.message)}return we(404,"introuvable")}async function Ws(e){let t=await Xe(e),n=(await e`SELECT count(*) AS c, count(*) FILTER (WHERE active) AS a FROM listings`)[0],a=(await e`SELECT max(finished_at) AS m FROM runs WHERE status IN ('ok','partial')`)[0].m,s=new Map;for(let u of t.rows){if(u.damaged)continue;let p=s.get(u.segment)??s.set(u.segment,{family:u.family,generation:u.generation,ch:[],de:[],km:[],age:[]}).get(u.segment);(u.country==="CH"?p.ch:p.de).push(u.priceEur),p.km.push(u.km),p.age.push(u.age)}let r=await e`SELECT segment, day, median_eur FROM segment_stats WHERE country = 'ALL' ORDER BY day`,i=new Map;for(let u of r)(i.get(u.segment)??i.set(u.segment,[]).get(u.segment)).push([u.day,u.median_eur]);let o=u=>Math.round(u),c=u=>Math.round(u*10)/10,m=[...s.entries()].map(([u,p])=>{let d=[...p.ch,...p.de],y=i.get(u)??[],v=null,g;return y.length>=2&&y[0][0]!==y[y.length-1][0]&&(v=c((y[y.length-1][1]/y[0][1]-1)*100),g=y[0][0]),{segment:u,family:p.family,generation:p.generation,n:d.length,n_ch:p.ch.length,n_de:p.de.length,median_eur:o(ue(d)),median_ch_eur:p.ch.length?o(ue(p.ch)):null,median_de_eur:p.de.length?o(ue(p.de)):null,median_km:o(ue(p.km)),median_age:c(ue(p.age)),ch_premium_pct:p.ch.length>=5&&p.de.length>=5?c((ue(p.ch)/ue(p.de)-1)*100):null,trend_pct:v,trend_since:g}}).sort((u,p)=>p.n-u.n);return{listings:n.c,active:n.a,demo:!1,last_collect:a,fx_chf_eur:t.fx,segments:m,collecting:ke.running||await ut(e)}}async function qs(e,t){let n=await Xe(e),a=t.searchParams,s=a.get("family")||"",r=a.get("generation")||"",i=(a.get("market")||"").toUpperCase(),o=(a.get("q")||"").toLowerCase(),c=["gap","price","recent","km"].includes(a.get("sort")??"")?a.get("sort"):"gap",m=Math.min(Math.max(Number(a.get("limit")??60)||60,1),300),u=n.rows;s&&(u=u.filter(x=>x.family===s)),r&&(u=u.filter(x=>x.generation===r)),i&&(u=u.filter(x=>x.country==="CH"==(i==="CH"))),o&&(u=u.filter(x=>x.title.toLowerCase().includes(o)));let p=a.get("color")||"",d=(a.get("options")||"").split(",").filter(Boolean),y=(a.get("flags")||"").split(",").filter(Boolean),v=a.get("version")||"",g=Number(a.get("year_min")||0),E=Number(a.get("year_max")||0),M=Number(a.get("km_max")||0);p&&(u=u.filter(x=>x.color===p)),v&&(u=u.filter(x=>x.version===v)),g&&(u=u.filter(x=>x.year>=g)),E&&(u=u.filter(x=>x.year<=E)),M&&(u=u.filter(x=>x.km<=M)),d.length&&(u=u.filter(x=>d.every(N=>x.opts.has(N)))),y.length&&(u=u.filter(x=>y.every(N=>x.conds.has(N)))),a.get("body")==="standard"&&(u=u.filter(x=>!x.opts.has("body_touring")&&!x.opts.has("body_convertible")&&!x.opts.has("body_gran_coupe"))),a.get("hide_damaged")!=="0"&&(u=u.filter(x=>!x.damaged&&!x.conds.has("accident")));let _=n.scoreListings(u),I=u.map(x=>{let N=_.get(x.id);return{id:x.id,url:x.url,title:x.title,segment:x.segment,version:x.version,year:x.year,km:x.km,country:x.country,price:x.price,currency:x.currency,color:x.color??null,color_name:x.colorName??null,price_eur:Math.round(x.priceEur),options:[...x.opts].sort(),flags:[...x.conds].sort(),first_seen:x.firstSeen?.toISOString()??null,source:x.source,demo:!1,expected_eur:N?.expected_eur??null,gap_pct:N?.gap_pct??null,model_conf:x.modelConf,damaged:!!x.damaged,accident:x.conds.has("accident"),suspect:N!=null&&N.gap_pct<-30}}),T={gap:(x,N)=>x.damaged!==N.damaged?x.damaged?1:-1:x.suspect!==N.suspect?x.suspect?1:-1:x.gap_pct==null?1:N.gap_pct==null?-1:x.gap_pct-N.gap_pct,price:(x,N)=>x.price_eur-N.price_eur,recent:(x,N)=>String(N.first_seen??"").localeCompare(String(x.first_seen??"")),km:(x,N)=>(x.km??0)-(N.km??0)};return I.sort(T[c]),{total:I.length,items:I.slice(0,m)}}async function Vs(e){let t=Pt(),n=await e`SELECT DISTINCT ON (source) source, day, started_at, finished_at, status, pages, seen AS found, new_count AS new, details, removed, skipped, error AS message
                         FROM runs ORDER BY source, day DESC`,a=await e`SELECT day, source, status, pages, seen AS found, new_count AS new, details, removed, error AS message FROM runs ORDER BY day DESC, source LIMIT 30`,s=(await e`SELECT day, chf_eur, origin AS source FROM fx_rates ORDER BY day DESC LIMIT 1`)[0]??null,r=await e`SELECT source, count(*) AS n, count(*) FILTER (WHERE active) AS a, count(*) FILTER (WHERE has_detail) AS d FROM listings GROUP BY source`,i=await e`SELECT source, status, count(*) AS n FROM crawl_queue WHERE day = CURRENT_DATE GROUP BY source, status`,o=await e`SELECT source, blocked_until, last_error FROM source_state WHERE blocked_until > now()`,c=ke.running||await ut(e);return{last:n.map(m=>({...m,finished_at:m.finished_at??null,status:m.status})),history:a,fx:s,by_source:r,queue:i,blocked:o,status:{running:c,current:ke.current},settings:{sources:t.sources,delay_s:t.delayS,robots:t.respectRobots,mode:"http",collect_hour:"11 h et 19 h (heure de Paris)",scheduler:!0}}}var Lo={fetch:e=>Da(e)};export{Lo as default};
