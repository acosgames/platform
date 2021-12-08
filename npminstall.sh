#!/bin/sh
npm install -g yarn
npm install -g pm2

echo "=========================================================="
echo ">>>> NPM INSTALL fsg-shared"
cd fsg-shared
npm install
npm audit fix
npm link
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-api"
cd fsg-api
npm install
npm audit fix
npm link fsg-shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-client"
cd fsg-client
npm install
npm audit fix
npm link fsg-shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-gameserver"
cd fsg-gameserver
npm install
npm audit fix
npm link fsg-shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-matchmaker"
cd fsg-matchmaker
npm install
npm audit fix
npm link fsg-shared
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-websocket"
cd fsg-websocket
npm install
npm audit fix
npm link fsg-shared
npm run installws
cd ..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-gitworker"
cd fsg-gitworker
npm install
npm audit fix
npm link fsg-shared
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
echo ">>>> NPM INSTALL templates/fivesecondgames"
cd templates/fivesecondgames
npm install
npm audit fix
cd ../..
echo "=========================================================="
echo ">>>> NPM INSTALL fsg-platform"
npm install
npm audit fix
echo "=========================================================="
