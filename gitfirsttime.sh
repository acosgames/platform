# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> PULL forkoff-api"
cd forkoff-api
git fetch
git checkout origin/master
git branch master -f
git checkout master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-client"
cd forkoff-client
git fetch
git checkout origin/master
git branch master -f
git checkout master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-gameserver"
cd forkoff-gameserver
git fetch
git checkout origin/master
git branch master -f
git checkout master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-shared"
cd forkoff-shared
git fetch
git checkout origin/master
git branch master -f
git checkout master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-websocket"
cd forkoff-websocket
git fetch
git checkout origin/master
git branch master -f
git checkout master
cd ..
echo "=========================================================="
echo ">>>> PULL forkoff-platform"
git pull origin master
git submodule update --remote
echo "=========================================================="