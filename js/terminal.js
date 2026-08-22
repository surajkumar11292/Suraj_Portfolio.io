/* ═══════════════════════════════════════════════════════════════
   TERMINAL.JS — Hidden CLI Easter egg.

   HOW TO TRIGGER:
     • Type  a r m a n  anywhere on the page (no input focused)
     • Press  `  (backtick) anywhere on the page
     • Click the tiny ">" hint that appears in the footer

   COMMANDS:
     help · whoami · skills · experience · projects
     contact · hire · clear · exit · neofetch · sudo
   ═══════════════════════════════════════════════════════════════ */

/* ── GUARD: wait for PORTFOLIO_DATA ────────────────────────── */
function initTerminalWhenReady() {
  if (typeof PORTFOLIO_DATA === 'undefined') {
    setTimeout(initTerminalWhenReady, 50);
    return;
  }
  Terminal.init();
}

const Terminal = (() => {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────────── */
  const PROMPT       = '<span class="t-user">suraj</span><span class="t-at">@</span><span class="t-host">portfolio</span><span class="t-colon">:</span><span class="t-tilde">~</span><span class="t-dollar">$</span>';
  const BOOT_DELAY   = 38;   // ms per boot line
  const TYPE_DELAY   = 14;   // ms per output line
  const TRIGGER_WORD = 'suraj';

  /* ── STATE ──────────────────────────────────────────────────── */
  let overlay, termBox, outputEl, inputEl, cursorEl;
  let isOpen       = false;
  let history      = [];
  let historyIndex = -1;
  let keyBuffer    = '';
  let keyTimer     = null;
  let inputLocked  = false;
  let domBuilt     = false;

  /* ── COLOUR HELPERS ─────────────────────────────────────────── */
  const g  = s => `<span class="t-green">${s}</span>`;
  const y  = s => `<span class="t-yellow">${s}</span>`;
  const c  = s => `<span class="t-cyan">${s}</span>`;
  const r  = s => `<span class="t-red">${s}</span>`;
  const m  = s => `<span class="t-magenta">${s}</span>`;
  const b  = s => `<span class="t-bold">${s}</span>`;
  const d  = s => `<span class="t-dim">${s}</span>`;
  const nl = () => '';

  /* ── SAFE DATA ACCESSOR ─────────────────────────────────────── */
  function pd() {
    return typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : null;
  }

  /* ── COMMAND REGISTRY ───────────────────────────────────────── */
  const COMMANDS = {

    /* ·· HELP ·················································· */
    help() {
      return [
        nl(),
        b(g('╔══════════════════════════════════════╗')),
        b(g('║  Available Commands                  ║')),
        b(g('╚══════════════════════════════════════╝')),
        nl(),
        `  ${y('whoami')}           ${d('→')}  About me`,
        `  ${y('skills')}           ${d('→')}  Technical skill tree`,
        `  ${y('experience')}       ${d('→')}  Work history timeline`,
        `  ${y('projects')}         ${d('→')}  Projects I\'ve shipped`,
        `  ${y('contact')}          ${d('→')}  How to reach me`,
        `  ${y('certifications')}   ${d('→')}  My credentials`,
        `  ${y('neofetch')}         ${d('→')}  System info (fun)`,
        `  ${y('sudo')}             ${d('→')}  ...try it`,
        `  ${y('hire')}             ${d('→')}  Open contact form`,
        `  ${y('clear')}            ${d('→')}  Clear terminal`,
        `  ${y('exit')}             ${d('→')}  Close terminal`,
        nl(),
        d('  Tip: use ↑↓ arrows for history, Tab to autocomplete'),
        nl(),
      ];
    },

    /* ·· WHOAMI ················································· */
    whoami() {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      return [
        nl(),
        `  ${b(g(data.name))}`,
        `  ${c(data.title)}`,
        nl(),
        `  ${d('University')}   ${data.education[0].school}, ${data.education[0].location}`,
        `  ${d('Degree')}       ${data.education[0].degree}`,
        `  ${d('Year')}         4th year (graduating May 2026)`,
        `  ${d('Location')}     ${data.contact.location}`,
        nl(),
        `  ${b('Bio')}`,
        `  ${d('─────────────────────────────────────')}`,
        ...data.bio.map(p =>
          (p.replace ? p.replace(/<[^>]+>/g, '') : String(p))
            .match(/.{1,58}/g)
            .map(line => `  ${line}`)
        ).flat(),
        nl(),
        `  ${d('Status')}  ${g('●')} ${data.availability}`,
        nl(),
      ];
    },

    /* ·· SKILLS ················································· */
    skills() {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      const lines = [
        nl(),
        b(c('  ┌─ Technical Skill Tree ───────────────────┐')),
        nl(),
      ];
      data.skills.forEach(group => {
        lines.push(`  ${y('▸ ' + group.group)}`);
        group.items.forEach((item, i) => {
          const isLast = i === group.items.length - 1;
          lines.push(`  ${d(isLast ? '    └─' : '    ├─')} ${item}`);
        });
        lines.push(nl());
      });
      lines.push(b(c('  └─────────────────────────────────────────┘')));
      lines.push(nl());
      return lines;
    },

    /* ·· EXPERIENCE ············································· */
    experience() {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      const lines = [nl()];
      data.experience.forEach((job, idx) => {
        lines.push(`  ${g('◆')} ${b(job.role)}`);
        lines.push(`    ${c(job.company)} ${d('·')} ${d(job.location)}`);
        lines.push(`    ${d(job.period)} ${d('(')}${y(job.duration)}${d(')')}`);
        lines.push(nl());
        (job.bullets || []).slice(0, 3).forEach(bullet => {
          const short = bullet.length > 62 ? bullet.slice(0, 62) + '…' : bullet;
          lines.push(`    ${d('→')} ${short}`);
        });
        if (job.tags && job.tags.length) {
          lines.push(`    ${d('Tags:')} ${job.tags.map(t => c(t)).join(d(' · '))}`);
        }
        if (idx < data.experience.length - 1) {
          lines.push(nl());
          lines.push(`    ${d('─'.repeat(50))}`);
          lines.push(nl());
        }
      });
      lines.push(nl());
      return lines;
    },

    /* ·· PROJECTS ··············································· */
    projects() {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      const lines = [nl()];
      data.projects.forEach((p, i) => {
        const num = String(i + 1).padStart(2, '0');
        lines.push(`  ${d(num)}  ${b(y(p.title))}`);
        lines.push(`      ${d('Category:')} ${c(p.category)}  ${d('Period:')} ${p.period}`);
        const descText = (p.desc || '').replace(/<[^>]+>/g, '');
        (descText.match(/.{1,60}/g) || [descText]).forEach(line => lines.push(`      ${d(line)}`));
        if (p.tags) lines.push(`      ${d('Stack:')} ${p.tags.map(t => g(t)).join(d(', '))}`);
        if (p.metric) lines.push(`      ${d('Metric:')} ${m(p.metric)}`);
        lines.push(nl());
      });
      lines.push(d('  Tip: type  projects 1  to open a case study'));
      lines.push(nl());
      return lines;
    },

    /* ·· PROJECTS <N> ··········································· */
    'projects '(arg) {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      const idx = parseInt(arg, 10) - 1;
      const p = data.projects[idx];
      if (!p) return [nl(), r(`  Project ${escHtml(arg)} not found.`), `  Type ${y('projects')} to list all.`, nl()];
      const cs = p.casestudy;
      if (!cs) return [nl(), d(`  No case study for: ${p.title}`), nl()];
      const wrap = text => (text || '').match(/.{1,62}/g) || [text || ''];
      return [
        nl(),
        b(g(`  ┌─ Case Study: ${p.title} ─`)),
        nl(),
        `  ${y('Problem')}`,
        ...wrap(cs.problem).map(l => `    ${l}`),
        nl(),
        `  ${y('Approach')}`,
        ...wrap(cs.approach).map(l => `    ${l}`),
        nl(),
        `  ${y('Outcome')}`,
        ...wrap(cs.outcome).map(l => `    ${l}`),
        nl(),
        `  ${y('Lesson')}`,
        ...wrap(cs.lessons).map(l => `    ${l}`),
        nl(),
        b(g('  └──────────────────────────────────────────────')),
        nl(),
      ];
    },

    /* ·· CONTACT ················································ */
    contact() {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      const ct = data.contact;
      return [
        nl(),
        b(c('  Contact Suraj')),
        `  ${'─'.repeat(38)}`,
        nl(),
        `  ${y('Email')}     ${ct.email}`,
        `  ${y('Phone')}     ${ct.phone || 'not listed'}`,
        `  ${y('GitHub')}    ${c('github.com/surajkumar11292')}`,
        `  ${y('LinkedIn')}  ${c('linkedin.com/in/suraj-kumar-1b9a65250')}`,
        `  ${y('Location')}  ${ct.location}`,
        nl(),
        d('  Response time: within 24 hours'),
        d('  Fastest: LinkedIn DMs'),
        nl(),
        `  ${g('→')}  Type ${y('hire')} to open the contact form`,
        nl(),
      ];
    },

    /* ·· CERTIFICATIONS ········································· */
    certifications() {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      const certs = data.certifications;
      if (!certs || !certs.length) {
        return [nl(), d('  No certifications added yet.'), nl()];
      }
      const lines = [nl()];
      certs.forEach(cert => {
        lines.push(`  ${g('◈')} ${b(cert.name)}`);
        lines.push(`    ${c(cert.issuer)} ${d('·')} ${y(cert.date)}`);
        if (cert.credentialId) lines.push(`    ${d('ID:')} ${cert.credentialId}`);
        lines.push(nl());
      });
      return lines;
    },

    /* ·· HIRE ··················································· */
    hire() {
      setTimeout(() => {
        terminalClose();
        setTimeout(() => {
          const target = document.getElementById('contact');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              const firstInput = target.querySelector('input, textarea');
              if (firstInput) firstInput.focus();
            }, 600);
          }
        }, 200);
      }, 600);
      return [
        nl(),
        g('  ✓ Opening contact section…'),
        d('  Closing terminal in 0.6s'),
        nl(),
      ];
    },

    /* ·· NEOFETCH ··············································· */
    neofetch() {
      const data = pd();
      if (!data) return [r('  Error: portfolio data not loaded.')];
      const skillCount = data.skills.flatMap(s => s.items).length;
      return [
        nl(),
        `  ${g('          .\'\'.\'.')}         ${b(g('arman') + c('@') + g('portfolio'))}`,
        `  ${g('        .\' .  \'.\'.\'.')}     ${d('─────────────────────────')}`,
        `  ${g('       /  .\'  . \\.')}       ${y('OS')}      Portfolio v1.0`,
        `  ${g('      . \'  .\'  . .')}       ${y('Host')}    arman080325.github.io`,
        `  ${g('      \'  .\'  .\'  .')}       ${y('Kernel')}  Vanilla JS`,
        `  ${g('     .  /   \\  .\'.')}       ${y('Shell')}   terminal.js`,
        `  ${g('     \'. \\   / .\'.')}        ${y('DE')}      Custom Portfolio UI`,
        `  ${g('       \'.\\ /.\'')}           ${y('Theme')}   Fraunces + DM Sans`,
        `  ${g('         \'.\'')}             ${y('Colors')}  #004743 / #E6C79C`,
        nl(),
        `  ${d('                ')}           ${y('CPU')}     4th yr CSE Student`,
        `  ${d('                ')}           ${y('GPU')}     AWS + Kubernetes`,
        `  ${d('                ')}           ${y('RAM')}     ${skillCount} skills loaded`,
        `  ${d('                ')}           ${y('Disk')}    ${data.projects.length} projects shipped`,
        nl(),
        `  ${d('                ')}           ${'  ██  ██  ██  ██  ██  ██  ██  ██'.split('').map((ch, i) =>
          `<span style="color:hsl(${i * 18},70%,55%)">${ch}</span>`
        ).join('')}`,
        nl(),
      ];
    },

    /* ·· SUDO ··················································· */
    sudo() {
      return [
        nl(),
        r('  [sudo] password for suraj: '),
        r('  Sorry, try again.'),
        r('  [sudo] password for suraj: '),
        r('  Sorry, try again.'),
        r('  sudo: 3 incorrect password attempts'),
        nl(),
        d('  (Nice try 😄)'),
        nl(),
      ];
    },

    /* ·· CLEAR ·················································· */
    clear() {
      if (outputEl) outputEl.innerHTML = '';
      return [];
    },

    /* ·· EXIT ···················································· */
    exit() {
      setTimeout(terminalClose, 300);
      return [nl(), d('  Goodbye 👋'), nl()];
    },

    /* ·· UNKNOWN ················································ */
    _unknown(cmd) {
      return [
        nl(),
        `  ${r('command not found:')} ${escHtml(cmd)}`,
        `  Type ${y('help')} to see available commands.`,
        nl(),
      ];
    },
  };

  /* ── COMMAND RUNNER ─────────────────────────────────────────── */
  function run(raw) {
    const trimmed = raw.trim();

    // Echo prompt line into output history
    appendLine(`${PROMPT}&nbsp;${escHtml(trimmed)}`);

    if (!trimmed) {
      scrollToBottom();
      inputEl.focus();
      return;
    }

    history.unshift(trimmed);
    historyIndex = -1;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg     = rest.join(' ');
    const fullKey = arg ? `${cmd} ` : cmd;

    let lines;
    if (arg && COMMANDS[fullKey]) {
      lines = COMMANDS[fullKey](arg);
    } else if (COMMANDS[cmd]) {
      lines = COMMANDS[cmd]();
    } else {
      lines = COMMANDS._unknown(trimmed);
    }

    typeLines(lines);
  }

  /* ── OUTPUT HELPERS ─────────────────────────────────────────── */
  function appendLine(html) {
    const row = document.createElement('div');
    row.className = 't-line';
    row.innerHTML = html || '&nbsp;';
    outputEl.appendChild(row);
    scrollToBottom();
  }

  function typeLines(lines) {
    if (!lines || !lines.length) { unlockInput(); return; }
    inputLocked = true;
    let i = 0;
    function next() {
      if (i >= lines.length) { unlockInput(); return; }
      appendLine(lines[i]);
      i++;
      setTimeout(next, TYPE_DELAY);
    }
    next();
  }

  function unlockInput() {
    inputLocked = false;
    if (inputEl) inputEl.focus();
    scrollToBottom();
  }

  function scrollToBottom() {
    if (termBox) termBox.scrollTop = termBox.scrollHeight;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ── INPUT HANDLING ─────────────────────────────────────────── */
  function handleInputKey(e) {
    if (inputLocked) { e.preventDefault(); return; }

    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      syncCursor();
      run(val);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      inputEl.value = history[historyIndex] || '';
      syncCursor();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      historyIndex = Math.max(historyIndex - 1, -1);
      inputEl.value = historyIndex === -1 ? '' : history[historyIndex];
      syncCursor();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      autocomplete();
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      COMMANDS.clear();
      return;
    }

    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      appendLine(`${PROMPT}&nbsp;${escHtml(inputEl.value)}<span class="t-red">^C</span>`);
      inputEl.value = '';
      syncCursor();
      inputEl.focus();
      return;
    }
  }

  function syncCursor() {
    if (!cursorEl || !inputEl) return;
    // Measure a char with a hidden span for precision
    const fontSize = parseFloat(getComputedStyle(inputEl).fontSize);
    cursorEl.style.left = (inputEl.value.length * fontSize * 0.605) + 'px';
  }

  function autocomplete() {
    const val = inputEl.value.toLowerCase().trim();
    if (!val) return;
    const cmds = ['help','whoami','skills','experience','projects',
                  'contact','certifications','hire','neofetch','sudo','clear','exit'];
    const match = cmds.find(c => c.startsWith(val));
    if (match) {
      inputEl.value = match;
      syncCursor();
    }
  }

  /* ── BOOT SEQUENCE ──────────────────────────────────────────── */
  function getBootLines() {
    const data = pd();
    const skillCount = data ? data.skills.flatMap(s => s.items).length : '…';
    const projCount  = data ? data.projects.length : '…';
    const jobCount   = data ? data.experience.length : '…';
    return [
      g('  Suraj Kumar — Portfolio Terminal v1.0'),
      d('  ─────────────────────────────────────────────'),
      d('  Initialising environment…'),
      `  ${g('✓')} Loaded ${skillCount} skills`,
      `  ${g('✓')} Loaded ${projCount} projects`,
      `  ${g('✓')} Loaded ${jobCount} experience entries`,
      `  ${g('✓')} GitHub integration ready`,
      d('  ─────────────────────────────────────────────'),
      nl(),
      `  Welcome! Type ${y('help')} to see available commands.`,
      `  Type ${y('whoami')} to learn about me, or ${y('exit')} to close.`,
      nl(),
    ];
  }

  function boot() {
    if (outputEl) outputEl.innerHTML = '';
    inputLocked = true;
    const lines = getBootLines();
    let i = 0;
    function next() {
      if (i >= lines.length) {
        inputLocked = false;
        if (inputEl) { inputEl.value = ''; syncCursor(); inputEl.focus(); }
        scrollToBottom();
        return;
      }
      appendLine(lines[i] || '');
      i++;
      setTimeout(next, BOOT_DELAY);
    }
    next();
  }

  /* ── BUILD DOM ──────────────────────────────────────────────── */
  function buildDOM() {
    if (domBuilt) return;
    domBuilt = true;

    overlay = document.createElement('div');
    overlay.id = 'terminal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Interactive terminal');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div id="terminal-box">
        <div id="terminal-titlebar">
          <div class="t-traffic-lights">
            <button class="t-tl t-tl-close" aria-label="Close terminal"></button>
            <button class="t-tl t-tl-min"   aria-label="Minimise"></button>
            <button class="t-tl t-tl-max"   aria-label="Maximise" disabled></button>
          </div>
          <span class="t-title">suraj@portfolio: ~</span>
          <span class="t-hint">ESC or exit to close</span>
        </div>
        <div id="terminal-body">
          <div id="terminal-output"></div>
          <div id="terminal-input-row">
            <span id="terminal-prompt-live">${PROMPT}&nbsp;</span>
            <input id="terminal-input"
                   type="text"
                   autocomplete="off"
                   autocorrect="off"
                   autocapitalize="off"
                   spellcheck="false"
                   aria-label="Terminal input">
            <span id="terminal-cursor" aria-hidden="true"></span>
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    termBox  = overlay.querySelector('#terminal-body');
    outputEl = overlay.querySelector('#terminal-output');
    inputEl  = overlay.querySelector('#terminal-input');
    cursorEl = overlay.querySelector('#terminal-cursor');

    // Traffic lights
    overlay.querySelector('.t-tl-close').addEventListener('click', terminalClose);
    overlay.querySelector('.t-tl-min').addEventListener('click', terminalClose);

    // Click outside box → close
    overlay.addEventListener('click', e => {
      if (e.target === overlay) terminalClose();
    });

    // Input events
    inputEl.addEventListener('keydown', handleInputKey);
    inputEl.addEventListener('input', syncCursor);

    // Click body → focus input
    termBox.addEventListener('click', () => {
      if (!inputLocked) inputEl.focus();
    });

    // ESC on overlay
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') terminalClose();
    });
  }

  /* ── OPEN / CLOSE ───────────────────────────────────────────── */
  function terminalOpen() {
    if (isOpen) return;
    isOpen = true;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    history = [];
    historyIndex = -1;
    boot();
  }

  function terminalClose() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (inputEl) inputEl.value = '';
    keyBuffer = '';
  }

  /* ── GLOBAL KEYBOARD TRIGGERS ───────────────────────────────── */
  function initTriggers() {
    document.addEventListener('keydown', e => {
      if (e.key === '`' && !isOpen && !isInputFocused()) {
        e.preventDefault();
        terminalOpen();
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        terminalClose();
        return;
      }
      if (isOpen || isInputFocused()) return;

      if (e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > TRIGGER_WORD.length + 4) {
          keyBuffer = keyBuffer.slice(-(TRIGGER_WORD.length + 2));
        }
        clearTimeout(keyTimer);
        keyTimer = setTimeout(() => { keyBuffer = ''; }, 1500);
        if (keyBuffer.includes(TRIGGER_WORD)) {
          keyBuffer = '';
          terminalOpen();
        }
      }
    });
  }

  function isInputFocused() {
    const el  = document.activeElement;
    const tag = el && el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || (el && el.isContentEditable);
  }

  /* ── FOOTER HINT ────────────────────────────────────────────── */
  function injectFooterHint() {
    const footer = document.getElementById('footer-content');
    if (!footer) return;

    const tryInject = () => {
      if (document.getElementById('terminal-hint')) return;
      if (!footer.children.length) return;
      const hint = document.createElement('div');
      hint.id = 'terminal-hint';
      hint.innerHTML = `<button aria-label="Open terminal easter egg">
        <span class="t-hint-prompt">>&nbsp;</span>try the terminal
      </button>`;
      hint.querySelector('button').addEventListener('click', terminalOpen);
      footer.appendChild(hint);
    };

    tryInject();

    const observer = new MutationObserver(() => {
      tryInject();
      if (footer.children.length) observer.disconnect();
    });
    observer.observe(footer, { childList: true });
  }

  /* ── PUBLIC API ─────────────────────────────────────────────── */
  return {
    open:  terminalOpen,
    close: terminalClose,
    init() {
      buildDOM();
      initTriggers();
      injectFooterHint();
    },
  };

})();

/* ── AUTO-INIT ──────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTerminalWhenReady);
} else {
  initTerminalWhenReady();
}