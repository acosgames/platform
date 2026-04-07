#!/bin/sh

echo "=========================================================="
echo ">>>> NPM AUDIT FIX shared"
cd shared
npm audit fix
echo "=========================================================="
echo ">>>> NPM AUDIT FIX api"
cd ../api
npm audit fix
echo "=========================================================="
echo ">>>> NPM AUDIT FIX client2"
cd ../client2
npm audit fix
echo "=========================================================="
echo ">>>> NPM AUDIT FIX gameserver"
cd ../gameserver
npm audit fix
echo "=========================================================="
echo ">>>> NPM AUDIT FIX matchmaker"
cd ../matchmaker
npm audit fix
echo "=========================================================="
echo ">>>> NPM AUDIT FIX websocket"
cd ../websocket
npm audit fix
npm run installws
echo "=========================================================="
echo ">>>> NPM AUDIT FIX gitworker"
cd ../gitworker
npm audit fix
echo "=========================================================="
echo ">>>> NPM AUDIT FIX docs"
cd ../docs
npm audit fix
echo "=========================================================="
echo ">>>> NPM AUDIT FIX platform"
cd ..
npm audit fix
echo "=========================================================="
