/* ════════════════════════════════════════════════════════════
   Persistent per-video views & likes
   ────────────────────────────────────────────────────────────
   - Random base values are generated once per slug
   - Cached in localStorage so the same video keeps the same number
   - Views auto-increment by 1 on each watch
   - Like toggles +1 / -1 and persists
   ════════════════════════════════════════════════════════════ */

const STORE_KEY = "sj-video-stats-v1";

/* Deterministic hash so the FIRST number for a given slug is
   stable even before anyone has visited (avoids two devices
   seeing wildly different starting views).                  */
function hashString(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    /* quota / private mode — swallow silently */
  }
}

/* Generate stable base numbers from slug. */
function seedFor(slug) {
  const h = hashString(slug);
  // views: 1,200 – 480,000
  const views = 1200 + (h % 480000);
  // likes: ~3% – 12% of views
  const likeRatio = 0.03 + ((h >> 5) % 90) / 1000;
  const likes = Math.max(12, Math.round(views * likeRatio));
  return { views, likes, liked: false };
}

/* Public: get current stats for slug (does NOT mutate) */
export function getStats(slug) {
  if (!slug) return { views: 0, likes: 0, liked: false };
  const all = readAll();
  if (!all[slug]) {
    all[slug] = seedFor(slug);
    writeAll(all);
  }
  return all[slug];
}

/* Public: bump views by 1 and persist */
export function registerView(slug) {
  if (!slug) return { views: 0, likes: 0, liked: false };
  const all = readAll();
  if (!all[slug]) all[slug] = seedFor(slug);
  all[slug].views = (all[slug].views || 0) + 1;
  writeAll(all);
  return all[slug];
}

/* Public: toggle like for slug and persist */
export function toggleLike(slug) {
  if (!slug) return { views: 0, likes: 0, liked: false };
  const all = readAll();
  if (!all[slug]) all[slug] = seedFor(slug);
  const wasLiked = !!all[slug].liked;
  all[slug].liked = !wasLiked;
  all[slug].likes = Math.max(0, (all[slug].likes || 0) + (wasLiked ? -1 : 1));
  writeAll(all);
  return all[slug];
}

/* Public: pretty number formatter (1.2K, 3.4M) */
export function formatCount(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "K";
  return String(n);
}
