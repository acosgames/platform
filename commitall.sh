cd forkoff-api
git add .
git commit -m "$1"
git push
cd ..

cd forkoff-client
git add .
git commit -m "$1"
git push
cd ..

cd forkoff-gameserver
git add .
git commit -m "$1"
git push
cd ..

cd forkoff-shared
git add .
git commit -m "$1"
git push
cd ..

cd forkoff-websocket
git add .
git commit -m "$1"
git push
cd ..

git add .
git commit -m "$1"
git push
