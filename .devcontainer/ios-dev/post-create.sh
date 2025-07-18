#!/bin/bash

# Color Timer iOS Development Environment Setup
echo "🚀 Setting up Color Timer iOS Development Environment..."

# Update package lists
sudo apt-get update

# Install required packages for iOS development
echo "📦 Installing iOS development dependencies..."
sudo apt-get install -y \
    build-essential \
    python3-dev \
    libssl-dev \
    libffi-dev \
    default-jdk \
    gradle \
    android-sdk \
    wget \
    unzip \
    curl

# Install Ionic CLI and Capacitor globally
echo "🔧 Installing Ionic CLI and Capacitor..."
npm install -g @ionic/cli @capacitor/cli @capacitor/core

# Install Capacitor iOS dependencies
echo "📱 Installing Capacitor iOS dependencies..."
npm install -g @capacitor/ios

# Install CocoaPods (for iOS dependencies)
echo "🍎 Installing CocoaPods..."
sudo gem install cocoapods || echo "CocoaPods installation failed, will install later"

# Install project dependencies
echo "📦 Installing project dependencies..."
if [ -f "package.json" ]; then
    npm install
fi

# Install additional Capacitor plugins that might be useful for a Timer PWA
echo "🔌 Installing useful Capacitor plugins..."
npm install --save @capacitor/app @capacitor/haptics @capacitor/local-notifications @capacitor/status-bar @capacitor/splash-screen @capacitor/preferences @capacitor/device @capacitor/toast

# Create iOS development directories
echo "📁 Creating iOS development directories..."
mkdir -p ios-dev
mkdir -p resources/icons
mkdir -p resources/splash

# Create a basic capacitor.config.ts if it doesn't exist
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️ Creating Capacitor configuration..."
    cat > capacitor.config.ts << 'EOF'
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.colortimer.app',
  appName: 'Color Timer',
  webDir: 'public',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;
EOF
fi

# Create iOS-specific package.json scripts
echo "📝 Updating package.json for iOS development..."
if [ -f "package.json" ]; then
    # Create a backup
    cp package.json package.json.backup

    # Add iOS-specific scripts using Node.js
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    pkg.scripts = pkg.scripts || {};
    pkg.scripts['ios:init'] = 'ionic capacitor add ios';
    pkg.scripts['ios:build'] = 'npm run build && ionic capacitor copy ios';
    pkg.scripts['ios:sync'] = 'ionic capacitor sync ios';
    pkg.scripts['ios:run'] = 'ionic capacitor run ios';
    pkg.scripts['ios:open'] = 'ionic capacitor open ios';
    pkg.scripts['dev:ios'] = 'ionic capacitor run ios --livereload --external';

    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
fi

# Create iOS development documentation
echo "📚 Creating iOS development documentation..."
cat > ios-dev/README.md << 'EOF'
# Color Timer iOS Development

This environment is set up for developing the Color Timer PWA as an iOS app using Capacitor.

## Getting Started

1. **Initialize iOS platform:**
   ```bash
   npm run ios:init
   ```

2. **Build and sync:**
   ```bash
   npm run ios:build
   npm run ios:sync
   ```

3. **Open in Xcode (requires macOS):**
   ```bash
   npm run ios:open
   ```

## Development Workflow

### For Development with Live Reload:
```bash
npm run dev:ios
```

### For Production Build:
```bash
npm run build
npm run ios:build
```

## Required Tools

- **Xcode**: Required for iOS development and testing on macOS
- **iOS Simulator**: For testing without physical device
- **Apple Developer Account**: Required for device testing and App Store deployment

## Capacitor Commands

- `npx cap add ios` - Add iOS platform
- `npx cap copy ios` - Copy web assets to iOS
- `npx cap sync ios` - Sync web assets and update native dependencies
- `npx cap open ios` - Open iOS project in Xcode
- `npx cap run ios` - Run on iOS device/simulator

## Configuration

The main configuration is in `capacitor.config.ts`. Key settings:
- `appId`: Bundle identifier for iOS
- `appName`: Display name
- `webDir`: Web assets directory
- Platform-specific settings

## Resources

- Icons: Place in `resources/icons/`
- Splash screens: Place in `resources/splash/`
- Use `@capacitor/assets` for generating app icons and splash screens

## Plugins Available

- **@capacitor/app**: App state and info
- **@capacitor/haptics**: Haptic feedback
- **@capacitor/local-notifications**: Local notifications
- **@capacitor/status-bar**: Status bar customization
- **@capacitor/splash-screen**: Splash screen control
- **@capacitor/preferences**: Data storage
- **@capacitor/device**: Device information
- **@capacitor/toast**: Toast notifications

## Notes

- iOS development requires macOS for final testing and deployment
- This DevContainer provides the basic setup and tooling
- For actual iOS compilation, you'll need to use a macOS environment
EOF

# Create a simple iOS app icon generator script
echo "🎨 Creating icon generator helper..."
cat > ios-dev/generate-icons.js << 'EOF'
const fs = require('fs');
const path = require('path');

console.log('📱 iOS Icon Generator Helper');
console.log('');
console.log('To generate iOS app icons from your PWA icon:');
console.log('');
console.log('1. Install @capacitor/assets:');
console.log('   npm install -g @capacitor/assets');
console.log('');
console.log('2. Place your source icon (1024x1024 PNG) in resources/icon.png');
console.log('');
console.log('3. Run the generator:');
console.log('   npx @capacitor/assets generate --iconBackgroundColor="#ffffff" --iconBackgroundColorDark="#000000" --splashBackgroundColor="#ffffff" --splashBackgroundColorDark="#000000"');
console.log('');
console.log('This will generate all required iOS icon sizes and splash screens.');
EOF

# Set up git hooks for iOS development
echo "🔗 Setting up git hooks for iOS development..."
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for iOS development
echo "🔍 Running pre-commit checks for iOS development..."

# Check if capacitor.config.ts exists and is valid
if [ -f "capacitor.config.ts" ]; then
    echo "✅ Capacitor config found"
else
    echo "⚠️  Capacitor config not found"
fi

# Check if iOS platform is added
if [ -d "ios" ]; then
    echo "✅ iOS platform detected"
else
    echo "ℹ️  iOS platform not yet added (run 'npm run ios:init')"
fi
EOF

chmod +x .git/hooks/pre-commit

# Print setup completion message
echo ""
echo "🎉 iOS Development Environment Setup Complete!"
echo ""
echo "📱 Next Steps:"
echo "1. Run 'npm run ios:init' to initialize the iOS platform"
echo "2. Run 'npm run ios:build' to build and sync your app"
echo "3. Use 'npm run ios:open' to open in Xcode (requires macOS)"
echo ""
echo "📖 See ios-dev/README.md for detailed documentation"
echo ""
echo "🍎 Note: Final iOS compilation and testing requires macOS with Xcode"
