# 🚨 MOVED: Docker Documentation

The Docker configuration and documentation has been restructured and moved!

## 📍 New Location

Please see **`docker/README.md`** for the complete Docker documentation.

## 🔄 What Changed

- **Better organization**: Docker configs moved to `docker/` directory
- **Enhanced scripts**: New scripts in `scripts/docker/` with better features
- **Security improvements**: Non-root execution, read-only filesystem
- **Production ready**: Resource limits, health checks, monitoring
- **Multi-platform**: Support for Docker Hub, AWS ECR, GCR, DigitalOcean

## 🚀 Quick Start

```bash
# Local development
./scripts/docker/build.sh

# Production deployment (set REGISTRY first)
export REGISTRY="your-registry.com"
./scripts/docker/deploy.sh
```

## 📖 Full Documentation

See [`docker/README.md`](docker/README.md) for:
- Complete setup instructions
- Security features
- Deployment options
- Troubleshooting guide
- Migration information

---

*This file is deprecated and will be removed in a future version.*
