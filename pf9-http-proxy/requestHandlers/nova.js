/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var crypto = require('crypto');
var moment = require('moment');
var logger = require('../log.js');
var logManager = require('../logManager.js');
var cfg = require('../configParser.js');
var request = require('request');

var novaTarget = cfg.get('nova:url');

/**
 * Creates and passes a Json object with logging information for nova power on and power off requests to logManager for logging.
 * @param {http.IncomingMessage} req - the incoming HTTP request
 * @param {http.ServerResponse} res - the outgoing HTTP response
 */

function start(req, res) {

    logger.info("Incoming request : %s", req.url);
    logger.debug("Headers : ", req.headers);

    var now = moment();
    var url = novaTarget + req.url;
    var dataArray = [];
    var data;

    req.on('data', function(chunk) {
            dataArray.push(chunk);
    });

    req.on('end', function() {

        var httpClient;
        data = Buffer.concat(dataArray);
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

        function onResponse(error, response, body) {
            if (!error) {
                res.writeHead(response.statusCode, response.headers);
                if(body) {
                    res.write(body);
                }
            } else {
                res.writeHead(503);
            }
            res.end();
        }

        if (req.url.indexOf("/action") > -1) {
            try {
                var obj = JSON.parse(data);
                if (obj != null) {
                    var eventType;
                    if('os-start' in obj) {
                        eventType = "Power On";
                    } else if ('os-stop' in obj) {
                        eventType = "Power Off";
                    } else {
                        eventType = "-";
                    }

                    var splitUrl = req.url.split("/");

                    var eventDetails = {
                        eventType: eventType,
                        username: "-",
                        sessionHash: crypto.createHash('md5').update(req.headers["x-auth-token"]).digest("hex"),
                        timestamp: now.format('YYYY-MM-DD HH:mm:ss Z'),
                        typeofUser: "-",
                        instanceHash: crypto.createHash('md5').update(splitUrl[4]).digest("hex")
                    }

                    logManager.logEvent(eventDetails);
                    logger.debug("Event " + JSON.stringify(eventDetails) + " sent to logManager for logging");
                }
            } catch(e) {
                logger.error(e.stack);
            }
        }
    });
}

exports.start = start;
