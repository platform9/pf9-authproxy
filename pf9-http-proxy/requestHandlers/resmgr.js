/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var crypto = require('crypto');
var moment = require('moment');
var logger = require('../log.js');
var logManager = require('../logManager.js');
var cfg = require('../configParser.js');
var requestHandler = require('./requestHandler.js');

var resmgrTarget = cfg.get('resmgr:url');

/**
 * Creates and passes a Json object with logging information for host addition and removal requests to logManager for logging.
 * @param {http.IncomingMessage} req - the incoming HTTP request
 * @param {http.ServerResponse} res - the outgoing HTTP response
 */

function start(req, res) {

    logger.info("Incoming request : %s", req.url);
    logger.debug("Headers : ", req.headers);

    var url = resmgrTarget + req.url;
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

        if (req.method == "PUT" || req.method == "DELETE") {
            try {
                var eventType;
                if ((req.url.indexOf("/roles/pf9-ostackhost") > -1 || req.url.indexOf("/roles/pf9-imagelibrary") > -1) && req.method == "PUT"){
                    eventType = "Role Authorization/Upgrade";
                } else if ((req.url.indexOf("/roles/pf9-ostackhost") > -1 || req.url.indexOf("/roles/pf9-imagelibrary") > -1) && req.method == "DELETE"){
                    eventType = "Role Deletion";
                } else if (req.url.indexOf("v1/hosts") > -1 && req.method == 'DELETE') {
                    eventType = "Host Removal";
                }

                var splitUrl = req.url.split("/");
                var now = moment();

                var eventDetails = {
                    eventType: eventType,
                    username: "-",
                    sessionHash: crypto.createHash('md5').update(req.headers["x-auth-token"]).digest("hex"),
                    timestamp: now.format('YYYY-MM-DD HH:mm:ss Z'),
                    typeofUser: "-",
                    instanceHash: crypto.createHash('md5').update(splitUrl[3]).digest("hex")
                }

                logManager.logEvent(eventDetails);
                logger.debug("Event " + JSON.stringify(eventDetails) + " sent to logManager for logging");
            } catch(e) {
                logger.error(e.stack);
            }
        }
    });
}

exports.start = start;
