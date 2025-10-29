/**
 * ferzui - Modern UI Framework
 * @version 1.0.0
 * @author FerzDevZ
 * @license MIT
 */

declare module 'ferzui' {
  /**
   * Main ferzui object
   */
  export interface Ferzui {
    version: string;
    init(): void;
    destroy(): void;
  }

  /**
   * Component base interface
   */
  export interface Component {
    element: HTMLElement;
    init(): void;
    destroy(): void;
    show(): void;
    hide(): void;
  }

  /**
   * Modal component
   */
  export interface Modal extends Component {
    show(): void;
    hide(): void;
    toggle(): void;
  }

  /**
   * Dropdown component
   */
  export interface Dropdown extends Component {
    show(): void;
    hide(): void;
    toggle(): void;
  }

  /**
   * Toast component
   */
  export interface Toast extends Component {
    show(): void;
    hide(): void;
    setMessage(message: string): void;
  }

  /**
   * Tooltip component
   */
  export interface Tooltip extends Component {
    show(): void;
    hide(): void;
    setContent(content: string): void;
  }

  /**
   * Popover component
   */
  export interface Popover extends Component {
    show(): void;
    hide(): void;
    setContent(content: string): void;
  }

  /**
   * Carousel component
   */
  export interface Carousel extends Component {
    next(): void;
    prev(): void;
    goTo(index: number): void;
    getCurrentIndex(): number;
  }

  /**
   * Accordion component
   */
  export interface Accordion extends Component {
    show(index: number): void;
    hide(index: number): void;
    toggle(index: number): void;
  }

  /**
   * Tabs component
   */
  export interface Tabs extends Component {
    show(index: number): void;
    hide(index: number): void;
    toggle(index: number): void;
  }

  /**
   * Offcanvas component
   */
  export interface Offcanvas extends Component {
    show(): void;
    hide(): void;
    toggle(): void;
  }

  /**
   * Component options
   */
  export interface ComponentOptions {
    [key: string]: any;
  }

  /**
   * Event callback
   */
  export type EventCallback = (event: Event) => void;

  /**
   * Component constructor
   */
  export interface ComponentConstructor {
    new (element: HTMLElement, options?: ComponentOptions): Component;
  }

  /**
   * Global ferzui object
   */
  export const ferzui: Ferzui;

  /**
   * Component constructors
   */
  export const Modal: ComponentConstructor;
  export const Dropdown: ComponentConstructor;
  export const Toast: ComponentConstructor;
  export const Tooltip: ComponentConstructor;
  export const Popover: ComponentConstructor;
  export const Carousel: ComponentConstructor;
  export const Accordion: ComponentConstructor;
  export const Tabs: ComponentConstructor;
  export const Offcanvas: ComponentConstructor;

  /**
   * Utility functions
   */
  export function createComponent<T extends Component>(
    constructor: ComponentConstructor,
    element: HTMLElement,
    options?: ComponentOptions
  ): T;

  export function destroyComponent(component: Component): void;

  export function getComponent(element: HTMLElement): Component | null;

  export function getAllComponents(): Component[];

  /**
   * Theme functions
   */
  export function setTheme(theme: 'light' | 'dark' | 'auto'): void;

  export function getTheme(): 'light' | 'dark' | 'auto';

  export function toggleTheme(): void;

  /**
   * RTL functions
   */
  export function setRTL(rtl: boolean): void;

  export function isRTL(): boolean;

  export function toggleRTL(): void;

  /**
   * High contrast functions
   */
  export function setHighContrast(highContrast: boolean): void;

  export function isHighContrast(): boolean;

  export function toggleHighContrast(): void;
}

declare global {
  interface Window {
    ferzui: typeof import('ferzui');
  }
}

export {};
