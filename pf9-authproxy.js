#!/usr/bin/node

/**
 * Copyright (c) 2014 Platform9 Systems, Inc.
 */

'use strict';

var authproxy = require('./authproxy.js');
var parser = authproxy.getOptionsParser();
var options = parser.parse();

authproxy.start(options);

