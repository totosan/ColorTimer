#!/bin/bash

# Color Timer Development Server
echo "🎨 Color Timer PWA - Development Server"
echo "======================================="
echo ""

# Check if we're in the right directory
if [ ! -f "public/index.html" ]; then
    echo "❌ Error: public/index.html not found. Make sure you're in the ColorTimer directory."
    exit 1
fi

echo "📁 Project structure:"
ls -la

echo ""
echo "🔧 Starting development server..."
echo ""

# Navigate to public directory for serving
cd public

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3 server on http://localhost:8000"
    echo "📱 For PWA testing, use: http://localhost:8000"
    echo ""
    echo "🚀 Open your browser and navigate to: http://localhost:8000"
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    echo "📁 Serving from: $(pwd)"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🐍 Using Python 2 server on http://localhost:8000"
    echo "📱 For PWA testing, use: http://localhost:8000"
    echo ""
    echo "🚀 Open your browser and navigate to: http://localhost:8000"
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    echo "📁 Serving from: $(pwd)"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found. Please install Python or use another local server."
    echo ""
    echo "🔧 Alternative options:"
    echo "   • Install Python: https://python.org"
    echo "   • Use Node.js: npx serve ."
    echo "   • Use VS Code Live Server extension"
    echo "   • Use any other local development server"
    exit 1
fi
