#!/bin/bash

echo "🚀 Setting up Color Timer PWA Development Environment..."

# Update package lists
sudo apt-get update

# Install additional tools for PWA development
echo "📦 Installing development tools..."

# Install Python for simple HTTP server
sudo apt-get install -y python3 python3-pip

# Install ImageMagick for icon processing
sudo apt-get install -y imagemagick

# Install SVG tools
sudo apt-get install -y librsvg2-bin

# Note: Using npx for tools to avoid permission issues
echo "🔧 Node.js development tools will be installed via npx as needed..."

# Install project dependencies (if package.json exists)
if [ -f "package.json" ]; then
    echo "📥 Installing project dependencies..."
    npm install
else
    echo "📝 Creating basic package.json for PWA development..."
    cat > package.json << EOF
{
  "name": "color-timer",
  "version": "1.0.0",
  "description": "A colorful timer PWA with customizable time phases",
  "main": "index.html",
  "scripts": {
    "start": "npx http-server -p 3000 -c-1",
    "dev": "npx live-server --port=3000 --no-browser",
    "serve": "python3 -m http.server 8000",
    "build": "node create-icons.js",
    "lint": "npx eslint js/**/*.js",
    "format": "npx prettier --write '**/*.{js,html,css,json}'",
    "audit": "npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html"
  },
  "keywords": ["pwa", "timer", "productivity", "javascript"],
  "author": "Developer",
  "license": "MIT",
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
EOF

    echo "📥 Installing development dependencies..."
    npm install
fi

# Create development scripts if they don't exist
if [ ! -f "start-dev.sh" ]; then
    echo "📜 Creating development helper scripts..."
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting Color Timer Development Server..."
echo "Choose your preferred server:"
echo "1) HTTP Server (port 3000) - Recommended"
echo "2) Live Server (port 3000) - Auto-reload"
echo "3) Python Server (port 8000) - Simple"
echo ""
read -p "Select option (1-3): " choice

case $choice in
    1)
        echo "Starting HTTP Server on port 3000..."
        npm run start
        ;;
    2)
        echo "Starting Live Server on port 3000..."
        npm run dev
        ;;
    3)
        echo "Starting Python Server on port 8000..."
        npm run serve
        ;;
    *)
        echo "Invalid choice. Starting HTTP Server..."
        npm run start
        ;;
esac
EOF
    chmod +x start-dev.sh
fi

# Create ESLint configuration
if [ ! -f ".eslintrc.json" ]; then
    echo "⚙️  Creating ESLint configuration..."
    cat > .eslintrc.json << EOF
{
  "env": {
    "browser": true,
    "es2021": true,
    "serviceworker": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "prefer-const": "error",
    "no-var": "error"
  },
  "globals": {
    "Timer": "readonly",
    "EventManager": "readonly",
    "CanvasTimer": "readonly",
    "ColorTimerApp": "readonly"
  }
}
EOF
fi

# Create Prettier configuration
if [ ! -f ".prettierrc" ]; then
    echo "💄 Creating Prettier configuration..."
    cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
EOF
fi

# Make shell scripts executable
chmod +x *.sh

# Create a development guide
echo "📚 Creating development guide..."
cat > DEVELOPMENT.md << EOF
# Color Timer PWA - Development Guide

## Quick Start

### Option 1: Using npm scripts
\`\`\`bash
npm run start    # HTTP server on port 3000
npm run dev      # Live server with auto-reload on port 3000
npm run serve    # Python server on port 8000
\`\`\`

### Option 2: Using development script
\`\`\`bash
./start-dev.sh   # Interactive server selection
\`\`\`

### Option 3: Using original script
\`\`\`bash
./start-server.sh   # Original development script
\`\`\`

## Development Tools

- **ESLint**: Code linting - \`npm run lint\`
- **Prettier**: Code formatting - \`npm run format\`
- **Lighthouse**: PWA audit - \`npm run audit\`
- **Icon Generation**: \`npm run build\` or \`node create-icons.js\`

## PWA Testing

1. Start development server
2. Open browser to http://localhost:3000
3. Open DevTools > Application > Service Workers
4. Test offline functionality
5. Test "Add to Home Screen"

## Project Structure

- \`index.html\` - Main app entry point
- \`manifest.json\` - PWA manifest
- \`service-worker.js\` - Service worker for offline support
- \`js/\` - JavaScript modules
- \`css/\` - Stylesheets
- \`icons/\` - App icons (generated)

## VS Code Extensions Installed

- Live Server - For development server with auto-reload
- ESLint - JavaScript linting
- Prettier - Code formatting
- HTML CSS Support - Enhanced HTML/CSS support
- Material Icon Theme - Better file icons

## Useful Commands

\`\`\`bash
# Test PWA in browser
lighthouse http://localhost:3000 --view

# Format all code
prettier --write '**/*.{js,html,css,json}'

# Lint JavaScript
eslint js/**/*.js --fix

# Generate fresh icons
node create-icons.js
\`\`\`
EOF

echo ""
echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Quick commands:"
echo "  • npm run start     - Start development server"
echo "  • npm run dev       - Start with auto-reload"
echo "  • ./start-dev.sh    - Interactive server selection"
echo "  • npm run audit     - Run PWA audit"
echo ""
echo "📖 Check DEVELOPMENT.md for detailed guide"
echo "🎨 Your Color Timer PWA development environment is ready!"
