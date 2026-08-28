#!/bin/bash
	
# for owl project 

cd ./rabbitmq/rabbitmq-owl
docker compose up -d
cd ../..
# source init.sh


cd ./redis/redis-sentinel
docker compose up -d
cd ../..
# source init.sh


cd ./nacos/nacos-owl
docker compose up -d
cd ../..
# source init.sh


cd ./minio/minio-owl
docker compose up -d
cd ../..
# source init.sh

cd ./mysql/mysql-owl
docker compose up -d
cd ..


docker ps -a



