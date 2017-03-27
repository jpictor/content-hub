#!/bin/bash
docker stop content-hub
docker rm content-hub
docker run -d -p 127.0.0.1:2224:2224 --name=content-hub content-hub:latest
