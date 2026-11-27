// Marks a quiz lead when she clicks through to the 40-Day Family Table, reaches checkout, or pays.
// Called by the quiz results page, the sales page and the welcome page with the lead id the submit function returned.
// Env: COACH_SLUG. Only these three events are accepted, and only for a lead that already exists.
const { getStore, connectLambda } = require("@netlify/blobs");
const EVENTS = new Set(["results_click", "checkout_click", "paid"]);
const res = (c, b) => ({ statusCode: c, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(b) });
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return res(405, { error: "POST only" });
  connectLambda(event);
  let p; try { p = JSON.parse(event.body || "{}"); } catch (e) { return res(400, { error: "Bad JSON" }); }
  const { COACH_SLUG } = process.env;
  if (COACH_SLUG && p.coach && p.coach !== COACH_SLUG) return res(403, { error: "Wrong site" });
  const id = String(p.id || ""), ev = String(p.ev || "");
  if (!/^[\w-]{10,60}$/.test(id) || !EVENTS.has(ev)) return res(400, { error: "Bad request" });
  try {
    const store = getStore("leads");
    const row = await store.get(id, { type: "json" });
    if (!row) return res(404, { error: "No such lead" });
    row.events = row.events || {};
    if (!row.events[ev]) { row.events[ev] = new Date().toISOString(); await store.setJSON(id, row); }
    return res(200, { ok: true });
  } catch (e) { return res(502, { error: "Could not update" }); }
};
