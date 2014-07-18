#!/usr/bin/node

/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

'use strict';

var testData = require('./test_data.js');
var authproxy = require('../authproxy.js');
var optParser = authproxy.getOptionsParser();
var url = require('url');
var http = require('http');
var util = require('util');
var assert = require('assert');
var net = require('net');

// Parse command line.
// Note: Command line must contain '-t token' option specifying the admin token.
//       The token value can be any random string.
var options = optParser.parse();
var adminToken = options.ks_admintoken;
var authToken = '80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==';
var curTest = 0;
var proxyPort = options.proxy_port;
var keystonePort = url.parse(options.ks_url).port;
var echoServerPort = options.server_port;
var keystoneStarted = false;
var echoServerStarted = false;

authproxy.start(options);
nextTest();

/*
 * Runs the next test from the test data array.
 */
function nextTest() {
    var test, headers, httpOptions, cookieName, cookieVal, cookieFormatStr;
    var httpOptions, httpClient, cookieStr;

    test = testData[curTest];
    console.log('\nStarting test:', test.name);
    if (test.startKeystone && !keystoneStarted) {
        startKeystone();
        keystoneStarted = true;
    }
    if (test.startDestinationServer && !echoServerStarted) {
        startEchoServer();
        echoServerStarted = true;
    }

    headers = {
        upgrade: 'websocket',
        connection: 'upgrade',
        host: '54.215.172.65:8888', // any value will do
        origin: 'https://leb-ctos-devel.platform9.sys', // any value will do
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36'
    };

    if (test.cookieStr) {
        cookieStr = test.cookieStr.replace(/__ENCODED_AUTH_TOKEN__/g,
                                           encodeURIComponent(authToken));
        cookieStr = cookieStr.replace(/__UNENCODED_AUTH_TOKEN__/g, authToken);
        headers.cookie = cookieStr;
    }

    httpOptions = {
        host: 'localhost',
        port: proxyPort,
        path: '/stomp/websocket',
        headers: headers
    };

    httpClient = http.get(httpOptions, onHttpResponse);
    httpClient.on('end', onHttpClientEnd);
    httpClient.on('error', onHttpClientError);
    httpClient.on('upgrade', onHttpClientUpgrade);

    function onHttpResponse(response) {
        console.log('http response', response.statusCode);
        assert.equal(response.statusCode, test.status);
        finishTest();
    }

    function onHttpClientUpgrade(request, socket, head) {
        console.log('http client upgrade');
        socket.setEncoding('utf8');
        // Test echo service by sending the test name
        socket.write(test.name, 'utf8');
        socket.on('data', function onData(chunk) {
            console.log('Client received:', chunk);
            assert.equal(chunk, test.name);
            socket.end();
            finishTest();
        });
    }

    function onHttpClientEnd() {
        console.log('http client ended.');
    }

    function onHttpClientError() {
        console.error('http client error');
        assert.equal(test.expectConnectionError, true);
        finishTest();
    }

    function finishTest() {
        curTest++;
        if (curTest >= testData.length) {
            process.exit(0);
        }
        nextTest();
    }
}

/*
 * A mock Keystone implementation that emulates the /v2.0/tokens/xxx API
 */
function startKeystone() {
    var srv = http.createServer(onKeystoneRequest);
    srv.listen(keystonePort, 'localhost');
    console.log('Mock keystone listening on', keystonePort);
    function onKeystoneRequest(req, resp) {
        var admToken = req.headers['x-auth-token'];
        if (admToken != adminToken)
            return completeRequest(401, 'Unauthorized', 'no admin token');

        var items = url.parse(req.url).pathname.split('/');
        if (items.length != 4 || items[1] != 'v2.0' ||
            items[2] != 'tokens' || items[3] != authToken)
            return completeRequest(401, 'Unauthorized', 'invalid path or token');

        completeRequest(200, 'OK', 'OK');

        function completeRequest(status, msg, logMsg) {
            resp.writeHead(status, msg);
            resp.end();
            console.log('Mock keystone:', logMsg);
        }
    }
}

/*
 * A mock destination server that echoes back what it receives.
 */
function startEchoServer() {
    var srv = net.createServer(onRequest);
    srv.listen(echoServerPort);
    function onRequest(socket) {
        console.log('Echo server: incoming connection');
        var upgradeResponse = 'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n\r\n';
        // Initial response
        socket.write(upgradeResponse, 'utf8');
        // Then echo everything back
        socket.pipe(socket);
    }
}
