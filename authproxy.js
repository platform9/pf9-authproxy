/**
 * Copyright (c) 2014 Platform Systems, Inc.
 */

'use strict';

var http  = require('http');
var request = require('request');
var log4js = require('log4js');
var optionsParser = require('nomnom');
var Buffer = require('buffer');
var net = require('net');
var cookieParser = require('cookie');
var numClients = 0;

/**
 * Returns a 'nomnom' options parser with a parse() method.
 * @returns {nomnom.ArgParser} Command line argument parser
 */
exports.getOptionsParser = function getOptionsParser() {
    return optionsParser.options({
        proxy_port: {abbr: 'p', full: 'proxy-port', help: 'Listening port', default: 8888},
        proxy_interface: {abbr: 'i', full: 'proxy-interface', help: 'Listening host interface', default: '127.0.0.1'},
        server: {abbr: 's', full: 'server', help: 'Server to proxy to', default: 'localhost'},
        server_port: {abbr: 'P', full: 'server-port', help: 'Server port', default: 15674},
        ks_url: {abbr: 'k', full: 'ks-url', help: 'Keystone url', default: 'http://127.0.0.1:5000'},
        ks_admintoken: {abbr: 't', full: 'ks-admintoken', help: 'Keystone admin token', required: true},
        reauth_interval: {abbr: 'r', full: 'reauthenticate-interval', help: 'Re-authenticate interval in seconds', default: 10},
        log_level: {abbr: 'l', full: 'log-level', help: "Log level", default: 'DEBUG'},
        log_file: {abbr: 'L', help: 'Log file', full: 'log-file' },
        test_logging: {full: 'test-logging', help: 'Periodically log dummy messages', flag:true, default: false}
    });
}

/**
 * Starts an authentication proxy with the specified options
 * @param Object options: the options parsed() by the parser returned by getOptionsParser()
 */
exports.start = function start(options) {
    if (options.log_file) {
        // TODO: configure maxLogSize and backups from a JSON file
        log4js.configure({appenders: [
            {type: 'file', filename: options.log_file, maxLogSize: 2097152,
             backups: 4, category: 'authproxy'}
        ]});
    }

    var log = log4js.getLogger('authproxy');
    log.setLevel(options.log_level);
    var initialMsg = 'pf9 authproxy '.blue + 'started '.green.bold +
        'on port '.blue + (''+options.proxy_port).yellow + ' at ' + new Date();
    console.log(initialMsg);
    log.info(initialMsg);

    var server = http.createServer();
    server.on('upgrade', handleUpgrade);
    server.listen(options.proxy_port, options.proxy_interface);

    /**
     * Handles UPGRADE from plain HTTP to websocket protocol.
     * @param {http.IncomingMessage} req - the incoming HTTP request
     * @param {net.Socket} socket - the client's socket
     * @param {Buffer} head - any body bytes sent after the request (usually empty)
     */
    function handleUpgrade(req, socket, head) {
        var hdrsStr, reqStr, srv;

        log.info('--- Incoming request:', req.url);
        log.trace('Head bytes:', head.length);
        hdrsStr = JSON.stringify(req.headers, null, 4);
        log.trace('Headers:', hdrsStr);
        numClients++;
        log.debug('Number of clients:', numClients);
        socket.on('close', onClientClose);

        var cookieStr = req.headers.cookie;
        if (!cookieStr) {
            log.error('Missing cookie header');
            return failRequest('401 Unauthorized');
        }

        var cookies = cookieParser.parse(cookieStr);
        var token = cookies['authToken'];
        if (!token) {
            log.error('Missing cookie');
            return failRequest('401 Unauthorized');
        }

        var ksUrl = options.ks_url + '/v2.0/tokens/' + token;
        log.trace('Sending request to', ksUrl);
        var ksOptions = {
            url: ksUrl,
            headers: {'X-Auth-Token': options.ks_admintoken}
        };
        request(ksOptions, onKeystoneRequest);

        // Used to cancel the client-side connection when an error occurs
        function failRequest(statusString) {
            socket.write( "HTTP/1.1 " + statusString + "\r\n\r\n");
            socket.end();
        }

        // Called when the client socket is closed
        function onClientClose(had_error) {
            log.debug('Client socket closed' + (had_error? ' with error':''));
            numClients--;
            log.debug('Number of clients:', numClients);
        }

        // Called when keystone request completes
        function onKeystoneRequest(err, response, body) {
            if (err) {
                log.error('Keystone server is unavailable.')
                return failRequest('503 Service Unavailable');
            }

            var ksStatus = response.statusCode;
            if (ksStatus != 200) {
                log.error('Keystone server failed request with', ksStatus);
                return failRequest(ksStatus + ' Unauthorized');
            }

            log.debug('Authentication successful.')
            // Authentication successful. Prepare to connect to destination server.
            var reqStr = req.method + ' ' + req.url + ' HTTP/' + req.httpVersion + '\r\n';
            Object.keys(req.headers).forEach(function (key) {
                reqStr += (key + ': ' + req.headers[key] + '\r\n');
            });
            reqStr += '\r\n';

            log.trace('Outgoing reqStr:', reqStr);
            var srv = net.connect(options.server_port, options.server, onServerConnect);
            srv.on('close', onServerClose);
            srv.on('error', onServerError);
            var timerId = undefined;

            // Called when connection to destination server cannot be established
            function onServerError() {
                log.debug('Server socket experienced an error');
                socket.end();
                cancelTimer();
            }

            // Called when destination server closes its socket
            function onServerClose(had_error) {
                log.debug('Server socket closed' + (had_error? ' with error':''));
                // No need to call socket.end() because pipe() does that for us
                cancelTimer();
            }

            // Called when connection to destination server is established
            function onServerConnect() {
                log.debug('Connected to destination server.');
                srv.write(reqStr, 'utf8');
                // Connect the sockets in both directions
                srv.pipe(socket).pipe(srv);
                // Start a timer to periodically re-authenticate
                timerId = setInterval(reAuthenticate,
                        1000 * options.reauth_interval);
            }

            // Cancels the re-authenticate timer
            function cancelTimer() {
                if (typeof timerId !== 'undefined') {
                    clearInterval(timerId);
                    timerId = undefined;
                }
            }

            // Periodically tries to re-authenticate in case the token expired
            function reAuthenticate() {
                request(ksOptions, onKeystoneReauthenticate);
            }

            // Called when keystone reauthenticate request completes
            function onKeystoneReauthenticate(err, response, body) {
                var failed = false;
                if (err) {
                    log.error('Reauthenticate: server is unavailable.');
                    failed = true;
                } else if (response.statusCode != 200) {
                    log.error('Reauthenticate: request failed with',
                        response.statusCode);
                    failed = true;
                } else {
                    log.debug('Reauthenticate: OK');
                }
                if (failed) {
                    srv.end();
                    socket.end();
                }
            }
        }
    }

    if (options.test_logging) {
        setInterval(function () {
            log.info('Dummy log message 1');
        }, 500);
        setInterval(function () {
            log.info('Dummy log message 2');
        }, 1000);
    }
}

