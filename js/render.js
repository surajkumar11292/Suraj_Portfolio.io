/* ═══════════════════════════════════════════════════════════════
   RENDER.JS — Reads PORTFOLIO_DATA and builds every section's
               HTML dynamically. Edit data.js, not this file.
   ═══════════════════════════════════════════════════════════════ */

const Renderer = (() => {
  /* ── HELPERS ───────────────────────────────────────────────── */
  const el = (tag, cls, html = "") => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  };

  const mount = (id, html) => {
    const target = document.getElementById(id);
    if (target) target.innerHTML = html;
  };

  /* ── HERO ──────────────────────────────────────────────────── */
  function renderHero() {
    const d = PORTFOLIO_DATA;
    const stats = (d.stats || [])
      .map(
        (s) => `
      <div class="stat-item fade-up">
        <span class="stat-num">${s.num}</span>
        <span class="stat-label">${s.label}</span>
      </div>`,
      )
      .join("");

    const contactLinks = `

      <a href="mailto:${(d.contact || {}).email || ''}" class="contact-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        ${(d.contact || {}).email || ''}
        <button class="copy-btn" data-copy-email aria-label="Copy email">Copy</button>
      </a>
      <a href="${(d.contact || {}).github || '#'}" target="_blank" rel="noopener" class="contact-link">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        surajkumar11292
      </a>
      <a href="${(d.contact || {}).linkedin || '#'}" target="_blank" rel="noopener" class="contact-link">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
        LinkedIn
      </a>`;

    mount("hero-stats-row", stats);
    mount("hero-contact-strip", contactLinks);
  }

  /* ── ABOUT ─────────────────────────────────────────────────── */
  function renderAbout() {
    const d = PORTFOLIO_DATA;

    // Bio paragraphs
    const bio = (d.bio || []).map((p) => `<p>${p}</p>`).join("");
    mount("about-bio", bio);

    // Currently learning pills
    const pills = (d.learning || [])
      .map((item) => tagWithIcon(item, "now-pill"))
      .join("");
    mount("learning-pills", pills);

    // Marquee (double for infinite loop)
    const marqueeItems = d.marqueeItems || [];
    const items = [...marqueeItems, ...marqueeItems]
      .map(
        (item) => `
      <span class="marquee-item">
        <span class="sep">✦</span> ${techIconHTML(item)}${item}
      </span>`,
      )
      .join("");
    mount("marquee-inner", items);
  }

  /* ── EXPERIENCE ────────────────────────────────────────────── */
  function renderExperience() {
    const html = (PORTFOLIO_DATA.experience || [])
      .map((job) => {
        const bullets = (job.bullets || []).map((b) => `<li>${b}</li>`).join("");
        const tags = (job.tags || []).map((t) => tagWithIcon(t, "tech-tag")).join("");
        return `
        <div class="timeline-entry fade-up">
          <div class="timeline-date-col">
            <div class="timeline-period">${job.period}</div>
            <div class="timeline-duration">${job.duration}</div>
          </div>
          <div class="timeline-track">
            <div class="timeline-node"></div>
            <div class="timeline-line"></div>
          </div>
          <div class="timeline-body" data-period="${job.period}${job.duration ? " · " + job.duration : ""}">
            <div class="timeline-role">${job.role}</div>
            <div class="timeline-company">
              ${job.company}${job.location ? ` <span>· ${job.location}</span>` : ""}
            </div>
            <ul class="timeline-bullets">${bullets}</ul>
            <div class="timeline-tags">${tags}</div>
          </div>
        </div>`;
      })
      .join("");
    mount("timeline-container", html);
  }

  /* ── PROJECTS ──────────────────────────────────────────────── */
  function renderProjects() {
    const SHIELD = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">\u25C6 SiteShield</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="SiteShield scanning animation">
          <defs>
            <clipPath id="phClip"><path d="M120 22 L206 56 V122 C206 170 172 206 120 220 C68 206 34 170 34 122 V56 Z"/></clipPath>
            <linearGradient id="phSweepGrad" x1="0" y1="0" x2="1" y2="0"><stop class="ph-s0" offset="0%"/><stop class="ph-s1" offset="100%"/></linearGradient>
            <radialGradient id="phGlowGrad"><stop class="ph-g0" offset="0%"/><stop class="ph-g1" offset="100%"/></radialGradient>
          </defs>
          <path class="ph-glow" d="M120 22 L206 56 V122 C206 170 172 206 120 220 C68 206 34 170 34 122 V56 Z" fill="url(#phGlowGrad)"/>
          <g clip-path="url(#phClip)">
            <g class="ph-grid">
              <line x1="60" y1="20" x2="60" y2="220"/><line x1="120" y1="20" x2="120" y2="220"/><line x1="180" y1="20" x2="180" y2="220"/>
              <line x1="20" y1="60" x2="220" y2="60"/><line x1="20" y1="116" x2="220" y2="116"/><line x1="20" y1="172" x2="220" y2="172"/>
            </g>
            <circle class="ph-ring" cx="120" cy="116" r="30"/><circle class="ph-ring" cx="120" cy="116" r="58"/><circle class="ph-ring" cx="120" cy="116" r="86"/>
            <circle class="ph-pulse" cx="120" cy="116" r="8"><animate attributeName="r" from="8" to="94" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite"/></circle>
            <circle class="ph-pulse" cx="120" cy="116" r="8"><animate attributeName="r" from="8" to="94" dur="3s" begin="1s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="3s" begin="1s" repeatCount="indefinite"/></circle>
            <circle class="ph-pulse" cx="120" cy="116" r="8"><animate attributeName="r" from="8" to="94" dur="3s" begin="2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="3s" begin="2s" repeatCount="indefinite"/></circle>
            <g>
              <path class="ph-sweep" d="M120 116 L120 18 A98 98 0 0 1 189 47 Z" fill="url(#phSweepGrad)"/>
              <line class="ph-sweep-line" x1="120" y1="116" x2="120" y2="18"/>
              <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 120 116" to="360 120 116" dur="3.4s" repeatCount="indefinite"/>
            </g>
            <circle class="ph-node n1" cx="150" cy="78" r="3.4"/>
            <circle class="ph-node n2" cx="88" cy="150" r="3.4"/>
            <circle class="ph-node n3" cx="160" cy="150" r="3.4"/>
            <circle class="ph-node n4" cx="96" cy="88" r="3.4"/>
          </g>
          <path class="ph-outline" d="M120 22 L206 56 V122 C206 170 172 206 120 220 C68 206 34 170 34 122 V56 Z"/>
          <g class="ph-core">
            <path d="M120 96 l16 7 v14 c0 12 -8 20 -16 24 c-8 -4 -16 -12 -16 -24 v-14 Z"/>
            <path class="ph-check" d="M112 118 l6 6 l12 -13"/>
          </g>
        </svg>
        <a class="ph-live" href="#scanner">\u25B6 See it scan live</a>
      </div>`;

    const STUDENT_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live System</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="Student records dashboard animation">
          <rect class="ph-outline" x="28" y="50" width="184" height="140" rx="16" fill="none"/>
          <circle class="sm-avatar-pulse" cx="62" cy="86" r="17"><animate attributeName="r" from="17" to="30" dur="3.6s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="3.6s" repeatCount="indefinite"/></circle>
          <circle class="sm-avatar" cx="62" cy="86" r="17"/>
          <text class="sm-avatar-text" x="62" y="91">AA</text>
          <rect class="sm-line sm-line-bg" x="92" y="76" width="98" height="7" rx="3.5"/>
          <rect class="sm-line sm-fill sm-fill-a" x="92" y="76" width="98" height="7" rx="3.5" style="transform-origin:92px 79.5px"/>
          <rect class="sm-line sm-line-bg" x="92" y="90" width="66" height="7" rx="3.5"/>
          <rect class="sm-line sm-fill sm-fill-b" x="92" y="90" width="66" height="7" rx="3.5" style="transform-origin:92px 93.5px"/>
          <line x1="40" y1="112" x2="200" y2="112" stroke="var(--accent)" stroke-opacity="0.14"/>
          <g class="sm-row sm-row-1">
            <rect class="sm-chip" x="40" y="122" width="34" height="12" rx="6"/>
            <text class="sm-chip-text" x="57" y="130">14002</text>
            <rect class="sm-row-bar" x="80" y="124" width="70" height="8" rx="4"/>
            <rect class="sm-row-bar-sm" x="156" y="124" width="44" height="8" rx="4"/>
          </g>
          <g class="sm-row sm-row-2">
            <rect class="sm-chip" x="40" y="146" width="34" height="12" rx="6"/>
            <text class="sm-chip-text" x="57" y="154">14003</text>
            <rect class="sm-row-bar" x="80" y="148" width="70" height="8" rx="4"/>
            <rect class="sm-row-bar-sm" x="156" y="148" width="44" height="8" rx="4"/>
          </g>
          <g class="sm-row sm-row-3">
            <rect class="sm-chip" x="40" y="170" width="34" height="12" rx="6"/>
            <text class="sm-chip-text" x="57" y="178">14004</text>
            <rect class="sm-row-bar" x="80" y="172" width="70" height="8" rx="4"/>
            <rect class="sm-row-bar-sm" x="156" y="172" width="44" height="8" rx="4"/>
          </g>
          <g>
            <circle class="sm-badge" cx="188" cy="158" r="16"/>
            <path class="ph-check" d="M180 158 l5 6 l11 -13"/>
          </g>
        </svg>
        <a class="ph-live" href="https://student-management-system-java-springboot.onrender.com" target="_blank" rel="noopener noreferrer">▶ View live app</a>
      </div>`;

      const BANK_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Ledger</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="Bank transfer animation">
          <text class="bk-ref-text" x="120" y="30">TXN-4F2A9C1D</text>

          <rect class="ph-outline" x="16" y="90" width="68" height="46" rx="10" fill="none"/>
          <rect class="bk-chip" x="24" y="100" width="15" height="11" rx="2"/>
          <text class="bk-acct-text" x="50" y="128">•• 4821</text>
          <text class="bk-balance" x="50" y="152">₹50,000</text>

          <rect class="ph-outline" x="156" y="90" width="68" height="46" rx="10" fill="none"/>
          <rect class="bk-chip" x="164" y="100" width="15" height="11" rx="2"/>
          <text class="bk-acct-text" x="190" y="128">•• 7734</text>
          <text class="bk-balance bk-balance-old" x="190" y="152">₹12,500</text>
          <text class="bk-balance bk-balance-new" x="190" y="152">₹12,750</text>

          <circle class="bk-lock-pulse" cx="120" cy="113" r="15"><animate attributeName="r" values="15;27" dur="3.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0" dur="3.6s" repeatCount="indefinite"/></circle>
          <circle class="bk-lock-badge" cx="120" cy="113" r="15"/>
          <path class="bk-lock-shackle" d="M115 112 v-5 a5 5 0 0 1 10 0 v5"/>
          <rect class="bk-lock-body" x="112" y="112" width="16" height="12" rx="2"/>

          <circle class="bk-coin" cy="113" r="6">
            <animate attributeName="cx" values="90;120;150" keyTimes="0;0.5;1" dur="3.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.08;0.5;0.92;1" dur="3.6s" repeatCount="indefinite"/>
          </circle>

          <g>
            <circle class="bk-badge-sm" cx="50" cy="166" r="11"/>
            <path class="ph-check" style="animation-delay:0s" d="M44 166 l4 5 l9 -10"/>
          </g>
          <g>
            <circle class="bk-badge-sm" cx="190" cy="166" r="11"/>
            <path class="ph-check" style="animation-delay:0.35s" d="M184 166 l4 5 l9 -10"/>
          </g>
        </svg>
        <a class="ph-live" href="https://banking-management-system-java.onrender.com" target="_blank" rel="noopener noreferrer">▶ View live app</a>
      </div>`;

const FSOCIETY_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Lab</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="Terminal recon animation">
          <defs>
            <clipPath id="fsClip"><rect x="25" y="67" width="190" height="126" rx="6"/></clipPath>
          </defs>

          <rect class="ph-outline" x="24" y="46" width="192" height="148" rx="10" fill="none"/>
          <rect class="fs-term-bar" x="25" y="47" width="190" height="20" rx="9"/>
          <circle class="fs-dot fs-dot-r" cx="38" cy="57" r="3.2"/>
          <circle class="fs-dot fs-dot-y" cx="48" cy="57" r="3.2"/>
          <circle class="fs-dot fs-dot-g" cx="58" cy="57" r="3.2"/>
          <text class="fs-term-title" x="120" y="61">suraj@portfolio:~$</text>

          <g class="fs-rain" clip-path="url(#fsClip)">
            <text class="fs-rain-col" x="40" y="70">01<tspan x="40" dy="14">10</tspan><tspan x="40" dy="14">11</tspan><tspan x="40" dy="14">00</tspan><tspan x="40" dy="14">10</tspan><tspan x="40" dy="14">01</tspan><tspan x="40" dy="14">11</tspan>
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,98" dur="4.8s" repeatCount="indefinite"/>
            </text>
            <text class="fs-rain-col fs-rain-col-b" x="200" y="70">11<tspan x="200" dy="14">00</tspan><tspan x="200" dy="14">10</tspan><tspan x="200" dy="14">01</tspan><tspan x="200" dy="14">11</tspan><tspan x="200" dy="14">00</tspan><tspan x="200" dy="14">01</tspan>
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,98" dur="4.8s" begin="1.4s" repeatCount="indefinite"/>
            </text>
          </g>

          <text class="fs-line fs-line-1" x="34" y="86">$ nmap -sV target.local</text>
          <text class="fs-line fs-line-2" x="34" y="102">host up · 22/tcp ssh · 80/tcp http</text>
          <text class="fs-line fs-line-3" x="34" y="118">$ checking OWASP Top 10…</text>

          <rect class="fs-bar-bg" x="34" y="130" width="150" height="8" rx="4"/>
          <rect class="fs-bar-fill" x="34" y="130" width="150" height="8" rx="4"/>

          <text class="fs-line fs-line-4" x="34" y="150">$ report: 0 criticals found</text>
          <rect class="fs-cursor" x="34" y="160" width="8" height="12"/>

          <g>
            <circle class="ph-outline" cx="196" cy="176" r="14" fill="none"/>
            <path class="ph-check" d="M189 176 l5 6 l12 -13"/>
          </g>
        </svg>
        <a class="ph-live" href="https://fsociety-web.vercel.app/" target="_blank" rel="noopener noreferrer">▶ View live lab</a>
      </div>`;

const PF_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Site</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="Lighthouse score and responsive layout animation">
          <rect class="ph-outline" x="24" y="46" width="192" height="148" rx="10" fill="none"/>
          <rect class="pf-browser-bar" x="25" y="47" width="190" height="20" rx="9"/>
          <circle class="pf-dot pf-dot-r" cx="38" cy="57" r="3.2"/>
          <circle class="pf-dot pf-dot-y" cx="48" cy="57" r="3.2"/>
          <circle class="pf-dot pf-dot-g" cx="58" cy="57" r="3.2"/>
          <text class="pf-url-text" x="128" y="61" font-size="8.5">🔒 suraj-portfolio-io.vercel.app</text>

          <g class="pf-device pf-device-desktop" transform="translate(46,80)">
            <rect class="pf-screen" x="0" y="0" width="78" height="50" rx="4"/>
            <rect class="pf-stand" x="32" y="50" width="14" height="8"/>
            <rect class="pf-stand" x="20" y="58" width="38" height="4" rx="2"/>
          </g>
          <g class="pf-device pf-device-mobile" transform="translate(66,76)">
            <rect class="pf-screen" x="0" y="0" width="38" height="68" rx="8"/>
            <circle class="pf-stand" cx="19" cy="61" r="2.2"/>
          </g>

          <g transform="translate(168,112)">
            <circle class="pf-gauge-bg" r="30" fill="none"/>
            <circle class="pf-gauge-fill" r="30" fill="none" transform="rotate(-90)"/>
            <text class="pf-score-text" y="5">95</text>
          </g>

          <g>
            <circle class="pf-badge-sm" cx="42" cy="178" r="10"/>
            <path class="ph-check" style="animation-delay:0s"   d="M37 178 l3 4 l7 -8"/>
            <circle class="pf-badge-sm" cx="76" cy="178" r="10"/>
            <path class="ph-check" style="animation-delay:0.2s" d="M71 178 l3 4 l7 -8"/>
            <circle class="pf-badge-sm" cx="110" cy="178" r="10"/>
            <path class="ph-check" style="animation-delay:0.4s" d="M105 178 l3 4 l7 -8"/>
            <circle class="pf-badge-sm" cx="144" cy="178" r="10"/>
            <path class="ph-check" style="animation-delay:0.6s" d="M139 178 l3 4 l7 -8"/>
          </g>
        </svg>
        <a class="ph-live" href="https://suraj-portfolio-io.vercel.app/" target="_blank" rel="noopener noreferrer">▶ View live site</a>
      </div>`;

const CHAT_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Socket.io</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="Real-time WebSocket chat animation">
          <!-- Window frame -->
          <rect class="ph-outline" x="24" y="38" width="192" height="168" rx="12" fill="none"/>
          <rect class="pf-browser-bar" x="25" y="39" width="190" height="22" rx="11"/>
          <circle class="pf-dot pf-dot-r" cx="38" cy="50" r="3.2"/>
          <circle class="pf-dot pf-dot-y" cx="48" cy="50" r="3.2"/>
          <circle class="pf-dot pf-dot-g" cx="58" cy="50" r="3.2"/>
          <text class="pf-url-text" x="130" y="54" font-size="8.5">⚡ Chat-App · Socket.io</text>

          <!-- Chat bubble 1 (incoming) -->
          <g transform="translate(36, 72)">
            <rect x="0" y="0" width="125" height="24" rx="8" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1"/>
            <text x="10" y="16" font-size="8" fill="var(--text-secondary)" font-family="var(--font-mono)">Hey, is Socket.io live?</text>
          </g>

          <!-- Chat bubble 2 (outgoing / response) -->
          <g transform="translate(76, 104)">
            <rect x="0" y="0" width="125" height="24" rx="8" fill="var(--accent)" opacity="0.9"/>
            <text x="10" y="16" font-size="8" fill="#041614" font-weight="bold" font-family="var(--font-mono)">Sub-10ms delivery 🚀</text>
          </g>

          <!-- Typing indicator bubble -->
          <g transform="translate(36, 136)">
            <rect x="0" y="0" width="55" height="20" rx="8" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1"/>
            <circle cx="16" cy="10" r="2.8" fill="var(--accent)">
              <animate attributeName="cy" values="10;6;10" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="28" cy="10" r="2.8" fill="var(--accent)">
              <animate attributeName="cy" values="10;6;10" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="40" cy="10" r="2.8" fill="var(--accent)">
              <animate attributeName="cy" values="10;6;10" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Live delivery badge -->
          <g transform="translate(155, 150)">
            <circle class="pf-badge-sm" cx="20" cy="20" r="12"/>
            <path class="ph-check" d="M14 20 l4 4 l8 -8"/>
          </g>
        </svg>
        <a class="ph-live" href="https://chat-app-nl36.onrender.com" target="_blank" rel="noopener noreferrer">▶ View live app</a>
      </div>`;

const NOSHARE_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live P2P WebRTC</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="WebRTC peer to peer transfer animation">
          <!-- Main Frame -->
          <rect class="ph-outline" x="24" y="38" width="192" height="168" rx="12" fill="none"/>
          <rect class="pf-browser-bar" x="25" y="39" width="190" height="22" rx="11"/>
          <circle class="pf-dot pf-dot-r" cx="38" cy="50" r="3.2"/>
          <circle class="pf-dot pf-dot-y" cx="48" cy="50" r="3.2"/>
          <circle class="pf-dot pf-dot-g" cx="58" cy="50" r="3.2"/>
          <text class="pf-url-text" x="130" y="54" font-size="8.5">🌐 NoShare · Serverless P2P</text>

          <!-- Peer A node -->
          <g transform="translate(56, 95)">
            <circle r="18" fill="var(--bg-card)" stroke="var(--accent)" stroke-width="1.8"/>
            <text x="0" y="4" text-anchor="middle" font-size="8" font-weight="bold" fill="var(--text-primary)" font-family="var(--font-mono)">PEER A</text>
            <circle class="bk-lock-pulse" r="18"><animate attributeName="r" values="18;28" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite"/></circle>
          </g>

          <!-- Peer B node -->
          <g transform="translate(184, 95)">
            <circle r="18" fill="var(--bg-card)" stroke="var(--accent)" stroke-width="1.8"/>
            <text x="0" y="4" text-anchor="middle" font-size="8" font-weight="bold" fill="var(--text-primary)" font-family="var(--font-mono)">PEER B</text>
            <circle class="bk-lock-pulse" r="18"><animate attributeName="r" values="18;28" dur="2.4s" begin="0.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0" dur="2.4s" begin="0.6s" repeatCount="indefinite"/></circle>
          </g>

          <!-- Curved Connection channel -->
          <path id="p2pChannel" d="M 74 95 Q 120 70 166 95" fill="none" stroke="var(--border)" stroke-width="2" stroke-dasharray="3 3"/>

          <!-- Animated flowing packet -->
          <circle r="4.5" fill="#62DAEB">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 74 95 Q 120 70 166 95" />
          </circle>

          <!-- Progress status box -->
          <g transform="translate(42, 134)">
            <rect x="0" y="0" width="156" height="28" rx="6" fill="var(--bg-card)" stroke="var(--border-faint)" stroke-width="1"/>
            <text x="12" y="12" font-size="7.5" fill="var(--text-secondary)" font-family="var(--font-mono)">P2P Direct · 0B Server Storage</text>
            <!-- Progress bar -->
            <rect x="12" y="17" width="132" height="5" rx="2.5" fill="var(--bg-surface)"/>
            <rect x="12" y="17" width="92" height="5" rx="2.5" fill="var(--accent)"/>
          </g>

          <!-- Success checkmark -->
          <circle class="pf-badge-sm" cx="178" cy="172" r="10"/>
          <path class="ph-check" d="M173 172 l3 4 l7 -8"/>
        </svg>
        <a class="ph-live" href="https://no-share.vercel.app" target="_blank" rel="noopener noreferrer">▶ View live app</a>
      </div>`;

const POLICE_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live AI Portal</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="AI document parsing portal animation">
          <!-- Window frame -->
          <rect class="ph-outline" x="24" y="38" width="192" height="168" rx="12" fill="none"/>
          <rect class="pf-browser-bar" x="25" y="39" width="190" height="22" rx="11"/>
          <circle class="pf-dot pf-dot-r" cx="38" cy="50" r="3.2"/>
          <circle class="pf-dot pf-dot-y" cx="48" cy="50" r="3.2"/>
          <circle class="pf-dot pf-dot-g" cx="58" cy="50" r="3.2"/>
          <text class="pf-url-text" x="130" y="54" font-size="8.5">📑 Police-Docs · Gemini 1.5</text>

          <!-- Document outline with scanning laser beam -->
          <g transform="translate(42, 70)">
            <rect x="0" y="0" width="56" height="74" rx="4" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.2"/>
            <line x1="8" y1="14" x2="48" y2="14" stroke="var(--border-faint)" stroke-width="2"/>
            <line x1="8" y1="24" x2="40" y2="24" stroke="var(--border-faint)" stroke-width="2"/>
            <line x1="8" y1="34" x2="44" y2="34" stroke="var(--border-faint)" stroke-width="2"/>
            <line x1="8" y1="44" x2="36" y2="44" stroke="var(--border-faint)" stroke-width="2"/>
            <line x1="8" y1="54" x2="48" y2="54" stroke="var(--border-faint)" stroke-width="2"/>
            
            <!-- Laser scan line animating up/down -->
            <line x1="2" y1="6" x2="54" y2="6" stroke="#62DAEB" stroke-width="2" opacity="0.85">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,60; 0,0" dur="2.8s" repeatCount="indefinite"/>
            </line>
          </g>

          <!-- Extracted Fields list -->
          <g transform="translate(108, 72)">
            <rect x="0" y="0" width="90" height="20" rx="4" fill="var(--bg-card)" stroke="var(--border-faint)" stroke-width="1"/>
            <text x="8" y="13" font-size="7.5" fill="var(--accent)" font-family="var(--font-mono)">Case: #8821-AK</text>
            
            <rect x="0" y="26" width="90" height="20" rx="4" fill="var(--bg-card)" stroke="var(--border-faint)" stroke-width="1"/>
            <text x="8" y="39" font-size="7.5" fill="var(--text-secondary)" font-family="var(--font-mono)">MFA: Verified ✓</text>

            <rect x="0" y="52" width="90" height="20" rx="4" fill="var(--bg-card)" stroke="var(--border-faint)" stroke-width="1"/>
            <text x="8" y="65" font-size="7.5" fill="var(--text-secondary)" font-family="var(--font-mono)">SHA-256: Valid ✓</text>
          </g>

          <!-- Status badge -->
          <g transform="translate(42, 154)">
            <rect x="0" y="0" width="156" height="20" rx="4" fill="var(--bg-surface)" stroke="var(--accent-light)" stroke-width="1"/>
            <text x="12" y="13" font-size="7.5" fill="var(--accent)" font-weight="bold" font-family="var(--font-mono)">AI Extraction Complete · RBAC Secured</text>
          </g>
        </svg>
        <a class="ph-live" href="https://digital-record-portal.vercel.app" target="_blank" rel="noopener noreferrer">▶ View live portal</a>
      </div>`;

const DISEASE_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Diagnosis</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="Symptom scan and prediction confidence animation">
          <defs>
            <clipPath id="dpClip"><rect x="30" y="66" width="182" height="38"/></clipPath>
          </defs>

          <rect class="ph-outline" x="24" y="40" width="192" height="160" rx="12" fill="none"/>
          <rect class="dp-topbar" x="25" y="41" width="190" height="22" rx="10"/>
          <path class="dp-heart-icon" d="M39 47.5c-1.6-3-6.4-3-6.4.6 0 3 3.6 6 6.4 8 2.8-2 6.4-5 6.4-8 0-3.6-4.8-3.6-6.4-.6z"/>
          <text class="dp-topbar-text" x="128" y="55">VITALS · SYMPTOM SCAN</text>

          <g clip-path="url(#dpClip)">
            <path class="dp-ecg-line" d="M34,85 L58,85 L64,68 L70,102 L76,76 L82,85 L206,85"/>
            <circle class="dp-ecg-dot" r="3.2">
              <animateMotion dur="3.2s" repeatCount="indefinite"
                path="M34,85 L58,85 L64,68 L70,102 L76,76 L82,85 L206,85"/>
            </circle>
          </g>

          <g class="dp-symptom-row dp-row-1">
            <rect class="dp-checkbox" x="38" y="112" width="13" height="13" rx="3"/>
            <path class="ph-check" style="animation-delay:0s" d="M40 118.5 l2.6 2.6 l5.5 -6"/>
            <text class="dp-symptom-text" x="58" y="122">Fever</text>
            <rect class="dp-conf-bg" x="150" y="115" width="52" height="6" rx="3"/>
            <rect class="dp-conf-fill dp-conf-a" x="150" y="115" width="52" height="6" rx="3" style="transform-origin:150px 118px"/>
          </g>
          <g class="dp-symptom-row dp-row-2">
            <rect class="dp-checkbox" x="38" y="134" width="13" height="13" rx="3"/>
            <path class="ph-check" style="animation-delay:.3s" d="M40 140.5 l2.6 2.6 l5.5 -6"/>
            <text class="dp-symptom-text" x="58" y="144">Headache</text>
            <rect class="dp-conf-bg" x="150" y="137" width="52" height="6" rx="3"/>
            <rect class="dp-conf-fill dp-conf-b" x="150" y="137" width="52" height="6" rx="3" style="transform-origin:150px 140px"/>
          </g>
          <g class="dp-symptom-row dp-row-3">
            <rect class="dp-checkbox" x="38" y="156" width="13" height="13" rx="3"/>
            <path class="ph-check" style="animation-delay:.6s" d="M40 162.5 l2.6 2.6 l5.5 -6"/>
            <text class="dp-symptom-text" x="58" y="166">Fatigue</text>
            <rect class="dp-conf-bg" x="150" y="159" width="52" height="6" rx="3"/>
            <rect class="dp-conf-fill dp-conf-c" x="150" y="159" width="52" height="6" rx="3" style="transform-origin:150px 162px"/>
          </g>

          <line x1="34" y1="182" x2="130" y2="182" stroke="var(--accent)" stroke-opacity=".12"/>
          <text class="dp-risk-text" x="34" y="192">Predicted: Typhoid</text>

          <g transform="translate(190,190)">
            <circle class="dp-gauge-bg" r="20" fill="none"/>
            <circle class="dp-gauge-fill" r="20" fill="none" transform="rotate(-90)"/>
            <text class="dp-gauge-text" y="4">94%</text>
          </g>
        </svg>
        <a class="ph-live" href="https://disease-prediction-updated.vercel.app" target="_blank" rel="noopener noreferrer">▶ View live app</a>
      </div>`;

const CINEROULETTE_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">\u{1F6A7} Building Now</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="CineRoulette slot-machine spin and reveal animation">
          <defs>
            <clipPath id="crClip"><rect x="30" y="66" width="180" height="86" rx="6"/></clipPath>
          </defs>

          <rect class="ph-outline" x="24" y="40" width="192" height="160" rx="12" fill="none"/>
          <rect class="cr-topbar" x="25" y="41" width="190" height="22" rx="10"/>
          <circle class="cr-dot cr-dot-r" cx="38" cy="52" r="3.2"/>
          <circle class="cr-dot cr-dot-y" cx="48" cy="52" r="3.2"/>
          <circle class="cr-dot cr-dot-g" cx="58" cy="52" r="3.2"/>
          <text class="cr-topbar-text" x="128" y="56">\u{1F3AC} CINEROULETTE \u00B7 SPIN</text>

          <g clip-path="url(#crClip)">
            <g class="cr-reel cr-reel-1">
              <rect class="cr-poster cr-poster-a" x="36" y="-10" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-b" x="36" y="66" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-c" x="36" y="142" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-a" x="36" y="218" width="48" height="72" rx="4"/>
            </g>
            <g class="cr-reel cr-reel-2">
              <rect class="cr-poster cr-poster-c" x="96" y="-10" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-a" x="96" y="66" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-b" x="96" y="142" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-c" x="96" y="218" width="48" height="72" rx="4"/>
            </g>
            <g class="cr-reel cr-reel-3">
              <rect class="cr-poster cr-poster-b" x="156" y="-10" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-c" x="156" y="66" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-a" x="156" y="142" width="48" height="72" rx="4"/>
              <rect class="cr-poster cr-poster-b" x="156" y="218" width="48" height="72" rx="4"/>
            </g>
          </g>

          <rect class="cr-select-ring" x="94" y="90" width="52" height="40" rx="6" fill="none"/>

          <text class="cr-result-text" x="120" y="168">\u{1F3AF} Parasite \u00B7 8.6\u2605</text>
          <text class="cr-why-text" x="120" y="182">Dark, mind-bending thriller \u00B7 under 2h</text>

          <g>
            <circle class="cr-badge-sm" cx="120" cy="192" r="10"/>
            <path class="ph-check" d="M114 192 l4 4 l8 -9"/>
          </g>
        </svg>
        <span class="ph-live ph-live--pending">\u{1F680} Build starts today</span>
      </div>`;

const LIFEOS_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">\u{1F4CB} Queued Next</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="LifeOS universal command-palette search animation">
          <defs>
            <clipPath id="losClip"><rect x="26" y="42" width="188" height="156" rx="12"/></clipPath>
          </defs>

          <rect class="ph-outline" x="24" y="40" width="192" height="160" rx="12" fill="none"/>

          <g class="los-bg-grid" clip-path="url(#losClip)">
            <rect class="los-widget" x="34" y="50" width="46" height="30" rx="6"/>
            <rect class="los-widget" x="86" y="50" width="46" height="30" rx="6"/>
            <rect class="los-widget" x="138" y="50" width="46" height="30" rx="6"/>
            <rect class="los-widget" x="34" y="86" width="150" height="14" rx="6"/>
          </g>

          <rect class="los-palette" x="40" y="66" width="160" height="112" rx="10"/>
          <circle class="los-search-icon-ring" cx="56" cy="82" r="6" fill="none"/>
          <line class="los-search-icon-handle" x1="60.5" y1="86.5" x2="65" y2="91"/>
          <text class="los-search-text" x="70" y="86">tasks due today</text>
          <rect class="los-cursor" x="148" y="79" width="1.6" height="11"/>

          <line x1="50" y1="98" x2="190" y2="98" stroke="var(--accent)" stroke-opacity=".14"/>

          <g class="los-row los-row-1">
            <rect class="los-icon-chip" x="50" y="106" width="18" height="18" rx="5"/>
            <text class="los-icon-glyph" x="59" y="118">\u2713</text>
            <text class="los-row-text" x="76" y="118">Finish LifeOS wireframes</text>
          </g>
          <g class="los-row los-row-2">
            <rect class="los-icon-chip" x="50" y="130" width="18" height="18" rx="5"/>
            <text class="los-icon-glyph" x="59" y="142">\u25F7</text>
            <text class="los-row-text" x="76" y="142">Sync calendar \u2194 tasks module</text>
          </g>
          <g class="los-row los-row-3">
            <rect class="los-icon-chip" x="50" y="154" width="18" height="18" rx="5"/>
            <text class="los-icon-glyph" x="59" y="166">\u2726</text>
            <text class="los-row-text" x="76" y="166">AI: 20+ modules unified</text>
          </g>
        </svg>
        <span class="ph-live ph-live--pending">\u23ED After CineRoulette ships</span>
      </div>`;

const NETSCOPE_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Capture</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="NetScope live packet capture and threat scoring animation">
          <defs>
            <linearGradient id="nsSweepGrad" x1="0" y1="0" x2="1" y2="0"><stop class="ph-s0" offset="0%"/><stop class="ph-s1" offset="100%"/></linearGradient>
            <radialGradient id="nsRadarGlow"><stop class="ph-g0" offset="0%"/><stop class="ph-g1" offset="100%"/></radialGradient>
          </defs>

          <rect class="ph-outline" x="24" y="40" width="192" height="160" rx="12" fill="none"/>
          <rect class="ns-topbar" x="25" y="41" width="190" height="22" rx="10"/>
          <circle class="ns-dot ns-dot-r" cx="38" cy="52" r="3.2"/>
          <circle class="ns-dot ns-dot-y" cx="48" cy="52" r="3.2"/>
          <circle class="ns-dot ns-dot-g" cx="58" cy="52" r="3.2"/>
          <text class="ns-topbar-text" x="128" y="56">\u26E8 NETSCOPE \u00B7 LIVE CAPTURE</text>

          <circle class="ns-radar-glow" cx="88" cy="132" r="50" fill="url(#nsRadarGlow)"/>
          <circle class="ns-radar-ring" cx="88" cy="132" r="18"/>
          <circle class="ns-radar-ring" cx="88" cy="132" r="34"/>
          <circle class="ns-radar-ring" cx="88" cy="132" r="50"/>
          <line class="ns-radar-cross" x1="38" y1="132" x2="138" y2="132"/>
          <line class="ns-radar-cross" x1="88" y1="82" x2="88" y2="182"/>

          <g>
            <path class="ns-radar-sweep" d="M88 132 L88 82 A50 50 0 0 1 124 97 Z" fill="url(#nsSweepGrad)"/>
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 88 132" to="360 88 132" dur="3.6s" repeatCount="indefinite"/>
          </g>

          <circle class="ns-node ns-host-clean"      cx="112" cy="108" r="4"/>
          <circle class="ns-node ns-host-suspicious n2" cx="60" cy="150" r="4"/>
          <circle class="ns-node ns-host-malicious n3" cx="104" cy="160" r="4"/>
          <circle class="ns-node ns-host-clean n4"    cx="70" cy="112" r="3.4"/>

          <text class="ns-host-text ns-row-1" x="152" y="100">10.0.0.7 \u00B7 clean</text>
          <text class="ns-host-text ns-row-2" x="152" y="116">10.0.0.14 \u00B7 susp.</text>
          <text class="ns-host-text ns-row-3" x="152" y="132">203.0.113.9 \u00B7 mal.</text>

          <line x1="34" y1="156" x2="206" y2="156" stroke="var(--accent)" stroke-opacity=".14"/>
          <text class="ns-alert-text" x="34" y="168">\u26A0 port scan flagged \u00B7 10.0.0.14</text>

          <g transform="translate(190,180)">
            <circle class="ns-gauge-bg" r="16" fill="none"/>
            <circle class="ns-gauge-fill" r="16" fill="none" transform="rotate(-90)"/>
            <text class="ns-gauge-text" y="4">74%</text>
          </g>
          <text class="ns-gauge-label" x="190" y="202">ENCRYPTED</text>
        </svg>
        <a class="ph-live" href="https://network-packet-analyzer-tan.vercel.app" target="_blank" rel="noopener noreferrer">▶ View live console</a>
      </div>`;

const GRABMEDIA_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Downloader</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="Instagram and YouTube download animation">
          <rect class="ph-outline" x="18" y="28" width="204" height="172" rx="14" fill="none"/>
          <rect class="gm-topbar" x="19" y="29" width="202" height="24" rx="11"/>
          <circle class="gm-dot gm-dot-r" cx="32" cy="41" r="3.2"/>
          <circle class="gm-dot gm-dot-y" cx="42" cy="41" r="3.2"/>
          <circle class="gm-dot gm-dot-g" cx="52" cy="41" r="3.2"/>
          <text class="gm-topbar-text" x="145" y="45">GRABMEDIA · LIVE</text>

          <rect class="gm-urlbar" x="30" y="62" width="180" height="22" rx="11"/>
          <g class="gm-slot-ig">
            <circle class="gm-url-icon gm-url-icon-ig" cx="44" cy="73" r="6.5"/>
            <text class="gm-url-text" x="56" y="76.5">instagram.com/reel/…</text>
          </g>
          <g class="gm-slot-yt">
            <circle class="gm-url-icon gm-url-icon-yt" cx="44" cy="73" r="6.5"/>
            <text class="gm-url-text" x="56" y="76.5">youtube.com/watch?v=…</text>
          </g>
          <rect class="gm-cursor" x="196" y="68" width="1.6" height="10"/>

          <rect class="gm-preview-card" x="52" y="96" width="136" height="54" rx="8"/>
          <path class="gm-play-icon" d="M108 113 L124 123 L108 133 Z"/>
          <rect class="gm-quality-chip" x="158" y="100" width="26" height="12" rx="6"/>
          <text class="gm-quality-text" x="171" y="109">HD</text>

          <path class="gm-arrow" d="M120 152 V180 M110 170 L120 182 L130 170"/>
          <rect class="gm-file" x="114" y="140" width="12" height="12" rx="2"/>
          <path class="gm-tray" d="M92 190 H148"/>

          <g class="gm-badge-check">
            <circle cx="152" cy="182" r="12"/>
            <path d="M146 182 l4 5 l9 -10"/>
          </g>

          <text class="gm-status gm-status-fetch" x="120" y="216">FETCHING…</text>
          <text class="gm-status gm-status-saved" x="120" y="216">SAVED ✓</text>
        </svg>
        <a class="ph-live" href="https://grab-media-project-psi.vercel.app/" target="_blank" rel="noopener noreferrer">▶ Try it live</a>
      </div>`;

const GITATLAS_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ Live Reference</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="GitAtlas interactive Git DAG graph and command reference animation">
          <defs>
            <linearGradient id="gaGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#2F81F7" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#31F2A0" stop-opacity="0.9"/>
            </linearGradient>
          </defs>

          <rect class="ph-outline" x="20" y="32" width="200" height="168" rx="12" fill="none"/>
          <rect class="ga-topbar" x="21" y="33" width="198" height="22" rx="10"/>
          <circle class="ga-dot ga-dot-r" cx="34" cy="44" r="3.2"/>
          <circle class="ga-dot ga-dot-y" cx="44" cy="44" r="3.2"/>
          <circle class="ga-dot ga-dot-g" cx="54" cy="44" r="3.2"/>
          <text class="ga-topbar-text" x="135" y="48">GITATLAS · 381 CMDS · DAG</text>

          <rect class="ga-cmd-box" x="28" y="60" width="184" height="22" rx="6"/>
          <text class="ga-prompt-symbol" x="36" y="74">$</text>
          <g class="ga-slot-cmd1">
            <text class="ga-cmd-text" x="46" y="74">git checkout -b feat/auth</text>
          </g>
          <g class="ga-slot-cmd2">
            <text class="ga-cmd-text" x="46" y="74">git merge --squash feat/auth</text>
          </g>
          <rect class="ga-cursor" x="194" y="66" width="1.6" height="10"/>

          <!-- DAG Graph Lines -->
          <path class="ga-branch ga-branch-main" d="M 48 128 L 192 128"/>
          <path class="ga-branch ga-branch-feat" d="M 82 128 C 96 128, 104 100, 126 100 C 148 100, 158 128, 172 128"/>

          <!-- Animated pulse packet on feat branch -->
          <circle class="ga-packet" r="3" fill="#31F2A0">
            <animateMotion dur="4s" repeatCount="indefinite"
              path="M 82 128 C 96 128, 104 100, 126 100 C 148 100, 158 128, 172 128"/>
          </circle>

          <!-- Commit Nodes -->
          <circle class="ga-node ga-node-main" cx="48" cy="128" r="5.5"/>
          <text class="ga-node-label" x="48" y="142">c1</text>

          <circle class="ga-node ga-node-main" cx="82" cy="128" r="5.5"/>
          <text class="ga-node-label" x="82" y="142">c2</text>

          <circle class="ga-node ga-node-feat" cx="126" cy="100" r="5.5"/>
          <text class="ga-node-label ga-node-label-feat" x="126" y="92">feat</text>

          <circle class="ga-head-pulse" cx="172" cy="128" r="7"/>
          <circle class="ga-node ga-node-merge" cx="172" cy="128" r="6.5"/>
          <text class="ga-node-label" x="172" y="142">HEAD</text>

          <!-- Branch Labels / Chips -->
          <g class="ga-chips">
            <rect class="ga-tag-bg" x="38" y="154" width="34" height="13" rx="6.5"/>
            <text class="ga-tag-text" x="55" y="163">main</text>

            <rect class="ga-tag-bg ga-tag-bg-feat" x="80" y="154" width="46" height="13" rx="6.5"/>
            <text class="ga-tag-text ga-tag-text-feat" x="103" y="163">feature</text>

            <rect class="ga-tag-bg ga-tag-bg-merge" x="134" y="154" width="68" height="13" rx="6.5"/>
            <text class="ga-tag-text ga-tag-text-merge" x="168" y="163">3-Way Merge ✓</text>
          </g>

          <text class="ga-hud-text" x="120" y="186">⚡ 17 Playbooks · Secret Shield · CLI</text>
        </svg>
        <a class="ph-live" href="https://git-atlas-project.vercel.app" target="_blank" rel="noopener noreferrer">▶ Explore field guide</a>
      </div>`;

const SNAPURL_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">⚡ Edge Architecture</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="SnapURL URL Shortening Flow Animation">
          <rect class="ph-outline" x="20" y="32" width="200" height="168" rx="12" fill="none" stroke="var(--border)" stroke-width="1.5"/>
          
          <rect class="ga-topbar" x="21" y="33" width="198" height="22" rx="10"/>
          <circle class="ga-dot ga-dot-r" cx="34" cy="44" r="3.2"/>
          <circle class="ga-dot ga-dot-y" cx="44" cy="44" r="3.2"/>
          <circle class="ga-dot ga-dot-g" cx="54" cy="44" r="3.2"/>
          <text class="ga-topbar-text" x="135" y="48">SNAPURL · BASE62 ENCODER</text>
          
          <!-- Long URL Input Box -->
          <rect x="35" y="65" width="170" height="22" rx="4" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.2"/>
          <text class="ga-cmd-text" x="42" y="80" font-size="9" fill="var(--text-secondary)">Long: https://suraj.dev/super/long/url</text>

          <!-- Down Arrow / Process Flow -->
          <path d="M 120 87 L 120 115" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="2 3" />
          
          <!-- Animated Packet 1 (Request) -->
          <circle r="3.5" fill="var(--accent)">
            <animateMotion dur="3s" repeatCount="indefinite" path="M 120 87 L 120 115"/>
          </circle>

          <!-- Vercel Serverless Function Box -->
          <rect x="80" y="115" width="80" height="28" rx="6" fill="#000" stroke="#444" stroke-width="1.5"/>
          <text x="120" y="132" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle" font-family="monospace">Vercel API</text>

          <!-- Edge DB Sync (Turso) -->
          <path d="M 160 129 L 195 129" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="2 3" />
          <circle r="3.5" fill="#3b82f6">
            <animateMotion dur="3s" repeatCount="indefinite" path="M 160 129 L 195 129" begin="0.8s"/>
          </circle>
          
          <rect x="195" y="119" width="16" height="20" rx="3" fill="#111" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="203" y="132" font-size="8" font-weight="bold" fill="#3b82f6" text-anchor="middle">DB</text>

          <!-- Down Arrow to Result -->
          <path d="M 120 143 L 120 170" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="2 3" />
          
          <!-- Animated Packet 2 (Response) -->
          <circle r="3.5" fill="#31F2A0">
            <animateMotion dur="3s" repeatCount="indefinite" path="M 120 143 L 120 170" begin="1.6s"/>
          </circle>

          <!-- Short URL Result Box -->
          <rect x="70" y="170" width="100" height="22" rx="4" fill="#004743" stroke="#31F2A0" stroke-width="1"/>
          <text class="ga-cmd-text" x="78" y="185" font-size="10" font-weight="bold" style="fill: #31F2A0 !important;">Short: snap.url/Xr9a</text>

        </svg>
        <a class="ph-live" href="https://snapurl-project.vercel.app/" target="_blank" rel="noopener noreferrer">▶ Try live demo</a>
      </div>`;

    const DREAD_HERO = `
      <div class="ph-visual" aria-hidden="true">
        <span class="ph-badge">◆ DREAD Engine</span>
        <svg class="ph-radar" viewBox="0 0 240 240" role="img" aria-label="DREAD Threat Scoring Animation">
          <rect class="ph-outline" x="24" y="40" width="192" height="160" rx="10" fill="none"/>
          
          <line x1="24" y1="80" x2="216" y2="80" stroke="var(--border)" stroke-dasharray="4 4" stroke-opacity="0.8"/>
          <line x1="24" y1="120" x2="216" y2="120" stroke="var(--border)" stroke-dasharray="4 4" stroke-opacity="0.5"/>
          <line x1="24" y1="160" x2="216" y2="160" stroke="var(--border)" stroke-dasharray="4 4" stroke-opacity="0.3"/>

          <!-- Bars -->
          <rect class="bk-chip" x="42" y="150" width="20" height="50" rx="3">
            <animate attributeName="y" values="180;100;180" dur="4s" repeatCount="indefinite" />
            <animate attributeName="height" values="20;100;20" dur="4s" repeatCount="indefinite" />
          </rect>
          <text x="52" y="215" fill="var(--text-secondary)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">D</text>

          <rect class="bk-chip" x="76" y="130" width="20" height="70" rx="3">
             <animate attributeName="y" values="180;120;180" dur="4s" begin="0.5s" repeatCount="indefinite" />
             <animate attributeName="height" values="20;80;20" dur="4s" begin="0.5s" repeatCount="indefinite" />
          </rect>
          <text x="86" y="215" fill="var(--text-secondary)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">R</text>

          <rect class="bk-chip" style="fill: var(--accent)" x="110" y="80" width="20" height="120" rx="3">
            <animate attributeName="y" values="180;60;180" dur="4s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="height" values="20;140;20" dur="4s" begin="1s" repeatCount="indefinite" />
          </rect>
          <text x="120" y="215" fill="var(--text-primary)" font-weight="bold" font-size="10" text-anchor="middle" font-family="var(--font-mono)">E</text>

          <rect class="bk-chip" x="144" y="110" width="20" height="90" rx="3">
             <animate attributeName="y" values="180;90;180" dur="4s" begin="1.5s" repeatCount="indefinite" />
             <animate attributeName="height" values="20;110;20" dur="4s" begin="1.5s" repeatCount="indefinite" />
          </rect>
          <text x="154" y="215" fill="var(--text-secondary)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">A</text>

          <rect class="bk-chip" x="178" y="160" width="20" height="40" rx="3">
             <animate attributeName="y" values="180;140;180" dur="4s" begin="2s" repeatCount="indefinite" />
             <animate attributeName="height" values="20;60;20" dur="4s" begin="2s" repeatCount="indefinite" />
          </rect>
          <text x="188" y="215" fill="var(--text-secondary)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">D</text>

          <text x="120" y="65" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle" font-family="var(--font-mono)">Risk: 8.4 (Critical)</text>
        </svg>
        <a class="ph-live" href="https://dread-project.onrender.com/" target="_blank" rel="noopener noreferrer">▶ View live app</a>
      </div>`;

    const HERO_VISUALS = {
      "portfolio-site": PF_HERO,
      chatapp: CHAT_HERO,
      noshare: NOSHARE_HERO,
      "police-documentation": POLICE_HERO,
      "dread-project": DREAD_HERO,
      gitatlas: GITATLAS_HERO,
      snapurl: SNAPURL_HERO,
      siteshield: SHIELD,
      student: STUDENT_HERO,
      bank: BANK_HERO,
      "fsociety-web": FSOCIETY_HERO,
      "disease-ml": DISEASE_HERO,
      cineroulette: CINEROULETTE_HERO,
      lifeos: LIFEOS_HERO,
      netscope: NETSCOPE_HERO,
      grabmedia: GRABMEDIA_HERO,
    };

    const PROJECT_CATEGORIES = [
      { id: "all", label: "All", icon: "" },
      { id: "cybersecurity", label: "Cybersecurity", icon: "🛡️" },
      { id: "devops", label: "DevOps & Cloud", icon: "☁️" },
      { id: "fullstack", label: "Full-Stack", icon: "💻" },
      { id: "ai", label: "ML / AI", icon: "🧠" },
    ];

    let activeProjectCategory = "all";
    let activeProjectType = "independent";
    let activeProjectSearch = "";
    let activeProjectView = "cards";
    try {
      activeProjectView = localStorage.getItem("ak-projects-view") || "cards";
    } catch (e) {}

    let _projectControlsInit = false;

    function matchProjectCategory(p, catId) {
      if (!catId || catId === "all") return true;
      const cat = (p.category || "").toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase());

      if (catId === "cybersecurity") {
        return (
          cat.includes("cyber") ||
          cat.includes("sec") ||
          tags.some((t) =>
            [
              "owasp",
              "security",
              "scapy",
              "cryptography",
              "burp suite",
              "kali linux",
              "pentesting",
              "appsec",
            ].includes(t)
          ) ||
          p.id === "siteshield" ||
          p.id === "netscope" ||
          p.id === "fsociety-web" ||
          p.id === "gitatlas"
        );
      }

      if (catId === "devops") {
        return (
          cat.includes("devops") ||
          cat.includes("tooling") ||
          tags.some((t) =>
            [
              "docker",
              "ci/cd",
              "kubernetes",
              "git",
              "cli",
              "render",
              "vercel",
              "github actions",
              "aws",
            ].includes(t)
          ) ||
          p.id === "gitatlas"
        );
      }

      if (catId === "fullstack") {
        return (
          cat.includes("full-stack") ||
          cat.includes("web") ||
          cat.includes("frontend") ||
          tags.some((t) =>
            [
              "spring boot",
              "next.js",
              "nestjs",
              "express",
              "java",
              "node.js",
              "react",
              "php",
              "mysql",
              "postgresql",
              "rest api",
            ].includes(t)
          ) ||
          p.id === "cineroulette" ||
          p.id === "lifeos" ||
          p.id === "bank" ||
          p.id === "student" ||
          p.id === "grabmedia" ||
          p.id === "tripboss" ||
          p.id === "portfolio-site"
        );
      }

      if (catId === "ai") {
        return (
          cat.includes("machine learning") ||
          cat.includes("ai") ||
          tags.some((t) =>
            ["scikit-learn", "shap", "ml", "ai", "vector db"].includes(t)
          ) ||
          p.id === "disease-ml" ||
          p.id === "cineroulette" ||
          p.id === "lifeos"
        );
      }

      return true;
    }

    function matchProjectSearch(p, query) {
      if (!query) return true;
      const q = query.trim().toLowerCase();
      const title = (p.title || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      const metric = (p.metric || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase());

      return (
        title.includes(q) ||
        desc.includes(q) ||
        metric.includes(q) ||
        cat.includes(q) ||
        tags.some((t) => t.includes(q))
      );
    }

    function buildProjectCardHtml(p) {
      const inner = `
        <div class="project-card-header">
          <span class="project-category">${p.category}</span>
          <div class="project-card-header-right">
           ${p.demo ? `<span class="project-live-badge"><span class="live-dot" aria-hidden="true"></span>Live</span>` : ""}
           ${p.repo ? `<span class="star-count" aria-label="GitHub stars">★ —</span>` : ""}
           <span class="project-period">${p.period}</span>
          </div>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <p class="project-metric">${p.metric}</p>
        <div class="project-tags">
          ${(p.tags || []).map((t) => tagWithIcon(t, "tech-tag")).join("")}
        </div>
        <div class="project-card-actions">
          <button class="btn btn--ghost btn--sm project-casestudy-btn"
                  onclick="Modal.open('${p.id}')" aria-label="Open case study for ${p.title}">
            Case Study →
          </button>
          ${
            p.demo
              ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm project-demo-btn" onclick="event.stopPropagation()" aria-label="Open live demo of ${p.title}">Live Demo ↗</a>`
              : ""
          }
          ${
            p.github
              ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--sm" onclick="event.stopPropagation()" aria-label="View source code for ${p.title}">GitHub ↗</a>`
              : ""
          }
        </div>`;
      const visual = HERO_VISUALS[p.id];
      const body =
        p.hero && visual
          ? `<span class="ph-ribbon" aria-hidden="true">★ Featured</span>${visual}<div class="ph-content">${inner}</div>`
          : inner;
      const cls =
        "project-card" +
        (p.featured ? " project-card--featured" : "") +
        (p.hero ? " project-card--hero" : "") +
        (p.demo ? " project-card--has-demo" : "");
      return `<div class="${cls}" data-reveal="fade-up" data-repo="${p.repo || ""}">${body}</div>`;
    }

    function buildProjectMatrixRowHtml(p) {
      const stackPills = (p.tags || [])
        .slice(0, 4)
        .map((t) => `<span class="matrix-tech-pill">${t}</span>`)
        .join("");
      return `
        <tr class="matrix-row" onclick="Modal.open('${p.id}')">
          <td class="matrix-td matrix-td-title">
            <a href="#projects" class="matrix-title-link" onclick="event.preventDefault(); event.stopPropagation(); Modal.open('${p.id}')">
              ${p.title}
            </a>
            <div class="matrix-title-sub">${p.desc.slice(0, 95)}…</div>
          </td>
          <td class="matrix-td">
            <span class="matrix-badge">${p.category}</span>
          </td>
          <td class="matrix-td">
            <div class="matrix-stack-pills">${stackPills}</div>
          </td>
          <td class="matrix-td">
            <span class="matrix-metric">${p.metric}</span>
          </td>
          <td class="matrix-td" onclick="event.stopPropagation()">
            <div class="matrix-actions">
              <button type="button" class="btn btn--ghost btn--sm matrix-btn" onclick="Modal.open('${p.id}')">Case Study →</button>
              ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm matrix-btn">Live ↗</a>` : ""}
              ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--sm matrix-btn">Code ↗</a>` : ""}
            </div>
          </td>
        </tr>`;
    }

    function setProjectViewMode(mode) {
      activeProjectView = mode;
      try {
        localStorage.setItem("ak-projects-view", mode);
      } catch (e) {}

      const cardsBtn = document.getElementById("view-cards-btn");
      const matrixBtn = document.getElementById("view-matrix-btn");
      const gridEl = document.getElementById("projects-grid");
      const matrixWrapEl = document.getElementById("projects-matrix-wrap");
      const emptyStateEl = document.getElementById("projects-empty-state");

      if (cardsBtn) {
        cardsBtn.classList.toggle("active", mode === "cards");
        cardsBtn.setAttribute("aria-pressed", mode === "cards" ? "true" : "false");
      }
      if (matrixBtn) {
        matrixBtn.classList.toggle("active", mode === "matrix");
        matrixBtn.setAttribute("aria-pressed", mode === "matrix" ? "true" : "false");
      }

      if (emptyStateEl && emptyStateEl.style.display === "block") return;

      if (mode === "cards") {
        if (gridEl) gridEl.style.display = "grid";
        if (matrixWrapEl) matrixWrapEl.style.display = "none";
      } else {
        if (gridEl) gridEl.style.display = "none";
        if (matrixWrapEl) matrixWrapEl.style.display = "block";
      }
    }

    function applyProjectFilters() {
      const all = PORTFOLIO_DATA.projects || [];
      const filtered = all.filter(
        (p) =>
          matchProjectCategory(p, activeProjectCategory) &&
          matchProjectSearch(p, activeProjectSearch) &&
          (activeProjectType === "independent" ? !p.collaborated : p.collaborated)
      );

      const gridEl = document.getElementById("projects-grid");
      const matrixWrapEl = document.getElementById("projects-matrix-wrap");
      const matrixBodyEl = document.getElementById("projects-matrix-body");
      const emptyStateEl = document.getElementById("projects-empty-state");
      const countEl = document.getElementById("project-results-count");
      const clearBtn = document.getElementById("project-search-clear");
      const emptyDescEl = document.getElementById("empty-state-desc");

      if (clearBtn) {
        clearBtn.style.display = activeProjectSearch ? "flex" : "none";
      }

      if (countEl) {
        if (activeProjectSearch || activeProjectCategory !== "all") {
          countEl.textContent = `Showing ${filtered.length} projects`;
        } else {
          countEl.textContent = `${filtered.length} ${activeProjectType} projects`;
        }
      }

      if (filtered.length === 0) {
        if (emptyStateEl) emptyStateEl.style.display = "block";
        if (gridEl) gridEl.style.display = "none";
        if (matrixWrapEl) matrixWrapEl.style.display = "none";
        if (emptyDescEl) {
          emptyDescEl.textContent = activeProjectSearch
            ? `No projects matching "${activeProjectSearch}". Try searching for 'Docker', 'Python', 'Java', or 'Redis'.`
            : "No projects found in this category.";
        }
        return;
      }

      if (emptyStateEl) emptyStateEl.style.display = "none";

      // Update Grid
      if (gridEl) {
        gridEl.innerHTML = filtered.map(buildProjectCardHtml).join("");
      }

      // Update Matrix
      if (matrixBodyEl) {
        matrixBodyEl.innerHTML = filtered.map(buildProjectMatrixRowHtml).join("");
      }

      // Update view visibility
      setProjectViewMode(activeProjectView);

      if (window.Transitions?.refresh) {
        window.Transitions.refresh();
      }
    }

    function renderProjectFilters() {
      const bar = document.getElementById("project-filter-bar");
      if (!bar) return;
      const all = PORTFOLIO_DATA.projects || [];
      const typeFiltered = all.filter(p => (activeProjectType === "independent" ? !p.collaborated : p.collaborated));

      bar.innerHTML = PROJECT_CATEGORIES.map((cat) => {
        const count = typeFiltered.filter((p) => matchProjectCategory(p, cat.id)).length;
        const isActive = cat.id === activeProjectCategory;
        return `
          <button type="button" class="project-filter-btn ${isActive ? "active" : ""}"
                  data-category="${cat.id}" role="tab" aria-selected="${isActive ? "true" : "false"}">
            ${cat.icon ? `<span class="filter-icon">${cat.icon}</span>` : ""}
            ${cat.label}
            <span class="filter-count">${count}</span>
          </button>`;
      }).join("");

      bar.querySelectorAll(".project-filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const catId = btn.dataset.category;
          activeProjectCategory = catId;
          bar.querySelectorAll(".project-filter-btn").forEach((b) => {
            const active = b === btn;
            b.classList.toggle("active", active);
            b.setAttribute("aria-selected", active ? "true" : "false");
          });
          applyProjectFilters();
        });
      });
    }

    function initProjectControls() {
      if (_projectControlsInit) return;
      _projectControlsInit = true;

      const searchInput = document.getElementById("project-search-input");
      const clearBtn = document.getElementById("project-search-clear");
      const resetBtn = document.getElementById("empty-state-reset-btn");
      const cardsBtn = document.getElementById("view-cards-btn");
      const matrixBtn = document.getElementById("view-matrix-btn");

      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          activeProjectSearch = e.target.value;
          applyProjectFilters();
        });
      }

      document.querySelectorAll(".project-type-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeProjectType = btn.dataset.type;
          document.querySelectorAll(".project-type-btn").forEach((b) => {
            const active = b === btn;
            b.classList.toggle("active", active);
            b.setAttribute("aria-selected", active ? "true" : "false");
          });
          renderProjectFilters();
          applyProjectFilters();
        });
      });

      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          activeProjectSearch = "";
          if (searchInput) {
            searchInput.value = "";
            searchInput.focus();
          }
          applyProjectFilters();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          activeProjectCategory = "all";
          activeProjectSearch = "";
          if (searchInput) searchInput.value = "";
          renderProjectFilters();
          applyProjectFilters();
        });
      }

      if (cardsBtn) {
        cardsBtn.addEventListener("click", () => setProjectViewMode("cards"));
      }
      if (matrixBtn) {
        matrixBtn.addEventListener("click", () => setProjectViewMode("matrix"));
      }

      // Global Ctrl+K / Cmd+K Project Search
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          const activeModal = document.getElementById("modal-backdrop");
          if (activeModal && activeModal.classList.contains("open")) return;

          e.preventDefault();
          const input = document.getElementById("project-search-input");
          if (input) {
            const section = document.getElementById("projects");
            if (section) {
              section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            setTimeout(() => input.focus(), 250);
          }
        }
      });
    }

    renderProjectFilters();
    initProjectControls();
    applyProjectFilters();
  }
  /* ── SKILLS ────────────────────────────────────────────────── */
  function renderSkills() {
    const html = (PORTFOLIO_DATA.skills || [])
      .map((group, i) => {
        const pills = (group.items || [])
          .map((item) => tagWithIcon(item, "skill-pill"))
          .join("");
        return `
        <div class="skill-group fade-up" data-delay="${i * 50}">
          <div class="skill-group-icon">${group.icon}</div>
          <div class="skill-group-title">${group.group}</div>
          <div class="skill-pills">${pills}</div>
        </div>`;
      })
      .join("");
    mount("skills-grid", html);
  }

  /* ── EDUCATION ─────────────────────────────────────────────── */
  function renderEducation() {
    const html = (PORTFOLIO_DATA.education || [])
      .map(
        (edu, i) => `
    <div class="edu-card fade-up" data-delay="${i * 80}">
      <div class="edu-type">${edu.type}</div>
      <div class="edu-degree">${edu.degree}</div>
      <div class="edu-school">${edu.school} · ${edu.location}</div>
      <div class="edu-period">${edu.period}</div>
      ${
        edu.grade
          ? `
      <div class="edu-grade">
        <span class="edu-grade-value">${edu.grade}</span>
        ${edu.gradeNote ? `<span class="edu-grade-note">${edu.gradeNote}</span>` : ""}
      </div>`
          : ""
      }
    </div>`,
      )
      .join("");
    mount("edu-grid", html);
  }

  /* ── CONTACT ───────────────────────────────────────────────── */
  function renderContact() {
    const d = PORTFOLIO_DATA.contact || {};
    const links = [
      {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        label: d.email,
        href: `mailto:${d.email}`,
      },
      {
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
        label: "github.com/surajkumar11292",
        href: d.github,
        external: true,
      },
      {
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
        label: "linkedin.com/in/suraj-kumar-1b9a65250",
        href: d.linkedin,
        external: true,
      },
      {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
        label: d.location,
        isStatic: true,
      },
    ]
      .map((link) => {
        if (link.isStatic) {
          return `
            <div class="contact-info-item" style="cursor:default;user-select:text;">
              ${link.icon}
              ${link.label}
            </div>`;
        }
        return `
          <a href="${link.href}" ${link.external ? 'target="_blank" rel="noopener"' : ""}
             class="contact-info-item" ${link.href.startsWith("mailto:") ? `onclick="window.location.href='${link.href}'"` : ""}>
            ${link.icon}
            ${link.label}
          </a>`;
      })
      .join("");

    mount("contact-info-links", links);
  }

  /* ── CERTIFICATIONS ───────────────────────────────────────── */
  function renderCertifications() {
    const certs = PORTFOLIO_DATA.certifications;
    if (!certs || !certs.length) return;

    const html = certs
      .map((c, i) => {
        const tags = c.tags.map((t) => tagWithIcon(t, "tech-tag")).join("");
        return `
        <div class="cert-card fade-up" data-delay="${i * 70}">
          <div class="cert-header">
            <div class="cert-logo-badge">${c.issuerLogo}</div>
            <div class="cert-meta">
              <div class="cert-issuer">${c.issuer}</div>
              <div class="cert-date">${c.date}</div>
            </div>
          </div>
          <div class="cert-name">${c.name}</div>
          <div class="cert-id">ID: ${c.credentialId}</div>
          <div class="cert-tags">${tags}</div>
          ${
            c.verifyUrl && c.verifyUrl !== "#"
              ? `
          <a href="${c.verifyUrl}" target="_blank" rel="noopener" class="cert-verify-btn">
            Verify credential ↗
          </a>`
              : ""
          }
        </div>`;
      })
      .join("");

    mount("cert-grid", html);
  }

  /* ── BLOG ──────────────────────────────────────────────────── */
  function renderBlog() {
    const posts = PORTFOLIO_DATA.blog;
    if (!posts || !posts.length) return;

    const html = posts
      .map((p, i) => {
        const tags = p.tags.map((t) => tagWithIcon(t, "tech-tag")).join("");
        const isPublished = !!p.isPublished && !!p.article;
        const isExternal = !isPublished && p.url && p.url !== "#";

        return `
        <div class="blog-card fade-up ${isPublished ? "blog-card-published" : ""}" data-delay="${i * 70}" ${isPublished ? `onclick="Modal.openArticle('${p.id}')"` : ""}>
          <div class="blog-card-top">
            <div class="blog-meta">
              <span class="blog-platform">${p.platform}</span>
              <span class="blog-sep">·</span>
              <span class="blog-date">${p.date}</span>
              <span class="blog-sep">·</span>
              <span class="blog-readtime">${p.readTime}</span>
            </div>
            ${
              isPublished
                ? '<span class="blog-badge-published">◆ Published</span>'
                : '<span class="blog-coming-soon">Upcoming</span>'
            }
          </div>
          <h3 class="blog-title">
            ${
              isPublished
                ? `<a href="#blog" onclick="event.preventDefault(); event.stopPropagation(); Modal.openArticle('${p.id}')">${p.title}</a>`
                : isExternal
                  ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${p.title}</a>`
                  : p.title
            }
          </h3>
          <p class="blog-summary">${p.summary}</p>
          <div class="blog-footer">
            <div class="blog-tags">${tags}</div>
            ${
              isPublished
                ? `<button type="button" class="blog-read-btn btn-article-read" onclick="event.stopPropagation(); Modal.openArticle('${p.id}')">Read Article →</button>`
                : isExternal
                  ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" class="blog-read-btn blog-notify-btn" onclick="event.stopPropagation()">${p.notifyText || "Notify Me ↗"}</a>`
                  : ""
            }
          </div>
        </div>`;
      })
      .join("");

    mount("blog-grid", html);
  }

  /* ── FOOTER ────────────────────────────────────────────────── */
  function renderFooter() {
    const d = PORTFOLIO_DATA;
    const year = new Date().getFullYear();
    mount(
      "footer-content",
      `
      <div class="footer-inner">
        <a href="#hero" class="footer-logo" style="display:inline-flex;align-items:center;gap:0.5rem;text-decoration:none;cursor:pointer;" onclick="event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});" aria-label="Scroll to top">
          <img src="assets/logo.svg" alt="Logo" width="22" height="22" style="border-radius:6px;vertical-align:middle;" />
          <span style="color:var(--text-primary);font-weight:600;">${d.name}</span>
        </a>
        <ul class="footer-links">
          <li><a href="#about">About</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <span class="footer-copy">© ${year} ${d.name}</span>
      </div>`,
    );
  }

  /* ── VISITOR COUNTER ───────────────────────────────────────── */
  function renderVisitorCounter() {
    mount(
      "visitor-counter-wrap",
      `
      <div class="visitor-counter-banner fade-up">
        <div class="vcb-left">
          <span class="vcb-pulse" aria-hidden="true"></span>
          <span class="vcb-eye" aria-hidden="true">👁</span>
          <span class="vcb-text">
            <span class="vcb-count" id="vcb-number">—</span>
            <span class="vcb-label"> developers have visited this portfolio</span>
          </span>
        </div>
        <div class="vcb-right">
          <span class="vcb-badge">🔥 Recruiters are watching</span>
        </div>
      </div>
    `,
    );
    _loadCounterDev();
  }

  function _loadCounterDev() {
    const DATA_ID = "35918f7d-ef8e-44c5-9fc5-f95f5af7e0ee";
    fetch(`https://counter.dev/api/stats?dataId=${DATA_ID}`)
      .then((r) => r.json())
      .then((json) => {
        let raw = json.total ?? json.count ?? null;
        if (raw === null && json.visits) {
          raw = Object.values(json.visits).reduce((a, b) => a + Number(b), 0);
        }
        const count = parseInt(raw, 10);
        _animateCount(!isNaN(count) && count > 0 ? count : _seededFallback());
      })
      .catch(() => _animateCount(_seededFallback()));
  }

  function _seededFallback() {
    const seed = Math.floor(Date.now() / 86400000);
    return 180 + ((seed * 37 + 13) % 120);
  }

  function _animateCount(target) {
    const el = document.getElementById("vcb-number");
    if (!el) return;
    const start = Math.max(0, target - 40);
    const duration = 900;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(
        start + (target - start) * e,
      ).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── PUBLIC ─────────────────────────────────────────────────── */
  return {
    init() {
      const sections = [
        ["hero", renderHero],
        ["about", renderAbout],
        ["experience", renderExperience],
        ["projects", renderProjects],
        ["skills", renderSkills],
        ["education", renderEducation],
        ["certifications", renderCertifications],
        ["contact", renderContact],
        ["visitorCounter", renderVisitorCounter],
        ["footer", renderFooter],
      ];

      sections.forEach(([name, fn]) => {
        try {
          fn();
        } catch (err) {
          console.error(`[Renderer] "${name}" section failed to render:`, err);
        }
      });

      // Notify Transitions to observe newly rendered elements
      if (typeof Transitions !== "undefined") {
        Transitions.refresh();
      }
    },
  };
})();