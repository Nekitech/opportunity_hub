#!/bin/bash
apt update

apt install certbot python3-certbot-nginx

certbot --nginx
