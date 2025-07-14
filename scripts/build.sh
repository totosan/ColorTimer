#!/bin/bash

# Color Timer Build Script
echo "🎨 Building Color Timer..."

# Create build directory
mkdir -p dist

# Copy public files
echo "📂 Copying public files..."
cp -r public/* dist/

# Copy source files to build
echo "📦 Processing source files..."
mkdir -p dist/js dist/css

# Copy and potentially minify CSS
cp src/css/* dist/css/

# Copy JavaScript files
cp src/js/* dist/js/

# Update paths in the built index.html
echo "🔧 Updating file paths for production..."
sed -i 's|../src/css/|css/|g' dist/index.html
sed -i 's|../src/js/|js/|g' dist/index.html

# Update manifest icon paths for production
sed -i 's|assets/icons/|assets/icons/|g' dist/manifest.json

echo "✅ Build complete! Files are in the 'dist' directory."
echo "🚀 Run 'npx http-server dist -p 3003' to serve the built app."
