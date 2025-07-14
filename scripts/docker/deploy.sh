#!/bin/bash

# Production deployment script for ColorTimer PWA
# Builds and pushes Docker images to container registries

set -euo pipefail

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly IMAGE_NAME="${IMAGE_NAME:-color-timer}"
readonly REGISTRY="${REGISTRY:-}"
readonly VERSION="${VERSION:-$(date +%Y%m%d-%H%M%S)}"
readonly LATEST_TAG="latest"
readonly BUILD_TARGET="production"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi

    if ! docker info > /dev/null 2>&1; then
        log_error "Docker daemon is not running"
        exit 1
    fi

    if [[ -z "${REGISTRY}" ]]; then
        log_error "REGISTRY environment variable is required"
        log_info "Examples:"
        echo "  • Docker Hub: export REGISTRY=your-username"
        echo "  • DigitalOcean: export REGISTRY=registry.digitalocean.com/your-registry"
        echo "  • AWS ECR: export REGISTRY=123456789.dkr.ecr.region.amazonaws.com"
        echo "  • Google GCR: export REGISTRY=gcr.io/your-project-id"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Build production images
build_images() {
    log_info "Building production images..."

    cd "${PROJECT_ROOT}"

    local full_image_versioned="${REGISTRY}/${IMAGE_NAME}:${VERSION}"
    local full_image_latest="${REGISTRY}/${IMAGE_NAME}:${LATEST_TAG}"

    # Build versioned image
    log_info "Building ${full_image_versioned}..."
    docker build \
        --target "${BUILD_TARGET}" \
        --tag "${full_image_versioned}" \
        --tag "${full_image_latest}" \
        --build-arg BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --build-arg VCS_REF="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
        --build-arg VERSION="${VERSION}" \
        --progress=plain \
        .

    if [[ $? -eq 0 ]]; then
        log_success "Production images built successfully!"

        # Show image sizes
        log_info "Image details:"
        docker images "${REGISTRY}/${IMAGE_NAME}" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    else
        log_error "Failed to build production images"
        exit 1
    fi
}

# Push images to registry
push_images() {
    log_info "Pushing images to registry..."

    local full_image_versioned="${REGISTRY}/${IMAGE_NAME}:${VERSION}"
    local full_image_latest="${REGISTRY}/${IMAGE_NAME}:${LATEST_TAG}"

    # Push versioned image
    log_info "Pushing ${full_image_versioned}..."
    docker push "${full_image_versioned}"

    # Push latest image
    log_info "Pushing ${full_image_latest}..."
    docker push "${full_image_latest}"

    if [[ $? -eq 0 ]]; then
        log_success "Images pushed successfully!"
    else
        log_error "Failed to push images to registry"
        exit 1
    fi
}

# Generate deployment configurations
generate_deployment_configs() {
    log_info "Generating deployment configurations..."

    local deploy_dir="${PROJECT_ROOT}/deploy"
    mkdir -p "${deploy_dir}"

    # Docker Compose for production
    cat > "${deploy_dir}/docker-compose.prod.yml" << EOF
version: '3.8'

services:
  color-timer:
    image: ${REGISTRY}/${IMAGE_NAME}:${VERSION}
    ports:
      - "80:8080"
    restart: unless-stopped
    container_name: color-timer-prod
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
        reservations:
          memory: 128M
          cpus: '0.25'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    environment:
      - NODE_ENV=production
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
      - /var/run
EOF

    # Kubernetes deployment
    cat > "${deploy_dir}/k8s-deployment.yml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: color-timer
  labels:
    app: color-timer
spec:
  replicas: 2
  selector:
    matchLabels:
      app: color-timer
  template:
    metadata:
      labels:
        app: color-timer
    spec:
      containers:
      - name: color-timer
        image: ${REGISTRY}/${IMAGE_NAME}:${VERSION}
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 101
---
apiVersion: v1
kind: Service
metadata:
  name: color-timer-service
spec:
  selector:
    app: color-timer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
EOF

    # Cloud Run deployment script
    cat > "${deploy_dir}/deploy-cloud-run.sh" << 'EOF'
#!/bin/bash
gcloud run deploy color-timer \
  --image=${REGISTRY}/${IMAGE_NAME}:${VERSION} \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=256Mi \
  --cpu=1 \
  --max-instances=10 \
  --port=8080 \
  --set-env-vars=NODE_ENV=production
EOF

    chmod +x "${deploy_dir}/deploy-cloud-run.sh"

    log_success "Deployment configurations generated in ${deploy_dir}/"
}

# Show deployment information
show_deployment_info() {
    echo ""
    log_success "Deployment completed successfully!"
    echo ""
    log_info "Registry: ${REGISTRY}"
    log_info "Image: ${IMAGE_NAME}"
    log_info "Version: ${VERSION}"
    log_info "Latest: ${LATEST_TAG}"
    echo ""

    log_info "Quick deployment commands:"
    echo ""
    echo "Docker Compose:"
    echo "  cd deploy && docker-compose -f docker-compose.prod.yml up -d"
    echo ""
    echo "Docker Run:"
    echo "  docker run -d -p 80:8080 --name color-timer ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
    echo ""
    echo "Kubernetes:"
    echo "  kubectl apply -f deploy/k8s-deployment.yml"
    echo ""
    echo "Cloud Run (Google Cloud):"
    echo "  cd deploy && ./deploy-cloud-run.sh"
    echo ""
}

# Show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help           Show this help message"
    echo "  --build-only         Only build, don't push"
    echo "  --skip-configs       Skip generating deployment configs"
    echo ""
    echo "Required environment variables:"
    echo "  REGISTRY            Container registry URL"
    echo ""
    echo "Optional environment variables:"
    echo "  IMAGE_NAME          Image name (default: color-timer)"
    echo "  VERSION            Version tag (default: timestamp)"
    echo ""
    echo "Registry examples:"
    echo "  • Docker Hub: export REGISTRY=your-username"
    echo "  • DigitalOcean: export REGISTRY=registry.digitalocean.com/your-registry"
    echo "  • AWS ECR: export REGISTRY=123456789.dkr.ecr.region.amazonaws.com"
    echo "  • Google GCR: export REGISTRY=gcr.io/your-project-id"
}

# Main function
main() {
    local build_only=false
    local skip_configs=false

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                exit 0
                ;;
            --build-only)
                build_only=true
                shift
                ;;
            --skip-configs)
                skip_configs=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done

    log_info "Starting ColorTimer production deployment..."
    log_info "Configuration:"
    echo "  • Registry: ${REGISTRY}"
    echo "  • Image: ${IMAGE_NAME}"
    echo "  • Version: ${VERSION}"
    echo "  • Target: ${BUILD_TARGET}"
    echo ""

    check_prerequisites
    build_images

    if [[ "${build_only}" == "true" ]]; then
        log_success "Build completed! Images are ready locally."
        log_info "To push later, run: docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
        exit 0
    fi

    # Confirm push
    log_warning "About to push images to ${REGISTRY}"
    echo "Make sure you're logged in to your container registry!"
    echo ""
    read -p "Continue with push? (y/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Push cancelled. Images are built locally."
        exit 0
    fi

    push_images

    if [[ "${skip_configs}" != "true" ]]; then
        generate_deployment_configs
    fi

    show_deployment_info
}

# Run main function
main "$@"
