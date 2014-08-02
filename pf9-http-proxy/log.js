/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var log4js = require('log4js');
var cfg = require('./configParser.js');

// logger to keep system logs
log4js.configure({
    appenders: [
    { type: 'file', filename: cfg.get('log:logPath'), category: 'http-proxy' }
    ]
});

var logger = log4js.getLogger('http-proxy');
logger.setLevel(cfg.get('log:logLevel'));

module.exports = logger;
