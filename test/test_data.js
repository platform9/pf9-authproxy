/**
 * Copyright (c) 2014 Platform Systems, Inc.
 */

module.exports = [
    {
        name: 'no cookie',
        noCookie: true,
        status: 401 // unauthorized
    },
    {
        name: 'bad cookie name',
        cookieName: 'foo',
        status: 400 // bad request
    },
    {
        name: 'keystone not running',
        status: 503 // service unavailable
    },
    {
        name: 'bad cookie value',
        startKeystone: true,
        cookieVal: '4472594523',
        status: 401 // unauthorized
    },
    {
        name: 'destination server not running',
        expectConnectionError: true
    },
    {
        name: 'token with spaces',
        cookieFormatStr: '%s=%s ',
        startDestinationServer: true
    },
    {
        name: 'final test, have a nice day!'
    }
];
