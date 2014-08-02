/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var cfg = require('../configParser.js');
var logger = require('../log.js');
var request = require('request');

var glanceTarget = cfg.get('glance:url')

/**
 * passes the request to glance server
 * @param {http.IncomingMessage} request - the incoming HTTP request
 * @param {http.ServerResponse} response - the outgoing HTTP response
 */

function start(req, res) {

    logger.info("Incoming request : %s", req.url);
    logger.debug("Headers : ", req.headers);

    var url = glanceTarget + req.url;
    var dataArray = [];

    req.on('data', function(chunk) {
            dataArray.push(chunk);
    });

    req.on('end', function() {
        var httpClient;
        var data = Buffer.concat(dataArray, dataArray.length);

        if (req.method == 'POST') {
            httpClient = request({
                method: req.method,
                headers: req.headers,
                uri: url,
                body: data
            }, onResponse);
        } else {
            httpClient = request({
                method: req.method,
                headers: req.headers,
                uri: url
            }, onResponse);
        }

        httpClient.on('error', function() {
            try {
                res.writeHead(503, {'Content-Type': 'text/plain'});
            } catch (e) {
                logger.error(e.stack);
            }
            res.end();
        });

        function onResponse(error, response, body) {
            if (!error) {
                res.writeHead(response.statusCode, { 'Content-Type': 'text/plain' });
                if(body) {
                    res.write(body);
                }
            } else {
                res.writeHead(503, {'Content-Type': 'text/plain'});
            }
            res.end();
        }
    });
}

exports.start = start;
