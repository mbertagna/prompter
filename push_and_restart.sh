#!/bin/bash

# This script pushes local changes to git, and then stops, removes, and restarts the Docker container.
# It uses a provided commit message or a default one if none is given.

echo "🚀 Starting deployment script..."

# 1. Define the commit message
# Use the first argument ($1) if it's provided, otherwise use the default message.
COMMIT_MSG="${1:-prompts edited}"

# 2. Stop and remove the existing container if it exists
echo "--- Stopping and removing existing 'my-prompt-manager' container... ---"
docker rm -f my-prompt-manager || echo "Container not found, continuing."

# 3. Add, commit, and push changes to git
echo "--- Pushing changes to git with message: '$COMMIT_MSG' ---"
git add .
git commit -m "$COMMIT_MSG"
git push origin main

# 4. Rebuild the Docker image
echo "--- Rebuilding the 'prompt-manager' Docker image... ---"
docker build -t prompt-manager .

# 5. Start the new container
echo "--- Starting new container... ---"
docker run -d -p 8070:8070 --name my-prompt-manager -v "$(pwd)/llm_prompt_manager/app/data:/code/app/data" prompt-manager

echo "✅ Deployment complete! Changes are pushed and the container is running."