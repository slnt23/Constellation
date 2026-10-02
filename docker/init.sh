#!/bin/bash
	
# for owl project 

cd ./rabbitmq-owl
docker compose up -d
cd ..


cd ./redis-alone
docker compose up -d
cd ..


cd ./nacos-owl
docker compose up -d
cd ..


cd ./minio-owl
docker compose up -d
cd ..


cd ./mysql-owl
docker compose up -d
cd ..


docker ps -a



