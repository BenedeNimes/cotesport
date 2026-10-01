// Déduction du modèle (famille, génération, version) à partir du titre, de l'année et de la puissance — sans VIN.
import data from "./models.json";

interface Version { name: string; ps: number }
interface Generation { code: string; years: [number, number]; versions: Version[] }
interface Family { patterns: string[]; generations: Generation[] }
type Reference = Record<string, { families: Record<string, Family> }>;

export interface Resolved {
  make: string; family: string; generation: string; version: string; segment: string; confidence: number;
}

const REF = (data as unknown as { makes: Reference }).makes;
export const reference = () => REF;

const COMPILED: Array<[string, string, RegExp[]]> = [];
for (const [make, md] of Object.entries(REF)) {
  for (const [fam, fd] of Object.entries(md.families)) COMPILED.push([make, fam, fd.patterns.map((p) => new RegExp(p, "i"))]);
}

export const segmentKey = (family: string, generation: string) => `${family} ${generation}`;

export function detectFamily(text: string, make = "BMW"): string | null {
  const t = (text || "").toLowerCase().replace(/ /g, " ");
  let best: string | null = null;
  for (const [mk, fam, regs] of COMPILED) {
    if (mk !== make) continue;
    if (regs.some((r) => r.test(t))) {
      if (best === null || fam.length > best.length) best = fam;
    }
  }
  return best;
}

const minPsDist = (g: Generation, ps: number) => Math.min(...g.versions.map((v) => Math.abs(v.ps - ps)));

/** Retourne null si le véhicule est hors périmètre (pas un modèle M du référentiel). */
export function resolve(title: string, year: number | null, powerPs: number | null, make = "BMW", modelHint = ""): Resolved | null {
  const fam = detectFamily(`${modelHint} ${title}`, make) || detectFamily(modelHint, make);
  if (!fam) return null;
  const gens = REF[make].families[fam].generations;
  let conf = 1.0;
  let gen: Generation | null = null;
  if (year) {
    gen = gens.find((g) => g.years[0] <= year && year <= g.years[1]) ?? null;
    if (!gen) {
      const dist = gens.map((g) => [Math.min(Math.abs(year - g.years[0]), Math.abs(year - g.years[1])), g] as const).sort((a, b) => a[0] - b[0]);
      if (dist.length && dist[0][0] <= 1) { gen = dist[0][1]; conf = 0.7; } else return null;
    }
  } else if (gens.length === 1) { gen = gens[0]; conf = 0.8; }
  else if (powerPs) { gen = gens.reduce((a, b) => (minPsDist(a, powerPs) <= minPsDist(b, powerPs) ? a : b)); conf = 0.5; }
  else return null;

  // Cas où deux générations se chevauchent : la puissance tranche
  if (year && powerPs) {
    const overlapping = gens.filter((g) => g.years[0] - 1 <= year && year <= g.years[1] + 1);
    if (overlapping.length > 1) {
      gen = overlapping.reduce((a, b) => (minPsDist(a, powerPs) <= minPsDist(b, powerPs) ? a : b));
      conf = Math.min(conf, 0.8);
    }
  }
  const versions = gen!.versions;
  let version = versions[0].name;
  if (powerPs) {
    const v = versions.reduce((a, b) => (Math.abs(a.ps - powerPs) <= Math.abs(b.ps - powerPs) ? a : b));
    const gap = Math.abs(v.ps - powerPs);
    version = v.name;
    if (gap > 25) conf = Math.min(conf, 0.5);
    else if (gap > 8) conf = Math.min(conf, 0.8);
  }
  // le texte peut nommer la version explicitement
  const low = (title || "").toLowerCase();
  let named = false;
  for (const v of versions) {
    const tag = v.name.includes(" ") ? v.name.split(" ").slice(1).join(" ").toLowerCase() : "";
    if (tag && new RegExp(`\\b${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(low)) { version = v.name; named = true; break; }
  }
  if (!named && versions.length > 1 && !powerPs) conf = Math.min(conf, 0.6);
  return { make, family: fam, generation: gen!.code, version, segment: segmentKey(fam, gen!.code), confidence: Math.round(conf * 100) / 100 };
}
