/* ═══════════════════════════════════════════════════════════════
   MAIN.JS — Entry point. Boots all modules in correct order.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── BOOT SEQUENCE ─────────────────────────────────────────── */
  function boot() {
    // 1. Boot cinematic scroll transitions FIRST so the IntersectionObserver
    //    exists before render.js injects cards and calls Transitions.refresh().
    //    (Previously Renderer ran first, so refresh() hit `if (!_observer) return`
    //     and the projects/skills/certs grids could stay stuck at opacity:0.)
    Transitions.init();

    // 2. Render all dynamic HTML from data.js
    Renderer.init();
 
    // 3. Wire up UI interactions (theme, nav, scroll, cursor…)
    UI.init();
 
    // 4. Build modal system
    Modal.init();
 
    // 5. Wire up contact form
    ContactForm.init();
 
    // 6. Fetch GitHub activity (async, non-blocking)
    GitHub.init();
 
    // 7. Typing animation in hero
    initTyping();
 
    console.info(
      '%cSuraj Kumar — Portfolio%c\n' +
      'Built with vanilla HTML/CSS/JS.\n' +
      'github.com/surajkumar11292',
      'color:#004743;font-weight:bold;font-size:14px;',
      'color:#888;font-size:11px;'
    );
  }
 /* ── TYPING ANIMATION ──────────────────────────────────────── */
  function initTyping() {
    const el = document.getElementById('typing-target');
    if (!el) return;
 
    const phrases = [
      'Full-Stack Developer',
      'System Design Enthusiast',
      'DevOps Practitioner',
      'MERN Stack Engineer',
    ];
 
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseTimer = null;
 
    function type() {
      const current = phrases[phraseIndex];
 
      if (isDeleting) {
        el.textContent = current.slice(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.slice(0, charIndex + 1);
        charIndex++;
      }
 
      let delay = isDeleting ? 45 : 80;
 
      if (!isDeleting && charIndex === current.length) {
        // Pause at end of word
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 300;
      }
 
      pauseTimer = setTimeout(type, delay);
    }
 
    type();
  }
  /* ── DOM READY ─────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
/* ── Render Currently Building Card ───────────────────────────
   Add this block inside render.js, or paste at bottom of main.js
   ─────────────────────────────────────────────────────────── */

(function renderBuildingCard() {
  const el = document.getElementById("building-card");
  if (!el) return;

  const b = PORTFOLIO_DATA.currentlyBuilding;
  if (!b || !b.title) return;

  const badgeClass =
    b.status === "almost-done" ? "almost-done" :
    b.status === "shipped"     ? "shipped"      : "";

  const badgeLabel =
    b.status === "almost-done" ? "Almost done" :
    b.status === "shipped"     ? "Shipped ✓"   : "In progress";

  const tags = (b.stack || [])
    .map(t => tagWithIcon(t, "building-tag"))
    .join("");

  el.innerHTML = `
    <div class="building-header">
      <span class="building-status">
        <span class="building-dot"></span>
        Currently Building
      </span>
      <span class="building-status-badge ${badgeClass}">${badgeLabel}</span>
    </div>
    <p class="building-title">${b.github ? `<a href="${b.github}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:0.35rem;">${b.title} <span style="font-size:0.75rem;opacity:0.8;">↗</span></a>` : b.title}</p>
    <p class="building-desc">${b.desc}</p>
    <div class="building-meta">
      <div class="building-stack">${tags}</div>
      ${b.startedMonth ? `<span class="building-since">Since ${b.startedMonth}</span>` : ""}
    </div>
  `;
})();