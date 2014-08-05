/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var request = require('request');

/**
 * forwards the req to the the designated server specified by the url
 * @param {http.IncomingMessage} req - the incoming HTTP request
 * @param {Buffer} data - the payload in the incoming request
 * @param {String} url - the url of the designated server
 * @param {function} onResponse - the callback function for the response and error from the server
 */

function forwardRequest(req, data, url, onResponse) {

    if (req.method == 'POST') {
        request( {
            method: req.method,
            headers: req.headers,
            uri: url,
            body: data
        }, onResponse);
    } else {
        request({
            method: req.method,
            headers: req.headers,
            uri: url
        }, onResponse);
    }
}

/**
 * forwards the remote servers response to the client
 * @param {object} error - the error received from the server (if produced)
 * @param {http.ServerResponse} response - the incoming HTTP response from the servers
 * @param {Buffer} body - the payload of the response
 * @param {http.ServerResponse} res - the outgoing HTTP response
 */

function finishResponse(error, response, body, res) {
    if (!error) {
        res.writeHead(response.statusCode, response.headers);
        if (body) {
            res.write(body);
        }
    } else {
        res.writeHead(503);
    }
    res.end();
}

exports.forwardRequest = forwardRequest;
exports.finishResponse = finishResponse;
