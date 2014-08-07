/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

module.exports = [
    {
        method: 'GET',
        name: 'Session Start (keystone login) event test',
        statusCode: 200,
        eventType: 'Session Start',
        url: 'http://localhost:9637/keystone/v2.0/tokens'
    },
    {
        method: 'PUT',
        name: 'Role Authorization/Upgrade event test',
        statusCode: 200,
        eventType: 'Role Authorization/Upgrade',
        url: 'http://localhost:9637/resmgr/v1/hosts/2f1467b7-f2bd-429e-b2b7-f472b197cdf8/roles/pf9-ostackhost',
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'DELETE',
        name: 'Host Removal event test',
        statusCode: 200,
        eventType: 'Host Removal',
        url: 'http://localhost:9637/resmgr/v1/hosts/2f1467b7-f2bd-429e-b2b7-f472b197cdf8',
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'DELETE',
        name: 'Role Deletion event test',
        statusCode: 200,
        eventType: 'Role Deletion',
        url: 'http://localhost:9637/resmgr/v1/hosts/2f1467b7-f2bd-429e-b2b7-f472b197cdf8/roles/pf9-ostackhost',
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'POST',
        name: 'Power On event test',
        statusCode: 200,
        eventType: 'Power On',
        url: 'http://localhost:9637/nova/v2/40434fca69574e3c84125e808620528c/servers/db90e7ff-a380-455d-abc9-c92443a68437/action',
        data: '{"os-start" : null}',
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'POST',
        name: 'Power Off event test',
        statusCode: 200,
        eventType: 'Power Off',
        url: 'http://localhost:9637/nova/v2/40434fca69574e3c84125e808620528c/servers/db90e7ff-a380-455d-abc9-c92443a68437/action',
        data: '{"os-stop" : null}',
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'POST',
        name: 'Request Body JSON not properly formulated',
        statusCode: 200,
        url: 'http://localhost:9637/nova/v2/40434fca69574e3c84125e808620528c/servers/db90e7ff-a380-455d-abc9-c92443a68437/action',
        data: '"os-stop" : null',
        unexpectedInputError: true,
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'GET',
        name: 'Random request',
        statusCode: 200,
        url: 'http://localhost:9637/nova/v2/40434fca69574e3c84125e808620528c/os-networks',
        unexpectedInputError: true
    },
    {
        method: 'PUT',
        name: 'Header not formulated properly',
        statusCode: 200,
        eventType: 'Host Addition',
        url: 'http://localhost:9637/resmgr/v1/hosts/2f1467b7-f2bd-429e-b2b7-f472b197cdf8/roles/pf9-ostackhost',
        headers: { },
        unexpectedInputError: true
    },
    {
        method: 'POST',
        name: 'Incorrect Data Buffer',
        statusCode: 200,
        url: 'http://localhost:9637/nova/v2/40434fca69574e3c84125e808620528c/servers/db90e7ff-a380-455d-abc9-c92443a68437/action',
        data: '',
        unexpectedInputError: true,
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'GET',
        name: 'Keystone Not listening',
        statusCode: 503,
        url: 'http://localhost:9637/keystone/v2.0/tokens'
    },
    {
        method: 'PUT',
        name: 'Resmgr not listening',
        statusCode: 503,
        url: 'http://localhost:9637/resmgr/v1/hosts/2f1467b7-f2bd-429e-b2b7-f472b197cdf8/roles/pf9-ostackhost',
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'POST',
        name: 'Nova Not listening',
        statusCode: 503,
        url: 'http://localhost:9637/nova/v2/40434fca69574e3c84125e808620528c/servers/db90e7ff-a380-455d-abc9-c92443a68437/action',
        data: '{"os-start" : null}',
        headers: { "X-Auth-Token":"80dfa90ga80fgd879fgsd789hfsd978fgad78gf9s==" }
    },
    {
        method: 'GET',
        name: 'Mixpanel Token not present',
        statusCode: 200,
        url: 'http://localhost:9637/keystone/v2.0/tokens',
        unexpectedInputError: true
    },
    {
        method: 'GET',
        name: 'Session Start (Bad Response from keystone server)',
        statusCode: 500,
        url: 'http://localhost:9637/keystone/v2.0/tokens',
        unexpectedInputError: true
    }
];
