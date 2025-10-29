// ferzui Design System - Modern JavaScript Architecture
// Core framework without dependencies, data-attribute based API, event hooks

// =============================================================================
// CORE FRAMEWORK
// =============================================================================

class FerzUI {
  constructor() {
    this.components = new Map();
    this.eventListeners = new Map();
    this.instances = new Map();
    this.config = {
      prefix: 'fz',
      animationDuration: 200,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.initializeComponents();
  }
  
  bindEvents() {
    // Global event delegation
    document.addEventListener('click', this.handleGlobalClick.bind(this));
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
    document.addEventListener('focusin', this.handleGlobalFocus.bind(this));
    document.addEventListener('focusout', this.handleGlobalFocus.bind(this));
    
    // Resize observer for responsive components
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    }
    
    // Intersection observer for lazy loading
    if (window.IntersectionObserver) {
      this.intersectionObserver = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { rootMargin: '50px' }
      );
    }
  }
  
  // =============================================================================
  // COMPONENT MANAGEMENT
  // =============================================================================
  
  registerComponent(name, ComponentClass) {
    this.components.set(name, ComponentClass);
  }
  
  getComponent(name) {
    return this.components.get(name);
  }
  
  createInstance(componentName, element, options = {}) {
    const ComponentClass = this.getComponent(componentName);
    if (!ComponentClass) {
      console.warn(`Component "${componentName}" not found`);
      return null;
    }
    
    const instance = new ComponentClass(element, options);
    const id = this.generateId();
    this.instances.set(id, instance);
    element.setAttribute(`data-${this.config.prefix}-instance`, id);
    
    return instance;
  }
  
  getInstance(element) {
    const id = element.getAttribute(`data-${this.config.prefix}-instance`);
    return id ? this.instances.get(id) : null;
  }
  
  destroyInstance(element) {
    const instance = this.getInstance(element);
    if (instance) {
      instance.destroy();
      const id = element.getAttribute(`data-${this.config.prefix}-instance`);
      this.instances.delete(id);
      element.removeAttribute(`data-${this.config.prefix}-instance`);
    }
  }
  
  // =============================================================================
  // EVENT SYSTEM
  // =============================================================================
  
  on(event, callback, options = {}) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push({ callback, options });
  }
  
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.findIndex(listener => listener.callback === callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  emit(event, detail = {}) {
    const customEvent = new CustomEvent(`fz:${event}`, {
      detail,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(customEvent);
    
    // Trigger registered callbacks
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(({ callback, options }) => {
        try {
          callback(detail, options);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }
  
  // =============================================================================
  // UTILITY METHODS
  // =============================================================================
  
  generateId() {
    return `fz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // =============================================================================
  // GLOBAL EVENT HANDLERS
  // =============================================================================
  
  handleGlobalClick(event) {
    const target = event.target.closest('[data-fz-component]');
    if (target) {
      const componentName = target.getAttribute('data-fz-component');
      const instance = this.getInstance(target) || this.createInstance(componentName, target);
      if (instance && typeof instance.handleClick === 'function') {
        instance.handleClick(event);
      }
    }
  }
  
  handleGlobalKeydown(event) {
    // Handle keyboard navigation
    if (event.key === 'Escape') {
      this.emit('escape');
    }
    
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target.closest('[data-fz-component]');
      if (target) {
        const instance = this.getInstance(target);
        if (instance && typeof instance.handleKeydown === 'function') {
          instance.handleKeydown(event);
        }
      }
    }
  }
  
  handleGlobalFocus(event) {
    const target = event.target.closest('[data-fz-component]');
    if (target) {
      const instance = this.getInstance(target);
      if (instance && typeof instance.handleFocus === 'function') {
        instance.handleFocus(event);
      }
    }
  }
  
  handleResize(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      const instance = this.getInstance(element);
      if (instance && typeof instance.handleResize === 'function') {
        instance.handleResize(entry);
      }
    });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      const instance = this.getInstance(element);
      if (instance && typeof instance.handleIntersection === 'function') {
        instance.handleIntersection(entry);
      }
    });
  }
  
  // =============================================================================
  // COMPONENT INITIALIZATION
  // =============================================================================
  
  initializeComponents() {
    // Auto-initialize components based on data attributes
    const componentElements = document.querySelectorAll('[data-fz-component]');
    componentElements.forEach(element => {
      const componentName = element.getAttribute('data-fz-component');
      if (!this.getInstance(element)) {
        this.createInstance(componentName, element);
      }
    });
  }
  
  // =============================================================================
  // PUBLIC API
  // =============================================================================
  
  destroy() {
    // Clean up all instances
    this.instances.forEach(instance => {
      if (typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });
    this.instances.clear();
    
    // Clean up observers
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Clean up event listeners
    this.eventListeners.clear();
  }
}

// =============================================================================
// BASE COMPONENT CLASS
// =============================================================================

class BaseComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...this.getDefaultOptions(), ...options };
    this.state = {};
    this.eventListeners = [];
    this.observers = [];
    
    this.init();
  }
  
  getDefaultOptions() {
    return {};
  }
  
  init() {
    this.bindEvents();
    this.setupObservers();
    this.render();
  }
  
  bindEvents() {
    // Override in subclasses
  }
  
  setupObservers() {
    // Override in subclasses
  }
  
  render() {
    // Override in subclasses
  }
  
  updateState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.onStateChange(prevState, this.state);
  }
  
  onStateChange(prevState, newState) {
    // Override in subclasses
  }
  
  emit(event, detail = {}) {
    const customEvent = new CustomEvent(`fz:${this.constructor.name.toLowerCase()}:${event}`, {
      detail: { ...detail, component: this },
      bubbles: true,
      cancelable: true
    });
    this.element.dispatchEvent(customEvent);
  }
  
  addEventListener(event, callback, options = {}) {
    this.element.addEventListener(event, callback, options);
    this.eventListeners.push({ event, callback, options });
  }
  
  removeEventListener(event, callback) {
    this.element.removeEventListener(event, callback);
    const index = this.eventListeners.findIndex(
      listener => listener.event === event && listener.callback === callback
    );
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }
  
  destroy() {
    // Remove all event listeners
    this.eventListeners.forEach(({ event, callback }) => {
      this.element.removeEventListener(event, callback);
    });
    this.eventListeners = [];
    
    // Disconnect observers
    this.observers.forEach(observer => {
      if (typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    });
    this.observers = [];
    
    // Emit destroy event
    this.emit('destroy');
  }
}

// =============================================================================
// MODAL COMPONENT
// =============================================================================

class Modal extends BaseComponent {
  getDefaultOptions() {
    return {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      onShow: null,
      onHide: null,
      onShown: null,
      onHidden: null
    };
  }
  
  init() {
    super.init();
    this.backdrop = null;
    this.focusableElements = [];
    this.previouslyFocusedElement = null;
    
    if (this.options.show) {
      this.show();
    }
  }
  
  bindEvents() {
    // Close button
    const closeBtn = this.element.querySelector('[data-fz-dismiss="modal"]');
    if (closeBtn) {
      this.addEventListener('click', this.handleCloseClick.bind(this));
    }
    
    // Backdrop click
    if (this.options.backdrop) {
      this.addEventListener('click', this.handleBackdropClick.bind(this));
    }
    
    // Keyboard events
    if (this.options.keyboard) {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }
  
  show() {
    if (this.state.showing) return;
    
    this.previouslyFocusedElement = document.activeElement;
    this.updateState({ showing: true });
    
    // Create backdrop
    if (this.options.backdrop) {
      this.createBackdrop();
    }
    
    // Show modal
    this.element.classList.add('show');
    document.body.classList.add('modal-open');
    
    // Focus management
    if (this.options.focus) {
      this.trapFocus();
    }
    
    // Callbacks
    if (this.options.onShow) {
      this.options.onShow(this);
    }
    
    this.emit('show');
    
    // Animation
    requestAnimationFrame(() => {
      this.element.classList.add('fade-in');
      if (this.options.onShown) {
        setTimeout(() => this.options.onShown(this), this.config.animationDuration);
      }
      this.emit('shown');
    });
  }
  
  hide() {
    if (!this.state.showing) return;
    
    this.updateState({ showing: false });
    
    // Hide modal
    this.element.classList.remove('show', 'fade-in');
    document.body.classList.remove('modal-open');
    
    // Remove backdrop
    if (this.backdrop) {
      this.backdrop.remove();
      this.backdrop = null;
    }
    
    // Restore focus
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
    
    // Callbacks
    if (this.options.onHide) {
      this.options.onHide(this);
    }
    
    this.emit('hide');
    
    setTimeout(() => {
      if (this.options.onHidden) {
        this.options.onHidden(this);
      }
      this.emit('hidden');
    }, this.config.animationDuration);
  }
  
  createBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.setAttribute('data-fz-dismiss', 'modal');
    document.body.appendChild(this.backdrop);
  }
  
  trapFocus() {
    this.focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }
  
  handleCloseClick(event) {
    if (event.target.hasAttribute('data-fz-dismiss')) {
      this.hide();
    }
  }
  
  handleBackdropClick(event) {
    if (event.target === this.element || event.target === this.backdrop) {
      this.hide();
    }
  }
  
  handleKeydown(event) {
    if (event.key === 'Escape' && this.state.showing) {
      this.hide();
    }
    
    if (event.key === 'Tab' && this.state.showing) {
      this.handleTabKey(event);
    }
  }
  
  handleTabKey(event) {
    if (this.focusableElements.length === 0) return;
    
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

// =============================================================================
// DROPDOWN COMPONENT
// =============================================================================

class Dropdown extends BaseComponent {
  getDefaultOptions() {
    return {
      autoClose: true,
      boundary: 'viewport',
      display: 'dynamic',
      offset: [0, 8],
      placement: 'bottom-start',
      trigger: 'click',
      onShow: null,
      onHide: null
    };
  }
  
  init() {
    super.init();
    this.menu = this.element.querySelector('.dropdown-menu');
    this.toggle = this.element.querySelector('[data-fz-toggle="dropdown"]');
    
    if (!this.menu || !this.toggle) {
      console.warn('Dropdown requires .dropdown-menu and [data-fz-toggle="dropdown"]');
      return;
    }
  }
  
  bindEvents() {
    if (this.options.trigger === 'click') {
      this.toggle.addEventListener('click', this.handleToggleClick.bind(this));
    } else if (this.options.trigger === 'hover') {
      this.element.addEventListener('mouseenter', this.show.bind(this));
      this.element.addEventListener('mouseleave', this.hide.bind(this));
    }
    
    // Close on outside click
    if (this.options.autoClose) {
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }
  }
  
  show() {
    if (this.state.showing) return;
    
    this.updateState({ showing: true });
    this.positionMenu();
    this.menu.classList.add('show');
    this.toggle.setAttribute('aria-expanded', 'true');
    
    if (this.options.onShow) {
      this.options.onShow(this);
    }
    
    this.emit('show');
  }
  
  hide() {
    if (!this.state.showing) return;
    
    this.updateState({ showing: false });
    this.menu.classList.remove('show');
    this.toggle.setAttribute('aria-expanded', 'false');
    
    if (this.options.onHide) {
      this.options.onHide(this);
    }
    
    this.emit('hide');
  }
  
  toggle() {
    if (this.state.showing) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  positionMenu() {
    const toggleRect = this.toggle.getBoundingClientRect();
    const menuRect = this.menu.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    let top = toggleRect.bottom + this.options.offset[1];
    let left = toggleRect.left + this.options.offset[0];
    
    // Adjust for viewport boundaries
    if (left + menuRect.width > viewport.width) {
      left = viewport.width - menuRect.width - 8;
    }
    
    if (top + menuRect.height > viewport.height) {
      top = toggleRect.top - menuRect.height - this.options.offset[1];
    }
    
    this.menu.style.position = 'absolute';
    this.menu.style.top = `${top}px`;
    this.menu.style.left = `${left}px`;
  }
  
  handleToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggle();
  }
  
  handleOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.hide();
    }
  }
}

// =============================================================================
// TOAST COMPONENT
// =============================================================================

class Toast extends BaseComponent {
  getDefaultOptions() {
    return {
      autohide: true,
      delay: 5000,
      position: 'bottom-right',
      animation: true,
      onShow: null,
      onHide: null
    };
  }
  
  init() {
    super.init();
    this.container = this.getOrCreateContainer();
    this.progressBar = this.element.querySelector('.toast-progress');
    
    if (this.options.autohide) {
      this.startTimer();
    }
  }
  
  bindEvents() {
    const closeBtn = this.element.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', this.hide.bind(this));
    }
  }
  
  show() {
    this.container.appendChild(this.element);
    this.element.classList.add('show');
    
    if (this.options.onShow) {
      this.options.onShow(this);
    }
    
    this.emit('show');
  }
  
  hide() {
    this.element.classList.add('hide');
    
    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      
      if (this.options.onHide) {
        this.options.onHide(this);
      }
      
      this.emit('hide');
    }, this.config.animationDuration);
  }
  
  startTimer() {
    if (this.progressBar) {
      this.progressBar.style.transition = `width ${this.options.delay}ms linear`;
      this.progressBar.style.width = '0%';
      
      setTimeout(() => {
        this.progressBar.style.width = '100%';
      }, 10);
    }
    
    this.timer = setTimeout(() => {
      this.hide();
    }, this.options.delay);
  }
  
  getOrCreateContainer() {
    let container = document.querySelector(`.toast-container.position-${this.options.position}`);
    
    if (!container) {
      container = document.createElement('div');
      container.className = `toast-container position-${this.options.position} stack-down`;
      document.body.appendChild(container);
    }
    
    return container;
  }
}

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================

class Tooltip extends BaseComponent {
  getDefaultOptions() {
    return {
      placement: 'top',
      trigger: 'hover',
      delay: 200,
      offset: [0, 8],
      boundary: 'viewport',
      onShow: null,
      onHide: null
    };
  }
  
  init() {
    super.init();
    this.tooltip = null;
    this.showTimeout = null;
    this.hideTimeout = null;
  }
  
  bindEvents() {
    if (this.options.trigger === 'hover') {
      this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    } else if (this.options.trigger === 'click') {
      this.element.addEventListener('click', this.handleClick.bind(this));
    }
    
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }
  
  show() {
    if (this.state.showing) return;
    
    this.createTooltip();
    this.positionTooltip();
    this.tooltip.classList.add('show');
    this.updateState({ showing: true });
    
    if (this.options.onShow) {
      this.options.onShow(this);
    }
    
    this.emit('show');
  }
  
  hide() {
    if (!this.state.showing || !this.tooltip) return;
    
    this.tooltip.classList.remove('show');
    this.updateState({ showing: false });
    
    setTimeout(() => {
      if (this.tooltip && this.tooltip.parentNode) {
        this.tooltip.parentNode.removeChild(this.tooltip);
        this.tooltip = null;
      }
    }, this.config.animationDuration);
    
    if (this.options.onHide) {
      this.options.onHide(this);
    }
    
    this.emit('hide');
  }
  
  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = `tooltip tooltip-${this.options.placement}`;
    this.tooltip.textContent = this.element.getAttribute('data-fz-tooltip') || this.element.title;
    
    document.body.appendChild(this.tooltip);
  }
  
  positionTooltip() {
    const elementRect = this.element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    let top, left;
    
    switch (this.options.placement) {
      case 'top':
        top = elementRect.top - tooltipRect.height - this.options.offset[1];
        left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = elementRect.bottom + this.options.offset[1];
        left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
        left = elementRect.left - tooltipRect.width - this.options.offset[0];
        break;
      case 'right':
        top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
        left = elementRect.right + this.options.offset[0];
        break;
    }
    
    // Adjust for viewport boundaries
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewport.width - 8) {
      left = viewport.width - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewport.height - 8) {
      top = viewport.height - tooltipRect.height - 8;
    }
    
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }
  
  handleMouseEnter() {
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.options.delay);
  }
  
  handleMouseLeave() {
    clearTimeout(this.showTimeout);
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 100);
  }
  
  handleClick(event) {
    event.preventDefault();
    this.toggle();
  }
  
  handleOutsideClick(event) {
    if (!this.element.contains(event.target) && !this.tooltip?.contains(event.target)) {
      this.hide();
    }
  }
  
  toggle() {
    if (this.state.showing) {
      this.hide();
    } else {
      this.show();
    }
  }
}

// =============================================================================
// INITIALIZE FRAMEWORK
// =============================================================================

// Create global instance
const fz = new FerzUI();

// Register components
fz.registerComponent('modal', Modal);
fz.registerComponent('dropdown', Dropdown);
fz.registerComponent('toast', Toast);
fz.registerComponent('tooltip', Tooltip);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FerzUI, BaseComponent, Modal, Dropdown, Toast, Tooltip };
}

// Global access
window.FerzUI = fz;
window.fz = fz;
