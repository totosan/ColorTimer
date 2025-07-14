#!/bin/bash

# Docker build script for ColorTimer PWA
# Following Docker best practices and security guidelines

set -euo pipefail

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly IMAGE_NAME="${IMAGE_NAME:-color-timer}"
readonly IMAGE_TAG="${IMAGE_TAG:-latest}"
readonly CONTAINER_NAME="${CONTAINER_NAME:-color-timer-app}"
readonly PORT="${PORT:-8080}"
readonly BUILD_TARGET="${BUILD_TARGET:-production}"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

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
        log_error "Docker is not installed. Please install Docker and try again."
        exit 1
    fi

    if ! docker info > /dev/null 2>&1; then
        log_error "Docker daemon is not running. Please start Docker and try again."
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Clean up existing containers and images
cleanup() {
    log_info "Cleaning up existing containers and images..."

    # Stop and remove container if it exists
    if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log_warning "Stopping and removing existing container: ${CONTAINER_NAME}"
        docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
        docker rm "${CONTAINER_NAME}" >/dev/null 2>&1 || true
    fi

    # Remove dangling images
    if [[ $(docker images -f "dangling=true" -q | wc -l) -gt 0 ]]; then
        log_info "Removing dangling images..."
        docker rmi $(docker images -f "dangling=true" -q) >/dev/null 2>&1 || true
    fi
}

# Build Docker image
build_image() {
    log_info "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"

    cd "${PROJECT_ROOT}"

    # Build with build args and target
    docker build \
        --target "${BUILD_TARGET}" \
        --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
        --build-arg BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --build-arg VCS_REF="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
        --build-arg VERSION="${IMAGE_TAG}" \
        --progress=plain \
        .

    if [[ $? -eq 0 ]]; then
        log_success "Docker image built successfully!"

        # Show image size
        local image_size
        image_size=$(docker images "${IMAGE_NAME}:${IMAGE_TAG}" --format "table {{.Size}}" | tail -n 1)
        log_info "Image size: ${image_size}"
    else
        log_error "Failed to build Docker image"
        exit 1
    fi
}

# Run container
run_container() {
    log_info "Starting container: ${CONTAINER_NAME} on port ${PORT}"

    docker run \
        --detach \
        --name "${CONTAINER_NAME}" \
        --publish "${PORT}:8080" \
        --restart unless-stopped \
        --memory="256m" \
        --cpus="0.5" \
        --read-only \
        --tmpfs /tmp \
        --tmpfs /var/cache/nginx \
        --tmpfs /var/run \
        "${IMAGE_NAME}:${IMAGE_TAG}"

    if [[ $? -eq 0 ]]; then
        log_success "Container started successfully!"

        # Wait for container to be ready
        log_info "Waiting for container to be ready..."
        local retries=0
        local max_retries=30

        while [[ ${retries} -lt ${max_retries} ]]; do
            if curl -sf "http://localhost:${PORT}/health" >/dev/null 2>&1; then
                log_success "Container is healthy and ready!"
                break
            fi

            ((retries++))
            sleep 1
        done

        if [[ ${retries} -eq ${max_retries} ]]; then
            log_error "Container failed to become ready within ${max_retries} seconds"
            log_info "Container logs:"
            docker logs "${CONTAINER_NAME}"
            exit 1
        fi

        show_container_info
    else
        log_error "Failed to start container"
        exit 1
    fi
}

# Show container information
show_container_info() {
    echo ""
    log_info "Container details:"
    echo "  • Name: ${CONTAINER_NAME}"
    echo "  • Image: ${IMAGE_NAME}:${IMAGE_TAG}"
    echo "  • Port: ${PORT}"
    echo "  • URL: http://localhost:${PORT}"
    echo "  • Health: http://localhost:${PORT}/health"
    echo ""

    log_info "Useful commands:"
    echo "  • View logs: docker logs ${CONTAINER_NAME}"
    echo "  • Follow logs: docker logs -f ${CONTAINER_NAME}"
    echo "  • Stop container: docker stop ${CONTAINER_NAME}"
    echo "  • Restart container: docker restart ${CONTAINER_NAME}"
    echo "  • Remove container: docker rm -f ${CONTAINER_NAME}"
    echo "  • Shell into container: docker exec -it ${CONTAINER_NAME} sh"
    echo ""

    log_success "ColorTimer is now running at http://localhost:${PORT}"
}

# Show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help           Show this help message"
    echo "  -c, --cleanup-only   Only cleanup, don't build or run"
    echo "  -b, --build-only     Only build, don't run container"
    echo "  --no-cache          Build without using cache"
    echo ""
    echo "Environment variables:"
    echo "  IMAGE_NAME          Docker image name (default: color-timer)"
    echo "  IMAGE_TAG           Docker image tag (default: latest)"
    echo "  CONTAINER_NAME      Container name (default: color-timer-app)"
    echo "  PORT               Host port to bind to (default: 8080)"
    echo "  BUILD_TARGET       Docker build target (default: production)"
}

# Main function
main() {
    local cleanup_only=false
    local build_only=false
    local no_cache=false

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                exit 0
                ;;
            -c|--cleanup-only)
                cleanup_only=true
                shift
                ;;
            -b|--build-only)
                build_only=true
                shift
                ;;
            --no-cache)
                no_cache=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done

    log_info "Starting ColorTimer Docker build process..."
    log_info "Configuration:"
    echo "  • Image: ${IMAGE_NAME}:${IMAGE_TAG}"
    echo "  • Container: ${CONTAINER_NAME}"
    echo "  • Port: ${PORT}"
    echo "  • Target: ${BUILD_TARGET}"
    echo ""

    check_prerequisites
    cleanup

    if [[ "${cleanup_only}" == "true" ]]; then
        log_success "Cleanup completed!"
        exit 0
    fi

    if [[ "${no_cache}" == "true" ]]; then
        export DOCKER_BUILDKIT=1
        build_image --no-cache
    else
        build_image
    fi

    if [[ "${build_only}" == "true" ]]; then
        log_success "Build completed!"
        exit 0
    fi

    run_container
}

# Run main function
main "$@"
