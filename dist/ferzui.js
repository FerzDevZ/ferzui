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
// ferzui v0.1.0 - core JS interactions
(function(){
  function qs(sel,root=document){return root.querySelector(sel)}
  function qsa(sel,root=document){return Array.from(root.querySelectorAll(sel))}

  // Modal
  qsa([data-fz-modal-target]).forEach(btn=>{
    btn.addEventListener(click,()=>{
      const target = btn.getAttribute(data-fz-modal-target)
      const el = qs(target)
      if(el){ el.classList.add(show) }
    })
  })
  qsa([data-fz-dismiss=modal]).forEach(btn=>{
    btn.addEventListener(click,()=>{
      const backdrop = btn.closest(.modal-backdrop)
      if(backdrop){ backdrop.classList.remove(show) }
    })
  })

  // Dropdown
  qsa([data-fz-toggle=dropdown]).forEach(toggle=>{
    toggle.addEventListener(click,()=>{
      const menu = toggle.nextElementSibling
      if(menu && menu.classList.contains(dropdown-menu)){
        menu.classList.toggle(show)
      }
    })
  })
  document.addEventListener(click,(e)=>{
    qsa(.dropdown-menu.show).forEach(menu=>{
      if(!menu.contains(e.target) && !menu.previousElementSibling?.contains(e.target)){
        menu.classList.remove(show)
      }
    })
  })

  // Collapse
  qsa([data-fz-toggle=collapse]).forEach(toggle=>{
    const targetSel = toggle.getAttribute(data-fz-target)
    toggle.addEventListener(click,()=>{
      const target = targetSel ? qs(targetSel) : null
      if(target){ target.classList.toggle(show) }
    })
  })

  // Toast
  function ensureToastStack(){
    let stack = qs(.toast-stack)
    if(!stack){
      stack = document.createElement(div)
      stack.className = toast-stack
      document.body.appendChild(stack)
    }
    return stack
  }
  function showToast(message,{timeout=3000}={}){
    const stack = ensureToastStack()
    const el = document.createElement(div)
    el.className = toast
    el.textContent = message
    stack.appendChild(el)
    setTimeout(()=>{ el.remove() }, timeout)
  }
  window.ferzui = { showToast }
})()
(function(){
  function qs(a,b){return (b||document).querySelector(a)}
  function qsa(a,b){return Array.from((b||document).querySelectorAll(a))}
  function on(el,ev,fn){el.addEventListener(ev,fn)}
  function Modal(root){
    this.root = root; this.backdrop = root.querySelector('.modal-backdrop'); this.dialog = root.querySelector('.modal-dialog');
    var self=this;
    this.show = function(){ self.root.classList.add('show'); self.root.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
    this.hide = function(){ self.root.classList.remove('show'); self.root.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
    on(this.root,'click',function(e){ if(e.target===self.root || e.target===self.backdrop){ self.hide(); }});
    on(document,'keydown',function(e){ if(e.key==='Escape' && self.root.classList.contains('show')) self.hide(); });
  }
  function Dropdown(toggle){
    this.toggle = toggle; this.menu = toggle.nextElementSibling;
    var self=this;
    this.open=function(){ self.menu.classList.add('show'); };
    this.close=function(){ self.menu.classList.remove('show'); };
    this.toggleMenu=function(){ self.menu.classList.toggle('show'); };
    on(document,'click',function(e){ if(!self.menu.contains(e.target) && !self.toggle.contains(e.target)) self.close(); });
    on(toggle,'click',function(e){ e.preventDefault(); self.toggleMenu(); });
  }
  function Collapse(toggle){
    this.target = qs(toggle.getAttribute('data-target'));
    var self=this;
    this.toggle=function(){ if(!self.target) return; var open=self.target.getAttribute('data-open')==='true';
      if(open){ self.target.style.height='0px'; self.target.setAttribute('data-open','false'); }
      else { self.target.style.height=self.target.scrollHeight+'px'; self.target.setAttribute('data-open','true'); }
    };
    on(toggle,'click',function(e){ e.preventDefault(); self.toggle(); });
  }
  function initModals(){ qsa('[data-modal]').forEach(function(el){ var m=new Modal(el); qsa('[data-modal-open=#+el.id+]').forEach(function(btn){ on(btn,'click',function(){ m.show(); }); }); qsa('[data-modal-close]',el).forEach(function(btn){ on(btn,'click',function(){ m.hide(); }); }); }); }
  function initDropdowns(){ qsa('[data-dropdown]').forEach(function(t){ new Dropdown(t); }); }
  function initCollapses(){ qsa('[data-collapse]').forEach(function(t){ new Collapse(t); }); }
  function initAll(){ initModals(); initDropdowns(); initCollapses(); }
  window.ferzui = { initAll: initAll };
  if(document.readyState!=='loading') initAll(); else on(document,'DOMContentLoaded',initAll);
})();
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
