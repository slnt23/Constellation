#!/bin/bash

cd ./rabbitmq/rabbitmq-owl
docker compose down
cd ../..
# source init.sh


cd ./redis/redis-sentinel
docker compose down
cd ../..
# source init.sh


cd ./nacos/nacos-owl
docker compose down
cd ../..
# source init.sh


cd ./minio/minio-owl
docker compose down
cd ../..
# source init.sh

cd ./mysql/mysql-owl
docker compose down
cd ..

docker ps -a
