#!/usr/bin/env node

// Simple icon generator script
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// SVG icon template - a simple timer icon
function createSVGIcon(size) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ff6666;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff4444;stop-opacity:1" />
        </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#grad)" stroke="#cc3333" stroke-width="2"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
    <line x1="50" y1="50" x2="50" y2="25" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="65" y2="50" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="3" fill="#ffffff"/>
</svg>`;
}

// Create SVG files for different sizes
const sizes = [192, 512];

sizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`Created ${svgPath}`);
});

console.log('SVG icons created! Convert them to PNG using online tools or ImageMagick if available.');
console.log('For now, you can use the SVG files directly by updating the manifest.');
