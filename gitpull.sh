#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> PULL fsg-api"
cd fsg-api
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL fsg-client"
cd fsg-client
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL fsg-gameserver"
cd fsg-gameserver
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL fsg-shared"
cd fsg-shared
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL fsg-websocket"
cd fsg-websocket
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL templates/tictactoe"
cd templates/tictactoe
git pull origin main
cd ../..
echo "=========================================================="
echo ">>>> PULL fsg-platform"
git pull origin main
git submodule update --remote
echo "=========================================================="
