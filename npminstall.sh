#!/bin/sh
echo "=========================================================="
echo ">>>> NPM INSTALL pm2 (global)"
npm install -g pm2

echo "=========================================================="
echo ">>>> NPM INSTALL shared"
cd shared
npm install
npm link
echo "=========================================================="
echo ">>>> NPM INSTALL api"
cd ../api
npm install
npm link shared
echo "=========================================================="
echo ">>>> NPM INSTALL client"
cd ../client
npm install --legacy-peer-deps
npm link shared
echo "=========================================================="
echo ">>>> NPM INSTALL gameserver"
cd ../gameserver
npm install
npm link shared
echo "=========================================================="
echo ">>>> NPM INSTALL matchmaker"
cd ../matchmaker
npm install
npm link shared
echo "=========================================================="
echo ">>>> NPM INSTALL websocket"
cd ../websocket
npm install
npm link shared
npm run installws
echo "=========================================================="
echo ">>>> NPM INSTALL gitworker"
cd ../gitworker
npm install
npm link shared
echo "=========================================================="
echo ">>>> NPM INSTALL docs"
cd ../docs
npm install
npm link shared
# echo "=========================================================="
# echo ">>>> NPM INSTALL templates/tictactoe"
# cd templates/tictactoe
# npm install
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM INSTALL templates/poptrivia"
# cd templates/poptrivia
# npm install
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM INSTALL templates/rockpaperscissors"
# cd templates/rockpaperscissors
# npm install
# cd ../..
# echo "=========================================================="
# echo ">>>> NPM INSTALL templates/acosgames"
# cd templates/acosgames
# npm install
# cd ../..
echo "=========================================================="
echo ">>>> NPM INSTALL platform"
cd ..
npm install
echo "=========================================================="


# One last time
echo "=========================================================="
echo ">>>> NPM INSTALL shared"
cd shared
npm install