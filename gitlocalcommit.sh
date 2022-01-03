#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message
BRANCH=${1:-main}
MESSAGE=${2:-"new updates"}
if [ $# -lt 2 ]; then
        BRANCH=main
        MESSAGE=${1:-"new updates"}
fi

echo "============================="
echo ">>>> COMMIT LOCAL TO: "$BRANCH
echo ">>>> Message: "$MESSAGE
echo "============================="
echo ">>>> COMMIT LOCAL api"
cd api
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL client"
cd client
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL gameserver"
cd gameserver
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL matchmaker"
cd matchmaker
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL shared"
cd shared
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL websocket"
cd websocket
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL gitworker"
cd gitworker
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL docs"
cd docs
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT templates/tictactoe"
cd templates/tictactoe
git add .
git commit -m "$1"
cd ../..
# echo "=========================================================="
# echo ">>>> COMMIT templates/poptrivia"
# cd templates/poptrivia
# git add .
# git commit -m "$1"
# cd ../..
# echo "=========================================================="
# echo ">>>> COMMIT templates/rockpaperscissors"
# cd templates/rockpaperscissors
# git add .
# git commit -m "$1"
# cd ../..
echo "=========================================================="
echo ">>>> COMMIT templates/acosgames"
cd templates/acosgames
git add .
git commit -m "$1"
cd ../..
echo "=========================================================="
echo ">>>> COMMIT LOCAL acos-platform"
git add .
git commit -m "$1"
echo "=========================================================="