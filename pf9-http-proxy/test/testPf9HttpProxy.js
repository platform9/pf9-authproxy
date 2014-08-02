/**
 * Copyright (c) 2014 Platform Systems, Inc.
 */

var http = require('http');
var responseData = require('./responseData.js');
var assert = require('assert');
var request = require('request');
var cfg = require('../configParser.js');
var testFile = cfg.get('test:testData');
var testData = require(testFile);
var fs = require('fs');
var stdio = require('stdio');

var ops = stdio.getopt({
    'testStartingIndex': {key: 's', args: 1, description: 'Marks the stating index of the test to be conducted'},
    'testEndingIndex': {key: 'e', args: 1, description: 'Marks the ending index of the test to be conducted'}
});

var currentTest = ops.testStartingIndex;

setTimeout( function() {
    nextTest();
}, 2000);

function nextTest() {

    var test = testData[currentTest];
    console.log("Starting test : " + test.name);
    fs.truncate(cfg.get('events:outputFilePath'), 0, function(){});

    var httpClient;
    if (currentTest == cfg.get('test:serverOn')) {
        startServers();
    }

    if(test.method == 'GET') {
        httpClient = request.get(test.url, onHttpResponse);
    } else if (test.method == 'PUT') {
        httpClient = request.put({
            headers: test.headers,
            uri: test.url
        }, onHttpResponse);
    } else if (test.method == 'DELETE') {
        httpClient = request.del({
            headers: test.headers,
            uri: test.url
        }, onHttpResponse);
    } else if (test.method == 'POST') {
        headers = test.headers;
        headers["content-length"] = test.data.length;
        httpClient = request.post({
            headers: headers,
            uri: test.url,
            body: test.data
        }, onHttpResponse);
    }

    httpClient.on('error', function() {
        console.log("http client error");
        finishTest();
    });

    function onHttpResponse(error, response, body) {
        setTimeout(function() {
            if (!error) {
                if (response.statusCode == 200) {

                    assert.equal(response.statusCode, test.statusCode);

                    fs.readFile(cfg.get('events:outputFilePath'), 'utf8', function(err, data) {
                        if (!err) {
                            try {
                                data = JSON.parse(data);
                                assert.equal(data.eventType, test.eventType);
                            } catch (e) {
                                assert(test.unexpectedInputError, true);
                            }
                        }
                        finishTest();
                    });
                } else {
                    assert.equal(response.statusCode, test.statusCode);
                    finishTest();
                }
            } else {
                console.log(error.stack);
            }
        }, 2000);
    }

    function finishTest() {
        currentTest++;
        if (currentTest > ops.testEndingIndex) {
            process.exit(0);
        }
        nextTest();
    }
}

function startServers() {

    // mock keystone server
    http.createServer(function (request, response) {

        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(JSON.stringify(responseData[0]));
        response.end();

    }).listen(5003);

    // mock nova server
    http.createServer(function (request, response) {

        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end();

    }).listen(8777);

    // mock resmgr server
    http.createServer(function (request, response) {

        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end();

    }).listen(8086);

    http.createServer(function (request, response) {

        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end();

    }).listen(5004);
}
