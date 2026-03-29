// ============================================================
//  DEFINED CAR DETAILING — Interactions & Animations
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  //  NAVBAR — transparent → solid on scroll
  // ============================================================

  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    if (isOpen) {
      s1.style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
      s2.style.opacity   = '0';
      s3.style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
    } else {
      s1.style.transform = s2.style.opacity = s3.style.transform = '';
    }
  });

  // Close mobile menu on link click
  navMobile.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });

  // ============================================================
  //  HERO PARALLAX
  // ============================================================

  const heroBg = document.getElementById('heroBg');

  window.addEventListener('scroll', () => {
    if (!heroBg) return;
    heroBg.style.transform = `translateY(${window.scrollY * 0.38}px)`;
  }, { passive: true });

  // ============================================================
  //  HERO ENTRANCE ANIMATIONS — fire immediately
  // ============================================================

  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.classList.add('revealed');
    });
  }, 80);

  // ============================================================
  //  SCROLL REVEAL — Intersection Observer
  // ============================================================

  const revealEls = document.querySelectorAll(
    '.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ============================================================
  //  BEFORE / AFTER SLIDERS
  // ============================================================

  const sliderDefs = [
    { wrap: 'baSlider1', before: 'baBefore1', handle: 'baHandle1' },
    { wrap: 'baSlider2', before: 'baBefore2', handle: 'baHandle2' },
    { wrap: 'baSlider3', before: 'baBefore3', handle: 'baHandle3' },
  ];

  sliderDefs.forEach(({ wrap, before, handle }) => {
    const wrapEl   = document.getElementById(wrap);
    const beforeEl = document.getElementById(before);
    const handleEl = document.getElementById(handle);
    if (!wrapEl || !beforeEl || !handleEl) return;

    let dragging = false;

    const move = (clientX) => {
      const { left, width } = wrapEl.getBoundingClientRect();
      const pct = Math.max(2, Math.min(98, ((clientX - left) / width) * 100));
      beforeEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handleEl.style.left     = `${pct}%`;
    };

    // Mouse
    wrapEl.addEventListener('mousedown', e => { dragging = true; move(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) move(e.clientX); });
    window.addEventListener('mouseup',   () => { dragging = false; });

    // Touch
    wrapEl.addEventListener('touchstart', e => { dragging = true; move(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove',  e => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend',   () => { dragging = false; });
  });

  // ============================================================
  //  CONTACT FORM — simple feedback
  // ============================================================

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;

      btn.textContent    = 'Anfrage gesendet';
      btn.style.background = '#1d4d2e';
      btn.style.color      = '#6fcf97';
      btn.disabled         = true;

      setTimeout(() => {
        btn.textContent      = orig;
        btn.style.background = '';
        btn.style.color      = '';
        btn.disabled         = false;
        form.reset();
      }, 4000);
    });
  }

  // ============================================================
  //  SMOOTH SCROLL for anchor links
  // ============================================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      if (href === '#' || href === '#impressum' || href === '#datenschutz') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    });
  });

  // ============================================================
  //  MOBILE STICKY CTA — hide in hero & contact sections
  // ============================================================

  const mobileCta     = document.getElementById('mobileCta');
  const heroSection   = document.getElementById('hero');
  const contactSection = document.getElementById('kontakt');

  if (mobileCta) {
    const hide = () => { mobileCta.style.opacity = '0'; mobileCta.style.pointerEvents = 'none'; };
    const show = () => { mobileCta.style.opacity = '1'; mobileCta.style.pointerEvents = ''; };

    const ctaObs = new IntersectionObserver((entries) => {
      const anyVisible = entries.some(e => e.isIntersecting);
      anyVisible ? hide() : show();
    }, { threshold: 0.2 });

    if (heroSection)    ctaObs.observe(heroSection);
    if (contactSection) ctaObs.observe(contactSection);
  }

});
