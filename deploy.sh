#! /bin/bash

set -e

echo "Starting deployment..."

# 1. Install root dependencies
echo "Running npm install in root ..."
npm install

# 2. NestJS Build & Deploy
echo "Building NestJS backend..."

echo "Navigating to pet-market-backend..."
cd apps/pet-market-backend

# 2.1 Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# 2.2 Build NestJS backend
echo "Building NestJS backend..."
npx nx build pet-market-backend

# 2.3 Copy environment & Config files
echo "Copying .env and ecosystem.config.js files to dist/..."
cp .env ./dist/
cp ecosystem.config.js ./dist/

# 2.4 Start PM2 process
echo "Navigating to dist directory..."
cd dist

echo "Stopping and Deleting existing Backend PM2 process..."
# Continue even if Stopping/Deletion fails
pm2 stop backend || true
pm2 delete backend || true


# 2.5 Start New PM2 Process within /dist directory
echo "Starting PM2 process..."
pm2 start ./ecosystem.config.js 

echo "Verifying backend process is running..."
# Check if process is running OR show error message
pm2 describe backend

# 3. Angular Build & Deploy
echo "Navigating to project root ..."
cd ../../../

# 3.1 Build Angular frontend
echo "Building Angular frontend..."
npx nx build pet-market-web

# 3.2 Copy environment & Config files
echo "Copying ecosystem.config.js files to dist/..."
mkdir -p dist/apps/pet-market-web/server
cp apps/pet-market-web/ecosystem.config.js dist/apps/pet-market-web/server/

# 3.3 Navigate to frontend dist directory
echo "Navigating to frontend dist directory..."
cd dist/apps/pet-market-web/server

# 3.4 Stop and delete existing PM2 process
echo "Stopping and deleting existing Frontend PM2 process..."
pm2 stop frontend || true
pm2 delete frontend || true

# 3.5 Start FrontendPM2 process
echo "Starting frontend PM2 process..."
pm2 start ./ecosystem.config.js

echo "Verifying frontend process is running..."
pm2 describe frontend


echo "Going back to project root..."
cd ../../../../

echo "Deployment scriptcompleted successfully!"

exit 0