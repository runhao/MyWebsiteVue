#!/bin/bash

nginx -c /usr/local/nginx/conf/nginx.conf
npm run build
http-server ./dist -p 8070
tail -f /dev/null
