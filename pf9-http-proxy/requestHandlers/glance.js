/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var cfg = require('../configParser.js');
var logger = require('../log.js');
var requestHandler = require('./requestHandler.js');

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

        var data = Buffer.concat(dataArray);
        requestHandler.forwardRequest(req, data, url, onResponse);

        function onResponse(error, response, body) {
            requestHandler.finishResponse(error, response, body, res);
        }
    });
}

exports.start = start;
