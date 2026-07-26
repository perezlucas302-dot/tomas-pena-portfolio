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

/* ============================================
   SERVICIOS — acordeón (tap/click, uno abierto a la vez)
   ============================================ */
(function () {
  const rows = document.querySelectorAll('.service-row');
  if (!rows.length) return;

  const closeRow = (row) => {
    row.classList.remove('is-open');
    const t = row.querySelector('.service-row__trigger');
    if (t) t.setAttribute('aria-expanded', 'false');
    const panel = row.querySelector('.service-row__panel');
    if (panel) panel.style.maxHeight = '0px';
    const v = row.querySelector('video');
    if (v) v.pause();
  };

  const openRow = (row) => {
    row.classList.add('is-open');
    const t = row.querySelector('.service-row__trigger');
    if (t) t.setAttribute('aria-expanded', 'true');
    const panel = row.querySelector('.service-row__panel');
    const content = row.querySelector('.service-row__panel-content');
    if (panel && content) panel.style.maxHeight = content.offsetHeight + 'px';
    const video = row.querySelector('video');
    if (video) {
      video.preload = 'auto';
      video.play().catch(() => {});
    }
  };

  rows.forEach((row) => {
    const trigger = row.querySelector('.service-row__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const wasOpen = row.classList.contains('is-open');
      rows.forEach(closeRow);
      if (!wasOpen) openRow(row);
    });
  });

  // Si la ventana cambia de tamaño con un panel abierto, recalcula el alto
  // (evita que el texto quede cortado si el reflow cambia la altura del contenido).
  window.addEventListener('resize', () => {
    const openRowEl = document.querySelector('.service-row.is-open');
    if (!openRowEl) return;
    const panel = openRowEl.querySelector('.service-row__panel');
    const content = openRowEl.querySelector('.service-row__panel-content');
    if (panel && content) panel.style.maxHeight = content.offsetHeight + 'px';
  });
})();

/* ============================================
   COLOR GRADING — comparador antes/después (drag)
   ============================================ */
(function () {
  const compares = document.querySelectorAll('[data-compare]');
  if (!compares.length) return;

  compares.forEach((el) => {
    const handle = el.querySelector('.compare__handle');
    let dragging = false;

    const setPos = (clientX) => {
      const rect = el.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.min(100, Math.max(0, pct));
      el.style.setProperty('--pos', pct + '%');
      if (handle) handle.style.left = pct + '%';
    };

    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    el.addEventListener('pointermove', (e) => {
      if (dragging) setPos(e.clientX);
    });
    el.addEventListener('pointerup', () => { dragging = false; });
    el.addEventListener('pointercancel', () => { dragging = false; });
  });
})();