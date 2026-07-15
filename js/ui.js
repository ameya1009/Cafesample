/* ─── UI: Counters, Reveals, Guest Stepper, Reservation ─────────── */
(function () {
  /* ── Animated Counters ───────────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterEls.forEach(el => counterObserver.observe(el));

  /* ── Section Reveal Animations ───────────────────────────────── */
  const revealTargets = [
    // [selector, delay]
    ['#hero-tag', 0.2],
    ['.hero-headline .line:nth-child(1)', 0.4],
    ['.hero-headline .line:nth-child(2)', 0.55],
    ['.hero-headline .line:nth-child(3)', 0.7],
    ['#hero-sub', 0.85],
    ['#hero-actions', 1.0],
    ['#scroll-indicator', 1.2],
  ];

  revealTargets.forEach(([sel, delay]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
    });
  });

  /* ── Origin HUD fade in after load ──────────────────────────── */
  setTimeout(() => {
    const hud = document.getElementById('origin-hud');
    if (hud) {
      hud.classList.add('visible');
      // Update date
      const dateEl = document.getElementById('hud-date');
      if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
  }, 1500);

  /* ── Cycle origin names in HUD ───────────────────────────────── */
  const origins = ['Yirgacheffe, ETH', 'Mount Kenya, KE', 'Cerrado, BRA', 'Huila, COL', 'Aceh, IDN'];
  let originIdx = 0;
  const originEl = document.getElementById('hud-origin');
  if (originEl) {
    setInterval(() => {
      originIdx = (originIdx + 1) % origins.length;
      gsap.to(originEl, { opacity: 0, duration: 0.3, onComplete: () => {
        originEl.textContent = origins[originIdx];
        gsap.to(originEl, { opacity: 1, duration: 0.4 });
      }});
    }, 4000);
  }

  /* ── Scroll-triggered content reveals ───────────────────────── */
  const revealGroups = [
    {
      trigger: '#origins',
      items: [
        { sel: '#origins-eyebrow', delay: 0 },
        { sel: '#origins-headline', delay: 0.15 },
        { sel: '#origins-body', delay: 0.3 },
        { sel: '#origin-stats', delay: 0.45 },
        { sel: '#map-canvas', delay: 0.2 },
      ]
    },
    {
      trigger: '#menu',
      items: [
        { sel: '#menu-eyebrow', delay: 0 },
        { sel: '#menu-headline', delay: 0.15 },
        { sel: '#product-3d-wrap', delay: 0.1 },
        { sel: '#product-info-panel', delay: 0.3 },
      ]
    },
    {
      trigger: '#lounge',
      items: [
        { sel: '#lounge-eyebrow', delay: 0 },
        { sel: '#lounge-headline', delay: 0.15 },
        { sel: '#lounge-grid', delay: 0.3 },
      ]
    },
  ];

  revealGroups.forEach(group => {
    ScrollTrigger.create({
      trigger: group.trigger,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        group.items.forEach(item => {
          const el = document.querySelector(item.sel);
          if (!el) return;
          gsap.to(el, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            delay: item.delay,
            ease: 'power3.out',
          });
        });
      }
    });
  });

  // Origin cards stagger
  ScrollTrigger.create({
    trigger: '#origin-cards',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to('.origin-card', {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      });
    }
  });

  /* ── Guest Stepper ───────────────────────────────────────────── */
  let guestCount = 2;
  const guestDisplay = document.getElementById('guest-count');
  const minusBtn = document.getElementById('guest-minus');
  const plusBtn = document.getElementById('guest-plus');

  if (minusBtn && plusBtn && guestDisplay) {
    minusBtn.addEventListener('click', () => {
      if (guestCount > 1) {
        guestCount--;
        guestDisplay.textContent = guestCount;
        gsap.from(guestDisplay, { y: 8, opacity: 0, duration: 0.2 });
      }
    });

    plusBtn.addEventListener('click', () => {
      if (guestCount < 12) {
        guestCount++;
        guestDisplay.textContent = guestCount;
        gsap.from(guestDisplay, { y: -8, opacity: 0, duration: 0.2 });
      }
    });
  }
})();

/* ── Reservation form handler (global) ──────────────────────────── */
function handleReservation(e) {
  e.preventDefault();
  const form = document.getElementById('reservation-form');
  const success = document.getElementById('reservation-success');

  gsap.to(form, {
    opacity: 0,
    y: -20,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      form.hidden = true;
      success.hidden = false;
      gsap.from(success, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' });
    }
  });
}
