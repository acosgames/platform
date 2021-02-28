#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> NPM INSTALL forkoff-api"
cd forkoff-api
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL forkoff-client"
cd forkoff-client
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL forkoff-gameserver"
cd forkoff-gameserver
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL forkoff-shared"
cd forkoff-shared
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL forkoff-websocket"
cd forkoff-websocket
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL forkoff-platform"
npm install
echo "=========================================================="