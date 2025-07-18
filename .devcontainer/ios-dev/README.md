# Color Timer iOS Development Container

Diese DevContainer-Konfiguration ist speziell für die Entwicklung der Color Timer PWA als iOS-App mit Capacitor eingerichtet.

## Was ist enthalten?

### Tools und Frameworks
- **Capacitor**: Für die Umwandlung der PWA in eine native iOS-App
- **Ionic CLI**: Für erweiterte mobile Entwicklung
- **Node.js & npm**: Für die JavaScript-Entwicklung
- **CocoaPods**: Für iOS-Abhängigkeiten

### VS Code Extensions
- **Ionic Extension**: Für Ionic/Capacitor-Entwicklung
- **Cordova Extension**: Für Cordova-Plugin-Unterstützung
- **Swift Extension**: Für Swift-Code-Unterstützung
- **XML/Plist Extensions**: Für iOS-Konfigurationsdateien

## Schnellstart

### 1. Container starten
```bash
# Öffnen Sie VS Code und wählen Sie "Reopen in Container"
# Oder verwenden Sie die Command Palette: "Dev Containers: Reopen in Container"
```

### 2. iOS-Plattform initialisieren
```bash
npm run ios:init
```

### 3. App bauen und synchronisieren
```bash
npm run ios:build
npm run ios:sync
```

### 4. Für Xcode öffnen (nur auf macOS)
```bash
npm run ios:open
```

## Entwicklungsworkflow

### Lokale Entwicklung
```bash
# Normale Web-Entwicklung
npm run dev

# iOS-Entwicklung mit Live Reload
npm run dev:ios
```

### Build-Prozess
```bash
# Web-Assets bauen
npm run build

# iOS-spezifischer Build
npm run ios:build

# Synchronisation mit iOS-Projekt
npm run ios:sync
```

## Verfügbare npm Scripts

- `ios:init` - iOS-Plattform hinzufügen
- `ios:build` - Web-Assets bauen und zu iOS kopieren
- `ios:sync` - Assets synchronisieren und native Abhängigkeiten aktualisieren
- `ios:run` - App auf iOS-Gerät/Simulator ausführen
- `ios:open` - iOS-Projekt in Xcode öffnen
- `dev:ios` - Entwicklungsserver mit Live Reload für iOS

## Capacitor-Konfiguration

Die Konfiguration befindet sich in `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.colortimer.app',
  appName: 'Color Timer',
  webDir: 'public',
  // ... weitere Konfiguration
};
```

### Wichtige Einstellungen:
- **appId**: Bundle-Identifier für iOS (ändern Sie dies für Ihre App)
- **appName**: Anzeigename der App
- **webDir**: Verzeichnis mit den Web-Assets

## Plugins und Features

### Vorinstallierte Plugins:
- **@capacitor/app**: App-Status und -Informationen
- **@capacitor/haptics**: Haptisches Feedback
- **@capacitor/local-notifications**: Lokale Benachrichtigungen
- **@capacitor/status-bar**: Status-Bar-Anpassung
- **@capacitor/splash-screen**: Splash-Screen-Kontrolle
- **@capacitor/preferences**: Datenspeicherung
- **@capacitor/device**: Geräteinformationen
- **@capacitor/toast**: Toast-Benachrichtigungen

### Zusätzliche Plugins installieren:
```bash
npm install @capacitor/camera
npx cap sync ios
```

## App-Icons und Splash-Screens

### Icons generieren:
1. Platzieren Sie Ihr Quell-Icon (1024x1024 PNG) in `resources/icon.png`
2. Installieren Sie das Assets-Tool:
   ```bash
   npm install -g @capacitor/assets
   ```
3. Generieren Sie die Icons:
   ```bash
   npx @capacitor/assets generate
   ```

### Manuelle Icon-Erstellung:
Platzieren Sie Icons in den entsprechenden Größen in:
- `resources/icons/` für Web-Icons
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/` für iOS-Icons

## Debugging und Testing

### Browser-Testing:
```bash
npm run dev
# Öffnen Sie http://localhost:3003 im Browser
```

### iOS-Simulator (nur macOS):
```bash
npm run ios:run
```

### Device-Testing:
1. Verbinden Sie ein iOS-Gerät
2. Aktivieren Sie Developer-Modus
3. Verwenden Sie Xcode für die Installation

## Wichtige Hinweise

### Einschränkungen des DevContainers:
- **Xcode**: Läuft nur auf macOS
- **iOS Simulator**: Nur auf macOS verfügbar
- **Device Testing**: Erfordert macOS für finales Deployment

### Empfohlener Workflow:
1. **Entwicklung**: Im DevContainer (Linux)
2. **Testing**: Web-Browser im DevContainer
3. **iOS-Build**: Projekt auf macOS übertragen
4. **Deployment**: Xcode auf macOS verwenden

## Fehlerbehebung

### Häufige Probleme:

#### "capacitor: command not found"
```bash
npm install -g @capacitor/cli
```

#### "CocoaPods not found"
```bash
sudo gem install cocoapods
```

#### "iOS platform not found"
```bash
npm run ios:init
```

#### Assets nicht synchronisiert
```bash
npm run ios:build
npm run ios:sync
```

## Deployment

### Vorbereitung für App Store:
1. Übertragen Sie das Projekt auf macOS
2. Öffnen Sie in Xcode
3. Konfigurieren Sie Signing & Capabilities
4. Erstellen Sie Archive für Distribution

### TestFlight:
1. Archive in Xcode erstellen
2. Upload zu App Store Connect
3. TestFlight-Testing konfigurieren

## Weitere Ressourcen

- [Capacitor Dokumentation](https://capacitorjs.com/docs)
- [Ionic Dokumentation](https://ionicframework.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)

## Support

Bei Problemen mit der iOS-Entwicklung:
1. Prüfen Sie die Capacitor-Dokumentation
2. Verwenden Sie `npx cap doctor` für Diagnose
3. Prüfen Sie die iOS-Logs in Xcode
