#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> PULL api"
cd api
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL client"
cd client
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL gameserver"
cd gameserver
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL matchmaker"
cd matchmaker
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL shared"
cd shared
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL websocket"
cd websocket
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL gitworker"
cd gitworker
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL docs"
cd docs
git pull origin main
cd ..
echo "=========================================================="
echo ">>>> PULL templates/tictactoe"
cd templates/tictactoe
git pull origin main
cd ../..
# echo "=========================================================="
# echo ">>>> PULL templates/poptrivia"
# cd templates/poptrivia
# git pull origin main
# cd ../..
# echo "=========================================================="
# echo ">>>> PULL templates/rockpaperscissors"
# cd templates/rockpaperscissors
# git pull origin main
# cd ../..
echo "=========================================================="
echo ">>>> PULL templates/acosgames"
cd templates/acosgames
git pull origin main
cd ../..
echo "=========================================================="
echo ">>>> PULL platform"
git pull origin main
git submodule update --remote
echo "=========================================================="
