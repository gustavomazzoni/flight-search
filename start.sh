#!/bin/bash

## SCRIPT 

# Client Side Install
echo "Performing client-side required package installation"
sudo npm -g install grunt-cli bower
cd client/
# Install client-side project dependencies
npm install

# Build client-side project
grunt
cd ../

# Server Side Install
echo "Performing server-side required package installation"
cd server/
# Install Redis for caching
brew update && brew install redis

# Install server-side project dependencies
npm install

# Run
# Start Redis server
redis-server &

# Start project (launch server on port 3000)
npm start

echo "Installation complete. Server running on port 3000"