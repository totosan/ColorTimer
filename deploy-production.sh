#!/bin/bash

# DEPRECATED: This script has been moved and enhanced
# Please use the new script at: scripts/docker/deploy.sh

echo "⚠️  DEPRECATED: This script has been moved!"
echo ""
echo "🔄 Please use the new enhanced script:"
echo "   ./scripts/docker/deploy.sh"
echo ""
echo "✨ New features:"
echo "   • Multi-registry support (Docker Hub, AWS ECR, GCR, DigitalOcean)"
echo "   • Automatic deployment config generation"
echo "   • Better error handling and validation"
echo "   • Kubernetes and Cloud Run support"
echo "   • Security hardening"
echo ""
echo "📖 See docker/README.md for full documentation"
echo ""
echo "⚙️  Required: Set REGISTRY environment variable"
echo "   export REGISTRY=your-registry.com"
echo ""

read -p "Run new script now? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    exec ./scripts/docker/deploy.sh "$@"
else
    echo "Exiting. Please use ./scripts/docker/deploy.sh"
    exit 1
fi
