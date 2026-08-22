/* ═══════════════════════════════════════════════════════════════
   CONTACT.JS — Contact form handling with EmailJS (free tier).
   To activate: sign up at emailjs.com, replace the three IDs
   below, then set EMAILJS_ENABLED = true.
   ═══════════════════════════════════════════════════════════════ */

const ContactForm = (() => {

  /* ── CONFIG — Replace these with your EmailJS credentials ──── */
  const EMAILJS_ENABLED   = true;
  const EMAILJS_PUBLIC_KEY = 'fUBHIMrNbjcNh_1uA';
  const EMAILJS_SERVICE_ID = 'service_7wgf03b';
  const EMAILJS_TEMPLATE_ID = 'template_fiqkz1l';

  /* ── STATE ─────────────────────────────────────────────────── */
  let form, submitBtn, statusEl;
  let isSubmitting = false;

  /* ── VALIDATION ────────────────────────────────────────────── */
  function validate(data) {
    const errors = [];
    if (!data.name.trim() || data.name.trim().length < 2)
      errors.push('Please enter your name (at least 2 characters).');
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.push('Please enter a valid email address.');
    if (!data.subject.trim() || data.subject.trim().length < 3)
      errors.push('Please enter a subject.');
    if (!data.message.trim() || data.message.trim().length < 15)
      errors.push('Message must be at least 15 characters.');
    return errors;
  }

  /* ── STATUS DISPLAY ────────────────────────────────────────── */
  function setStatus(msg, type = '') {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + type;
  }

  function setLoading(loading) {
    isSubmitting = loading;
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? 'Sending…' : 'Send Message';
  }

  /* ── EMAILJS SEND ──────────────────────────────────────────── */
  async function sendViaEmailJS(data) {
    // Load EmailJS SDK lazily
    if (!window.emailjs) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:    data.name,
      from_email:   data.email,
      subject:      data.subject,
      message:      data.message,
      reply_to:     data.email,
      to_name:      'Suraj',
    });
  }

  /* ── FALLBACK: mailto ──────────────────────────────────────── */
  function sendViaMailto(data) {
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    );
    const subject = encodeURIComponent(data.subject);
    window.open(`mailto:surajkumar11292@gmail.com?subject=${subject}&body=${body}`, '_blank');
  }

  /* ── SUBMIT HANDLER ────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const data = {
      name:    form.querySelector('#contact-name')?.value    || '',
      email:   form.querySelector('#contact-email')?.value   || '',
      subject: form.querySelector('#contact-subject')?.value || '',
      message: form.querySelector('#contact-message')?.value || '',
    };

    const errors = validate(data);
    if (errors.length) {
      setStatus(errors[0], 'error');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      if (EMAILJS_ENABLED) {
        await sendViaEmailJS(data);
        setStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
        UI.Toast.show('Message sent successfully!', '✓');
      } else {
        // Dev mode — open mailto as fallback
        sendViaMailto(data);
        setStatus('Opening your email client…', 'success');
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (err) {
      console.error('Form send error:', err);
      setStatus('Something went wrong. Try emailing directly.', 'error');
      // Fallback to mailto
      sendViaMailto(data);
    } finally {
      setLoading(false);
    }
  }

  /* ── REAL-TIME VALIDATION ──────────────────────────────────── */
  function attachInputListeners() {
    form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('blur', () => {
        input.classList.toggle(
          'invalid',
          input.required && !input.value.trim()
        );
      });
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
        setStatus('');
      });
    });
  }

  /* ── INIT ───────────────────────────────────────────────────── */
  return {
    init() {
      form = document.getElementById('contact-form');
      if (!form) return;
      submitBtn = form.querySelector('#contact-submit');
      statusEl  = form.querySelector('#contact-status');
      form.addEventListener('submit', handleSubmit);
      attachInputListeners();
    }
  };
})();
