/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

module.exports = [
    {
        name: 'no cookie',
        status: 401 // unauthorized
    },
    {
        name: 'bad cookie name',
        cookieStr: 'foo=bar',
        status: 401 // bad request
    },
    {
        name: 'keystone not running',
        cookieStr: 'authToken=__ENCODED_AUTH_TOKEN__',
        status: 503 // service unavailable
    },
    {
        name: 'bad cookie value',
        startKeystone: true,
        cookieStr: 'authToken=4472594523',
        status: 401 // unauthorized
    },
    {
        name: 'destination server not running',
        cookieStr: 'authToken=__ENCODED_AUTH_TOKEN__',
        expectConnectionError: true
    },
    {
        name: 'multiple cookies and spaces',
        cookieStr: ' foo=bar;  authToken=__ENCODED_AUTH_TOKEN__; xx=yy',
        startDestinationServer: true
    },
    {
        name: 'trailing semicolon',
        cookieStr: 'authToken=__ENCODED_AUTH_TOKEN__; xx=yy;'
    },
    {
        name: 'unencoded token',
        cookieStr: 'foo=bar; authToken=__UNENCODED_AUTH_TOKEN__; xx=yy'
    },
    {
        name: 'unencoded token (2)',
        cookieStr: 'authToken=__UNENCODED_AUTH_TOKEN__'
    },
    {
        name: 'final test, have a nice day!',
        cookieStr: 'authToken=__ENCODED_AUTH_TOKEN__; xx=yy'
    }
];
