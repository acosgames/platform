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
echo ">>>> COMMIT TO: "$BRANCH
echo ">>>> Message: "$MESSAGE
echo "============================="
echo ">>>> COMMIT api"
cd api
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT client"
cd client
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT gameserver"
cd gameserver
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT matchmaker"
cd matchmaker
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT shared"
cd shared
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT websocket"
cd websocket
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT gitworker"
cd gitworker
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
# echo "=========================================================="
# echo ">>>> COMMIT templates/tictactoe"
# cd templates/tictactoe
# git add .
# git commit -m "$1"
# git push origin $BRANCH
# cd ../..
echo "=========================================================="
echo ">>>> COMMIT docs"
cd docs
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT platform"
git add .
git commit -m "$1"
git push origin $BRANCH
echo "=========================================================="
