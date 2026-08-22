/* ═══════════════════════════════════════════════════════════════
   TRANSITIONS.JS — Scroll-driven cinematic section reveals.

   What this file does:
   ────────────────────
   1. Wraps every .section__title's words in .wipe-word spans
      so CSS can animate each word sliding up independently.

   2. Wraps the hero <h1> lines in .hero-name-line spans.

   3. Assigns --i CSS custom property to cascade-grid children
      so CSS stagger delays work automatically.

   4. Watches every observable element with a single shared
      IntersectionObserver — fires .in-view when element enters
      the viewport, never fires twice (unobserve after trigger).

   5. Fires .section-entered on the parent <section> for the
      top-border wake-line effect.

   6. Parallax scroll handler for [data-parallax] elements.

   USAGE (no HTML changes needed — JS auto-instruments everything)
   ═══════════════════════════════════════════════════════════════ */

const Transitions = (() => {
  'use strict';

  /* ── REDUCED MOTION CHECK ───────────────────────────────────── */
  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════════════════════════
     1. SECTION TITLE WORD-WRAP
     Splits each .section__title into per-word spans so CSS can
     animate each word independently.
  ══════════════════════════════════════════════════════════════ */
  function wrapTitleWords() {
    document.querySelectorAll('.section__title').forEach(el => {
      // Walk child nodes, wrapping text nodes word by word
      // Preserve <em>, <br>, <strong> etc. as-is
      const fragment = document.createDocumentFragment();

      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Split text into words, wrap each
          const words = node.textContent.split(/(\s+)/);
          words.forEach(part => {
            if (/^\s+$/.test(part)) {
              // Whitespace — keep as text node
              fragment.appendChild(document.createTextNode(part));
            } else if (part) {
              const span = document.createElement('span');
              span.className = 'wipe-word';
              const inner = document.createElement('span');
              inner.className = 'wipe-inner';
              inner.textContent = part;
              span.appendChild(inner);
              fragment.appendChild(span);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BR') {
            // Keep line breaks
            fragment.appendChild(node.cloneNode(true));
          } else if (node.tagName === 'EM' || node.tagName === 'STRONG') {
            // Wrap the em/strong text content as a single wipe-word
            const span = document.createElement('span');
            span.className = 'wipe-word';
            const inner = document.createElement('span');
            inner.className = 'wipe-inner';
            // Clone the em/strong with its styling
            const styled = node.cloneNode(true);
            inner.appendChild(styled);
            span.appendChild(inner);
            fragment.appendChild(span);
          } else {
            fragment.appendChild(node.cloneNode(true));
          }
        }
      });

      el.innerHTML = '';
      el.appendChild(fragment);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     2. HERO NAME LINE-WRAP
     Wraps the two lines of the hero <h1> so they wipe up.
  ══════════════════════════════════════════════════════════════ */
  function wrapHeroName() {
    const h1 = document.querySelector('.hero-name');
    if (!h1) return;

    // The h1 has: "Suraj" as text + <em>Kumar</em>
    // We want two lines: line1 = "Suraj", line2 = em
    const children = Array.from(h1.childNodes);
    h1.innerHTML = '';

    // Group nodes into lines (split on <em> which is on its own line)
    let line1Nodes = [];
    let line2Nodes = [];
    let seenEm     = false;

    children.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
        seenEm = true;
        line2Nodes.push(node);
      } else if (!seenEm) {
        line1Nodes.push(node);
      } else {
        line2Nodes.push(node);
      }
    });

    const makeLine = (nodes, delay) => {
      if (!nodes.length) return null;
      // Skip whitespace-only text nodes
      const meaningful = nodes.filter(n =>
        !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '')
      );
      if (!meaningful.length) return null;

      const wrap  = document.createElement('span');
      wrap.className = 'hero-name-line';
      const inner = document.createElement('span');
      inner.className = 'hero-name-inner';
      meaningful.forEach(n => inner.appendChild(n.cloneNode(true)));
      wrap.appendChild(inner);
      return wrap;
    };

    const l1 = makeLine(line1Nodes);
    const l2 = makeLine(line2Nodes);
    if (l1) h1.appendChild(l1);
    if (l2) h1.appendChild(l2);
  }

  /* ══════════════════════════════════════════════════════════════
     3. CASCADE GRID — assign --i to children
  ══════════════════════════════════════════════════════════════ */
  function indexCascadeChildren() {
    document.querySelectorAll('.cascade-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.setProperty('--i', i);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     4. MAIN INTERSECTION OBSERVER
  ══════════════════════════════════════════════════════════════ */
  function initObserver() {
    // Shared observer — fires once per element, then unobserves
    const io = new IntersectionObserver(onEnter, {
      threshold:   0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    // Also a lighter observer for dividers (thin, hard to intersect)
    const dividerIo = new IntersectionObserver(onEnter, {
      threshold: 0,
      rootMargin: '0px 0px 0px 0px',
    });

    // Section observer — fires section-entered
    const sectionIo = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-entered');
          sectionIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    // Eyebrows + subtitles + titles
    document.querySelectorAll('.section__eyebrow').forEach(el => io.observe(el));
    document.querySelectorAll('.section__title').forEach(el => io.observe(el));
    document.querySelectorAll('.section__subtitle').forEach(el => io.observe(el));

    // reveal-block (replaces fade-up in JS-driven content)
    document.querySelectorAll('.reveal-block').forEach(el => io.observe(el));

    // cascade grids
    document.querySelectorAll('.cascade-grid').forEach(el => io.observe(el));

    // Timeline entries
    document.querySelectorAll('.timeline-entry').forEach(el => io.observe(el));

    // Legacy fade-up support (don't break existing markup)
    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
      io.observe(el);
    });

    // Dividers
    document.querySelectorAll('.divider').forEach(el => dividerIo.observe(el));

    // Sections
    document.querySelectorAll('section[id]').forEach(el => sectionIo.observe(el));

    return io;
  }

  function onEnter(entries, observer) {
    entries.forEach((entry, listIdx) => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.revealDelay || el.dataset.delay || 0, 10);

      setTimeout(() => {
        el.classList.add('in-view');
        el.classList.add('visible'); // keep legacy fade-up working
      }, delay);

      observer.unobserve(el);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     5. PARALLAX SCROLL HANDLER
     Elements with [data-parallax="0.2"] move at 20% scroll speed.
  ══════════════════════════════════════════════════════════════ */
  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        els.forEach(el => {
          const speed  = parseFloat(el.dataset.parallax || 0.15);
          const rect   = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const offset = (center - window.innerHeight / 2) * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════════
     6. UPGRADE EXISTING SECTIONS
     Convert render.js's .stagger-children to .cascade-grid and
     add .reveal-block to about-text, now-card etc. so they use
     the new animation system.
  ══════════════════════════════════════════════════════════════ */
  function upgradeExistingMarkup() {
    // .stagger-children → also gets .cascade-grid class
    document.querySelectorAll('.stagger-children').forEach(el => {
      el.classList.add('cascade-grid');
    });

    // Add reveal-block to specific containers that render.js fills
    const revealIds = [
      'about-bio',
      'learning-pills',
      'github-activity-list',
    ];
    revealIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('reveal-block');
    });

    // About-grid children
    document.querySelectorAll('.about-grid > *').forEach((child, i) => {
      child.classList.add('reveal-block');
      child.dataset.revealDelay = i * 80;
    });

    // Contact section children
    document.querySelectorAll('.contact-section-inner > *').forEach((child, i) => {
      child.classList.add('reveal-block');
      child.dataset.revealDelay = i * 100;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     7. RE-OBSERVE after render.js fills dynamic content
     render.js runs synchronously on DOMContentLoaded, but
     IntersectionObserver targets may not exist until then.
     We re-run the observer setup 100ms after boot to catch
     dynamically rendered cards.
  ══════════════════════════════════════════════════════════════ */
  let _observer = null;

  function reObserve() {
    if (!_observer) return;

    // Any late-injected .stagger-children must also become a cascade grid,
    // otherwise it is hidden by CSS but never observed → permanently invisible.
    document.querySelectorAll('.stagger-children:not(.cascade-grid)').forEach(el => {
      el.classList.add('cascade-grid');
    });

    // Cascade grids — index their new children
    indexCascadeChildren();

    // Find anything that should be observed but isn't .in-view yet.
    // Includes bare .fade-up/.fade-in elements too — these are a THIRD,
    // separate reveal mechanism (defined in layout.css) used directly by
    // render.js-injected content (hero stats, education cards, blog cards,
    // timeline entries). They are created after Transitions.init()'s one-time
    // initial observer sweep, so without this explicit re-check they are
    // never observed at all and stay invisible forever.
    document.querySelectorAll(
      '.cascade-grid:not(.in-view), .reveal-block:not(.in-view), ' +
      '.timeline-entry:not(.in-view), .divider:not(.in-view), ' +
      '.fade-up:not(.visible), .fade-in:not(.visible)'
    ).forEach(el => {
      _observer.observe(el);
      // If it is ALREADY within the viewport at this moment, reveal it now.
      // IntersectionObserver only fires on a *change*, so an element that was
      // already on-screen when observation began can otherwise never fire.
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh && r.bottom > 0) {
        el.classList.add('in-view', 'visible', 'section-entered');
      }
    });
  }

  /* ── FAILSAFE ──────────────────────────────────────────────────
     Content must never be permanently invisible. If any grid is still
     hidden (opacity:0 with no .in-view) shortly after load, reveal it.
     This preserves the animation in the normal case and only acts as a
     safety net when the observer race would otherwise leave a blank section.
  ─────────────────────────────────────────────────────────────── */
  function failsafeReveal() {
    document.querySelectorAll(
      '.cascade-grid:not(.in-view), .stagger-children:not(.visible)'
    ).forEach(el => {
      if (el.children.length) {
        el.classList.add('in-view', 'visible', 'section-entered');
      }
    });
    // Bare .fade-up / .fade-in elements (hero stats, education cards,
    // blog cards, timeline entries, etc.) — same guarantee, independent
    // of whether they sit inside a cascade-grid container.
    document.querySelectorAll('.fade-up:not(.visible), .fade-in:not(.visible)').forEach(el => {
      el.classList.add('visible', 'in-view', 'section-entered');
    });
  }

  /* ══════════════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════════════ */
  return {
    init() {
      if (prefersReduced()) {
        // Instantly show everything — don't run animations
        document.querySelectorAll(
          '.section__eyebrow, .section__title, .section__subtitle, ' +
          '.reveal-block, .cascade-grid > *, .timeline-entry, ' +
          '.fade-up, .fade-in, .divider'
        ).forEach(el => {
          el.classList.add('in-view', 'visible', 'section-entered');
        });
        return;
      }

      // Run DOM prep synchronously before first paint
      wrapTitleWords();
      wrapHeroName();
      upgradeExistingMarkup();

      // Start observing
      _observer = initObserver();
      indexCascadeChildren();

      // Re-observe after render.js fills dynamic content
      setTimeout(() => reObserve(), 120);
      // And again after images/fonts settle
      setTimeout(() => reObserve(), 600);
      // Final safety net — guarantee nothing is left blank.
      setTimeout(failsafeReveal, 1500);
      window.addEventListener('load', () => {
        reObserve();
        setTimeout(failsafeReveal, 800);
      });

      // Parallax (decorative elements only)
      initParallax();
    },

    // Expose for render.js to call after dynamic inject.
    // Safe to call before init(): we simply retry once the observer exists.
    refresh() {
      indexCascadeChildren();
      if (!_observer) {
        // init() hasn't run yet — retry shortly instead of silently doing nothing.
        setTimeout(() => this.refresh(), 60);
        return;
      }
      reObserve();
      setTimeout(() => reObserve(), 50);
      // Safety net: nothing may stay invisible.
      setTimeout(failsafeReveal, 1200);
    }
  };

})();