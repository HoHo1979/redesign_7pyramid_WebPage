// Theme switching functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeLink = document.getElementById('theme-link');
  const body = document.body;
  const root = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  // Available themes for luxury wine theme
  const themes = [
    { name: 'light', file: 'css/light.css', icon: 'dark_mode', themeColor: '#ffffff' },
    { name: 'dark', file: 'css/dark.css', icon: 'light_mode', themeColor: '#000000' }
  ];

  let currentThemeIndex = themes.findIndex(theme => theme.name === 'dark');

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    const savedIndex = themes.findIndex(theme => theme.name === savedTheme);
    if (savedIndex !== -1) {
      currentThemeIndex = savedIndex;
    }
  } else if (root.classList.contains('dark')) {
    currentThemeIndex = themes.findIndex(theme => theme.name === 'dark');
  }

  // Apply the current theme
  function applyTheme(themeIndex) {
    const theme = themes[themeIndex];
    if (themeLink) {
      themeLink.href = theme.file;
    }

    root.classList.remove('light', 'dark');
    root.classList.add(theme.name);
    body.dataset.theme = theme.name;
     
    // Update both desktop and mobile toggle buttons
    if (themeToggle) {
      themeToggle.textContent = theme.icon;
      themeToggle.setAttribute('aria-label', theme.name === 'dark' ? '切換為淺色主題' : '切換為深色主題');
    }
    if (themeToggleMobile) {
      themeToggleMobile.textContent = theme.icon;
      themeToggleMobile.setAttribute('aria-label', theme.name === 'dark' ? '切換為淺色主題' : '切換為深色主題');
    }
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme.themeColor);
    }
     
    localStorage.setItem('selectedTheme', theme.name);
  }

  // Initialize with the current theme
  applyTheme(currentThemeIndex);

  // Theme toggle button click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(currentThemeIndex);
    });
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', function() {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(currentThemeIndex);
    });
  }

  // Navigation hover effects (CSP-safe)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const originalColor = getComputedStyle(link).color;

    link.addEventListener('mouseenter', function() {
      this.style.color = 'var(--md-sys-color-primary)';
    });

    link.addEventListener('mouseleave', function() {
      this.style.color = 'var(--md-sys-color-on-surface)';
    });
  });

  // Back to top button functionality (CSP-safe)
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Show/hide back to top button on scroll
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });
  }

  // Hover effects for wine cards and other interactive elements (CSP-safe)
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

  // Button hover effects (CSP-safe)
  const interactiveButtons = document.querySelectorAll('.interactive-btn');
  interactiveButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
  });
});
