// XPLR Funnel Tracking · admin read · v1.0 (Nov 2026)
// Checks the build's admin PIN, then returns the anonymous visit records for a date range, trimmed for
// xplr-funnel.js. The admin page does the counting, so its filters are instant.
// Env: ADMIN_PIN (the same PIN the build's admin already uses). Reads the "events" Blobs store.
const { getStore, connectLambda } = require("@netlify/blobs");
const json = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) });
const MAX = 5000;   // visits per request; past this the oldest in range are left out and the response says so

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  try { if (event.blobs) connectLambda(event); } catch (e) {}
  const { ADMIN_PIN } = process.env;
  if (!ADMIN_PIN) return json(500, { error: "Admin is not configured. Set ADMIN_PIN." });
  let p; try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  if (String(p.pin || "").trim() !== String(ADMIN_PIN)) { await new Promise(r => setTimeout(r, 600)); return json(401, { error: "That PIN isn’t right." }); }

  const days = Math.max(1, Math.min(3650, parseInt(p.days, 10) || 30));
  const from = new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10);
  try {
    const store = getStore("events");
    const { blobs } = await store.list({ prefix: "s/" });
    let keys = blobs.map(b => b.key).filter(k => k.slice(2, 12) >= from).sort().reverse();
    const truncated = keys.length > MAX; keys = keys.slice(0, MAX);
    const out = [];
    for (let i = 0; i < keys.length; i += 100) {
      const part = await Promise.all(keys.slice(i, i + 100).map(k => store.get(k, { type: "json" }).catch(() => null)));
      for (const s of part) if (s) out.push({ d: s.day, src: s.src || "direct", cmp: s.cmp || "", dev: s.dev, st: Object.keys(s.steps || {}), q: s.q || 0, cnt: s.cnt || {}, p: s.p || {}, v: s.vid });
    }
    return json(200, { from, days, truncated, sessions: out });
  } catch (e) { return json(502, { error: "Could not read the analytics store: " + String(e.message || e) }); }
};
