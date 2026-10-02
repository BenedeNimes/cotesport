// Worker Cloudflare : sert l'application (dossier web/, via la liaison ASSETS) et relaie /api/* vers la fonction Neon,
// qui reste le seul accès à la base (même base Neon qu'avant). Aucune donnée n'est stockée côté Cloudflare.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/") || url.pathname === "/healthz") {
      const target = new URL(url.pathname + url.search, env.API_ORIGIN);
      const headers = new Headers(request.headers);
      headers.delete("host");
      const init = { method: request.method, headers, redirect: "manual" };
      if (request.method !== "GET" && request.method !== "HEAD") init.body = request.body;
      const r = await fetch(target, init);
      const out = new Response(r.body, r);
      out.headers.set("cache-control", "no-store");
      return out;
    }
    return env.ASSETS.fetch(request);
  },
};
