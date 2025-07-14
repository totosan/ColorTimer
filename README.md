# Color Timer PWA

A beautiful, custom**Development:**
```bash
# Install dependencies
npm install

# Option 1: Modern npm scripts (recommended)
npm run dev          # Live server with auto-reload (recommended)
npm start            # HTTP server
npm run serve        # Python server on port 8000

# Option 2: Legacy shell scripts (alternative)
./start-dev.sh       # Interactive server selection
./start-server.sh    # Direct Python server (serves public/ directory)

# Open http://localhost:3003 (or :8000 for Python server)
```pplication with color-coded time phases. Perfect for productivity techniques like Pomodoro, time blocking, or any activity that benefits from visual time management.

## Features

### Core Timer Functionality
- ⏱️ **Flexible Timer**: Set timers from seconds to hours
- ▶️ **Full Control**: Start, pause, stop, and reset functionality
- 🎯 **Quick Presets**: Instant access to common timer durations (15min, 30min, 45min, 60min)
- ⌨️ **Keyboard Shortcuts**: Spacebar to start/pause

### Color Events System
- 🎨 **Color-Coded Phases**: Create custom time phases with specific colors
- 📝 **Named Events**: Give meaningful names to each time phase
- 🔄 **Multiple Events**: Support for multiple overlapping or sequential events
- 💾 **Persistent Settings**: Events and timer state saved locally

### Visual Design
- ⭕ **Circular Timer**: Beautiful circular progress indicator
- 🌈 **Dynamic Background**: Background color changes based on current event
- ✨ **Smooth Animations**: Fluid transitions and completion animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### PWA Features
- 📲 **Installable**: Install as a native app on any device
- 🔄 **Offline Support**: Works completely offline after first load
- 🔔 **Notifications**: Browser notifications when timer completes
- 📳 **Mobile Vibration**: Haptic feedback on supported devices

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (for development and building)

### Quick Start

**Development:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev          # Live server with auto-reload (recommended)
# or
npm start            # HTTP server
# or
npm run serve        # Python server on port 8000

# Open http://localhost:3003 (or :8000 for Python server)
```

**Production Build:**
```bash
# Create production build
npm run build

# Serve production build
npm run serve:dist   # Serves on port 3004
# or
npx http-server dist -p 3003
```

### Important Notes

⚠️ **Development Setup**: This project uses an automatic file sync system. When you run development commands (`npm run dev`, `npm start`, etc.), the system automatically copies files from `src/` to `public/src/` so the development server can serve them properly.

⚠️ **Icon Generation**: The `npm run build:icons` script is referenced in package.json but not yet implemented. Icons are currently included in the repository.

### Project Structure

```
ColorTimer/
├── src/                    # Source code (edit these files)
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript modules
├── public/                # Development files (auto-generated)
│   ├── src/               # Synced copy of src/ for development
│   ├── assets/           # Static assets (icons, etc.)
│   ├── index.html        # Main HTML file
│   ├── manifest.json     # PWA manifest
│   └── service-worker.js # Service worker
├── scripts/              # Build and utility scripts
├── docs/                 # Documentation
└── dist/                 # Build output (generated)
```

See [Project Structure Documentation](docs/PROJECT_STRUCTURE.md) for detailed information.

### Legacy Installation (Direct File Serving)

If you prefer not to use the build process, you can serve files directly from the public directory:

   **Option A: Using Python (if you have Python installed)**
   ```bash
   # Navigate to public directory
   cd public

   # Python 3
   python3 -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option B: Using Node.js (if you have Node.js installed)**
   ```bash
   # Serve public directory
   npx serve public
   ```

   **Option C: Using any local server**
   - Use Live Server extension in VS Code (point to public/ folder)
   - Use any other local development server

3. **Open in Browser**
   - Navigate to `http://localhost:8000` (or whatever port your server uses)
   - For PWA features to work fully, use HTTPS in production

4. **Install as App (Optional)**
   - Click the install button in your browser's address bar
   - Or use "Add to Home Screen" on mobile devices

## Usage Guide

### Basic Timer Operation

1. **Set Timer Duration**
   - Use quick preset buttons (15min, 30min, 45min, 60min)
   - Or click Settings ⚙️ to set custom time

2. **Control Timer**
   - **Start**: Click Start button or press Spacebar
   - **Pause**: Click Pause button or press Spacebar while running
   - **Stop**: Click Stop button to end timer
   - **Reset**: Click Reset button to return to original time

### Creating Custom Events

1. **Open Settings**
   - Click the gear icon (⚙️) in the top right

2. **Add New Event**
   - Click "Add Event" button
   - Enter event name (e.g., "Focus Time", "Break", "Review")
   - Set start time (in seconds)
   - Set end time (in seconds)
   - Choose color from presets or use color picker

3. **Edit Existing Events**
   - Click on any event in the list to edit
   - Modify name, timing, or color
   - Click "Save Event" or "Delete" as needed

### Intelligent Time Units

The app automatically uses the most appropriate time units when editing events, making it easier to work with different timer durations:

**Automatic Unit Selection:**
- **Timers ≤ 2 minutes**: Time shown in **seconds**
  - Example: 1-minute timer → start: 30s, end: 30s
- **Timers 2 minutes - 2 hours**: Time shown in **minutes**
  - Example: 30-minute timer → start: 15min, end: 15min
- **Timers > 2 hours**: Time shown in **hours**
  - Example: 3-hour timer → start: 1.5h, end: 1.5h

**Benefits:**
- More intuitive time entry for different timer lengths
- Reduces errors when setting up events
- Shows total timer duration in the appropriate unit for context
- Automatically handles decimal values for precision when needed

**Examples:**
```
Timer: 1 minute (60s)
├─ Event: "Focus" → Start: 0s, Duration: 30s
└─ Event: "Break" → Start: 30s, Duration: 30s

Timer: 30 minutes (1800s)
├─ Event: "Work" → Start: 0min, Duration: 15min
└─ Event: "Rest" → Start: 15min, Duration: 15min

Timer: 2 hours (7200s)
├─ Event: "Session 1" → Start: 0min, Duration: 45min
├─ Event: "Break" → Start: 45min, Duration: 15min
└─ Event: "Session 2" → Start: 60min, Duration: 60min
```

### Example Use Cases

**Pomodoro Technique (25 minutes)**
- Event 1: "Focus" (0s - 1500s) - Red
- Event 2: "Break" (1500s - 1800s) - Green

**Meeting Timer (60 minutes)**
- Event 1: "Introduction" (0s - 300s) - Blue
- Event 2: "Discussion" (300s - 2700s) - Orange
- Event 3: "Wrap-up" (2700s - 3600s) - Purple

**Workout Timer (30 minutes)**
- Event 1: "Warm-up" (0s - 300s) - Yellow
- Event 2: "High Intensity" (300s - 1500s) - Red
- Event 3: "Cool-down" (1500s - 1800s) - Blue

## Technical Details

### Architecture
- **Pure Web Technologies**: HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies**: No external libraries or frameworks
- **Modular Design**: Separate modules for Timer, Events, Canvas, and App logic
- **Development Sync**: Source files in `src/` are automatically synced to `public/src/` during development

### Browser Support
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **PWA Features**: Requires browsers with Service Worker support
- **Canvas API**: Required for circular timer visualization

### Storage
- **Local Storage**: Timer state and events saved locally
- **No Server Required**: Everything runs client-side
- **Privacy First**: No data transmitted externally

### File Structure
```
ColorTimer/
├── public/
│   ├── index.html          # Main app interface
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Offline functionality
│   ├── src/               # Synced source files (auto-generated)
│   │   ├── css/
│   │   │   └── styles.css  # Styles and responsive design
│   │   └── js/
│   │       ├── app.js      # Main application controller
│   │       ├── timer.js    # Timer core functionality
│   │       ├── events.js   # Event management system
│   │       └── canvas.js   # Circular timer visualization
│   └── assets/
│       └── icons/         # PWA icons
├── src/                   # Source files (edit these)
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   └── js/               # JavaScript modules
│       ├── app.js        # Main application controller
│       ├── timer.js      # Timer functionality
│       ├── events.js     # Event management
│       └── canvas.js     # Canvas rendering
├── scripts/              # Build and development scripts
├── docs/                 # Documentation
└── README.md             # This file
```

## Customization

### Changing Colors
- Edit the default color schemes in `src/js/events.js`
- Modify CSS custom properties in `src/css/styles.css`

### Adding Features
- Timer logic: Modify `src/js/timer.js`
- Event system: Extend `src/js/events.js`
- Visual elements: Update `src/js/canvas.js`
- UI components: Edit `public/index.html` and `src/css/styles.css`

### Sounds and Notifications
- Completion sound: Modify `playNotificationSound()` in `src/js/app.js`
- Custom notification messages: Edit `showNotification()` method

## Troubleshooting

### PWA Not Installing
- Ensure you're serving over HTTPS or localhost
- Check browser console for manifest errors
- Verify all required icons are present

### Timer Not Saving State
- Check browser's local storage permissions
- Ensure you're not in private/incognito mode

### Canvas Not Displaying
- Verify browser supports HTML5 Canvas
- Check for JavaScript errors in console
- Ensure canvas element is properly sized

### Notifications Not Working
- Grant notification permissions when prompted
- Check browser notification settings
- Some browsers block notifications in private mode

## Development

### Development Workflow
1. **Always edit files in `src/`** - these are your source files
2. **Never edit `public/src/`** - these files are auto-generated
3. **Use development scripts** - they automatically sync your changes

### Available Scripts
- `npm run dev` - Development server with live reload
- `npm start` - Development server (HTTP)
- `npm run serve` - Python development server
- `npm run build` - Production build
- `npm run lint` - ESLint code checking
- `npm run format` - Prettier code formatting
- `npm run audit` - Lighthouse PWA audit

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes in `src/` directory
4. Test thoroughly
5. Submit a pull request

### Testing
- Test on multiple browsers and devices
- Verify PWA functionality
- Check offline capabilities
- Validate responsive design

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by productivity timer apps and the Pomodoro Technique
- Built with modern web standards for maximum compatibility
- Designed with accessibility and usability in mind
