/* ─── 3D Product Viewer (Interactive Coffee Bag) ────────────────── */
(function () {
  const canvas = document.getElementById('product-canvas');
  if (!canvas) return;

  const wrap = document.getElementById('product-3d-wrap');
  const W = wrap.clientWidth || 500;
  const H = wrap.clientHeight || 500;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 50);
  camera.position.set(0, 0, 4.5);

  /* ── Lighting ────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0x1a0d05, 2));

  const key = new THREE.DirectionalLight(0xffd090, 4);
  key.position.set(3, 5, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x4a60a0, 1.5);
  fill.position.set(-3, 2, -2);
  scene.add(fill);

  const rimL = new THREE.PointLight(0xc87830, 3, 10, 2);
  rimL.position.set(-2, 1, 3);
  scene.add(rimL);

  /* ── Coffee Bag Geometry ─────────────────────────────────────── */
  const products = [
    {
      name: 'Yirgacheffe Natural',
      origin: 'Ethiopia · 1,950m Altitude',
      notes: ['Blueberry', 'Jasmine', 'Dark Chocolate'],
      roast: 35,
      price: '$24 / 250g',
      color: 0x2a5c3a,      // deep forest green
      accent: 0xd4a24a,
    },
    {
      name: 'Kenya AA',
      origin: 'Kenya · Mount Kenya · 1,700m',
      notes: ['Blackcurrant', 'Tomato', 'Cedar'],
      roast: 45,
      price: '$28 / 250g',
      color: 0x1a1a3a,      // deep navy
      accent: 0xe85a2a,
    },
    {
      name: 'House Blend',
      origin: 'Multi-Origin Blend · Seasonal',
      notes: ['Caramel', 'Hazelnut', 'Milk Chocolate'],
      roast: 65,
      price: '$18 / 250g',
      color: 0x3a1a0a,      // mahogany
      accent: 0xf0c060,
    },
  ];

  let currentProduct = 0;
  let bagGroup = new THREE.Group();
  scene.add(bagGroup);

  function buildBag(prodIdx) {
    // Clear old bag
    while (bagGroup.children.length > 0) {
      const c = bagGroup.children[0];
      c.geometry && c.geometry.dispose();
      c.material && c.material.dispose();
      bagGroup.remove(c);
    }

    const prod = products[prodIdx];

    // Main bag body (rounded box via CylinderGeometry trick)
    const bagGeo = new THREE.BoxGeometry(1.0, 1.7, 0.45, 1, 1, 1);
    const bagMat = new THREE.MeshStandardMaterial({
      color: prod.color,
      roughness: 0.55,
      metalness: 0.05,
    });
    const bag = new THREE.Mesh(bagGeo, bagMat);
    bag.castShadow = true;
    bagGroup.add(bag);

    // Label strip
    const labelGeo = new THREE.PlaneGeometry(0.88, 0.9);
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512; labelCanvas.height = 512;
    const ctx = labelCanvas.getContext('2d');

    // Label background
    ctx.fillStyle = '#f5edd8';
    ctx.fillRect(0, 0, 512, 512);

    // Decorative line
    ctx.strokeStyle = '#c89640';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 472);

    // Brand name
    ctx.fillStyle = '#1a0d05';
    ctx.font = 'bold 52px serif';
    ctx.textAlign = 'center';
    ctx.fillText('AURUM', 256, 90);

    // Product name
    ctx.fillStyle = '#5a3a0a';
    ctx.font = '28px serif';
    ctx.fillText(prod.name, 256, 140);

    // Divider
    ctx.strokeStyle = '#c89640';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 160); ctx.lineTo(432, 160);
    ctx.stroke();

    // Bean illustration (simple circle composition)
    ctx.fillStyle = '#3d1a05';
    for (let b = 0; b < 7; b++) {
      const bx = 150 + b * 30 + Math.sin(b) * 8;
      const by = 230 + Math.cos(b * 1.3) * 20;
      ctx.beginPath();
      ctx.ellipse(bx, by, 12, 18, b * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Origin text
    ctx.fillStyle = '#7a5a2a';
    ctx.font = '22px sans-serif';
    ctx.fillText(prod.origin, 256, 330);

    // Notes
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#3a2a0a';
    ctx.fillText(prod.notes.join(' · '), 256, 370);

    // Weight
    ctx.fillStyle = '#c89640';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('250g', 256, 450);

    const tex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.9,
      metalness: 0.0,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.z = 0.228;
    bagGroup.add(label);

    // Top seal (folded top)
    const sealGeo = new THREE.BoxGeometry(1.02, 0.22, 0.47);
    const sealMat = new THREE.MeshStandardMaterial({
      color: prod.accent,
      roughness: 0.4,
      metalness: 0.1,
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.y = 0.96;
    bagGroup.add(seal);

    // Degassing valve (circle on back)
    const valveGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
    const valveMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      roughness: 0.3,
      metalness: 0.8,
    });
    const valve = new THREE.Mesh(valveGeo, valveMat);
    valve.rotation.x = Math.PI / 2;
    valve.position.set(0.2, 0.1, -0.23);
    bagGroup.add(valve);

    // Soft glow halo
    const haloGeo = new THREE.PlaneGeometry(3, 3);
    const haloMat = new THREE.MeshBasicMaterial({
      color: prod.accent,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = -0.3;
    bagGroup.add(halo);
  }

  buildBag(0);

  /* ── Drag Rotation ───────────────────────────────────────────── */
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let rotVel = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    rotVel.y = dx * 0.01;
    rotVel.x = dy * 0.008;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - prevMouse.x;
    const dy = e.touches[0].clientY - prevMouse.y;
    rotVel.y = dx * 0.01;
    rotVel.x = dy * 0.008;
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  canvas.addEventListener('touchend', () => { isDragging = false; });

  /* ── Product Tabs ────────────────────────────────────────────── */
  const tabs = document.querySelectorAll('.prod-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const idx = parseInt(tab.dataset.product);
      currentProduct = idx;
      const prod = products[idx];

      // Animate transition
      gsap.to(bagGroup.scale, { x: 0.01, duration: 0.3, ease: 'power2.in', onComplete: () => {
        buildBag(idx);
        gsap.to(bagGroup.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(1.5)' });
      }});
      gsap.to(bagGroup.scale, { y: 0.01, z: 0.01, duration: 0.3, ease: 'power2.in' });

      // Update UI
      document.getElementById('product-name').textContent = prod.name;
      document.getElementById('product-origin').textContent = prod.origin;

      const notesEl = document.getElementById('product-notes');
      notesEl.innerHTML = prod.notes.map(n => `<span class="note-tag">${n}</span>`).join('');

      document.getElementById('roast-fill').style.width = prod.roast + '%';
      document.getElementById('product-price').textContent = prod.price;
    });
  });

  /* ── Render Loop ─────────────────────────────────────────────── */
  const clock = new THREE.Clock();

  function render() {
    requestAnimationFrame(render);
    const t = clock.getElapsedTime();

    // Auto-rotate + drag inertia
    if (!isDragging) {
      rotVel.y *= 0.95;
      rotVel.x *= 0.95;
      bagGroup.rotation.y += 0.004 + rotVel.y;
    } else {
      bagGroup.rotation.y += rotVel.y;
      bagGroup.rotation.x += rotVel.x;
      bagGroup.rotation.x = Math.max(-0.6, Math.min(0.6, bagGroup.rotation.x));
    }

    // Floating bob
    bagGroup.position.y = Math.sin(t * 0.8) * 0.04;

    // Rim light orbit
    rimL.position.x = Math.cos(t * 0.4) * 3;
    rimL.position.z = Math.sin(t * 0.4) * 3 + 2;

    renderer.render(scene, camera);
  }

  render();

  /* ── Resize ──────────────────────────────────────────────────── */
  const resizeObserver = new ResizeObserver(() => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight || w;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(wrap);
})();
