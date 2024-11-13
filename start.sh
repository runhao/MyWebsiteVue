#!/bin/bash

nginx -c /etc/nginx/nginx.conf
npm run build
http-server ./dist -p 8069
tail -f /dev/null
