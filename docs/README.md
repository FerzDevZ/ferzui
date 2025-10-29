# ferzui - Modern UI Framework

ferzui adalah framework UI modern yang lebih baik dari Bootstrap dengan 80+ komponen, dark mode, dan performa tinggi untuk aplikasi web masa depan.

## 🚀 Quick Start

### CDN (Recommended)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.js"></script>
```

### NPM

```bash
npm install ferzui
```

```javascript
import 'ferzui/dist/ferzui.css';
import 'ferzui/dist/ferzui.js';
```

## 📚 Documentation

- [Getting Started](https://ferzdevz.github.io/ferzui/docs/index.html)
- [Components](https://ferzdevz.github.io/ferzui/docs/components.html)
- [Utilities](https://ferzdevz.github.io/ferzui/docs/utilities.html)
- [Customize](https://ferzdevz.github.io/ferzui/docs/customize.html)
- [JavaScript](https://ferzdevz.github.io/ferzui/docs/javascript.html)
- [Templates](https://ferzdevz.github.io/ferzui/docs/templates/dashboard.html)
- [Playground](https://ferzdevz.github.io/ferzui/docs/playground.html)

## 🎮 Live Demo

[View Live Demo](https://ferzdevz.github.io/ferzui/demo/index.html)

## 🎨 Features

- **80+ Components** - Button, Card, Form, Table, Modal, Toast, dan banyak lagi
- **Modern Design** - Glassmorphism, gradients, dan animasi yang smooth
- **Dark Mode** - Support otomatis dengan prefers-color-scheme
- **Mobile First** - Responsive design untuk semua perangkat
- **High Performance** - Optimized dengan lazy loading dan code splitting
- **Accessible** - WCAG AA compliant dengan keyboard navigation
- **Customizable** - CSS variables dan SCSS mixins
- **Zero Dependencies** - Tidak memerlukan library eksternal

## 📦 Installation

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.css">
<script src="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.js"></script>
```

### NPM

```bash
npm install ferzui
```

### Download

[Download Latest Release](https://github.com/FerzDevZ/ferzui/releases/latest)

## 🎯 Quick Start

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ferzui App</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.css">
</head>
<body>
  <div class="container">
    <h1>Hello ferzui!</h1>
    <button class="btn btn-primary">Primary Button</button>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Card Title</h5>
        <p class="card-text">This is a card component from ferzui.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.js"></script>
</body>
</html>
```

## 🎨 Components

### Basic Components
- **Buttons** - Primary, secondary, outline, ghost variants
- **Cards** - Headers, bodies, footers, images
- **Forms** - Input, select, textarea, validation
- **Tables** - Responsive, striped, hover effects
- **Alerts** - Success, warning, danger, info
- **Badges** - Status indicators dan labels

### Navigation
- **Navbar** - Responsive navigation dengan dropdown
- **Breadcrumb** - Hierarchical navigation
- **Pagination** - Numbered pagination dengan info
- **Tabs** - Underline, pilled, card variants
- **Accordion** - Collapsible content sections

### Feedback
- **Modal** - Overlay dialogs dengan backdrop
- **Toast** - Notification messages dengan queue
- **Tooltip** - Contextual information
- **Progress** - Loading bars dan spinners
- **Skeleton** - Loading placeholders

### Advanced Components
- **Data Tables** - Sorting, filtering, pagination
- **Charts** - Bar, line, pie charts
- **Timeline** - Event timeline dengan states
- **Calendar** - Monthly calendar dengan events
- **File Upload** - Drag & drop file uploader
- **Rating System** - Star ratings dengan breakdown

### Gaming Components
- **Gamepad** - Virtual game controller
- **Scoreboard** - Game scores dan timer
- **Leaderboard** - Player rankings

### E-commerce
- **Product Cards** - E-commerce product display
- **Shopping Cart** - Cart management
- **Checkout** - Payment flow

### Social
- **Comments** - Nested comment system
- **Reviews** - Product reviews
- **Rating** - Star rating system

### Productivity
- **Task Manager** - Todo list dengan completion
- **Notes App** - Rich text editor
- **Calendar** - Event management

## 🎨 Theming

ferzui menggunakan CSS variables untuk theming yang mudah:

```css
:root {
  --fz-c-primary-500: #3b82f6;
  --fz-c-primary-600: #2563eb;
  --fz-c-primary-700: #1d4ed8;
  --fz-c-success-500: #22c55e;
  --fz-c-warning-500: #f59e0b;
  --fz-c-danger-500: #ef4444;
  --fz-c-info-500: #0ea5e9;
}
```

### Dark Mode

```css
[data-theme="dark"] {
  --fz-c-bg: #111827;
  --fz-c-surface: #1f2937;
  --fz-c-text: #f9fafb;
  --fz-c-text-muted: #9ca3af;
}
```

## 📱 Responsive Design

ferzui menggunakan mobile-first approach dengan breakpoints:

```css
/* Mobile First */
.container { max-width: 100%; }

/* Small devices (landscape phones) */
@media (min-width: 576px) {
  .container { max-width: 540px; }
}

/* Medium devices (tablets) */
@media (min-width: 768px) {
  .container { max-width: 720px; }
}

/* Large devices (desktops) */
@media (min-width: 992px) {
  .container { max-width: 960px; }
}

/* Extra large devices */
@media (min-width: 1200px) {
  .container { max-width: 1140px; }
}
```

## ♿ Accessibility

ferzui dibangun dengan accessibility sebagai prioritas:

- **WCAG AA Compliant** - Memenuhi standar accessibility
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels dan descriptions
- **High Contrast** - Mode kontras tinggi
- **Focus Management** - Focus trap untuk modal
- **Skip Links** - Skip to content links

## ⚡ Performance

- **Tree Shaking** - Hanya import yang digunakan
- **Lazy Loading** - Komponen dimuat saat diperlukan
- **Code Splitting** - Bundle terpisah untuk setiap fitur
- **Critical CSS** - CSS kritis di-inline
- **Minification** - CSS dan JS di-minify
- **WebP Support** - Format gambar modern

## 🔧 Customization

### SCSS Variables

```scss
// Colors
$primary: #3b82f6;
$secondary: #a855f7;
$success: #22c55e;
$warning: #f59e0b;
$danger: #ef4444;
$info: #0ea5e9;

// Spacing
$spacer: 1rem;
$spacers: (
  0: 0,
  1: $spacer * 0.25,
  2: $spacer * 0.5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3
);

// Typography
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;
```

### Build Process

```bash
# Install dependencies
npm install

# Build CSS and JS
npm run build

# Development server
npm run dev

# Documentation server
npm run docs
```

## 🌍 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

## 🤝 Contributing

Kontribusi sangat diterima! Silakan baca [Contributing Guide](CONTRIBUTING.md) untuk detail.

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) - Inspiration untuk struktur
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first approach
- [Tabler](https://tabler.io/) - Modern design inspiration
- [Material Design](https://material.io/) - Design principles
- [WCAG](https://www.w3.org/WAI/WCAG21/) - Accessibility guidelines

## 📞 Support

- 📧 Email: [ferzdevz@gmail.com](mailto:ferzdevz@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/FerzDevZ/ferzui/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/FerzDevZ/ferzui/discussions)
- 📖 Documentation: [ferzui Docs](https://ferzdevz.github.io/ferzui/)

---

Made with ❤️ by [FerzDevZ](https://github.com/FerzDevZ) for the developer community.
