# Changelog
## [1.3.0] - 2025-01-28

### Fixed
- 🔧 **Critical SCSS Compilation Fixes**: Fixed "expected ':'" error in `$shadows` map by properly wrapping multi-value shadow definitions
- 🎯 **Responsive Class Name Escaping**: Added `escape-class-name()` function to correctly escape numeric breakpoint names (e.g., `2xl`) in CSS selectors
- 🏗️ **Build System Improvements**: Ensured all SCSS files compile successfully without syntax errors
- 📦 **CSS Output**: Fixed broken CSS compilation that was preventing styles from loading on documentation and demo pages

### Technical Improvements
- ✅ Fixed shadow map syntax in `src/scss/core/_variables.scss` for `sm`, `base`, `md`, `lg`, and `glow` values
- ✅ Added responsive class name escaping for all breakpoint utilities across all SCSS modules
- ✅ Updated all responsive utility classes to use proper escaping for numeric breakpoints
- ✅ Verified successful CSS compilation to `dist/ferzui.css` without errors

### Breaking Changes
- None

---

## [1.2.0] - 2025-10-29

### Added
- 📚 Comprehensive docs overhaul: Forms, Content, Utilities API, Layout with copyable code blocks
- 🧩 Batch 1 components fully showcased in demo: Segmented, Toggle, Rating, Stepper, Drawer, Sortable Table, Collapsible Sidebar
- 🧰 Batch 2 helpers in demo/docs: Masonry, Split View, Skip Link, Reduced Motion, Focus Trap
- ✨ Lightweight docs JS for Popover, Carousel, and Collapse examples

### Improved
- 🎨 Unified, responsive documentation layout injected via `docs/assets/docs.js`
- 🔗 Sidebar navigation, TOC, and Lunr-powered search improvements
- ⚡ CDN-first CSS/JS with robust local fallbacks across site, demo, and docs

### Fixed
- 🧱 Inconsistent examples and missing styles on GitHub Pages by switching to CDN-first includes
- 🧩 Ensured all demo interactions function on mobile devices


All notable changes to ferzui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-27

### Added
- 🏗️ Professional template system dengan 4 template lengkap:
  - 📊 Dashboard template dengan sidebar, stats grid, dan charts
  - 🔐 Auth template dengan login/register dan social login
  - 💰 Pricing template dengan toggle monthly/yearly dan FAQ
  - 🚀 Landing page template dengan hero section dan features
- 📚 Extended documentation dengan navigasi yang lebih baik
- 🎨 Professional styling untuk semua template
- 📱 Responsive design untuk semua device
- ⚡ Interactive components dengan JavaScript
- 🎯 Better navigation structure dengan kategori yang jelas

### Improved
- 📚 Documentation structure dengan sidebar yang lebih terorganisir
- 🎨 UI/UX yang lebih profesional dan modern
- 🔗 Navigation yang lebih intuitif antar halaman
- 📖 Content yang lebih lengkap dan informatif
- 🎮 Better user experience di semua halaman

### Fixed
- 📄 Empty pages yang sekarang memiliki konten lengkap
- 🔗 Navigation links yang tidak terhubung
- 📚 Documentation yang tidak lengkap
- 🎨 Inconsistent styling across pages
- 📱 Mobile responsiveness issues

## [1.0.1] - 2025-01-27

### Added
- 🎮 Interactive Playground dengan 30+ komponen
- 📚 Dokumentasi yang lebih lengkap dan terstruktur
- 🚀 Live Demo yang interaktif seperti Bootstrap
- 🎨 UI/UX yang lebih modern dan profesional
- 🔗 Navigasi yang jelas antar halaman
- 📖 Panduan instalasi dan penggunaan yang detail

### Improved
- 🎯 Navbar dengan arah dan button yang lebih jelas
- 📱 Responsive design yang lebih baik
- 🎨 Design system yang lebih konsisten
- ⚡ Performance yang lebih optimal
- 📚 Dokumentasi yang lebih mudah dipahami

### Fixed
- 🔗 Routes dan navigasi antar halaman
- 📖 Struktur dokumentasi yang lebih logis
- 🎮 Playground yang lebih kompleks dan lengkap
- 🎨 UI/UX yang lebih menarik dan modern

## [1.0.0] - 2025-01-27

### Added
- 🎉 Initial release of ferzui framework
- 🧩 120+ components including basic, extended, varied, communication, entertainment, and business components
- 🎨 Modern design system with glassmorphism and gradient effects
- 🌙 Dark mode support with automatic theme detection
- ♿ Full accessibility compliance (WCAG AA)
- ⚡ Performance optimized with lazy loading and code splitting
- 📱 Fully responsive design for all devices
- 🎮 Interactive playground for component testing
- 📚 Comprehensive documentation with examples
- 🔧 Easy customization with CSS variables
- 🌍 RTL (Right-to-Left) language support
- 🎯 High contrast mode for accessibility
- 📊 Advanced search with highlighting and categorization
- 🎨 Theme editor for live customization
- 📋 Migration guide from Bootstrap/Tailwind
- 📄 Ready-to-use templates (Dashboard, Auth, Pricing, Landing)

### Components Added
- **Basic Components**: Buttons, Cards, Forms, Alerts, Badges, Progress, Modal, Dropdown, Tabs, Accordion, Carousel, Navbar, Breadcrumb, Pagination, Table, List Group, Spinner, Tooltip, Popover, Toast, Offcanvas
- **Extended Components**: Avatar, Skeleton, Timeline, Empty State, Stats Cards, Advanced Table, Charts, Date Picker, File Upload, Advanced Select, Steps, Space, Divider, Stack
- **Varied Components**: Image Gallery, Video Player, Audio Player, Gamepad Controller, Scoreboard, Leaderboard, Product Card, Shopping Cart, Comments System, Rating System, Calendar, Task Manager, Notes App
- **Communication Components**: Chat Interface, Video Call Interface, Voice Chat Interface, Notification Center, Message Types, Chat Themes
- **Entertainment Components**: Music Player, Video Gallery, Game Components, Social Media Post, Streaming Player
- **Business Components**: Data Tables, Kanban Board, Pricing Tables, Feature Sections, Testimonials Carousel, Contact Forms, Admin Dashboard Widgets, E-commerce Product Grid, Blog Post Layouts, User Profile Cards, Analytics Dashboards

### Features
- 🎨 **Design System**: Consistent typography, spacing, colors, and components
- 🌈 **Color System**: Extended color palette with 50-900 shades for all colors
- 📐 **Layout System**: Responsive grid system with containers and utilities
- ⚡ **Performance**: Tree-shaking support, lazy loading, and optimized builds
- 🔧 **Customization**: CSS variables for easy theming and customization
- 📱 **Responsive**: Mobile-first approach with breakpoints
- ♿ **Accessibility**: ARIA support, keyboard navigation, screen reader compatibility
- 🌍 **Internationalization**: RTL support and multi-language ready
- 🎮 **Interactive**: JavaScript components with event hooks and instance registry
- 📊 **Advanced**: Search functionality, theme editor, and interactive playground

### Technical Details
- **CSS**: Modern CSS with custom properties, flexbox, and grid
- **JavaScript**: Vanilla JS with ES6+ features, no dependencies
- **SCSS**: Modular SCSS architecture with mixins and functions
- **Build**: Simple build process with concatenation and minification
- **CDN**: Ready for CDN distribution
- **NPM**: Full NPM package with proper exports and types
- **GitHub Pages**: Ready for GitHub Pages hosting

### Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

### Installation
```bash
# NPM
npm install ferzui

# CDN
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ferzui@latest/dist/ferzui.css">
<script src="https://cdn.jsdelivr.net/npm/ferzui@latest/dist/ferzui.js"></script>
```

### Documentation
- 📚 [Getting Started](https://ferzdevz.github.io/ferzui/)
- 🧩 [Components](https://ferzdevz.github.io/ferzui/docs/components.html)
- ⚡ [Utilities](https://ferzdevz.github.io/ferzui/docs/utilities.html)
- 🎮 [Playground](https://ferzdevz.github.io/ferzui/docs/playground.html)
- 🔧 [Customization](https://ferzdevz.github.io/ferzui/docs/customize.html)

### Repository
- 🐙 [GitHub](https://github.com/FerzDevZ/ferzui)
- 📦 [NPM](https://www.npmjs.com/package/ferzui)
- 🌐 [Homepage](https://ferzdevz.github.io/ferzui/)

---

## [Unreleased]

### Planned Features
- 🔄 Component variants and themes
- 📊 More chart types and data visualization
- 🎨 Additional design tokens and customization options
- 🌍 More language support and internationalization
- ⚡ Performance improvements and optimizations
- 🧪 Unit tests and testing utilities
- 📱 Progressive Web App (PWA) support
- 🔌 Plugin system for extending components
