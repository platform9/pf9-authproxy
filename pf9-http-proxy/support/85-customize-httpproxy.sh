#! /bin/sh
# Copyright (c) 2014 Platform9 Systems Inc.

# This script enables and starts the pf9-http-proxy service.

# Failfast
# Fail on first error
set -e
# Fail on uninitialized variables
set -u

echo "httpproxy customization script called"

HTTPPROXY_DIR="/opt/pf9/pf9httpproxy"

# Installing all the dependencies listed in package.json
cd $HTTPPROXY_DIR
npm install

service pf9-http-proxy start
