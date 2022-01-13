#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> RESET HARD api"
cd api
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD client"
cd client
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD gameserver"
cd gameserver
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD matchmaker"
cd matchmaker
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD shared"
cd shared
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD websocket"
cd websocket
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD gitworker"
cd gitworker
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD docs"
cd docs
git fetch origin
git reset --hard origin/main
cd ..
echo "=========================================================="
echo ">>>> RESET HARD platform"
git fetch origin
git reset --hard origin/main
echo "=========================================================="



