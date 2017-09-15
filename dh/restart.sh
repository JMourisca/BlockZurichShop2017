#!/usr/bin/env bash

docker-compose stop

if [ ! -z $1 ]
then
    docker-compose build
fi


docker-compose up