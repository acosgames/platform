# Optional branch for 1st argument
# Last argument is always the commit message
BRANCH=${1:-master}
MESSAGE=${2:-"new updates"}
if [ $# -lt 2 ]; then
        BRANCH=master
        MESSAGE=${1:-"new updates"}
fi

echo "============================="
echo ">>>> STARTING COMMIT TO "$BRANCH
echo ">>>> Message: "$MESSAGE
echo "============================="
echo ">>>> Committing forkoff-api"
cd forkoff-api
git add .
git commit -m $1
git push origin master
cd ..

echo ">>>> Committing forkoff-client"
cd forkoff-client
git add .
git commit -m $1
git push origin master
cd ..

echo ">>>> Committing forkoff-gameserver"
cd forkoff-gameserver
git add .
git commit -m $1
git push origin master
cd ..

echo ">>>> Committing forkoff-shared"
cd forkoff-shared
git add .
git commit -m $1
git push origin master
cd ..

echo ">>>> Committing forkoff-websocket"
cd forkoff-websocket
git add .
git commit -m $1
git push origin master
cd ..

echo ">>>> Committing forkoff-platform"
git add .
git commit -m $1
git push origin master
