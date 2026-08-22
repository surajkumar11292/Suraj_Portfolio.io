/* ═══════════════════════════════════════════════════════════════
   DATA.JS — All portfolio content in one place.
   Edit this file to update your portfolio without touching HTML/JS.
   ═══════════════════════════════════════════════════════════════ */

const PORTFOLIO_DATA = {
  /* ── PERSONAL INFO ─────────────────────────────────────────── */
  name: "Suraj Kumar",
  shortName: "Suraj",
  title: "Full-Stack Developer · React · Node.js",
  tagline: "Full-Stack Software Engineer",
  bio: [
    "I'm a Full-Stack Software Engineer with hands-on professional experience building <span class='about-highlight'>production-grade web applications</span> using the <span class='about-highlight'>MERN stack</span> — from school management portals to real-time messaging ecosystems.",

    "I specialize in architecting end-to-end systems: responsive React frontends, scalable Node.js backends, secure REST APIs with JWT & RBAC, and real-time features via WebSockets and WebRTC. I've shipped features used by real users at <em>Earth Services</em>, integrated AI APIs (Gemini 1.5 Flash), and built P2P file-sharing platforms with zero server storage cost.",

    "I believe in <em>shipping fast, iterating faster</em>. Every project in this portfolio started with a real problem — and ended with something deployed and working in production.",
  ],
  availability: "Open to Full-Stack & Software Engineer Roles",
  resumeUrl: "assets/Suraj_Kumar_Resume.pdf",

  /* ── CONTACT ───────────────────────────────────────────────── */
  contact: {
    email: "surajkumar11292@gmail.com",
    phone: "+91 7258025793",
    github: "https://github.com/surajkumar11292",
    linkedin: "https://www.linkedin.com/in/suraj-kumar-1b9a65250/",
    location: "India",
  },

  /* ── STATS ─────────────────────────────────────────────────── */
  stats: [
    { num: "1+", label: "Year Experience" },
    { num: "3+", label: "Projects Shipped" },
    { num: "10+", label: "Tech Stack" },
    { num: "100%", label: "Production Deploys" },
  ],

  /* ── CURRENTLY LEARNING ────────────────────────────────────── */
  learning: [
    "TypeScript",
    "Next.js",
    "System Design",
    "Redis",
    "PostgreSQL",
    "Docker & Kubernetes",
    "AWS",
    "GraphQL",
  ],

  /* ── EXPERIENCE ─────────────────────────────────────────────── */
  experience: [
    {
      id: "earth-services-2024",
      role: "Full-Stack Software Engineer",
      company: "Earth Services",
      location: "India",
      period: "Nov 2024 — Mar 2026",
      duration: "16 months",
      bullets: [
        "Developed and maintained features for school management portals and internal CRMs using the MERN stack (MongoDB, Express.js, React.js, Node.js)",
        "Built responsive student and admin dashboard screens using React.js and Tailwind CSS, streamlining admissions and attendance workflows for school staff",
        "Created RESTful APIs to handle multi-step form submissions, securely storing and retrieving institutional records using MongoDB and Mongoose schemas",
        "Implemented secure login systems utilizing JWT (JSON Web Tokens) and Role-Based Access Control (RBAC) to ensure strict data privacy across admin, teacher, and student views",
        "Integrated Socket.io to push live event updates to admin dashboards and assisted in configuring Razorpay webhooks for automated online fee collection status tracking",
      ],
      tags: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Socket.io",
        "JWT",
        "RBAC",
        "Tailwind CSS",
        "Razorpay",
      ],
    },
  ],

  /* ── CURRENTLY BUILDING ────────────────────────────────────── */
  currentlyBuilding: {
    title: "Portfolio — Professional Showcase",
    desc: "Building a clean, high-performance personal portfolio to showcase my engineering projects and professional experience. Focused on fast load times, great SEO, and a premium user experience.",
    stack: ["HTML5", "CSS3", "JavaScript", "Vercel"],
    startedMonth: "Aug 2026",
    status: "in-progress",
    nextUp: {
      title: "SaaS Dashboard — Full-Stack App",
      desc: "A production-ready SaaS boilerplate with auth, billing, team management, and a clean dashboard — built on Next.js + Prisma + Stripe.",
      status: "planned",
    },
  },

  /* ── PROJECTS ──────────────────────────────────────────────── */
  projects: [
    {
      id: "chatapp",
      category: "Full-Stack · Real-Time",
      title: "Chat-App — Real-Time Messaging Ecosystem",
      desc: "A production-grade MERN messaging application containerized with Docker, with bidirectional Socket.io communication for real-time delivery, Clerk Webhooks for async user profile sync, and ImageKit for optimized rich-media loading.",
      metric: "Real-Time · Docker · WebSockets",
      period: "2025",
      featured: true,
      hero: true,
      tags: ["React", "Node.js", "Socket.io", "Docker", "Clerk", "ImageKit", "MongoDB"],
      github: "https://github.com/surajkumar11292",
      repo: "chat-app",
      demo: "https://chat-app-nl36.onrender.com",
      casestudy: {
        problem:
          "Building a real-time chat application that works reliably in production — handling bidirectional communication, user profile sync across services, and rich media — without cold-start latency killing the demo experience.",
        approach:
          "Containerized the full MERN stack with Docker for consistent deployments. Used Socket.io for bidirectional real-time message delivery. Integrated Clerk Webhooks to asynchronously sync user profile changes across services without blocking the main request path. Optimized image and media loading through ImageKit API. Configured automated cron job background workers to keep the Render backend warm 24/7, eliminating cold-start latency.",
        challenges: [
          "Keeping WebSocket connections stable across container restarts and Render's ephemeral instances",
          "Synchronizing Clerk's user profile events asynchronously without creating race conditions in the chat feed",
          "Eliminating cold-start delays on Render's free tier — solved with a keep-warm cron job pinging the health endpoint",
        ],
        outcome:
          "A fully deployed, containerized real-time messaging app live at chat-app-nl36.onrender.com with persistent messages, real-time delivery indicators, and rich media support.",
        lessons:
          "Containerizing early — even for a side project — forces you to think about environment parity, port configuration, and production readiness from day one instead of scrambling before deployment.",
      },
    },
    {
      id: "noshare",
      category: "Full-Stack · P2P · WebRTC",
      title: "NoShare — Decentralized P2P File Transfer",
      desc: "A serverless file-sharing platform using WebRTC data channels — no server storage, no uploads, just pure peer-to-peer transfer. Reduced transfer latency by 60% vs. traditional server-relay approaches. Features a custom Express.js signaling server with in-memory IP rate limiting.",
      metric: "60% lower latency · Zero server storage",
      period: "2025",
      featured: true,
      hero: true,
      tags: ["React", "WebRTC", "WebSockets", "Express.js", "Vercel"],
      github: "https://github.com/surajkumar11292",
      repo: "NoShare",
      demo: "https://no-share.vercel.app",
      casestudy: {
        problem:
          "Traditional file sharing requires uploading to a server, waiting, then downloading — adding latency, cost, and privacy risk. For direct peer sharing, this is unnecessary overhead.",
        approach:
          "Engineered a fully serverless architecture using WebRTC data channels for direct browser-to-browser file transfer — no server ever touches the file bytes. Built an Express.js signaling server to handle WebRTC offer/answer exchange and ICE candidate negotiation. Added an in-memory IP rate limiter to throttle room handshakes and block DDoS flood vectors. Developed custom React hooks (useWebRTC, useSocket) to dynamically render real-time P2P connection states and file transfer progress.",
        challenges: [
          "Handling NAT traversal for users behind firewalls — solved with STUN servers and ICE candidate exchange through the signaling layer",
          "Streaming large files over WebRTC data channels without memory overflow — implemented chunked transfer with progress tracking",
          "Designing the rate limiter to block abuse without breaking legitimate multi-room use cases",
        ],
        outcome:
          "A live, fully serverless P2P file sharing platform at no-share.vercel.app — files transfer directly between browsers with zero server storage cost and 60% lower latency than server-relay alternatives.",
        lessons:
          "WebRTC's complexity hides behind the ICE negotiation — once you understand STUN/TURN and the offer/answer flow, the data channel itself is surprisingly clean. Custom hooks were the right abstraction for managing the connection lifecycle in React.",
      },
    },
    {
      id: "police-documentation",
      category: "Full-Stack · AI",
      title: "Police-Documentation — AI-Powered Record Management",
      desc: "An archival portal for police record management with Role-Based Access Control (RBAC), admin approval workflows, and automated audit logging. Integrates Gemini 1.5 Flash to parse multi-format documents (PDFs/images) and extract structured case metadata. Secured with Twilio MFA, JWT, and SHA-256 document integrity verification.",
      metric: "AI-Powered · RBAC · MFA · Audit Logs",
      period: "2025",
      featured: true,
      hero: true,
      tags: ["React", "Node.js", "MongoDB", "Gemini AI", "JWT", "Twilio MFA", "RBAC"],
      github: "https://github.com/surajkumar11292",
      repo: "police-documentation",
      demo: "https://digital-record-portal.vercel.app",
      casestudy: {
        problem:
          "Police record management is often paper-based or relies on fragmented digital systems without proper access control, audit trails, or the ability to process multi-format documents efficiently.",
        approach:
          "Built a full archival portal with role-based access control separating admin, officer, and read-only views. Integrated Gemini 1.5 Flash API to automatically parse uploaded PDFs and images, extracting structured case metadata (dates, names, case numbers) directly into HTML form fields — eliminating manual data entry. Implemented a complete security stack: Twilio Verify for SMS-based MFA, JWT for session authorization, and SHA-256 cryptographic hashing to verify document integrity and detect tampering. Admin approval workflows ensure no record goes live without review.",
        challenges: [
          "Making Gemini's document parsing output reliably map to a structured form schema — solved with prompt engineering and response validation",
          "Designing RBAC that scales cleanly: permissions are checked server-side on every route, not just hidden in the frontend",
          "SHA-256 document integrity verification — hashes computed at upload time and re-verified on every access to detect tampering",
        ],
        outcome:
          "A fully deployed archival portal at digital-record-portal.vercel.app with AI document parsing, MFA-protected login, role-based dashboards, and cryptographic document integrity verification.",
        lessons:
          "AI integrations are only as good as their validation layer. Gemini's output needed strict post-processing to be useful — raw LLM responses are not production-ready without schema validation and fallback handling.",
      },
    },
  ],

  /* ── SKILLS ────────────────────────────────────────────────── */
  skills: [
    {
      group: "Frontend",
      icon: "{ }",
      items: [
        "JavaScript",
        "React.js",
        "Redux Toolkit",
        "Zustand",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
      ],
    },
    {
      group: "Backend & Database",
      icon: "◈",
      items: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose ODM",
        "MySQL",
        "REST APIs",
        "JWT",
      ],
    },
    {
      group: "Architecture",
      icon: "⬡",
      items: [
        "WebRTC",
        "Socket.io",
        "WebSockets",
        "Peer-to-Peer (P2P)",
        "Event-Driven Sync",
        "RBAC",
        "MVC",
      ],
    },
    {
      group: "DevOps & Tools",
      icon: "☁",
      items: [
        "Git / GitHub",
        "Docker",
        "CI/CD Pipelines",
        "GitHub Actions",
        "Vercel",
        "Render",
        "Postman",
      ],
    },
    {
      group: "AI & Integrations",
      icon: "⚙",
      items: [
        "Gemini AI API",
        "Clerk Auth",
        "Twilio Verify (MFA)",
        "ImageKit",
        "Webhooks",
        "Razorpay",
      ],
    },
  ],

  /* ── EDUCATION ─────────────────────────────────────────────── */
  education: [
    {
      type: "Bachelor's Degree",
      degree: "Bachelor of Computer Applications (BCA)",
      school: "Aryabhatta Knowledge University",
      location: "Bihar, India",
      period: "2020 — 2023",
      grade: "CGPA 8.08",
      gradeNote: "AKU",
    },
  ],

  /* ── CERTIFICATIONS ───────────────────────────────────────── */
  certifications: [
    {
      name: "Web Development Course with AI",
      issuer: "Udemy",
      issuerLogo: "Udemy",
      date: "2024",
      credentialId: "UDEMY-WEB-AI",
      verifyUrl: "#",
      tags: ["Web Development", "AI", "Full-Stack"],
    },
  ],

  /* ── BLOG POSTS ─────────────────────────────────────────────── */
  blog: [
    {
      id: "webrtc-p2p-deep-dive",
      title: "Building a Real P2P File Transfer App with WebRTC — No Server Storage",
      subtitle: "From ICE negotiation to chunked file streaming in the browser.",
      summary: "A deep dive into building NoShare — how WebRTC data channels, signaling servers, and custom React hooks combine to create a zero-server-storage file transfer experience.",
      platform: "Engineering Deep Dive",
      date: "Upcoming",
      readTime: "8 min read",
      tags: ["WebRTC", "P2P", "React", "Full-Stack"],
      isPublished: false,
      url: "#",
      notifyText: "Coming soon",
    },
    {
      id: "socket-io-scale",
      title: "Real-Time at Scale: Lessons from Building a Production Chat App",
      summary: "What I learned shipping a Socket.io chat app on Docker + Render — connection stability, cold-start elimination, and asynchronous webhook sync patterns.",
      platform: "Dev.to",
      date: "Upcoming",
      url: "https://dev.to",
      notifyText: "Follow on Dev.to ↗",
      tags: ["Socket.io", "Docker", "Node.js", "Real-Time"],
      readTime: "6 min read",
      isPublished: false,
    },
  ],

  /* ── MARQUEE TECH ──────────────────────────────────────────── */
  marqueeItems: [
    "React.js",
    "Node.js",
    "MongoDB",
    "Express.js",
    "Socket.io",
    "WebRTC",
    "Docker",
    "JavaScript",
    "Tailwind CSS",
    "JWT",
    "REST APIs",
    "GitHub Actions",
    "Vercel",
    "Clerk",
    "Gemini AI",
    "Twilio",
    "Redux Toolkit",
    "Mongoose",
  ],
};