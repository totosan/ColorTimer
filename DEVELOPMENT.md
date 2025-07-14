# Color Timer PWA - Development Guide

## Quick Start

### Option 1: Using npm scripts
```bash
npm run start    # HTTP server on port 3000
npm run dev      # Live server with auto-reload on port 3000
npm run serve    # Python server on port 8000
```

### Option 2: Using development script
```bash
./start-dev.sh   # Interactive server selection
```

### Option 3: Using original script
```bash
./start-server.sh   # Original development script
```

## Development Tools

- **ESLint**: Code linting - `npm run lint` (uses npx)
- **Prettier**: Code formatting - `npm run format` (uses npx)
- **Lighthouse**: PWA audit - `npm run audit` (uses npx)
- **Icon Generation**: `npm run build` or `node create-icons.js`

**Note**: Development tools use `npx` to avoid global installation and permission issues.

## PWA Testing

1. Start development server
2. Open browser to http://localhost:3000
3. Open DevTools > Application > Service Workers
4. Test offline functionality
5. Test "Add to Home Screen"

## Project Structure

- `index.html` - Main app entry point
- `manifest.json` - PWA manifest
- `service-worker.js` - Service worker for offline support
- `js/` - JavaScript modules
- `css/` - Stylesheets
- `icons/` - App icons (generated)

## VS Code Extensions Installed

- Live Server - For development server with auto-reload
- ESLint - JavaScript linting
- Prettier - Code formatting
- HTML CSS Support - Enhanced HTML/CSS support
- Material Icon Theme - Better file icons

## Useful Commands

```bash
# Test PWA in browser
lighthouse http://localhost:3000 --view

# Format all code
prettier --write '**/*.{js,html,css,json}'

# Lint JavaScript
eslint js/**/*.js --fix

# Generate fresh icons
node create-icons.js
```
