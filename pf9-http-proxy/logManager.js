/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var fs =  require('fs'),
    ini = require('ini');
var Mixpanel = require('mixpanel');
var logger = require('./log.js');
var cfg = require('./configParser.js');

var logTarget = cfg.get('events:logTarget');
var outputFile = cfg.get('events:outputFilePath');

if (logTarget == "mixpanel") {

    var mixpanelProjectToken = cfg.get('events:mixpanelProjectToken');
    if (mixpanelProjectToken){
        var mixpanel = Mixpanel.init(mixpanelProjectToken);
        logger.debug("Mixpanel Token Successfully read.");
    } else {
        logger.error("Unable to read Mixpanel Project Token.");
    }
    exports.logEvent = mixpanelLogEvent;

} else if (logTarget == "file") {

    var outputFile = cfg.get('events:outputFilePath');
    if(outputFile) {
        logger.debug("Path to Output file successfully read");
    } else {
        logger.error("Unable to read Output file");
    }
    exports.logEvent = fileLogEvent;

} else {
    logger.warn("Invalid option for LOG_TARGET. Check configuration.");
}

var config = ini.parse(fs.readFileSync(cfg.get('global:path'), 'utf-8'));
var customerName = config.DEFAULT.CUSTOMER_SHORTNAME;

/**
 * Logs an event into mixpanel
 * @param {JSON} eventDetails - the JSON object containing logging information
 */

function mixpanelLogEvent(eventDetails) {

    try {
        mixpanel.track(eventDetails.eventType, {
            distinct_id : customerName,
            Customer_Account_Name : customerName,
            Customer_User_Name : eventDetails.username,
            Session_Hash : eventDetails.sessionHash,
            Type_of_User : eventDetails.typeofUser,
            Timestamp : eventDetails.timestamp,
            Instance_Hash : eventDetails.instanceHash,
            Role_Name: eventDetails.roleName
        }, mixpanelCallback);

        logger.debug("Event " + JSON.stringify(eventDetails) + " successfully logged into mixpanel");
    } catch (e) {
        logger.error(e.stack);
    }

    function mixpanelCallback(e) {
        if (e) {
            logger.info(e);
        }
    }
}

/**
 * Writes an event into a file
 * @param {JSON} eventDetails - the JSON object containing logging information
 */

function fileLogEvent(eventDetails) {

    var strEventDetails = JSON.stringify(eventDetails);
    logger.debug("Event " + strEventDetails + " received ");
    fs.appendFile(outputFile, strEventDetails + "\n", function(err) {
        if(err) {
            logger.error(err.stack);
        } else {
            logger.debug("Event " + strEventDetails + " successfully written into file");
        }
    });
}
