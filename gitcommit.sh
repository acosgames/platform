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
echo ">>>> COMMIT fsg-api"
cd fsg-api
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT fsg-client"
cd fsg-client
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT fsg-gameserver"
cd fsg-gameserver
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT fsg-shared"
cd fsg-shared
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT fsg-websocket"
cd fsg-websocket
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT fsg-gitworker"
cd fsg-gitworker
git add .
git commit -m "$1"
git push origin $BRANCH
cd ..
echo "=========================================================="
echo ">>>> COMMIT templates/tictactoe"
cd templates/tictactoe
git add .
git commit -m "$1"
git push origin $BRANCH
cd ../..
echo "=========================================================="
echo ">>>> COMMIT templates/poptrivia"
cd templates/poptrivia
git add .
git commit -m "$1"
git push origin $BRANCH
cd ../..
echo "=========================================================="
echo ">>>> COMMIT fsg-platform"
git add .
git commit -m "$1"
git push origin $BRANCH
echo "=========================================================="
