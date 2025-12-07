// main.js
class PortfolioApp {
  constructor() {
    this.header = document.querySelector('[data-header]');
    this.nav = document.querySelector('[data-nav]');
    this.burger = document.querySelector('[data-burger]');
    this.transition = document.querySelector('[data-transition]');
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
    this.revealElements = document.querySelectorAll('.reveal');
    this.lastScroll = 0;
    
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initScrollEffects();
    this.initParallax();
    this.initReveal();
    this.initPageTransitions();
    this.initActiveMenu();
    this.initTelegramButtons();
  }

  initMobileMenu() {
    if (!this.burger) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = '<ul class="mobile-menu"><li><a href="about.html" class="menu-link">Обо мне</a></li><li><a href="works.html" class="menu-link">Кейсы</a></li><li><a href="contacts.html" class="menu-link">Контакты</a></li></ul>';
    document.body.appendChild(overlay);

    this.burger.addEventListener('click', () => {
      const isActive = this.burger.classList.contains('active');
      this.burger.classList.toggle('active');
      this.burger.setAttribute('aria-expanded', !isActive);
      overlay.classList.toggle('active');
      document.body.style.overflow = isActive ? '' : 'hidden';
    });

    // Close menu on link click
    overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-link')) {
        this.burger.classList.remove('active');
        this.burger.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  initScrollEffects() {
    if (!this.header) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Header hide/show
      if (currentScroll > this.lastScroll && currentScroll > 100) {
        this.header.classList.add('hide');
      } else {
        this.header.classList.remove('hide');
      }
      
      this.lastScroll = currentScroll;
    });
  }

  initParallax() {
    if (!this.parallaxElements.length) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.pageYOffset;
      
      this.parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrollY * speed);
        const maxOffset = 15; // Max 15px as requested
        const limitedYPos = Math.max(-maxOffset, Math.min(maxOffset, yPos));
        
        element.style.transform = `translateY(${limitedYPos}px)`;
      });
      
      ticking = false;
    };

    const requestParallaxTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestParallaxTick);
  }

  initReveal() {
    if (!('IntersectionObserver' in window) || !this.revealElements.length) {
      this.revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.revealElements.forEach(el => observer.observe(el));
  }

  initPageTransitions() {
    if (!this.transition) return;

    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const currentPath = window.location.pathname;
        
        // Only animate if navigating to different page
        if (href && !href.startsWith('#') && !href.includes('mailto:') && !href.includes('tel:')) {
          if (currentPath !== href && !href.includes(window.location.hostname)) {
            e.preventDefault();
            
            this.transition.classList.add('active');
            
            setTimeout(() => {
              window.location.href = href;
            }, 300);
          }
        }
      });
    });
  }

  initActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  initTelegramButtons() {
    const buttons = document.querySelectorAll('[data-action="dm"]');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (typeof openDM === 'function') {
          openDM();
        } else {
          window.open('https://t.me/fayni_arts', '_blank', 'noopener,noreferrer');
        }
      });
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Handle form submissions (if any)
document.addEventListener('submit', (e) => {
  if (e.target.tagName === 'FORM') {
    e.preventDefault();
    // Add form handling logic here
    console.log('Form submitted');
  }
});

// Prevent right click on images (optional)
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate anything needed on resize
    window.dispatchEvent(new Event('scroll'));
  }, 250);
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden
    document.body.classList.add('page-hidden');
  } else {
    // Page is visible
    document.body.classList.remove('page-hidden');
  }
});

// Add loading class to body
document.body.classList.add('loaded');

// Remove loading class after everything is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.remove('loaded');
  }, 100);
});

// Handle ESC key to close mobile menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const burger = document.querySelector('[data-burger]');
    const overlay = document.querySelector('.overlay');
    
    if (burger && burger.classList.contains('active')) {
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});
