/**
 * @module util/config
 */

'use strict';

var fs = require("fs");
var log = require("./log");
var extend = require("extend");

var defaults = {
  "reportDir": "givenjs-report",
  "logLevel": "INFO"
};

var config = null;

var CONFIG_FILE = "givenjs.json";

function readConfig() {
  config = Object.create(defaults);

  var fileConfig;
  try {
    fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (e) {
    log.warn("Could not open config file '" + CONFIG_FILE + "'. " + e);
  }

  if (fileConfig) {
    extend(config, fileConfig);
    log.setLogLevel(config.logLevel);
    log.debug("Opened config file: " + JSON.stringify(fileConfig));
  } else {
    log.setLogLevel(config.logLevel);
  }
}

/**
 * Gets the config
 * @returns {*}
 */
module.exports = function getConfig() {
  if (config === null) {
    readConfig();
  }
  return config;
};
