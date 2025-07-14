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
npm run build        # Full production build
```

**Note**: Icon generation script is not currently implemented.

### Using Development Script
```bash
# Modern npm scripts (recommended)
npm run dev      # Live server with auto-reload on port 3003 (recommended)
npm run start    # HTTP server on port 3003
npm run serve    # Python server on port 8000

# Alternative: Legacy shell scripts
./start-dev.sh   # Interactive server selection (calls npm scripts)
./start-server.sh # Direct Python server (serves public/ directory only)
```

### When to Use Which Server

**Use npm scripts (`npm run dev`, `npm start`) when:**
- ✅ You want the modern development experience
- ✅ You need automatic file synchronization from `src/` to `public/src/`
- ✅ You're actively developing (recommended)

**Use `./start-server.sh` when:**
- ✅ You want a simple Python server
- ✅ You only need to serve static files from `public/`
- ✅ You don't need file synchronization
- ⚠️ Note: This doesn't run the dev-sync process

**Use `./start-dev.sh` when:**
- ✅ You want an interactive menu to choose server type
- ✅ You prefer shell scripts over npm commands

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
lighthouse http://localhost:3003 --view

# Format all code
prettier --write '**/*.{js,html,css,json}'

# Lint JavaScript
eslint src/**/*.js --fix
```
