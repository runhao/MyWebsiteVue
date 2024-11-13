#!/bin/bash

npm run build
http-server ./dist -p 8069
tail -f /dev/null
