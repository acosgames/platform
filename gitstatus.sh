#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> STATUS forkoff-api"
cd forkoff-api
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS forkoff-client"
cd forkoff-client
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS forkoff-gameserver"
cd forkoff-gameserver
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS forkoff-shared"
cd forkoff-shared
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS forkoff-websocket"
cd forkoff-websocket
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS forkoff-platform"
git status
echo "=========================================================="

echo ">>>> STATUS templates/tictactoe-client"
cd templates/tictactoe-client
git status
cd ../..
echo "=========================================================="

echo ">>>> STATUS templates/tictactoe-server"
cd templates/tictactoe-server
git status
cd ../..
echo "=========================================================="