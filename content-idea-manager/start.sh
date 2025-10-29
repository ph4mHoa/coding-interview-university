#!/bin/bash

echo "==================================="
echo "Content Idea Manager - Setup Script"
echo "==================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Step 1: Start PostgreSQL
echo -e "\n${YELLOW}Step 1: Starting PostgreSQL...${NC}"
docker compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Step 2: Setup Backend
echo -e "\n${YELLOW}Step 2: Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed."
fi

echo "Initializing database..."
npm run init-db

echo -e "${GREEN}Backend setup complete!${NC}"

# Step 3: Setup Frontend
echo -e "\n${YELLOW}Step 3: Setting up Frontend...${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed."
fi

echo -e "${GREEN}Frontend setup complete!${NC}"

# Instructions
echo -e "\n${GREEN}==================================="
echo "Setup Complete!"
echo "===================================${NC}"
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend (in terminal 1):"
echo "   cd content-idea-manager/backend"
echo "   npm run dev"
echo ""
echo "2. Start Frontend (in terminal 2):"
echo "   cd content-idea-manager/frontend"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:3000"
echo ""
echo -e "${YELLOW}Note: Make sure both backend and frontend are running!${NC}"
