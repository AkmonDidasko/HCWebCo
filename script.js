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
     FOOTER YEAR
  ------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

