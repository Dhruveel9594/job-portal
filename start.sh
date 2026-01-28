#!/bin/bash

echo "🚀 TalentHub - Job Portal Deployment Script"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Stop any running containers
echo "🛑 Stopping any existing containers..."
docker-compose down 2>/dev/null

# Build and start containers
echo ""
echo "🏗️  Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if containers are running
if [ "$(docker-compose ps -q | wc -l)" -eq 2 ]; then
    echo ""
    echo "✅ ✅ ✅ SUCCESS! Application is running! ✅ ✅ ✅"
    echo ""
    echo "📍 Access points:"
    echo "   Frontend:  http://localhost"
    echo "   Backend:   http://localhost:4000"
    echo "   API Test:  http://localhost:4000/api/test"
    echo ""
    echo "🔐 Demo Credentials:"
    echo "   Candidate: alice@example.com / password123"
    echo "   Recruiter: recruiter@techcorp.com / password123"
    echo ""
    echo "📊 Useful commands:"
    echo "   View logs:        docker-compose logs -f"
    echo "   Stop app:         docker-compose down"
    echo "   Restart:          docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Something went wrong. Check logs with: docker-compose logs"
fi