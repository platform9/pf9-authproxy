#
# Copyright (c) 2014 Platform9 Systems Inc.
#

node configModifier.js -k http://127.0.0.1:5003 -n http://127.0.0.1:8777 -r http://127.0.0.1:8086 -T file
service pf9-http-proxy start
node testPf9HttpProxy.js -s 0 -e 7
service pf9-http-proxy stop
node configModifier.js -k http://127.0.0.1:5003 -n http://127.0.0.1:8777 -r http://127.0.0.1:8086 -T mixpanel -s 11 -t ' '
service pf9-http-proxy start
node testPf9HttpProxy.js -s 8 -e 11
service pf9-http-proxy stop
node configModifier.js -k http://127.0.0.1:9096 -n http://127.0.0.1:8777 -r http://127.0.0.1:8086 -T file -s 12
service pf9-http-proxy start
node testPf9HttpProxy.js -s 12 -e 12
service pf9-http-proxy stop
