#!/bin/bash
	
# for owl project 

cd ./rabbitmq/rabbitmq-owl
docker compose up -d
cd ../..


cd ./redis/redis-alone
docker compose up -d
cd ../..


cd ./nacos/nacos-owl
docker compose up -d
cd ../..


cd ./minio/minio-owl
docker compose up -d
cd ../..


cd ./mysql/mysql-owl
docker compose up -d
cd ../..


docker ps -a



