#!/bin/bash
#updates the server
cd /home/ubuntu/yunified
git pull
npx webpack --config ./webpack-server.config.cjs