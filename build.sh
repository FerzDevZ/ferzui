#!/bin/bash

# ferzui Build Script
# Compiles SCSS to CSS and bundles JavaScript

set -e

echo "🚀 Building ferzui..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if sass is installed
if ! command -v sass &> /dev/null; then
    echo -e "${RED}❌ Sass not found. Installing Dart Sass...${NC}"
    
    # Install Dart Sass
    if command -v npm &> /dev/null; then
        npm install -g sass
    elif command -v yarn &> /dev/null; then
        yarn global add sass
    else
        echo -e "${RED}❌ npm or yarn not found. Please install Sass manually.${NC}"
        echo "Visit: https://sass-lang.com/install"
        exit 1
    fi
fi

# Create dist directory if it doesn't exist
mkdir -p dist

echo -e "${BLUE}📦 Compiling SCSS...${NC}"

# Compile SCSS to CSS
sass src/scss/ferzui.scss dist/ferzui.css --style=expanded --source-map

# Compile minified version
sass src/scss/ferzui.scss dist/ferzui.min.css --style=compressed --no-source-map

echo -e "${GREEN}✅ SCSS compiled successfully${NC}"

echo -e "${BLUE}📦 Bundling JavaScript...${NC}"

# Copy JavaScript files
cp src/js/core.js dist/ferzui.js

# Create minified JavaScript (basic minification)
if command -v uglifyjs &> /dev/null; then
    uglifyjs src/js/core.js -o dist/ferzui.min.js --compress --mangle
    echo -e "${GREEN}✅ JavaScript minified with UglifyJS${NC}"
elif command -v terser &> /dev/null; then
    terser src/js/core.js -o dist/ferzui.min.js --compress --mangle
    echo -e "${GREEN}✅ JavaScript minified with Terser${NC}"
else
    # Basic minification without external tools
    echo -e "${YELLOW}⚠️  No minifier found. Creating basic minified version...${NC}"
    
    # Remove comments and extra whitespace (basic)
    sed 's|//.*||g; s|/\*.*\*/||g; s/^[[:space:]]*//g; s/[[:space:]]*$//g' src/js/core.js | \
    tr -d '\n' | \
    sed 's/[[:space:]]\+/ /g' > dist/ferzui.min.js
    
    echo -e "${GREEN}✅ Basic JavaScript minification completed${NC}"
fi

echo -e "${BLUE}📦 Creating ESM version...${NC}"

# Create ESM version
cat > dist/ferzui.esm.js << 'EOF'
// ferzui ESM Module
export { FerzUI, BaseComponent, Modal, Dropdown, Toast, Tooltip } from './ferzui.js';
EOF

echo -e "${GREEN}✅ ESM module created${NC}"

echo -e "${BLUE}📦 Generating file sizes...${NC}"

# Display file sizes
echo -e "${YELLOW}📊 Build Output:${NC}"
echo "├── ferzui.css: $(du -h dist/ferzui.css | cut -f1)"
echo "├── ferzui.min.css: $(du -h dist/ferzui.min.css | cut -f1)"
echo "├── ferzui.js: $(du -h dist/ferzui.js | cut -f1)"
echo "├── ferzui.min.js: $(du -h dist/ferzui.min.js | cut -f1)"
echo "└── ferzui.esm.js: $(du -h dist/ferzui.esm.js | cut -f1)"

echo -e "${BLUE}📦 Creating package.json...${NC}"

# Create package.json for npm publishing
cat > package.json << 'EOF'
{
  "name": "ferzui",
  "version": "0.2.0",
  "description": "Modern, accessible, and brandable UI framework",
  "main": "dist/ferzui.js",
  "module": "dist/ferzui.esm.js",
  "style": "dist/ferzui.css",
  "files": [
    "dist/",
    "src/",
    "docs/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "./build.sh",
    "dev": "python3 -m http.server 8000 --directory .",
    "docs": "python3 -m http.server 3000 --directory docs"
  },
  "keywords": [
    "css",
    "framework",
    "ui",
    "components",
    "responsive",
    "accessible",
    "modern",
    "scss",
    "javascript"
  ],
  "author": "Ferdinand",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/ferdinand/ferzui.git"
  },
  "bugs": {
    "url": "https://github.com/ferdinand/ferzui/issues"
  },
  "homepage": "https://github.com/ferdinand/ferzui#readme",
  "devDependencies": {
    "sass": "^1.69.0"
  },
  "peerDependencies": {},
  "dependencies": {}
}
EOF

echo -e "${GREEN}✅ package.json created${NC}"

echo -e "${BLUE}📦 Creating README.md...${NC}"

# Create README.md
cat > README.md << 'EOF'
# ferzui

Modern, accessible, and brandable UI framework built with SCSS and vanilla JavaScript.

## Features

- 🎨 **Modern Design System** - Fluid typography, consistent spacing, and beautiful shadows
- ♿ **Accessible** - WCAG AA compliant with proper ARIA support and keyboard navigation
- 🌙 **Theme Support** - Light, dark, and high-contrast modes with CSS custom properties
- 📱 **Responsive** - Mobile-first design with comprehensive breakpoint utilities
- 🚀 **Performance** - Tree-shakeable CSS and lightweight JavaScript
- 🎯 **Framework Agnostic** - Works with any framework or vanilla HTML
- 🔧 **Customizable** - Extensive design tokens and SCSS variables

## Quick Start

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ferzui@0.2.0/dist/ferzui.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/ferzui@0.2.0/dist/ferzui.min.js"></script>
```

### NPM

```bash
npm install ferzui
```

```javascript
import 'ferzui/dist/ferzui.css';
import { FerzUI } from 'ferzui';
```

### Download

Download the latest release from the [releases page](https://github.com/ferdinand/ferzui/releases).

## Components

- **Layout**: Container, Grid, Flexbox utilities
- **Navigation**: Navbar, Breadcrumb, Pagination
- **Forms**: Input groups, Form controls, Validation
- **Data Display**: Table, Cards, Lists, Timeline
- **Feedback**: Alerts, Toast, Progress, Spinners
- **Overlay**: Modal, Dropdown, Tooltip, Popover
- **Interactive**: Buttons, Tabs, Accordion, Stepper

## Documentation

Visit the [documentation website](https://ferzui.dev) for complete guides and examples.

## Browser Support

- Chrome (last 2)
- Firefox (last 2)
- Safari (last 2)
- Edge (last 2)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
EOF

echo -e "${GREEN}✅ README.md created${NC}"

echo -e "${BLUE}📦 Creating LICENSE...${NC}"

# Create MIT License
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Ferdinand

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

echo -e "${GREEN}✅ LICENSE created${NC}"

echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo -e "${BLUE}📁 Files created in dist/:${NC}"
ls -la dist/

echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Test the build: python3 -m http.server 8000"
echo "2. View docs: python3 -m http.server 3000 --directory docs"
echo "3. Publish to npm: npm publish"
echo "4. Create GitHub release with dist/ files"
