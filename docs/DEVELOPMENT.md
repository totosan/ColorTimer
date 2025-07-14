# Color Timer PWA - Development Guide

## Quick Start

### Development Server
```bash
npm run dev      # Live server with auto-reload on port 3003 (recommended)
npm run start    # HTTP server on port 3003
npm run serve    # Python server on port 8000 (legacy)
```

### Build Process
```bash
npm run build        # Full production build (icons + build)
npm run build:icons  # Generate icons only
```

### Using Development Script
```bash
./start-dev.sh   # Interactive server selection
```

## Project Structure

The project follows modern web development practices:

- **src/**: Source code (development files)
- **public/**: Static assets and main files
- **dist/**: Production build output
- **scripts/**: Build and utility scripts
- **tests/**: Test files
- **docs/**: Documentation

## Development Tools

- **ESLint**: Code linting - `npm run lint`
- **Prettier**: Code formatting - `npm run format`
- **Lighthouse**: PWA audit - `npm run audit`
- **Icon Generation**: `npm run build:icons`
- **Production Build**: `npm run build`

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
