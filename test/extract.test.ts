import { describe, it, expect } from "vitest";
import { extract } from "../src/options";
const has = (t: string) => { const [o, c] = extract(t); return new Set([...o, ...c]); };
describe("extract : abréviations, langues, faux positifs", () => {
  it("abréviations d'annonce allemandes", () => {
    const s = has("M4 xDrive Competition *ACC*H&K* Individual Coupé");
    for (const k of ["adaptive_cruise", "harman", "xdrive", "individual"]) expect(s.has(k), k).toBe(true);
    const t = has("340 M340i xDrive Aut.*NAVI*HEAD-UP*LASER*ACC*CAM*PDC* Touring");
    for (const k of ["head_up", "laser", "adaptive_cruise", "pdc", "body_touring"]) expect(t.has(k), k).toBe(true);
    const u = has("M440i Gran Coupé M Sport Pro Laser AHK GSD HK SHZ RFK");
    for (const k of ["tow_bar", "glass_roof", "harman", "heated_seats", "rear_camera", "laser"]) expect(u.has(k), k).toBe(true);
  });
  it("les abréviations ne sont reconnues qu'en majuscules et isolées", () => {
    expect(has("Accord acc. sport hkd khk").size).toBe(0);
    expect(has("das ist der Hudson-Wagen").has("head_up")).toBe(false);
  });
  it("espagnol / français / italien", () => {
    const es = has("Techo solar, asientos calefactables, cámara trasera, control de crucero adaptativo, sin accidentes, único propietario, libro de mantenimiento");
    for (const k of ["glass_roof", "heated_seats", "rear_camera", "adaptive_cruise", "accident_free", "first_owner", "service_history"]) expect(es.has(k), k).toBe(true);
    expect(es.has("accident")).toBe(false);
    const fr = has("Toit ouvrant, sièges chauffants, caméra de recul, régulateur adaptatif, première main, carnet d'entretien, TVA récupérable");
    for (const k of ["glass_roof", "heated_seats", "rear_camera", "adaptive_cruise", "first_owner", "service_history", "vat_deductible"]) expect(fr.has(k), k).toBe(true);
    expect(has("Sedili riscaldati, tetto panoramico, gancio traino").has("tow_bar")).toBe(true);
  });
  it("négations dans toutes les langues", () => {
    expect(has("ohne Anhängerkupplung, mit Harman Kardon").has("tow_bar")).toBe(false);
    expect(has("ohne Anhängerkupplung, mit Harman Kardon").has("harman")).toBe(true);
    expect(has("sin garantía").has("warranty")).toBe(false);
    expect(has("sans toit ouvrant").has("glass_roof")).toBe(false);
    expect(has("kein Unfall, Scheckheft").has("accident_free")).toBe(true);
    expect(has("kein Unfall").has("accident")).toBe(false);
    expect(has("Mwst. ausweisbar").has("vat_deductible")).toBe(true);
  });
  it("DCT, facelift", () => {
    expect(has("M3 Competition DKG LCI").has("dct")).toBe(true);
    expect(has("M3 Competition DKG LCI").has("facelift")).toBe(true);
  });
});
