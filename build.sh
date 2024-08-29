#!/bin/bash

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build

# Move frontend build to the correct directory
cp -r build/* ../public/

# Go back to the root directory
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
npm install --prefix api

# Additional backend build steps if needed
# (e.g., transpiling TypeScript, etc.)

echo "Build process completed."

