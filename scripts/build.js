#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Clean and create dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy public directory to dist
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);

    for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy source files to dist with updated paths
const publicDir = path.join(__dirname, '..', 'public');
copyDir(publicDir, distDir);

// Update HTML file paths for production
const htmlPath = path.join(distDir, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Update CSS and JS paths to be relative for production
htmlContent = htmlContent.replace('../src/css/styles.css', 'assets/css/styles.css');
htmlContent = htmlContent.replace('../src/js/timer.js', 'assets/js/timer.js');
htmlContent = htmlContent.replace('../src/js/events.js', 'assets/js/events.js');
htmlContent = htmlContent.replace('../src/js/canvas.js', 'assets/js/canvas.js');
htmlContent = htmlContent.replace('../src/js/app.js', 'assets/js/app.js');

fs.writeFileSync(htmlPath, htmlContent);

// Copy and organize assets
const srcDir = path.join(__dirname, '..', 'src');
const assetsDir = path.join(distDir, 'assets');

// Copy CSS
const cssDestDir = path.join(assetsDir, 'css');
fs.mkdirSync(cssDestDir, { recursive: true });
copyDir(path.join(srcDir, 'css'), cssDestDir);

// Copy JS
const jsDestDir = path.join(assetsDir, 'js');
fs.mkdirSync(jsDestDir, { recursive: true });
copyDir(path.join(srcDir, 'js'), jsDestDir);

console.log('✅ Build completed! Files are in the dist/ directory');
console.log('📁 Structure:');
console.log('   dist/');
console.log('   ├── index.html');
console.log('   ├── manifest.json');
console.log('   ├── service-worker.js');
console.log('   └── assets/');
console.log('       ├── css/');
console.log('       ├── js/');
console.log('       └── icons/');
