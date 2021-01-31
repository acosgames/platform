# Optional branch for 1st argument
# Last argument is always the commit message
BRANCH=${1:-master}
MESSAGE=${2:-"new updates"}
if [ $# -lt 2 ]; then
        BRANCH=master
        MESSAGE=${1:-"new updates"}
fi

echo "============================="
echo ">>>> COMMIT TO: "$BRANCH
echo ">>>> Message: "$MESSAGE
echo "============================="
echo ">>>> COMMIT forkoff-api"
cd forkoff-api
git add .
git commit -m "$1"
git push origin master
cd ..
echo "=========================================================="
echo ">>>> COMMIT forkoff-client"
cd forkoff-client
git add .
git commit -m "$1"
git push origin master
cd ..
echo "=========================================================="
echo ">>>> COMMIT forkoff-gameserver"
cd forkoff-gameserver
git add .
git commit -m "$1"
git push origin master
cd ..
echo "=========================================================="
echo ">>>> COMMIT forkoff-shared"
cd forkoff-shared
git add .
git commit -m "$1"
git push origin master
cd ..
echo "=========================================================="
echo ">>>> COMMIT forkoff-websocket"
cd forkoff-websocket
git add .
git commit -m "$1"
git push origin master
cd ..
echo "=========================================================="
echo ">>>> COMMIT forkoff-platform"
git add .
git commit -m "$1"
git push origin master
echo "=========================================================="