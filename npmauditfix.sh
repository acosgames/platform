#!/bin/sh

echo "=========================================================="
echo ">>>> NPM AUDIT FIX shared"
cd shared
# npm install
npm audit fix
# npm link
cd ..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX api"
cd api
# npm install
npm audit fix
cd ..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX client"
cd client
# npm install --legacy-peer-deps
npm audit fix
cd ..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX gameserver"
cd gameserver
# npm install
npm audit fix
cd ..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX matchmaker"
# cd matchmaker
# npm install
npm audit fix
cd ..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX websocket"
# cd websocket
# npm install
npm audit fix
npm run installws
cd ..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX gitworker"
# cd gitworker
# npm install
npm audit fix
cd ..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX docs"
# cd docs
# npm install
npm audit fix
cd ..
# echo "=========================================================="
# echo ">>>> NPM AUDIT FIX templates/tictactoe"
# cd templates/tictactoe
# npm install
# npm audit fix
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM AUDIT FIX templates/poptrivia"
# cd templates/poptrivia
# npm install
# npm audit fix
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM AUDIT FIX templates/rockpaperscissors"
# cd templates/rockpaperscissors
# npm install
# npm audit fix
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM AUDIT FIX templates/acosgames"
# cd templates/acosgames
# npm install
# npm audit fix
# cd ../..
echo "=========================================================="
echo ">>>> NPM AUDIT FIX platform"
# npm install
npm audit fix
echo "=========================================================="
