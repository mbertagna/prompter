#!/bin/bash

# This script stops and removes the Docker container, pulls the latest from main, and restarts.

echo "🚀 Starting deployment script..."

# 1. Stop and remove the existing container if it exists
echo "--- Stopping and removing existing 'my-prompt-manager' container... ---"
docker rm -f my-prompt-manager || echo "Container not found, continuing."

# 2. Pull the latest changes from the main branch
echo "--- Pulling latest changes from git repository (main branch)... ---"
git pull origin main

# 3. Rebuild the Docker image
echo "--- Rebuilding the 'prompt-manager' Docker image... ---"
docker build -t prompt-manager .

# 4. Start the new container
echo "--- Starting new container... ---"
docker run -d -p 8070:8070 --name my-prompt-manager -v "$(pwd)/llm_prompt_manager/app/data:/code/app/data" prompt-manager

echo "✅ Deployment complete! Container is running with the latest code."