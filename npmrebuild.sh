#!/bin/sh

echo "=========================================================="
echo ">>>> NPM REBUILD shared"
cd shared
# npm install
npm rebuild
# npm link
cd ..
echo "=========================================================="
echo ">>>> NPM REBUILD api"
cd api
# npm install
npm rebuild
cd ..
echo "=========================================================="
echo ">>>> NPM REBUILD client"
cd client
# npm install --legacy-peer-deps
npm rebuild
cd ..
echo "=========================================================="
echo ">>>> NPM REBUILD gameserver"
cd gameserver
# npm install
npm rebuild
cd ..
echo "=========================================================="
echo ">>>> NPM REBUILD matchmaker"
cd matchmaker
# npm install
npm rebuild
cd ..
echo "=========================================================="
echo ">>>> NPM REBUILD websocket"
cd websocket
# npm install
npm rebuild
npm run installws
cd ..
echo "=========================================================="
echo ">>>> NPM REBUILD gitworker"
cd gitworker
# npm install
npm rebuild
cd ..
echo "=========================================================="
echo ">>>> NPM REBUILD docs"
cd docs
# npm install
npm rebuild
cd ..
# echo "=========================================================="
# echo ">>>> NPM REBUILD templates/tictactoe"
# cd templates/tictactoe
# npm install
# npm rebuild
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM REBUILD templates/poptrivia"
# cd templates/poptrivia
# npm install
# npm rebuild
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM REBUILD templates/rockpaperscissors"
# cd templates/rockpaperscissors
# npm install
# npm rebuild
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM REBUILD templates/acosgames"
# cd templates/acosgames
# npm install
# npm rebuild
# cd ../..
echo "=========================================================="
echo ">>>> NPM REBUILD platform"
# npm install
npm rebuild
echo "=========================================================="
