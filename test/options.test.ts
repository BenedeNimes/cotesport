import { describe, expect, it } from "vitest";
import { fitModel, ValuationService, type Row } from "../src/valuation";
import { mulberry32 } from "../src/linalg";
import { extract } from "../src/options";

function makeRows(n: number, truth: (r: { age: number; km: number; opts: Set<string>; conds: Set<string> }) => number): Row[] {
  const rnd = mulberry32(7);
  const rows: Row[] = [];
  for (let i = 0; i < n; i++) {
    const age = 1 + rnd() * 6, km = 10000 + rnd() * 90000;
    const opts = new Set<string>(), conds = new Set<string>();
    if (rnd() < 0.4) opts.add("carbon_ceramic");
    if (rnd() < 0.3) opts.add("head_up");
    if (rnd() < 0.35) opts.add("body_touring");
    if (rnd() < 0.3) conds.add("warranty");
    if (rnd() < 0.5) conds.add("service_history");
    const price = Math.exp(Math.log(90000) + truth({ age, km, opts, conds }) + (rnd() - 0.5) * 0.04);
    rows.push({
      id: i, source: "t", url: "", title: "", country: "DE", family: "M4", generation: "G82", version: "M4", segment: "M4 G82",
      priceEur: price, price, currency: "EUR", year: 2026 - Math.round(age), month: 6, km, powerPs: 480, opts, conds,
      firstSeen: null, publishedAt: null, active: true, isDemo: false, modelConf: 1, age, ch: 0,
    });
  }
  return rows;
}

describe("effets des options", () => {
  const truth = (r: { age: number; km: number; opts: Set<string>; conds: Set<string> }) =>
    -0.08 * r.age - 0.03 * (r.km / 10000)
    + (r.opts.has("carbon_ceramic") ? 0.05 : 0)
    + (r.conds.has("service_history") ? 0.04 : 0)
    + (r.conds.has("warranty") ? -0.12 : 0); // effet de confusion : « garantie » mesurée négative
  const rows = makeRows(400, truth);

  it("écarte une garantie dont l'effet mesuré est négatif", () => {
    const fit = fitModel(rows, { withGeneration: false })!;
    expect(fit.cols).not.toContain("cond:warranty");
    expect(fit.dropped.get("cond:warranty")).toBe("sign");
  });

  it("garde les options à effet positif plausible", () => {
    const fit = fitModel(rows, { withGeneration: false })!;
    const i = fit.cols.indexOf("opt:carbon_ceramic");
    expect(i).toBeGreaterThan(0);
    expect(fit.beta[i]).toBeGreaterThan(0.02);
    expect(fit.beta[i]).toBeLessThan(0.09);
    expect(fit.cols).toContain("cond:service_history");
  });

  it("écarte un effet invraisemblable (> 25 %)", () => {
    const big = makeRows(400, (r) => truth(r) + (r.opts.has("head_up") ? 0.5 : 0));
    const fit = fitModel(big, { withGeneration: false })!;
    expect(fit.cols).not.toContain("opt:head_up");
    expect(fit.dropped.get("opt:head_up")).toBe("implausible");
  });

  it("le classement ne liste pas l'absent et ne conseille pas d'éviter la garantie", () => {
    const svc = new ValuationService();
    svc.load(rows, 1.07, null, []);
    const rk = svc.optionsRanking("M4", "G82");
    expect(rk.items.find((i) => i.key === "laser")).toBeUndefined(); // jamais vu sur ce modèle
    const w = rk.items.find((i) => i.key === "warranty")!;
    expect(w.verdict).toBe("non_mesurable");
    const body = rk.items.find((i) => i.key === "body_touring")!;
    expect(body.kind).toBe("carrosserie");
    expect(body.verdict).toBe("neutre");
  });

  it("n'applique pas une option écartée dans la cote", () => {
    const svc = new ValuationService();
    svc.load(rows, 1.07, null, []);
    const a = svc.estimate({ family: "M4", generation: "G82", year: 2023, km: 30000, options: [], flags: [] });
    const b = svc.estimate({ family: "M4", generation: "G82", year: 2023, km: 30000, options: [], flags: ["warranty"] });
    expect(b.value.eur).toBe(a.value.eur);
  });

  it("ne propose que les équipements compatibles avec la génération", () => {
    const svc = new ValuationService();
    svc.load(rows, 1.07, null, []);
    const c = svc.compat("M4", "G82", 2035);
    expect(c.options).toContain("carbon_ceramic");
    expect(c.options).not.toContain("laser");
    expect(svc.compat("M4", "G82", 2012).options).not.toContain("display_key");
  });
});

describe("détection dans le texte", () => {
  it("ne retient pas « garantie » niée", () => {
    expect(extract("Fahrzeug ohne Garantie")[1]).not.toContain("warranty");
    expect(extract("Anschlussgarantie 12 Monate")[1]).toContain("warranty");
  });
});
