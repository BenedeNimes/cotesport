// Couleur de carrosserie : on ramène les libellés DE / EN / FR / IT (et les noms de teintes BMW) à une famille en français.

export const COLOR_GROUPS = ["Noir", "Blanc", "Gris", "Argent", "Bleu", "Rouge", "Vert", "Jaune", "Orange", "Brun / beige", "Violet", "Autre"] as const;

// L'ordre compte : les teintes les plus spécifiques d'abord.
const RULES: Array<[string, RegExp]> = [
  ["Noir", /(?<![a-zà-ÿ])(schwarz|black|noir|nero|saphir|sapphire|carbon ?schwarz|jet ?black|frozen ?(deep )?black|cosmos|azurit? ?schwarz|oxford)/i],
  ["Blanc", /(?<![a-zà-ÿ])(wei(ss|ß)|white|blanc|bianco|alpin(weiss|weiß| white)?|mineral(wei(ss|ß)| white)|brooklyn white)/i],
  ["Argent", /(?<![a-zà-ÿ])(silber|silver|argent|argento|glacier|rhodonit|rhodonite|arktis|arctic silver)/i],
  ["Gris", /(?<![a-zà-ÿ])(grau|gr[ae]y|gris|grigio|anthrazit|anthracite|brooklyn|dravit|donington|sophisto|skyscraper|bernina|space ?gr|storm ?bay|titan|oxid|thunder ?night|frozen ?(dark )?(gr|silver|brooklyn)|portimao? ?grau|nardo|cashmere|tanzanite? ?grau)/i],
  ["Bleu", /(?<![a-zà-ÿ])(blau|blue|bleu|blu|portim[aã]o|san ?marino|estoril|laguna ?seca|interlagos|tanzanit|yas ?marina|marina ?bay|mauritius|le ?mans|long ?beach|tansanit|dark ?blue|imperial|sparkling)/i],
  ["Rouge", /(?<![a-zà-ÿ])(rot|red|rouge|rosso|imola|toronto|melbourne|fire ?red|sakhir ?rot|barcelona|aventurin|vermilion|burgund|bordeaux)/i],
  ["Vert", /(?<![a-zà-ÿ])(gr[uü]n|green|vert|verde|british ?racing|isle ?of ?man|java ?gr|dunkelgr|oliv|brooklands|ilbi)/i],
  ["Jaune", /(?<![a-zà-ÿ])(gelb|yellow|jaune|giallo|sao ?paulo|austin ?yellow|speed ?yellow|phoenix|dakar ?yellow)/i],
  ["Orange", /(?<![a-zà-ÿ])(orange|sakhir|fire ?orange|valencia|atlantis ?orange)/i],
  ["Brun / beige", /(?<![a-zà-ÿ])(braun|brown|marron|marrone|beige|champagne|havanna|sunset|mocca|kupfer|bronze|sand|tobacco|cognac)/i],
  ["Violet", /(?<![a-zà-ÿ])(violett?|purple|violet|viola|ametrin|techno ?violet|daytona ?violet|lila|amethyst|ultraviolet)/i],
];

const RULES_LOOSE: Array<[string, RegExp]> = RULES.map(([g, re]) => [g, new RegExp(re.source.replace("(?<![a-zà-ÿ])", ""), "i")]);

/** Famille de couleur à partir d'un libellé de couleur (champ structuré). */
export function normColor(raw: unknown): string | null {
  const s = String(raw ?? "").trim();
  if (!s || s.length > 60) return null;
  for (const [g, re] of RULES_LOOSE) if (re.test(s)) return g; // champ structuré : les mots composés (Mineralgrau…) sont acceptés
  return null;
}

/** Teintes BMW sans ambiguïté, reconnues dans un texte libre. */
const PAINT_NAMES = /(?<![a-zà-ÿ])(saphirschwarz|sapphire black|carbonschwarz|carbon black|frozen [a-z ]{3,18}|alpinwei(ss|ß)|alpine white|mineralwei(ss|ß)|brooklyn grau|brooklyn grey|dravit grau|dravit grey|donington grau|sophistograu|skyscraper grau|portim[aã]o blau|san marino blau|estoril blau|laguna seca blau|interlagos blau|tanzanitblau|yas marina|marina bay blau|isle of man gr[uü]n|british racing green|java gr[uü]n|toronto rot|imola rot|melbourne rot|fire red|sakhir orange|sao paulo gelb|austin yellow|speed yellow|daytona violet|techno violett?|ametrin|motegi rot|misano blau|thunder grau|oxidgrau|bernina grau|snapper rock blau|ruby black|aventurin rot|barcelona blau|ocean blue|storm bay|silverstone|champagne quartz|marrakesh braun|havanna|mugello rot|bluestone|frozen)/i;
const LABELLED = /(?:farbe|lackierung|lack|couleur|peinture|colou?r|paint|exterieur|exterior|außenfarbe|aussenfarbe)\s*[:=\-]?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ \-]{2,30})/i;

export function colorFromText(text: string): [string | null, string | null] {
  if (!text) return [null, null];
  const lab = text.match(LABELLED);
  if (lab) { const g = normColor(lab[1]); if (g) return [g, lab[1].trim()]; }
  const m = text.match(PAINT_NAMES);
  if (m) { const g = normColor(m[0]); if (g) return [g, m[0]]; }
  return [null, null];
}

/** Cherche un libellé de couleur de carrosserie dans une structure JSON (clé « bodyColor », « color »… hors habitacle). */
export function findColorDeep(obj: unknown, depth = 0): string | null {
  if (!obj || typeof obj !== "object" || depth > 5) return null;
  let fallback: string | null = null;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof v === "string" && v.length < 60 && /^(body|exterior|outer)?colou?r(original|name|manufacturer)?$/i.test(k) && !/interior|inner|upholster/i.test(k)) {
      if (/original|manufacturer|name/i.test(k)) return v;
      fallback = fallback ?? v;
    }
  }
  if (fallback) return fallback;
  for (const v of Object.values(obj as Record<string, unknown>)) {
    if (v && typeof v === "object") { const r = findColorDeep(v, depth + 1); if (r) return r; }
  }
  return null;
}
