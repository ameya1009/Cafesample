/* ─── GSAP Scroll-triggered Camera Animation ─────────────────────── */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  /* Camera path: array of {position, target, fov} waypoints */
  const waypoints = [
    // 0 — Hero: Looking at espresso machine, warmly
    {
      pos: { x: 0, y: 1.5, z: 6 },
      target: { x: -0.3, y: 1.1, z: 0 },
      fov: 55,
    },
    // 1 — Origins: Pull back and pan left, looking at origin wall
    {
      pos: { x: -3.5, y: 2.5, z: 5 },
      target: { x: -1, y: 1.5, z: -2 },
      fov: 60,
    },
    // 2 — Menu: Swoop down toward counter, close-up on cup
    {
      pos: { x: 1, y: 1.3, z: 3 },
      target: { x: 0.5, y: 1.1, z: 0 },
      fov: 45,
    },
    // 3 — Lounge: Wide ambient pull back, top-down angle
    {
      pos: { x: 2, y: 4.5, z: 7 },
      target: { x: 0, y: 0.5, z: 0 },
      fov: 65,
    },
  ];

  const cam = window._camera;
  if (!cam) return;

  // Helper: set camera to look at a target
  const camTarget = new THREE.Vector3();
  function setCameraTarget(t) {
    camTarget.set(t.x, t.y, t.z);
    cam.lookAt(camTarget);
  }

  // Initial position
  setCameraTarget(waypoints[0].target);

  /* ── Smooth scroll-driven camera interpolation ─────────────────── */
  const sections = ['#hero', '#origins', '#menu', '#lounge'];

  sections.forEach((selector, i) => {
    const next = waypoints[Math.min(i + 1, waypoints.length - 1)];
    const curr = waypoints[i];
    const el = document.querySelector(selector);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2.5,
      onUpdate: (self) => {
        const p = self.progress;
        const eased = gsap.parseEase('power2.inOut')(p);

        cam.position.x = THREE.MathUtils.lerp(curr.pos.x, next.pos.x, eased);
        cam.position.y = THREE.MathUtils.lerp(curr.pos.y, next.pos.y, eased);
        cam.position.z = THREE.MathUtils.lerp(curr.pos.z, next.pos.z, eased);

        const tx = THREE.MathUtils.lerp(curr.target.x, next.target.x, eased);
        const ty = THREE.MathUtils.lerp(curr.target.y, next.target.y, eased);
        const tz = THREE.MathUtils.lerp(curr.target.z, next.target.z, eased);
        cam.lookAt(tx, ty, tz);

        cam.fov = THREE.MathUtils.lerp(curr.fov, next.fov, eased);
        cam.updateProjectionMatrix();
      },
    });
  });

  /* ── Navbar scroll effect ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -80px',
    end: 99999,
    onUpdate: (self) => {
      navbar.classList.toggle('scrolled', self.progress > 0);
    },
  });

  /* ── Subtle mouse parallax on camera ──────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 0.15;
    const my = (e.clientY / window.innerHeight - 0.5) * 0.08;
    gsap.to(cam.position, {
      x: cam.position.x + mx * 0.3,
      y: cam.position.y - my * 0.3,
      duration: 2,
      ease: 'power1.out',
      overwrite: 'auto',
    });
  });
})();
