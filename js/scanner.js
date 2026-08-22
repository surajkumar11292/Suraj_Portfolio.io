/* ══════════════════════════════════════════════════════════════
   SITESHIELD LIVE DEMO — engine
   Interactive, in-browser demonstration of SiteShield's methodology.
   Real: URL parsing + scheme analysis. Demonstrated: header/cookie/TLS
   findings are generated deterministically per-domain to illustrate the
   kind of report the full backend produces. No third-party servers are
   contacted from this page.
════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var root = document.getElementById("sx-root");
  if (!root) return;

  var $ = function (s) { return root.querySelector(s); };
  var input   = $("#sx-url");
  var runBtn  = $("#sx-run");
  var errorEl = $("#sx-error");
  var stage   = $("#sx-stage");
  var consoleEl = $("#sx-console");
  var catsEl   = $("#sx-cats");
  var reduce  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var running = false;

  /* ── deterministic PRNG seeded from the hostname ── */
  function makeRng(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i); h = Math.imul(h, 16777619);
    }
    return function () {
      h += 0x6D2B79F5; var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var KNOWN_GOOD = ["github.com", "cloudflare.com", "google.com", "mozilla.org", "vercel.com"];

  /* ── check catalogue with real remediation guidance ── */
  var CATALOGUE = [
    { id: "transport", icon: "\uD83D\uDD12", label: "Transport Security", desc: "TLS / HTTPS enforcement",
      checks: [
        { key: "https", name: "HTTPS enforced",
          pass: { d: "Connection served over TLS.", f: null },
          fail: { d: "Site is reachable over plaintext HTTP \u2014 traffic can be read or modified in transit.",
                  f: "Force a 301 redirect from http:// to https:// and serve every asset over TLS." } },
        { key: "tls", name: "Modern TLS version",
          pass: { d: "Negotiated TLS 1.3 with a forward-secret cipher suite.", f: null },
          warn: { d: "Accepts TLS 1.1/1.2 alongside 1.3 \u2014 legacy protocols still enabled.",
                  f: "Disable TLS 1.0/1.1 and prefer ECDHE cipher suites for forward secrecy." } },
        { key: "hsts", name: "HSTS header",
          pass: { d: "Strict-Transport-Security present with a long max-age.", f: null },
          fail: { d: "No Strict-Transport-Security header \u2014 first requests can be downgraded.",
                  f: "Send Strict-Transport-Security: max-age=63072000; includeSubDomains; preload." } }
      ]
    },
    { id: "headers", icon: "\u2318", label: "Security Headers", desc: "Browser hardening directives",
      checks: [
        { key: "csp", name: "Content-Security-Policy",
          pass: { d: "CSP present, restricting script and object sources.", f: null },
          fail: { d: "No Content-Security-Policy \u2014 the strongest defence against XSS is missing.",
                  f: "Define a CSP starting with default-src 'self'; tighten script-src and avoid 'unsafe-inline'." } },
        { key: "xfo", name: "X-Frame-Options / frame-ancestors",
          pass: { d: "Framing restricted \u2014 clickjacking mitigated.", f: null },
          warn: { d: "No framing protection \u2014 page can be embedded in a hostile iframe.",
                  f: "Set X-Frame-Options: DENY or a CSP frame-ancestors 'self' directive." } },
        { key: "xcto", name: "X-Content-Type-Options",
          pass: { d: "nosniff set \u2014 MIME-type confusion blocked.", f: null },
          warn: { d: "Missing nosniff \u2014 browsers may MIME-sniff responses.",
                  f: "Add X-Content-Type-Options: nosniff to every response." } },
        { key: "ref", name: "Referrer-Policy",
          pass: { d: "Referrer-Policy limits leaked navigation data.", f: null },
          warn: { d: "No Referrer-Policy \u2014 full URLs may leak to third parties.",
                  f: "Set Referrer-Policy: strict-origin-when-cross-origin." } }
      ]
    },
    { id: "cookies", icon: "\uD83C\uDF6A", label: "Cookie Security", desc: "Session cookie attributes",
      checks: [
        { key: "secure", name: "Secure attribute",
          pass: { d: "Cookies flagged Secure \u2014 never sent over HTTP.", f: null },
          fail: { d: "Session cookie missing the Secure flag \u2014 can traverse plaintext.",
                  f: "Append; Secure to every Set-Cookie so cookies are HTTPS-only." } },
        { key: "httponly", name: "HttpOnly attribute",
          pass: { d: "HttpOnly set \u2014 cookies hidden from JavaScript.", f: null },
          fail: { d: "Session cookie readable by JavaScript \u2014 stealable via XSS.",
                  f: "Add; HttpOnly so document.cookie cannot expose session tokens." } },
        { key: "samesite", name: "SameSite attribute",
          pass: { d: "SameSite=Lax/Strict \u2014 CSRF surface reduced.", f: null },
          warn: { d: "SameSite not set \u2014 cookies sent on cross-site requests.",
                  f: "Set SameSite=Lax (or Strict for sensitive sessions)." } }
      ]
    },
    { id: "exposure", icon: "\u26A0", label: "Information Exposure", desc: "Fingerprinting surface",
      checks: [
        { key: "server", name: "Server / version banner",
          pass: { d: "Server banner suppressed \u2014 stack not advertised.", f: null },
          warn: { d: "Server header leaks software and version \u2014 aids targeted exploits.",
                  f: "Strip or genericise the Server header at the proxy layer." } },
        { key: "powered", name: "X-Powered-By header",
          pass: { d: "No framework fingerprint exposed.", f: null },
          warn: { d: "X-Powered-By advertises the backend framework.",
                  f: "Remove X-Powered-By (e.g. app.disable('x-powered-by') in Express)." } }
      ]
    }
  ];

  /* ── URL parsing (this part is real) ── */
  function parseTarget(raw) {
    raw = (raw || "").trim();
    if (!raw) return null;
    if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    try {
      var u = new URL(raw);
      if (!u.hostname || u.hostname.indexOf(".") === -1) return null;
      return { href: u.href, host: u.hostname, https: u.protocol === "https:", proto: u.protocol };
    } catch (e) { return null; }
  }

  /* ── decide the outcome of each check, deterministically ── */
  function evaluate(target) {
    var rng = makeRng(target.host);
    var good = KNOWN_GOOD.indexOf(target.host.replace(/^www\./, "")) !== -1;
    var results = [];

    CATALOGUE.forEach(function (cat) {
      var checks = cat.checks.map(function (c) {
        var status;

        // real signal: scheme drives transport + cookie Secure
        if (c.key === "https")  status = target.https ? "pass" : "fail";
        else if (c.key === "hsts")   status = !target.https ? "fail" : (good || rng() > 0.5 ? "pass" : "fail");
        else if (c.key === "tls")    status = !target.https ? "fail" : (good || rng() > 0.35 ? "pass" : "warn");
        else if (c.key === "secure") status = !target.https ? "fail" : (good || rng() > 0.3 ? "pass" : "fail");
        else {
          var roll = rng();
          if (good) status = roll > 0.15 ? "pass" : (c.warn ? "warn" : "fail");
          else      status = roll > 0.5 ? "pass" : (roll > 0.22 ? (c.warn ? "warn" : "fail") : "fail");
        }

        // fall back gracefully if a check lacks a warn/fail variant
        if (status === "warn" && !c.warn) status = "fail";
        if (status === "fail" && !c.fail && c.warn) status = "warn";

        var info = c[status] || c.pass;
        return { name: c.name, key: c.key, status: status, detail: info.d, fix: info.f };
      });

      var fails = checks.filter(function (x) { return x.status === "fail"; }).length;
      var warns = checks.filter(function (x) { return x.status === "warn"; }).length;
      var pill = fails ? "fail" : (warns ? "warn" : "pass");
      results.push({ meta: cat, checks: checks, pill: pill });
    });
    return results;
  }

  function grade(results) {
    var pass = 0, warn = 0, fail = 0, total = 0;
    results.forEach(function (r) { r.checks.forEach(function (c) {
      total++; if (c.status === "pass") pass++; else if (c.status === "warn") warn++; else fail++;
    }); });
    var score = (pass + warn * 0.5) / total;
    var letter = score >= 0.95 ? "A+" : score >= 0.85 ? "A" : score >= 0.72 ? "B" :
                 score >= 0.58 ? "C" : score >= 0.42 ? "D" : "F";
    var color = score >= 0.72 ? "var(--success)" : score >= 0.42 ? "var(--warning)" : "var(--danger)";
    return { pass: pass, warn: warn, fail: fail, total: total, score: score, letter: letter, color: color };
  }

  /* ── console helpers ── */
  function cline(html) {
    var el = document.createElement("span");
    el.className = "sx-line"; el.innerHTML = html;
    consoleEl.appendChild(el);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }

  /* ── render one category card ── */
  function renderCat(r, idx) {
    var card = document.createElement("div");
    card.className = "sx-cat";
    var counts = r.checks.reduce(function (a, c) { a[c.status]++; return a; }, { pass: 0, warn: 0, fail: 0 });
    var sub = counts.pass + " ok" + (counts.warn ? " \u00b7 " + counts.warn + " warn" : "") + (counts.fail ? " \u00b7 " + counts.fail + " fail" : "");

    var checksHtml = r.checks.map(function (c) {
      var fix = c.fix ? '<div class="sx-check-fix"><b>Fix:</b> ' + c.fix + "</div>" : "";
      return '<div class="sx-check">' +
        '<span class="sx-check-dot ' + c.status + '"></span>' +
        '<div class="sx-check-main">' +
          '<div class="sx-check-name">' + c.name + "</div>" +
          '<div class="sx-check-detail">' + c.detail + "</div>" + fix +
        "</div></div>";
    }).join("");

    card.innerHTML =
      '<button class="sx-cat-head" type="button" aria-expanded="false">' +
        '<span class="sx-cat-ico">' + r.meta.icon + "</span>" +
        '<span class="sx-cat-name"><b>' + r.meta.label + "</b><span>" + sub + "</span></span>" +
        '<span class="sx-pill ' + r.pill + '">' + r.pill.toUpperCase() + "</span>" +
        '<span class="sx-chev">\u25BC</span>' +
      "</button>" +
      '<div class="sx-cat-body"><div class="sx-cat-body-inner">' + checksHtml + "</div></div>";

    var head = card.querySelector(".sx-cat-head");
    head.addEventListener("click", function () {
      var open = card.classList.toggle("open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
    });
    catsEl.appendChild(card);
    // auto-open the first category that has a problem
    if (r.pill !== "pass" && !catsEl.querySelector(".sx-cat.open")) {
      card.classList.add("open"); head.setAttribute("aria-expanded", "true");
    }
    requestAnimationFrame(function () { setTimeout(function(){ card.classList.add("in"); }, idx * 60); });
    return card;
  }

  /* ── render the score header ── */
  function renderScore(target, g) {
    var host = target.host;
    return '<div class="sx-ring">' +
        '<svg viewBox="0 0 80 80"><circle class="sx-ring-track" cx="40" cy="40" r="35"/>' +
        '<circle class="sx-ring-val" cx="40" cy="40" r="35" style="stroke:' + g.color + '"/></svg>' +
        '<div class="sx-grade">' + g.letter + "</div></div>" +
      '<div class="sx-score-meta">' +
        '<div class="sx-score-target">' + host + "</div>" +
        '<div class="sx-score-sub">Security posture graded from ' + g.total + " checks across 4 categories.</div>" +
        '<div class="sx-score-counts">' +
          '<span><i class="sx-i-pass"></i>' + g.pass + " pass</span>" +
          '<span><i class="sx-i-warn"></i>' + g.warn + " warn</span>" +
          '<span><i class="sx-i-fail"></i>' + g.fail + " fail</span>" +
        "</div></div>";
  }

  /* ── main run ── */
  async function run() {
    if (running) return;
    var target = parseTarget(input.value);
    if (!target) {
      errorEl.textContent = "> enter a valid domain, e.g. example.com";
      errorEl.classList.add("show");
      return;
    }
    errorEl.classList.remove("show");
    running = true;
    runBtn.classList.add("is-running"); runBtn.disabled = true;

    // reset
    stage.classList.add("show");
    consoleEl.innerHTML = "";
    catsEl.innerHTML = "";
    var scoreHost = $("#sx-score"); scoreHost.innerHTML = "";

    var results = evaluate(target);
    var g = grade(results);

    // stream the console
    cline('<span class="d">$</span> siteshield scan <span class="c">' + target.host + "</span>");
    await wait(260);
    cline('<span class="d">[*]</span> resolving ' + target.host + " \u2026");
    await wait(reduce ? 0 : 320);
    cline('<span class="d">[*]</span> ' + (target.https ? '<span class="g">GET / HTTP/2 over TLS</span>' : '<span class="r">GET / HTTP/1.1 (plaintext)</span>'));
    await wait(260);

    var iconFor = { pass: '<span class="g">[\u2713]</span>', warn: '<span class="y">[!]</span>', fail: '<span class="r">[\u2717]</span>' };

    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      cline('<span class="c">\u2192</span> scanning <b>' + r.meta.label.toLowerCase() + "</b>\u2026");
      await wait(reduce ? 0 : 240);
      for (var j = 0; j < r.checks.length; j++) {
        var c = r.checks[j];
        cline("  " + iconFor[c.status] + " " + c.name);
        await wait(reduce ? 0 : 150);
      }
      renderCat(r, i);
    }

    cline('<span class="d">[*]</span> analysis complete \u2014 grade <b>' + g.letter + "</b>");
    cline('<span class="sx-caret"></span>');

    // score header animates in
    scoreHost.innerHTML = renderScore(target, g);
    requestAnimationFrame(function () {
      var ring = scoreHost.querySelector(".sx-ring-val");
      if (ring) ring.style.strokeDashoffset = String(220 - 220 * g.score);
    });

    running = false;
    runBtn.classList.remove("is-running"); runBtn.disabled = false;
  }

  /* ── wire up ── */
  runBtn.addEventListener("click", run);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });
  root.querySelectorAll(".sx-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      input.value = chip.getAttribute("data-url") || chip.textContent.trim();
      run();
    });
  });
})();