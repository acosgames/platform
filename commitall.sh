echo ">>>> Committing forkoff-api"
cd forkoff-api
git add .
git commit -m "$1"
git push
cd ..

echo ">>>> Committing forkoff-client"
cd forkoff-client
git add .
git commit -m "$1"
git push
cd ..

echo ">>>> Committing forkoff-gameserver"
cd forkoff-gameserver
git add .
git commit -m "$1"
git push
cd ..

echo ">>>> Committing forkoff-shared"
cd forkoff-shared
git add .
git commit -m "$1"
git push
cd ..

echo ">>>> Committing forkoff-websocket"
cd forkoff-websocket
git add .
git commit -m "$1"
git push
cd ..

echo ">>>> Committing forkoff-platform"
git add .
git commit -m "$1"
git push
