# Color Timer - Project Structure

This document explains the reorganized folder structure following modern web development best practices.

## 📁 Directory Structure

```
ColorTimer/
├── src/                    # Source code
│   ├── css/               # Stylesheets
│   │   └── styles.css
│   └── js/                # JavaScript modules
│       ├── app.js         # Main application logic
│       ├── canvas.js      # Canvas rendering
│       ├── events.js      # Event management
│       └── timer.js       # Timer functionality
├── public/                # Static assets and main files
│   ├── assets/           # Static assets
│   │   └── icons/        # Application icons
│   ├── index.html        # Main HTML file
│   ├── manifest.json     # PWA manifest
│   └── service-worker.js # Service worker
├── scripts/              # Build and utility scripts
│   ├── build.sh          # Production build script
│   └── build.js          # Production build script (Node.js)
├── docs/                 # Documentation
│   ├── DEVELOPMENT.md    # Development guide
│   ├── PROJECT_STRUCTURE.md # Project structure documentation
│   └── STRUCTURE.md      # Detailed structure documentation
├── dist/                 # Build output (generated)
├── node_modules/         # Dependencies (generated)
└── package.json          # Project configuration
```

## 🚀 Development

### Development Server
```bash
npm run dev          # Live server with auto-reload
npm start            # HTTP server
```

### Building
```bash
npm run build        # Full production build
```

### Code Quality
```bash
npm run lint         # ESLint check
npm run format       # Prettier formatting
```

## 📋 Benefits of This Structure

1. **Clear Separation**: Source code is separate from build output
2. **Scalability**: Easy to add new modules and organize features
3. **Build Process**: Production builds optimize and bundle files
4. **Development**: Better development experience with proper tooling
5. **Best Practices**: Follows industry standards for web applications

## 🔧 Configuration Files

- `package.json` - Project dependencies and scripts
- `.eslintrc.json` - Code linting rules
- `.prettierrc` - Code formatting rules
- `.gitignore` - Git ignore patterns
- `manifest.json` - PWA configuration

## 🔧 Development Notes

### File Structure Explanation

This project uses a development sync approach:

- **Source Files**: `src/` contains the authoritative source code
- **Development Serving**: `public/` directory is served during development
- **Auto-Sync**: `scripts/dev-sync.js` copies `src/` files to `public/src/` for development
- **Production**: Build process uses files from `src/` directly

### Important Guidelines

1. **Always edit files in `src/`** - these are your source files
2. **Never edit `public/src/`** - these files are auto-generated copies
3. **Development sync** runs automatically with `npm run dev` and `npm start`
