import fs from "fs";
const files = { "/index.html": "text/html; charset=utf-8", "/app.js": "text/javascript; charset=utf-8", "/style.css": "text/css; charset=utf-8", "/manifest.json": "application/manifest+json", "/sw.js": "text/javascript; charset=utf-8", "/icon.svg": "image/svg+xml", "/leasing.html": "text/html; charset=utf-8", "/import.html": "text/html; charset=utf-8" };
const out = {};
for (const [p, t] of Object.entries(files)) out[p] = { t, b: fs.readFileSync("web" + p, "utf8") };
fs.writeFileSync("src/webassets.ts", "// généré par scripts_genweb.mjs — ne pas éditer\nexport const WEB: Record<string, { t: string; b: string }> = " + JSON.stringify(out) + ";\n");
