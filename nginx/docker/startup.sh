#!/bin/bash
rm -rf /etc/nginx/conf.d/*

./replace_vars.sh /etc/nginx/templates/conf.d/default.conf /etc/nginx/conf.d/default.conf

if [ "$MODE" = "development" ]; then
  ./replace_vars.sh /etc/nginx/templates/conf.d/dev.conf /etc/nginx/conf.d/dev.conf
fi

nginx -s reload
