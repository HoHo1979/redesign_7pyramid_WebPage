// CSP-compliant JavaScript for Seven Pyramid Wine Website
// This file removes all inline event handlers and replaces them with proper event listeners

document.addEventListener('DOMContentLoaded', function() {

  // Fix all navigation hover effects
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.color = 'var(--md-sys-color-primary)';
    });

    link.addEventListener('mouseleave', function() {
      this.style.color = 'var(--md-sys-color-on-surface)';
    });
  });

  // Fix dropdown menu hover effects
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (dropdownTrigger && dropdownMenu) {
    dropdownTrigger.addEventListener('mouseenter', function() {
      this.style.color = 'var(--md-sys-color-primary)';
      dropdownMenu.style.display = 'block';
    });

    dropdownTrigger.addEventListener('mouseleave', function() {
      this.style.color = 'var(--md-sys-color-on-surface)';
      setTimeout(() => {
        if (!dropdownMenu.matches(':hover') && !dropdownTrigger.matches(':hover')) {
          dropdownMenu.style.display = 'none';
        }
      }, 100);
    });

    dropdownMenu.addEventListener('mouseenter', function() {
      this.style.display = 'block';
    });

    dropdownMenu.addEventListener('mouseleave', function() {
      this.style.display = 'none';
    });
  }

  // Fix dropdown menu item hover effects
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.color = 'var(--md-sys-color-primary)';
    });

    item.addEventListener('mouseleave', function() {
      this.style.color = 'var(--md-sys-color-on-surface)';
    });
  });

  // Fix button hover effects
  const primaryButtons = document.querySelectorAll('.primary-btn');
  primaryButtons.forEach(btn => {
    const originalTransform = btn.style.transform || 'translateY(0)';
    const originalBoxShadow = btn.style.boxShadow || '0 4px 12px rgba(0,0,0,0.15)';

    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = originalTransform;
      this.style.boxShadow = originalBoxShadow;
    });
  });

  // Fix secondary button hover effects
  const secondaryButtons = document.querySelectorAll('.secondary-btn');
  secondaryButtons.forEach(btn => {
    const originalBg = btn.style.backgroundColor || 'transparent';
    const originalColor = btn.style.color;

    btn.addEventListener('mouseenter', function() {
      this.style.backgroundColor = 'var(--md-sys-color-on-primary-container)';
      this.style.color = 'var(--md-sys-color-primary-container)';
    });

    btn.addEventListener('mouseleave', function() {
      this.style.backgroundColor = originalBg;
      this.style.color = originalColor;
    });
  });

  // Fix large button hover effects
  const largeButtons = document.querySelectorAll('.large-btn');
  largeButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.02)';
      this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    });
  });

  // Fix wine card hover effects
  const wineCards = document.querySelectorAll('.wine-card');
  wineCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    });
  });

  // Fix service card hover effects
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    });
  });

  // Fix contact card hover effects
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
    });
  });

  // Back to top functionality for any page
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // Any reload buttons
  const reloadButtons = document.querySelectorAll('.reload-btn');
  reloadButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      window.location.reload();
    });
  });

  // Mobile Navigation Menu
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Open mobile menu
  if (mobileMenuToggle) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.addEventListener('click', function() {
      if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.add('active');
      }
      mobileMenuToggle.classList.add('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  }

  // Close mobile menu
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking overlay
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function(e) {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }

  // Close mobile menu when clicking nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Only close if it's not a submenu toggle
      if (!this.querySelector('#wine-submenu-toggle')) {
        closeMobileMenu();
      }
    });
  });

  function closeMobileMenu() {
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('active');
    }
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Wine submenu toggle in mobile
  const wineSubmenuToggle = document.getElementById('wine-submenu-toggle');
  const wineSubmenu = document.getElementById('wine-submenu');

  if (wineSubmenuToggle && wineSubmenu) {
    wineSubmenuToggle.parentElement.addEventListener('click', function(e) {
      e.preventDefault();

      if (wineSubmenu.style.display === 'none' || !wineSubmenu.style.display) {
        wineSubmenu.style.display = 'block';
        wineSubmenuToggle.style.transform = 'rotate(180deg)';
      } else {
        wineSubmenu.style.display = 'none';
        wineSubmenuToggle.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Sync theme toggles (desktop and mobile)
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeToggleDesktop = document.getElementById('theme-toggle');

  if (themeToggleMobile && themeToggleDesktop) {
    // Sync mobile theme toggle with desktop
    themeToggleMobile.addEventListener('click', function() {
      themeToggleDesktop.click(); // Trigger desktop theme toggle
    });
  }

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  console.log('✅ CSP-compliant event listeners loaded successfully');
});