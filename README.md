pf9-authproxy
=============

A proxy server that authenticates websockets traffic against a Keystone server.

## Overview ##

This proxy accept an incoming websocket connection from a client, then
authenticates it against a specified Keystone server.
The request's keystone token must be stored in the 'authToken' cookie.
If Keystone successfully validates the token, the connection is proxied
to the specified destination server.
The proxy also periodically re-authenticates the token to ensure it
hasn't expired. If it has, then it closes the proxied connection.


## Usage ##

    Usage: /usr/bin/node authproxy.js [options]

    Options:
       -p, --proxy-port                Listening port  [8888]
       -s, --server                    Server to proxy to  [localhost]
       -P, --server-port               Server port  [15674]
       -k, --ks-url                    Keystone url  [http://127.0.0.1:5000]
       -t, --ks-admintoken             Keystone admin token
       -r, --reauthenticate-interval   Re-authenticate interval in seconds  [10]
       -l, --log-level                 Log level  [DEBUG]
       -L, --log-file                  Log file
