# Portfolio Documentation — Complete File Reference

### Arman Ahemad Khan · arman080325.github.io

---

## Table of Contents

1. [File Map &amp; Load Order](#1-file-map--load-order)
2. [data.js — The Only File You Normally Need to Edit](#2-datajs--the-only-file-you-normally-need-to-edit)
3. [index.html — Page Shell &amp; Mount Points](#3-indexhtml--page-shell--mount-points)
4. [css/variables.css — Colors, Fonts, Spacing Tokens](#4-cssvariablescss--colors-fonts-spacing-tokens)
5. [css/layout.css — Containers, Grids, Buttons, Badges](#5-csslayoutcss--containers-grids-buttons-badges)
6. [css/components.css — Every Section&#39;s Visual Style](#6-csscomponentscss--every-sections-visual-style)
7. [css/animations.css — Motion, Cursor, Typing, Marquee](#7-cssanimationscss--motion-cursor-typing-marquee)
8. [js/render.js — DOM Builder (reads data.js)](#8-jsrenderjs--dom-builder-reads-datajs)
9. [js/ui.js — Theme, Nav, Cursor, Toast, Scroll](#9-jsuijs--theme-nav-cursor-toast-scroll)
10. [js/modal.js — Project Case Study Modal](#10-jsmodaljs--project-case-study-modal)
11. [js/github.js — Live GitHub Activity Feed](#11-jsgithubjs--live-github-activity-feed)
12. [js/contact.js — Contact Form + EmailJS](#12-jscontactjs--contact-form--emailjs)
13. [js/main.js — Boot Sequence + Typing Animation](#13-jsmainjs--boot-sequence--typing-animation)
14. [Common Customization Recipes](#14-common-customization-recipes)

---

## 1. File Map & Load Order

```
portfolio/
│
├── index.html               ← Page skeleton + all <section> mount points
│
├── css/
│   ├── variables.css        ← LOAD 1st: all CSS custom properties (--tokens)
│   ├── layout.css           ← LOAD 2nd: containers, grids, typography classes
│   ├── components.css       ← LOAD 3rd: every section's visual rules
│   └── animations.css       ← LOAD 4th: motion, cursor, marquee, typing
│
└── js/
    ├── data.js              ← LOAD 1st: all your content as one JS object
    ├── ui.js                ← LOAD 2nd: UI utilities module
    ├── modal.js             ← LOAD 3rd: modal system
    ├── github.js            ← LOAD 4th: GitHub API
    ├── contact.js           ← LOAD 5th: form handling
    ├── render.js            ← LOAD 6th: reads data.js, builds all HTML
    └── main.js              ← LOAD LAST: boots all modules
```

**Rule:** Never reorder the `<script>` tags in `index.html`. `data.js` must be first because
every other JS file reads from `PORTFOLIO_DATA`. `main.js` must be last.

---

## 2. data.js — The Only File You Normally Need to Edit

**Path:** `js/data.js`
**Lines:** 257
**What it does:** Holds every word of content on your site as a single JavaScript object called `PORTFOLIO_DATA`. When you update this file and reload the browser, every section re-renders automatically — no need to touch HTML or other JS files.

### 2a. Personal Info Block

```js
name:      "Arman Ahemad Khan",   // Full name — appears in footer + browser tab title
shortName: "A.A.K",              // Navbar logo text
title:     "Cloud · DevOps · Full-Stack",  // Currently unused in render, reserve for meta
tagline:   "4th year CSE student, Silicon University",  // Reserve for meta tags
availability: "Open to Summer 2026 Internships — DevOps · Cloud · Full-Stack",
//  ^ This exact string appears in the green banner at top of page.
//    Change "Summer 2026" to "Full-time 2027" once you graduate.
```

### 2b. Bio Array

```js
bio: [
  "Paragraph 1 text...",
  "Paragraph 2 text...",
  "Paragraph 3 text..."
]
```

- Each string becomes one `<p>` tag in the About section.
- You can use inline HTML: `<span class='about-highlight'>highlighted word</span>` makes text green/accent colored.
- You can use `<em>italics</em>` or `<strong>bold</strong>` inside strings.
- Add or remove array items to add/remove paragraphs.

### 2c. Contact Block

```js
contact: {
  email:    "armankhan082020@gmail.com",  // Used in nav CTA, contact strip, form mailto fallback
  phone:    "+91 9114421034",             // Shown in hero contact strip + contact section
  github:   "https://github.com/arman080325",   // GitHub button links + activity feed username
  linkedin: "https://linkedin.com/in/arman-ahemad-khan",
  location: "Bhubaneswar, Odisha, India"  // Shown in contact info section
}
```

⚠️ If you change your email here, also update the hardcoded fallback in `contact.js` line 77
(the `mailto:` inside `sendViaMailto`).

### 2d. Stats Row (Hero)

```js
stats: [
  { num: "2",   label: "Internships" },
  { num: "6+",  label: "Projects Shipped" },
  { num: "99%", label: "ML Model Accuracy" },
  { num: "95+", label: "Lighthouse Score" }
]
```

- `num` is the big display number (any string — can include +, %, etc.)
- `label` is the small text below it.
- Add/remove objects to add/remove stat tiles. 4 is ideal for the layout.

### 2e. Currently Learning Pills

```js
learning: ["Rust", "System Design", "LLM Fine-tuning", "eBPF", "AWS Solutions Architect"]
```

- Each string = one green pill in the "Currently Exploring" card in the About section.
- Update this every few months to show growth.

### 2f. Experience Array

```js
experience: [
  {
    id:       "devops-2025",          // Unique ID — any lowercase-hyphen string, not displayed
    role:     "DevOps Masters Intern", // Job title — displayed large
    company:  "Ingenious Tech Pvt. Ltd.",
    location: "Bhubaneswar, IN",
    period:   "June 2025 — July 2025",  // Date range — displayed in monospace
    duration: "2 months",               // Shown below the date in faint text
    bullets: [
      "Bullet point one...",            // Each string = one list item on the timeline
      "Bullet point two...",
    ],
    tags: ["AWS EKS", "Terraform"]     // Tech pills shown below the bullets
  },
  // Add more jobs here following the same shape
]
```

- Jobs are displayed **in the order listed** — put newest first.
- To add a new job, copy one object, change the values, paste above the existing ones.

### 2g. Projects Array

```js
projects: [
  {
    id:       "disease-ml",            // Unique ID — used by Modal.open('disease-ml')
    category: "Machine Learning",      // Small uppercase label on the card
    title:    "Disease Prediction System",
    desc:     "Short description shown on the card...",  // 1-2 sentences max
    metric:   "99–100% accuracy",      // Italic line at bottom of card — your key achievement
    period:   "Nov–Dec 2025",
    featured: false,                   // Set true to make this card span 2 columns
    tags:     ["Python", "XGBoost"],   // Tech pills on card + in modal
    github:   "https://github.com/arman080325",  // Button link in modal

    casestudy: {
      problem:    "The problem you solved...",
      approach:   "How you built it...",
      challenges: [
        "Challenge 1...",
        "Challenge 2...",
        "Challenge 3..."
      ],
      outcome:  "What you achieved...",
      lessons:  "What you learned..."
    }
  }
]
```

- Projects appear in **the order listed** — put newest/best first.
- The `featured: true` flag makes a card span 2 grid columns. Use on your best project only.
- To add a new project: copy an object block, give it a unique `id`, fill in all fields.
- The `casestudy` object fills the full-screen modal when someone clicks the card.
- All 5 case study fields are required — if you leave one empty, that section just shows blank.

### 2h. Skills Array

```js
skills: [
  {
    group: "Languages",  // Group heading shown at top of skill card
    icon:  "{ }",        // Text/emoji icon shown above the heading
    items: ["Java", "Python", "C"]  // Each becomes a hoverable pill
  }
]
```

- Each object = one skill group card.
- 6 groups is optimal for a 3-column layout.
- Icons: any emoji or text character works — `{ }`, `☁`, `◈`, `⚙`, etc.

### 2i. Education Array

```js
education: [
  {
    type:     "Bachelor's Degree",   // Small label at top of card
    degree:   "B.Tech in Computer Science",
    school:   "Silicon University",
    location: "Bhubaneswar, Odisha",
    period:   "Sept. 2023 — May 2027"
  }
]
```

- Listed in order — put your current/highest degree first.

### 2j. Marquee Items

```js
marqueeItems: ["AWS EKS", "Kubernetes", "Terraform", ...]
```

- The horizontally scrolling ticker strip between the Hero and About sections.
- The array is automatically doubled in `render.js` to create the infinite loop effect.
- 15–20 items is ideal. Too few = visible gaps; too many = too slow.

### 2k. Blog Posts Array (`blog`)

```js
blog: [
  {
    id: "secret-scanner-deep-dive",
    title: "How I Built an In-Browser Secret Scanner...",
    subtitle: "Detecting API keys and private certs in real-time...",
    summary: "A technical deep-dive into client-side secret detection...",
    platform: "Engineering Deep Dive",
    date: "Published",
    readTime: "6 min read",
    tags: ["AppSec", "Entropy Analysis", "Client-Side Security", "Web Workers"],
    isPublished: true,
    article: {
      takeaways: ["..."],
      sections: [{ heading: "...", content: "...", code: "..." }]
    }
  },
  {
    id: "supply-chain-attacks",
    title: "Anatomy of a Supply Chain Attack...",
    summary: "Breaking down how attackers compromise build pipelines...",
    platform: "Hashnode",
    date: "Upcoming",
    url: "https://hashnode.com/@arman080325",
    notifyText: "Notify on Hashnode ↗",
    tags: ["Supply Chain", "CI/CD Security"],
    readTime: "10 min read",
    isPublished: false
  }
]
```

- **Published Articles (`isPublished: true`)**: Opens a full reading modal with structured sections, architecture takeaways, and code snippets via `Modal.openArticle(id)`.
- **Upcoming Articles (`isPublished: false`)**: Displays an `Upcoming` pill and a direct `Notify Me` / `Follow` link to external platforms like Hashnode or Dev.to.

---

## 3. index.html — Page Shell & Mount Points

**Path:** `index.html`
**Lines:** 338
**What it does:** Provides the semantic HTML skeleton. Every section has empty `id` target elements that `render.js` fills with content. You rarely need to edit this file.

### Things you may want to change in index.html

**Meta tags (lines 4–20) — change for SEO:**

```html
<meta name="description" content="YOUR description here...">
<meta property="og:title" content="Your Name — Portfolio">
<meta property="og:url" content="https://yourdomain.com">
<title>Your Name — Portfolio</title>
```

**Favicon (line 26) — replace with a real favicon:**

```html
<!-- Current: inline SVG letter "A" -->
<link rel="icon" href="data:image/svg+xml,...">

<!-- Replace with a real .ico or .png file: -->
<link rel="icon" href="assets/favicon.ico">
<!-- or -->
<link rel="icon" type="image/png" href="assets/favicon.png">
```

**Hero static text (lines 107–127):**
The hero name, description, and CTA buttons are hardcoded in HTML (not rendered from `data.js`).
To change the hero description:

```html
<!-- Line ~121 -->
<p class="hero-desc fade-up" ...>
  YOUR NEW DESCRIPTION HERE.
</p>
```

**Mount point IDs — do not change these:**
These are the `id` attributes that `render.js` targets. Renaming them will break rendering.

```
hero-stats-row       → filled by renderHero()
hero-contact-strip   → filled by renderHero()
about-bio            → filled by renderAbout()
learning-pills       → filled by renderAbout()
marquee-inner        → filled by renderAbout()
timeline-container   → filled by renderExperience()
project-filter-bar   → filled by renderProjectFilters()
projects-grid        → filled by renderProjects() (Visual Cards View)
projects-matrix-wrap → filled by renderProjects() (Recruiter Matrix View)
skills-grid          → filled by renderSkills()
edu-grid             → filled by renderEducation()
contact-info-links   → filled by renderContact()
footer-content       → filled by renderFooter()
```

### Projects Section Controls & Recruiter Fast-Track

The projects section includes dynamic controls designed for recruiter workflows:

- **Dynamic Category Filter**: Categorizes all 12 projects into `All (12)`, `🛡️ Cybersecurity`, `☁️ DevOps & Cloud`, `💻 Full-Stack`, and `🧠 ML / AI` with real-time count badges.
- **Tech & Keyword Search (`Ctrl+K` / `⌘K`)**: Real-time filtering across project titles, descriptions, metrics, categories, and technology tags (e.g. `Docker`, `Python`, `Spring Boot`, `Redis`, `Scapy`, `FastAPI`). Global `Ctrl+K` hotkey smoothly navigates and focuses the input.
- **"Recruiter Fast-Track" Compact Matrix View**: Toggle between `[ ⊞ Visual Cards ]` and `[ ☰ Recruiter Matrix ]` table view. The matrix view provides a high-density, 30-second scanning experience displaying Project Name, Discipline, Core Architecture/Stack, Key Metric, Case Study trigger, Live Demo, and GitHub links. Remembers choice in `localStorage` (`'ak-projects-view'`).

### Decrypt Boot Loader (`#ak-loader`)

The page shell features a theme-aware decrypt boot loader with the following features:

- **`sessionStorage` Frequency Capping**: Checks `sessionStorage.getItem('ak-visited')`. First-time visits run the full decryption animation (3.2s MIN). Repeat visits or tab reloads within the same browser session automatically trigger a snappy 400ms fade to prevent blocking recruiters or returning visitors.
- **`[Esc]` Skip Affordance**: An explicit `<button class="akl-skip"><kbd>Esc</kbd> Skip</button>` allows users to instantly bypass the 3.2s loader at any point either by clicking the button or pressing the `Escape` key.

---

## 4. css/variables.css — Colors, Fonts, Spacing Tokens

**Path:** `css/variables.css`
**Lines:** 177
**What it does:** Defines every design token as a CSS custom property. Both the light and dark theme live here. Change a color once here and it updates everywhere across all CSS files.

### 4a. Changing the Theme Colors

**Light mode accent color** (the teal/green used for buttons, links, highlights):

```css
:root {
  --accent:       #004743;   /* ← Change this to any color */
  --accent-hover: #005E58;   /* ← Slightly lighter version for hover states */
}
```

**Dark mode accent color** (the champagne gold):

```css
[data-theme="dark"] {
  --accent:       #E6C79C;   /* ← Change this */
  --accent-hover: #F0D4B0;
}
```

**Background colors (light mode):**

```css
:root {
  --bg-root:        #F0EDE4;  /* Main page background (marshmallow beige) */
  --bg-surface:     #E8E4D9;  /* Slightly darker panels, marquee strip */
  --bg-card:        #FAFAF7;  /* Card backgrounds */
  --bg-card-raised: #FFFFFF;  /* Hovered card / modal background */
}
```

**Background colors (dark mode):**

```css
[data-theme="dark"] {
  --bg-root:        #0F2F2F;  /* Deep forest green */
  --bg-surface:     #0A2424;
  --bg-card:        #152E2E;
  --bg-card-raised: #1C3A3A;
}
```

### 4b. Changing Fonts

The Google Fonts import is at the top of this file (line 6). The font variables are:

```css
--font-display: 'Fraunces', Georgia, serif;  /* Headlines, name, section titles */
--font-body:    'DM Sans', system-ui, sans-serif; /* Body text, nav, buttons */
--font-mono:    'DM Mono', 'Fira Code', monospace; /* Tech tags, timestamps */
```

To swap fonts:

1. Change the `@import url(...)` at line 6 to import your new font from Google Fonts.
2. Update the `--font-display` or `--font-body` variable to match.

Example — swap display font to Inter:

```css
/* In the @import, add Inter: */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&...');

/* Then change: */
--font-display: 'Inter', system-ui, sans-serif;
```

### 4c. Spacing Scale

```css
--gap-xs:  0.375rem;   /*  6px */
--gap-sm:  0.625rem;   /* 10px */
--gap-md:  1rem;       /* 16px */
--gap-lg:  1.5rem;     /* 24px */
--gap-xl:  2.5rem;     /* 40px */
--gap-2xl: 4rem;       /* 64px */
```

### 4d. Border Radius Scale

```css
--r-sm:   4px;
--r-md:   8px;
--r-lg:   12px;    /* Used on most cards */
--r-xl:   16px;    /* Used on modal */
--r-2xl:  24px;
--r-full: 9999px;  /* Pills, toggles */
```

Change `--r-lg` to `4px` for a sharper, more corporate look.
Change `--r-lg` to `20px` for a rounder, friendlier look.

---

## 5. css/layout.css — Containers, Grids, Buttons, Badges

**Path:** `css/layout.css`
**Lines:** 319
**What it does:** Structural layout classes used everywhere — containers, grids, typography helpers, button variants, and scroll-reveal animation classes.

### 5a. Container Widths

```css
.container        { max-width: 1140px; }   /* Default — most sections */
.container--wide  { max-width: 1320px; }   /* Not currently used, available */
.container--narrow{ max-width: 760px; }    /* Not currently used, available */
```

To make the site wider, increase `1140px`. To make it narrower, decrease it.

### 5b. Button Variants

Three button styles are available anywhere via classes:

```html
<!-- Solid filled button -->
<a href="#" class="btn btn--primary">Click me</a>

<!-- Outlined / ghost button -->
<a href="#" class="btn btn--outline">Click me</a>

<!-- Text-only ghost button -->
<button class="btn btn--ghost">Click me</button>

<!-- Any button can be made smaller -->
<a href="#" class="btn btn--primary btn--sm">Small button</a>
```

### 5c. Tech Tag Pills (used in projects and experience)

```html
<span class="tech-tag">React</span>
```

These have scale + glow hover effects defined in `layout.css`.

### 5d. Section Heading Classes

```html
<p class="section__eyebrow">About</p>       <!-- Small uppercase label with line -->
<h2 class="section__title">Heading</h2>     <!-- Large Fraunces serif title -->
<p class="section__subtitle">Text...</p>    <!-- Lead paragraph below title -->
```

Use `<em>` inside `.section__title` to italicize in accent color:

```html
<h2 class="section__title">Things I've <em>built</em></h2>
```

### 5e. Scroll Reveal Classes

Add these classes to any HTML element. `ui.js` watches them with IntersectionObserver and adds `.visible` when they scroll into view.

```html
<div class="fade-up">Slides up + fades in</div>
<div class="fade-in">Fades in only</div>
<div class="stagger-children">
  <div>Child 1 — animates at 0ms delay</div>
  <div>Child 2 — animates at 70ms delay</div>
  <div>Child 3 — animates at 140ms delay</div>
</div>
```

Control per-element delay with `data-delay`:

```html
<div class="fade-up" data-delay="200">Waits 200ms before animating</div>
```

---

## 6. css/components.css — Every Section's Visual Style

**Path:** `css/components.css`
**Lines:** 1091
**What it does:** All the visual styling for every named component — nav, hero, contact strip, about card, timeline, project cards, skill pills, modal, form, footer, toast. This is the largest file and controls how everything looks.

### Key sections in components.css (by line number)

| Line | Component                                |
| ---- | ---------------------------------------- |
| 1    | Progress bar                             |
| 17   | Availability banner                      |
| 48   | Navigation (`#main-nav`)               |
| 123  | Hero section (`#hero`)                 |
| 233  | Contact strip                            |
| 271  | About section + now-card + github widget |
| 345  | Experience timeline                      |
| 403  | Project cards grid                       |
| 476  | Skill groups + pills                     |
| 515  | Education cards                          |
| 547  | Contact section + form                   |
| 630  | Modal (backdrop + box)                   |
| 718  | Toast notification                       |
| 740  | Footer                                   |
| 765  | Mobile nav (media query)                 |

### Common visual tweaks

**Make cards sharper (remove rounded corners):**

```css
/* In components.css, change project-card border-radius: */
.project-card { border-radius: 4px; }     /* was var(--r-lg) = 12px */
```

**Make the timeline dots bigger:**

```css
.timeline-node { width: 16px; height: 16px; }  /* was 12px × 12px */
```

**Change nav height:**

```css
#main-nav { height: 72px; }   /* was 64px */
```

**Change card hover lift distance:**

```css
.project-card:hover { transform: translateY(-6px); }  /* was -4px; bigger = more lift */
```

**Change the availability banner to a different color:**

```css
#avail-banner { background: #1a1a2e; }   /* any color */
```

**Hide the cursor trail effect (if you find it distracting):**

```css
.cursor-dot, .cursor-ring { display: none !important; }
```

Or you can toggle it in `animations.css` by removing/commenting the `.cursor-dot` and `.cursor-ring` blocks.

**Change the hero background text size:**

```css
.hero-bg-text { font-size: clamp(8rem, 20vw, 18rem); }  /* decrease for subtler effect */
```

---

## 7. css/animations.css — Motion, Cursor, Typing, Marquee

**Path:** `css/animations.css`
**Lines:** 224
**What it does:** All motion-related CSS — cursor trail elements, noise texture overlay, marquee scrolling, skeleton shimmer, stagger delays, and keyframe definitions.

### Turning animations on/off

**Remove the noise texture overlay** (the subtle grain on the page):

```css
/* Find body::before (around line 22) and add: */
body::before { display: none; }
```

**Slow down or speed up the marquee:**

```css
.marquee-inner { animation: marquee 28s linear infinite; }
/* Change 28s to 20s for faster, 45s for slower */
```

**Remove the cursor trail entirely:**

```css
/* Comment out or delete everything under: */
/* ── CURSOR TRAIL (desktop only) ── */
```

**Change stagger delay between children:**

```css
/* Find the stagger-children block and change 0.07s: */
.stagger-children.visible > *:nth-child(2) { transition-delay: 0.07s; }
/* Change to 0.12s for more dramatic stagger, 0.03s for near-simultaneous */
```

---

## 8. js/render.js — DOM Builder (reads data.js)

**Path:** `js/render.js`
**Lines:** 238
**What it does:** Reads `PORTFOLIO_DATA` and injects HTML into every mount point. You don't need to edit this unless you want to change the HTML structure of a section (e.g., add a new field to project cards).

### When to edit render.js

- You want to add a new field to `data.js` and display it (e.g., a "live demo URL" on project cards)
- You want to change the HTML structure of a section (e.g., show project period on the card)
- You want to add a completely new section

### How it works

Each function follows the same pattern:

```js
function renderProjects() {
  const html = PORTFOLIO_DATA.projects.map(p => `
    <div class="project-card" onclick="Modal.open('${p.id}')">
      ...${p.title}...
    </div>
  `).join('');

  mount('projects-grid', html);  // injects into <div id="projects-grid">
}
```

To add a "live demo" button to project cards:

1. In `data.js`, add `demo: "https://yourdemo.com"` to each project object.
2. In `render.js`, inside `renderProjects()`, add to the card HTML:

```js
${p.demo ? `<a href="${p.demo}" target="_blank" class="btn btn--ghost btn--sm">Live Demo ↗</a>` : ''}
```

---

## 9. js/ui.js — Theme, Nav, Cursor, Toast, Scroll

**Path:** `js/ui.js`
**Lines:** 305
**What it does:** All interactive UI behaviour — theme toggle, nav scroll state, active link highlighting, mobile menu, copy email, custom cursor, scroll-reveal observer, counter animation, smooth scroll.

### Sub-modules inside ui.js

| Module           | What it does                                                                        |
| ---------------- | ----------------------------------------------------------------------------------- |
| `Theme`        | Reads/saves dark/light preference from`localStorage` key `'ak-theme'`           |
| `ProgressBar`  | Updates`#progress-bar` width on scroll                                            |
| `Nav`          | Adds`.scrolled` class to nav after 20px scroll; highlights active nav link        |
| `Banner`       | Handles dismiss button on availability banner, saves to`sessionStorage`           |
| `Toast`        | Global toast notification system — call`UI.Toast.show('message', '✓')` anywhere |
| `CopyEmail`    | Handles`[data-copy-email]` buttons                                                |
| `Cursor`       | Custom cursor dot + lagging ring (desktop only)                                     |
| `ScrollReveal` | IntersectionObserver for`.fade-up`, `.fade-in`, `.stagger-children`           |
| `Counters`     | Animates`.count-up` elements (not currently used in rendered HTML)                |
| `SmoothScroll` | Intercepts`<a href="#...">` clicks for offset-smooth scroll                       |

### How to show a toast notification from your own code

```js
UI.Toast.show('Copied to clipboard!', '✓');
UI.Toast.show('Something went wrong', '⚠');
```

### Changing the default theme

```js
// In ui.js, Theme.init():
const saved = localStorage.getItem('ak-theme') || 'light';
//                                                   ↑ change to 'dark' to default to dark mode
```

### Changing nav active link offset

```js
// In Nav.init(), the rootMargin controls when a section is "active":
const io = new IntersectionObserver(..., { rootMargin: '-40% 0px -55% 0px' });
// Adjust percentages if nav highlight feels off
```

---

## 10. js/modal.js — Case Study & Article Reading Modal

**Path:** `js/modal.js`
**What it does:** Builds, opens, and closes the full-screen modal system for both project case studies and published technical articles. Handles keyboard accessibility (Escape to close, Tab-trap inside modal).

### Opening a modal from anywhere

```js
Modal.open('disease-ml');                // Open project case study by project id
Modal.openArticle('secret-scanner-deep-dive'); // Open published article reader by article id
Modal.close();                           // Close programmatically
```

### Adding a new field to the modal

In `modal.js`, find the `render(project)` function and add to the template string:

```js
// Example — add a "Tech Stack Deep Dive" section:
<div class="modal-section">
  <div class="modal-section-heading">Tech Stack Deep Dive</div>
  <p>${cs.techDeepDive || ''}</p>
</div>
```

Then add `techDeepDive: "Your explanation..."` to the `casestudy` object in `data.js`.

---

## 11. js/github.js — Live GitHub Activity Feed

**Path:** `js/github.js`
**Lines:** 177
**What it does:** Fetches your latest public GitHub events via the unauthenticated GitHub API and renders them in the About section widget. Falls back to hardcoded placeholder events if the API fails.

### Changing the GitHub username

```js
// Line 4 of github.js:
const USERNAME = 'arman080325';   // ← change this
```

### Changing how many activities are shown

```js
// In renderActivity(), change the .slice(0, 5):
.filter(...).slice(0, 5)   // shows 5 items; change to 3 for fewer
```

### Changing the fallback content

If the GitHub API returns an error (rate limit, network error), hardcoded fallback activities are shown. Edit them at the bottom of `fetchActivity()`:

```js
container.innerHTML = `
  <div class="activity-item">
    <span class="activity-icon">↑</span>
    <span class="activity-repo">YOUR-REPO-NAME</span>
    <span class="activity-msg">what you worked on</span>
    <span class="activity-time">recently</span>
  </div>
  ...`;
```

---

## 12. js/contact.js — Contact Form + EmailJS

**Path:** `js/contact.js`
**Lines:** 150
**What it does:** Handles the contact form — validation, EmailJS sending, mailto fallback.

### Activating real email sending (3 steps)

1. Sign up free at [emailjs.com](https://emailjs.com) — free tier = 200 emails/month.
2. Create a service (Gmail), create a template, note your 3 IDs.
3. In `contact.js` lines 10–13:

```js
const EMAILJS_ENABLED    = true;                  // ← change false to true
const EMAILJS_PUBLIC_KEY = 'your_actual_key';     // ← from EmailJS dashboard
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
```

### EmailJS template variables

When creating your template on emailjs.com, use these exact variable names:

```
{{from_name}}     → sender's name
{{from_email}}    → sender's email
{{subject}}       → message subject
{{message}}       → message body
{{to_name}}       → always "Arman"
{{reply_to}}      → sender's email (for Reply-To header)
```

### Changing the fallback email address

Currently hardcoded at line 77 for the mailto fallback:

```js
window.open(`mailto:armankhan082020@gmail.com?subject=${subject}&body=${body}`, '_blank');
//                   ↑ change to your email
```

### Changing validation rules

Minimum message length (line 28):

```js
if (!data.message.trim() || data.message.trim().length < 15)
//                                                        ↑ change 15 to any number
```

---

## 13. js/main.js — Boot Sequence + Typing Animation

**Path:** `js/main.js`
**Lines:** 91
**What it does:** The entry point. Calls `.init()` on all modules in the correct order. Also runs the typing animation in the hero subtitle.

### Changing the typing phrases

```js
const phrases = [
  'Cloud Engineer',
  'DevOps Builder',
  'Full-Stack Developer',
  'ML Enthusiast',
  'AWS Intern',
];
```

Add, remove, or reorder these strings freely. The animation loops endlessly.

### Changing typing speed

```js
let delay = isDeleting ? 45 : 80;
//                       ↑       ↑
//                  delete speed  type speed (ms per character)
```

Lower numbers = faster. Change `80` to `50` for snappier typing.

### Changing the pause at end of word

```js
delay = 1800;   // ms to pause before starting to delete; change to 2500 for longer pause
```

---

## 14. Common Customization Recipes

### Add a new project

In `data.js`, inside the `projects` array, add a new object. Copy this template:

```js
{
  id:       "my-new-project",         // unique, lowercase-hyphen
  category: "Web Application",
  title:    "My New Project",
  desc:     "One or two sentences describing what it does and why it matters.",
  metric:   "Key achievement stat",
  period:   "Jan–Feb 2026",
  featured: false,
  tags:     ["React", "Node.js", "MongoDB"],
  github:   "https://github.com/arman080325/my-repo",
  casestudy: {
    problem:    "What problem you solved...",
    approach:   "How you built it...",
    challenges: [
      "First technical challenge...",
      "Second challenge...",
      "Third challenge..."
    ],
    outcome:  "What you shipped...",
    lessons:  "What you learned..."
  }
}
```

### Add a new job

In `data.js`, inside the `experience` array, add at the top (newest first):

```js
{
  id:       "company-year",
  role:     "Your Role Title",
  company:  "Company Name",
  location: "City, Country",
  period:   "June 2026 — Aug 2026",
  duration: "3 months",
  bullets: [
    "What you built or contributed...",
    "Impact or metric if you have one...",
  ],
  tags: ["Tech1", "Tech2"]
}
```

### Change the color scheme entirely

In `css/variables.css`:

1. Change `--accent` in `:root` (light mode brand color)
2. Change `--bg-root` and `--bg-card` for light backgrounds
3. Change `--accent` in `[data-theme="dark"]` (dark mode brand color)
4. Change `--bg-root` and `--bg-card` in `[data-theme="dark"]`

The accent color's rgba versions (`--accent-light`, `--accent-medium`, `--accent-strong`) are
used for tinted backgrounds. If you change `--accent`, also update the `rgba(r, g, b, ...)` values
of those three variables to match your new color's RGB values.

### Host on GitHub Pages

1. Rename your folder to your GitHub username repo: `arman080325.github.io`
2. Push all files to a GitHub repo named `arman080325.github.io`
3. In Settings → Pages, set source to `main` branch, `/ (root)`
4. Your portfolio will be live at `https://arman080325.github.io`

### Add Google Analytics

In `index.html`, just before `</head>`, add:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your Measurement ID from Google Analytics.

---

## 11. SEO, Rich Snippets & Website Reach Growth Strategies

### 11a. Structured Data (JSON-LD)

`index.html` includes schema.org JSON-LD structured data with:

- `Person`: Standardized bio, social links (`GitHub`, `LinkedIn`, `Dev.to`, `Hashnode`), email, alumni info, and skill tags.
- `WebSite` & `ProfilePage`: Canonical site declarations for Google Search Knowledge Graph.
- `ItemList` + `SoftwareApplication`: Structured project records for `GitAtlas`, `SiteShield`, `NetScope`, and `IndusTrust Bank` to qualify for Google rich snippet software badges.

### 11b. OpenGraph & Twitter Cards (Large Image Format)

- Uses `<meta name="twitter:card" content="summary_large_image">` and `og:image:width="1200"`, `og:image:height="630"`.
- Delivers full-bleed edge-to-edge banners when links are posted on LinkedIn, X/Twitter, Discord, Slack, and WhatsApp.

### 11c. High-Impact Strategies to Increase Portfolio Reach & Inbound Inquiries

1. **GitHub Profile Readme Integration**:
   - Add a high-visibility badge or banner at the top of your GitHub profile (`https://github.com/arman080325/arman080325`):
     `[![Portfolio](https://img.shields.io/badge/Portfolio-arman--portfolio.online-004743?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.arman-portfolio.online/)`
   - Include direct links to live projects in repository descriptions and "About" website fields.
2. **Cross-Publishing on Dev.to and Hashnode**:
   - Cross-post your technical mini-articles (e.g. *"How I Built an In-Browser Secret Scanner"* and *"Anatomy of a Supply Chain Attack"*) on Dev.to and Hashnode.
   - Always set the canonical URL back to `https://www.arman-portfolio.online/#blog` to capture Google domain authority.
3. **LinkedIn Featured Section**:
   - Add your portfolio URL and top case study writeups to the **Featured** carousel on LinkedIn.
   - Share bite-sized architecture takeaways with GIF/video demos from GitAtlas and NetScope.
4. **Google Search Console**:
   - Verify domain property `https://www.arman-portfolio.online` in [Google Search Console](https://search.google.com/search-console).
   - Submit `https://www.arman-portfolio.online/sitemap.xml` for indexing whenever new projects or blog posts are published.

---

*Documentation maintained for Arman's Portfolio · AppSec, DevOps & Full-Stack*
