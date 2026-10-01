// Fonction de démarrage Neon : charge le bundle de CoteSport depuis GitHub et vérifie son empreinte SHA-256
// avant de l'exécuter. Variables : BUNDLE_URL, BUNDLE_SHA256 (+ celles de l'application : APP_TOKEN, etc.).
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
let app = null;
async function load() {
  if (app) return app;
  const url = process.env.BUNDLE_URL, want = (process.env.BUNDLE_SHA256 || "").toLowerCase();
  if (!url || !want) throw new Error("BUNDLE_URL / BUNDLE_SHA256 manquants");
  const r = await fetch(url);
  if (!r.ok) throw new Error("bundle introuvable : HTTP " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  const got = createHash("sha256").update(buf).digest("hex");
  if (got !== want) throw new Error("empreinte du bundle inattendue : " + got);
  const file = `/tmp/cotesport-${got.slice(0, 12)}.mjs`;
  writeFileSync(file, buf);
  app = (await import("file://" + file)).default;
  return app;
}
export default { fetch: async (req) => (await load()).fetch(req) };
