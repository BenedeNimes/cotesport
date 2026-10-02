import { describe, it, expect } from "vitest";
import { isDamaged } from "../src/options";
describe("isDamaged", () => {
  it.each([
    "Unfallfahrzeug, rund herum defekt, Fahrzeug hat sich Überschlagen, Motor läuft",
    "BMW M3 Motorschaden, Export", "Totalschaden an Vorderachse", "véhicule accidenté, moteur HS", "Bastlerfahrzeug",
    "Salvage title, non-runner", "Auto non marciante, sinistrata", "Getriebe defekt",
  ])("détecte : %s", (t) => expect(isDamaged(t)).toBe(true));
  it.each([
    "Unfallfrei, Scheckheft, Garantie", "kein Unfall, keine Schäden", "ohne Unfallschaden", "Schnelle Schadenfreigabe, Reparatur Inclusive",
    "accident-free, sans accident", "Carbon Paket, Competition, 530 PS", "nicht defekt",
  ])("ne détecte pas : %s", (t) => expect(isDamaged(t)).toBe(false));
});
