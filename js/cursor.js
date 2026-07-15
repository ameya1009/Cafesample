/* ─── Custom Cursor ──────────────────────────────────────────────── */
(function () {
  const cursor = document.getElementById('cursor');
  const ring = cursor.querySelector('.cursor-ring');
  const dot = cursor.querySelector('.cursor-dot');
  const label = cursor.querySelector('.cursor-label');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    label.style.left = ringX + 'px';
    label.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects
  const hoverEls = document.querySelectorAll('a, button, .prod-tab, .origin-card, input, select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      const l = el.dataset.cursorLabel || el.getAttribute('aria-label') || '';
      if (l) label.textContent = l;
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      label.textContent = '';
    });
  });

  // Tamp on product canvas
  const productCanvas = document.getElementById('product-canvas');
  if (productCanvas) {
    productCanvas.addEventListener('mouseenter', () => {
      ring.style.borderRadius = '0';
      ring.style.width = '28px';
      ring.style.height = '28px';
    });
    productCanvas.addEventListener('mouseleave', () => {
      ring.style.borderRadius = '50%';
      ring.style.width = '';
      ring.style.height = '';
    });
  }
})();
