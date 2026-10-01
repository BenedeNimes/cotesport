// Algèbre linéaire minimale (matrices petites : quelques dizaines de colonnes) et tirages aléatoires reproductibles.

export type Mat = number[][];

export const zeros = (n: number, m: number): Mat => Array.from({ length: n }, () => new Array(m).fill(0));
export const eye = (n: number): Mat => { const a = zeros(n, n); for (let i = 0; i < n; i++) a[i][i] = 1; return a; };

export function matmul(a: Mat, b: Mat): Mat {
  const n = a.length, k = b.length, m = b[0].length, out = zeros(n, m);
  for (let i = 0; i < n; i++) for (let l = 0; l < k; l++) { const v = a[i][l]; if (v === 0) continue; for (let j = 0; j < m; j++) out[i][j] += v * b[l][j]; }
  return out;
}

export function xtx(X: Mat): Mat {
  const p = X[0].length, out = zeros(p, p);
  for (const row of X) for (let i = 0; i < p; i++) { const v = row[i]; if (v === 0) continue; for (let j = i; j < p; j++) out[i][j] += v * row[j]; }
  for (let i = 0; i < p; i++) for (let j = 0; j < i; j++) out[i][j] = out[j][i];
  return out;
}

export function xty(X: Mat, y: number[]): number[] {
  const p = X[0].length, out = new Array(p).fill(0);
  for (let r = 0; r < X.length; r++) for (let i = 0; i < p; i++) out[i] += X[r][i] * y[r];
  return out;
}

/** Inverse par Gauss-Jordan avec pivot partiel ; null si singulière. */
export function inverse(A: Mat): Mat | null {
  const n = A.length;
  const M = A.map((r, i) => [...r, ...eye(n)[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (Math.abs(M[piv][c]) < 1e-12) return null;
    [M[c], M[piv]] = [M[piv], M[c]];
    const d = M[c][c];
    for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j];
    }
  }
  return M.map((r) => r.slice(n));
}

export function matvec(A: Mat, v: number[]): number[] { return A.map((r) => r.reduce((s, x, i) => s + x * v[i], 0)); }
export const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const quad = (x: number[], A: Mat) => dot(x, matvec(A, x));

/** Cholesky (L tel que L Lᵀ = A) ; ajoute un peu de diagonale si A n'est pas strictement définie positive. */
export function cholesky(A: Mat): Mat {
  const n = A.length;
  for (let jitter = 1e-12; jitter < 1; jitter *= 100) {
    const L = zeros(n, n);
    let ok = true;
    for (let i = 0; i < n && ok; i++) {
      for (let j = 0; j <= i; j++) {
        let s = A[i][j] + (i === j ? jitter : 0);
        for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
        if (i === j) { if (s <= 0) { ok = false; break; } L[i][j] = Math.sqrt(s); } else L[i][j] = s / L[j][j];
      }
    }
    if (ok) return L;
  }
  return eye(n);
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function normal(rng: () => number): number {
  const u = Math.max(rng(), 1e-12), v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Percentile par interpolation linéaire (comme numpy). */
export function percentile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * (q / 100), lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export function median(v: number[]): number {
  if (!v.length) return NaN;
  const s = [...v].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export const std = (v: number[]) => { const m = v.reduce((a, b) => a + b, 0) / v.length; return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length); };
