#!/bin/sh

SERVER=root@sci-events.ru

docker compose build admin frontend

docker save iisdc-admin iisdc-frontend > admin_and_frontend.tar

scp admin_and_frontend.tar $SERVER:/opt/IISDC/admin_and_frontend.tar

ssh $SERVER "cd /opt/IISDC; docker load -i admin_and_frontend.tar"

ssh $SERVER "cd /opt/IISDC; docker compose up -d"