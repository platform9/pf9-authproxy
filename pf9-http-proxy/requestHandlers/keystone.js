/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var crypto = require('crypto');
var moment = require('moment');
var logger = require('../log.js');
var logManager = require('../logManager.js');
var cfg = require('../configParser.js');
var request = require('request');
var EventEmitter = require('events').EventEmitter;

var newLogEvent = new EventEmitter();
var now = moment();
var keystoneTarget = cfg.get('keystone:url');

/**
 * Creates and passes a Json object with logging information for keystone login requests to logManager for logging.
 * @param {http.IncomingMessage} req - the incoming HTTP request
 * @param {http.ServerResponse} res - the outgoing HTTP response
 */

function start(req, res) {

    logger.info("Incoming request : %s", req.url);
    logger.debug("Headers : ", req.headers);

    var url = keystoneTarget + req.url;
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

        function onResponse (error, response, body) {
            newLogEvent.once('newRequest', function(error, response, body) {
                try {
                    var obj = JSON.parse(body);
                    if (obj != null){
                        if ('access' in obj) {
                            var eventDetails = {
                                eventType: "Session Start",
                                username: obj.access.user.username,
                                sessionHash: crypto.createHash('md5').update(obj.access.token.id).digest("hex"),
                                timestamp: now.format('YYYY-MM-DD HH:mm:ss Z'),
                                typeofUser: obj.access.metadata.is_admin? 'admin' : 'member',
                                instanceHash: "-"
                            }

                            logManager.logEvent(eventDetails);
                            logger.debug("Event " + JSON.stringify(eventDetails) + " sent to logManager for logging");
                        }
                    }
                } catch (e) {
                    logger.error(e.stack);
                }
            });

            if (!error) {
                newLogEvent.emit('newRequest', error, response, body);
                res.writeHead(response.statusCode, { 'Content-Type': 'text/plain' });
                res.write(body);
            } else {
                res.writeHead(503, {'Content-Type': 'text/plain'});
            }
            res.end();
        }
    });
}

exports.start = start;
