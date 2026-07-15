# AURUM — Cinematic 3D Cafe Website

A boundary-pushing specialty coffee website that treats the browser as a digital storefront. Built with **Three.js**, **GSAP ScrollTrigger**, and **Canvas 2D API** — zero frameworks.

![Preview](https://raw.githubusercontent.com/ameya1009/Cafesample/main/preview.jpg)

---

## ✨ Features

| Feature | Technology |
|---|---|
| Full 3D cafe environment (espresso machine, steam, god rays) | Three.js r128 |
| Scroll-driven cinematic camera flight | GSAP ScrollTrigger |
| Drag-to-rotate interactive 3D coffee bag | Three.js + Canvas textures |
| Animated provenance world map | Canvas 2D + Mercator projection |
| Custom "tamp" cursor with lag-trail | Vanilla JS |
| Scroll-reveal animations & animated counters | GSAP + IntersectionObserver |
| Glassmorphism live data HUD | CSS backdrop-filter |
| Ambient particle rain + god-ray overlay | Canvas 2D |
| Reservation form with micro-interactions | GSAP |

---

## 🚀 Run Locally

```bash
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure

```
cinematic-cafe/
├── index.html          # Full page markup (4 sections)
├── css/
│   └── style.css       # Design system, glassmorphism, animations
└── js/
    ├── cursor.js       # Custom tamp cursor
    ├── scene.js        # Three.js 3D cafe scene
    ├── scroll.js       # GSAP camera flight
    ├── product.js      # Interactive 3D coffee bag viewer
    ├── map.js          # Provenance world map
    ├── ui.js           # UI reveals, counters, interactions
    └── main.js         # Loader, god rays, particle rain
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Amber | `hsl(32, 85%, 52%)` |
| Mahogany | `hsl(15, 60%, 14%)` |
| Slate | `hsl(220, 15%, 9%)` |
| Cream | `hsl(42, 40%, 92%)` |
| Glass | `rgba(255,255,255, 0.04)` |

**Typography:** Cormorant Garamond (serif headlines) + DM Sans (body)

---

## 📜 License

MIT — free to use and adapt.
