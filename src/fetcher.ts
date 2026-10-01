// Récupération de pages : cadence limitée, robots.txt respecté, détection de blocage (on s'arrête, on ne contourne pas).

export class Blocked extends Error {}
export class RobotsDisallowed extends Error {}
export class FetchError extends Error {}

const BLOCK_MARKERS = ["captcha", "access denied", "are you a robot", "unusual traffic", "pardon our interruption",
  "request blocked", "verify you are human", "zugriff verweigert", "robot check"];

export const USER_AGENT = process.env.USER_AGENT ||
  "Mozilla/5.0 (compatible; CoteSport/1.0; collecte de donnees publiques; +https://github.com/BenedeNimes/cotesport)";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Règles robots.txt minimales : User-agent: * et notre agent ; Disallow / Allow avec préfixes et jokers. */
class Robots {
  private rules: Array<{ allow: boolean; re: RegExp; len: number }> = [];
  constructor(text: string) {
    let applies = false, any = false, groupStarted = false;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.replace(/#.*/, "").trim();
      if (!line) continue;
      const i = line.indexOf(":");
      if (i < 0) continue;
      const k = line.slice(0, i).trim().toLowerCase(), v = line.slice(i + 1).trim();
      if (k === "user-agent") {
        if (groupStarted) { applies = false; groupStarted = false; }
        const ua = v.toLowerCase();
        if (ua === "*" || USER_AGENT.toLowerCase().includes(ua)) applies = true;
      } else if ((k === "disallow" || k === "allow") && applies) {
        groupStarted = true; any = true;
        if (!v) continue;
        const re = new RegExp("^" + v.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
        this.rules.push({ allow: k === "allow", re, len: v.length });
      }
    }
    void any;
  }
  can(pathAndQuery: string): boolean {
    let best: { allow: boolean; len: number } | null = null;
    for (const r of this.rules) if (r.re.test(pathAndQuery) && (!best || r.len > best.len || (r.len === best.len && r.allow))) best = r;
    return best ? best.allow : true;
  }
}

export interface FetcherOpts { delayS: number; respectRobots: boolean }

export class Fetcher {
  private last = new Map<string, number>();
  private robots = new Map<string, Robots | null>();
  constructor(private o: FetcherOpts) {}

  private async wait(host: string) {
    const delay = this.o.delayS * 1000 * (0.8 + Math.random() * 0.6);
    const gap = Date.now() - (this.last.get(host) ?? 0);
    if (gap < delay) await sleep(delay - gap);
    this.last.set(host, Date.now());
  }

  private async allowed(url: string): Promise<boolean> {
    if (!this.o.respectRobots) return true;
    const u = new URL(url);
    if (!this.robots.has(u.origin)) {
      try {
        const r = await fetch(`${u.origin}/robots.txt`, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(15000) });
        this.robots.set(u.origin, r.status === 200 ? new Robots(await r.text()) : null);
      } catch { this.robots.set(u.origin, null); }
    }
    const rb = this.robots.get(u.origin);
    return rb ? rb.can(u.pathname + u.search) : true;
  }

  async get(url: string): Promise<string> {
    if (!(await this.allowed(url))) throw new RobotsDisallowed(url);
    const host = new URL(url).host;
    await this.wait(host);
    let backoff = 5000;
    for (let attempt = 0; attempt < 3; attempt++) {
      let r: Response;
      try {
        r = await fetch(url, {
          headers: { "User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8", "Accept-Language": "de-CH,de;q=0.9,fr;q=0.8,en;q=0.6" },
          redirect: "follow", signal: AbortSignal.timeout(30000),
        });
      } catch (e) {
        if (attempt === 2) throw new FetchError(String(e));
        await sleep(backoff); backoff *= 2; continue;
      }
      if ([403, 429, 503, 451].includes(r.status)) throw new Blocked(`HTTP ${r.status} sur ${host}`);
      if (r.status >= 500 && attempt < 2) { await sleep(backoff); backoff *= 2; continue; }
      if (r.status >= 400) throw new FetchError(`HTTP ${r.status} sur ${url}`);
      const text = await r.text();
      if (text.length < 4000 && BLOCK_MARKERS.some((m) => text.slice(0, 6000).toLowerCase().includes(m))) throw new Blocked(`page de contrôle anti-robot sur ${host}`);
      return text;
    }
    throw new FetchError(url);
  }
}
