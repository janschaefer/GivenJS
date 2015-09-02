'use strict';

var fs = require("fs");
var log = require("./log");
var extend = require("extend");

var defaults = {
    "reportDir": "givenjs-report",
    "logLevel": "INFO"
}

var config = Object.create( defaults );

var CONFIG_FILE = "givenjs.json";

var fileConfig;
try {
    fileConfig = JSON.parse(fs.readFileSync( CONFIG_FILE, "utf8"));
} catch (e) {
    log.warn("Could not open config file '"+ CONFIG_FILE + "'. "+e);
}

if (fileConfig) {
    extend(config, fileConfig);
    log.setLogLevel( config.logLevel );
    log.debug("Opened config file: " + JSON.stringify(fileConfig));
} else {
    log.setLogLevel( config.logLevel );
}

module.exports = config;
