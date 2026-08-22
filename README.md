<div align="center">

# Arman Ahemad Khan — Personal Portfolio

**Production-grade, highly interactive personal portfolio showcasing work at the intersection of Code & Security.**  
Built with a focus on performance, aesthetics, and user experience. Features a custom-built, context-aware AI chatbot powered by Google Gemini.

[![Live Demo](https://img.shields.io/badge/Live_Demo-arman--portfolio.vercel.app-004743?style=for-the-badge&logo=vercel)](https://arman-portfolio.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-E6C79C?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini API](https://img.shields.io/badge/Gemini_API-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## ✨ Key Features

- 🤖 **Context-Aware AI Chatbot** — An integrated Gemini-powered assistant that knows my resume, projects, and skills. Built with a serverless backend (`api/chat.js`) to securely handle API calls, complete with typing animations and robust error handling.
- 🌗 **Dark / Light Mode** — Smooth toggle with system preference detection and state saved to `localStorage`.
- 🃏 **Project Case Study Modals** — Deep-dive write-ups (problem → approach → outcome) for my engineering projects like CineRoulette.
- 🐙 **Live GitHub Activity Feed** — Real-time commits and heatmap pulled dynamically from the GitHub REST API.
- 📱 **Flawless Mobile Responsiveness** — Adaptive grids, touch-friendly interactions, and mobile-optimized chatbot UI.
- 🎨 **Scroll-Reveal Animations** — Staggered `fade-up`, `fade-in`, and dynamic hover states for a premium feel.
- ♿ **Accessible** — Semantic HTML, keyboard-trapped modals, ARIA attributes, and `:focus-visible` support.
- ⚡ **Performance First** — Zero heavy frontend frameworks. Pure vanilla HTML, CSS, and JS for instant load times (Google Lighthouse 95+).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Backend / API** | Node.js (Vercel Serverless Functions) |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Styling** | Custom CSS Variables, Flexbox, CSS Grid |
| **Deployment** | Vercel |

---

## 📁 Project Architecture

```
portfolio/
│
├── index.html                 # Semantic page shell and layout
│
├── api/
│   └── chat.js                # Serverless function for the Gemini AI Chatbot
│
├── css/
│   ├── variables.css          # Design tokens (colors, fonts, spacing)
│   ├── layout.css             # Base grid and containers
│   ├── components.css         # Section styles (Hero, About, Projects, Modals)
│   ├── chat.css               # AI Chatbot UI and animations
│   └── mobile.css             # Responsive breakpoint overrides
│
└── js/
    ├── data.js                # Centralized content state (bio, projects, experience)
    ├── render.js              # DOM hydration logic (reads from data.js)
    ├── ui.js                  # Theme toggle, scroll animations, modals
    ├── github.js              # GitHub API fetching for live activity feed
    └── chat.js                # AI Chatbot client-side logic and API fetching
```

---

## 🚀 Running Locally

Because this portfolio features a serverless backend for the AI Chatbot, you should run it using a local development server that supports serverless functions (like Vercel CLI).

### Prerequisites
- Node.js (v18+)
- Vercel CLI (`npm i -g vercel`)
- A Gemini API Key from Google AI Studio

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arman080325/Arman-Portfolio.git
   cd Arman-Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the local development server:**
   ```bash
   vercel dev
   ```
   *The site will be available at `http://localhost:3000` with full backend API support.*

---

## 🎨 Design Philosophy

| Concept | Execution |
|---|---|
| **Editorial Typography** | Fraunces (display) + DM Sans (body) for a sophisticated, non-generic contrast. |
| **Warm Light Mode** | Marshmallow Beige (`#F0EDE4`) + Dark Aquamarine (`#004743`) |
| **Rich Dark Mode** | Deep Forest (`#0F2F2F`) + Champagne Gold (`#E6C79C`) |
| **Separation of Concerns** | `data.js` acts as a CMS. The UI reads from it without hardcoding content in HTML. |

---

## 📝 License

This project is licensed under the MIT License.  

---

<div align="center">

Building at the intersection of **code & security.**  
[armankhan082020@gmail.com](mailto:armankhan082020@gmail.com) · [LinkedIn](https://linkedin.com/in/arman-ahemad-khan) · [GitHub](https://github.com/arman080325)

</div>