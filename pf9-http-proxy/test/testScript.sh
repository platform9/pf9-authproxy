#
# Copyright (c) 2014 Platform9 Systems Inc.
#

node configModifier.js -k http://127.0.0.1:5003 -n http://127.0.0.1:8777 -r http://127.0.0.1:8086 -T file
service pf9-http-proxy start
node testPf9HttpProxy.js -s 0 -e 9
service pf9-http-proxy stop
node configModifier.js -k http://127.0.0.1:5003 -n http://127.0.0.1:8777 -r http://127.0.0.1:8086 -T mixpanel -s 13 -t ' '
service pf9-http-proxy start
node testPf9HttpProxy.js -s 10 -e 13
service pf9-http-proxy stop
node configModifier.js -k http://127.0.0.1:5004 -n http://127.0.0.1:8777 -r http://127.0.0.1:8086 -T file -s 14
service pf9-http-proxy start
node testPf9HttpProxy.js -s 14 -e 14
service pf9-http-proxy stop
