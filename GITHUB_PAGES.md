# GitHub Pages Configuration

This repository is configured for GitHub Pages hosting.

## Repository Settings

1. Go to repository Settings
2. Navigate to Pages section
3. Set Source to "Deploy from a branch"
4. Select "main" branch
5. Set folder to "/ (root)"

## URL Structure

- **Homepage**: https://ferzdevz.github.io/ferzui/
- **Documentation**: https://ferzdevz.github.io/ferzui/docs/
- **Demo**: https://ferzdevz.github.io/ferzui/demo/
- **CDN**: https://ferzdevz.github.io/ferzui/dist/

## Custom Domain (Optional)

To use a custom domain:

1. Add CNAME file to root directory
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings

## Build Process

The site is automatically deployed when changes are pushed to main branch.

## Local Development

```bash
# Serve locally
python3 -m http.server 3000

# Access at http://localhost:3000
```

## File Structure

```
ferzui/
├── index.html          # Homepage
├── docs/               # Documentation
│   ├── index.html
│   ├── components.html
│   ├── utilities.html
│   └── ...
├── demo/               # Demo pages
│   └── index.html
├── dist/               # Built files
│   ├── ferzui.css
│   ├── ferzui.js
│   └── ...
└── src/                # Source files
    ├── scss/
    ├── js/
    └── ...
```

## SEO Configuration

- Meta tags configured for SEO
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data markup
- Sitemap.xml (auto-generated)

## Performance

- Optimized for GitHub Pages CDN
- Compressed assets
- Lazy loading images
- Critical CSS inlined
- Service Worker for caching

## Analytics

Google Analytics can be added by including the tracking code in the head section of each page.

## Security

- HTTPS enforced
- Content Security Policy headers
- Subresource Integrity (SRI) for external resources
- No sensitive data in client-side code
