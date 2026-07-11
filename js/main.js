// ============================================
// TOMÁS PEÑA — main.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Nav: background on scroll ---- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Nav: mobile toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Typewriter: "Hablemos." on scroll into view ---- */
  const hablemosTitle = document.getElementById('hablemosTitle');
  if (hablemosTitle) {
    const textEl = hablemosTitle.querySelector('.contact__title-text');
    const fullText = 'Hablemos.';

    const typeWriter = (el, text, speed = 75) => {
      let i = 0;
      el.textContent = '';
      const timer = setInterval(() => {
        el.textContent += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(timer);
      }, speed);
    };

    if ('IntersectionObserver' in window) {
      const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter(textEl, fullText);
            titleObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      titleObserver.observe(hablemosTitle);
    } else {
      textEl.textContent = fullText;
    }
  }

  /* ---- Autoplay Videos on Scroll ---- */
  const videos = document.querySelectorAll('.video-on-scroll');
  if ('IntersectionObserver' in window && videos.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // El video entra en pantalla: intenta darle play
          entry.target.play().catch(err => console.warn("Auto-play prevenido por el navegador:", err));
        } else {
          // El video sale de la pantalla: lo pausa
          entry.target.pause();
        }
      });
    }, { threshold: 0.5 }); // 0.5 = Arranca cuando el 50% del video es visible

    videos.forEach(video => videoObserver.observe(video));
  }

  /* ---- Live clock: Paraná / Buenos Aires (America/Argentina/Cordoba, UTC-3) ---- */
  const clockEl = document.getElementById('clock');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Cordoba',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      clockEl.textContent = formatted;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

});