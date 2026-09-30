#!/bin/bash

cd ./rabbitmq/rabbitmq-owl
docker compose down
cd ../..


cd ./redis/redis-alone
docker compose down
cd ../..


cd ./nacos/nacos-owl
docker compose down
cd ../..


cd ./minio/minio-owl
docker compose down
cd ../..


cd ./mysql/mysql-owl
docker compose down
cd ../..

docker ps -a
