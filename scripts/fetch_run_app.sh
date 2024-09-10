#!/bin/bash
set -x

# Define the script file
SCRIPT_FILE="index.js"

# Function to check if a process is running
check_process() {
    if pgrep -f "$SCRIPT_FILE" > /dev/null; then
        echo "Process running: Stopping it now..."
        pgrep -f "$SCRIPT_FILE" | xargs kill -9
    else
        echo "No process found for $SCRIPT_FILE."
    fi
}

# Stop the running Node.js process
check_process

# Update the repository
echo "Pulling latest changes from Git repository..."
git pull

# Stop the Node.js app using npm
echo "Stopping Node.js application with npm stop..."
npm stop

# Install dependencies
echo "Installing npm dependencies..."
npm install

# Restart the Node.js application in the background
echo "Starting Node.js application in the background..."
nohup node "$SCRIPT_FILE" &

# Confirm restart
echo "Node.js application restarted with PID $(pgrep -f "$SCRIPT_FILE")"
