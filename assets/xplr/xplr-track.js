/* =====================================================================
   XPLR Funnel Tracking · browser side · v1.0 (Nov 2026)
   Anonymous step tracking for any XPLR build. Sends step names only, never names,
   emails or numbers, to the build's own Netlify function (functions/track.js).

   Use:
     <script src="/assets/xplr/xplr-track.js"></script>
     <script>const T = XPLRTrack.init({ site: "calibrex" });   T.step("land");</script>

   API
     T.step(name, extra?, now?)  one step. Most names count once per visit; "q" and
                                 names listed in init({ repeat }) are sent every time.
                                 extra: { n } for "q" (question number), { k } for a label
                                 (counted as name:k), any other short fields become visit
                                 properties (for example { r: "01A", st: "plateaued" }).
                                 now = true sends straight away (use on the big steps).
     T.whenSeen(el, name)        step once when an element scrolls into view.
     T.watchVideo(iframe, name)  step once when a YouTube player starts playing
                                 (the iframe src needs enablejsapi=1&origin=...).
     T.scan(root?)               wire data-track / data-track-seen attributes inside root
                                 (call after re-rendering a section).
     T.flush()                   send now. Also runs on page hide.
   No-code attributes (good for one-page sites):
     <a data-track="whatsapp_click" ...>     step on click
     <a data-track="jotform_click" data-track-k="quote">  step + label
     <section data-track-seen="menu_view">   step when it scrolls into view
   Opt-out for testing: open the page once with ?notrack=1 (undo with ?notrack=0).
   Any XPLR admin that uses xplr-funnel.js sets this automatically on sign-in.
   ===================================================================== */
(function (w) {
  "use strict";
  function init(opts) {
    opts = opts || {};
    const site = String(opts.site || "site");
    const endpoint = opts.endpoint || "/.netlify/functions/track";
    const idle = (opts.idleMinutes || 30) * 60e3;
    const repeat = new Set(["q"].concat(opts.repeat || []));
    const rid = () => ((w.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/[^\w-]/g, "").slice(0, 32);
    let off = false, vid = "", sess = null;
    try {
      if (/[?&]notrack=1\b/.test(location.search)) localStorage.setItem("xplr-notrack", "1");
      if (/[?&]notrack=0\b/.test(location.search)) localStorage.removeItem("xplr-notrack");
      off = localStorage.getItem("xplr-notrack") === "1" || localStorage.getItem("ica-notrack") === "1";
      vid = localStorage.getItem("xplr-vid") || rid(); localStorage.setItem("xplr-vid", vid);
      sess = JSON.parse(sessionStorage.getItem("xplr-sess-" + site) || "null");
    } catch (e) {}
    if (!vid) vid = rid();
    if (!sess || Date.now() - sess.at > idle) {
      const q = new URLSearchParams(location.search);
      let ref = ""; try { ref = new URL(document.referrer).hostname.replace(/^(www|l|lm|m)\./, ""); } catch (e) {}
      const src = (q.get("utm_source") || q.get("src") || (ref && ref !== location.hostname ? ref.split(".")[0] : "") || "direct").toLowerCase().slice(0, 40);
      sess = { sid: rid(), day: new Date().toISOString().slice(0, 10), src, cmp: (q.get("utm_campaign") || "").slice(0, 40), seen: {} };
    }
    const dev = w.matchMedia && matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    let queue = [];
    const keep = () => { sess.at = Date.now(); try { sessionStorage.setItem("xplr-sess-" + site, JSON.stringify(sess)); } catch (e) {} };

    function flush() {
      if (off || !queue.length) return;
      const body = JSON.stringify({ site, coach: site, sid: sess.sid, vid, day: sess.day, src: sess.src, cmp: sess.cmp, dev, ev: queue });
      queue = [];
      try { if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }))) return; } catch (e) {}
      try { fetch(endpoint, { method: "POST", body, keepalive: true }); } catch (e) {}
    }
    function step(e, extra, now) {
      if (off || !e) return;
      extra = extra || {};
      const id = e === "q" ? "q" + extra.n : e;
      if (e === "q" ? sess.seen[id] : (!repeat.has(e) && sess.seen[id])) return;
      sess.seen[id] = 1; keep();
      queue.push(Object.assign({ e, t: new Date().toISOString() }, extra));
      if (now || queue.length >= 8) flush();
    }
    function whenSeen(el, e) {
      if (!el || off) return;
      if (!("IntersectionObserver" in w)) return step(e);
      const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { step(e); io.disconnect(); } }), { threshold: .35 });
      io.observe(el);
    }
    const players = new Map();
    w.addEventListener("message", m => {
      let host = ""; try { host = new URL(m.origin).hostname; } catch (e) {}
      if (!/youtube(-nocookie)?\.com$/.test(host)) return;
      let d; try { d = typeof m.data === "string" ? JSON.parse(m.data) : m.data; } catch (e) { return; }
      const name = players.get(m.source);
      const st = d && (d.event === "onStateChange" ? d.info : d.info && d.info.playerState);
      if (name && st === 1) { step(name, null, true); players.delete(m.source); }
    });
    function watchVideo(iframe, e) {
      if (!iframe || off) return;
      const hello = () => { players.set(iframe.contentWindow, e); try { iframe.contentWindow.postMessage(JSON.stringify({ event: "listening", id: e, channel: "widget" }), "*"); } catch (_) {} };
      iframe.addEventListener("load", () => { hello(); setTimeout(hello, 1500); });
    }
    function scan(root) {
      root = root || document;
      root.querySelectorAll("[data-track-seen]").forEach(el => { if (el.__xt) return; el.__xt = 1; whenSeen(el, el.dataset.trackSeen); });
    }
    document.addEventListener("click", ev => {
      const el = ev.target.closest && ev.target.closest("[data-track]");
      if (el) step(el.dataset.track, el.dataset.trackK ? { k: el.dataset.trackK } : null, el.tagName === "A");
    }, true);
    w.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
    w.addEventListener("pagehide", flush);
    if (document.readyState !== "loading") scan(); else document.addEventListener("DOMContentLoaded", () => scan());
    return { step, flush, whenSeen, watchVideo, scan, off: () => off, session: () => ({ sid: sess.sid, src: sess.src }) };
  }
  w.XPLRTrack = { init, version: "1.0" };
})(window);
