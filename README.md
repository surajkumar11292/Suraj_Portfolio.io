<div align="center">

# Suraj Kumar — Personal Portfolio

**Production-grade, highly interactive personal portfolio showcasing full-stack engineering, real-time systems, and AI integration.**  
Built with a focus on performance, aesthetics, and modern developer experience. Features an in-browser interactive terminal, animated project showcases, and a context-aware AI assistant powered by Google Gemini.

[![Live Demo](https://img.shields.io/badge/Live_Demo-suraj--portfolio--io.vercel.app-004743?style=for-the-badge&logo=vercel)](https://suraj-portfolio-io.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-E6C79C?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini API](https://img.shields.io/badge/Gemini_API-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## ✨ Key Features

- 🤖 **Context-Aware AI Chatbot** — Embedded Gemini assistant that knows my background, education (AKU BCA), work experience at Earth Services, and featured projects. Built with a serverless backend (`api/chat.js`) to securely handle API calls with rate limiting.
- ⚡ **Interactive Terminal Emulator** — Press `` ` `` or click the terminal trigger to enter an interactive CLI with commands (`help`, `projects`, `skills`, `experience`, `neofetch`, `contact`).
- 🎬 **Live Animated Project Showcases** — Custom animated SVG visuals demonstrating real-time message streams, WebRTC P2P data channels, and document scanning.
- 🌗 **Multi-Theme Support** — Seamless transitions between **Dark Mode** (default), **Light Mode**, and **Terminal Mode** with persistent `localStorage` memory.
- 🐙 **Live GitHub Activity** — Real-time commits and repository stats dynamically fetched from the public GitHub REST API.
- 📱 **Flawless Responsive Design** — Fluid typography, CSS Grid / Flexbox layouts, and custom touch interactions tailored for mobile, tablet, and desktop screens.
- 🚀 **Zero Framework Overhead (95+ Lighthouse)** — Built with pure vanilla HTML, CSS, and JavaScript for sub-second CDN delivery and instantaneous page transitions.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | HTML5, CSS3 Custom Properties, Vanilla JavaScript (ES6+) |
| **Backend / API** | Node.js (Vercel Serverless Functions) |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Styling & Effects** | Modern CSS Grid, Glassmorphism, SVG Keyframe Animations |
| **Deployment** | Vercel Edge Network |

---

## 📁 Featured Projects

1. **[Swiss Bank](https://swiss-bank-zeta.vercel.app/)** ([GitHub Repo](https://github.com/surajkumar11292/Swiss_Bank)) — Security-focused fintech digital banking web application with 256-bit AES encryption, MFA vault authentication, atomic fund transfers, and real-time ledger verification.
2. **[Chat-App](https://chat-app-nl36.onrender.com)** ([GitHub Repo](https://github.com/surajkumar11292/Chat-App)) — Real-time MERN messaging ecosystem with Socket.io, Docker containerization, Clerk Webhooks, and ImageKit media optimization.
3. **[NoShare](https://no-share.vercel.app)** ([GitHub Repo](https://github.com/surajkumar11292/NoShare)) — Serverless peer-to-peer file transfer platform using WebRTC data channels — zero server storage with 60% lower latency.
4. **[Police-Documentation](https://digital-record-portal.vercel.app)** ([GitHub Repo](https://github.com/surajkumar11292/Police_Documentation)) — AI-powered police archival management portal with Gemini 1.5 document parsing, Twilio MFA, RBAC, and SHA-256 integrity verification.
5. **[Personal Portfolio](https://suraj-portfolio-io.vercel.app/)** ([GitHub Repo](https://github.com/surajkumar11292/Suraj_Portfolio.io)) — High-performance developer portfolio scoring 95+ on Google Lighthouse with dark/light themes and terminal mode.

---

## 📂 Project Structure

```
MyPortfolio/
├── index.html                 # Main semantic structure and application shell
├── api/
│   └── chat.js                # Vercel Serverless Function for Gemini AI Chatbot
├── css/
│   ├── variables.css          # Design tokens (colors, typography, spacing)
│   ├── layout.css             # Page grids and section containers
│   ├── components.css         # Component styling (Hero, About, Cards, Modals)
│   ├── terminal.css           # In-browser terminal emulator styles
│   ├── project-hero.css       # Featured project animated visual panels
│   ├── chat.css               # AI Chatbot widget UI and animations
│   └── mobile.css             # Mobile and tablet responsive rules
├── js/
│   ├── data.js                # Single source of truth for portfolio content
│   ├── render.js              # Dynamic DOM rendering and SVG hero animations
│   ├── ui.js                  # Theme switching, smooth scrolling, toasts
│   ├── terminal.js            # In-browser CLI engine and commands
│   ├── github.js              # Live GitHub API stats and commit feed
│   ├── contact.js             # Contact form with EmailJS and mailto fallback
│   └── chat.js                # Client-side chatbot interface and API connector
├── assets/
│   ├── logo.svg               # Brand monogram logo mark
│   ├── photo.jpg              # Profile photo
│   └── Suraj_Kumar_Resume.pdf # Downloadable resume
└── package.json               # Project metadata and dependencies
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- Vercel CLI (optional for serverless testing: `npm i -g vercel`)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/surajkumar11292/Suraj_Portfolio.io.git
   cd Suraj_Portfolio.io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run with Vercel Dev (recommended for AI Chat API):**
   ```bash
   vercel dev
   ```
   Or serve statically:
   ```bash
   npx serve .
   ```

---

## 📬 Contact & Connect

- **Portfolio:** [suraj-portfolio-io.vercel.app](https://suraj-portfolio-io.vercel.app/)
- **Email:** [surajkumar11292@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=surajkumar11292@gmail.com)
- **GitHub:** [@surajkumar11292](https://github.com/surajkumar11292)
- **LinkedIn:** [Suraj Kumar](https://www.linkedin.com/in/suraj-kumar-1b9a65250/)

---

<div align="center">
  <sub>Designed & Developed by Suraj Kumar · © 2026</sub>
</div>