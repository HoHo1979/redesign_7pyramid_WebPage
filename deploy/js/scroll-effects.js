/**
 * scroll-effects.js — Seven Pyramid ScrollTrigger Choreography
 *
 * Works alongside editorial-motion.js (which owns [data-editorial-reveal] elements).
 * This file handles:
 *   • Hero barrel-image parallax (index.html)
 *   • Services top-border draw (index.html)
 *   • Wine-list intro + section stagger (wine_list.html)
 *   • Universal section reveals for nav pages without data-editorial-reveal
 *
 * Requires: window.gsap + window.ScrollTrigger (loaded before this via defer)
 * Respects: prefers-reduced-motion
 */
(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ─── Helpers ─────────────────────────────────────────────────────── */

  /** Returns elements matching selector, filtering out any inside [data-editorial-reveal] */
  function freshNodes(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    ).filter(function (el) {
      return !el.closest('[data-editorial-reveal]');
    });
  }

  /* ─── Main initialiser ───────────────────────────────────────────── */

  function initScrollEffects() {
    var gsap = window.gsap;
    var ST   = window.ScrollTrigger;

    if (!gsap || !ST)          return;
    if (motionQuery.matches)   return;

    // idempotent — safe even if editorial-motion.js already called this
    gsap.registerPlugin(ST);

    /* ── 1. HERO PARALLAX (index.html) ──────────────────────────── */
    var heroShell = document.querySelector('.hero-editorial-shell');
    if (heroShell) {

      // Barrel photograph moves upward slower than scroll → depth
      var barrelImg = heroShell.querySelector('.hero-editorial-visual img');
      if (barrelImg) {
        gsap.to(barrelImg, {
          y: -72,
          ease: 'none',
          scrollTrigger: {
            trigger: heroShell,
            start: 'top top',
            end: '+=780',
            scrub: 1.4,
          },
        });
      }

      // Burgundy info panel lags even less — creates layered depth
      var infoPanel = heroShell.querySelector('.editorial-panel-glow');
      if (infoPanel) {
        gsap.to(infoPanel, {
          y: -38,
          ease: 'none',
          scrollTrigger: {
            trigger: heroShell,
            start: 'top top',
            end: '+=780',
            scrub: 0.8,
          },
        });
      }

      // Hero copy gently recedes as user scrolls into body
      var heroCopy = heroShell.querySelector('.z-10.w-full');
      if (heroCopy) {
        gsap.to(heroCopy, {
          autoAlpha: 0.55,
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: heroShell,
            start: 'center top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }

    /* ── 2. SERVICES BORDER DRAW (index.html) ───────────────────── */
    var servicesBorder = document.querySelector('#services .border-t-2');
    if (servicesBorder) {
      gsap.fromTo(
        servicesBorder,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: servicesBorder,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }

    /* ── 3. EDITORIAL-LINE DIVIDERS (wine_list.html) ────────────── */
    freshNodes('.editorial-line').forEach(function (line) {
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        }
      );
    });

    /* ── 4. WINE LIST INTRO (wine_list.html) ────────────────────── */
    var wineListIntro = document.querySelector('.wine-list-intro');
    if (wineListIntro) {
      var wlH1     = wineListIntro.querySelector('h1');
      var wlKicker = wineListIntro.querySelector('.wine-list-kicker');
      var wlFilter = wineListIntro.querySelector('.wine-list-filter-shell');

      if (wlH1) {
        gsap.fromTo(wlH1,
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, duration: 1.25, ease: 'expo.out', delay: 0.1 }
        );
      }
      var wlMeta = [wlKicker, wlFilter].filter(Boolean);
      if (wlMeta.length) {
        gsap.fromTo(wlMeta,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1, y: 0,
            duration: 0.9, ease: 'power3.out',
            stagger: 0.12, delay: 0.38,
          }
        );
      }
    }

    /* ── 5. WINE LIST SECTION STAGGER (wine_list.html) ──────────── */
    var wineSections = document.querySelectorAll('.wine-list-section');
    wineSections.forEach(function (section) {
      var heading  = section.querySelector('h2');
      var articles = section.querySelectorAll('article');

      if (heading) {
        gsap.fromTo(heading,
          { autoAlpha: 0, x: -22 },
          {
            autoAlpha: 1, x: 0,
            duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 88%', once: true },
          }
        );
      }

      if (articles.length) {
        gsap.fromTo(articles,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1, y: 0,
            duration: 0.65, ease: 'power2.out',
            // 'amount' distributes total stagger across all items — safe for 200+ wines
            stagger: { amount: 0.55, from: 'start' },
            scrollTrigger: { trigger: section, start: 'top 86%', once: true },
          }
        );
      }
    });

    /* ── 6. UNIVERSAL H1 (nav pages) ────────────────────────────── */
    var mainH1 = document.querySelector('main h1:not([data-editorial-reveal])');
    if (mainH1) {
      gsap.fromTo(mainH1,
        { autoAlpha: 0, y: 42 },
        { autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out', delay: 0.08 }
      );
    }

    /* ── 7. UNIVERSAL SECTION REVEALS (faq, knowledge, how-to) ─── */
    var navSections = document.querySelectorAll(
      '#faq-main section, #main-content section, main > section.scroll-mt-32'
    );
    navSections.forEach(function (section) {
      // Skip sections whose direct children already own data-editorial-reveal
      if (section.querySelector('[data-editorial-reveal]')) return;

      var h2 = section.querySelector('h2');
      var textBlocks = freshNodes('p, li, blockquote, dt, dd', section);

      if (h2 && !h2.hasAttribute('data-editorial-reveal')) {
        gsap.fromTo(h2,
          { autoAlpha: 0, x: -20 },
          {
            autoAlpha: 1, x: 0,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 82%', once: true },
          }
        );
      }

      if (textBlocks.length) {
        gsap.fromTo(textBlocks,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1, y: 0,
            duration: 0.8, ease: 'power2.out',
            stagger: 0.055,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true },
          }
        );
      }
    });

    /* ── 8. LEFT-BORDER ACCENTS ─────────────────────────────────── */
    freshNodes('.border-l-4').forEach(function (el) {
      gsap.fromTo(el,
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1, x: 0,
          duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        }
      );
    });

    /* ── 9. BURGUNDY CTA SECTIONS (faq / how-to CTAs) ──────────── */
    var ctaSections = document.querySelectorAll(
      '#faq-main section.bg-\\[\\#6B2737\\], #main-content section.bg-\\[\\#6B2737\\]'
    );
    ctaSections.forEach(function (cta) {
      if (cta.querySelector('[data-editorial-reveal]')) return;
      var kids = Array.prototype.slice.call(cta.children);
      if (!kids.length) return;
      gsap.fromTo(kids,
        { autoAlpha: 0, y: 30, scale: 0.97 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.85, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: cta, start: 'top 86%', once: true },
        }
      );
    });

    /* ── Refresh on layout settle ────────────────────────────────── */
    window.addEventListener('load', function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ST.refresh(); });
    }
  }

  /* ─── Bootstrap ──────────────────────────────────────────────────── */

  // Deferred scripts run when readyState is 'interactive' — use else branch
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollEffects);
  } else {
    initScrollEffects();
  }

  motionQuery.addEventListener('change', function () {
    var ST = window.ScrollTrigger;
    if (ST) ST.refresh();
  });

}());
