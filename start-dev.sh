#!/bin/bash
echo "🎨 Starting Color Timer Development Server..."
echo "Choose your preferred server:"
echo "1) HTTP Server (port 3003) - Recommended"
echo "2) Live Server (port 3003) - Auto-reload"
echo "3) Python Server (port 8000) - Simple"
echo ""
read -p "Select option (1-3): " choice

case $choice in
    1)
        echo "Starting HTTP Server on port 3003..."
        npm run start
        ;;
    2)
        echo "Starting Live Server on port 3003..."
        npm run dev
        ;;
    3)
        echo "Starting Python Server on port 8000..."
        npm run serve
        ;;
    *)
        echo "Invalid choice. Starting HTTP Server..."
        npm run start
        ;;
esac
