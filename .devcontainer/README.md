# Color Timer PWA - DevContainer

This devcontainer provides a complete development environment for the Color Timer Progressive Web App (PWA).

## What's Included

### Base Environment
- **Node.js 20** - Latest LTS version
- **Git** - Version control
- **GitHub CLI** - GitHub integration
- **Zsh with Oh My Zsh** - Enhanced shell experience

### Development Tools
- **http-server** - Simple HTTP server for development
- **live-server** - Development server with auto-reload
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Lighthouse CLI** - PWA auditing
- **PWA CLI** - Progressive Web App tools

### Image Processing Tools
- **ImageMagick** - Image manipulation
- **librsvg2-bin** - SVG processing tools
- **Python3** - For simple HTTP server alternative

### VS Code Extensions
- **Live Server** - Development server integration
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **HTML CSS Support** - Enhanced web development
- **Material Icon Theme** - Better file icons
- **Auto Rename Tag** - HTML tag synchronization
- **Path Intellisense** - File path completion
- **Git Graph** - Visual git history
- **GitLens** - Enhanced git capabilities
- **Todo Tree** - Task management
- **Error Lens** - Inline error display

## Quick Start

1. **Open in VS Code**: The devcontainer will automatically set up when you open the project
2. **Start Development Server**: 
   ```bash
   npm run start    # HTTP server on port 3000
   npm run dev      # Live server with auto-reload
   ./start-dev.sh   # Interactive server selection
   ```
3. **Open Browser**: Navigate to `http://localhost:3000`

## Available Scripts

- `npm run start` - Start HTTP server on port 3000
- `npm run dev` - Start live server with auto-reload
- `npm run serve` - Start Python HTTP server on port 8000
- `npm run build` - Generate app icons
- `npm run lint` - Lint JavaScript files
- `npm run format` - Format code with Prettier
- `npm run audit` - Run Lighthouse PWA audit

## Development Workflow

1. **Code**: Edit your HTML, CSS, and JavaScript files
2. **Test**: Use live server for automatic reloading
3. **Lint**: Run ESLint to check code quality
4. **Format**: Use Prettier to maintain code style
5. **Audit**: Run Lighthouse to test PWA features
6. **Build**: Generate icons and prepare for deployment

## PWA Features Supported

- **Offline Support** - Service worker caching
- **Installable** - Add to home screen
- **Responsive** - Mobile-first design
- **Fast Loading** - Optimized assets
- **Secure** - HTTPS ready

## Port Forwarding

The following ports are automatically forwarded:
- **3000** - Primary development server
- **5000** - Node.js alternative server
- **5500** - Live Server default
- **8000** - Python HTTP server
- **8080** - Alternative web server

## File Structure

```
.devcontainer/
├── devcontainer.json     # Main devcontainer configuration
├── post-create.sh        # Setup script
└── README.md            # This file
```

## Customization

You can modify the devcontainer by editing:
- `devcontainer.json` - Main configuration, extensions, settings
- `post-create.sh` - Additional setup commands and tools

## Troubleshooting

### Container Build Issues
- Rebuild container: `Dev Containers: Rebuild Container`
- Check Docker daemon is running
- Ensure adequate disk space

### Port Conflicts
- Change port in npm scripts if needed
- Use VS Code port forwarding panel
- Check firewall settings

### Extension Issues
- Reload VS Code window
- Check extension compatibility
- Manually install missing extensions

## Advanced Usage

### Custom Server Configuration
Edit the npm scripts in `package.json` to customize server behavior:
```json
{
  "scripts": {
    "start": "http-server -p 3000 -c-1 --cors",
    "dev": "live-server --port=3000 --no-browser --ignore=node_modules"
  }
}
```

### Lighthouse CI Integration
For automated PWA auditing in CI/CD:
```bash
npm install -g @lhci/cli
lhci autorun
```

## Resources

- [VS Code DevContainers](https://code.visualstudio.com/docs/remote/containers)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
