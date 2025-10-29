#!/bin/bash

# Script untuk memperbaiki semua halaman HTML agar memiliki CSS yang benar

echo "🔧 Memperbaiki semua halaman HTML..."

# Fungsi untuk menambahkan fallback CSS ke file HTML
add_fallback_css() {
    local file="$1"
    local css_path="$2"
    
    # Backup file asli
    cp "$file" "$file.backup"
    
    # Tambahkan fallback CSS setelah tag <style> atau sebelum </head>
    if grep -q "<style>" "$file"; then
        # Jika sudah ada <style>, tambahkan fallback CSS di dalamnya
        sed -i '/<style>/a\
    /* Fallback CSS untuk memastikan styling tetap ada */\
    :root {\
      --fz-c-primary-500: #3b82f6;\
      --fz-c-primary-600: #2563eb;\
      --fz-c-primary-700: #1d4ed8;\
      --fz-c-primary-100: #dbeafe;\
      --fz-c-primary-50: #eff6ff;\
      --fz-c-text: #1f2937;\
      --fz-c-bg: #ffffff;\
      --fz-c-surface: #ffffff;\
      --fz-c-border: #e5e7eb;\
      --fz-c-gray-50: #f9fafb;\
      --fz-c-gray-100: #f3f4f6;\
      --fz-c-gray-200: #e5e7eb;\
      --fz-c-gray-300: #d1d5db;\
      --fz-c-gray-400: #9ca3af;\
      --fz-c-gray-500: #6b7280;\
      --fz-c-gray-600: #4b5563;\
      --fz-c-gray-700: #374151;\
      --fz-c-gray-800: #1f2937;\
      --fz-c-gray-900: #111827;\
      --fz-c-success-500: #10b981;\
      --fz-c-success-600: #059669;\
      --fz-c-success-100: #d1fae5;\
      --fz-c-danger-500: #ef4444;\
      --fz-c-danger-600: #dc2626;\
      --fz-c-danger-100: #fee2e2;\
      --fz-c-warning-500: #f59e0b;\
      --fz-c-warning-600: #d97706;\
      --fz-c-warning-100: #fef3c7;\
      --fz-c-info-500: #06b6d4;\
      --fz-c-info-600: #0891b2;\
      --fz-c-info-100: #cffafe;\
      --fz-border-radius-sm: 0.25rem;\
      --fz-border-radius-md: 0.375rem;\
      --fz-border-radius-lg: 0.5rem;\
      --fz-border-radius-xl: 0.75rem;\
      --fz-border-radius-full: 9999px;\
      --fz-space-1: 0.25rem;\
      --fz-space-2: 0.5rem;\
      --fz-space-3: 0.75rem;\
      --fz-space-4: 1rem;\
      --fz-space-5: 1.25rem;\
      --fz-space-6: 1.5rem;\
      --fz-space-8: 2rem;\
      --fz-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\
      --fz-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\
      --fz-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\
      --fz-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\
    }\
    \
    body {\
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
      line-height: 1.6;\
      color: var(--fz-c-text);\
      background: var(--fz-c-bg);\
      margin: 0;\
      padding: 0;\
    }\
    \
    .container {\
      max-width: 1200px;\
      margin: 0 auto;\
      padding: 0 var(--fz-space-4);\
    }\
    \
    .navbar {\
      background: var(--fz-c-surface);\
      border-bottom: 1px solid var(--fz-c-border);\
      padding: var(--fz-space-4) 0;\
      position: sticky;\
      top: 0;\
      z-index: 1000;\
    }\
    \
    .navbar-brand {\
      font-size: 1.5rem;\
      font-weight: 700;\
      color: var(--fz-c-primary-600);\
      text-decoration: none;\
    }\
    \
    .nav-link {\
      color: var(--fz-c-text);\
      text-decoration: none;\
      padding: var(--fz-space-2) var(--fz-space-4);\
      border-radius: var(--fz-border-radius-md);\
      transition: all 0.2s ease;\
    }\
    \
    .nav-link:hover {\
      background: var(--fz-c-gray-100);\
      color: var(--fz-c-primary-600);\
    }\
    \
    .btn {\
      display: inline-flex;\
      align-items: center;\
      justify-content: center;\
      padding: var(--fz-space-3) var(--fz-space-6);\
      border: none;\
      border-radius: var(--fz-border-radius-md);\
      font-weight: 600;\
      text-decoration: none;\
      cursor: pointer;\
      transition: all 0.2s ease;\
    }\
    \
    .btn-primary {\
      background: var(--fz-c-primary-500);\
      color: white;\
    }\
    \
    .btn-primary:hover {\
      background: var(--fz-c-primary-600);\
      transform: translateY(-1px);\
    }\
    \
    .btn-outline {\
      background: transparent;\
      color: var(--fz-c-primary-600);\
      border: 2px solid var(--fz-c-primary-500);\
    }\
    \
    .btn-outline:hover {\
      background: var(--fz-c-primary-500);\
      color: white;\
    }\
    \
    .card {\
      background: var(--fz-c-surface);\
      border: 1px solid var(--fz-c-border);\
      border-radius: var(--fz-border-radius-lg);\
      box-shadow: var(--fz-shadow-sm);\
      overflow: hidden;\
    }\
    \
    .card-body {\
      padding: var(--fz-space-6);\
    }\
    \
    .text-center { text-align: center; }\
    .text-left { text-align: left; }\
    .text-right { text-align: right; }\
    \
    .d-flex { display: flex; }\
    .d-block { display: block; }\
    .d-none { display: none; }\
    \
    .justify-center { justify-content: center; }\
    .justify-between { justify-content: space-between; }\
    .align-center { align-items: center; }\
    \
    .gap-2 { gap: var(--fz-space-2); }\
    .gap-3 { gap: var(--fz-space-3); }\
    .gap-4 { gap: var(--fz-space-4); }\
    \
    .mb-2 { margin-bottom: var(--fz-space-2); }\
    .mb-3 { margin-bottom: var(--fz-space-3); }\
    .mb-4 { margin-bottom: var(--fz-space-4); }\
    .mb-6 { margin-bottom: var(--fz-space-6); }\
    \
    .mt-2 { margin-top: var(--fz-space-2); }\
    .mt-3 { margin-top: var(--fz-space-3); }\
    .mt-4 { margin-top: var(--fz-space-4); }\
    .mt-6 { margin-top: var(--fz-space-6); }\
    \
    .p-2 { padding: var(--fz-space-2); }\
    .p-3 { padding: var(--fz-space-3); }\
    .p-4 { padding: var(--fz-space-4); }\
    .p-6 { padding: var(--fz-space-6); }\
    \
    .rounded { border-radius: var(--fz-border-radius-md); }\
    .rounded-lg { border-radius: var(--fz-border-radius-lg); }\
    \
    .shadow-sm { box-shadow: var(--fz-shadow-sm); }\
    .shadow-md { box-shadow: var(--fz-shadow-md); }\
    .shadow-lg { box-shadow: var(--fz-shadow-lg); }\
    \
    .bg-primary-50 { background: var(--fz-c-primary-50); }\
    .bg-primary-100 { background: var(--fz-c-primary-100); }\
    .bg-gray-50 { background: var(--fz-c-gray-50); }\
    .bg-gray-100 { background: var(--fz-c-gray-100); }\
    \
    .text-primary-600 { color: var(--fz-c-primary-600); }\
    .text-gray-500 { color: var(--fz-c-gray-500); }\
    .text-gray-600 { color: var(--fz-c-gray-600); }\
    .text-gray-700 { color: var(--fz-c-gray-700); }\
    \
    .font-bold { font-weight: 700; }\
    .font-semibold { font-weight: 600; }\
    .font-medium { font-weight: 500; }\
    \
    .text-sm { font-size: 0.875rem; }\
    .text-lg { font-size: 1.125rem; }\
    .text-xl { font-size: 1.25rem; }\
    .text-2xl { font-size: 1.5rem; }\
    .text-3xl { font-size: 1.875rem; }\
    .text-4xl { font-size: 2.25rem; }\
    \
    @media (max-width: 768px) {\
      .container {\
        padding: 0 var(--fz-space-3);\
      }\
    }' "$file"
    else
        # Jika tidak ada <style>, tambahkan sebelum </head>
        sed -i '/<\/head>/i\
  <style>\
    /* Fallback CSS untuk memastikan styling tetap ada */\
    :root {\
      --fz-c-primary-500: #3b82f6;\
      --fz-c-primary-600: #2563eb;\
      --fz-c-primary-700: #1d4ed8;\
      --fz-c-primary-100: #dbeafe;\
      --fz-c-primary-50: #eff6ff;\
      --fz-c-text: #1f2937;\
      --fz-c-bg: #ffffff;\
      --fz-c-surface: #ffffff;\
      --fz-c-border: #e5e7eb;\
      --fz-c-gray-50: #f9fafb;\
      --fz-c-gray-100: #f3f4f6;\
      --fz-c-gray-200: #e5e7eb;\
      --fz-c-gray-300: #d1d5db;\
      --fz-c-gray-400: #9ca3af;\
      --fz-c-gray-500: #6b7280;\
      --fz-c-gray-600: #4b5563;\
      --fz-c-gray-700: #374151;\
      --fz-c-gray-800: #1f2937;\
      --fz-c-gray-900: #111827;\
      --fz-c-success-500: #10b981;\
      --fz-c-success-600: #059669;\
      --fz-c-success-100: #d1fae5;\
      --fz-c-danger-500: #ef4444;\
      --fz-c-danger-600: #dc2626;\
      --fz-c-danger-100: #fee2e2;\
      --fz-c-warning-500: #f59e0b;\
      --fz-c-warning-600: #d97706;\
      --fz-c-warning-100: #fef3c7;\
      --fz-c-info-500: #06b6d4;\
      --fz-c-info-600: #0891b2;\
      --fz-c-info-100: #cffafe;\
      --fz-border-radius-sm: 0.25rem;\
      --fz-border-radius-md: 0.375rem;\
      --fz-border-radius-lg: 0.5rem;\
      --fz-border-radius-xl: 0.75rem;\
      --fz-border-radius-full: 9999px;\
      --fz-space-1: 0.25rem;\
      --fz-space-2: 0.5rem;\
      --fz-space-3: 0.75rem;\
      --fz-space-4: 1rem;\
      --fz-space-5: 1.25rem;\
      --fz-space-6: 1.5rem;\
      --fz-space-8: 2rem;\
      --fz-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\
      --fz-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\
      --fz-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\
      --fz-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\
    }\
    \
    body {\
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
      line-height: 1.6;\
      color: var(--fz-c-text);\
      background: var(--fz-c-bg);\
      margin: 0;\
      padding: 0;\
    }\
    \
    .container {\
      max-width: 1200px;\
      margin: 0 auto;\
      padding: 0 var(--fz-space-4);\
    }\
    \
    .navbar {\
      background: var(--fz-c-surface);\
      border-bottom: 1px solid var(--fz-c-border);\
      padding: var(--fz-space-4) 0;\
      position: sticky;\
      top: 0;\
      z-index: 1000;\
    }\
    \
    .navbar-brand {\
      font-size: 1.5rem;\
      font-weight: 700;\
      color: var(--fz-c-primary-600);\
      text-decoration: none;\
    }\
    \
    .nav-link {\
      color: var(--fz-c-text);\
      text-decoration: none;\
      padding: var(--fz-space-2) var(--fz-space-4);\
      border-radius: var(--fz-border-radius-md);\
      transition: all 0.2s ease;\
    }\
    \
    .nav-link:hover {\
      background: var(--fz-c-gray-100);\
      color: var(--fz-c-primary-600);\
    }\
    \
    .btn {\
      display: inline-flex;\
      align-items: center;\
      justify-content: center;\
      padding: var(--fz-space-3) var(--fz-space-6);\
      border: none;\
      border-radius: var(--fz-border-radius-md);\
      font-weight: 600;\
      text-decoration: none;\
      cursor: pointer;\
      transition: all 0.2s ease;\
    }\
    \
    .btn-primary {\
      background: var(--fz-c-primary-500);\
      color: white;\
    }\
    \
    .btn-primary:hover {\
      background: var(--fz-c-primary-600);\
      transform: translateY(-1px);\
    }\
    \
    .btn-outline {\
      background: transparent;\
      color: var(--fz-c-primary-600);\
      border: 2px solid var(--fz-c-primary-500);\
    }\
    \
    .btn-outline:hover {\
      background: var(--fz-c-primary-500);\
      color: white;\
    }\
    \
    .card {\
      background: var(--fz-c-surface);\
      border: 1px solid var(--fz-c-border);\
      border-radius: var(--fz-border-radius-lg);\
      box-shadow: var(--fz-shadow-sm);\
      overflow: hidden;\
    }\
    \
    .card-body {\
      padding: var(--fz-space-6);\
    }\
    \
    .text-center { text-align: center; }\
    .text-left { text-align: left; }\
    .text-right { text-align: right; }\
    \
    .d-flex { display: flex; }\
    .d-block { display: block; }\
    .d-none { display: none; }\
    \
    .justify-center { justify-content: center; }\
    .justify-between { justify-content: space-between; }\
    .align-center { align-items: center; }\
    \
    .gap-2 { gap: var(--fz-space-2); }\
    .gap-3 { gap: var(--fz-space-3); }\
    .gap-4 { gap: var(--fz-space-4); }\
    \
    .mb-2 { margin-bottom: var(--fz-space-2); }\
    .mb-3 { margin-bottom: var(--fz-space-3); }\
    .mb-4 { margin-bottom: var(--fz-space-4); }\
    .mb-6 { margin-bottom: var(--fz-space-6); }\
    \
    .mt-2 { margin-top: var(--fz-space-2); }\
    .mt-3 { margin-top: var(--fz-space-3); }\
    .mt-4 { margin-top: var(--fz-space-4); }\
    .mt-6 { margin-top: var(--fz-space-6); }\
    \
    .p-2 { padding: var(--fz-space-2); }\
    .p-3 { padding: var(--fz-space-3); }\
    .p-4 { padding: var(--fz-space-4); }\
    .p-6 { padding: var(--fz-space-6); }\
    \
    .rounded { border-radius: var(--fz-border-radius-md); }\
    .rounded-lg { border-radius: var(--fz-border-radius-lg); }\
    \
    .shadow-sm { box-shadow: var(--fz-shadow-sm); }\
    .shadow-md { box-shadow: var(--fz-shadow-md); }\
    .shadow-lg { box-shadow: var(--fz-shadow-lg); }\
    \
    .bg-primary-50 { background: var(--fz-c-primary-50); }\
    .bg-primary-100 { background: var(--fz-c-primary-100); }\
    .bg-gray-50 { background: var(--fz-c-gray-50); }\
    .bg-gray-100 { background: var(--fz-c-gray-100); }\
    \
    .text-primary-600 { color: var(--fz-c-primary-600); }\
    .text-gray-500 { color: var(--fz-c-gray-500); }\
    .text-gray-600 { color: var(--fz-c-gray-600); }\
    .text-gray-700 { color: var(--fz-c-gray-700); }\
    \
    .font-bold { font-weight: 700; }\
    .font-semibold { font-weight: 600; }\
    .font-medium { font-weight: 500; }\
    \
    .text-sm { font-size: 0.875rem; }\
    .text-lg { font-size: 1.125rem; }\
    .text-xl { font-size: 1.25rem; }\
    .text-2xl { font-size: 1.5rem; }\
    .text-3xl { font-size: 1.875rem; }\
    .text-4xl { font-size: 2.25rem; }\
    \
    @media (max-width: 768px) {\
      .container {\
        padding: 0 var(--fz-space-3);\
      }\
    }\
  </style>' "$file"
    fi
}

# Perbaiki semua file HTML di root directory
echo "📄 Memperbaiki file HTML di root directory..."
for file in *.html; do
    if [ -f "$file" ]; then
        echo "  - Memperbaiki $file"
        add_fallback_css "$file" "dist/ferzui.css"
    fi
done

# Perbaiki semua file HTML di docs directory
echo "📚 Memperbaiki file HTML di docs directory..."
for file in docs/*.html; do
    if [ -f "$file" ]; then
        echo "  - Memperbaiki $file"
        add_fallback_css "$file" "../dist/ferzui.css"
    fi
done

# Perbaiki semua file HTML di docs/templates directory
echo "🏗️ Memperbaiki file HTML di docs/templates directory..."
for file in docs/templates/*.html; do
    if [ -f "$file" ]; then
        echo "  - Memperbaiki $file"
        add_fallback_css "$file" "../../dist/ferzui.css"
    fi
done

# Perbaiki semua file HTML di demo directory
echo "🎮 Memperbaiki file HTML di demo directory..."
for file in demo/*.html; do
    if [ -f "$file" ]; then
        echo "  - Memperbaiki $file"
        add_fallback_css "$file" "../dist/ferzui.css"
    fi
done

echo "✅ Semua halaman HTML telah diperbaiki!"
echo "🎉 Website sekarang akan terlihat profesional di GitHub Pages!"
