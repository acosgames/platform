#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> PULL forkoff-api"
cd forkoff-api
git pull origin master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-client"
cd forkoff-client
git pull origin master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-gameserver"
cd forkoff-gameserver
git pull origin master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-shared"
cd forkoff-shared
git pull origin master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-websocket"
cd forkoff-websocket
git pull origin master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-platform"
git pull origin master
git submodule update --remote
echo "=========================================================="