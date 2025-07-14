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

### Option 4: Using Docker helper
```bash
.devcontainer/docker-helper.sh   # Interactive Docker management
```

## Development Tools

- **ESLint**: Code linting - `npm run lint`
- **Prettier**: Code formatting - `npm run format`
- **Lighthouse**: PWA audit - `npm run audit`
- **Icon Generation**: `npm run build` or `node create-icons.js`

## Docker Commands

### Building and Running
```bash
npm run docker:build           # Build Docker image
npm run docker:run             # Run Docker container (port 8080)
npm run docker:build-and-run   # Build and run in one command

# Or use Docker directly
docker build -t colortimer .
docker run -p 8080:80 colortimer
```

### Docker Compose
```bash
npm run docker:compose:up      # Start with docker-compose
npm run docker:compose:down    # Stop docker-compose
npm run docker:compose:build   # Build with docker-compose

# Or use docker-compose directly
docker-compose up
docker-compose down
docker-compose build
```

### Useful Docker Commands
```bash
docker ps                      # List running containers
docker images                  # List Docker images
docker logs <container-id>     # View container logs
docker exec -it <container-id> /bin/sh  # Enter running container
```

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
