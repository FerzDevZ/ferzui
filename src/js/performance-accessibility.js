// ferzui Performance & Accessibility Core
(function() {
  'use strict';

  // Lazy Loading System
  class LazyLoader {
    constructor() {
      this.observer = null;
      this.init();
    }

    init() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
          rootMargin: '50px 0px',
          threshold: 0.1
        });
        this.observeElements();
      } else {
        // Fallback for older browsers
        this.loadAllElements();
      }
    }

    observeElements() {
      const lazyElements = document.querySelectorAll('[data-lazy]');
      lazyElements.forEach(el => this.observer.observe(el));
    }

    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }

    loadElement(element) {
      const type = element.dataset.lazy;
      
      switch(type) {
        case 'image':
          this.loadImage(element);
          break;
        case 'component':
          this.loadComponent(element);
          break;
        case 'script':
          this.loadScript(element);
          break;
        case 'iframe':
          this.loadIframe(element);
          break;
      }
    }

    loadImage(img) {
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.classList.add('loaded');
        img.addEventListener('load', () => {
          img.classList.add('fade-in');
        });
      }
    }

    loadComponent(element) {
      const componentName = element.dataset.component;
      const props = JSON.parse(element.dataset.props || '{}');
      
      // Dynamic component loading
      import(`./components/${componentName}.js`)
        .then(module => {
          const Component = module.default;
          const instance = new Component(element, props);
          instance.render();
        })
        .catch(err => console.warn(`Failed to load component ${componentName}:`, err));
    }

    loadScript(element) {
      const src = element.dataset.src;
      if (src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        element.appendChild(script);
      }
    }

    loadIframe(element) {
      const src = element.dataset.src;
      if (src) {
        element.src = src;
        element.classList.add('loaded');
      }
    }

    loadAllElements() {
      const lazyElements = document.querySelectorAll('[data-lazy]');
      lazyElements.forEach(el => this.loadElement(el));
    }
  }

  // Code Splitting System
  class CodeSplitter {
    constructor() {
      this.loadedModules = new Map();
      this.loadingPromises = new Map();
    }

    async loadModule(moduleName) {
      if (this.loadedModules.has(moduleName)) {
        return this.loadedModules.get(moduleName);
      }

      if (this.loadingPromises.has(moduleName)) {
        return this.loadingPromises.get(moduleName);
      }

      const promise = this.importModule(moduleName);
      this.loadingPromises.set(moduleName, promise);

      try {
        const module = await promise;
        this.loadedModules.set(moduleName, module);
        this.loadingPromises.delete(moduleName);
        return module;
      } catch (error) {
        this.loadingPromises.delete(moduleName);
        throw error;
      }
    }

    async importModule(moduleName) {
      switch(moduleName) {
        case 'modal':
          return import('./modules/modal.js');
        case 'dropdown':
          return import('./modules/dropdown.js');
        case 'tooltip':
          return import('./modules/tooltip.js');
        case 'toast':
          return import('./modules/toast.js');
        case 'carousel':
          return import('./modules/carousel.js');
        case 'tabs':
          return import('./modules/tabs.js');
        case 'accordion':
          return import('./modules/accordion.js');
        default:
          throw new Error(`Unknown module: ${moduleName}`);
      }
    }

    preloadModule(moduleName) {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = `./modules/${moduleName}.js`;
      document.head.appendChild(link);
    }
  }

  // Accessibility Manager
  class AccessibilityManager {
    constructor() {
      this.init();
    }

    init() {
      this.setupKeyboardNavigation();
      this.setupScreenReaderSupport();
      this.setupHighContrastMode();
      this.setupFocusManagement();
      this.setupARIA();
    }

    setupKeyboardNavigation() {
      document.addEventListener('keydown', this.handleKeyboard.bind(this));
      
      // Skip to content link
      this.createSkipLink();
      
      // Focus trap for modals
      this.setupFocusTrap();
    }

    handleKeyboard(event) {
      // Escape key handling
      if (event.key === 'Escape') {
        this.handleEscape();
      }
      
      // Tab navigation enhancement
      if (event.key === 'Tab') {
        this.handleTabNavigation(event);
      }
      
      // Arrow key navigation for menus
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowNavigation(event);
      }
    }

    handleEscape() {
      const openModals = document.querySelectorAll('.modal.show');
      const openDropdowns = document.querySelectorAll('.dropdown.show');
      const openOffcanvas = document.querySelectorAll('.offcanvas.show');
      
      [...openModals, ...openDropdowns, ...openOffcanvas].forEach(el => {
        const closeBtn = el.querySelector('[data-bs-dismiss]');
        if (closeBtn) closeBtn.click();
      });
    }

    handleTabNavigation(event) {
      const focusableElements = this.getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    handleArrowNavigation(event) {
      const menu = event.target.closest('[role="menu"], [role="menubar"]');
      if (!menu) return;
      
      event.preventDefault();
      const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
      const currentIndex = items.indexOf(event.target);
      
      let nextIndex;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % items.length;
      } else {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      }
      
      items[nextIndex].focus();
    }

    getFocusableElements() {
      return document.querySelectorAll(`
        a[href],
        button:not([disabled]),
        input:not([disabled]),
        select:not([disabled]),
        textarea:not([disabled]),
        [tabindex]:not([tabindex="-1"]),
        [contenteditable="true"]
      `);
    }

    createSkipLink() {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'skip-link';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--fz-c-primary-500);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusTrap() {
      document.addEventListener('show.bs.modal', (event) => {
        this.trapFocus(event.target);
      });
      
      document.addEventListener('hide.bs.modal', (event) => {
        this.releaseFocus(event.target);
      });
    }

    trapFocus(element) {
      const focusableElements = element.querySelectorAll(`
        a[href], button:not([disabled]), input:not([disabled]), 
        select:not([disabled]), textarea:not([disabled]), 
        [tabindex]:not([tabindex="-1"])
      `);
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      element.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      });
      
      firstElement?.focus();
    }

    releaseFocus(element) {
      // Return focus to trigger element
      const trigger = document.querySelector(`[data-bs-target="#${element.id}"]`);
      trigger?.focus();
    }

    setupScreenReaderSupport() {
      // Live region for announcements
      this.createLiveRegion();
      
      // Enhanced ARIA labels
      this.enhanceARIALabels();
    }

    createLiveRegion() {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'ferzui-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(liveRegion);
    }

    announce(message) {
      const liveRegion = document.getElementById('ferzui-live-region');
      if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      }
    }

    enhanceARIALabels() {
      // Add ARIA labels to interactive elements without labels
      document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
        if (!btn.textContent.trim()) {
          btn.setAttribute('aria-label', 'Button');
        }
      });
      
      // Enhance form controls
      document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label) {
          input.setAttribute('aria-label', input.placeholder || 'Input field');
        }
      });
    }

    setupHighContrastMode() {
      // Detect system preference
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.documentElement.setAttribute('data-high-contrast', 'true');
      }
      
      // Listen for changes
      window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-high-contrast', e.matches);
      });
      
      // Manual toggle
      const toggle = document.getElementById('toggle-high-contrast');
      if (toggle) {
        toggle.addEventListener('click', () => {
          const isHighContrast = document.documentElement.hasAttribute('data-high-contrast');
          document.documentElement.setAttribute('data-high-contrast', !isHighContrast);
        });
      }
    }

    setupFocusManagement() {
      // Visible focus indicators
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });
      
      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
      });
    }

    setupARIA() {
      // Auto-generate IDs for ARIA relationships
      document.querySelectorAll('[aria-controls]:not([id])').forEach(el => {
        el.id = `ferzui-${Math.random().toString(36).substr(2, 9)}`;
      });
      
      // Enhance modal ARIA
      document.querySelectorAll('.modal').forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
      });
      
      // Enhance dropdown ARIA
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.setAttribute('role', 'menu');
        menu.querySelectorAll('.dropdown-item').forEach(item => {
          item.setAttribute('role', 'menuitem');
        });
      });
    }
  }

  // Image Optimization
  class ImageOptimizer {
    constructor() {
      this.init();
    }

    init() {
      this.optimizeImages();
      this.setupWebPSupport();
    }

    optimizeImages() {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        this.optimizeImage(img);
      });
    }

    optimizeImage(img) {
      const src = img.dataset.src;
      if (!src) return;
      
      // Check if WebP is supported
      if (this.supportsWebP()) {
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.src = webpSrc;
      } else {
        img.src = src;
      }
      
      // Add loading="lazy" for native lazy loading
      img.loading = 'lazy';
      
      // Add error handling
      img.addEventListener('error', () => {
        img.src = src; // Fallback to original
      });
    }

    supportsWebP() {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    setupWebPSupport() {
      // Preload WebP images
      const webpImages = document.querySelectorAll('img[data-webp]');
      webpImages.forEach(img => {
        if (this.supportsWebP()) {
          img.src = img.dataset.webp;
        }
      });
    }
  }

  // Initialize all systems
  document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
    new CodeSplitter();
    new AccessibilityManager();
    new ImageOptimizer();
  });

  // Export for global access
  window.ferzui = {
    LazyLoader,
    CodeSplitter,
    AccessibilityManager,
    ImageOptimizer
  };

})();
