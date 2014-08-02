#!/usr/bin/node

/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var server = require('./server');
var router = require('./router');
var keystone = require('./requestHandlers/keystone.js');
var nova = require('./requestHandlers/nova.js');
var resmgr = require('./requestHandlers/resmgr.js');
var glance = require('./requestHandlers/glance.js');

var handlerMap = {
    keystone: keystone.start,
    nova: nova.start,
    resmgr: resmgr.start,
    glance: glance.start
}

server.start(router.route, handlerMap);
