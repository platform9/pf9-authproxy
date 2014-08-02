/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var logger = require('./log.js');

/**
 * routes the request to respective functions based on the pathname
 * @param {string} svcname - the svcname to identify the route (keystone/nova/glance/resmgr)
 * @param {Associative array} handlerMap - the list of routes available for the incoming request
 * @param {http.IncomingMessage} request - the incoming HTTP request
 * @param {http.ServerResponse} response - the outgoing HTTP response
 */

function route(svcname, handlerMap, request, response) {

    if (typeof handlerMap[svcname] === 'function') {
        logger.debug("New Request : %s", request.url);
        handlerMap[svcname](request, response);
    } else {
        logger.warn("No request handler for %s", request.url);
    }
}

exports.route = route;
