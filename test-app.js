#!/usr/bin/env node

// Simple test script to validate the Color Timer application
const fs = require('fs');
const path = require('path');

console.log('🎨 Color Timer PWA - Validation Test');
console.log('=====================================\n');

// List of required files
const requiredFiles = [
    'index.html',
    'manifest.json',
    'service-worker.js',
    'css/styles.css',
    'js/app.js',
    'js/timer.js',
    'js/events.js',
    'js/canvas.js',
    'README.md'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

console.log('\n📊 File sizes:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const size = (stats.size / 1024).toFixed(1);
        console.log(`   ${file}: ${size} KB`);
    }
});

// Check HTML structure
console.log('\n🔍 Validating HTML structure:');
try {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    const checks = [
        { test: htmlContent.includes('<canvas id="timerCanvas"'), desc: 'Canvas element' },
        { test: htmlContent.includes('manifest.json'), desc: 'PWA manifest link' },
        { test: htmlContent.includes('service-worker.js'), desc: 'Service worker registration' },
        { test: htmlContent.includes('css/styles.css'), desc: 'CSS stylesheet link' },
        { test: htmlContent.includes('js/app.js'), desc: 'Main app script' }
    ];
    
    checks.forEach(check => {
        console.log(`${check.test ? '✅' : '❌'} ${check.desc}`);
    });
} catch (error) {
    console.log('❌ Could not read index.html');
}

// Check JavaScript modules
console.log('\n🔧 Validating JavaScript modules:');
const jsFiles = ['js/app.js', 'js/timer.js', 'js/events.js', 'js/canvas.js'];
jsFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const hasClass = content.includes('class ');
        const hasFunction = content.includes('function ') || content.includes('=>');
        console.log(`${hasClass || hasFunction ? '✅' : '❌'} ${file} - Contains functions/classes`);
    } catch (error) {
        console.log(`❌ ${file} - Could not read`);
    }
});

// Check manifest.json
console.log('\n📱 Validating PWA manifest:');
try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    const manifestChecks = [
        { test: manifest.name, desc: 'App name' },
        { test: manifest.short_name, desc: 'Short name' },
        { test: manifest.start_url, desc: 'Start URL' },
        { test: manifest.display, desc: 'Display mode' },
        { test: manifest.icons && manifest.icons.length > 0, desc: 'Icons array' }
    ];
    
    manifestChecks.forEach(check => {
        console.log(`${check.test ? '✅' : '❌'} ${check.desc}`);
    });
} catch (error) {
    console.log('❌ Could not parse manifest.json');
}

console.log('\n🚀 Next steps:');
if (allFilesExist) {
    console.log('✅ All core files are present!');
    console.log('\n📋 To run the application:');
    console.log('   1. Generate icons: Open generate-icons.html in browser');
    console.log('   2. Start server: ./start-server.sh (or python3 -m http.server 8000)');
    console.log('   3. Open browser: http://localhost:8000');
    console.log('   4. Test PWA features in Chrome/Edge for best experience');
} else {
    console.log('❌ Some files are missing. Please check the file structure.');
}

console.log('\n🎯 Features to test:');
console.log('   • Timer controls (start, pause, stop, reset)');
console.log('   • Custom time setting');
console.log('   • Event creation and editing');
console.log('   • Color-coded timer phases');
console.log('   • PWA installation (Chrome/Edge)');
console.log('   • Offline functionality');
console.log('   • Responsive design (mobile/tablet)');

console.log('\n💡 Tips:');
console.log('   • Use Chrome DevTools for debugging');
console.log('   • Check Application tab for PWA features');
console.log('   • Test offline by going offline in DevTools');
console.log('   • Check console for any JavaScript errors');
