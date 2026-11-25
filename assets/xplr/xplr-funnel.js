/* =====================================================================
   XPLR Funnel Tracking · admin panel · v1.0 (Nov 2026)
   Draws the Funnel view from functions/stats.js. Each build passes its own steps and sections;
   the panel does the counting, filters and layout. Styles use the build's CSS variables when they
   exist (--ink, --panel, --hairline, --steel, --verdant, --porcelain, --display, --mono).

   XPLRFunnel.mount(el, {
     pin: () => session.pin,                      // the admin PIN, or a function returning it
     steps: [ { e:"land", label:"Landed", group:"Arrive" },
              { q:1, label:"Answered Q01", sub:"06:30 · Energy" }, ... ],   // in order; q = question number
     tiles: [ { label:"Visits", step:"land" }, { label:"Started", step:"start", of:"land" } ],
     engagement: { title:"On the results page", base:"results_view", items:[["Opened a cause","cause_open"], ...] },
     breakdowns: [ { title:"By source", key:"src", cols:[["Visits","land"],["Leads","gate_submit"],["Booked","booked"]], rate:["Lead rate","gate_submit","land"] },
                   { title:"By result", key:"p.r", label: v => v, cols:[...] } ],
     tops: [ { title:"Most opened causes", event:"cause_open", by:"p.r", label:(k, by) => by + " · " + k } ],
     note: "Optional line under everything."
   })
   Signing in to an admin that mounts this also stops that browser being counted.
   ===================================================================== */
(function (w) {
  "use strict";
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  const pct = (a, b) => b ? Math.round(a / b * 100) + "%" : "–";
  const CSS = `
.xf{--xf-ink:var(--ink,#171D1A);--xf-panel:var(--panel,#fff);--xf-line:var(--hairline,#D3DAD6);--xf-muted:var(--steel,#5D6862);--xf-accent:var(--verdant,#1E6B4E);--xf-bg:var(--porcelain,#F3F4F2);--xf-display:var(--display,inherit);--xf-mono:var(--mono,ui-monospace,Menlo,monospace)}
.xf .xf-ctl{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}
.xf select{width:100%;background:var(--xf-panel);border:1px solid var(--xf-line);padding:10px 12px;min-height:44px;font:inherit;color:inherit}
.xf .xf-tiles{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--xf-line);background:var(--xf-panel);margin:0 0 20px}
.xf .xf-tile{padding:12px 14px;border-left:1px solid var(--xf-line)}
.xf .xf-tile:first-child{border-left:0}
.xf .xf-tile b{display:block;font-family:var(--xf-display);font-stretch:125%;font-weight:600;font-size:28px;line-height:1}
.xf .xf-tile span{font-family:var(--xf-mono);font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--xf-muted)}
@media (max-width:520px){.xf .xf-tiles{grid-template-columns:1fr 1fr}.xf .xf-tile:nth-child(3){border-left:0}.xf .xf-tile:nth-child(n+3){border-top:1px solid var(--xf-line)}}
.xf h3{font-family:var(--xf-mono);font-weight:400;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--xf-muted);margin:0 0 10px}
.xf .xf-fn{border:1px solid var(--xf-line);background:var(--xf-panel);margin:0 0 22px}
.xf .xf-r{display:grid;grid-template-columns:minmax(0,1fr) 56px 76px;gap:4px 10px;align-items:center;padding:8px 14px;border-top:1px solid var(--xf-line);font-size:13.5px}
.xf .xf-r:first-child{border-top:0}
.xf .xf-r small{display:block;color:var(--xf-muted);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.xf .xf-bar{grid-column:1/-1;height:6px;background:var(--xf-bg);position:relative}
.xf .xf-bar i{position:absolute;left:0;top:0;bottom:0;background:var(--xf-accent)}
.xf .xf-n{font-family:var(--xf-display);font-stretch:125%;font-weight:600;font-size:16px;text-align:right}
.xf .xf-d{font-family:var(--xf-mono);font-size:10px;color:var(--xf-muted);text-align:right}
.xf .xf-r.worst{background:#fff;box-shadow:inset 3px 0 0 var(--xf-ink)}
.xf .xf-r.worst .xf-d{color:var(--xf-ink);font-weight:600}
.xf .xf-r.grp{background:var(--xf-bg);font-family:var(--xf-mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--xf-muted);padding:7px 14px}
.xf table{width:100%;border-collapse:collapse;border:1px solid var(--xf-line);background:var(--xf-panel);font-size:13px;margin:0 0 22px}
.xf th,.xf td{padding:8px 10px;border-top:1px solid var(--xf-line);text-align:right}
.xf th{font-family:var(--xf-mono);font-weight:400;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--xf-muted);border-top:0}
.xf td:first-child,.xf th:first-child{text-align:left}
.xf .xf-note{font-size:12.5px;color:var(--xf-muted);margin:-12px 0 22px}
.xf .xf-empty{text-align:center;color:var(--xf-muted);padding:40px 12px}`;

  function mount(el, cfg) {
    if (!document.getElementById("xf-css")) { const st = document.createElement("style"); st.id = "xf-css"; st.textContent = CSS; document.head.appendChild(st); }
    try { localStorage.setItem("xplr-notrack", "1"); } catch (e) {}
    el.classList.add("xf");
    const view = { days: 30, src: "", dev: "" }, cache = {};
    const pin = () => typeof cfg.pin === "function" ? cfg.pin() : cfg.pin;
    const steps = cfg.steps || [];
    const has = (s, e) => s.st.includes(e) || (s.cnt && s.cnt[e] > 0);
    const hit = (s, st) => st.q ? s.q >= st.q : has(s, st.e);
    const reach = s => { let m = -1; steps.forEach((st, i) => { if (hit(s, st)) m = i; }); return m; };
    const idx = e => steps.findIndex(st => st.e === e);
    const val = (s, key) => key.startsWith("p.") ? (s.p || {})[key.slice(2)] : s[key];

    async function load() {
      const k = String(view.days);
      if (!cache[k]) {
        el.innerHTML = `<p class="xf-empty">Loading the funnel</p>`;
        try {
          const r = await fetch(cfg.statsUrl || "/.netlify/functions/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin: pin(), days: view.days }) });
          const j = await r.json().catch(() => ({}));
          if (!r.ok) { el.innerHTML = `<p class="xf-empty">${esc(j.error || "Couldn’t load the funnel.")}</p>`; return; }
          cache[k] = j;
        } catch (e) { el.innerHTML = `<p class="xf-empty">Couldn’t reach the server.</p>`; return; }
      }
      draw(cache[k]);
    }

    function draw(F) {
      const all = F.sessions || [];
      const srcs = [...new Set(all.map(x => x.src || "direct"))].sort();
      const S = all.filter(x => (!view.src || (x.src || "direct") === view.src) && (!view.dev || x.dev === view.dev));
      const R = S.map(reach);
      const counts = steps.map((_, i) => R.filter(m => m >= i).length);
      const count = e => { const i = idx(e); return i < 0 ? S.filter(s => has(s, e)).length : counts[i]; };
      const base = counts[0] || 0;
      let worst = -1, worstLoss = 0;
      counts.forEach((c, i) => { if (i < 2) return; const loss = counts[i - 1] - c; if (loss > worstLoss) { worstLoss = loss; worst = i; } });

      const rows = steps.map((st, i) => {
        const prev = i ? counts[i - 1] : counts[i], loss = prev - counts[i];
        return (st.group ? `<div class="xf-r grp">${esc(st.group)}</div>` : "") +
          `<div class="xf-r ${i === worst ? "worst" : ""}"><div>${esc(st.label)}${st.sub ? `<small>${esc(st.sub)}</small>` : ""}</div><div class="xf-n">${counts[i]}</div>` +
          `<div class="xf-d">${i ? (loss ? "−" + loss + " · " + pct(loss, prev) : "–") : pct(counts[i], base)}</div><div class="xf-bar"><i style="width:${base ? counts[i] / base * 100 : 0}%"></i></div></div>`;
      }).join("");

      const tiles = (cfg.tiles || []).map(t => `<div class="xf-tile"><b>${t.of ? pct(count(t.step), count(t.of)) : count(t.step)}</b><span>${esc(t.label)}</span></div>`).join("");

      let eng = "";
      if (cfg.engagement) {
        const E = cfg.engagement, pool = E.base ? S.filter(s => reach(s) >= idx(E.base) && idx(E.base) >= 0 || has(s, E.base)) : S;
        eng = `<h3>${esc(E.title || "Engagement")} (${pool.length})</h3><table><tr><th>Did this</th><th>Visits</th><th>Share</th></tr>` +
          E.items.map(([l, e]) => { const n = pool.filter(s => has(s, e)).length; return `<tr><td>${esc(l)}</td><td>${n}</td><td>${pct(n, pool.length)}</td></tr>`; }).join("") + `</table>`;
      }

      const bds = (cfg.breakdowns || []).map(b => {
        const pool = b.key === "src" ? all.filter(x => !view.dev || x.dev === view.dev) : S;
        const groups = [...new Set(pool.map(s => val(s, b.key)).filter(v => v !== undefined && v !== null && v !== ""))];
        const rowsB = groups.map(g => {
          const G = pool.filter(s => val(s, b.key) === g), RG = G.map(reach);
          const c = e => { const i = idx(e); return i < 0 ? G.filter(s => has(s, e)).length : RG.filter(m => m >= i).length; };
          return { g, n: G.length, cells: b.cols.map(([, e]) => c(e)), rate: b.rate ? pct(c(b.rate[1]), c(b.rate[2])) : null };
        }).sort((a, z) => z.n - a.n);
        return `<h3>${esc(b.title)}</h3><table><tr><th>${esc(b.head || b.title.replace(/^By /, ""))}</th>${b.cols.map(([l]) => `<th>${esc(l)}</th>`).join("")}${b.rate ? `<th>${esc(b.rate[0])}</th>` : ""}</tr>` +
          (rowsB.map(r => `<tr><td>${esc(b.label ? b.label(r.g) : r.g)}</td>${r.cells.map(n => `<td>${n}</td>`).join("")}${r.rate !== null ? `<td>${r.rate}</td>` : ""}</tr>`).join("") ||
          `<tr><td colspan="${b.cols.length + 2}">Nothing yet.</td></tr>`) + `</table>`;
      }).join("");

      const tops = (cfg.tops || []).map(t => {
        const acc = {};
        S.forEach(s => Object.keys(s.cnt || {}).forEach(ck => { if (!ck.startsWith(t.event + ":")) return; const k = ck.slice(t.event.length + 1); const by = t.by ? val(s, t.by) : ""; const key = by + "\u0001" + k; acc[key] = (acc[key] || 0) + 1; }));
        const list = Object.entries(acc).sort((a, z) => z[1] - a[1]).slice(0, t.limit || 10);
        return `<h3>${esc(t.title)}</h3><table><tr><th>${esc(t.head || "Item")}</th><th>Visits</th></tr>` +
          (list.map(([key, n]) => { const [by, k] = key.split("\u0001"); return `<tr><td>${esc(t.label ? t.label(k, by) : k)}</td><td>${n}</td></tr>`; }).join("") || `<tr><td colspan="2">None yet.</td></tr>`) + `</table>`;
      }).join("");

      const mob = S.filter(x => x.dev === "mobile").length;
      el.innerHTML = `
        <div class="xf-ctl">
          <select data-f="days">${[[7, "Last 7 days"], [30, "Last 30 days"], [90, "Last 90 days"], [365, "Last 12 months"]].map(([v, l]) => `<option value="${v}" ${view.days == v ? "selected" : ""}>${l}</option>`).join("")}</select>
          <select data-f="src"><option value="">All sources</option>${srcs.map(x => `<option ${view.src === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select>
          <select data-f="dev"><option value="">All devices</option><option value="mobile" ${view.dev === "mobile" ? "selected" : ""}>Mobile</option><option value="desktop" ${view.dev === "desktop" ? "selected" : ""}>Desktop</option></select>
        </div>
        ${tiles ? `<div class="xf-tiles">${tiles}</div>` : ""}
        ${base ? "" : `<p class="xf-note" style="margin-top:0">No visits in this range yet. Browsers signed in to this admin are not counted, so test from another phone, or open the page once with ?notrack=0 to count this one again.</p>`}
        ${F.truncated ? `<p class="xf-note" style="margin-top:0">Showing the most recent 5,000 visits in this range.</p>` : ""}
        <h3>Where people drop off</h3>
        <div class="xf-fn">${rows}</div>
        ${worst > 0 ? `<p class="xf-note">Biggest drop: ${esc(steps[worst].label)}${steps[worst].sub ? ` (${esc(steps[worst].sub)})` : ""}, ${worstLoss} ${worstLoss === 1 ? "visit" : "visits"} lost.</p>` : ""}
        ${eng}${bds}${tops}
        <p class="xf-note" style="margin-top:0">${mob} of ${S.length} visits on mobile. Source comes from the link's utm_source tag, or the site they came from. Tag every link you share, for example ?utm_source=instagram.${cfg.note ? " " + esc(cfg.note) : ""}</p>`;
      el.querySelector('[data-f="days"]').onchange = e => { view.days = +e.target.value; load(); };
      el.querySelector('[data-f="src"]').onchange = e => { view.src = e.target.value; draw(F); };
      el.querySelector('[data-f="dev"]').onchange = e => { view.dev = e.target.value; draw(F); };
    }
    load();
    return { reload: () => { Object.keys(cache).forEach(k => delete cache[k]); load(); } };
  }
  w.XPLRFunnel = { mount, version: "1.0" };
})(window);
