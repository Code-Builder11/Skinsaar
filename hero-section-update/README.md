# Skinsaar Hero Section Scroll Animation Update

This update package contains **only** the files and assets required for the high-performance, scroll-scrubbed hero section animation.

---

## 📦 What Changed

- **Scroll-Scrub Hero Animation**: Replaced the static hero banner with a dynamic 300-frame image sequence scrubbed via canvas based on user scroll position.
- **Storytelling Stage Overlays**: Added synchronized 3-stage luxury overlays that seamlessly transition during scroll:
  - **Stage 1 (0%–28%)**: Brand Philosophy & Core Vision ("Skincare ka Naya Sansar") + CTA buttons.
  - **Stage 2 (32%–62%)**: Micro-Molecular Botanical Extraction highlights (Turmeric, 15% Ethyl Ascorbic, Botanical Retinol, SPF 50).
  - **Stage 3 (66%–98%)**: The 4-Step Daily Dermatology Ritual formulation cards.
- **Performance & Asset Pipeline**:
  - Progressive frame preloading with priority loading (first 24 frames buffer immediately, remaining frames stream in idle time).
  - High-DPI (Retina) canvas rendering with automatic aspect-ratio centering.
  - Graceful fallback for non-JavaScript environments and slow networks.

---

## 📁 Package Structure

```
hero-section-update/
├── assets/
│   ├── hero-sequence/                      # All 300 animation frame images (ezgif-frame-001.jpg to ezgif-frame-300.jpg)
│   ├── js/
│   │   └── hero-scroll-sequence.js        # Vanilla JS scroll-scrub engine (zero external dependencies)
│   └── css/
│       └── hero-scroll.css                 # Optional standalone CSS (also included inline in partials/hero.php)
├── partials/
│   └── hero.php                            # Complete, drop-in hero section markup & styles
└── README.md                               # This documentation guide
```

---

## 🔄 Exactly Which Existing Files to Replace & Where They Live

> [!IMPORTANT]
> **Backup Reminder**: Always create a backup copy of your existing hero section or template before overwriting (e.g., duplicate `hero.php` as `hero.php.bak` or `index.html` as `index.html.bak`).

| Package File | Target Live Site Destination | Action |
| :--- | :--- | :--- |
| `hero-section-update/assets/hero-sequence/*` | `assets/hero-sequence/` (or root `hero-sequence/`) | Copy all 300 `.jpg` frame files |
| `hero-section-update/assets/js/hero-scroll-sequence.js` | `assets/js/hero-scroll-sequence.js` (or `js/hero-scroll-sequence.js`) | Copy / replace script file |
| `hero-section-update/partials/hero.php` | `partials/hero.php` (or wherever your hero markup is included) | Replace existing hero markup |
| `hero-section-update/assets/css/hero-scroll.css` | `assets/css/hero-scroll.css` (or `css/hero-scroll.css`) | *(Optional)* Link if you prefer external CSS over the inline `<style>` block in `hero.php` |

### If your live site is static HTML (`index.html`):
1. Copy `hero-section-update/assets/hero-sequence/` into your site's asset directory.
2. Copy `hero-section-update/assets/js/hero-scroll-sequence.js` to `js/hero-scroll-sequence.js`.
3. Replace the `<section>` element between header and main content with the contents of `partials/hero.php`.
4. Ensure `<script src="js/hero-scroll-sequence.js"></script>` is loaded near the bottom of `index.html`.

---

## ✅ Post-Update Verification Checklist

After deploying the files to your live environment, run through this quick checklist:

- [ ] **Hero Loads Instantly**: Initial frame renders immediately without layout shift or blank screen.
- [ ] **Scroll Scrubbing Smooth**: Scrolling down through the hero smoothly plays the 300-frame bottle sequence forwards and backwards.
- [ ] **Stage Overlays Transition**:
  - [ ] Stage 1 text is visible at the top and fades out as you scroll.
  - [ ] Stage 2 card appears in the middle of the scroll sequence.
  - [ ] Stage 3 4-step ritual cards appear towards the end before smoothly transitioning to the next section.
- [ ] **Responsive & Mobile Fallback**: Test on mobile viewports (< 768px). Sequence renders smoothly in portrait mode and buttons/cards adapt responsively.
- [ ] **No Side Effects**: Confirm header navigation, product cards below the hero, cart drawer, and footer remain 100% functional.
