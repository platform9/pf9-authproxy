/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var http = require('http');
var logger = require('./log.js');
var cfg = require('./configParser.js');

/**
 * splits the pathname from URL and sends the incoming request to router to route
 * @param {router.js} route - the function to be called in router.js
 * @param {Associative array} handlerMap - the list of routes available for the incoming request
 */

function start(route, handlerMap) {
    function requestListener(request, response) {
        var svcname = request.url.split("/")[1];
        request.url = request.url.replace("/" + svcname, "");
        route(svcname, handlerMap, request, response);
    }

    http.createServer(requestListener).listen(cfg.get('default:port'));
    logger.info('Server is up and listening for requests.');
}

exports.start = start;
