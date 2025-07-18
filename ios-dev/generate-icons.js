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
