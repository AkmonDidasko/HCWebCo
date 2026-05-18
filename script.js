/* ============================================================
   HC WEB CO. — JAVASCRIPT
   Navigation | Dark Mode | Scroll Effects | Animations | Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     DARK MODE TOGGLE
  ------------------------------------------------------- */
  const darkToggle = document.getElementById('dark-toggle');
  const htmlEl = document.documentElement;

  // Load saved preference or default to system preference
  const savedTheme = localStorage.getItem('hcwc-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  htmlEl.setAttribute('data-theme', initialTheme);
  updateToggleLabel(initialTheme);

  darkToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('hcwc-theme', next);
    updateToggleLabel(next);
  });

  function updateToggleLabel(theme) {
    darkToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }


  /* -------------------------------------------------------
     HAMBURGER MENU
  ------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }


  /* -------------------------------------------------------
     STICKY NAVBAR — scroll shadow
  ------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const navObserver = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-' + getNavHeight() + 'px 0px 0px 0px' }
  );

  // Observe the hero section to detect scroll past it
  const heroEl = document.getElementById('hero');
  if (heroEl) navObserver.observe(heroEl);

  function getNavHeight() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
  }


  /* -------------------------------------------------------
     ACTIVE NAV LINK — highlight current section
  ------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));


  /* -------------------------------------------------------
     FADE-IN ANIMATIONS (Intersection Observer)
  ------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  fadeEls.forEach(el => fadeObserver.observe(el));


  /* -------------------------------------------------------
     SMOOTH SCROLLING (with offset for fixed nav)
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = getNavHeight() + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* -------------------------------------------------------
     CONTACT FORM — Formspree
  ------------------------------------------------------- */
  const FORMSPREE_URL = 'https://formspree.io/f/mbdbjwqa';

  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    // Basic validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    if (!name) {
      showFieldError(form.name, 'Please enter your name.');
      valid = false;
    }

    if (!email || !isValidEmail(email)) {
      showFieldError(form.email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!message) {
      showFieldError(form.message, 'Please enter a message.');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        form.reset();
        showStatus('success', "Message sent! I'll be in touch shortly.");
      } else {
        const data = await res.json();
        const msg = data?.errors?.map(err => err.message).join(', ') || 'Something went wrong. Please try again.';
        showStatus('error', msg);
      }
    } catch {
      showStatus('error', 'Could not send your message. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(field, msg) {
    field.classList.add('error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'font-size:0.8rem;color:#ef4444;margin-top:-0.2rem;';
    err.textContent = msg;
    field.parentElement.appendChild(err);
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    formStatus.className = 'form-status';
    formStatus.textContent = '';
  }

  function showStatus(type, msg) {
    formStatus.className = 'form-status ' + type;
    formStatus.textContent = msg;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }


  /* -------------------------------------------------------
     FOOTER YEAR
  ------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
