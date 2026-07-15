/* ─── Provenance World Map ────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Origin data
  const origins = [
    { name: 'Ethiopia', lat: 8, lon: 39, color: '#c89650' },
    { name: 'Kenya', lat: -1.3, lon: 36.8, color: '#e87040' },
    { name: 'Brazil', lat: -3, lon: -60, color: '#d4a040' },
    { name: 'Colombia', lat: 4, lon: -74, color: '#f0c030' },
    { name: 'Guatemala', lat: 15, lon: -90, color: '#e0a050' },
    { name: 'Indonesia', lat: -5, lon: 120, color: '#c87828' },
  ];

  // Home (Brooklyn, NY)
  const home = { lat: 40.7, lon: -74 };

  // Mercator projection
  function project(lat, lon) {
    const x = (lon + 180) / 360 * W;
    const latRad = lat * Math.PI / 180;
    const y = (1 - Math.log(Math.tan(latRad / 2 + Math.PI / 4)) / Math.PI) / 2 * H;
    return { x, y };
  }

  let animFrame = 0;
  let pulseT = 0;

  // Simplified world continent data (approximate polygons for visual)
  function drawLandmasses() {
    ctx.fillStyle = 'rgba(30, 18, 8, 0.9)';
    ctx.fillRect(0, 0, W, H);

    // Ocean tint
    ctx.fillStyle = 'rgba(8, 18, 35, 0.6)';
    ctx.fillRect(0, 0, W, H);

    // Simple continent blobs for visual effect
    const continents = [
      // North America
      { x: 0.12, y: 0.15, rx: 0.12, ry: 0.22 },
      // South America
      { x: 0.22, y: 0.55, rx: 0.06, ry: 0.18 },
      // Europe
      { x: 0.47, y: 0.16, rx: 0.06, ry: 0.1 },
      // Africa
      { x: 0.49, y: 0.4, rx: 0.07, ry: 0.18 },
      // Asia
      { x: 0.65, y: 0.22, rx: 0.18, ry: 0.18 },
      // Australia
      { x: 0.78, y: 0.62, rx: 0.06, ry: 0.07 },
    ];

    continents.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x * W, c.y * H, c.rx * W, c.ry * H, 0, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(
        c.x * W, c.y * H, 0,
        c.x * W, c.y * H, Math.max(c.rx, c.ry) * W
      );
      grad.addColorStop(0, 'rgba(35, 22, 10, 0.85)');
      grad.addColorStop(1, 'rgba(20, 12, 5, 0.4)');
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // Grid lines
    ctx.strokeStyle = 'rgba(200, 150, 80, 0.06)';
    ctx.lineWidth = 0.5;
    for (let lon = -180; lon <= 180; lon += 30) {
      const p = project(0, lon);
      ctx.beginPath();
      ctx.moveTo(p.x, 0);
      ctx.lineTo(p.x, H);
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const p = project(lat, 0);
      ctx.beginPath();
      ctx.moveTo(0, p.y);
      ctx.lineTo(W, p.y);
      ctx.stroke();
    }
  }

  function drawRoutes(t) {
    const homePos = project(home.lat, home.lon);

    origins.forEach((origin, i) => {
      const from = project(origin.lat, origin.lon);
      const progress = ((t * 0.3 + i * 0.5) % 1);

      // Bezier arc
      const cx = (from.x + homePos.x) / 2;
      const cy = Math.min(from.y, homePos.y) - 60 - i * 8;

      // Draw full arc faintly
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cx, cy, homePos.x, homePos.y);
      ctx.strokeStyle = `rgba(${hexToRgb(origin.color)}, 0.12)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated dot along the arc
      const px = Math.pow(1 - progress, 2) * from.x + 2 * (1 - progress) * progress * cx + progress * progress * homePos.x;
      const py = Math.pow(1 - progress, 2) * from.y + 2 * (1 - progress) * progress * cy + progress * progress * homePos.y;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = origin.color;
      ctx.fill();

      // Trail behind the dot
      for (let s = 1; s <= 5; s++) {
        const tp = Math.max(0, progress - s * 0.025);
        const tx = Math.pow(1 - tp, 2) * from.x + 2 * (1 - tp) * tp * cx + tp * tp * homePos.x;
        const ty = Math.pow(1 - tp, 2) * from.y + 2 * (1 - tp) * tp * cy + tp * tp * homePos.y;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5 - s * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(origin.color)}, ${0.15 - s * 0.03})`;
        ctx.fill();
      }
    });
  }

  function drawOriginPoints(t) {
    const pulse = (Math.sin(t * 3) + 1) / 2;

    origins.forEach(origin => {
      const pos = project(origin.lat, origin.lon);

      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${hexToRgb(origin.color)}, ${0.2 - pulse * 0.15})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Middle ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${hexToRgb(origin.color)}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = origin.color;
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(245, 237, 210, 0.75)';
      ctx.font = '9px DM Sans, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(origin.name, pos.x + 8, pos.y + 3);
    });

    // Home marker
    const homePos = project(home.lat, home.lon);
    ctx.beginPath();
    ctx.arc(homePos.x, homePos.y, 4 + pulse * 3, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(245, 237, 210, ${0.3 - pulse * 0.2})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(homePos.x, homePos.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#f5edd8';
    ctx.fill();

    ctx.fillStyle = 'rgba(245, 237, 210, 0.8)';
    ctx.font = 'bold 9px DM Sans, sans-serif';
    ctx.fillText('AURUM NYC', homePos.x + 6, homePos.y + 3);
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  let startTime = null;

  function loop(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;

    ctx.clearRect(0, 0, W, H);
    drawLandmasses();
    drawRoutes(t);
    drawOriginPoints(t);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
