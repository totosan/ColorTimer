#!/usr/bin/env node

/**
 * Development Sync Script
 *
 * This script ensures that the src files are synchronized with the public directory
 * for development purposes. It copies src files to public/src during development.
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const publicSrcDir = path.join(__dirname, '..', 'public', 'src');

// Function to copy directory recursively
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
            console.log(`Copied: ${file}`);
        }
    }
}

// Sync src to public/src
if (fs.existsSync(srcDir)) {
    console.log('🔄 Syncing src files to public/src for development...');
    copyDir(srcDir, publicSrcDir);
    console.log('✅ Dev sync complete!');
} else {
    console.log('⚠️  src directory not found, skipping sync');
}
