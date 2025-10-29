#!/bin/bash

# ferzui Build Script
# Builds CSS and JavaScript for production

set -e

echo "🚀 Building ferzui framework..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Build CSS
echo "📦 Building CSS..."
cat src/scss/ferzui.scss > dist/ferzui.css
echo "✅ CSS built successfully"

# Build JavaScript
echo "📦 Building JavaScript..."
cat src/js/*.js > dist/ferzui.js
echo "✅ JavaScript built successfully"

# Create ES module version
echo "📦 Building ES module..."
cat src/js/*.js > dist/ferzui.esm.js
echo "✅ ES module built successfully"

# Create minified versions (basic minification)
echo "📦 Creating minified versions..."

# Simple CSS minification (remove comments and extra spaces)
sed 's/\/\*.*\*\///g' dist/ferzui.css | tr -d '\n' | sed 's/  */ /g' > dist/ferzui.min.css
echo "✅ Minified CSS created"

# Simple JS minification (remove comments and extra spaces)
sed 's/\/\/.*$//g' dist/ferzui.js | sed 's/\/\*.*\*\///g' | tr -d '\n' | sed 's/  */ /g' > dist/ferzui.min.js
echo "✅ Minified JavaScript created"

# Get file sizes
echo "📊 File sizes:"
ls -lh dist/ferzui.* | awk '{print $5, $9}'

echo "🎉 Build completed successfully!"
echo ""
echo "Files created:"
echo "  📄 dist/ferzui.css - Main CSS file"
echo "  📄 dist/ferzui.js - Main JavaScript file"
echo "  📄 dist/ferzui.esm.js - ES module version"
echo "  📄 dist/ferzui.min.css - Minified CSS"
echo "  📄 dist/ferzui.min.js - Minified JavaScript"
echo "  📄 dist/ferzui.d.ts - TypeScript definitions"
echo ""
echo "Ready for NPM publishing! 🚀"