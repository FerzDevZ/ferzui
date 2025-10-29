/* ferzui Docs JS - inject layout, sidebar, search (lunr), responsive, RTL */
(function () {
  const PAGES = [
    { title: 'Getting Started', url: 'index.html', category: 'Getting Started' },
    { title: 'Installation', url: 'installation.html', category: 'Getting Started' },
    { title: 'Usage', url: 'usage.html', category: 'Getting Started' },
    { title: 'Layout', url: 'layout.html', category: 'Layout' },
    { title: 'Components', url: 'components.html', category: 'Components' },
    { title: 'Extended Components', url: 'extended.html', category: 'Components' },
    { title: 'Varied Components', url: 'varied.html', category: 'Components' },
    { title: 'Communication Components', url: 'communication.html', category: 'Components' },
    { title: 'Entertainment Components', url: 'entertainment.html', category: 'Components' },
    { title: 'Business Components', url: 'business.html', category: 'Components' },
    { title: 'Utilities', url: 'utilities.html', category: 'Utilities' },
    { title: 'Customize', url: 'customize.html', category: 'Customization' },
    { title: 'Theme Editor', url: 'theme.html', category: 'Customization' },
    { title: 'JavaScript', url: 'javascript.html', category: 'JavaScript' },
    { title: 'Migrate', url: 'migrate.html', category: 'Migration' },
    { title: 'Performance & Accessibility', url: 'performance.html', category: 'Advanced' },
    { title: 'Playground', url: 'playground.html', category: 'Tools' },
    { title: 'Templates / Dashboard', url: 'templates/dashboard.html', category: 'Templates' },
    { title: 'Templates / Auth', url: 'templates/auth.html', category: 'Templates' },
    { title: 'Templates / Pricing', url: 'templates/pricing.html', category: 'Templates' },
    { title: 'Templates / Landing', url: 'templates/landing.html', category: 'Templates' }
  ];

  let lunrReady = false;
  let lunrIndex = null;
  let lunrDocs = [];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
  }

  function wrapAsDocsLayout() {
    if (document.body.classList.contains('docs-layout')) return;

    const original = document.body.innerHTML;
    document.body.innerHTML = `
      <div class="docs-navbar">
        <div class="container">
          <a class="docs-brand" href="../index.html"><span class="dot"></span> ferzui</a>
          <nav class="d-none d-lg-flex gap-4">
            <a class="nav-link" href="index.html">📚 Documentation</a>
            <a class="nav-link" href="../demo/index.html">🚀 Live Demo</a>
            <a class="nav-link" href="components.html">🧩 Components</a>
            <a class="nav-link" href="utilities.html">⚡ Utilities</a>
            <a class="nav-link" href="layout.html">📐 Layout</a>
            <a class="nav-link" href="playground.html">🎮 Playground</a>
            <a class="nav-link" href="https://github.com/FerzDevZ/ferzui" target="_blank">⭐ GitHub</a>
          </nav>
          <div class="docs-actions">
            <button class="btn btn-sm btn-outline" id="theme-light" title="Light Mode">☀️</button>
            <button class="btn btn-sm btn-outline" id="theme-dark" title="Dark Mode">🌙</button>
            <button class="btn btn-sm btn-outline" id="toggle-high-contrast" title="High Contrast">♿</button>
            <button class="btn btn-sm btn-outline" id="toggle-rtl" title="Toggle RTL">⇄</button>
            <a href="../demo/index.html" class="btn btn-sm btn-primary">Try Demo</a>
          </div>
        </div>
      </div>

      <div class="docs-mobilebar">
        <div class="bar container">
          <button class="docs-toggle-btn" id="toggleSidebar">Menu</button>
          <a class="nav-link" href="../demo/index.html">Demo</a>
          <input class="docs-search-input" id="searchMobile" placeholder="Cari komponen..." />
        </div>
      </div>

      <div class="docs-wrap">
        <aside class="docs-sidebar" id="docsSidebar">
          <div class="search">
            <input class="docs-search-input" id="search" placeholder="Cari di dokumentasi... (lunr)" />
            <div class="docs-results" id="searchResults"></div>
          </div>
          <nav class="docs-nav" id="sidebarNav"></nav>
        </aside>
        <div class="docs-content">
          <main class="docs-main" id="docsMain">${original}</main>
        </div>
      </div>
    `;
    document.body.classList.add('docs-layout');
  }

  function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    const html = `
      <div>
        <div class="docs-section-title">Getting Started</div>
        <a class="docs-link" href="index.html">Getting Started</a>
        <a class="docs-link" href="installation.html">Installation</a>
        <a class="docs-link" href="usage.html">Usage</a>
        <a class="docs-link" href="customize.html">Customize</a>
        <a class="docs-link" href="migrate.html">Migrate</a>
        <a class="docs-link" href="theme.html">Theme Editor</a>
      </div>
      <div>
        <div class="docs-section-title">Layout</div>
        <a class="docs-link" href="layout.html">Grid & Container</a>
      </div>
      <div>
        <div class="docs-section-title">Components</div>
        <a class="docs-link" href="components.html#buttons">Buttons</a>
        <a class="docs-link" href="components.html#cards">Cards</a>
        <a class="docs-link" href="components.html#alerts">Alerts</a>
        <a class="docs-link" href="components.html#navbar">Navbar</a>
        <a class="docs-link" href="components.html#forms">Forms</a>
        <a class="docs-link" href="components.html#table">Table</a>
        <a class="docs-link" href="components.html#toast">Toast</a>
        <a class="docs-link" href="components.html#tooltip">Tooltip</a>
        <a class="docs-link" href="components.html#tabs">Tabs</a>
        <a class="docs-link" href="components.html#accordion">Accordion</a>
        <a class="docs-link" href="components.html#offcanvas">Offcanvas</a>
        <a class="docs-link" href="components.html#progress">Progress</a>
      </div>
      <div>
        <div class="docs-section-title">Extended Components</div>
        <a class="docs-link" href="extended.html">Extended Components</a>
        <a class="docs-link" href="varied.html">Varied Components</a>
        <a class="docs-link" href="communication.html">Communication</a>
        <a class="docs-link" href="entertainment.html">Entertainment</a>
        <a class="docs-link" href="business.html">Business</a>
      </div>
      <div>
        <div class="docs-section-title">Utilities</div>
        <a class="docs-link" href="utilities.html#spacing">Spacing</a>
        <a class="docs-link" href="utilities.html#display">Display</a>
        <a class="docs-link" href="utilities.html#flex">Flex</a>
        <a class="docs-link" href="utilities.html#grid">Grid</a>
        <a class="docs-link" href="utilities.html#colors">Colors</a>
        <a class="docs-link" href="utilities.html#shadows">Shadows</a>
      </div>
      <div>
        <div class="docs-section-title">JavaScript</div>
        <a class="docs-link" href="javascript.html">JavaScript API</a>
      </div>
      <div>
        <div class="docs-section-title">Templates</div>
        <a class="docs-link" href="templates/dashboard.html">Dashboard</a>
        <a class="docs-link" href="templates/auth.html">Auth</a>
        <a class="docs-link" href="templates/pricing.html">Pricing</a>
        <a class="docs-link" href="templates/landing.html">Landing</a>
      </div>
      <div>
        <div class="docs-section-title">Tools</div>
        <a class="docs-link" href="playground.html">Playground</a>
        <a class="docs-link" href="performance.html">Performance & A11y</a>
        <a class="docs-link" href="extended.html">Extended Components</a>
        <a class="docs-link" href="varied.html">Varied Components</a>
        <a class="docs-link" href="communication.html">Communication</a>
        <a class="docs-link" href="entertainment.html">Entertainment</a>
        <a class="docs-link" href="business.html">Business</a>
      </div>
    `;
    nav.innerHTML = html;

    const here = location.pathname + location.hash;
    nav.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('href') === here || a.getAttribute('href') === location.pathname) {
        a.classList.add('active');
      }
    });
  }

  function buildTOC() {
    const container = document.querySelector('.docs-content');
    if (!container) return;
    const headings = document.querySelectorAll('.docs-main h2[id], .docs-main h3[id]');
    if (!headings.length) return;
    const toc = document.createElement('aside');
    toc.className = 'docs-toc';
    let html = '<div class="docs-section-title">Di Halaman Ini</div>';
    headings.forEach(h => { html += `<a href="#${h.id}">${h.textContent}</a>`; });
    toc.innerHTML = html; container.appendChild(toc);
  }

  async function buildLunrIndex() {
    try {
      await loadScript('https://unpkg.com/lunr/lunr.js');
      const docs = [];
      const categories = {
        'components': ['components.html', 'buttons', 'cards', 'alerts', 'navbar', 'forms', 'table', 'toast', 'tooltip', 'tabs', 'accordion', 'offcanvas', 'progress'],
        'utilities': ['utilities.html', 'spacing', 'display', 'flex', 'grid', 'colors', 'shadows'],
        'templates': ['templates/', 'dashboard', 'auth', 'pricing', 'landing'],
        'layout': ['layout.html', 'grid', 'container'],
        'guide': ['index.html', 'customize.html', 'migrate.html', 'theme.html']
      };
      
      for (const p of PAGES) {
        try {
          const res = await fetch(p.url, { cache: 'no-cache' });
          const html = await res.text();
          const tmp = document.createElement('div'); tmp.innerHTML = html;
          const text = tmp.textContent.replace(/\s+/g, ' ').trim();
          
          // Determine category
          let category = 'guide';
          for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(k => p.url.includes(k) || p.title.toLowerCase().includes(k))) {
              category = cat;
              break;
            }
          }
          
          docs.push({ 
            id: p.url, 
            title: p.title, 
            body: text,
            category: category,
            snippet: text.substring(0, 200) + '...'
          });
        } catch (_) {}
      }
      lunrDocs = docs;
      lunrIndex = lunr(function () {
        this.ref('id'); this.field('title'); this.field('body');
        docs.forEach(d => this.add(d));
      });
      lunrReady = true;
    } catch (e) {
      console.warn('lunr load failed', e);
    }
  }

  function initSearch() {
    const input = document.getElementById('search');
    const inputMobile = document.getElementById('searchMobile');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    const highlightText = (text, query) => {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    const getCategoryIcon = (cat) => {
      const icons = {
        'components': '🧩',
        'utilities': '⚙️',
        'templates': '📄',
        'layout': '📐',
        'guide': '📚'
      };
      return icons[cat] || '📄';
    };

    const render = (items, query) => {
      const map = new Map(lunrDocs.map(d => [d.id, d]));
      const grouped = {};
      
      items.slice(0, 20).forEach(r => {
        const d = map.get(r.ref);
        if (!d) return;
        if (!grouped[d.category]) grouped[d.category] = [];
        grouped[d.category].push({ ...d, score: r.score });
      });

      let html = '';
      Object.entries(grouped).forEach(([cat, items]) => {
        html += `<div class="search-category">
          <div class="search-category-title">${getCategoryIcon(cat)} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</div>`;
        items.forEach(item => {
          html += `<a href="${item.id}" class="search-result">
            <div class="search-result-title">${highlightText(item.title, query)}</div>
            <div class="search-result-snippet">${highlightText(item.snippet, query)}</div>
            <div class="search-result-url">${item.id}</div>
          </a>`;
        });
        html += '</div>';
      });
      
      results.innerHTML = html;
      results.classList.toggle('show', items.length > 0);
    };

    const doSearch = (q) => {
      const query = (q || '').trim();
      if (!query || !lunrReady) { results.classList.remove('show'); results.innerHTML=''; return; }
      try { 
        const searchResults = lunrIndex.search(query);
        render(searchResults, query);
      } catch { render([]); }
    };

    input.addEventListener('input', e => doSearch(e.target.value));
    if (inputMobile) inputMobile.addEventListener('input', e => doSearch(e.target.value));
    document.addEventListener('click', e => { if (!results.contains(e.target) && e.target !== input) results.classList.remove('show'); });
  }

  function initThemeToggle() {
    const setTheme = (t) => document.documentElement.setAttribute('data-theme', t);
    const bind = (id, t) => { const el = document.getElementById(id); if (el) el.addEventListener('click', () => setTheme(t)); };
    bind('theme-light', 'light'); bind('theme-dark', 'dark'); bind('theme-contrast', 'high-contrast');
    
    const rtlBtn = document.getElementById('toggle-rtl');
    if (rtlBtn) rtlBtn.addEventListener('click', () => {
      const html = document.documentElement;
      html.setAttribute('dir', html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
    });
    
    const highContrastBtn = document.getElementById('toggle-high-contrast');
    if (highContrastBtn) highContrastBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isHighContrast = html.hasAttribute('data-high-contrast');
      html.setAttribute('data-high-contrast', !isHighContrast);
    });
  }

  function initMobileSidebar() {
    const btn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('docsSidebar');
    if (btn && sidebar) btn.addEventListener('click', () => sidebar.classList.toggle('show'));
  }

  document.addEventListener('DOMContentLoaded', async () => {
    wrapAsDocsLayout();
    buildSidebar();
    buildTOC();
    await buildLunrIndex();
    initSearch();
    initThemeToggle();
    initMobileSidebar();
  });
})();
