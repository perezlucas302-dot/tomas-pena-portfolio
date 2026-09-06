// ============================================
// TOMAS PEÑA — main.js
// ============================================

/* ---- Siempre arrancar arriba en un refresh ----
   Por default, el navegador restaura el scroll donde quedó antes de
   recargar. Con secciones con animación ligada al scroll (como
   "Proyecto destacado" más abajo) eso puede mostrar el sitio a mitad de
   una transición antes de que el usuario vuelva a moverse. Se apaga esa
   restauración automática y se fuerza el scroll a 0 en cada carga. */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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

  /* ---- View Transitions: conecta cada thumbnail con su página de proyecto ----
     Le da el mismo view-transition-name a la card (en home / listado) y al
     frame de media (en la página del proyecto), para que el navegador anime
     una "crece hacia" la otra en vez de solo cross-fadear todo el documento.
     Si el navegador no soporta View Transitions, esto no hace nada visible. */
  if ('startViewTransition' in document) {
    const slugFromHref = (href) => {
      try {
        return new URL(href, location.href).pathname.split('/').pop().replace('.html', '');
      } catch { return null; }
    };

    document.querySelectorAll('.work-card:not(.work-card--teaser)').forEach((card) => {
      const slug = slugFromHref(card.getAttribute('href'));
      const frame = card.querySelector('.work-card__frame');
      if (slug && frame) frame.style.viewTransitionName = `vt-${slug}`;
    });

    const mediaFrame = document.querySelector('.project-media__frame');
    if (mediaFrame) {
      const slug = location.pathname.split('/').pop().replace('.html', '');
      if (slug) mediaFrame.style.viewTransitionName = `vt-${slug}`;
    }
  }

  /* ---- Work cards: cursor "REC" + preview de video al pasar el mouse (desktop) ----
     Un solo cursor custom (círculo con el rec-dot + "Ver") sigue al mouse y
     se activa al entrar a una card; al mismo tiempo, crea el <video> liviano
     de preview y lo cruza con la portada. Todo comparte el mismo listener
     de hover para no duplicar trabajo. En touch/mobile no se activa nada de
     esto: se queda con la imagen estática y el cursor normal del sistema. */
  const canHoverVideo = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHoverVideo) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-rec';
    cursor.innerHTML = '<span class="rec-dot"></span><span class="cursor-rec__label">Ver</span>';
    document.body.appendChild(cursor);

    let cx = -100, cy = -100, cursorScale = 0.6;
    const renderCursor = () => {
      cursor.style.transform = `translate3d(${cx - 34}px, ${cy - 34}px, 0) scale(${cursorScale})`;
    };
    window.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      renderCursor();
    }, { passive: true });

    document.querySelectorAll('.work-card:not(.work-card--teaser)').forEach((card) => {
      const frame = card.querySelector('.work-card__frame');
      if (!frame) return;

      let slug;
      try {
        slug = new URL(card.getAttribute('href'), location.href).pathname.split('/').pop().replace('.html', '');
      } catch { return; }
      if (!slug) return;

      const video = document.createElement('video');
      video.className = 'work-card__preview';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      video.innerHTML = `<source src="/assets/video/hover/${slug}-hover.mp4" type="video/mp4">`;
      frame.appendChild(video);

      video.addEventListener('playing', () => card.classList.add('is-previewing'));

      let playPromise = null;
      card.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        playPromise = video.play().catch(() => {});
        cursor.classList.add('is-active');
        cursorScale = 1;
        renderCursor();
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-previewing');
        // Esperamos a que play() termine de resolver antes de pausar: si se
        // llama pause() mientras play() todavía está en curso (muy común en
        // grids densos, donde el mouse cruza varias cards rápido), el video
        // puede quedar "trabado" sin volver a reproducirse nunca.
        Promise.resolve(playPromise).finally(() => video.pause());
        cursor.classList.remove('is-active');
        cursorScale = 0.6;
        renderCursor();
      });
    });
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

/* ============================================
   PROYECTO DESTACADO — scroll cinematográfico
   ============================================ */
(function () {
  const featured = document.getElementById('featured');
  if (!featured) return;

  const media = featured.querySelector('.featured__media');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !media) return;

  let ticking = false;
  function update() {
    const rect = featured.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    media.style.setProperty('--fscale', (1 + progress * 0.1).toFixed(3));
    featured.classList.toggle('is-beat-2', progress > 0.3);
    featured.classList.toggle('is-beat-3', progress > 0.62);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();