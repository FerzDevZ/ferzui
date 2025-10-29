/* ferzui Framework JavaScript - Modern UI Framework */

(function() {
  'use strict';

  // =============================================================================
  // UTILITIES
  // =============================================================================

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const addEvent = (element, event, handler) => {
    if (element) {
      element.addEventListener(event, handler);
    }
  };

  const addEvents = (elements, event, handler) => {
    elements.forEach(element => addEvent(element, event, handler));
  };

  const hasClass = (element, className) => {
    return element && element.classList.contains(className);
  };

  const addClass = (element, className) => {
    if (element) element.classList.add(className);
  };

  const removeClass = (element, className) => {
    if (element) element.classList.remove(className);
  };

  const toggleClass = (element, className) => {
    if (element) element.classList.toggle(className);
  };

  // =============================================================================
  // THEME SYSTEM
  // =============================================================================

  class ThemeManager {
    constructor() {
      this.themes = ['light', 'dark', 'high-contrast'];
      this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
      this.init();
    }

    init() {
      this.applyTheme(this.currentTheme);
      this.bindEvents();
    }

    getStoredTheme() {
      return localStorage.getItem('ferzui-theme');
    }

    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setStoredTheme(theme) {
      localStorage.setItem('ferzui-theme', theme);
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.currentTheme = theme;
      this.setStoredTheme(theme);
    }

    toggleTheme() {
      const currentIndex = this.themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % this.themes.length;
      this.applyTheme(this.themes[nextIndex]);
    }

    bindEvents() {
      // Theme toggle buttons
      addEvent($('#theme-light'), 'click', () => this.applyTheme('light'));
      addEvent($('#theme-dark'), 'click', () => this.applyTheme('dark'));
      addEvent($('#theme-contrast'), 'click', () => this.applyTheme('high-contrast'));
      addEvent($('#toggle-high-contrast'), 'click', () => this.toggleHighContrast());
      addEvent($('#toggle-rtl'), 'click', () => this.toggleRTL());

      // System theme change listener
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    toggleHighContrast() {
      const html = document.documentElement;
      const isHighContrast = html.hasAttribute('data-high-contrast');
      html.setAttribute('data-high-contrast', !isHighContrast);
    }

    toggleRTL() {
      const html = document.documentElement;
      const isRTL = html.getAttribute('dir') === 'rtl';
      html.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
    }
  }

  // =============================================================================
  // MODAL SYSTEM
  // =============================================================================

  class Modal {
    constructor(element) {
      this.element = element;
      this.isOpen = false;
      this.init();
    }

    init() {
      this.bindEvents();
    }

    show() {
      if (this.isOpen) return;
      
      addClass(this.element, 'show');
      addClass(document.body, 'modal-open');
      this.isOpen = true;
      
      // Focus management
      const focusableElements = this.element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      // Trigger event
      this.element.dispatchEvent(new CustomEvent('show.ferzui.modal'));
    }

    hide() {
      if (!this.isOpen) return;
      
      removeClass(this.element, 'show');
      removeClass(document.body, 'modal-open');
      this.isOpen = false;

      // Trigger event
      this.element.dispatchEvent(new CustomEvent('hide.ferzui.modal'));
    }

    toggle() {
      this.isOpen ? this.hide() : this.show();
    }

    bindEvents() {
      // Close button
      const closeBtn = this.element.querySelector('[data-dismiss="modal"]');
      addEvent(closeBtn, 'click', () => this.hide());

      // Backdrop click
      addEvent(this.element, 'click', (e) => {
        if (e.target === this.element) {
          this.hide();
        }
      });

      // Escape key
      addEvent(document, 'keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.hide();
        }
      });
    }
  }

  // =============================================================================
  // DROPDOWN SYSTEM
  // =============================================================================

  class Dropdown {
    constructor(element) {
      this.element = element;
      this.toggle = element.querySelector('[data-toggle="dropdown"]');
      this.menu = element.querySelector('.dropdown-menu');
      this.isOpen = false;
      this.init();
    }

    init() {
      this.bindEvents();
    }

    show() {
      if (this.isOpen) return;
      
      addClass(this.element, 'show');
      addClass(this.menu, 'show');
      this.isOpen = true;

      // Trigger event
      this.element.dispatchEvent(new CustomEvent('show.ferzui.dropdown'));
    }

    hide() {
      if (!this.isOpen) return;
      
      removeClass(this.element, 'show');
      removeClass(this.menu, 'show');
      this.isOpen = false;

      // Trigger event
      this.element.dispatchEvent(new CustomEvent('hide.ferzui.dropdown'));
    }

    toggle() {
      this.isOpen ? this.hide() : this.show();
    }

    bindEvents() {
      addEvent(this.toggle, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      });

      // Close on outside click
      addEvent(document, 'click', (e) => {
        if (!this.element.contains(e.target)) {
          this.hide();
        }
      });

      // Close on escape key
      addEvent(document, 'keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.hide();
        }
      });
    }
  }

  // =============================================================================
  // TOOLTIP SYSTEM
  // =============================================================================

  class Tooltip {
    constructor(element) {
      this.element = element;
      this.tooltip = null;
      this.isVisible = false;
      this.init();
    }

    init() {
      this.bindEvents();
    }

    show() {
      if (this.isVisible) return;

      const text = this.element.getAttribute('data-tooltip') || this.element.getAttribute('title');
      if (!text) return;

      this.tooltip = document.createElement('div');
      this.tooltip.className = 'tooltip';
      this.tooltip.textContent = text;
      
      document.body.appendChild(this.tooltip);
      this.positionTooltip();
      
      addClass(this.tooltip, 'show');
      this.isVisible = true;

      // Remove title to prevent browser tooltip
      this.element.setAttribute('data-original-title', this.element.getAttribute('title'));
      this.element.removeAttribute('title');
    }

    hide() {
      if (!this.isVisible) return;

      if (this.tooltip) {
        this.tooltip.remove();
        this.tooltip = null;
      }

      // Restore title
      const originalTitle = this.element.getAttribute('data-original-title');
      if (originalTitle) {
        this.element.setAttribute('title', originalTitle);
        this.element.removeAttribute('data-original-title');
      }

      this.isVisible = false;
    }

    positionTooltip() {
      if (!this.tooltip) return;

      const rect = this.element.getBoundingClientRect();
      const tooltipRect = this.tooltip.getBoundingClientRect();
      
      let top = rect.top - tooltipRect.height - 8;
      let left = rect.left + (rect.width - tooltipRect.width) / 2;

      // Adjust if tooltip goes off screen
      if (top < 0) {
        top = rect.bottom + 8;
      }
      if (left < 0) {
        left = 8;
      }
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 8;
      }

      this.tooltip.style.top = top + window.scrollY + 'px';
      this.tooltip.style.left = left + window.scrollX + 'px';
    }

    bindEvents() {
      addEvent(this.element, 'mouseenter', () => this.show());
      addEvent(this.element, 'mouseleave', () => this.hide());
      addEvent(this.element, 'focus', () => this.show());
      addEvent(this.element, 'blur', () => this.hide());
    }
  }

  // =============================================================================
  // TOAST SYSTEM
  // =============================================================================

  class Toast {
    constructor(options = {}) {
      this.options = {
        title: '',
        message: '',
        type: 'info',
        duration: 5000,
        position: 'top-right',
        ...options
      };
      this.element = null;
      this.init();
    }

    init() {
      this.createElement();
      this.show();
    }

    createElement() {
      this.element = document.createElement('div');
      this.element.className = `toast toast-${this.options.type}`;
      
      const icon = this.getIcon(this.options.type);
      this.element.innerHTML = `
        <div class="toast-content">
          <div class="toast-icon">${icon}</div>
          <div class="toast-body">
            ${this.options.title ? `<div class="toast-title">${this.options.title}</div>` : ''}
            <div class="toast-message">${this.options.message}</div>
          </div>
          <button class="toast-close" data-dismiss="toast">&times;</button>
        </div>
      `;

      this.bindEvents();
    }

    getIcon(type) {
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      return icons[type] || icons.info;
    }

    show() {
      const container = this.getContainer();
      container.appendChild(this.element);
      
      // Trigger animation
      setTimeout(() => addClass(this.element, 'show'), 10);
      
      // Auto hide
      if (this.options.duration > 0) {
        setTimeout(() => this.hide(), this.options.duration);
      }
    }

    hide() {
      if (!this.element) return;
      
      removeClass(this.element, 'show');
      setTimeout(() => {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }, 300);
    }

    getContainer() {
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      return container;
    }

    bindEvents() {
      const closeBtn = this.element.querySelector('[data-dismiss="toast"]');
      addEvent(closeBtn, 'click', () => this.hide());
    }
  }

  // =============================================================================
  // FORM VALIDATION
  // =============================================================================

  class FormValidator {
    constructor(form) {
      this.form = form;
      this.rules = {};
      this.init();
    }

    init() {
      this.bindEvents();
    }

    addRule(fieldName, rule, message) {
      if (!this.rules[fieldName]) {
        this.rules[fieldName] = [];
      }
      this.rules[fieldName].push({ rule, message });
    }

    validate() {
      let isValid = true;
      const errors = {};

      Object.keys(this.rules).forEach(fieldName => {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        const value = field.value.trim();
        const fieldErrors = [];

        this.rules[fieldName].forEach(({ rule, message }) => {
          if (!rule(value)) {
            fieldErrors.push(message);
            isValid = false;
          }
        });

        if (fieldErrors.length > 0) {
          errors[fieldName] = fieldErrors;
          this.showFieldError(field, fieldErrors[0]);
        } else {
          this.clearFieldError(field);
        }
      });

      return { isValid, errors };
    }

    showFieldError(field, message) {
      removeClass(field, 'is-valid');
      addClass(field, 'is-invalid');
      
      let errorElement = field.parentNode.querySelector('.invalid-feedback');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
    }

    clearFieldError(field) {
      removeClass(field, 'is-invalid');
      addClass(field, 'is-valid');
      
      const errorElement = field.parentNode.querySelector('.invalid-feedback');
      if (errorElement) {
        errorElement.remove();
      }
    }

    bindEvents() {
      addEvent(this.form, 'submit', (e) => {
        const validation = this.validate();
        if (!validation.isValid) {
          e.preventDefault();
        }
      });

      // Real-time validation
      const fields = this.form.querySelectorAll('input, textarea, select');
      fields.forEach(field => {
        addEvent(field, 'blur', () => {
          if (this.rules[field.name]) {
            const validation = this.validate();
          }
        });
      });
    }
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  function init() {
    // Initialize theme manager
    new ThemeManager();

    // Initialize modals
    $$('.modal').forEach(modal => new Modal(modal));

    // Initialize dropdowns
    $$('.dropdown').forEach(dropdown => new Dropdown(dropdown));

    // Initialize tooltips
    $$('[data-tooltip], [title]').forEach(element => new Tooltip(element));

    // Initialize form validation
    $$('form[data-validate]').forEach(form => {
      const validator = new FormValidator(form);
      
      // Add common validation rules
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        validator.addRule(field.name, (value) => value.length > 0, 'This field is required');
      });

      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach(field => {
        validator.addRule(field.name, (value) => {
          return value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }, 'Please enter a valid email address');
      });
    });

    // Initialize smooth scrolling
    $$('a[href^="#"]').forEach(link => {
      addEvent(link, 'click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Initialize lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      $$('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  window.ferzui = {
    Modal,
    Dropdown,
    Tooltip,
    Toast,
    FormValidator,
    init,
    
    // Utility methods
    showToast: (options) => new Toast(options),
    showModal: (selector) => {
      const modal = $(selector);
      if (modal) {
        const modalInstance = new Modal(modal);
        modalInstance.show();
      }
    }
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();