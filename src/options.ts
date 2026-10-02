// Dictionnaire d'options et d'indicateurs d'état, détectés dans le texte des annonces (FR / DE / EN).

/**
 * kind : « option » (équipement), « body » (carrosserie / transmission : une caractéristique du modèle, pas un équipement) ou « cond » (état / historique).
 * sign : effet attendu sur le prix (1 = hausse, -1 = baisse, 0 = indéterminé). Un effet mesuré de signe contraire est rejeté (voir valuation.ts).
 * minYear : première année de disponibilité de l'équipement ; il n'est pas proposé pour une génération qui s'arrête avant.
 */
export interface OptDef {
  label: string; kind: "option" | "body" | "cond";
  /** expressions insensibles à la casse (DE / FR / EN / ES / IT) */
  patterns: string[];
  /** abréviations d'annonce, reconnues seulement en MAJUSCULES et isolées (ACC, HK, AHK…) : évite les faux positifs (« acc » dans « accord ») */
  abbr?: string[];
  sign?: 1 | -1 | 0; minYear?: number;
}

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
  harman: { label: "Harman Kardon", kind: "option", patterns: ["harman[ /-]?kardon", "harman ?kard"] },
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
  // --- équipements complémentaires (DE / EN / FR / IT) ---
  m_sport_package: { label: "Pack M Sport", kind: "option", patterns: ["m[- ]?sport(paket|package|pack)\\b", "m sport pro"] },
  competition_package: { label: "Pack Competition", kind: "option", patterns: ["competition[- ]?(paket|package|pack)"] },
  track_package: { label: "Pack Track / Race Track", kind: "option", patterns: ["(race[- ]?)?track[- ]?(paket|package|pack)", "m track", "rennstrecken"] },
  m_sport_seats: { label: "Sièges M Sport", kind: "option", patterns: ["m[- ]?sportsitze?", "m sport seats?", "si[èe]ges? m sport", "sedili sportivi m"] },
  comfort_seats: { label: "Sièges confort / mémoire", kind: "option", patterns: ["komfortsitze?", "sitzmemory|memory[- ]?(sitz|seat|funktion)", "elektr(isch)?e? (verstell|sitze)", "si[èe]ges? (confort|[ée]lectriques|m[ée]moire)", "comfort seats?", "power seats?", "sedili (comfort|elettrici)"] },
  merino: { label: "Cuir Merino / cuir intégral", kind: "option", patterns: ["merino", "vollleder", "volllederausstattung", "full leather", "cuir (int[ée]gral|pleine fleur)", "pelle (integrale|merino)", "leder[- ]?(komplett|innenausstattung)"] },
  alcantara: { label: "Alcantara", kind: "option", patterns: ["alcantara"] },
  carbon_trim: { label: "Décors carbone intérieur", kind: "option", patterns: ["carbon[- ]?(interieur|innenraum|zierleisten|trim|decor|dekor|inlay)", "d[ée]cors? (en )?carbone", "interni in carbonio", "carbon interior"] },
  carbon_hood: { label: "Capot carbone", kind: "option", patterns: ["carbon[- ]?(motorhaube|haube|hood|bonnet)", "capot (en )?carbone", "cofano in carbonio"] },
  carbon_mirrors: { label: "Rétroviseurs carbone", kind: "option", patterns: ["carbon[- ]?(au[ßs]en)?spiegel", "carbon (side )?mirrors?", "r[ée]troviseurs? (en )?carbone"] },
  carbon_aero: { label: "Aileron / lame carbone", kind: "option", patterns: ["carbon[- ]?(heck)?spoiler", "carbon[- ]?(lippe|splitter|diffusor|diffuser)", "aileron (en )?carbone", "carbon (rear )?spoiler"] },
  surround_view: { label: "Caméra 360° / Surround View", kind: "option", patterns: ["surround[- ]?view", "top[- ]?view", "360 ?(°|grad)", "rundum(sicht)?[- ]?kamera", "cam[ée]ra 360", "kamera 360"] },
  parking_assistant: { label: "Assistant de stationnement", kind: "option", patterns: ["parking assistant", "park(ing)?[- ]?assistent", "park assist", "assistant de stationnement", "aide au stationnement", "assistente (al )?parcheggio", "parkassistent"] },
  rear_camera: { label: "Caméra de recul", kind: "option", patterns: ["r[üu]ckfahrkamera", "(rear[- ]?view|reversing|backup) camera", "cam[ée]ra de recul", "telecamera posteriore"] },
  adaptive_cruise: { label: "Régulateur de vitesse adaptatif", kind: "option", patterns: ["aktive?r? geschwindigkeitsregel", "adaptive[rn]? tempomat", "adaptive cruise", "r[ée]gulateur (de vitesse )?adaptatif", "cruise control mit bremse", "tempomat mit bremsfunktion"] },
  display_key: { label: "Clé écran (Display Key)", kind: "option", patterns: ["display[- ]?key", "displayschl[üu]ssel", "cl[ée] ([ée]cran|display)"] },
  ambient: { label: "Éclairage d'ambiance", kind: "option", patterns: ["ambiente?[- ]?(beleuchtung|licht|light)", "ambient (light|lighting)", "[ée]clairage d'?ambiance", "illuminazione ambient"] },
  wireless_charging: { label: "Recharge smartphone sans fil", kind: "option", patterns: ["wireless charging", "induktiv(es)? laden", "kabellos(es)? laden", "ladeschale", "charge(ment)? sans fil", "ricarica wireless"] },
  carplay: { label: "Apple CarPlay", kind: "option", patterns: ["apple ?carplay", "carplay"] },
  led_headlights: { label: "Phares LED adaptatifs", kind: "option", patterns: ["adaptive led", "led[- ]?scheinwerfer", "led[- ]?headlight", "phares? led", "fari led"] },
  heated_wheel: { label: "Volant chauffant", kind: "option", patterns: ["lenkradheizung", "heated steering", "volant chauffant", "volante riscaldato"] },
  tow_bar: { label: "Attelage", kind: "option", patterns: ["anh[äa]ngerkupplung", "\\bahk\\b", "tow ?bar", "trailer hitch", "attelage", "gancio traino"] },
  parking_heater: { label: "Chauffage stationnaire", kind: "option", patterns: ["standheizung", "auxiliary heater", "parking heater", "chauffage (auxiliaire|stationnaire)"] },
  soft_close: { label: "Fermeture assistée des portes", kind: "option", patterns: ["soft[- ]?close", "komfortschlie[ßs]", "fermeture (assist|confort)"] },
  forged_wheels: { label: "Jantes M forgées", kind: "option", patterns: ["forged", "geschmiedet", "schmiede(r[äa]der|felgen)", "jantes? forg[ée]es?", "cerchi forgiati"] },
  m_brakes: { label: "Freins M Sport / Compound", kind: "option", patterns: ["m[- ]?sportbremse", "m[- ]?compound", "compound[- ]?brems", "freins? m (sport|compound)", "m sport brakes?"] },
  active_steering: { label: "Direction intégrale active", kind: "option", patterns: ["integral[- ]?aktivlenkung", "integral active steering", "direction int[ée]grale", "hinterachslenkung"] },
  xdrive: { label: "Transmission intégrale xDrive", kind: "body", patterns: ["x[- ]?drive"] },
  body_touring: { label: "Carrosserie Touring (break)", kind: "body", patterns: ["\\btouring\\b"] },
  body_convertible: { label: "Carrosserie Cabriolet", kind: "body", patterns: ["cabrio(let)?", "convertible", "\\bcabrio\\b", "decapotable", "d[ée]capotable"] },
  body_gran_coupe: { label: "Carrosserie Gran Coupé", kind: "body", patterns: ["gran ?coup[ée]"] },
  sound_system: { label: "Système audio haut de gamme", kind: "option", patterns: ["hifi[- ]?(system|lautsprecher)?\\s*(professional|prof\\.?)", "hifi professional", "hi-?fi pro", "audio(system)? (haut de gamme|premium)", "premium sound"] },
  // --- indicateurs d'état / historique ---
  nonsmoker: { label: "Non-fumeur", kind: "cond", patterns: ["nichtraucher", "non[- ]?fumeur", "non[- ]?smoker", "no smoking", "non fumatore"] },
  recent_inspection: { label: "Contrôle / entretien récent", kind: "cond", patterns: ["frisch(e|er)? (service|t[üu]v|hu\\b|inspektion)", "neu(e|er)? (t[üu]v|hu\\b)", "t[üu]v neu", "service neu", "inspection (neuve|r[ée]cente)", "expertis[ée]e? (r[ée]cemment|du jour)", "mfk (neu|frisch)", "frisch ab mfk", "gerade gewartet"] },
  service_history: { label: "Historique d'entretien complet", kind: "cond", patterns: ["scheckheft", "serviceheft", "l[üu]ckenlos", "carnet d'?entretien", "full service history", "service history", "historique (d'?entretien|complet)", "checkheft", "serviceheft gepflegt"] },
  accident_free: { label: "Sans accident", kind: "cond", patterns: ["unfallfrei", "sans accident", "accident[- ]?free", "no accident", "non accident[ée]", "kein unfall"] },
  first_owner: { label: "Première main", kind: "cond", patterns: ["erstbesitz", "1\\. ?hand", "erste hand", "1 vorbesitzer", "ein vorbesitzer", "premi[èe]re main", "1st owner", "first owner", "one owner", "1 propri[ée]taire", "unique propri[ée]taire", "1\\.hd", "1\\. ?hd"] },
  warranty: { label: "Garantie", kind: "cond", patterns: ["garantie", "warranty", "premium selection", "anschlussgarantie"] },
  accident: { label: "Dommage / accident déclaré", kind: "cond", patterns: ["unfallschaden", "unfallfahrzeug", "vorschaden", "accident[ée](?!\\s*free)", "v[ée]hicule accident", "damaged", "reparierter? (schaden|unfall)"] },
  tuned: { label: "Modifié / tuning", kind: "cond", patterns: ["tuning", "chip ?tuning", "stage ?[123]", "downpipe", "remap", "akrapovi[cč]", "capristo", "eisenmann", "\\bdinan\\b", "\\bjb4\\b", "leistungssteigerung", "reprogramm", "\\bhre\\b", "\\bkw suspension", "schnitzer", "\\bac schnitzer", "\\bg-power\\b", "manhart"] },
};


// --- enrichissement : langues supplémentaires (ES / IT / PT) et abréviations d'annonce ---------------------------------------
const NEW_OPTIONS: Record<string, OptDef> = {
  pdc: { label: "Aide au stationnement (PDC)", kind: "option", patterns: ["park ?distance ?control", "parkpilot", "einparkhilfe", "aide au stationnement", "sensores? de (aparcamiento|estacionamiento)", "sensori di parcheggio"], abbr: ["PDC"] },
  navigation_pro: { label: "Navigation Professional", kind: "option", patterns: ["navigationssystem professional", "navi(gation)? prof(essional)?", "professional navi", "navigation professional", "navegador profesional", "gps professional"], abbr: ["NAVI PROF", "NAV PRO"] },
  dct: { label: "Boîte M DCT (double embrayage)", kind: "body", patterns: ["m[- ]?dct", "doppelkupplung", "double embrayage", "doble embrague", "doppia frizione", "dual[- ]clutch"], abbr: ["DKG", "DCT", "M-DKG"] },
  facelift: { label: "Restylage (LCI / Facelift)", kind: "body", patterns: ["facelift", "restyl(ing|[ée])", "modellpflege", "\\blci\\b"], abbr: ["LCI"] },
  vat_deductible: { label: "TVA récupérable", kind: "cond", patterns: ["mwst\\.? ?ausweisbar", "mehrwertsteuer ausweisbar", "mwst\\.? ?erstattbar", "ausweisbare? mwst", "tva r[ée]cup[ée]rable", "tva d[ée]ductible", "iva (deducible|recuperable)", "iva esposta", "vat (deductible|reclaimable|refundable|recoverable)"] },
};
for (const [k, v] of Object.entries(NEW_OPTIONS)) CATALOG[k] = v;

const MORE: Record<string, { patterns?: string[]; abbr?: string[] }> = {
  carbon_roof: { patterns: ["cfk[- ]?dach", "carbon ?dach", "techo (de |en )?carbono", "tetto (in )?carbonio"], abbr: ["CFK"] },
  carbon_seats: { patterns: ["asientos? (tipo )?(baquet|bucket|de carbono)", "sedili (a )?guscio", "schalensitze"], abbr: [] },
  carbon_ceramic: { patterns: ["carbocer[áa]mic", "carbono[- ]?cer[áa]mic", "freni carboceramici", "keramik ?bremse", "m carbon[- ]?keramik"], abbr: ["CCB"] },
  drivers_package: { patterns: ["pack(et)? m driver", "paquete m driver", "pacchetto m driver"], abbr: ["MDP"] },
  carbon_package: { patterns: ["paquete (de )?carbono", "pacchetto carbonio", "m carbon (exterieur|paket)"] },
  adaptive_susp: { patterns: ["suspensi[óo]n (m )?adaptativ", "sospensioni (m )?adattive", "adaptives? fahrwerk", "m adaptive"], abbr: ["EDC"] },
  m_diff: { patterns: ["diferencial (m|autoblocante)", "differenziale (m|autobloccante)"] },
  sport_exhaust: { patterns: ["escape (deportivo|m|sport)", "scarico sportivo", "sportauspuff", "sportauspuffanlage", "klappen(auspuff|abgas)"], abbr: ["SAG"] },
  head_up: { patterns: ["head[- ]?up", "proyecci[óo]n (en )?(el )?parabrisas", "visualizzatore head", "bmw head"], abbr: ["HUD", "HeadUp"] },
  harman: { patterns: ["harman[ /&-]*kardon", "harman ?kard"], abbr: ["HK", "H&K", "H/K", "H & K"] },
  bowers: { patterns: ["bowers"], abbr: ["B&W", "B & W"] },
  laser: { patterns: ["\\blaser\\b(?!\\s*(print|schwei))", "luz l[áa]ser", "faros? l[áa]ser", "fari laser", "laserlicht", "laserscheinwerfer", "bmw laserlight"] },
  driving_assist_pro: { patterns: ["driving assistant professional", "driving assist(ant)? ?(pro|prof)", "asistente de conducci[óo]n (pro|profesional|plus)", "assistente alla guida (pro|professional)", "fahrassistenz[- ]?(paket )?(professional|plus)", "assistenzsysteme professional"], abbr: ["DA PRO"] },
  glass_roof: { patterns: ["techo (solar|panor[áa]mico|de cristal|el[ée]ctrico)", "tetto (apribile|panoramico|in vetro)", "glas ?schiebedach", "glas ?hebe", "panoramaglas", "toit vitr[ée]"], abbr: ["GSD", "SSD", "PanoDach", "SHD"] },
  ventilated_seats: { patterns: ["asientos? (ventilados|con ventilaci[óo]n)", "sedili ventilati", "aktive sitzbel[üu]ftung", "sitzbel[üu]ftung"] },
  heated_seats: { patterns: ["asientos? (calefactados|calefactables|con calefacci[óo]n|calefactado)", "sedili riscaldati", "sitzheiz", "sitze beheizbar", "beheizbare sitze", "si[èe]ges? chauffants?"], abbr: ["SHZ"] },
  keyless: { patterns: ["acceso confort", "accesso comfort", "comfort[- ]?zugang", "keyless[- ]?(go|entry)?", "acc[èe]s sans cl[ée]", "arranque sin llave"] },
  individual: { patterns: ["\\bindividual\\b", "pintura (individual|especial)", "vernice (individual|speciale)", "bmw individual", "individual[- ]?(lack|farbe|paint|peinture|color|colour|lackierung)", "sonderlack", "sonderfarbe", "frozen [a-z]+"] },
  manual: { patterns: ["cambio manual", "caja manual", "transmisi[óo]n manual", "cambio mec[áa]nico", "bo[iî]te m[ée]canique", "bo[iî]te manuelle", "handschalter", "handschalt", "6[- ]?gang[- ]?(manuell|schalt|handschalt)", "6[- ]?speed manual", "schaltgetriebe", "manuale\\b"], abbr: ["6MT"] },
  ppf: { patterns: ["lackschutzfolie", "paint protection", "film de protection", "pel[íi]cula protectora", "pellicola protettiva", "xpel", "stek", "suntek"], abbr: ["PPF"] },
  winter_tires: { patterns: ["winterr[äa]der", "winterreifen", "winterkompletträder", "ruedas de invierno", "neum[áa]ticos de invierno", "pneumatici invernali", "ruote invernali", "pneus? hiver", "jeu de roues hiver"] },
  m_sport_package: { patterns: ["paquete m sport", "pacchetto m sport", "pack m sport", "m ?sportpaket", "m sport pro", "m ?sport ?package"], abbr: ["MSP"] },
  competition_package: { patterns: ["paquete competition", "pacchetto competition", "competition[- ]?(paket|package|pack)"] },
  track_package: { patterns: ["paquete (m )?track", "pacchetto (m )?track", "(race[- ]?)?track[- ]?(paket|package|pack)"] },
  m_sport_seats: { patterns: ["asientos? m sport", "sedili m sport", "m ?sportsitz"] },
  comfort_seats: { patterns: ["asientos (el[ée]ctricos|con memoria|confort)", "sedili (elettrici|con memoria|comfort)", "sitzmemory", "memory[- ]?sitz", "sitzspeicher", "elektrische sitze", "elektr\\.? sitze", "komfortsitze"] },
  merino: { patterns: ["piel merino", "pelle merino", "cuero (merino|integral)", "piel integral", "vollleder", "volllederausstattung", "leder merino", "merino"] },
  alcantara: { patterns: ["alcantara"] },
  carbon_trim: { patterns: ["molduras? (de )?carbono", "rivestimenti in carbonio", "carbon fibre", "carbon[- ]?fiber", "interieurleisten carbon", "carbon[- ]?(interieur|innenraum|zierleisten|trim|decor|dekor|inlay)"] },
  carbon_hood: { patterns: ["cap[óo] (de )?carbono", "carbon[- ]?(motorhaube|haube|hood|bonnet)"] },
  carbon_mirrors: { patterns: ["retrovisores? (de )?carbono", "carbon[- ]?(au[ßs]en)?spiegel", "specchietti in carbonio", "carbon[- ]?spiegelkappen"] },
  carbon_aero: { patterns: ["aler[óo]n (de )?carbono", "spoiler in carbonio", "carbon[- ]?(heck)?spoiler", "carbon[- ]?(lippe|splitter|diffusor)", "carbon[- ]?(heckdiffusor|frontsplitter)"] },
  surround_view: { patterns: ["c[áa]maras? (de )?360", "visi[óo]n (de )?360", "surround[- ]?view", "top[- ]?view", "360 ?(°|grad)", "rundum(sicht)?[- ]?kamera", "telecamere 360", "cam[ée]ra 360", "kamera 360"], abbr: ["SVC", "360°"] },
  parking_assistant: { patterns: ["asistente de (aparcamiento|estacionamiento)", "parking assistant", "park(ing)?[- ]?assist(ent)?", "assistente (al )?parcheggio", "assistant de stationnement", "parkassistent"] },
  rear_camera: { patterns: ["c[áa]mara (trasera|de (marcha atr[áa]s|visi[óo]n trasera|aparcamiento))", "telecamera (posteriore|di parcheggio)", "r[üu]ckfahrkamera", "cam[ée]ra de recul", "rear[- ]?view camera", "reversing camera"], abbr: ["RFK", "RFKS"] },
  adaptive_cruise: { patterns: ["control de crucero adaptativ", "cruise control adattivo", "regolatore di velocit[àa] adattivo", "aktive geschwindigkeitsregel", "adaptive[rn]? tempomat", "adaptive cruise", "r[ée]gulateur (de vitesse )?adaptatif", "distronic", "tempomat mit bremsfunktion"], abbr: ["ACC"] },
  display_key: { patterns: ["display[- ]?key", "displayschl[üu]ssel", "llave (con )?pantalla", "chiave display"] },
  ambient: { patterns: ["luz ambiental", "luces ambientales", "illuminazione ambient", "ambiente?[- ]?(beleuchtung|licht|light)", "ambient (light|lighting)"] },
  wireless_charging: { patterns: ["carga inal[áa]mbrica", "cargador inal[áa]mbrico", "ricarica wireless", "ricarica induttiva", "wireless charging", "induktiv(es)? laden", "kabellos(es)? laden", "ladeschale"] },
  carplay: { patterns: ["apple ?carplay", "carplay"] },
  led_headlights: { patterns: ["faros led", "fari (a )?led", "adaptive led", "led[- ]?scheinwerfer", "phares? led"] },
  heated_wheel: { patterns: ["volante (calefactable|calefactado)", "volante riscaldato", "lenkradheizung", "volant chauffant", "heated steering"] },
  tow_bar: { patterns: ["enganche (de )?remolque", "gancho (de )?remolque", "bola de remolque", "gancio traino", "anh[äa]ngerkupplung", "attelage"], abbr: ["AHK", "AHZV"] },
  parking_heater: { patterns: ["calefacci[óo]n (auxiliar|estacionaria)", "riscaldamento (ausiliario|a veicolo fermo)", "standheizung", "chauffage (auxiliaire|stationnaire)"], abbr: ["STH"] },
  soft_close: { patterns: ["soft[- ]?close", "cierre (asistido|suave)", "komfortschlie[ßs]"] },
  forged_wheels: { patterns: ["llantas forjadas", "cerchi forgiati", "jantes? forg[ée]es?", "geschmiedete? (r[äa]der|felgen)", "schmiede(r[äa]der|felgen)"] },
  m_brakes: { patterns: ["frenos m (sport|compound)", "m[- ]?sportbremse", "m[- ]?compound", "freins? m (sport|compound)", "m sport brakes?", "freni m sport"] },
  active_steering: { patterns: ["direcci[óo]n (integral|activa)", "integral[- ]?aktivlenkung", "integral active steering", "direction int[ée]grale", "hinterachslenkung"] },
  sound_system: { patterns: ["hifi[- ]?(system|lautsprecher)?\\s*(professional|prof\\.?)", "hi-?fi pro", "premium sound", "sistema de sonido premium", "audio(system)? (haut de gamme|premium)"] },
  service_history: { patterns: ["libro de (mantenimiento|revisiones|servicio)", "revisiones (oficiales|en bmw|al d[íi]a)", "mantenimientos? (oficial|en bmw|al d[íi]a)", "tagliandi (bmw|ufficiali)", "libretto (tagliandi|di servizio)", "scheckheft", "serviceheft", "checkheft", "l[üu]ckenlos", "carnet d'?entretien", "historique (d'?entretien|complet)", "full service history", "service history"], abbr: ["SH gepflegt", "SCKH"] },
  first_owner: { patterns: ["[úu]nico propietario", "primer propietario", "1 propietario", "primo proprietario", "un solo proprietario", "erstbesitz", "erste hand", "1\\. ?hand", "1 vorbesitzer", "ein vorbesitzer", "premi[èe]re main", "1st owner", "first owner", "one owner", "1 propri[ée]taire"], abbr: ["1.Hd", "1. Hd"] },
  warranty: { patterns: ["garant[íi]a (oficial|bmw|de f[áa]brica|\\d+ meses|de \\d)", "garanzia (bmw|ufficiale|\\d+ mesi)", "garantie", "warranty", "premium selection", "anschlussgarantie", "garantia"] },
  nonsmoker: { patterns: ["no fumador", "non fumatore", "nichtraucher", "non[- ]?fumeur", "non[- ]?smoker"] },
  recent_inspection: { patterns: ["itv (reci[ée]n|nueva|pasada|reciente)", "revisione (appena|nuova)", "frisch(e|er)? (service|t[üu]v|hu\\b|inspektion)", "neu(e|er)? (t[üu]v|hu\\b)", "t[üu]v neu", "hu/au neu", "service neu", "inspection (neuve|r[ée]cente)", "contr[ôo]le technique (ok|vierge)", "mfk (neu|frisch)", "frisch ab mfk", "gerade gewartet"] },
  accident_free: { patterns: ["sin accidentes", "senza incidenti", "unfallfrei", "sans accident", "accident[- ]?free", "no accident", "non accident[ée]", "kein unfall"], abbr: ["UFF"] },
  accident: { patterns: ["accidentado", "siniestrado", "incidentato", "unfallschaden", "unfallfahrzeug", "vorschaden", "accident[ée](?!\\s*free)", "v[ée]hicule accident", "damaged", "reparierter? (schaden|unfall)", "da[ñn]os? (de )?(carrocer[íi]a|accidente)"] },
};
for (const [k, add] of Object.entries(MORE)) {
  const d = CATALOG[k]; if (!d) continue;
  d.patterns = [...new Set([...d.patterns, ...(add.patterns ?? [])])];
  if (add.abbr) d.abbr = [...new Set([...(d.abbr ?? []), ...add.abbr])];
}

// Effet attendu sur le prix, quand il n'est pas « hausse » (valeur par défaut des équipements et des états favorables).
const SIGN_OVERRIDES: Record<string, 1 | -1 | 0> = {
  accident: -1,
  tuned: 0, manual: 0, tow_bar: 0, parking_heater: 0, winter_tires: 0, individual: 0, m_performance_parts: 0, competition_package: 0, track_package: 0,
  xdrive: 0, body_touring: 0, body_convertible: 0, body_gran_coupe: 0, dct: 0, facelift: 0, vat_deductible: 0, navigation_pro: 1,
};
for (const [k, v] of Object.entries(CATALOG)) v.sign = SIGN_OVERRIDES[k] ?? 1;

// Équipements qui n'existent pas avant une certaine année de première immatriculation.
const MIN_YEAR: Record<string, number> = { laser: 2015, display_key: 2020, wireless_charging: 2017, carplay: 2017, driving_assist_pro: 2017, surround_view: 2013 };
for (const [k, y] of Object.entries(MIN_YEAR)) if (CATALOG[k]) CATALOG[k].minYear = y;

export const expectedSign = (key: string): 1 | -1 | 0 => CATALOG[key]?.sign ?? 0;

const COMPILED: Record<string, RegExp[]> = Object.fromEntries(
  Object.entries(CATALOG).map(([k, v]) => [k, v.patterns.map((p) => new RegExp(p, "i"))]),
);

export const OPT_KEYS = Object.entries(CATALOG).filter(([, v]) => v.kind !== "cond").map(([k]) => k);
export const COND_KEYS = ["vat_deductible", "accident_free", "service_history", "first_owner", "warranty", "accident", "tuned", "nonsmoker", "recent_inspection"];

const ABBR: Record<string, RegExp> = {};
for (const [k, v] of Object.entries(CATALOG)) {
  if (!v.abbr?.length) continue;
  const alt = v.abbr.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s?")).join("|");
  ABBR[k] = new RegExp(`(?<![A-Za-z0-9ÄÖÜäöüéèà])(?:${alt})(?![A-Za-z0-9ÄÖÜäöüéèà])`); // sensible à la casse, mot isolé
}

const WORD = "[^\\s,;.*/|•\\n]+";
/** « ohne / kein / sans / sin Unfall… » = sans accident ; les autres négations effacent les 1 à 3 mots suivants (« ohne Anhängerkupplung »). */
const NEG_ACCIDENT = /\b(?:ohne|kein[e]?[nrms]?|sans|sin|senza|without|nicht|pas d['e][ \t]?)[ \t]+(?:[a-zà-ÿ]+[ \t]+)?(?:unf[äa]lle?n?\w*|vorsch[äa]den\w*|accident\w*|sch[äa]den|incident\w*|dommages?|da[ñn]os?)(?![a-zà-ÿ])/gi;
const NEG_ANY = new RegExp(`\\b(?:ohne|keine?[nrms]?|sans|sin|senza|without|nicht|pas d['e][ \\t]?)[ \\t]+(?:${WORD}[ \\t]+){0,2}${WORD}`, "gi");

/** Retourne [options, indicateurs d'état] détectés dans le texte (titre, description, listes d'équipements ; un élément par ligne ou séparé par « ; »). */
export function extract(textIn: string): [string[], string[]] {
  if (!textIn) return [[], []];
  const text = textIn.replace(/_/g, " ").replace(NEG_ACCIDENT, " unfallfrei ").replace(NEG_ANY, " ");
  const opts: string[] = [];
  const conds: string[] = [];
  for (const [key, regs] of Object.entries(COMPILED)) {
    if (regs.some((r) => r.test(text)) || (ABBR[key] && ABBR[key].test(text))) (CATALOG[key].kind === "cond" ? conds : opts).push(key);
  }
  // « sans accident » l'emporte sur « accident »
  if (conds.includes("accident_free") && conds.includes("accident")) {
    const clear = /unfallschaden|unfallfahrzeug|vorschaden|accident[ée]\b(?! free)|accidentado|siniestrado/i.test(text);
    if (!clear || /unfallfrei/i.test(text)) conds.splice(conds.indexOf("accident"), 1);
  }
  return [opts, conds];
}

export function catalogPublic() {
  return Object.entries(CATALOG).map(([key, v]) => ({ key, label: v.label, kind: v.kind, min_year: v.minYear ?? null }));
}


// --- véhicules accidentés / défectueux -------------------------------------------------------------------------------
// « damaged » : épave, non roulant, moteur ou boîte HS, retourné, véhicule pour pièces / export… Ces annonces sont des prix
// d'épave, pas des prix de marché : elles sont exclues du calcul de la cote et masquables dans la liste.
const NEG_DAMAGE = /\b(kein(e|en)?|ohne|sans|no|nicht|pas de|senza)\s+(\w+\s+)?(unfall(schaden|fahrzeug)?|schaden|sch[äa]den|defekt(e)?|accident|damage|motorschaden|totalschaden)/gi;
const DAMAGED = new RegExp([
  "unfall(fahrzeug|wagen|auto)", "rund herum defekt", "[üu]berschlag", "[üu]berschlagen", "totalschaden", "wirtschaftlicher totalschaden",
  "motor(schaden|defekt)", "getriebe(schaden|defekt)", "motor (ist )?defekt", "(?<![a-zäöü])defekt(e[rsmn]?)?(?![a-zäöü])", "besch[äa]digt", "bastler", "ersatzteil(spender|tr[äa]ger)", "schlachtfest",
  "nicht (mehr )?(fahr(bereit|t[üu]chtig)|angemeldet|startf[äa]hig)", "reparaturbed[üu]rftig", "nicht rollf[äa]hig", "export(fahrzeug)?\\b.*(defekt|unfall)", "bergungs?fahrzeug",
  "[ée]pave", "accident[ée]e?\\b(?!\\s*free)", "non roulant", "hors service", "moteur (hs|cass[ée]|d[ée]fectueux)", "pour pi[èe]ces", "d[ée]fectueux", "endommag[ée]",
  "incidentat[ao]", "sinistrat[ao]", "motore (rotto|difettoso)", "non marciante",
  "wreck(ed)?", "salvage", "non[- ]?runner", "for parts", "spares or repair", "crash(ed)?\\b", "totaled", "engine (failure|damage|blown)", "blown (engine|motor)",
].join("|"), "i");

/** Texte d'annonce → véhicule accidenté / défectueux ? (les négations « unfallfrei », « kein Unfall »… sont neutralisées) */
export function isDamaged(textIn: string): boolean {
  if (!textIn) return false;
  const text = textIn.replace(/_/g, " ").replace(NEG_DAMAGE, " ").replace(/unfallfrei|schadenfrei|schadensfrei|schadenfreigabe|accident[- ]?free|sans accident|d[ée]faut de/gi, " ");
  return DAMAGED.test(text);
}
