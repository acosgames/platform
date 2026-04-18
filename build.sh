#!/bin/bash

cd shared
npm run build

cd ../api
npm run build

cd ../gameserver
npm run build

cd ../gitworker
npm run build

cd ../matchmaker
npm run build

cd ../websocket
npm run build