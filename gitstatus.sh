#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> STATUS api"
cd api
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS client"
cd client
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS gameserver"
cd gameserver
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS matchmaker"
cd matchmaker
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS shared"
cd shared
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS websocket"
cd websocket
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS gitworker"
cd gitworker
git status
cd ..
echo "=========================================================="
echo ">>>> STATUS docs"
cd docs
git status
cd ..
# echo "=========================================================="
# echo ">>>> STATUS templates/tictactoe"
# cd templates/tictactoe
# git status
# cd ../..
# echo "=========================================================="
# echo ">>>> STATUS templates/poptrivia"
# cd templates/poptrivia
# git status
# cd ../..
# echo "=========================================================="
# echo ">>>> STATUS templates/rockpaperscissors"
# cd templates/rockpaperscissors
# git status
# cd ../..
# echo "=========================================================="
# echo ">>>> STATUS templates/acosgames"
# cd templates/acosgames
# git status
# cd ../..
echo "=========================================================="
echo ">>>> STATUS platform"
git status
echo "=========================================================="