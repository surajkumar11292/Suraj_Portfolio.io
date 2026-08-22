/* ═══════════════════════════════════════════════════════════════
   ICONS.JS — Real brand-logo lookup for tech tags/pills/marquee.
   Uses Simple Icons (https://simpleicons.org) served from jsDelivr,
   rendered as a CSS mask so every logo inherits the tag's theme
   color instead of clashing multicolor logos everywhere.

   To add more icons: find the slug at https://simpleicons.org and
   add a "your tag text": "slug" entry below (key is case-insensitive).
   If a tag has no entry (or the slug doesn't exist), it just shows
   as plain text — nothing breaks.
   ═══════════════════════════════════════════════════════════════ */

const TECH_ICONS = {
  // Languages
  "python": "python",
  "go": "go",
  "go lang": "go",
  "golang": "go",
  "javascript": "javascript",
  "java": "openjdk",
  "html5": "html5",
  "css3": "css3",
  "php": "php",
  "bash": "gnubash",
  "powershell": "powershell",
  "c++": "cplusplus",
  "mysql": "mysql",
  "oracle db": "oracle",
  "oracle sql": "oracle",
  "postgresql": "postgresql",

  // Cloud / DevOps
  "aws": "amazonaws",
  "aws eks": "amazonaws",
  "aws iam": "amazonaws",
  "ec2": "amazonec2",
  "s3": "amazonaws",
  "cloudwatch": "amazoncloudwatch",
  "lambda": "awslambda",
  "google cloud": "googlecloud",
  "docker": "docker",
  "kubernetes": "kubernetes",
  "terraform": "terraform",
  "github actions": "githubactions",
  "travisci": "travisci",
  "nginx": "nginx",
  "hashicorp vault": "vault",
  "splunk": "splunk",
  "linux": "linux",
  "kali linux": "kalilinux",

  // Frameworks / web
  "react": "react",
  "react native": "react",
  "react js": "react",
  "node.js": "nodedotjs",
  "flask": "flask",
  "fastapi": "fastapi",
  "material-ui": "mui",
  "junit": "junit5",

  // ML / Data
  "scikit-learn": "scikitlearn",
  "pandas": "pandas",
  "numpy": "numpy",
  "matplotlib": "matplotlib",
  "streamlit": "streamlit",

  // Security tools
  "burp suite": "portswigger",
  "nmap": "nmap",
  "wireshark": "wireshark",
  "owasp": "owasp",
  "owasp top 10": "owasp",

  // Dev tools & Web
  "git": "git",
  "vs code": "visualstudiocode",
  "intellij": "intellijidea",
  "vmware": "vmware",
  "virtualbox": "virtualbox",
  "jupyter": "jupyter",
  "pycharm": "pycharm",
  "eclipse": "eclipseide",
  "maven": "apachemaven",
  "upstash redis": "redis",
  "redis": "redis",
  "upstash": "upstash",
  "vercel": "vercel",
  "cli": "gnubash",
};

/**
 * Returns a <span> mask-icon for a tag label, or "" if no mapping exists.
 */
function techIconHTML(label) {
  const slug = TECH_ICONS[String(label).trim().toLowerCase()];
  if (!slug) return "";
  const url = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
  return `<span class="tech-icon" aria-hidden="true" style="--icon-url:url('${url}')"></span>`;
}

/**
 * Wraps a tag label with its icon (if any) inside the given class.
 */
function tagWithIcon(label, cls) {
  return `<span class="${cls}">${techIconHTML(label)}${label}</span>`;
}
