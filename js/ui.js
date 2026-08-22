/* ═══════════════════════════════════════════════════════════════
   UI.JS — Theme toggle, scroll effects, nav highlight,
           cursor trail, toast, mobile nav, progress bar
   ═══════════════════════════════════════════════════════════════ */

const UI = (() => {

  /* ── THEME ─────────────────────────────────────────────────── */
  const Theme = {
    // Cycle order: light → dark → terminal → light → ...
    THEMES: ['light', 'dark', 'terminal'],

    ICONS: {
      light:    '☀',
      dark:     '◑',
      terminal: '>'
    },

    LABELS: {
      light:    'Switch to dark mode',
      dark:     'Switch to terminal mode',
      terminal: 'Switch to light mode'
    },

    TOASTS: {
      light:    '☀ Light mode',
      dark:     '◑ Dark mode',
      terminal: '> 𖤍 Terminal mode — suraj in.'
    },

    init() {
      const saved = localStorage.getItem('ak-theme') || 'light';
      this._apply(saved, false); // no toast on init

      const toggle = document.getElementById('theme-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => this.cycle());
        this._updateToggleUI(toggle, saved);
      }
    },

    cycle() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const idx = this.THEMES.indexOf(current);
      const next = this.THEMES[(idx + 1) % this.THEMES.length];
      this._apply(next, true);
    },

    _apply(theme, showToast) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('ak-theme', theme);

      const toggle = document.getElementById('theme-toggle');
      if (toggle) this._updateToggleUI(toggle, theme);

      if (showToast) {
        UI.Toast.show(this.TOASTS[theme], '');
      }
    },

    _updateToggleUI(btn, theme) {
      btn.setAttribute('aria-label', this.LABELS[theme]);
      btn.setAttribute('title', this.LABELS[theme]);
      btn.setAttribute('data-theme-icon', this.ICONS[theme]);
    }
  };

  /* ── PROGRESS BAR ──────────────────────────────────────────── */
  const ProgressBar = {
    init() {
      const bar = document.getElementById('progress-bar');
      if (!bar) return;
      window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
      }, { passive: true });
    }
  };

  /* ── NAV SCROLL STATE ──────────────────────────────────────── */
  const Nav = {
    init() {
      const nav = document.getElementById('main-nav');
      if (!nav) return;

      // Add scrolled class for shadow
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });

      // Active link highlight
      const sections = document.querySelectorAll('section[id]');
      const links = document.querySelectorAll('.nav-links a[href^="#"]');

      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            links.forEach(l => {
              l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
            });
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });

      sections.forEach(s => io.observe(s));

      // Mobile menu
      const menuBtn = document.getElementById('menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
          const open = navLinks.classList.toggle('mobile-open');
          menuBtn.classList.toggle('open', open);
        });
        // Close on link click
        navLinks.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            menuBtn.classList.remove('open');
          });
        });
      }
    }
  };

  /* ── AVAILABILITY BANNER DISMISS ───────────────────────────── */
  const Banner = {
    init() {
      const btn = document.getElementById('dismiss-banner');
      const banner = document.getElementById('avail-banner');
      if (!btn || !banner) return;
      // Don't show if dismissed this session
      if (sessionStorage.getItem('banner-dismissed')) {
        banner.style.display = 'none';
      }
      btn.addEventListener('click', () => {
        banner.style.maxHeight = banner.offsetHeight + 'px';
        banner.style.overflow = 'hidden';
        banner.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
        requestAnimationFrame(() => {
          banner.style.maxHeight = '0';
          banner.style.opacity = '0';
        });
        setTimeout(() => banner.remove(), 360);
        sessionStorage.setItem('banner-dismissed', '1');
      });
    }
  };

  /* ── TOAST NOTIFICATION ────────────────────────────────────── */
  const Toast = {
    timer: null,
    show(msg, icon = '✓') {
      let el = document.getElementById('toast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        document.body.appendChild(el);
      }
      el.innerHTML = icon
        ? `<span class="toast-icon">${icon}</span>${msg}`
        : msg;
      el.classList.add('show');
      clearTimeout(this.timer);
      this.timer = setTimeout(() => el.classList.remove('show'), 2400);
    }
  };

  /* ── COPY EMAIL ────────────────────────────────────────────── */
  const CopyEmail = {
    init() {
      document.querySelectorAll('[data-copy-email]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const email = PORTFOLIO_DATA.contact.email;
          try {
            await navigator.clipboard.writeText(email);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            Toast.show('Email address copied to clipboard');
          } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = email;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.focus(); ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            Toast.show('Email address copied!');
          }
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2200);
        });
      });
    }
  };

  /* ── CURSOR TRAIL ──────────────────────────────────────────── */
  const Cursor = {
    dot: null, ring: null,
    mx: -100, my: -100,
    rx: -100, ry: -100,
    raf: null,

    init() {
      // Only on real pointer devices
      if (window.matchMedia('(hover: none)').matches) return;

      this.dot  = document.createElement('div');
      this.ring = document.createElement('div');
      this.dot.className  = 'cursor-dot';
      this.ring.className = 'cursor-ring';
      document.body.appendChild(this.dot);
      document.body.appendChild(this.ring);

      document.addEventListener('mousemove', e => {
        this.mx = e.clientX;
        this.my = e.clientY;
      });

      // Hover state on interactive elements
      const hoverEls = 'a, button, .project-card, .skill-pill, .nav-links a, .tech-tag';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
      });

      this.animate();
    },

    animate() {
      this.dot.style.left  = this.mx + 'px';
      this.dot.style.top   = this.my + 'px';

      // Ring lags behind dot
      this.rx += (this.mx - this.rx) * 0.14;
      this.ry += (this.my - this.ry) * 0.14;
      this.ring.style.left = this.rx + 'px';
      this.ring.style.top  = this.ry + 'px';

      requestAnimationFrame(() => this.animate());
    }
  };

  /* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
  const ScrollReveal = {
    init() {
      if (typeof Transitions !== 'undefined') {
        return;
      }

      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible', 'in-view');
            }, parseInt(entry.target.dataset.delay || 0, 10));
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.fade-up, .fade-in, .stagger-children').forEach(el => {
        io.observe(el);
      });
    }
  };

  /* ── COUNTER ANIMATION ─────────────────────────────────────── */
  const Counters = {
    animate(el) {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1200;
      const start = performance.now();
      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    },
    init() {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('.count-up').forEach(el => io.observe(el));
    }
  };

  /* ── SMOOTH SCROLL ─────────────────────────────────────────── */
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const target = document.querySelector(a.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          const offset = 72;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        });
      });
    }
  };

  /* ── PUBLIC API ─────────────────────────────────────────────── */
  return {
    Toast,
    init() {
      Theme.init();
      ProgressBar.init();
      Nav.init();
      Banner.init();
      CopyEmail.init();
      Cursor.init();
      ScrollReveal.init();
      Counters.init();
      SmoothScroll.init();
    }
  };
})();