/**
 * AURUM Cafe - Main Application Logic
 * Integrates GSAP ScrollTrigger, Custom Cursor, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  initLoader();
  initCursor();
  initNav();
  initHeroAnimations();
  initScrollReveals();
  initHUD();
  initNumberCounters();
});

// ── 1. Loader ───────────────────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loader-fill');
  
  // Simulate loading progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    fill.style.width = `${progress}%`;
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        playHeroSequence();
      }, 500);
    }
  }, 100);
}

// ── 2. Custom Cursor ────────────────────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia("(hover: none)").matches) return; // disable on touch

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const render = () => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // Add hover states to interactable elements
  const hoverElements = document.querySelectorAll('a, button, input, select, .menu-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── 3. Navigation ───────────────────────────────────────────────────
function initNav() {
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if(targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ── 4. Hero Animations ──────────────────────────────────────────────
function playHeroSequence() {
  const tl = gsap.timeline();
  
  tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    .to('.hero-headline .line', { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      stagger: 0.2, 
      ease: 'power3.out' 
    }, "-=0.4")
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.6")
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.6")
    .to('.scroll-cue', { opacity: 1, duration: 1 }, "-=0.2")
    .to('#hero-hud', { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, "-=0.5");
}

function initHeroAnimations() {
  // Parallax effect on hero background video wrapper
  gsap.to('#hero-video-wrap', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}

// ── 5. Scroll Reveals ───────────────────────────────────────────────
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-el');
  
  revealElements.forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // trigger when top of element is 85% down the viewport
        toggleActions: "play none none reverse"
      }
    });
  });
}

// ── 6. HUD Cycling ──────────────────────────────────────────────────
function initHUD() {
  const roasts = ["Yirgacheffe Natural", "Kenya AA Washed", "Brazil Cerrado", "Colombia Supremo"];
  const roastEl = document.getElementById('hud-roast');
  let i = 0;
  
  if(roastEl) {
    setInterval(() => {
      i = (i + 1) % roasts.length;
      roastEl.style.opacity = 0;
      setTimeout(() => {
        roastEl.textContent = roasts[i];
        roastEl.style.opacity = 1;
      }, 300);
    }, 4000);
  }
}

// ── 7. Number Counters ──────────────────────────────────────────────
function initNumberCounters() {
  const stats = document.querySelectorAll('.stat-n');
  
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    
    ScrollTrigger.create({
      trigger: stat,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(stat, {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          onUpdate: function() {
            stat.innerHTML = Math.round(this.targets()[0].innerHTML);
          }
        });
      }
    });
  });
}

// ── 8. Form Handling ────────────────────────────────────────────────
window.handleRes = function(e) {
  e.preventDefault();
  const form = document.getElementById('res-form');
  const success = document.getElementById('res-success');
  const btn = document.getElementById('btn-confirm');
  
  btn.textContent = "Processing...";
  btn.style.opacity = 0.5;
  
  setTimeout(() => {
    form.style.display = 'none';
    success.removeAttribute('hidden');
    
    gsap.fromTo(success, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, 1000);
};

// Stepper logic
document.addEventListener('DOMContentLoaded', () => {
  const gMinus = document.getElementById('g-minus');
  const gPlus = document.getElementById('g-plus');
  const gCount = document.getElementById('g-count');
  
  if(gMinus && gPlus && gCount) {
    let count = 2;
    gMinus.addEventListener('click', () => { if(count > 1) gCount.textContent = --count; });
    gPlus.addEventListener('click', () => { if(count < 8) gCount.textContent = ++count; });
  }
});
