#!/bin/bash

npm run build
http-server ./dist -p 8068
tail -f /dev/null
