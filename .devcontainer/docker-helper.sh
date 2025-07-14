#!/bin/bash

# Docker Helper Script for ColorTimer Development
# This script provides easy access to common Docker operations

echo "🐳 ColorTimer Docker Helper"
echo "=========================="
echo ""

# Function to check if Docker is available
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not available. Please ensure Docker-in-Docker is properly configured."
        exit 1
    fi
    
    if ! docker ps &> /dev/null; then
        echo "⚠️  Docker daemon is not running. Starting Docker..."
        sudo service docker start
        sleep 2
    fi
}

# Function to build the Docker image
build_image() {
    echo "🔨 Building ColorTimer Docker image..."
    docker build -t colortimer:latest .
    if [ $? -eq 0 ]; then
        echo "✅ Docker image built successfully!"
    else
        echo "❌ Failed to build Docker image"
        exit 1
    fi
}

# Function to run the Docker container
run_container() {
    echo "🚀 Running ColorTimer container on port 8080..."
    docker run -d -p 8080:80 --name colortimer-container colortimer:latest
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully!"
        echo "🌐 Access your app at: http://localhost:8080"
    else
        echo "❌ Failed to start container"
    fi
}

# Function to stop and remove container
stop_container() {
    echo "🛑 Stopping ColorTimer container..."
    docker stop colortimer-container 2>/dev/null
    docker rm colortimer-container 2>/dev/null
    echo "✅ Container stopped and removed"
}

# Function to show container logs
show_logs() {
    echo "📋 ColorTimer container logs:"
    docker logs colortimer-container
}

# Function to show Docker status
show_status() {
    echo "📊 Docker Status:"
    echo "=================="
    echo "Docker version:"
    docker --version
    echo ""
    echo "Running containers:"
    docker ps
    echo ""
    echo "Available images:"
    docker images | grep -E "(colortimer|REPOSITORY)"
    echo ""
}

# Function to clean up Docker resources
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    echo "Stopping and removing ColorTimer containers..."
    docker stop $(docker ps -q --filter "ancestor=colortimer") 2>/dev/null
    docker rm $(docker ps -aq --filter "ancestor=colortimer") 2>/dev/null
    echo "Removing ColorTimer images..."
    docker rmi colortimer:latest 2>/dev/null
    echo "✅ Cleanup completed"
}

# Function to run with Docker Compose
compose_up() {
    echo "🐙 Starting with Docker Compose..."
    docker-compose up -d
    if [ $? -eq 0 ]; then
        echo "✅ Docker Compose started successfully!"
        echo "🌐 Access your app at: http://localhost:8080"
    else
        echo "❌ Failed to start with Docker Compose"
    fi
}

# Function to stop Docker Compose
compose_down() {
    echo "🐙 Stopping Docker Compose..."
    docker-compose down
    echo "✅ Docker Compose stopped"
}

# Main menu
show_menu() {
    echo "Choose an option:"
    echo "1) Build Docker image"
    echo "2) Run container"
    echo "3) Stop container"
    echo "4) Show container logs"
    echo "5) Show Docker status"
    echo "6) Docker Compose up"
    echo "7) Docker Compose down"
    echo "8) Build and run"
    echo "9) Cleanup Docker resources"
    echo "0) Exit"
    echo ""
}

# Check Docker availability
check_docker

# Main loop
while true; do
    show_menu
    read -p "Select option (0-9): " choice
    echo ""
    
    case $choice in
        1)
            build_image
            ;;
        2)
            run_container
            ;;
        3)
            stop_container
            ;;
        4)
            show_logs
            ;;
        5)
            show_status
            ;;
        6)
            compose_up
            ;;
        7)
            compose_down
            ;;
        8)
            stop_container
            build_image
            run_container
            ;;
        9)
            cleanup
            ;;
        0)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    echo ""
done
