/* ═══════════════════════════════════════════════════════════════
   GITHUB.JS — GitHub API: activity feed, profile stats,
               contribution heatmap (SVG rendered from REST API)
   ═══════════════════════════════════════════════════════════════ */

const GitHub = (() => {
  const USERNAME = "surajkumar11292";
  const API_BASE = "https://api.github.com";

  /* ══════════════════════════════════════════════════════════════
     SECTION 1 — ACTIVITY FEED
  ══════════════════════════════════════════════════════════════ */

  function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
    return Math.floor(diff / 604800) + "w ago";
  }

  function eventIcon(type) {
    return (
      {
        PushEvent: "↑",
        CreateEvent: "✦",
        PullRequestEvent: "⟲",
        IssuesEvent: "◎",
        WatchEvent: "★",
        ForkEvent: "⑂",
        DeleteEvent: "✕",
        ReleaseEvent: "◆",
      }[type] || "·"
    );
  }

  function eventLabel(event) {
    const repo = event.repo.name.split("/")[1];
    switch (event.type) {
      case "PushEvent": {
        const msg =
          event.payload.commits?.[0]?.message?.split("\n")[0] ||
          "pushed changes";
        return { repo, msg: msg.length > 52 ? msg.slice(0, 52) + "…" : msg };
      }
      case "CreateEvent":
        return {
          repo,
          msg: (
            "created " +
            event.payload.ref_type +
            " " +
            (event.payload.ref || "")
          ).trim(),
        };
      case "PullRequestEvent":
        return { repo, msg: event.payload.action + " pull request" };
      case "IssuesEvent":
        return { repo, msg: event.payload.action + " issue" };
      case "WatchEvent":
        return { repo, msg: "starred repository" };
      case "ForkEvent":
        return { repo, msg: "forked repository" };
      case "ReleaseEvent":
        return {
          repo,
          msg: "released " + (event.payload.release?.tag_name || "new version"),
        };
      default:
        return { repo, msg: event.type.replace("Event", "").toLowerCase() };
    }
  }

  function renderSkeleton(container) {
    container.innerHTML = Array(4)
      .fill(0)
      .map(
        () =>
          '<div class="activity-item"><span class="activity-skeleton" style="width:60%"></span><span class="activity-skeleton" style="width:20%;margin-left:auto"></span></div>',
      )
      .join("");
  }

  function renderActivity(events, container) {
    if (!events || !events.length) {
      container.innerHTML =
        '<div class="activity-item"><span style="color:var(--text-muted);font-size:0.82rem;">Visit <a href="https://github.com/' +
        USERNAME +
        '" target="_blank">github.com/' +
        USERNAME +
        "</a></span></div>";
      return;
    }
    const filtered = events
      .filter((e) =>
        [
          "PushEvent",
          "CreateEvent",
          "PullRequestEvent",
          "ReleaseEvent",
        ].includes(e.type),
      )
      .slice(0, 5);
    container.innerHTML = (filtered.length ? filtered : events.slice(0, 4))
      .map((ev) => {
        const { repo, msg } = eventLabel(ev);
        return (
          '<div class="activity-item"><span class="activity-icon">' +
          eventIcon(ev.type) +
          '</span><span class="activity-repo">' +
          repo +
          '</span><span class="activity-msg">' +
          msg +
          '</span><span class="activity-time">' +
          timeAgo(ev.created_at) +
          "</span></div>"
        );
      })
      .join("");
  }

  async function fetchActivity() {
    const container = document.getElementById("github-activity-list");
    if (!container) return;
    renderSkeleton(container);
    try {
      const res = await fetch(
        API_BASE + "/users/" + USERNAME + "/events/public?per_page=20",
        { headers: { Accept: "application/vnd.github.v3+json" } },
      );
      if (!res.ok) throw new Error("API " + res.status);
      renderActivity(await res.json(), container);
    } catch (err) {
      console.warn("GitHub activity fetch failed:", err.message);
      container.innerHTML =
        '<div class="activity-item"><span class="activity-icon">↑</span><span class="activity-repo">Disease-Prediction-ML</span><span class="activity-msg">built SHAP explainability module</span><span class="activity-time">recently</span></div><div class="activity-item"><span class="activity-icon">✦</span><span class="activity-repo">TripBoss</span><span class="activity-msg">integrated Wikipedia API</span><span class="activity-time">recently</span></div><div class="activity-item"><span class="activity-icon">↑</span><span class="activity-repo">DevSecOps-Pipeline</span><span class="activity-msg">added Terraform EKS config</span><span class="activity-time">recently</span></div>';
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 2 — PROFILE STATS
  ══════════════════════════════════════════════════════════════ */

  function renderProfileStats(user, totalStars) {
    const el = document.getElementById("github-profile-stats");
    if (!el || !user) return;
    const tile = (v, l, i) =>
      '<div style="display:flex;flex-direction:column;gap:2px"><div style="display:flex;align-items:baseline;gap:5px"><span class="stat-num" style="font-size:1.3rem;line-height:1">' +
      v +
      '</span><span style="font-size:0.75rem;color:var(--accent);opacity:0.7">' +
      i +
      '</span></div><div class="stat-label">' +
      l +
      "</div></div>";
    el.innerHTML =
      '<div style="display:flex;gap:1.75rem;flex-wrap:wrap;padding-top:1rem;border-top:1px solid var(--border-faint)">' +
      tile(user.public_repos, "Repos", "⬡") +
      tile(totalStars !== null ? totalStars : "—", "Stars", "★") +
      tile(user.followers, "Followers", "◎") +
      "</div>";
  }

  async function fetchTotalStars(username) {
    let page = 1,
      total = 0;
    while (true) {
      const res = await fetch(
        API_BASE + "/users/" + username + "/repos?per_page=100&page=" + page,
        { headers: { Accept: "application/vnd.github.v3+json" } },
      );
      if (!res.ok) break;
      const repos = await res.json();
      if (!repos.length) break;
      total += repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      if (repos.length < 100) break;
      page++;
    }
    return total;
  }

  async function fetchProfile() {
    try {
      const [profileRes, totalStars] = await Promise.all([
        fetch(API_BASE + "/users/" + USERNAME, {
          headers: { Accept: "application/vnd.github.v3+json" },
        }),
        fetchTotalStars(USERNAME).catch(() => null),
      ]);
      if (!profileRes.ok) return;
      renderProfileStats(await profileRes.json(), totalStars);
    } catch {
      /* silent fail */
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 2b — REPO STAR COUNTS (for project cards)
  ══════════════════════════════════════════════════════════════ */

  async function fetchRepoStars() {
    const repos = (PORTFOLIO_DATA.projects || [])
      .filter((p) => p.repo)
      .map((p) => p.repo);

    if (!repos.length) return;

    const results = await Promise.allSettled(
      repos.map((repo) =>
        fetch(API_BASE + "/repos/" + USERNAME + "/" + repo, {
          headers: { Accept: "application/vnd.github.v3+json" },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((data) =>
            data ? { repo, stars: data.stargazers_count ?? 0 } : null,
          ),
      ),
    );

    results.forEach((result) => {
      if (result.status !== "fulfilled" || !result.value) return;
      const { repo, stars } = result.value;
      const badge = document.querySelector(`[data-repo="${repo}"] .star-count`);
      if (badge) badge.textContent = `★ ${stars}`;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 3 — CONTRIBUTION HEATMAP
  ══════════════════════════════════════════════════════════════ */

  const HEATMAP = (() => {
    // Contribution level hex colours (match GitHub style, override via CSS vars)
    const LEVEL_COLOURS = [
      "#161b22",
      "#0e4429",
      "#006d32",
      "#26a641",
      "#39d353",
    ];

    /* Build the weekly grid array from a date→{level,count} map */
    function buildWeekGrid(map, fromStr, toStr) {
      const start = new Date(fromStr);
      const end = new Date(toStr);
      // Rewind to Sunday
      start.setDate(start.getDate() - start.getDay());
      const weeks = [];
      const cur = new Date(start);
      const now = new Date();
      while (cur <= end) {
        const week = [];
        for (let d = 0; d < 7; d++) {
          const key = cur.toISOString().split("T")[0];
          week.push({
            date: key,
            level: cur > now ? -1 : (map[key]?.level ?? 0),
            count: map[key]?.count ?? 0,
            future: cur > now,
          });
          cur.setDate(cur.getDate() + 1);
        }
        weeks.push(week);
      }
      return weeks;
    }

    /* Month label positions */
    function getMonthLabels(weeks) {
      const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const labels = [];
      let lastM = -1;
      weeks.forEach((week, wi) => {
        const first = week.find((d) => !d.future);
        if (!first) return;
        const m = new Date(first.date + "T12:00:00").getMonth();
        if (m !== lastM) {
          labels.push({ wi, label: MONTHS[m] });
          lastM = m;
        }
      });
      return labels;
    }

    /* Render the SVG heatmap into container */
    function renderSVG(weeks, container) {
      const CELL = 11,
        GAP = 2,
        STEP = CELL + GAP;
      const LEFT = 28,
        TOP = 20;
      const W = weeks.length * STEP + LEFT;
      const H = 7 * STEP + TOP;
      const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
      const monthLabels = getMonthLabels(weeks);

      let inner = "";

      // Month labels
      monthLabels.forEach(({ wi, label }) => {
        inner +=
          '<text x="' +
          (LEFT + wi * STEP) +
          '" y="' +
          (TOP - 6) +
          '" font-size="10" fill="var(--text-faint,#484f58)" font-family="DM Mono,monospace">' +
          label +
          "</text>";
      });

      // Day of week labels
      DAY_LABELS.forEach((lbl, di) => {
        if (!lbl) return;
        inner +=
          '<text x="' +
          (LEFT - 4) +
          '" y="' +
          (TOP + di * STEP + CELL - 1) +
          '" font-size="9" fill="var(--text-faint,#484f58)" font-family="DM Mono,monospace" text-anchor="end">' +
          lbl +
          "</text>";
      });

      // Cells
      weeks.forEach((week, wi) => {
        week.forEach((day, di) => {
          const x = LEFT + wi * STEP;
          const y = TOP + di * STEP;
          if (day.future) {
            inner +=
              '<rect x="' +
              x +
              '" y="' +
              y +
              '" width="' +
              CELL +
              '" height="' +
              CELL +
              '" rx="2" fill="transparent"/>';
            return;
          }
          const lvl = Math.min(Math.max(day.level, 0), 4);
          const fill = LEVEL_COLOURS[lvl];
          const tip =
            day.count === 0
              ? "No contributions on " + day.date
              : day.count +
                " contribution" +
                (day.count > 1 ? "s" : "") +
                " on " +
                day.date;
          inner +=
            '<rect x="' +
            x +
            '" y="' +
            y +
            '" width="' +
            CELL +
            '" height="' +
            CELL +
            '" rx="2" fill="' +
            fill +
            '" class="hm-cell hm-cell--' +
            lvl +
            '" data-date="' +
            day.date +
            '" data-count="' +
            day.count +
            '" data-level="' +
            lvl +
            '"><title>' +
            tip +
            "</title></rect>";
        });
      });

      container.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
        W +
        " " +
        H +
        '" class="heatmap-svg" role="img" aria-label="GitHub contribution graph for ' +
        USERNAME +
        '">' +
        inner +
        "</svg>";
      attachTooltip(container);
    }

    /* Floating tooltip */
    function attachTooltip(container) {
      let tip = document.getElementById("hm-tooltip");
      if (!tip) {
        tip = document.createElement("div");
        tip.id = "hm-tooltip";
        tip.className = "hm-tooltip";
        document.body.appendChild(tip);
      }
      container.addEventListener("mousemove", (e) => {
        const cell = e.target.closest && e.target.closest(".hm-cell");
        if (!cell) {
          tip.classList.remove("visible");
          return;
        }
        const count = parseInt(cell.dataset.count || "0");
        const date = cell.dataset.date;
        const fmt = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        tip.innerHTML =
          "<strong>" +
          (count === 0
            ? "No contributions"
            : count + " contribution" + (count > 1 ? "s" : "")) +
          "</strong><span>" +
          fmt +
          "</span>";
        tip.classList.add("visible");
        const vw = window.innerWidth;
        let tx = e.clientX + 12,
          ty = e.clientY - 44;
        if (tx + 160 > vw) tx = e.clientX - 160;
        if (ty < 0) ty = e.clientY + 16;
        tip.style.left = tx + "px";
        tip.style.top = ty + "px";
      });
      container.addEventListener("mouseleave", () =>
        tip.classList.remove("visible"),
      );
    }

    /* Summary stats row */
    function renderSummary(stats) {
      const el = document.getElementById("heatmap-summary");
      if (!el) return;
      const s = (n, l) =>
        '<span class="hm-stat"><span class="hm-stat-num">' +
        n +
        '</span><span class="hm-stat-label">' +
        l +
        "</span></span>";
      const sep = '<span class="hm-sep">·</span>';
      el.innerHTML =
        s(stats.totalContribs.toLocaleString(), "contributions") +
        sep +
        s(stats.currentStreak, "day streak") +
        sep +
        s(stats.activeDays, "active days");
    }

    /* Core fetch → build map → render */
    async function fetchAndRender() {
      const container = document.getElementById("github-heatmap");
      if (!container) return;
      container.innerHTML = '<div class="heatmap-skeleton"></div>';

      try {
        // Fetch up to 500 events across 5 pages
        const pages = await Promise.all(
          Array.from({ length: 5 }, (_, i) =>
            fetch(
              API_BASE +
                "/users/" +
                USERNAME +
                "/events/public?per_page=100&page=" +
                (i + 1),
              { headers: { Accept: "application/vnd.github.v3+json" } },
            )
              .then((r) => (r.ok ? r.json() : []))
              .catch(() => []),
          ),
        );
        const events = pages.flat();

        // Build date→count map
        const rawCounts = {};
        events.forEach((ev) => {
          const date = ev.created_at?.split("T")[0];
          if (!date) return;
          rawCounts[date] = (rawCounts[date] || 0) + 1;
          // Extra commits from push events
          if (ev.type === "PushEvent" && ev.payload?.commits) {
            rawCounts[date] += Math.max(0, ev.payload.commits.length - 1);
          }
        });

        // Normalise counts to levels 0–4
        const counts = Object.values(rawCounts).filter((v) => v > 0);
        const max = Math.max(...counts, 1);
        const thresholds = [0, max * 0.1, max * 0.3, max * 0.6, max * 0.9];

        const map = {};
        Object.entries(rawCounts).forEach(([date, count]) => {
          let lvl = 0;
          if (count >= thresholds[4]) lvl = 4;
          else if (count >= thresholds[3]) lvl = 3;
          else if (count >= thresholds[2]) lvl = 2;
          else if (count >= thresholds[1]) lvl = 1;
          map[date] = { level: lvl, count };
        });

        // Stats
        const today = new Date();
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        const allEntries = Object.values(map);
        const totalContribs = allEntries.reduce((s, d) => s + d.count, 0);
        const activeDays = allEntries.filter((d) => d.count > 0).length;
        let currentStreak = 0;
        for (let i = 0; i < 90; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const k = d.toISOString().split("T")[0];
          if (map[k]?.count > 0) currentStreak++;
          else if (i > 0) break;
        }

        renderSummary({ totalContribs, activeDays, currentStreak });

        const weeks = buildWeekGrid(
          map,
          yearAgo.toISOString().split("T")[0],
          today.toISOString().split("T")[0],
        );
        renderSVG(weeks, container);
      } catch (err) {
        console.warn("Heatmap render failed:", err);
        container.innerHTML =
          '<div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.82rem"><a href="https://github.com/' +
          USERNAME +
          '" target="_blank" rel="noopener" style="color:var(--accent)">View full contribution graph on GitHub ↗</a></div>';
      }
    }

    /* Year toggle buttons */
    function initYearToggle() {
      document.querySelectorAll(".heatmap-yr-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document
            .querySelectorAll(".heatmap-yr-btn")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          fetchAndRender();
        });
      });
    }

    return {
      init() {
        fetchAndRender();
        initYearToggle();
      },
    };
  })();

  /* ══════════════════════════════════════════════════════════════
     PUBLIC
  ══════════════════════════════════════════════════════════════ */
  return {
    init() {
      fetchActivity();
      fetchProfile();
      HEATMAP.init();
      fetchRepoStars();
    },
  };
})();
