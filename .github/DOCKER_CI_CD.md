# Docker and CI/CD Setup

This document describes the Docker containerization and GitHub Actions CI/CD pipeline for the ColorTimer PWA.

## Docker Image

The application is containerized using a multi-stage Docker build that:

1. **Build Stage**: Uses Node.js to build the application
2. **Production Stage**: Uses nginx to serve the static files

### Key Features

- **Multi-platform support**: Builds for both `linux/amd64` and `linux/arm64`
- **Security**: Runs as non-root user with read-only filesystem
- **Health checks**: Built-in health monitoring
- **Optimized**: Multi-stage build reduces final image size
- **Caching**: Utilizes Docker layer caching for faster builds

### Building Locally

```bash
# Build the image
docker build -t color-timer .

# Run the container
docker run -p 8080:8080 color-timer

# Access the application
open http://localhost:8080
```

## GitHub Actions Workflows

### 1. Docker Build and Deploy (`docker-build-deploy.yml`)

**Triggers:**
- Push to `main`/`master` branch
- Push tags starting with `v` (e.g., `v1.0.0`)
- Pull requests to `main`/`master`
- Manual workflow dispatch

**Features:**
- Builds multi-platform Docker images
- Pushes to GitHub Container Registry (ghcr.io)
- Security scanning with Trivy
- Automatic tagging based on branch/tag
- Staging deployment on main branch pushes
- Production deployment on version tags

**Image Tags:**
- `latest` - Latest build from main/master branch
- `main` or `master` - Latest build from respective branch
- `pr-<number>` - Pull request builds
- `v1.0.0` - Semantic version tags
- `sha-<commit>` - Commit-based tags

### 2. Docker Test (`docker-test.yml`)

**Triggers:**
- Pull requests that modify Docker-related files or source code

**Features:**
- Tests Docker image build
- Runs basic functionality tests
- Security vulnerability scanning
- Fails on critical/high severity vulnerabilities

## GitHub Container Registry

Images are published to GitHub Container Registry at:
```
ghcr.io/totosan/colortimer
```

### Using the Published Image

```bash
# Pull and run the latest image
docker run -p 8080:8080 ghcr.io/totosan/colortimer:latest

# Pull a specific version
docker run -p 8080:8080 ghcr.io/totosan/colortimer:v1.0.0
```

## Deployment Environments

### Staging
- **Trigger**: Push to main/master branch
- **Environment**: `staging`
- **Image**: `latest` tag

### Production
- **Trigger**: Push version tags (e.g., `v1.0.0`)
- **Environment**: `production`
- **Image**: Specific version tag

## Security

### Image Security
- Non-root user execution
- Minimal base image (Alpine Linux)
- Regular security scanning with Trivy
- Read-only filesystem where possible

### CI/CD Security
- Uses GitHub OIDC for registry authentication
- Scoped permissions (contents: read, packages: write)
- Vulnerability scanning on every build
- Security alerts uploaded to GitHub Security tab

## Environment Variables

The following secrets/variables may be needed for deployment:

### Repository Secrets
- `GITHUB_TOKEN` - Automatically provided by GitHub

### Repository Variables (if needed for deployment)
- `STAGING_SERVER` - Staging server details
- `PRODUCTION_SERVER` - Production server details

## Monitoring and Health Checks

The Docker container includes:
- **Health check endpoint**: `http://localhost:8080/health`
- **Monitoring**: Container health status
- **Logging**: nginx access and error logs

## Troubleshooting

### Build Issues
1. Check the GitHub Actions logs
2. Verify Dockerfile syntax
3. Test build locally

### Deployment Issues
1. Check environment configurations
2. Verify registry permissions
3. Review deployment logs

### Image Issues
1. Check security scan results
2. Verify image tags
3. Test image locally

## Development Workflow

1. **Feature Development**: Create feature branch
2. **Testing**: Push triggers test workflow
3. **Code Review**: Create pull request
4. **Staging**: Merge to main deploys to staging
5. **Production**: Create version tag deploys to production

## Commands Reference

```bash
# Build image locally
docker build -t color-timer .

# Run with health check
docker run -p 8080:8080 --health-cmd="curl -f http://localhost:8080/health" color-timer

# Check container health
docker inspect --format='{{.State.Health.Status}}' <container-id>

# View logs
docker logs <container-id>

# Security scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image color-timer
```
