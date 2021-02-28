#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message
BRANCH=${1:-master}
MESSAGE=${2:-"new updates"}
if [ $# -lt 2 ]; then
        BRANCH=master
        MESSAGE=${1:-"new updates"}
fi

echo "============================="
echo ">>>> COMMIT LOCAL TO: "$BRANCH
echo ">>>> Message: "$MESSAGE
echo "============================="
echo ">>>> COMMIT LOCAL forkoff-api"
cd forkoff-api
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL forkoff-client"
cd forkoff-client
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL forkoff-gameserver"
cd forkoff-gameserver
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL forkoff-shared"
cd forkoff-shared
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL forkoff-websocket"
cd forkoff-websocket
git add .
git commit -m "$1"
cd ..
echo "=========================================================="
echo ">>>> COMMIT LOCAL forkoff-platform"
git add .
git commit -m "$1"
echo "=========================================================="