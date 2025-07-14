# Project Structure

This document describes the organized folder structure of the Col4. **Development Ready**: `public/` contains files served during development
5. **Build Scripts**: Build and utility scripts in `scripts/`
6. **Documentation**: Centralized docs in `docs/`
7. **Modern Tooling**: ESLint, Prettier, and build scripts includedmer project.

## 📁 Directory Structure

```
ColorTimer/
├── 📂 src/                    # Source code
│   ├── 📂 css/               # Stylesheets
│   │   └── styles.css
│   └── 📂 js/                # JavaScript modules
│       ├── app.js            # Main application logic
│       ├── canvas.js         # Canvas rendering
│       ├── events.js         # Event management
│       └── timer.js          # Timer functionality
│
├── 📂 public/                # Development files (served during dev)
│   ├── index.html            # Main HTML file
│   ├── manifest.json         # PWA manifest
│   ├── service-worker.js     # Service worker for PWA
│   └── 📂 assets/           # Static assets
│       └── 📂 icons/        # App icons
│           ├── icon-192x192.png
│           ├── icon-192x192.svg
│           ├── icon-512x512.png
│           └── icon-512x512.svg
│
├── 📂 scripts/              # Build and utility scripts
│   ├── build.js             # Production build script
│   └── build.sh             # Build shell script
│
├── 📂 docs/                 # Documentation
│   ├── DEVELOPMENT.md       # Development guide
│   ├── PROJECT_STRUCTURE.md # Project structure documentation
│   └── STRUCTURE.md         # Detailed structure documentation
│
├── 📂 dist/                 # Production build output (generated)
│   ├── index.html           # Optimized HTML
│   ├── manifest.json        # PWA manifest
│   ├── service-worker.js    # Service worker
│   └── 📂 assets/          # Optimized assets
│       ├── 📂 css/         # Compiled styles
│       ├── 📂 js/          # Optimized JavaScript
│       └── 📂 icons/       # Optimized icons
│
├── 📄 package.json          # Project dependencies and scripts
├── 📄 .gitignore           # Git ignore rules
├── 📄 .eslintrc.json       # ESLint configuration
├── 📄 .prettierrc          # Prettier configuration
├── 📄 README.md            # Project documentation
├── 📄 start-dev.sh         # Development server script
└── 📄 start-server.sh      # Server startup script
```

## 🚀 Development Workflow

### Development Mode
```bash
npm run dev          # Start development server with live reload
npm start           # Start development server (static)
npm run serve       # Start Python development server
```

### Production Build
```bash
npm run build       # Build for production (creates dist/)
npm run serve:dist  # Serve production build locally
```

### Code Quality
```bash
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
```

### Other Commands
```bash
npm run audit      # Run Lighthouse audit
```

**Note**: Icon generation and test commands are not currently implemented.

## 📝 Key Benefits of This Structure

1. **Clear Separation**: Source code (`src/`) is separate from build output (`dist/`)
2. **Development Ready**: `public/` contains files served during development
3. **Organized Scripts**: All build and utility scripts in `scripts/`
4. **Proper Testing**: Dedicated `tests/` directory
5. **Documentation**: Centralized docs in `docs/`
6. **Modern Tooling**: ESLint, Prettier, and build scripts included

## 🔧 Path Configuration

### Development File Sync

The project uses a development sync system where:
- Source files are in `src/` (the authoritative source)
- During development, `scripts/dev-sync.js` copies `src/` files to `public/src/`
- The `public/` directory is served during development
- Production builds use files from `src/` directly

This allows for a clean separation between development serving and source code management.

### File Path Notes
- Edit files in `src/` directory (these are your source files)
- The `public/src/` files are auto-generated copies for development serving
- Never edit files directly in `public/src/` as they will be overwritten

- **Development**: Files in `public/` reference `../src/` for CSS/JS
- **Production**: Build process updates paths to `assets/` for optimized files
- **Assets**: Icons and static files properly organized under `assets/`

This structure follows modern web development best practices and makes the project easy to maintain and scale.
