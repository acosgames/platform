#!/bin/bash

# docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq -e RABBITMQ_DEFAULT_USER=acosg -e RABBITMQ_DEFAULT_PASS=haha123hehe rabbitmq

# docker run -d -p 6379:6379 --name redis redis --requirepass "haha123hehe"

# docker exec -it redis redis-cli FLUSHALL

# redis-cli --pass haha123hehe FLUSHALL

# mysqld


cd api && npm start &

cd gameserver && npm start &

cd client2 && npm start &  

cd websocket && npm start &

cd matchmaker && npm start &

cd gitworker && npm start &

cd client2 && npm start &

wait

echo "ACOS Platform terminated."