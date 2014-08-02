/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

var nconf = require('nconf');

// Reading configuration file
var cfg = nconf.file({ file: '/etc/pf9/pf9HttpProxyConfig.json' });

module.exports = cfg;
