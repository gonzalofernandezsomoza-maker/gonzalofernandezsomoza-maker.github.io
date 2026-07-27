/* JMMGFS — main.js */

/* ============================================================
   HERO SLIDER — syncs text area above with each slide
   ============================================================ */
(function () {
  const slides    = document.querySelectorAll('.hero-slider .slide');
  const dots      = document.querySelectorAll('.dot');
  const tagEl     = document.getElementById('tag-text');
  const headlineEl = document.getElementById('hero-headline');
  const descEl    = document.getElementById('hero-desc');
  let current = 0;
  let timer   = null;

  function updateText(idx) {
    const s = slides[idx];
    if (tagEl) tagEl.innerHTML = s.dataset.tag || '';
    if (headlineEl) headlineEl.innerHTML = s.dataset.headline
      ? s.dataset.headline.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
    if (descEl) descEl.textContent = s.dataset.desc || '';
  }

  function goTo(idx) {
    const prevVideo = slides[current].querySelector('video');
    if (prevVideo) prevVideo.pause();
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    const nextVideo = slides[current].querySelector('video');
    if (nextVideo) { nextVideo.currentTime = 0; nextVideo.play(); }
    updateText(current);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { timer = setInterval(next, 5500); }
  function resetAuto() { clearInterval(timer); startAuto(); }

  if (slides.length) {
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

    const btnNext = document.getElementById('hero-next');
    const btnPrev = document.getElementById('hero-prev');
    if (btnNext) btnNext.addEventListener('click', () => { next(); resetAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { prev(); resetAuto(); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    });

    let touchStartX = 0;
    const sliderEl = document.querySelector('.hero-slider');
    if (sliderEl) {
      sliderEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
      sliderEl.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); resetAuto(); }
      });
    }

    startAuto();
  }
})();

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function toggle() {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ============================================================
   NAV SCROLL
   ============================================================ */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav')?.offsetHeight || 60;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ============================================================
   SECTOR BARS — animate on scroll entry
   ============================================================ */
(function () {
  const fills = document.querySelectorAll('.sec-bar-fill');
  if (!fills.length) return;
  if (!('IntersectionObserver' in window)) {
    fills.forEach(f => f.classList.add('animated'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach((f, i) => {
    f.style.transitionDelay = `${i * 0.08}s`;
    io.observe(f);
  });
})();

/* ============================================================
   FADE-IN ON SCROLL
   ============================================================ */
(function () {
  const els = document.querySelectorAll('.svc-item, .sec-item, .paso, .partner, .feat');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.style.opacity = 1); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  els.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(14px)';
    el.style.transition = `opacity .45s ease ${(i % 6) * 0.06}s, transform .45s ease ${(i % 6) * 0.06}s`;
    io.observe(el);
  });
})();
