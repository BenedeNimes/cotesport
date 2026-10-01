// Dictionnaire d'options et d'indicateurs d'état, détectés dans le texte des annonces (FR / DE / EN).

export interface OptDef { label: string; kind: "option" | "cond"; patterns: string[] }

export const CATALOG: Record<string, OptDef> = {
  carbon_roof: { label: "Toit carbone", kind: "option", patterns: ["carbon[- ]?dach", "toit (en )?carbone", "carbon roof", "carbon[- ]?roof"] },
  carbon_seats: { label: "Sièges baquets carbone", kind: "option", patterns: ["carbon[- ]?schalensitz", "carbon bucket", "baquets? (en )?carbone", "m carbon[- ]?sitze"] },
  carbon_ceramic: { label: "Freins carbone-céramique", kind: "option", patterns: ["carbon[- ]?keramik", "keramikbrems", "carbon[- ]?ceramic", "carbone[- ]?c[ée]ramique"] },
  drivers_package: { label: "M Driver's Package", kind: "option", patterns: ["m driver'?s? ?package", "m fahrerpaket", "fahrerpaket", "driver'?s? package"] },
  carbon_package: { label: "Pack carbone extérieur", kind: "option", patterns: ["carbon[- ]?(ext|paket|package|aussen|außen)", "pack carbone", "carbon exterior", "carbon[- ]?aero"] },
  m_performance_parts: { label: "M Performance Parts", kind: "option", patterns: ["m performance (teile|parts|pi[eè]ces|zubeh)", "m performance (abgas|auspuff|exhaust)"] },
  adaptive_susp: { label: "Suspension M adaptative", kind: "option", patterns: ["adaptives? m fahrwerk", "suspension (m )?adaptative", "adaptive m susp", "adaptive suspension"] },
  m_diff: { label: "Différentiel M / autobloquant", kind: "option", patterns: ["m differential", "m differenzial", "sperrdifferential", "autobloquant"] },
  sport_exhaust: { label: "Échappement sport M", kind: "option", patterns: ["m sportabgas", "sportabgas", "[ée]chappement sport", "sport exhaust", "klappenauspuff"] },
  head_up: { label: "Affichage tête haute", kind: "option", patterns: ["head[- ]?up", "\\bhud\\b", "t[êe]te haute"] },
  harman: { label: "Harman Kardon", kind: "option", patterns: ["harman[ /-]?kardon", "\\bh&k\\b", "\\bhk\\b"] },
  bowers: { label: "Bowers & Wilkins", kind: "option", patterns: ["bowers ?(&|and|und)? ?wilkins", "\\bb&w\\b"] },
  laser: { label: "Phares laser", kind: "option", patterns: ["laser ?licht", "laser ?light", "phares? laser"] },
  driving_assist_pro: { label: "Driving Assistant Professional", kind: "option", patterns: ["driving assistant (pro|plus)", "fahrassistent (pro|plus)", "assistant de conduite pro"] },
  glass_roof: { label: "Toit ouvrant / panoramique", kind: "option", patterns: ["panorama", "glasdach", "schiebedach", "toit (ouvrant|panoramique)", "sunroof", "moonroof"] },
  ventilated_seats: { label: "Sièges ventilés", kind: "option", patterns: ["sitzbel[üu]ftung", "si[èe]ges? ventil", "ventilated seats?"] },
  heated_seats: { label: "Sièges chauffants", kind: "option", patterns: ["sitzheizung", "si[èe]ges? chauff", "heated seats?"] },
  keyless: { label: "Accès confort", kind: "option", patterns: ["komfortzugang", "acc[èe]s confort", "keyless", "comfort access"] },
  individual: { label: "BMW Individual / couleur spéciale", kind: "option", patterns: ["bmw individual", "individual[- ]?(lack|farbe|paint|peinture|color|colour)", "sonderlackierung", "peinture sp[ée]ciale", "frozen"] },
  manual: { label: "Boîte manuelle", kind: "option", patterns: ["schaltgetriebe", "6[- ]gang manuell", "handschalt", "bo[iî]te (m[ée]canique|manuelle)", "manual (gearbox|transmission)", "6[- ]?speed manual", "\\bmanuell\\b", "handschalter"] },
  ppf: { label: "Film de protection (PPF)", kind: "option", patterns: ["lackschutzfolie", "\\bppf\\b", "paint protection", "film de protection", "xpel"] },
  winter_tires: { label: "Roues hiver incluses", kind: "option", patterns: ["winterr[äa]der", "winterreifen", "jeu de roues hiver", "pneus? hiver", "winter (wheels|tyres|tires)", "kompletträder winter"] },
  // --- indicateurs d'état / historique ---
  service_history: { label: "Historique d'entretien complet", kind: "cond", patterns: ["scheckheft", "serviceheft", "l[üu]ckenlos", "carnet d'?entretien", "full service history", "service history", "historique (d'?entretien|complet)", "checkheft", "serviceheft gepflegt"] },
  accident_free: { label: "Sans accident", kind: "cond", patterns: ["unfallfrei", "sans accident", "accident[- ]?free", "no accident", "non accident[ée]", "kein unfall"] },
  first_owner: { label: "Première main", kind: "cond", patterns: ["erstbesitz", "1\\. ?hand", "erste hand", "1 vorbesitzer", "ein vorbesitzer", "premi[èe]re main", "1st owner", "first owner", "one owner", "1 propri[ée]taire", "unique propri[ée]taire", "1\\.hd", "1\\. ?hd"] },
  warranty: { label: "Garantie", kind: "cond", patterns: ["garantie", "warranty", "premium selection", "anschlussgarantie"] },
  accident: { label: "Dommage / accident déclaré", kind: "cond", patterns: ["unfallschaden", "unfallfahrzeug", "vorschaden", "accident[ée](?!\\s*free)", "v[ée]hicule accident", "damaged", "reparierter? (schaden|unfall)"] },
  tuned: { label: "Modifié / tuning", kind: "cond", patterns: ["tuning", "chip ?tuning", "stage ?[123]", "downpipe", "remap", "akrapovi[cč]", "capristo", "eisenmann", "\\bdinan\\b", "\\bjb4\\b", "leistungssteigerung", "reprogramm", "\\bhre\\b", "\\bkw suspension", "schnitzer", "\\bac schnitzer", "\\bg-power\\b", "manhart"] },
};

const COMPILED: Record<string, RegExp[]> = Object.fromEntries(
  Object.entries(CATALOG).map(([k, v]) => [k, v.patterns.map((p) => new RegExp(p, "i"))]),
);

export const OPT_KEYS = Object.entries(CATALOG).filter(([, v]) => v.kind === "option").map(([k]) => k);
export const COND_KEYS = ["accident_free", "service_history", "first_owner", "warranty", "accident", "tuned"];

/** Retourne [options, indicateurs d'état] détectés dans le texte. */
export function extract(textIn: string): [string[], string[]] {
  if (!textIn) return [[], []];
  // on neutralise les négations (« keine Garantie », « sans garantie »…)
  const text = textIn.replace(/\b(keine|ohne|sans|no|kein)\s+(garantie|warranty|unfall)/gi, " ");
  const opts: string[] = [];
  const conds: string[] = [];
  for (const [key, regs] of Object.entries(COMPILED)) {
    if (regs.some((r) => r.test(text))) (CATALOG[key].kind === "option" ? opts : conds).push(key);
  }
  // « sans accident » l'emporte sur « accident »
  if (conds.includes("accident_free") && conds.includes("accident")) {
    const clear = /unfallschaden|unfallfahrzeug|vorschaden|accident[ée]\b(?! free)/i.test(text);
    if (!clear || /unfallfrei/i.test(text)) conds.splice(conds.indexOf("accident"), 1);
  }
  return [opts, conds];
}

export function catalogPublic() {
  return Object.entries(CATALOG).map(([key, v]) => ({ key, label: v.label, kind: v.kind }));
}
