# ferzui CDN Configuration

This file contains CDN configuration for ferzui framework.

## CDN Links

### CSS
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.css">
```

### JavaScript
```html
<script src="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.js"></script>
```

### ES Modules
```javascript
import 'https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.css';
import 'https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.js';
```

## Alternative CDNs

### unpkg
```html
<link rel="stylesheet" href="https://unpkg.com/ferzui@1.0.0/dist/ferzui.min.css">
<script src="https://unpkg.com/ferzui@1.0.0/dist/ferzui.min.js"></script>
```

### cdnjs
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ferzui/1.0.0/ferzui.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/ferzui/1.0.0/ferzui.min.js"></script>
```

## Versioning

- `@latest` - Latest stable version
- `@1.0.0` - Specific version
- `@1.0` - Latest patch in minor version
- `@1` - Latest minor in major version

## SRI (Subresource Integrity)

For security, you can use SRI hashes:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.css" integrity="sha384-..." crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/ferzui@1.0.0/dist/ferzui.min.js" integrity="sha384-..." crossorigin="anonymous"></script>
```

## Performance Tips

1. **Use specific versions** instead of `@latest` for production
2. **Enable compression** on your server
3. **Use HTTP/2** for better performance
4. **Consider self-hosting** for better control
5. **Use SRI** for security

## Self-Hosting

If you prefer to host ferzui yourself:

1. Download the files from [releases](https://github.com/FerzDevZ/ferzui/releases)
2. Place them in your web server
3. Update the links in your HTML

```html
<link rel="stylesheet" href="/path/to/ferzui.min.css">
<script src="/path/to/ferzui.min.js"></script>
```
