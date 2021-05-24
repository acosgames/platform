#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> STATUS fsg-api"
cd fsg-api
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS fsg-client"
cd fsg-client
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS fsg-gameserver"
cd fsg-gameserver
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS fsg-shared"
cd fsg-shared
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS fsg-websocket"
cd fsg-websocket
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS templates/tictactoe"
cd templates/tictactoe
git status
cd ../..
echo "=========================================================="
echo ">>>> STATUS fsg-platform"
git status
echo "=========================================================="