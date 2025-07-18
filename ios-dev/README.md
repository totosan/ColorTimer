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
