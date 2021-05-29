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
echo ">>>> COMMIT LOCAL fsg-api"
cd fsg-api
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL fsg-client"
cd fsg-client
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL fsg-gameserver"
cd fsg-gameserver
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL fsg-shared"
cd fsg-shared
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL fsg-websocket"
cd fsg-websocket
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL fsg-gitworker"
cd fsg-gitworker
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT templates/tictactoe"
cd templates/tictactoe
git add .
git commit -m "$1"
cd ../..
echo "=========================================================="
echo ">>>> COMMIT LOCAL fsg-platform"
git add .
git commit -m "$1"
echo "=========================================================="