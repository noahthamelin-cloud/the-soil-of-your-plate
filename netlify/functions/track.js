// XPLR Funnel Tracking · server side · v1.0 (Nov 2026)
// Receives batches from xplr-track.js and keeps one JSON record per visit in the "events" Blobs store,
// keyed s/<YYYY-MM-DD of the visit's first event>/<session id>. No names, emails or numbers are accepted.
// Env (optional): TRACK_SITE, or the build's own COACH_SLUG / SITE_SLUG. When one is set, batches for
// any other site name are refused. Needs @netlify/blobs in package.json.
const { getStore, connectLambda } = require("@netlify/blobs");
const ok = { statusCode: 204, headers: { "Cache-Control": "no-store" }, body: "" };
const bad = (c, m) => ({ statusCode: c, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: m }) });
const clean = (v, n) => String(v == null ? "" : v).replace(/[^\w .:/@+\-·]/g, "").slice(0, n);
const NAME = /^[a-z][a-z0-9_]{1,31}$/;
const RESERVED = new Set(["e", "t", "n", "k"]);
// Visit properties that look like personal data are dropped, whatever a page sends.
const BLOCKED = /name|mail|phone|tel|whatsapp|instagram|address|card|pass/i;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return bad(405, "POST only");
  try { if (event.blobs) connectLambda(event); } catch (e) {}
  const expected = process.env.TRACK_SITE || process.env.COACH_SLUG || process.env.SITE_SLUG || "";
  let p; try { p = JSON.parse(event.body || "{}"); } catch (e) { return bad(400, "Bad JSON"); }
  const site = clean(p.site || p.coach, 40);
  if (expected && site !== expected) return bad(403, "Wrong site");
  const sid = clean(p.sid, 40);
  if (!/^[\w-]{8,40}$/.test(sid) || !Array.isArray(p.ev) || !p.ev.length) return bad(400, "Bad batch");
  const day = /^\d{4}-\d{2}-\d{2}$/.test(p.day || "") ? p.day : new Date().toISOString().slice(0, 10);

  const store = getStore("events");
  const key = `s/${day}/${sid}`;
  let s = null;
  try { s = await store.get(key, { type: "json" }); } catch (e) {}
  const now = new Date().toISOString();
  s = s || { v: 1, site, sid, vid: clean(p.vid, 40), day, first: now, src: clean(p.src, 60) || "direct", cmp: clean(p.cmp, 60), dev: clean(p.dev, 10), steps: {}, cnt: {}, q: 0, p: {} };
  s.cnt = s.cnt || {}; s.p = s.p || {}; s.steps = s.steps || {};
  s.last = now;

  for (const ev of p.ev.slice(0, 80)) {
    if (!ev || (ev.e !== "q" && !NAME.test(ev.e || ""))) continue;
    const e = ev.e;
    if (e === "q") { const n = Math.max(0, Math.min(60, parseInt(ev.n, 10) || 0)); if (n > s.q) s.q = n; continue; }
    if (!s.steps[e]) s.steps[e] = clean(ev.t, 30) || now;
    if (Object.keys(s.cnt).length < 300) {
      s.cnt[e] = (s.cnt[e] || 0) + 1;
      if (ev.k) { const ck = e + ":" + clean(ev.k, 24); s.cnt[ck] = (s.cnt[ck] || 0) + 1; }
    }
    for (const [pk, pv] of Object.entries(ev)) {
      if (RESERVED.has(pk) || BLOCKED.test(pk) || !/^[a-z]{1,12}$/i.test(pk)) continue;
      if (typeof pv !== "string" && typeof pv !== "number") continue;
      if (Object.keys(s.p).length < 20 || pk in s.p) s.p[pk] = typeof pv === "number" ? pv : clean(pv, 40);
    }
  }
  try { await store.setJSON(key, s); } catch (e) { return bad(502, "Could not save"); }
  return ok;
};
