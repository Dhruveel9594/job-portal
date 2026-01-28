#!/bin/bash

echo "🛑 Stopping TalentHub Application..."
echo ""

docker-compose down

echo ""
echo "✅ Application stopped successfully!"
echo ""
echo "To remove all data (including volumes), run:"
echo "   docker-compose down -v"