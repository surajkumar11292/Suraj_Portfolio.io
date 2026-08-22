/* ═══════════════════════════════════════════════════════════════
   MODAL.JS — Project case-study modal, keyboard trap, a11y
   ═══════════════════════════════════════════════════════════════ */

const Modal = (() => {
  let backdrop, box, body;
  let currentProject = null;
  let lastFocused = null;

  /* ── BUILD DOM ─────────────────────────────────────────────── */
  function buildDOM() {
    backdrop = document.createElement("div");
    backdrop.id = "modal-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "modal-title");

    backdrop.innerHTML = `
      <div class="modal-box" id="modal-box">
        <div class="modal-close">
          <button class="modal-close-btn" id="modal-close-btn" aria-label="Close">✕</button>
        </div>
        <div class="modal-body" id="modal-body-content"></div>
      </div>`;

    document.body.appendChild(backdrop);

    box = backdrop.querySelector(".modal-box");
    body = backdrop.querySelector("#modal-body-content");

    // Close on backdrop click
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });

    // Close button
    backdrop.querySelector("#modal-close-btn").addEventListener("click", close);

    // Keyboard
    document.addEventListener("keydown", handleKeydown);
  }

  /* ── KEYBOARD HANDLING ─────────────────────────────────────── */
  function handleKeydown(e) {
    if (!backdrop?.classList.contains("open")) return;
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "Tab") trapFocus(e);
  }

  function trapFocus(e) {
    const focusable = box.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ── RENDER PROJECT CONTENT ────────────────────────────────── */
  function render(project) {
    const cs = project.casestudy;
    const techPills = project.tags
      .map((t) => `<span class="tech-tag">${t}</span>`)
      .join("");
    const challenges = cs.challenges.map((c) => `<li>${c}</li>`).join("");

    body.innerHTML = `
      <span class="modal-tag">${project.category} · ${project.period}</span>
      <h2 class="modal-title" id="modal-title">${project.title}</h2>
      <p class="modal-period">${project.period}</p>

      <div class="modal-section">
        <div class="modal-section-heading">The Problem</div>
        <p>${cs.problem}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-heading">My Approach</div>
        <p>${cs.approach}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-heading">Challenges &amp; Solutions</div>
        <ul class="modal-bullets">${challenges}</ul>
      </div>

      <div class="modal-section">
        <div class="modal-section-heading">Outcome</div>
        <p>${cs.outcome}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-heading">Lessons Learned</div>
        <p>${cs.lessons}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-heading">Technologies</div>
        <div class="modal-tech">${techPills}</div>
      </div>

      <div class="modal-footer">
        ${
          project.demo
            ? `
          <a href="${project.demo}" target="_blank" rel="noopener noreferrer"
             class="btn btn--primary btn--sm">
            ↗ Live Demo
          </a>`
            : ""
        }
        ${
          project.github
            ? `
          <a href="${project.github}" target="_blank" rel="noopener noreferrer"
             class="btn ${project.demo ? "btn--outline" : "btn--primary"} btn--sm">
            View on GitHub ↗
          </a>`
            : ""
        }
        <button class="btn btn--outline btn--sm" onclick="Modal.close()">Close</button>
      </div>`;
  }

  /* ── RENDER ARTICLE CONTENT ────────────────────────────────── */
  function renderArticle(article) {
    const techPills = (article.tags || [])
      .map((t) => `<span class="tech-tag">${t}</span>`)
      .join("");

    const takeawaysHtml = article.article?.takeaways
      ? `
      <div class="article-takeaways-box">
        <div class="article-takeaways-title">◆ Key Architecture Takeaways</div>
        <ul class="article-takeaways-list">
          ${article.article.takeaways.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>`
      : "";

    const sectionsHtml = (article.article?.sections || [])
      .map(
        (sec) => `
      <div class="modal-section">
        <div class="modal-section-heading">${sec.heading}</div>
        <p>${sec.content}</p>
        ${
          sec.code
            ? `<pre class="article-code-snippet"><code>${sec.code}</code></pre>`
            : ""
        }
        ${
          sec.bullets
            ? `<ul class="modal-bullets">${sec.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
            : ""
        }
      </div>`
      )
      .join("");

    body.innerHTML = `
      <div class="article-meta-header">
        <span class="modal-tag">${article.platform}</span>
        <span class="blog-date">${article.date}</span>
        <span class="blog-sep">·</span>
        <span class="blog-readtime">${article.readTime}</span>
      </div>
      <h2 class="modal-title" id="modal-title">${article.title}</h2>
      ${article.subtitle ? `<p class="article-subtitle">${article.subtitle}</p>` : ""}

      <div class="article-author-bar">
        <img src="assets/photo.jpg" alt="Suraj Kumar" class="article-author-avatar" onerror="this.src='assets/photo.jpg'" />
          <div>
          <div class="article-author-name">Suraj Kumar</div>
          <div class="article-author-meta">AppSec · DevSecOps · Full-Stack</div>
        </div>
      </div>

      ${takeawaysHtml}

      ${sectionsHtml}

      <div class="modal-section" style="margin-top: 2rem;">
        <div class="modal-section-heading">Tags &amp; Topics</div>
        <div class="modal-tech">${techPills}</div>
      </div>

      <div class="modal-footer">
        <a href="#scanner" class="btn btn--primary btn--sm" onclick="Modal.close()">
          Try In-Browser Scanner Live ↗
        </a>
        <button class="btn btn--outline btn--sm" onclick="Modal.close()">Close</button>
      </div>`;
  }

  /* ── OPEN / CLOSE ──────────────────────────────────────────── */
  function openArticle(articleId) {
    const article = PORTFOLIO_DATA.blog?.find(
      (b) => b.id === articleId && b.article
    );
    if (!article) return;

    currentProject = null;
    lastFocused = document.activeElement;

    renderArticle(article);

    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";

    // Focus close button
    requestAnimationFrame(() => {
      backdrop.querySelector("#modal-close-btn")?.focus();
    });

    // Scroll box to top
    box.scrollTop = 0;
  }

  function open(id) {
    const project = PORTFOLIO_DATA.projects?.find((p) => p.id === id);
    if (project && project.casestudy) {
      currentProject = project;
      lastFocused = document.activeElement;

      render(project);

      backdrop.classList.add("open");
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        backdrop.querySelector("#modal-close-btn")?.focus();
      });

      box.scrollTop = 0;
      return;
    }

    const article = PORTFOLIO_DATA.blog?.find(
      (b) => b.id === id && b.article
    );
    if (article) {
      openArticle(id);
      return;
    }
  }

  function close() {
    if (!backdrop?.classList.contains("open")) return;
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    currentProject = null;
    lastFocused?.focus();
  }

  /* ── PUBLIC ─────────────────────────────────────────────────── */
  return {
    open,
    openArticle,
    close,
    init() {
      buildDOM();
    },
  };
})();
