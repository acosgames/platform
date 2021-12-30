#!/bin/sh
npm install -g yarn
npm install -g pm2

echo "=========================================================="
echo ">>>> NPM INSTALL shared"
cd shared
npm install
npm audit fix
npm link
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL api"
cd api
npm install
npm audit fix
npm link shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL client"
cd client
npm install
npm audit fix
npm link shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL gameserver"
cd gameserver
npm install
npm audit fix
npm link shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL matchmaker"
cd matchmaker
npm install
npm audit fix
npm link shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL websocket"
cd websocket
npm install
npm audit fix
npm link shared
npm run installws
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL gitworker"
cd gitworker
npm install
npm audit fix
npm link shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL templates/tictactoe"
cd templates/tictactoe
npm install
npm audit fix
cd ../..
echo "=========================================================="
echo ">>>> NPM INSTALL templates/poptrivia"
cd templates/poptrivia
npm install
npm audit fix
cd ../..
echo "=========================================================="
echo ">>>> NPM INSTALL templates/rockpaperscissors"
cd templates/rockpaperscissors
npm install
npm audit fix
cd ../..
echo "=========================================================="
echo ">>>> NPM INSTALL templates/acosgames"
cd templates/acosgames
npm install
npm audit fix
cd ../..
echo "=========================================================="
echo ">>>> NPM INSTALL platform"
npm install
npm audit fix
echo "=========================================================="
