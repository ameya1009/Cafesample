/* ─── Three.js Main Scene ────────────────────────────────────────── */
(function () {
  /* ── Setup ────────────────────────────────────────────────────── */
  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090a0f);
  scene.fog = new THREE.FogExp2(0x0d0a08, 0.06);

  /* ── Camera ───────────────────────────────────────────────────── */
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 6);
  window._camera = camera;
  window._scene = scene;
  window._renderer = renderer;

  /* ── Lighting ─────────────────────────────────────────────────── */
  // Ambient
  const ambient = new THREE.AmbientLight(0x1a0d05, 1.5);
  scene.add(ambient);

  // Main warm key light (window sunlight)
  const keyLight = new THREE.DirectionalLight(0xc89650, 3.5);
  keyLight.position.set(5, 8, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Rim fill (cool slate from behind)
  const rimLight = new THREE.DirectionalLight(0x3a4a6a, 1.2);
  rimLight.position.set(-4, 2, -6);
  scene.add(rimLight);

  // Espresso machine glow (orange-amber point)
  const machineGlow = new THREE.PointLight(0xe8893a, 4, 6, 2);
  machineGlow.position.set(-0.3, 1.2, 1.5);
  scene.add(machineGlow);

  // Volumetric god-ray simulation via cone geometry with additive blending
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xc87830,
    transparent: true,
    opacity: 0.025,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  for (let i = 0; i < 5; i++) {
    const rayGeo = new THREE.ConeGeometry(1.5 + i * 0.4, 8, 6, 1, true);
    const ray = new THREE.Mesh(rayGeo, rayMat.clone());
    ray.position.set(3 + i * 0.5, 4, -2 - i * 0.4);
    ray.rotation.z = -0.4 - i * 0.08;
    ray.rotation.x = 0.2;
    scene.add(ray);
  }

  /* ── Geometry: Cafe Environment ───────────────────────────────── */

  // Floor
  const floorGeo = new THREE.PlaneGeometry(30, 30, 1, 1);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1008,
    roughness: 0.95,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.5;
  floor.receiveShadow = true;
  scene.add(floor);

  // Counter / bar top
  const counterGeo = new THREE.BoxGeometry(4, 0.08, 0.9);
  const counterMat = new THREE.MeshStandardMaterial({
    color: 0x2a1a0a,
    roughness: 0.4,
    metalness: 0.3,
  });
  const counter = new THREE.Mesh(counterGeo, counterMat);
  counter.position.set(-0.5, 0.96, 0.3);
  counter.castShadow = true;
  counter.receiveShadow = true;
  scene.add(counter);

  // Counter body
  const counterBodyGeo = new THREE.BoxGeometry(4, 1.0, 0.9);
  const counterBodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1208,
    roughness: 0.9,
    metalness: 0.0,
  });
  const counterBody = new THREE.Mesh(counterBodyGeo, counterBodyMat);
  counterBody.position.set(-0.5, 0.5, 0.3);
  counterBody.castShadow = true;
  counterBody.receiveShadow = true;
  scene.add(counterBody);

  /* ── Espresso Machine ─────────────────────────────────────────── */
  const machineGroup = new THREE.Group();

  // Machine body
  const bodyGeo = new THREE.BoxGeometry(0.7, 0.55, 0.5);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    roughness: 0.25,
    metalness: 0.85,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  machineGroup.add(body);

  // Machine top
  const topGeo = new THREE.BoxGeometry(0.72, 0.06, 0.52);
  const topMat = new THREE.MeshStandardMaterial({ color: 0x8a5c1a, roughness: 0.2, metalness: 0.9 });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 0.305;
  machineGroup.add(top);

  // Portafilter arm
  const armGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 12);
  const armMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.9 });
  const arm = new THREE.Mesh(armGeo, armMat);
  arm.position.set(-0.12, -0.12, 0.28);
  arm.rotation.x = Math.PI / 2;
  machineGroup.add(arm);

  // Group light button
  const btnGeo = new THREE.CircleGeometry(0.04, 16);
  const btnMat = new THREE.MeshBasicMaterial({ color: 0xff6633 });
  const btn = new THREE.Mesh(btnGeo, btnMat);
  btn.position.set(0.15, 0.05, 0.26);
  machineGroup.add(btn);

  machineGroup.position.set(-0.3, 1.25, 0.15);
  scene.add(machineGroup);

  /* ── Coffee Cup ───────────────────────────────────────────────── */
  const cupGroup = new THREE.Group();

  const cupGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.14, 24);
  const cupMat = new THREE.MeshStandardMaterial({
    color: 0xfaf5ed,
    roughness: 0.6,
    metalness: 0.0,
  });
  const cup = new THREE.Mesh(cupGeo, cupMat);
  cup.castShadow = true;
  cupGroup.add(cup);

  // Coffee liquid
  const liquidGeo = new THREE.CircleGeometry(0.088, 24);
  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0x3d1a05,
    roughness: 0.8,
    metalness: 0.0,
    emissive: 0x1a0800,
    emissiveIntensity: 0.3,
  });
  const liquid = new THREE.Mesh(liquidGeo, liquidMat);
  liquid.rotation.x = -Math.PI / 2;
  liquid.position.y = 0.068;
  cupGroup.add(liquid);

  // Saucer
  const saucerGeo = new THREE.CylinderGeometry(0.14, 0.13, 0.02, 24);
  const saucerMat = new THREE.MeshStandardMaterial({ color: 0xfaf5ed, roughness: 0.6 });
  const saucer = new THREE.Mesh(saucerGeo, saucerMat);
  saucer.position.y = -0.08;
  saucer.castShadow = true;
  cupGroup.add(saucer);

  cupGroup.position.set(0.5, 1.05, 0.6);
  scene.add(cupGroup);
  window._cupGroup = cupGroup;

  /* ── Steam Particle System ────────────────────────────────────── */
  const PARTICLE_COUNT = 180;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const steamVels = [];
  const steamLifetimes = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = 0.5 + (Math.random() - 0.5) * 0.06;
    positions[i * 3 + 1] = 1.12 + Math.random() * 0.4;
    positions[i * 3 + 2] = 0.6 + (Math.random() - 0.5) * 0.04;
    steamVels.push({
      x: (Math.random() - 0.5) * 0.002,
      y: 0.003 + Math.random() * 0.003,
      z: (Math.random() - 0.5) * 0.001,
    });
    steamLifetimes.push(Math.random());
  }

  const steamGeo = new THREE.BufferGeometry();
  steamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const steamMat = new THREE.PointsMaterial({
    color: 0xd4c5b0,
    size: 0.04,
    transparent: true,
    opacity: 0.18,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const steamParticles = new THREE.Points(steamGeo, steamMat);
  scene.add(steamParticles);

  /* ── Background: floating coffee beans (ambient particles) ───── */
  const BEAN_COUNT = 60;
  const beanPositions = new Float32Array(BEAN_COUNT * 3);
  const beanVels = [];

  for (let i = 0; i < BEAN_COUNT; i++) {
    beanPositions[i * 3]     = (Math.random() - 0.5) * 18;
    beanPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    beanPositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    beanVels.push({
      x: (Math.random() - 0.5) * 0.0008,
      y: Math.random() * 0.0005,
    });
  }

  const beanGeo = new THREE.BufferGeometry();
  beanGeo.setAttribute('position', new THREE.BufferAttribute(beanPositions, 3));

  const beanMat = new THREE.PointsMaterial({
    color: 0x8a4a1a,
    size: 0.06,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const beanParticles = new THREE.Points(beanGeo, beanMat);
  scene.add(beanParticles);

  /* ── Window pane (light shaft source) ────────────────────────── */
  const windowGeo = new THREE.PlaneGeometry(3, 4);
  const windowMat = new THREE.MeshBasicMaterial({
    color: 0xffd080,
    transparent: true,
    opacity: 0.03,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const windowMesh = new THREE.Mesh(windowGeo, windowMat);
  windowMesh.position.set(5, 2, -3);
  windowMesh.rotation.y = -Math.PI / 3;
  scene.add(windowMesh);

  /* ── Animation Loop ───────────────────────────────────────────── */
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Animate steam
    const pos = steamGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      steamLifetimes[i] += 0.005;
      if (steamLifetimes[i] > 1) {
        steamLifetimes[i] = 0;
        pos[i * 3]     = 0.5 + (Math.random() - 0.5) * 0.06;
        pos[i * 3 + 1] = 1.12;
        pos[i * 3 + 2] = 0.6 + (Math.random() - 0.5) * 0.04;
        steamVels[i].x = (Math.random() - 0.5) * 0.002;
        steamVels[i].y = 0.003 + Math.random() * 0.003;
      } else {
        pos[i * 3]     += steamVels[i].x;
        pos[i * 3 + 1] += steamVels[i].y;
        pos[i * 3 + 2] += steamVels[i].z;
      }
    }
    steamGeo.attributes.position.needsUpdate = true;
    steamMat.opacity = 0.14 + Math.sin(t * 0.5) * 0.04;

    // Animate beans
    const bp = beanGeo.attributes.position.array;
    for (let i = 0; i < BEAN_COUNT; i++) {
      bp[i * 3]     += beanVels[i].x;
      bp[i * 3 + 1] += beanVels[i].y;
      if (bp[i * 3 + 1] > 6) bp[i * 3 + 1] = -5;
    }
    beanGeo.attributes.position.needsUpdate = true;

    // Machine glow pulse
    machineGlow.intensity = 3.5 + Math.sin(t * 1.2) * 0.5;

    // Cup subtle wobble
    cupGroup.rotation.y = Math.sin(t * 0.3) * 0.015;

    // Machine subtle vibration (brewing)
    machineGroup.position.y = 1.25 + Math.sin(t * 12) * 0.0008;

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ───────────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
