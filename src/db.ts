import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

let _sql: Sql | null = null;

/** Connexion unique, réutilisée par toutes les requêtes de l'isolat (pool petit : les connexions s'additionnent entre isolats). */
export function db(): Sql {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL manquante");
  _sql = postgres(url, {
    max: 4, prepare: false, idle_timeout: 20, connect_timeout: 30, onnotice: () => {},
    types: {
      bigint: { to: 20, from: [20], parse: (v: string) => Number(v), serialize: (v: unknown) => String(v) },
      numeric: { to: 1700, from: [1700], parse: (v: string) => parseFloat(v), serialize: (v: unknown) => String(v) },
      date: { to: 1082, from: [1082], parse: (v: string) => v, serialize: (v: unknown) => String(v) },
    },
  });
  return _sql;
}
