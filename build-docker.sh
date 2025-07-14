#!/bin/bash

# DEPRECATED: This script has been moved and enhanced
# Please use the new script at: scripts/docker/build.sh

echo "⚠️  DEPRECATED: This script has been moved!"
echo ""
echo "🔄 Please use the new enhanced script:"
echo "   ./scripts/docker/build.sh"
echo ""
echo "✨ New features:"
echo "   • Better security (non-root, read-only filesystem)"
echo "   • Resource limits and health checks"
echo "   • Enhanced logging and error handling"
echo "   • More deployment options"
echo ""
echo "📖 See docker/README.md for full documentation"
echo ""

read -p "Run new script now? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    exec ./scripts/docker/build.sh "$@"
else
    echo "Exiting. Please use ./scripts/docker/build.sh"
    exit 1
fi
