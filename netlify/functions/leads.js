// Admin API. Checks the PIN, then returns every lead in this site's Blobs store.
// Env vars: ADMIN_PIN (what the coach types to sign in), COACH_SLUG, optional COACH_NAME.
const { getStore, connectLambda } = require("@netlify/blobs");
const json = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  connectLambda(event);   // required for classic (Lambda-style) functions to reach Netlify Blobs
  const { ADMIN_PIN, COACH_SLUG, COACH_NAME } = process.env;
  if (!ADMIN_PIN) return json(500, { error: "Admin is not configured. Set ADMIN_PIN." });
  let p; try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const pin = String(p.pin || "").trim();
  if (!pin || pin !== String(ADMIN_PIN)) {
    await new Promise(r => setTimeout(r, 600)); // slow down guessing
    return json(401, { error: "That PIN isn\u2019t right." });
  }
  /* Delete one lead (admin only, behind the same PIN). Removes it from the store for good. */
  if (p.action === "delete") {
    const id = String(p.id || "");
    if (!/^[\w-]{10,60}$/.test(id)) return json(400, { error: "Bad lead id" });
    try {
      const store = getStore("leads");
      const row = await store.get(id, { type: "json" });
      if (!row) return json(404, { error: "That lead is already gone." });
      await store.delete(id);
      return json(200, { deleted: id });
    } catch (e) { return json(502, { error: "Could not delete the lead", detail: String(e.message || e) }); }
  }
  try {
    const store = getStore("leads");
    const { blobs } = await store.list();
    const keys = blobs.map(b => b.key).sort().reverse().slice(0, 2000);   // newest first (keys start with the timestamp)
    const leads = (await Promise.all(keys.map(k => store.get(k, { type: "json" }).catch(() => null)))).filter(Boolean);
    return json(200, { coach: { slug: COACH_SLUG || "coach", name: COACH_NAME || COACH_SLUG || "Leads" }, leads });
  } catch (e) { return json(502, { error: "Could not read the leads store", detail: String(e.message || e) }); }
};
