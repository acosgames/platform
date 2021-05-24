#!/bin/sh

echo "=========================================================="
echo ">>>> NPM INSTALL fsg-api"
cd fsg-api
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-client"
cd fsg-client
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-gameserver"
cd fsg-gameserver
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-shared"
cd fsg-shared
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-websocket"
cd fsg-websocket
npm install
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL templates/tictactoe"
cd templates/tictactoe
npm install
cd ../..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-platform"
npm install
echo "=========================================================="
