#!/bin/bash

docker run -d -p 5672:5672 --name rabbitmq -e RABBITMQ_DEFAULT_USER=fsg -e RABBITMQ_DEFAULT_PASS=haha123hehe rabbitmq:3

docker run -d -p 6379:6379 --name redis redis

mysqld