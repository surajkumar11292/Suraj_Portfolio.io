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

  /* ── DIRECT EMAIL SEND (Delivers to surajkumar11292@gmail.com) ──── */
  async function sendDirectToEmail(data) {
    const response = await fetch('https://formsubmit.co/ajax/surajkumar11292@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        _replyto: data.email,
        _subject: `New Message from ${data.name} via Portfolio: ${data.subject}`,
        subject: data.subject,
        message: data.message,
        _captcha: 'false',
        _template: 'table',
      }),
    });

    const result = await response.json();
    if (!response.ok || (result.success !== 'true' && result.success !== true && !result.message?.includes('success'))) {
      throw new Error(result.message || 'Failed to deliver message.');
    }
    return result;
  }

  /* ── FALLBACK: Direct Gmail Compose ───────────────────────── */
  function sendViaMailto(data) {
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    );
    const subject = encodeURIComponent(`Portfolio Message: ${data.subject}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=surajkumar11292@gmail.com&su=${subject}&body=${body}`, '_blank');
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
      await sendDirectToEmail(data);
      setStatus('✓ Message delivered directly to Suraj\'s inbox! I\'ll get back to you soon.', 'success');
      form.reset();
      if (typeof UI !== 'undefined' && UI.Toast) {
        UI.Toast.show('Message delivered successfully!', '✓');
      }
    } catch (err) {
      console.warn('Direct delivery fallback triggered:', err);
      // Fallback: open Gmail compose
      sendViaMailto(data);
      setStatus('Opening Gmail to send your message directly…', 'success');
      setTimeout(() => setStatus(''), 4000);
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
