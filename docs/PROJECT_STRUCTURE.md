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
│   ├── create-icons.js   # Icon generation
│   ├── generate-icons.html
│   └── svg-to-png.html
├── tests/                # Test files
│   ├── test-app.js
│   ├── test-relative-units.html
│   └── test-units.html
├── docs/                 # Documentation
│   └── DEVELOPMENT.md
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
npm run build:icons  # Generate icons only
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
