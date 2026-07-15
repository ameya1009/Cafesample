/* ─── Main Entry Point: Loader + God Rays + Particle Rain ───────── */
(function () {

  /* ── Loader Animation ─────────────────────────────────────────── */
  const loaderRing = document.getElementById('loader-ring');
  const loader = document.getElementById('loader');

  // Animate loading ring
  let progress = 0;
  const circumference = 226;

  const loadInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 100);
    const offset = circumference - (progress / 100) * circumference;
    if (loaderRing) loaderRing.setAttribute('stroke-dashoffset', offset);

    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 400);
    }
  }, 80);

  /* ── Inject God-Ray Overlay ────────────────────────────────────── */
  const raysContainer = document.createElement('div');
  raysContainer.className = 'god-rays';
  document.body.appendChild(raysContainer);

  const rayPositions = [12, 22, 34, 48, 58, 68, 76];
  const rayAngles = [-15, -8, -20, -5, -12, -18, -7];
  const rayDurations = [4, 6, 5, 7, 4.5, 6.5, 5.5];

  rayPositions.forEach((left, i) => {
    const ray = document.createElement('div');
    ray.className = 'ray';
    ray.style.cssText = `
      left: ${left}%;
      transform: rotate(${rayAngles[i]}deg);
      animation-duration: ${rayDurations[i]}s;
      animation-delay: ${i * 0.4}s;
      opacity: ${0.2 + Math.random() * 0.4};
    `;
    raysContainer.appendChild(ray);
  });

  /* ── Particle Rain Canvas (lounge section) ─────────────────────── */
  const particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'particle-canvas';
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  document.body.appendChild(particleCanvas);

  const pCtx = particleCanvas.getContext('2d');
  const RAIN_COUNT = 80;

  const rainParticles = Array.from({ length: RAIN_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 1 + Math.random() * 2,
    speed: 0.3 + Math.random() * 0.6,
    opacity: 0.1 + Math.random() * 0.2,
    drift: (Math.random() - 0.5) * 0.3,
  }));

  function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    rainParticles.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;

      if (p.y > particleCanvas.height) {
        p.y = -10;
        p.x = Math.random() * particleCanvas.width;
      }
      if (p.x < 0 || p.x > particleCanvas.width) {
        p.x = Math.random() * particleCanvas.width;
      }

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(200, 150, 80, ${p.opacity})`;
      pCtx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  /* ── Window resize ─────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    rainParticles.forEach(p => {
      p.x = Math.random() * window.innerWidth;
      p.y = Math.random() * window.innerHeight;
    });
  });

  /* ── Add to Order micro-interaction ───────────────────────────── */
  const addBtn = document.getElementById('btn-add-cart');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const orig = addBtn.textContent;
      gsap.to(addBtn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
      addBtn.textContent = '✓ Added to Order';
      addBtn.style.background = 'hsl(140, 50%, 40%)';
      setTimeout(() => {
        addBtn.textContent = orig;
        addBtn.style.background = '';
      }, 2000);
    });
  }

  /* ── Smooth anchor scroll ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Hover labels for nav links ────────────────────────────────── */
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.dataset.cursorLabel = a.textContent;
  });

  console.log(
    '%cAURUM Coffee',
    'color: #c89650; font-size: 24px; font-family: Georgia, serif; font-weight: bold;'
  );
  console.log(
    '%cBuilt with Three.js · GSAP · Canvas API',
    'color: #7a5a2a; font-size: 12px;'
  );

})();
